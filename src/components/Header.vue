<script lang="ts" setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <header class="p-6 flex justify-between">
    <RouterLink to="/" class="text-white text-xl no-underline"> savonije.dev </RouterLink>
    <nav class="flex gap-3">
      <!-- <RouterLink to="/shots">Shots</RouterLink>
      <RouterLink to="/clips">Clips</RouterLink> -->
      <a href="https://dvd.savonije.dev">DVD's</a>
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
