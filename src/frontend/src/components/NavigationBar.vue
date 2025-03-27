<script setup lang="ts">
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'

import AccountButton from '@/components/AccountButton.vue'

/*import { useColorMode } from '@vueuse/core'

import { Label } from '@/components/ui/label'
import { Toggle } from '@/components/ui/toggle'

const colorMode = useColorMode({ disableTransition: false })

function onThemeSwitchBtnClick() {
  if(colorMode.value === 'dark') {
    colorMode.value = 'light'
  }
  else {
    colorMode.value = 'dark'
  }
}*/
</script>

<template>
  <div id="nav-root" class="flex items-center justify-between w-full">
    <!-- Left Side: Navigation Menu -->
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <RouterLink to="/"> GoalFinder Hub </RouterLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <RouterLink class="font-normal" to="/games" :class="navigationMenuTriggerStyle()">
            Games
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
      <!--<Toggle variant="outline" @click="onThemeSwitchBtnClick">
        <Label>Dark</Label>
      </Toggle>-->
      <AccountButton variant="outline">Sign In</AccountButton>
    </div>
  </div>
</template>

<style scoped>
#nav-root {
  padding: 0.55rem 1rem;
}
</style>
