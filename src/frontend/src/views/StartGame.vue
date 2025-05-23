<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Page from "@/components/Page.vue";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import {fetchRestEndpoint} from "@/fetch-rest-endpoint.ts";
import {GameStore} from "@/model/Gamestore.ts";

const router = useRouter()

interface Team {
  id: number | string;
  name: string;
}

interface Device {
  macAddress: string;
  name: string;
}

const teams = ref<Team[]>([])
const devices = ref<Device[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

const fetchInitialData = async () => {
  isLoading.value = true
  error.value = null

  try {
    const [teamsResponse, devicesResponse] = await Promise.all([
      fetchRestEndpoint('/teams', "GET"),
      fetchRestEndpoint('/devices', "GET"),
    ])

    teams.value = await teamsResponse
    devices.value = await devicesResponse
  } catch (err) {
    error.value = 'Failed to load data'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchInitialData()
})

const homeTeam = ref<number>(0)
const homeDevice = ref<string>('')
const awayTeam = ref<number>(0)
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
  if (!validateForm()) return;

  const gameData = {
    id: Date.now(),
    date: new Date().toISOString(),
    homeTeamScore: 0,
    awayTeamScore: 0,
    homeTeamId: homeTeam.value,
    awayTeamId: awayTeam.value,
  };

  GameStore.startGame(gameData);

  await router.push("/games");
};
</script>

<template>
  <main>
    <Page title="Create Game" description="Create a new Game">
      <Button
        id="start-game-btn"
        @click="handleStartGame"
        :disabled="isLoading || !homeTeam || !awayTeam || !homeDevice || !awayDevice"
      >
        <span v-if="isLoading">Loading Teams...</span>
        <span v-else>Start Game</span>
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
          <CardContent>
            <div class="dropdown-group">
              <label>Team</label>
              <Select v-model.number="homeTeam" :disabled="isLoading">
                <SelectTrigger>
                  <SelectValue placeholder="Select Team" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="team in teams"
                    :key="team.id"
                    :value="team.id"
                  >
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
            </div>
          </CardContent>
        </Card>

        <Card class="team-card">
          <CardHeader>
            <CardTitle class="team-title">Away Team</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="dropdown-group">
              <label>Team</label>
              <Select v-model.number="awayTeam" :disabled="isLoading">
                <SelectTrigger>
                  <SelectValue placeholder="Select Team" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="team in teams"
                    :key="team.id"
                    :value="team.id"
                  >
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
            </div>
          </CardContent>
        </Card>
      </div>
    </Page>
  </main>
</template>

<style scoped>
#start-game-btn {
  margin-left: auto;
  display: block;
  margin-top: -5rem;
  margin-bottom: 3rem;
}

.vs-top {
  text-align: center;
  font-size: 3rem;
  font-weight: bold;
  color: #444;
  margin-top: 2rem;
}

.team-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 5rem;
  margin-top: 2rem;
}

.team-card {
  width: 20rem;
  min-height: 30rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 1rem;
}

.team-title {
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
}

.dropdown-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
}

label {
  font-weight: 600;
}

.error-message {
  color: red;
  text-align: center;
  margin: 1rem 0;
  font-weight: 500;
}
</style>
