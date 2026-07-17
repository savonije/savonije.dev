<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'

type GridControls = {
  start: () => void
  stop: () => void
  destroy: () => void
}

const canvas = ref<HTMLCanvasElement | null>(null)
const playing = ref(true)
let controls: GridControls | null = null

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

const initGrid = (cv: HTMLCanvasElement): GridControls | null => {
  const ctx = cv.getContext('2d')
  if (!ctx) {
    return null
  }
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  let w = 0
  let h = 0
  let frame = 0

  const acc: [number, number, number] = [255, 59, 59] // #ff3b3b
  let t = 0
  let last = 0
  const fov = 300
  const wide = 20
  const depth = 30
  const wave = (X: number, Z: number) =>
    Math.sin(X * 0.4 + t) * 10 + Math.cos(Z * 0.32 - t * 0.9) * 12

  const draw = () => {
    const [r, g, b] = acc
    const cx = w / 2
    const horizon = h * 0.52
    const proj = (X: number, Y: number, Z: number) => {
      const s = fov / Z
      return { x: cx + X * s, y: horizon + (70 - Y) * s }
    }

    ctx.fillStyle = '#08080a'
    ctx.fillRect(0, 0, w, h)
    const scroll = (t * 2) % 4

    // depth lines (constant X)
    for (let xi = -wide; xi <= wide; xi++) {
      ctx.beginPath()
      let started = false
      for (let zi = 0; zi <= depth; zi++) {
        const Z = zi * 4 + 4 - scroll
        if (Z <= 3) {
          continue
        }
        const X = xi * 4
        const p = proj(X, wave(X, Z), Z)
        started ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)
        started = true
      }
      ctx.strokeStyle = `rgba(${r},${g},${b},0.16)`
      ctx.lineWidth = 1
      ctx.stroke()
    }

    // horizon rows (constant Z) — brighter/redder near
    for (let zi = 0; zi <= depth; zi++) {
      const Z = zi * 4 + 4 - scroll
      if (Z <= 3) {
        continue
      }
      ctx.beginPath()
      for (let xi = -wide; xi <= wide; xi++) {
        const X = xi * 4
        const p = proj(X, wave(X, Z), Z)
        xi === -wide ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)
      }
      const near = Math.max(0, 1 - Z / (depth * 4))
      ctx.strokeStyle = `rgba(${r},${g},${b},${0.1 + near * 0.7})`
      ctx.lineWidth = 0.6 + near * 1.6
      ctx.stroke()
    }
  }

  const resize = () => {
    w = cv.clientWidth
    h = cv.clientHeight
    cv.width = w * dpr
    cv.height = h * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'
    // Resizing clears the canvas, so repaint the current frame immediately.
    draw()
  }
  resize()
  window.addEventListener('resize', resize)

  const loop = (now: number) => {
    if (last === 0) {
      last = now
    }

    let dt = (now - last) / 1000
    last = now

    if (dt > 0.05) {
      dt = 0.05
    }

    t += dt * 2.7
    draw()
    frame = requestAnimationFrame(loop)
  }

  const start = () => {
    if (frame !== 0) {
      return
    }
    last = 0
    frame = requestAnimationFrame(loop)
  }

  const stop = () => {
    if (frame !== 0) {
      cancelAnimationFrame(frame)
      frame = 0
    }
  }

  const destroy = () => {
    stop()
    window.removeEventListener('resize', resize)
  }

  return { start, stop, destroy }
}

const setPlaying = (next: boolean) => {
  playing.value = next
  if (controls == null) {
    return
  }
  next ? controls.start() : controls.stop()
}

const toggle = () => setPlaying(!playing.value)

// Pause whenever the user turns on the OS "reduce motion" setting.
const onReducedMotionChange = (e: MediaQueryListEvent) => {
  if (e.matches) {
    setPlaying(false)
  }
}

onMounted(() => {
  if (reducedMotion.matches) {
    playing.value = false
  }
  reducedMotion.addEventListener('change', onReducedMotionChange)
  if (canvas.value != null) {
    controls = initGrid(canvas.value)
    if (controls != null && playing.value) {
      controls.start()
    }
  }
})

