<script setup lang="ts">
import Page from '@/components/Page.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ref } from 'vue'
import { fetchRestEndpoint } from '@/fetch-rest-endpoint.ts'
import { useRouter } from 'vue-router'
import { Card, CardContent } from '@/components/ui/card'
import type { Player, Team } from '@/model/model.ts'
import {
   Dialog,
   DialogClose,
   DialogContent,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from '@/components/ui/dialog'

const router = useRouter()
const name = ref('')
const teams = ref<Team[]>([])
const player = ref('')
const players = ref<string[]>([])
const successMessage = ref('')

const addPlayer = () => {
   const trimmed = player.value.trim()
   if (trimmed) {
      players.value.push(trimmed)
      player.value = ''
   }
}

const selectedPlayers = ref<Player[]>([])
const selectedTeamName = ref('')
const selectedTeamId = ref<number | undefined>(undefined)

const removePlayer = async (teamId: number | undefined, playerId: number) => {
   selectedPlayers.value = selectedPlayers.value.filter((p) => p.id !== playerId)

   const team = teams.value.find((t) => t.id === teamId)
   if (team) {
      team.players = selectedPlayers.value
         .filter((p) => (p as Player).id !== playerId)
         .map((player) => player.name)
   }

   await fetchRestEndpoint(`/teams/${teamId}/${playerId}`, 'DELETE')
   await getAllTeams()
}

const createTeam = async () => {
   if (!name.value || players.value.length === 0) {
      successMessage.value = ''
      return
   }

   const team: Team = {
      id: -1,
      name: name.value,
      players: players.value,
   }

   const createdTeam = await fetchRestEndpoint('/teams', 'POST', team)

   if (createdTeam) {
      successMessage.value = '✅ Team created successfully!'
      setTimeout(async () => {
         successMessage.value = ''
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

const getAllTeams = async () => {
   const data = await fetchRestEndpoint('/teams', 'GET')

   if (data !== undefined) {
      const teamsWithPlayers = await Promise.all(
         data.map(async (team: Team) => {
            const teamDetails = await fetchRestEndpoint(`/teams/${team.id}`, 'GET')
            return {
               ...team,
               players: teamDetails,
            }
         }),
      )

      teams.value = teamsWithPlayers.sort((a, b) => a.name.localeCompare(b.name))
   } else {
      console.error('Error loading teams')
   }
}

const deleteTeam = async (teamId: number) => {
   teams.value = teams.value.filter((team) => team.id !== teamId)
   await fetchRestEndpoint(`/teams/${teamId}`, 'DELETE')
}

const openPlayersPopup = async (team: Team) => {
   const data = await fetchRestEndpoint(`/teams/${team.id}`, 'GET')
   if (data !== undefined) {
      selectedPlayers.value = data
      selectedTeamName.value = team.name
      selectedTeamId.value = team.id
   } else {
      console.error('Could not fetch players')
   }
}

const editedTeamId = ref<number | null>(null)
const editedName = ref('')
const editedPlayer = ref('')
const editedPlayers = ref<string[]>([])

const openEditPopup = async (team: Team) => {
   editedTeamId.value = team.id
}

const saveEditedTeam = async () => {
   if (editedName.value !== '') {
      await fetchRestEndpoint(`/teams/${editedTeamId.value}/${editedName.value}`, 'PUT')
      await getAllTeams()
   }

   if (editedPlayers.value.length !== 0) {
      for (let i = 0; i < editedPlayers.value.length; i++) {
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

const addEditedPlayer = (editedPlayer: string) => {
   editedPlayers.value.push(editedPlayer)
}

async function onInit() {
   await getAllTeams()
}
</script>

<template>
   <main>
      <Page title="Teams" description="Manage your teams." :on-init="onInit">
         <div class="text-right mb-4">
            <Dialog>
               <DialogTrigger>
                  <Button id="new-team-btn">New Team</Button>
               </DialogTrigger>
               <DialogContent>
                  <DialogHeader>
                     <DialogTitle>Create Team</DialogTitle>
                  </DialogHeader>

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
                              <Button variant="destructive" size="sm">Delete</Button>
                           </div>
                           <div v-if="players.length === 0" class="text-sm text-gray-500 italic">
                              No players added
                           </div>
                        </div>
                     </div>
                  </div>

                  <DialogFooter>
                     <DialogClose>
                        <Button variant="outline">Cancel</Button>
                     </DialogClose>
                     <DialogClose>
                        <Button @click="createTeam">Create</Button>
                     </DialogClose>
                  </DialogFooter>
               </DialogContent>
            </Dialog>
         </div>

         <div v-if="teams.length === 0" class="text-center text-gray-500 italic text-sm">
            No teams added
         </div>

         <div v-else class="space-y-2">
            <Card v-for="team in teams" :key="team.id" class="small-card compact-card">
               <CardContent class="card-row compact-row">
                  <div class="game-info text-sm">
                     <div class="grid grid-cols-[300px_auto] items-center w-full">
                        <strong class="truncate">{{ team.name }}</strong>
                        <span class="text-sm text-gray-600 text-left">
                           Players: {{ team.players.length }}
                        </span>
                     </div>
                  </div>
                  <div class="button-group">
                     <Dialog>
                        <DialogTrigger>
                           <Button id="players-btn" size="sm" @click="openPlayersPopup(team)"
                              >Players
                           </Button>
                        </DialogTrigger>
                        <DialogContent>
                           <DialogHeader>
                              <DialogTitle>Players in "{{ selectedTeamName }}"</DialogTitle>
                           </DialogHeader>
                           <div class="space-y-4">
                              <div>
                                 <div
                                    class="space-y-1 border border-gray-300 bg-gray-50 p-4 rounded-lg max-h-[200px] overflow-y-auto"
                                 >
                                    <div
                                       v-for="p in selectedPlayers"
                                       :key="p.id"
                                       class="flex justify-between items-center border-b pb-1"
                                    >
                                       <span>{{ p.name }}</span>
                                       <Button
                                          variant="destructive"
                                          size="sm"
                                          @click="removePlayer(selectedTeamId, p.id)"
                                          >Delete
                                       </Button>
                                    </div>
                                    <div
                                       v-if="selectedPlayers.length === 0"
                                       class="text-sm text-gray-500 italic"
                                    >
                                       No players available
                                    </div>
                                 </div>
                              </div>
                           </div>
                           <DialogFooter>
                              <DialogClose>
                                 <Button>Close</Button>
                              </DialogClose>
                           </DialogFooter>
                        </DialogContent>
                     </Dialog>

                     <Dialog>
                        <DialogTrigger>
                           <Button id="edit-btn" size="sm" @click="openEditPopup(team)"
                              >Edit
                           </Button>
                        </DialogTrigger>
                        <DialogContent>
                           <DialogHeader>
                              <DialogTitle>Edit Team</DialogTitle>
                           </DialogHeader>

                           <div>
                              <label class="block mb-1">Team Name</label>
                              <Input v-model="editedName" placeholder="Edit team name" />
                           </div>

                           <div>
                              <label class="block mb-1">Add Player</label>
                              <div class="flex gap-4">
                                 <Input
                                    v-model="editedPlayer"
                                    placeholder="Player name"
                                    class="flex-1"
                                 />
                                 <Button @click="addEditedPlayer(editedPlayer)">Add</Button>
                              </div>
                           </div>

                           <DialogFooter>
                              <DialogClose>
                                 <Button variant="outline">Cancel</Button>
                              </DialogClose>
                              <DialogClose>
                                 <Button @click="saveEditedTeam">Save</Button>
                              </DialogClose>
                           </DialogFooter>
                        </DialogContent>
                     </Dialog>
                     <Button id="delete-btn" size="sm" @click="deleteTeam(team.id)">Delete</Button>
                  </div>
               </CardContent>
            </Card>
         </div>
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
