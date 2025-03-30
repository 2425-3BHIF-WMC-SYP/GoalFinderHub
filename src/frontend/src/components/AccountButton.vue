<script setup lang="ts">

import {Avatar, AvatarImage, AvatarFallback} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
</script>

<template>
  <div>
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="outline">
          <Avatar id="avatar-icon">
            <AvatarImage src="" alt="@unovue" />
            <AvatarFallback>NK</AvatarFallback>
          </Avatar>
          <Label>Nico Kaleshkov</Label>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator/>
        <DropdownMenuItem>Log Out</DropdownMenuItem>
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
