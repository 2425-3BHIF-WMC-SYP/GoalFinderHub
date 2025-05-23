<script setup lang="ts">
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import MenuIcon from '@/components/icons/MenuIcon.vue'
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from '@/components/ui/drawer'

interface MenuItem {
  name: string;
  link: string;
}

const menuItems: MenuItem[] = [
  {name: 'Dashboard', link: '/'},
  {name: 'Games', link: '/games'},
  {name: 'Teams', link: '/teams'},
  {name: 'Devices', link: '/devices'},
  {name: 'Settings', link: '/settings'}
];

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
            <RouterLink to="/" class="font-medium">GoalFinder Hub</RouterLink>
          </NavigationMenuItem>
          <NavigationMenuItem v-for="menuItem in menuItems" :key="menuItem.link">
            <RouterLink class="font-normal" :to="menuItem.link" :class="navigationMenuTriggerStyle()">
              {{ menuItem.name }}
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
              <!--<DrawerDescription>Desc.</DrawerDescription>-->
            </DrawerHeader>
            <div class="flex flex-col gap-3">
              <div class="text-center" v-for="menuItem in menuItems" :key="menuItem.link">
                <DrawerClose>
                  <RouterLink :to="menuItem.link">{{ menuItem.name }}</RouterLink>
                </DrawerClose>
              </div>
            </div>
            <DrawerFooter></DrawerFooter>
          </DrawerContent>
        </Drawer>
        <!--<AccountButton class="desktop-menu" />-->
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
