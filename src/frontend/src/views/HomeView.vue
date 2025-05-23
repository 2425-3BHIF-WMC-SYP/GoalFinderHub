<script setup lang="ts">
import Page from "@/components/Page.vue";
import { ref, onMounted } from 'vue';
import { fetchRestEndpoint } from '@/fetch-rest-endpoint.ts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface TeamStanding {
  teamId: number;
  teamName: string;
  points: number;
}

const topPlayers = ref<{name: string, score: number}[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);

async function fetchLeaderboard() {
  try {
    const data: TeamStanding[] = await fetchRestEndpoint("/leaderboard", "GET");

    console.log(data);

    topPlayers.value = data.map(team => ({
      name: team.teamName,
      score: team.points
    })).sort((a, b) => b.score - a.score);

  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Unknown error occurred';
    console.error('Error fetching leaderboard:', err);
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  fetchLeaderboard();
});
</script>

<template>
  <main>
    <Page title="Dashboard" description="Top teams.">
      <Card>
        <CardHeader>
          <CardTitle>Leaderboard</CardTitle>
          <CardDescription>Top 10 teams</CardDescription>
        </CardHeader>
        <CardContent>
          <div v-if="isLoading" class="loading-indicator">Loading leaderboard...</div>
          <div v-else-if="error" class="error-message">{{ error }}</div>
          <div v-else class="leaderboard-container">
            <div class="leaderboard-header">
              <span class="rank">Rank</span>
              <span class="team-name">Team</span>
              <span class="points">Points</span>
            </div>
            <ul class="leaderboard-list">
              <li v-for="(player, index) in topPlayers" :key="player.name" class="leaderboard-item">
                <span class="rank">{{ index + 1 }}.</span>
                <span class="team-name">{{ player.name }}</span>
                <span class="points" :class="{ 'negative': player.score < 0 }">
              {{ player.score }} pts
            </span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </Page>
  </main>
</template>

<style scoped>
.leaderboard-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1rem;
}

.leaderboard-header {
  display: grid;
  grid-template-columns: 50px 1fr 100px;
  padding: 0.5rem 1rem;
  font-weight: bold;
  border-bottom: 1px solid #eee;
  margin-bottom: 0.5rem;
}

.leaderboard-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.leaderboard-item {
  display: grid;
  grid-template-columns: 50px 1fr 100px;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.leaderboard-item:hover {
  background-color: #f8f8f8;
}

.leaderboard-item:nth-child(even) {
  background-color: #f9f9f9;
}

.leaderboard-item:nth-child(even):hover {
  background-color: #f0f0f0;
}

.rank {
  font-weight: bold;
  color: #555;
}

.team-name {
  font-weight: 500;
}

.points {
  font-weight: bold;
  text-align: right;
}

.points.negative {
  color: #e74c3c;
}

.loading-indicator {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.error-message {
  color: #e74c3c;
  font-weight: bold;
  text-align: center;
  padding: 1rem;
  background: #ffebee;
  border-radius: 4px;
  margin: 1rem 0;
}
</style>
