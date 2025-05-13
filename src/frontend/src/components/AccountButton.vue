<script setup lang="ts">

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {useUserStore} from "@/stores/user-store.ts";
import router from "@/router";

const userStore = useUserStore();

function logOut() {
  //sessionStorage.removeItem('jwt');
  //sessionStorage.removeItem('username');
  userStore.reset();

  router.push("/login");
}
</script>

<template>
  <div>
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="outline">
          <Avatar id="avatar-icon">
            <AvatarImage src="" alt="@unovue"/>
            <AvatarFallback>{{ userStore.initials.toUpperCase() }}</AvatarFallback>
          </Avatar>
          <Label>{{ userStore.name }}</Label>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator/>
        <DropdownMenuItem @click="logOut">Log Out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>

<style scoped>
#avatar-icon {
  max-width: 1.5rem;
  max-height: 1.5rem;
}
</style>