onBeforeUnmount(() => {
  reducedMotion.removeEventListener('change', onReducedMotionChange)
  if (controls != null) {
    controls.destroy()
  }
})
</script>

<template>
  <section class="fixed inset-0 z-0 overflow-hidden bg-ink">
    <canvas ref="canvas" class="absolute inset-0 z-10 size-full" />
    <div class="hero-vignette pointer-events-none absolute inset-0 z-20" aria-hidden="true" />
    <div
      class="hero-scanlines pointer-events-none absolute inset-0 z-30 opacity-55 mix-blend-multiply"
      aria-hidden="true"
    />

    <button
      type="button"
      :aria-pressed="!playing"
      :aria-label="playing ? 'Pauzeer animatie' : 'Speel animatie af'"
      class="absolute right-[clamp(20px,4vw,44px)] top-[clamp(20px,4vw,44px)] z-50 flex size-7 items-center justify-center rounded-full font-mono text-[10px] text-fog-dim transition duration-200 hover:text-fog-soft focus-visible:text-fog-soft"
      @click="toggle"
    >
      <span aria-hidden="true">{{ playing ? '❚❚' : '▶' }}</span>
    </button>

    <div
      class="animate-hero-in absolute inset-0 z-40 flex flex-col items-start justify-end p-[clamp(28px,6vw,88px)] text-left font-display"
    >
      <div class="mb-3 font-mono text-sm uppercase tracking-[4px] text-fog-dim">
        Hallo &mdash; welkom
      </div>
      <h1
        class="text-[clamp(52px,9vw,88px)] font-bold leading-none tracking-[-2.5px] text-fog text-shadow-glow"
      >
        Kevin<br />Savonije
      </h1>
      <div class="mt-5 font-mono text-base uppercase tracking-[5px] text-accent-bright">
        Front-end Developer
      </div>
      <p class="mb-10 mt-7 max-w-md text-lg leading-relaxed text-fog-muted">
        Leuk dat je langskomt. Ik ben een front-end developer uit Goes en bouw snelle, verzorgde
        webervaringen met veel oog voor de kleine details. Momenteel werk ik bij
        <a
          class="text-accent-bright no-underline hover:text-accent-soft"
          href="https://www.23g.nl"
          target="_blank"
        >
          23G
        </a>
        . Altijd in voor een gesprek &mdash; neem gerust contact op.
      </p>
      <div class="flex flex-wrap gap-3.5">
        <a
          class="rounded-xl bg-accent px-6 py-3.5 font-mono text-sm font-medium tracking-btn text-ink no-underline transition duration-200 hover:bg-accent-bright hover:shadow-[0_0_26px_rgba(255,60,60,0.5)]"
          href="mailto:kevinsavonije@gmail.com"
        >
          Zeg hallo &rarr;
        </a>
        <a
          class="rounded-xl border border-accent-bright/40 px-6 py-3.5 font-mono text-sm font-medium tracking-btn text-fog-soft no-underline transition duration-200 hover:border-accent-bright hover:bg-accent/8 hover:text-white"
          href="https://www.linkedin.com/in/kevinsavonije/"
          target="_blank"
        >
          LinkedIn
        </a>
        <a
          class="rounded-xl border border-accent-bright/40 px-6 py-3.5 font-mono text-sm font-medium tracking-btn text-fog-soft no-underline transition duration-200 hover:border-accent-bright hover:bg-accent/8 hover:text-white"
          href="https://github.com/savonije"
          target="_blank"
        >
          GitHub
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Complex overlay gradients — no Tailwind utility equivalent. */
.hero-vignette {
  background: linear-gradient(
    105deg,
    rgba(5, 5, 6, 0.85) 0%,
    rgba(5, 5, 6, 0.5) 40%,
    rgba(5, 5, 6, 0) 75%
  );
}
.hero-scanlines {
  background: repeating-linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0,
    rgba(0, 0, 0, 0) 2px,
    rgba(0, 0, 0, 0.22) 3px,
    rgba(0, 0, 0, 0) 4px
  );
}
</style>
