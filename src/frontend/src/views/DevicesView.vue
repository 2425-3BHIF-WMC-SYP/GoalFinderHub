<script setup lang="ts">
import Page from "@/components/Page.vue"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useRouter } from "vue-router"
import { goalfinders } from "@/stores/goalfinderStore"
import {ref} from "vue";
import Popup from "@/components/Popup.vue";
import {Input} from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

const router = useRouter()

const editingGoalFinder = ref<{ id: number; name: string; state: "On" | "Off" } | null>(null)
const showPopup = ref(false)
const name = ref('')
const state = ref('')
const volume = ref()
const ledMode = ref('')

const deleteGoalFinder = (id: number) => {
  goalfinders.value = goalfinders.value.filter(g => g.id !== id)
}

const editGoalFinder = (goalFinder: { id: number; name: string; state: "On" | "Off" }) => {
  editingGoalFinder.value = { ...goalFinder }
  showPopup.value = true
}

const apply = () => {
  showPopup.value = false

  if(editingGoalFinder.value) {
    const newState = state.value === "On" || state.value === "Off" ? state.value : editingGoalFinder.value.state
    const newName = name.value === "" ? editingGoalFinder.value.name : name.value
    const index = goalfinders.value.findIndex(g => g.id === editingGoalFinder.value?.id)

    goalfinders.value[index].name = newName
    goalfinders.value[index].state = newState
  }
}

</script>

<template>
  <Page title="Overview" description="Overview of all GoalFinders." id="devices">
    <div class="flex justify-end mb-4">
      <Button @click="router.push('/addDevice')">Add Goalfinder</Button>
    </div>

    <div v-if="goalfinders.length === 0" class="text-muted-foreground">No Goalfinder added yet.</div>

    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
      <Card v-for="goalFinder in goalfinders" :key="goalFinder.id" class="w-full shadow-md rounded-2xl border border-gray-200">
        <CardHeader class="pb-2">
          <CardTitle class="text-xl font-semibold text-primary">{{ goalFinder.name }}</CardTitle>
          <CardDescription class="text-sm text-gray-500">
            Current State: <span class="font-bold text-black">{{ goalFinder.state }}</span>
          </CardDescription>
        </CardHeader>
        <CardContent class="flex justify-end gap-2 pt-0 pb-4">
          <Button variant="outline" @click="deleteGoalFinder(goalFinder.id)">Delete</Button>
          <Button variant="secondary" @click="editGoalFinder(goalFinder)">Edit</Button>
        </CardContent>
      </Card>

    </div>

    <Popup v-if="showPopup">
      <h2 class="text-lg font-semibold mb-4">Edit {{ editingGoalFinder?.name }}</h2>

      <div class="mb-4">
        <label class="block mb-1">Name</label>
        <Input v-model="name" placeholder="GoalFinder Name" />
      </div>

      <div class="mb-4">
        <label class="block mb-1">Status ("On" oder "Off")</label>
        <Input v-model="state" placeholder="Status" />
      </div>

      <div class="mb-4">
        <label class="block mb-1">Lautstärke </label>
        <Input v-model="volume" placeholder="100%" />
      </div>

      <div class="mb-4">
        <label class="block mb-1">LED Modus</label>
        <Select v-model="ledMode">
          <SelectTrigger>
            <SelectValue placeholder="Select LED Modus" />
          </SelectTrigger>
          <SelectContent class="z-[10001]">
            <SelectItem value="Blink">Blink</SelectItem>
            <SelectItem value="Flash">Flash</SelectItem>
            <SelectItem value="Fade">Fade</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div class="mt-6 flex justify-end gap-4">
        <Button variant="outline" @click="() => showPopup = false">Cancel</Button>
        <Button @click="apply()">Apply</Button>
      </div>

    </Popup>
  </Page>
</template>

<style scoped>

#devices {
  margin-left: 13rem;
  margin-top: 1rem;
}

</style>

