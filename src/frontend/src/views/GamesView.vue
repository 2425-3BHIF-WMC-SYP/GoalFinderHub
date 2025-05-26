<script setup lang="ts">
import { ref } from 'vue'
import Page from '@/components/Page.vue'
import Button from '@/components/ui/button/Button.vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'vue-router'
import type { Game } from '@/model/model.ts'
import { fetchRestEndpoint } from '@/fetch-rest-endpoint.ts'
import CurrentGameCard from '@/components/CurrentGameCard.vue'

const router = useRouter()
const previousGames = ref<Game[]>([])

async function loadPreviousGames() {
  try {
    previousGames.value = await fetchRestEndpoint('/games', 'GET')
    isLoaded.value = true
  } catch (error) {
    console.error(error)
  }
}

async function deletePreviousGame(gameId: number) {
  try {
    const response = await fetch(`http://localhost:3000/api/games/${gameId}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error('Löschen fehlgeschlagen')
    }
    await loadPreviousGames()
  } catch (error) {
    alert('Fehler beim Löschen des Spiels')
    console.error(error)
  }
}

const isLoaded = ref(false)

async function onInit() {
  try {
    await loadPreviousGames()
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <main>
    <Page title="Games" description="See information about your games." :on-init="onInit">
      <div class="header-row">
        <div />
        <Button id="create-game-btn" @click="router.push('/createGame')"> Create Game</Button>
      </div>
      <CurrentGameCard :on-stop="loadPreviousGames"/>
      <Card id="previous-games" class="mt-4">
        <CardHeader>
          <CardTitle>Previous Games</CardTitle>
        </CardHeader>
        <CardContent v-if="previousGames.length > 0" class="overflow-y-scroll max-h-[40vh]">
          <div
            v-for="game in previousGames"
            :key="game.id"
            class="card-row"
            style="
              border: 1px solid hsl(var(--border));
              border-radius: var(--radius);
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 0.5rem 1rem;
            "
          >
            <div style="flex: 1; display: flex; gap: 2rem; align-items: center">
              <div style="flex-basis: 30%; font-weight: 600">
                {{ game.homeTeam.name }} vs {{ game.awayTeam.name }}
              </div>
              <div style="flex-basis: 20%; text-align: center; font-size: 1.15rem">
                {{ game.homeTeamScore }} - {{ game.awayTeamScore }}
              </div>
              <div style="flex-basis: 30%; text-align: right; color: #666">
                {{ new Date(game.date).toLocaleDateString() }}
              </div>
            </div>
            <Button variant="destructive" @click="deletePreviousGame(game.id!)">Delete</Button>
          </div>
        </CardContent>
        <p v-else class="no-games">No previous games available.</p>

        <template></template>
      </Card>
    </Page>
  </main>
</template>

<style scoped>
.header-row {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: black;
  margin-bottom: 0.5rem;
  margin-top: 1rem;
}

.card-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.no-games {
  padding: 1rem;
  color: #999;
}
</style>
