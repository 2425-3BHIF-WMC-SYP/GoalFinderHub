<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Page from '@/components/Page.vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
   Select,
   SelectTrigger,
   SelectValue,
   SelectContent,
   SelectItem,
} from '@/components/ui/select'
import { fetchRestEndpoint } from '@/fetch-rest-endpoint.ts'
import type { Device } from '@/model/model.ts'

const name = ref('')
const macAddress = ref('')
const error = ref('')
const router = useRouter()

const addGoalFinder = async () => {
   if (!name.value.trim()) {
      error.value = 'Name darf nicht leer sein.'
      return
   }

   if (!macAddress.value) {
      error.value = 'Bitte MAC-Adresse auswählen.'
      return
   }

   try {
      /*const response = await fetch('http://localhost:3000/api/devices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          macAddress: macAddress.value,
          name: name.value.trim()
        }),
      })*/

      const device: Device = await fetchRestEndpoint('/devices', 'POST', {
         macAddress: macAddress.value,
         name: name.value.trim(),
      })

      if (device) {
         console.log('Successfully added device', device)
         await router.push('/devices')
      }
   } catch (err) {
      console.error('Fehler beim Hinzufügen:', err)
      error.value = String(err)
   }
}

const cancel = () => {
   router.push('/devices')
}
</script>

<template>
   <main>
      <Page title="Add Goalfinder" description="Create a new GoalFinder entry.">
         <div class="space-y-4">
            <div>
               <label>Name</label>
               <Input v-model="name" placeholder="GoalFinder Name" />
            </div>

            <div>
               <label>MAC Address</label>
               <Select v-model="macAddress">
                  <SelectTrigger>
                     <SelectValue placeholder="Select MAC" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="CC:DD:EE:FF:00:11">CC:DD:EE:FF:00:11</SelectItem>
                     <SelectItem value="22:33:44:55:66:77">22:33:44:55:66:77</SelectItem>
                     <SelectItem value="AA:BB:CC:DD:EE:FF">AA:BB:CC:DD:EE:FF</SelectItem>
                     <SelectItem value="11:22:33:44:55:66">11:22:33:44:55:66</SelectItem>
                  </SelectContent>
               </Select>
            </div>

            <div v-if="error" class="text-red-500">{{ error }}</div>

            <div class="flex gap-1.5">
               <Button variant="default" @click="addGoalFinder">Add</Button>
               <Button variant="outline" @click="cancel">Cancel</Button>
            </div>
         </div>
      </Page>
   </main>
</template>

<style scoped></style>
