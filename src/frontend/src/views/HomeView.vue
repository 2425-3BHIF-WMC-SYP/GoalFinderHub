<script setup lang="ts">
import Page from "@/components/Page.vue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
</script>

<template>
  <main class="page-wrapper">
    <Page title="Leaderboard" description="Top teams.">

      <Card class="leaderboard-card">
        <CardHeader>
          <CardTitle>Top Teams</CardTitle>
        </CardHeader>
        <CardContent>
          <ul class="leaderboard-list">
            <li v-for="(player, index) in topPlayers" :key="index">
              <strong>{{ index + 1 }} </strong>. {{ player.name }} -  <strong>{{ player.score }}</strong> pts
            </li>
          </ul>
        </CardContent>
      </Card>

    </Page>
  </main>
</template>

<script lang="ts">
const topPlayers = [
  { name: "Team A", score: 3 },
  { name: "Team B", score: 40 },
  { name: "Team C", score: 50 },
];
</script>

<style scoped>
.page-wrapper {
  padding: 2rem;
}

.leaderboard-card {
  margin-bottom: 2rem;
}

.leaderboard-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-left: 1rem;
  font-size: 1rem;
}
</style>


