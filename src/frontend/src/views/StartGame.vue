<script setup lang="ts">
import { useRouter } from 'vue-router'
import Page from "@/components/Page.vue";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const router = useRouter()

const handleStartGame = () => {
  router.push({ name: 'games' })
}
</script>

<template>
  <main>
    <Page title="Create Game" description="Create a new Game">
      <Button id="start-game-btn" @click="handleStartGame">Start Game</Button>

      <div class="vs-top">- : -</div>

      <div class="team-container">
        <Card class="team-card">
          <CardHeader>
            <CardTitle class="team-title">Team 1</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="dropdown-group">
              <label>Team</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Team" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="teamA">Team A</SelectItem>
                  <SelectItem value="teamB">Team B</SelectItem>
                </SelectContent>
              </Select>

              <label>MAC Address</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select MAC" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mac1">00:11:22:33:44:55</SelectItem>
                  <SelectItem value="mac2">66:77:88:99:AA:BB</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card class="team-card">
          <CardHeader>
            <CardTitle class="team-title">Team 2</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="dropdown-group">
              <label>Team</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Team" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="teamC">Team C</SelectItem>
                  <SelectItem value="teamD">Team D</SelectItem>
                </SelectContent>
              </Select>

              <label>MAC Address</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select MAC" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mac3">CC:DD:EE:FF:00:11</SelectItem>
                  <SelectItem value="mac4">22:33:44:55:66:77</SelectItem>
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
  height: 30rem;
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
</style>
