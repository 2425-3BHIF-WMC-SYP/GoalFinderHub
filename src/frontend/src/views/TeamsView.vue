<script setup lang="ts">
import Page from "@/components/Page.vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ref } from "vue";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import Popup from "@/components/Popup.vue";

const name = ref('');
const player = ref('');
const players = ref<string[]>([]);
const successMessage = ref('');
const showPopup = ref(false)

const addPlayer = () => {
  const trimmed = player.value.trim();
  if (trimmed) {
    players.value.push(trimmed);
    player.value = '';
  }
};

const removePlayer = (index: number) => {
  players.value.splice(index, 1);
};

const createTeam = () => {
  if (!name.value || players.value.length === 0) {
    successMessage.value = '';
    return;
  }

  console.log('Team erstellt:', {
    name: name.value,
    players: players.value,
  });

  name.value = '';
  player.value = '';
  players.value = [];

  successMessage.value = '✅ Erfolgreich Team erstellt!';
  setTimeout(() => {
    successMessage.value = '';
  }, 3000);
};

const editTeams = () => {
  showPopup.value = true;
}

const apply = () => {
  showPopup.value = false;
}

</script>

<template>
  <Page title="Team Config." description="Team Configurations." id="teams">
    <Button @click="editTeams()" id="edit-teams-btn">Edit Teams</Button>

    <div class="space-y-8 bg-white p-8 rounded-2xl shadow-lg max-w-2xl mx-auto text-base">
      <div v-if="successMessage" class="text-green-600 font-medium text-center">
        {{ successMessage }}
      </div>

      <div class="space-y-2">
        <label class="font-semibold text-lg">Team Name</label>
        <Input v-model="name" placeholder="Enter your team name" class="h-12 text-base" />
      </div>

      <div class="space-y-2">
        <label class="font-semibold text-lg">Add Player</label>
        <div class="flex gap-4">
          <Input v-model="player" placeholder="Player name" class="h-12 text-base flex-1" />
          <Button class="h-12 px-6" @click="addPlayer">Add</Button>
        </div>
      </div>

      <div class="space-y-2">
        <label class="font-semibold text-lg">Players</label>
        <div class="space-y-2 border border-gray-300 bg-gray-50 p-4 rounded-lg max-h-[200px] overflow-y-auto">
          <div
            v-for="(p, index) in players"
            :key="index"
            class="flex justify-between items-center border-b pb-1"
          >
            <span>{{ p }}</span>
            <Button variant="destructive" size="sm" @click="removePlayer(index)">Delete</Button>
          </div>
          <div v-if="players.length === 0" class="text-sm text-gray-500 italic">No players added</div>
        </div>
      </div>

      <div class="pt-6 text-right">
        <Button class="h-12 px-8 text-lg" @click="createTeam">
          Create Team
        </Button>
      </div>
    </div>


    <Popup v-if="showPopup">
      <h2 class="text-lg font-semibold mb-4">Edit Team</h2>

      <div class="mb-4">
        <label class="block mb-1">Team</label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select Team" />
          </SelectTrigger>
          <SelectContent class="z-[10001]">
            <SelectItem value="a">Team A</SelectItem>
            <SelectItem value="b">Team B</SelectItem>
            <SelectItem value="c">Team C</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div class="mb-4">
        <label class="block mb-1">Neuer Name</label>
        <Input v-model="name" placeholder="Neuer Name." />
      </div>

      <div class="mb-4">
        <label class="block mb-1">Add Player</label>

        <div class="flex gap-4">
          <Input v-model="player" placeholder="Player name" class="h-10 text-base flex-1" />
          <Button class="h-10 px-6" @click="addPlayer">Add</Button>
        </div>
      </div>

      <div class="space-y-2">
        <label class="block mb-1">Players</label>

        <div class="space-y-2 border border-gray-300 bg-gray-50 p-4 rounded-lg max-h-[200px] overflow-y-auto">
          <div
            v-for="(p, index) in players"
            :key="index"
            class="flex justify-between items-center border-b pb-1"
          >
            <span>{{ p }}</span>
            <Button variant="destructive" size="sm" @click="removePlayer(index)">Delete</Button>
          </div>
          <div v-if="players.length === 0" class="text-sm text-gray-500 italic">No players added</div>
        </div>
      </div>

      <div class="mt-6 flex justify-end gap-4">
        <Button variant="outline" @click="() => showPopup = false">Cancel</Button>
        <Button @click="apply()">Apply</Button>
      </div>

    </Popup>

  </Page>
</template>

<style scoped>
#teams {
  margin-left: 13rem;
  margin-top: 1rem;
}

#edit-teams-btn {
  margin-left: auto;
  display: block;
  margin-top: -5rem;
  margin-bottom: 3rem;
}
</style>
