<script setup lang="ts">
import { ref, onMounted } from "vue";
import Page from "@/components/Page.vue";
import Button from "@/components/ui/button/Button.vue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "vue-router";
import { GameStore } from "@/model/Gamestore.ts";

const router = useRouter();

const latestGame = ref<any | null>(null);
const previousGames = ref<any[]>([]);
const teams = ref<{ id: number; name: string }[]>([]);

async function loadTeams() {
  try {
    const response = await fetch("http://localhost:3000/api/teams");
    if (!response.ok) throw new Error("Failed to load teams");
    teams.value = await response.json();
  } catch (error) {
    console.error(error);
    teams.value = [];
  }
}

function getTeamName(teamId: number) {
  const team = teams.value.find((t) => t.id === teamId);
  return team ? team.name : `Team ${teamId}`;
}

async function loadPreviousGames() {
  try {
    const response = await fetch("http://localhost:3000/api/games/exceptLatest");
    if (!response.ok) throw new Error("Failed to load previous games");
    previousGames.value = await response.json();
  } catch (error) {
    console.error(error);
    previousGames.value = [];
  }
}

async function endGame(gameId: number) {
  if (!latestGame.value || latestGame.value.id !== gameId) return;

  try {
    const response = await fetch("http://localhost:3000/api/games", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameData: latestGame.value }),
    });
    if (!response.ok) throw new Error("Failed to end game");

    await GameStore.endGame();
    latestGame.value = null;
    await loadPreviousGames();
  } catch (error) {
    console.error(error);
    alert("Speichern des Spiels fehlgeschlagen.");
  }
}

async function deletePreviousGame(gameId: number) {
  try {
    const response = await fetch(`http://localhost:3000/api/games/${gameId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Löschen fehlgeschlagen");
    }
    await loadPreviousGames();
  } catch (error) {
    alert("Fehler beim Löschen des Spiels");
    console.error(error);
  }
}

onMounted(async () => {
  await loadTeams();
  latestGame.value = GameStore.getLatestGame();
  await loadPreviousGames();
});
</script>

<template>
  <main>
    <Page title="Games" description="See information about your games.">
      <div class="header-row">
        <div />
        <Button id="create-game-btn" @click="router.push('/createGame')">
          Create Game
        </Button>
      </div>

      <Card id="card-current-game">
        <CardHeader>
          <CardTitle id="title">Current Game</CardTitle>
        </CardHeader>
        <CardContent v-if="latestGame && latestGame.id">
          <div class="text-center mb-2 text-xl font-bold">
            {{ latestGame.homeTeamScore }} - {{ latestGame.awayTeamScore }}
          </div>
          <div class="text-center text-lg mb-4">
            {{ getTeamName(latestGame.homeTeamId) }} - {{ getTeamName(latestGame.awayTeamId) }}
          </div>
          <div class="text-center">
            <button
              @click="endGame(latestGame.id)"
              style="background-color: #3182ce; color: white; border: none; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer;"
            >
              End Game
            </button>
          </div>
        </CardContent>
        <CardContent v-else>
          <p class="no-games">No current game running.</p>
        </CardContent>
      </Card>

      <h2 class="section-title">Previous Games</h2>
      <Card id="previous-games" class="vertical-scroll">
        <template v-if="previousGames.length > 0">
          <div
            v-for="game in previousGames"
            :key="game.id"
            class="card-row"
            style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 1rem;"
          >
            <div style="flex: 1; display: flex; gap: 2rem; align-items: center;">
              <div style="flex-basis: 30%; font-weight: 600;">
                {{ getTeamName(game.homeTeamId) }} vs {{ getTeamName(game.awayTeamId) }}
              </div>
              <div style="flex-basis: 20%; text-align: center;">
                {{ game.homeTeamScore }} - {{ game.awayTeamScore }}
              </div>
              <div style="flex-basis: 30%; text-align: right; color: #666;">
                {{ new Date(game.date).toLocaleDateString() }}
              </div>
            </div>
            <button
              @click="deletePreviousGame(game.id)"
              style="margin-left: 1rem; background-color: #e53e3e; color: white; border: none; padding: 0.25rem 0.5rem; border-radius: 4px; cursor: pointer;"
            >
              Delete
            </button>
          </div>
        </template>
        <p v-else class="no-games">No previous games available.</p>
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

#card-current-game {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: black;
  margin-bottom: 0.5rem;
  margin-top: 1rem;
}

#previous-games {
  max-height: 300px;
  overflow-y: auto;
  padding: 0.5rem;
  margin-top: 1rem;
  min-height: 150px;
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
