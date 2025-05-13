<script setup lang="ts">
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'

import AccountButton from '@/components/AccountButton.vue'
import { Label } from '@/components/ui/label'
import { Toggle } from '@/components/ui/toggle'
import { Button } from '@/components/ui/button'
import MenuIcon from '@/components/icons/MenuIcon.vue'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from '@/components/ui/drawer'
</script>

<template>
  <div id="nav-root">
    <div class="flex items-center justify-between responsive-container">
      <!-- Mobile Only Title -->
      <RouterLink class="mobile-menu" to="/"> GoalFinder Hub</RouterLink>

      <!-- Left Side: Navigation Menu -->
      <NavigationMenu class="desktop-menu">
        <NavigationMenuList>
          <NavigationMenuItem>
            <RouterLink to="/"> GoalFinder Hub</RouterLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <RouterLink class="font-normal" to="/games" :class="navigationMenuTriggerStyle()">
              Games
            </RouterLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <RouterLink class="font-normal" to="/teams" :class="navigationMenuTriggerStyle()">
              Teams
            </RouterLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <RouterLink class="font-normal" to="/devices" :class="navigationMenuTriggerStyle()">
              Devices
            </RouterLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <RouterLink class="font-normal" to="/settings" :class="navigationMenuTriggerStyle()">
              Settings
            </RouterLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <!-- Right Side: Button -->
      <div class="ml-auto flex center gap-2">
        <!-- Mobile List -->
        <Drawer>
          <DrawerTrigger>
            <MenuIcon class="mobile-menu border rounded w-9 h-9 p-1" />
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Menu</DrawerTitle>
              <DrawerDescription>Desc.</DrawerDescription>
            </DrawerHeader>
            <div class="flex flex-col gap-3">
              <div class="text-center">
                <DrawerClose>
                  <RouterLink to="/"> GoalFinder Hub</RouterLink>
                </DrawerClose>
              </div>
              <div class="text-center">
                <DrawerClose>
                  <RouterLink class="font-normal" to="/games"> Games</RouterLink>
                </DrawerClose>
              </div>
              <div class="text-center">
                <DrawerClose>
                  <RouterLink class="font-normal" to="/devices"> Devices</RouterLink>
                </DrawerClose>
              </div>
              <div class="text-center">
                <DrawerClose>
                  <RouterLink class="font-normal" to="/settings"> Settings</RouterLink>
                </DrawerClose>
              </div>
            </div>
            <DrawerFooter></DrawerFooter>
          </DrawerContent>
        </Drawer>

        <AccountButton class="desktop-menu" />
      </div>
    </div>
  </div>
</template>

<style scoped>
#nav-root {
  padding: 0.55rem 1rem;
  border-bottom: hsl(var(--border)) 1px solid;
}

@media (min-width: 768px) {
  .mobile-menu {
    display: none;
  }
}

@media (max-width: 768px) {
  .desktop-menu {
    display: none;
  }
}
</style>
