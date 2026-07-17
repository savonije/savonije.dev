---
name: tailwind
description: >-
    Use whenever writing or editing Tailwind utility classes in this repo's .vue or
    .css files. This is a Tailwind v4 project (config lives in CSS, there is no
    tailwind.config file) — the theme is defined in an `@theme` block in
    src/assets/main.css. Enforces using the project's EXISTING theme tokens (the
    ink/accent/fog palette, the display + mono fonts) and the standard utility scale
    instead of inventing arbitrary values or hardcoding hex. Don't assume or make up
    tokens: look them up in src/assets/main.css or add them to the `@theme` block.
---

# Tailwind conventions for this project

**Golden rule: use the theme tokens and the utility scale. Don't invent, assume, or
hardcode values.** The point of the scale and the `@theme` tokens is consistency —
reach for them first, every time.

## Setup facts (don't re-derive)

- **Tailwind v4**, integrated via the `@tailwindcss/vite` plugin (see `vite.config.ts`).
  There is **no `tailwind.config.*` file and no PostCSS config** — don't create one.
- **The config lives in CSS, not JS.** Tailwind is imported with `@import 'tailwindcss'`
  at the top of **`src/assets/main.css`**, and the theme lives in an **`@theme { … }`**
  block in that same file. `main.css` is imported once from `src/main.ts`.
- **No class prefix.** Use plain utilities (`flex`, `text-sm`, `bg-ink`).
- **Vue 3 SPA on Vite** (`@vitejs/plugin-vue`), with `vue-router`. Templates are `.vue`
  single-file components under `src/views/` and `src/components/`. There is **no dark-mode
  toggle** — the site is a single dark theme (see §6).
- **Alias:** `@` → `src` (defined in `vite.config.ts`). Import with `@/...`, e.g.
  `@/views/HomeView.vue`.
- **Web fonts load in `index.html`**, not from CSS or JS. The `<head>` has the
  `preconnect` hints plus the Google Fonts `<link>` for Space Grotesk + JetBrains Mono.
  If you add a font, wire the `<link>` there and add the `--font-*` token in `@theme` —
  don't inject `<link>` elements at runtime.
- **Prettier** (`.prettierrc.json`): **2-space indent**, single quotes, **no semicolons**,
  `printWidth: 100`, no trailing commas. **There is NO `prettier-plugin-tailwindcss`** —
  class lists are **not** auto-sorted, so order them sensibly by hand (layout → box →
  color → typography → state) and keep it readable.
- **Follow the global JS/Vue rules from `~/.claude/CLAUDE.md`:** prefer arrow functions;
  destructure `defineProps` (`const { foo } = defineProps<…>()`, reference `foo` directly).
- **npm scripts:** `npm run format` (prettier `--write src/`), `npm run lint`
  (eslint `--fix`), `npm run type-check` (`vue-tsc`), and `npm run build` (runs type-check
  **and** the Vite build — this is what confirms the CSS compiles). ESLint runs a flat
  config with `@typescript-eslint/strict-boolean-expressions` on, so write explicit
  boolean checks (`if (x != null)`, not `if (x)` on a nullable).

## 1. Use scale utilities, not arbitrary px

Prefer the scale step over an arbitrary bracket value:

```html
<!-- ✅ use the scale -->
class="px-6 py-3.5 gap-3.5 text-sm rounded-lg mb-9 z-40"

<!-- ❌ don't invent magic numbers -->
class="px-[24px] py-[14px] text-[14px] rounded-[8px] mb-[36px] z-[40]"
```

This applies to spacing (`p/m/gap/space`), sizing (`w/h/size/min/max`), `text-*`,
`rounded-*`, `leading-*`, `tracking-*`, `z-*`, insets, etc.

**Arbitrary `[…]` values are a real tool here, but a deliberate one.** The hero
(`HomeView.vue`) is a design-heavy landing surface and legitimately uses several —
fluid type/padding (`text-[clamp(52px,9vw,88px)]`, `p-[clamp(28px,6vw,88px)]`),
off-scale sizes (`text-[15px]`, `max-w-[460px]`, `rounded-[10px]`), px letter-spacing
(`tracking-[4px]`, `tracking-[-2.5px]`), and arbitrary properties/shadows
(`[text-shadow:0_0_40px_rgba(255,60,60,0.25)]`, `shadow-[0_0_26px_rgba(255,60,60,0.5)]`).
That's fine **when no scale step or token fits**. It is not a license to reach for
`[…]` before checking the scale — most spacing, radius, and z-index needs map cleanly
onto the standard scale, so use it there.

**Watch for arbitrary values that just re-spell a token or scale step:** `text-[#ff3b3b]`
is `text-accent`; `bg-[#08080a]` is `bg-ink`; `z-[40]` is `z-40`; `gap-[14px]` is `gap-3.5`.

## 2. Use the project's theme tokens, not raw hex / one-off values

Custom tokens live in the `@theme` block of `src/assets/main.css`. Always use the named
utility they generate — and **never hardcode the palette's hex** when a token exists:

```html
<!-- ✅ -->
class="bg-ink text-fog font-mono text-accent-bright hover:text-accent-soft"
<!-- ❌ -->
class="bg-[#08080a] text-[#f4f4f7] text-[#ff5a5a] hover:text-[#ff8a8a]"
```

