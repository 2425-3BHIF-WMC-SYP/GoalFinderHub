<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavigationBar from '@/components/NavigationBar.vue'
import {useColorMode} from "@vueuse/core";

const colorMode = useColorMode({ disableTransition: false })
</script>

<template>
  <header>
    <NavigationBar/>
  </header>
  <RouterView class="responsive-container" />
</template>

<style scoped>
</style>
