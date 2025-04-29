<script setup lang="ts">

import Page from "@/components/Page.vue";
import Button from "@/components/ui/button/Button.vue";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import { useRouter } from "vue-router";
const router = useRouter();


</script>

<template>
  <main>
    <Page title="Games" description="See information about your games.">
      <Button id="create-game-btn" @click="router.push('/createGame')">
        Create Game
      </Button>

      <Card id="card-current-game">
        <CardHeader>
          <CardTitle id="title">Current Game</CardTitle>
        </CardHeader>
        <CardContent>

        </CardContent>
      </Card>

      <h2 class="section-title">Previous Games</h2>

      <div class="vertical-scroll">
        <Card class="small-card">
          <CardContent class="card-row">
            <div class="game-info">
              <div class="teams">Team 1 vs Team 2</div>
              <div class="details">
                <strong>0 - 0</strong>
                <span class="date">29.04.2025</span>
                <span class="duration">Duration: 50 min</span>
              </div>
            </div>
            <Button class="delete-btn" size="sm">Delete</Button>
          </CardContent>
        </Card>

        <Card class="small-card">
          <CardContent class="card-row">
            <div class="game-info">
              <div class="teams">Team 1 vs Team 2</div>
              <div class="details">
                <strong>0 - 0</strong>
                <span class="date">29.04.2025</span>
                <span class="duration">Duration: 50 min</span>
              </div>
            </div>
            <Button class="delete-btn" size="sm">Delete</Button>
          </CardContent>
        </Card>

        <Card class="small-card">
          <CardContent class="card-row">
            <div class="game-info">
              <div class="teams">Team 1 vs Team 2</div>
              <div class="details">
                <strong>0 - 0</strong>
                <span class="date">29.04.2025</span>
                <span class="duration">Duration: 50 min</span>
              </div>
            </div>
            <Button class="delete-btn" size="sm">Delete</Button>
          </CardContent>
        </Card>

        <Card class="small-card">
          <CardContent class="card-row">
            <div class="game-info">
              <div class="teams">Team 1 vs Team 2</div>
              <div class="details">
                <strong>0 - 0</strong>
                <span class="date">29.04.2025</span>
                <span class="duration">Duration: 50 min</span>
              </div>
            </div>
            <Button class="delete-btn" size="sm">Delete</Button>
          </CardContent>
        </Card>

        <Card class="small-card">
          <CardContent class="card-row">
            <div class="game-info">
              <div class="teams">Team 1 vs Team 2</div>
              <div class="details">
                <strong>0 - 0</strong>
                <span class="date">29.04.2025</span>
                <span class="duration">Duration: 50 min</span>
              </div>
            </div>
            <Button class="delete-btn" size="sm">Delete</Button>
          </CardContent>
        </Card>

        <Card class="small-card">
          <CardContent class="card-row">
            <div class="game-info">
              <div class="teams">Team 1 vs Team 2</div>
              <div class="details">
                <strong>0 - 0</strong>
                <span class="date">29.04.2025</span>
                <span class="duration">Duration: 50 min</span>
              </div>
            </div>
            <Button class="delete-btn" size="sm">Delete</Button>
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
  margin-top: -5rem;
  margin-bottom: 3rem;
}

#title {
  margin: -0.5rem;
}

#card-current-game {
  min-height: 10rem;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.vertical-scroll {
  max-height: 20rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.small-card {
  height: 8rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
}

.delete-btn {
  padding: 0.3rem 0.8rem;
  font-size: 0.8rem;
}

.game-info {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  gap: 4rem;
}

.teams {
  font-weight: normal;
  white-space: nowrap;
}

.details {
  display: flex;
  justify-content: flex-start;
  gap: 3rem;
  align-items: center;
  font-size: 0.85rem;
}

.details strong {
  font-size: 1.5rem;
}

.date, .duration {
  color: #666;
}

</style>