Currently defined custom tokens (confirm against `src/assets/main.css` before use):

- **Fonts** — use the `font-*` utility, **never** `font-family: var(--font-*)` in raw CSS:
  - `font-display` → **Space Grotesk** (headings, body copy; `body` defaults to it).
  - `font-mono` → **JetBrains Mono** (labels, kickers, buttons — the uppercase mono bits).
- **Ink & fog palette (dark theme):**
  - `ink` (#08080a) — page + hero background (`bg-ink`); also the near-black text used
    **on** the accent button (`text-ink`).
  - `fog` (#f4f4f7) — primary light text / headings; `fog-soft` (#ececf1),
    `fog-muted` (#b6b6c0, body copy), `fog-dim` (#8a8a94, muted labels). Generates
    `text-/bg-/border-fog*`.
- **Accent (red ramp):** `accent` (#ff3b3b, primary/CTA), `accent-bright` (#ff5a5a,
  hover + role text + `border-accent-bright/40`), `accent-soft` (#ff8a8a, link hover).
  Use opacity modifiers for the translucent variants: `bg-accent/8`,
  `border-accent-bright/40`.
- **Animation:** `animate-hero-in` — the `heroFadeUp` entrance (`@keyframes` + the
  `--animate-hero-in` token both live in `main.css`). Add new named animations the same
  way: an `--animate-*` token in `@theme` plus a root-level `@keyframes`.

There is **no light-neutral/`gray` scale defined** — the border-compat block references a
`--color-gray-200` that no longer exists, so the **default border color falls back to
`currentColor`**. Always set an explicit border color (`border-accent-bright/40`, etc.)
rather than relying on a default. The full default Tailwind palette and scale
(`text-3xl`, `gap-2.5`, `max-w-3xl`, `white`, …) is still available for anything the
custom tokens don't cover; `text-white` is used intentionally for the button hover state.

## 3. Need a value that isn't in the system? Add it to `@theme` — don't inline it

If you genuinely need a new **recurring** token (a color, font, animation, text size,
tracking, …), **add it to the `@theme` block in `src/assets/main.css`** using the v4
naming convention (`--color-*`, `--font-*`, `--animate-*`, `--text-*`, `--tracking-*`),
so it becomes a reusable utility. Don't scatter one-off arbitrary values the next person
has to guess at. A truly one-off value that will never repeat can stay an arbitrary
utility (§1).

## 4. Component styling: utilities first, `<style>` only when necessary

Per the global `CLAUDE.md`, **use Tailwind utility classes in the template.** Do not write
plain CSS, inline `style` attributes, or `<style>` blocks unless Tailwind genuinely cannot
express the rule. The legitimate exception in this repo:

- **Complex `background` gradients with no utility equivalent** — the hero's vignette and
  scanline overlays live in a small `<style scoped>` block in `HomeView.vue` as raw
  `background:` declarations. Everything else on those elements (positioning, `z-*`,
  `pointer-events-none`, `opacity-*`, `mix-blend-multiply`) stays as utilities on the
  element; only the gradient itself is raw CSS.

If a `<style>` block ever needs `@apply` or theme tokens, add **`@reference '@/assets/main.css';`**
at the top of that block first — in Tailwind v4 a Vue `<style>` block can't see the theme
otherwise. Even then, express what you can with `@apply` + tokens, not raw declarations.

- **Static inline `style` is a smell:** `style="transition-delay: 100ms"` → `delay-100`.
  Inline `style` is only justified for genuinely **dynamic** values bound from script
  (e.g. a computed per-item stagger).

## 5. Keep transform-driven animation raw (the v4 gotcha)

If you add hover/scroll animation that transitions **`transform`**, write the
`transform` + `transition` lines as **raw CSS** (in a scoped `<style>`), not
`translate-*`/`scale-*` utilities. Tailwind v4 compiles those to the separate
`translate:` / `scale:` properties, which `transition-transform` will **not** animate —
silently breaking the effect. Animating opacity, color, box-shadow, etc. is fine with
utilities (`transition duration-200`, as the hero buttons do).

## 6. Dark theme, no dark-mode variants

The site is **a single dark theme** (ink background, fog text). There is **no light mode
and no `dark:` toggle** — don't add `dark:` variants; they have no design behind them.
Pick the ink/accent/fog token that fits directly.

## Workflow before writing/editing classes

1. Open `src/assets/main.css` (`@theme` block) → is there already a token / scale step for
   this? (`font-display`/`font-mono`, `ink`, `fog`/`fog-*`, `accent`/`accent-*`,
   `animate-hero-in`.)
2. Grep `src/views/HomeView.vue` for how the same thing is already expressed (the kicker/
   role mono-label pattern, the primary vs ghost button, the fade-in) and match it.
3. Reach for the scale utility or theme token. Fall back to `[arbitrary]` only when
   nothing fits; prefer adding a token to `@theme` for anything recurring.
4. Use Tailwind responsive breakpoints (`sm/md/lg/xl`) for layout.
5. After edits run `npm run format` (prettier) and `npm run build` (type-check + compile).
   Remember prettier does **not** sort classes here — order them by hand.
