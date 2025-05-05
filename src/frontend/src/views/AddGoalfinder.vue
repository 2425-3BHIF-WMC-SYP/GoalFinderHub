<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Page from '@/components/Page.vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { goalfinders } from '@/stores/goalfinderStore'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

const name = ref('')
const state = ref('')
const error = ref('')
const router = useRouter()

const addGoalFinder = () => {
  if (!name.value.trim()) {
    error.value = 'Name darf nicht leer sein.'
    return
  }

  const status = state.value.trim().toLowerCase()
  if (status !== 'on' && status !== 'off') {
    error.value = 'Status muss "On" oder "Off" sein.'
    return
  }

  goalfinders.value.push({
    id: Date.now(),
    name: name.value.trim(),
    state: status.charAt(0).toUpperCase() + status.slice(1) as 'On' | 'Off',
  })

  router.push('/devices')
}

const cancel = () => {
  name.value = ''
  state.value = ''
  error.value = ''
  router.push('/')
}
</script>

<template>
  <Page title="Add Goalfinder" description="Create a new GoalFinder entry." id="addDevice">
    <div class="space-y-4">
      <div>
        <label>Name</label>
        <Input v-model="name" placeholder="GoalFinder Name" />
      </div>

      <div>
        <label>Status ("On" oder "Off")</label>
        <Input v-model="state" placeholder="Status" />
      </div>

      <div>
        <label>MAC Address</label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select MAC" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mac3">CC:DD:EE:FF:00:11</SelectItem>
            <SelectItem value="mac4">22:33:44:55:66:77</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div v-if="error" class="text-red-500">{{ error }}</div>

      <div class="flex gap-4">
        <Button variant="default" @click="addGoalFinder">Hinzufügen</Button>
        <Button variant="secondary" @click="cancel">Abbrechen</Button>
      </div>
    </div>
  </Page>
</template>

<style scoped>

#addDevice {
  margin-left: 13rem;
  margin-top: 1rem;
}

</style>
