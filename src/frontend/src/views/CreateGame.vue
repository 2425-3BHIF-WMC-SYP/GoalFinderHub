<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Page from '@/components/Page.vue'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
   Select,
   SelectTrigger,
   SelectValue,
   SelectContent,
   SelectItem,
} from '@/components/ui/select'
import { fetchRestEndpoint } from '@/fetch-rest-endpoint.ts'
import type { Team, Game, Device } from '@/model/model.ts'

const router = useRouter()

const teams = ref<Team[]>([])
const devices = ref<Device[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

const fetchInitialData = async () => {
   isLoading.value = true
   error.value = null

   try {
      const [teamsResponse, devicesResponse] = await Promise.all([
         fetchRestEndpoint('/teams', 'GET'),
         fetchRestEndpoint('/devices', 'GET'),
      ])

      teams.value = teamsResponse
      devices.value = devicesResponse
   } catch (err) {
      error.value = `${err}`
   } finally {
      isLoading.value = false
   }
}

const homeTeam = ref<Team>()
const homeDevice = ref<string>('')
const awayTeam = ref<Team>()
const awayDevice = ref<string>('')

const validateForm = (): boolean => {
   if (!homeTeam.value || !awayTeam.value || !homeDevice.value || !awayDevice.value) {
      error.value = 'Please select both teams and both goalfinders'
      return false
   }

   if (homeTeam.value === awayTeam.value) {
      error.value = 'Home and away teams cannot be the same'
      return false
   }

   if (homeDevice.value === awayDevice.value) {
      error.value = 'Goalfinders cannot be the same'
      return false
   }

   error.value = null
   return true
}

const handleStartGame = async () => {
   if (!validateForm()) return

   const gameData: Game = {
      date: new Date(),
      homeTeamScore: 0,
      awayTeamScore: 0,
      homeTeam: homeTeam.value!,
      awayTeam: awayTeam.value!,
      started: false,
   }

   try {
      await fetchRestEndpoint('/games/local', 'POST', gameData)
      await router.push('/games')
   } catch (err) {
      const errMsg = `${err}`
      if (errMsg.includes('Stop the current Game before starting a new one')) {
         error.value = 'Stop the current Game before starting a new one.'
      } else {
         error.value = `Game creation failed: ${errMsg}`
      }
   }
}

async function onInit() {
   await fetchInitialData()
}
</script>

<template>
   <main>
      <Page title="Create Game" description="Create a new Game" :on-init="onInit">
         <Button
            id="create-game-btn"
            @click="handleStartGame"
            :disabled="isLoading || !homeTeam || !awayTeam || !homeDevice || !awayDevice"
         >
            <span v-if="isLoading">Loading Teams...</span>
            <span v-else>Create Game</span>
         </Button>

         <div v-if="error" class="error-message">
            {{ error }}
         </div>

         <div class="vs-top">- : -</div>

         <div class="team-container">
            <Card class="team-card">
               <CardHeader>
                  <CardTitle class="team-title">Home Team</CardTitle>
               </CardHeader>
               <CardContent class="dropdown-group">
                  <label>Team</label>
                  <Select v-model="homeTeam" :disabled="isLoading">
                     <SelectTrigger>
                        <SelectValue placeholder="Select Team" />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem v-for="team in teams" :key="team.id" :value="team">
                           {{ team.name }}
                        </SelectItem>
                     </SelectContent>
                  </Select>

                  <label>Goalfinder</label>
                  <Select v-model="homeDevice" :disabled="isLoading">
                     <SelectTrigger>
                        <SelectValue placeholder="Select Goalfinder" />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem
                           v-for="device in devices"
                           :key="device.macAddress"
                           :value="device.macAddress"
                        >
                           {{ device.name }}
                        </SelectItem>
                     </SelectContent>
                  </Select>
               </CardContent>
            </Card>

            <Card class="team-card">
               <CardHeader>
                  <CardTitle class="team-title">Away Team</CardTitle>
               </CardHeader>
               <CardContent class="dropdown-group">
                  <label>Team</label>
                  <Select v-model="awayTeam" :disabled="isLoading">
                     <SelectTrigger>
                        <SelectValue placeholder="Select Team" />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem v-for="team in teams" :key="team.id" :value="team">
                           {{ team.name }}
                        </SelectItem>
                     </SelectContent>
                  </Select>

                  <label>Goalfinder</label>
                  <Select v-model="awayDevice" :disabled="isLoading">
                     <SelectTrigger>
                        <SelectValue placeholder="Select Goalfinder" />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem
                           v-for="device in devices"
                           :key="device.macAddress"
                           :value="device.macAddress"
                        >
                           {{ device.name }}
                        </SelectItem>
                     </SelectContent>
                  </Select>
               </CardContent>
            </Card>
         </div>
      </Page>
   </main>
</template>

<style scoped>
#create-game-btn {
   margin-left: auto;
   display: block;
   margin-bottom: 2rem;
}

.vs-top {
   text-align: center;
   font-size: 3rem;
   font-weight: bold;
   color: #444;
   margin: 2rem 0;
}

.team-container {
   display: flex;
   justify-content: center;
   align-items: flex-start;
   gap: 3rem;
   margin-top: 1rem;
}

.team-card {
   width: 22rem;
   min-height: 28rem;
   display: flex;
   flex-direction: column;
   padding: 1rem;
}

.team-title {
   font-size: 1.5rem;
   font-weight: bold;
   text-align: center;
   margin-bottom: 1rem;
}

.dropdown-group {
   display: flex;
   flex-direction: column;
   gap: 1.5rem;
   margin-top: 1rem;
}

label {
   font-weight: 600;
   margin-bottom: -0.5rem;
}

.error-message {
   color: red;
   text-align: center;
   margin: 1rem 0;
   font-weight: 500;
}
</style>
