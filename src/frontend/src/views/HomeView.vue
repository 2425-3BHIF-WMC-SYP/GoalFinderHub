<script setup lang="ts">
import Page from "@/components/Page.vue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
</script>

<template>
  <main>
    <Page title="Leaderboard" description="Top teams.">
      <ul class="leaderboard-list">
        <li v-for="(player, index) in topPlayers" :key="index">
          <strong>{{ index + 1 }} </strong>. {{ player.name }} -  <strong>{{ player.score }}</strong> pts
        </li>
      </ul>
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
.leaderboard-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-left: 1rem;
  font-size: 1rem;
}
</style>


