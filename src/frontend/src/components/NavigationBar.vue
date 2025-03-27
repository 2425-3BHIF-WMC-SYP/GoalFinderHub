<script setup lang="ts">
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'

import AccountButton from "@/components/AccountButton.vue";
</script>

<template>
  <div id="nav-root" class="flex items-center justify-between w-full">
    <!-- Left Side: Navigation Menu -->
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <RouterLink to="/">
            GoalFinder Hub
          </RouterLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <RouterLink to="/games" :class="navigationMenuTriggerStyle()">
            Games
          </RouterLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <RouterLink to="/devices" :class="navigationMenuTriggerStyle()">
            Devices
          </RouterLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <RouterLink to="/settings" :class="navigationMenuTriggerStyle()">
            Settings
          </RouterLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>

    <!-- Right Side: Button -->
    <div class="ml-auto">
      <AccountButton variant="outline">Sign In</AccountButton>
    </div>
  </div>
</template>

<style scoped>
#nav-root {
  padding: 0.55rem 1rem;
}
</style>
