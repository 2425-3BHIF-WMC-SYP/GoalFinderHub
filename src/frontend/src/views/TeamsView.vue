<script setup lang="ts">
import Page from '@/components/Page.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ref, onMounted } from 'vue'
import Popup from '@/components/Popup.vue'
import { fetchRestEndpoint } from '@/fetch-rest-endpoint.ts'
import { useRouter } from 'vue-router'
import { Card, CardContent } from '@/components/ui/card'
import type { Team } from '@/model/model.ts'

const router = useRouter()
const name = ref('')
const teams = ref<Team[]>([])
const player = ref('')
const players = ref<string[]>([])
const successMessage = ref('')
const createPopup = ref(false)

const addPlayer = () => {
  const trimmed = player.value.trim()
  if (trimmed) {
    players.value.push(trimmed)
    player.value = ''
  }
}

const removePlayer = (index: number) => {
  players.value.splice(index, 1)
}

const createTeam = async () => {
  if (!name.value || players.value.length === 0) {
    successMessage.value = ''
    return
  }

  const team: Team = {
    name: name.value,
    players: players.value,
  }

  const createdTeam = await fetchRestEndpoint('/teams', 'POST', team)

  if (createdTeam) {
    successMessage.value = '✅ Team created successfully!'
    setTimeout(async () => {
      successMessage.value = ''
      createPopup.value = false
      await router.push('/teams')
      await getAllTeams()
    }, 2000)
  } else {
    successMessage.value = '❌ Failed to create team.'
    await router.push('/teams')
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  }

  name.value = ''
  player.value = ''
  players.value = []
}

const getAllTeams = async() => {
  const data = await fetchRestEndpoint('/teams', 'GET')

  if (data !== undefined) {
    teams.value = data
  } else {
    console.error('Error loading teams')
  }
}

const openCreatePopup = () => {
  createPopup.value = true
}

const closeCreatePopup = () => {
  createPopup.value = false
}

onMounted(() => {
  getAllTeams()
})

const deleteTeam = async (teamId: number) => {
  teams.value = teams.value.filter((team) => team.id !== teamId)
  await fetchRestEndpoint(`/teams/${teamId}`, 'DELETE')
}

const showPlayersPopup = ref(false)
const selectedPlayers = ref<string[]>([])
const selectedTeamName = ref('')

const openPlayersPopup = async (team: Team) => {
  const data = await fetchRestEndpoint(`/teams/${team.id}`, 'GET')
  if (data !== undefined) {
    selectedPlayers.value = data.map((p: any) => p.name) // vorausgesetzt Backend liefert Players mit name-Feld
    selectedTeamName.value = team.name
    showPlayersPopup.value = true
  } else {
    console.error('Could not fetch players')
  }
}

const closePlayersPopup = () => {
  showPlayersPopup.value = false
}

const editPopup = ref(false)
const editedTeamId = ref<number | null>(null)
const editedName = ref('')
const editedPlayer = ref('')
const editedPlayers = ref<string[]>([])

const openEditPopup = async (team: Team) => {
  editPopup.value = true
  editedTeamId.value = team.id
}

const saveEditedTeam = async () => {
  editPopup.value = false

  if (editedName.value !== '') {
    //Update Name
    await fetchRestEndpoint(`/teams/${editedTeamId.value}/${editedName.value}`, 'PUT')
    await getAllTeams()
  }

  if (editedPlayers.value.length !== 0) {
    for (let i = 0; i < editedPlayers.value.length; i++) {
      //Put one player
      await fetchRestEndpoint(`/teams/${editedTeamId.value}`, 'PUT', {
        name: editedPlayers.value[i],
      })
    }
    await getAllTeams()
  }

  editedName.value = ''
  editedPlayer.value = ''
  editedPlayers.value = []
  editedTeamId.value = null
}

const closeEditPopup = () => {
  editPopup.value = false
  editedName.value = ''
  editedPlayer.value = ''
  editedPlayers.value = []
  editedTeamId.value = null
}

const addEditedPlayer = (editedPlayer: string) => {
  editedPlayers.value.push(editedPlayer)
}
</script>

