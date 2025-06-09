<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Page from '@/components/Page.vue'
import {
   Select,
   SelectTrigger,
   SelectValue,
   SelectContent,
   SelectItem,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useRouter } from 'vue-router'
import { fetchRestEndpoint } from '@/fetch-rest-endpoint'
import type { Game } from '@/model/model'

const router = useRouter()
const games = ref<Game[]>([])
const selectedGame = ref<Game | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)

const fetchUnstartedGames = async () => {
   try {
      const allGames: Game[] = await fetchRestEndpoint('/games/local', 'GET')
      games.value = allGames
   } catch (err) {
      error.value = `${err}`
   }
}

const handleStartSelectedGame = async () => {
   if (!selectedGame.value) {
      error.value = 'Please select a valid game to start'
      return
   }

   isLoading.value = true
   error.value = null

   try {
      await fetchRestEndpoint(`/games/start/${selectedGame.value.id}`, 'POST')
      await router.push('/games')
   } catch (err) {
      error.value = `Failed to start game: ${err}`
   } finally {
      isLoading.value = false
   }
}

onMounted(() => {
   fetchUnstartedGames()
})
</script>

<template>
   <main>
      <Page title="Start Game" description="Start an unstarted game">
         <div class="start-game-container">
            <Select v-model="selectedGame">
               <SelectTrigger>
                  <SelectValue placeholder="Select Game" />
               </SelectTrigger>
               <SelectContent>
                  <SelectItem v-for="game in games" :key="game.id" :value="game">
                     {{ game.homeTeam.name }} vs {{ game.awayTeam.name }}
                  </SelectItem>
               </SelectContent>
            </Select>

            <Button @click="handleStartSelectedGame" :disabled="isLoading || !selectedGame">
               <span v-if="isLoading">Starting...</span>
               <span v-else>Start</span>
            </Button>

            <div v-if="error" class="error-message">{{ error }}</div>
         </div>
      </Page>
   </main>
</template>

<style scoped>
.start-game-container {
   display: flex;
   flex-direction: column;
   gap: 1rem;
   max-width: 25rem;
   margin: 2rem auto;
}

.error-message {
   color: red;
   text-align: center;
}
</style>
