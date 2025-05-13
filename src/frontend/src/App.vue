<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavigationBar from '@/components/NavigationBar.vue'
import {useUserStore} from "@/stores/user-store.ts";

//const colorMode = useColorMode({ disableTransition: false })
const user = useUserStore();
</script>

<template>
  <header>
    <NavigationBar v-if="user.isAuthenticated"/>
    <h1 id="title" v-else>GoalFinder Hub</h1>
  </header>
  <RouterView class="responsive-container" />
</template>

<style scoped>
  #title {
    margin: 0.5rem;
  }
</style>