<template>
  <main>
    <Page title="Team Configuration" description="Manage your teams.">
      <div class="text-right mb-4">
        <Button @click="openCreatePopup" id="new-team-btn">New Team</Button>
      </div>

      <div v-if="teams.length === 0" class="text-center text-gray-500 italic text-sm">
        No teams added
      </div>

      <div v-else class="space-y-2">
        <Card v-for="team in teams" :key="team.id" class="small-card compact-card">
          <CardContent class="card-row compact-row">
            <div class="game-info text-sm">
              <div class="teams">
                <strong>{{ team.name }}</strong>
              </div>
            </div>
            <div class="button-group">
              <Button id="players-btn" size="sm" @click="openPlayersPopup(team)">Players</Button>
              <Button id="edit-btn" size="sm" @click="openEditPopup(team)">Edit</Button>
              <Button id="delete-btn" size="sm" @click="deleteTeam(team.id)">Delete</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Popup v-if="showPlayersPopup">
        <h2 class="text-lg font-semibold mb-4">Players in "{{ selectedTeamName }}"</h2>

        <div class="space-y-4">
          <div>
            <label class="block mb-1">Players</label>
            <div
              class="space-y-1 border border-gray-300 bg-gray-50 p-4 rounded-lg max-h-[200px] overflow-y-auto"
            >
              <div
                v-for="(p, index) in selectedPlayers"
                :key="index"
                class="flex justify-between items-center border-b pb-1"
              >
                <span>{{ p }}</span>
              </div>
              <div v-if="selectedPlayers.length === 0" class="text-sm text-gray-500 italic">
                No players available
              </div>
            </div>
          </div>

          <div class="mt-6 flex justify-end gap-4">
            <Button variant="outline" @click="closePlayersPopup">Close</Button>
          </div>
        </div>
      </Popup>

      <Popup v-if="createPopup">
        <h2 class="text-lg font-semibold mb-4">Create Team</h2>

        <div v-if="successMessage" class="text-green-600 font-medium text-center mb-4">
          {{ successMessage }}
        </div>

        <div class="space-y-4">
          <div>
            <label class="block mb-1">Team Name</label>
            <Input v-model="name" placeholder="Enter your team name" />
          </div>

          <div>
            <label class="block mb-1">Add Player</label>
            <div class="flex gap-4">
              <Input v-model="player" placeholder="Player name" class="flex-1" />
              <Button @click="addPlayer">Add</Button>
            </div>
          </div>

          <div>
            <label class="block mb-1">Players</label>
            <div
              class="space-y-1 border border-gray-300 bg-gray-50 p-4 rounded-lg max-h-[200px] overflow-y-auto"
            >
              <div
                v-for="(p, index) in players"
                :key="index"
                class="flex justify-between items-center border-b pb-1"
              >
                <span>{{ p }}</span>
                <Button variant="destructive" size="sm" @click="removePlayer(index)">Delete</Button>
              </div>
              <div v-if="players.length === 0" class="text-sm text-gray-500 italic">
                No players added
              </div>
            </div>
          </div>

          <div class="mt-6 flex justify-end gap-4">
            <Button variant="outline" @click="closeCreatePopup">Cancel</Button>
            <Button @click="createTeam">Create</Button>
          </div>
        </div>
      </Popup>

      <Popup v-if="editPopup">
        <h2 class="text-lg font-semibold mb-4">Edit Team</h2>

        <div class="space-y-4">
          <div>
            <label class="block mb-1">Team Name</label>
            <Input v-model="editedName" placeholder="Edit team name" />
          </div>

          <div>
            <label class="block mb-1">Add Player</label>
            <div class="flex gap-4">
              <Input v-model="editedPlayer" placeholder="Player name" class="flex-1" />
              <Button @click="addEditedPlayer(editedPlayer)">Add</Button>
            </div>
          </div>

          <div class="mt-6 flex justify-end gap-4">
            <Button variant="outline" @click="closeEditPopup">Cancel</Button>
            <Button @click="saveEditedTeam">Save</Button>
          </div>
        </div>
      </Popup>
    </Page>
  </main>
</template>

<style scoped>
#new-team-btn {
  margin-left: auto;
  display: block;
}

.small-card {
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.compact-card {
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
}

.card-row,
.compact-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  gap: 0.5rem;
}

.button-group {
  display: flex;
  gap: 0.4rem;
}

/* Button Hover Styles */
#delete-btn {
  background-color: #ef4444;
  color: white;
  transition: background-color 0.2s ease;
}

#delete-btn:hover {
  background-color: #dc2626;
}

#edit-btn {
  background-color: #e5e7eb;
  color: #1f2937;
  transition: background-color 0.2s ease;
}

#edit-btn:hover {
  background-color: #d1d5db;
}

#players-btn {
  background-color: #3b82f6;
  color: white;
  transition: background-color 0.2s ease;
}

#players-btn:hover {
  background-color: #2563eb;
}

.teams {
  font-size: 0.95rem;
  font-weight: 500;
}
</style>
