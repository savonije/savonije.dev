<script lang="ts" setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <header class="p-6 flex justify-between">
    <RouterLink to="/" class="text-white text-xl">savonije.dev</RouterLink>
    <nav class="flex gap-3">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
    </nav>
  </header>
</template>

<style>
header {
  a {
    @apply text-white;

    &:hover {
      @apply underline;
    }
  }
}
</style>
