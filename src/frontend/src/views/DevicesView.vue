<script setup lang="ts">
import Page from "@/components/Page.vue";
import Button from "@/components/ui/button/Button.vue";
import {Card, CardContent} from "@/components/ui/card";
import { useRouter } from "vue-router";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { ref } from 'vue';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Slider } from '@/components/ui/slider';

const router = useRouter();
const isDialogOpen = ref(false);
const currentGoalfinder = ref('');
const currentState = ref('');
const currentId = ref(0);
const currentVolume = ref([33]); // Slider expects an array of numbers
const currentLedMode = ref('Normal');

const goalfinders = ref([
  { id: 1, name: 'Goalfinder 1', state: 'On', volume: 33, ledMode: 'Normal' },
  { id: 2, name: 'Goalfinder 2', state: 'Off', volume: 80, ledMode: 'Blink' },
  { id: 3, name: 'Goalfinder 3', state: 'On', volume: 60, ledMode: 'Flash' },
  { id: 4, name: 'Goalfinder 4', state: 'Off', volume: 30, ledMode: 'Off' }
]);

const openEditDialog = (goalfinder: {id: number, name: string, state: string, volume: number, ledMode: string}) => {
  currentId.value = goalfinder.id;
  currentGoalfinder.value = goalfinder.name;
  currentState.value = goalfinder.state;
  currentVolume.value = [goalfinder.volume]; // Convert to array for Slider
  currentLedMode.value = goalfinder.ledMode;
  isDialogOpen.value = true;
};

const deleteGoalfinder = (id: number) => {
  goalfinders.value = goalfinders.value.filter(g => g.id !== id);
};

const saveChanges = () => {
  const index = goalfinders.value.findIndex(g => g.id === currentId.value);
  if (index !== -1) {
    goalfinders.value[index] = {
      ...goalfinders.value[index],
      name: currentGoalfinder.value,
      state: currentState.value,
      volume: currentVolume.value[0], // Get first value from array
      ledMode: currentLedMode.value
    };
  }
  isDialogOpen.value = false;
};

const updateVolume = (value: number[]) => {
  currentVolume.value = value;
};

const updateLedMode = (value: string) => {
  currentLedMode.value = value;
};
</script>

<template>
  <main>
    <Page title="Overview" description="Overview of all Goalfinders">
      <div class="header-container">
        <Button
          id="add-goalfinder-btn"
          @click="router.push('/addGoalfinder')"
          variant="outline"
          size="sm"
        >
          Add Goalfinder
        </Button>
      </div>

      <div class="goalfinder-grid">
        <Card
          v-for="goalfinder in goalfinders"
          :key="goalfinder.id"
          class="goalfinder-card"
        >
          <CardContent class="card-content">
            <h3 class="card-title">{{ goalfinder.name }}</h3>
            <div class="state-row">
              <span class="state-label">Current State: </span>
              <Button class="state-value">{{ goalfinder.state }}</Button>
            </div>
            <div class="card-footer">
              <div class="action-row">
                <Button
                  variant="link"
                  size="sm"
                  class="delete-btn"
                  @click="deleteGoalfinder(goalfinder.id)"
                >
                  Delete
                </Button>
                <Button
                  variant="link"
                  size="sm"
                  class="edit-btn"
                  @click="openEditDialog(goalfinder)"
                >
                  Edit
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Page>

    <Dialog v-model:open="isDialogOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit {{ currentGoalfinder }}</DialogTitle>
          <DialogDescription>
            Make changes to your Goalfinder here.
          </DialogDescription>
        </DialogHeader>

        <div class="edit-form">
          <div class="form-section">
            <h4>Name</h4>
            <input
              type="text"
              class="name-input"
              v-model="currentGoalfinder"
            />
          </div>

          <div class="form-section">
            <h4>Current State</h4>
            <div class="state-toggle">
              <Button
                :variant="currentState === 'On' ? 'default' : 'outline'"
                size="sm"
                @click="currentState = 'On'"
              >
                On
              </Button>
              <Button
                :variant="currentState === 'Off' ? 'default' : 'outline'"
                size="sm"
                @click="currentState = 'Off'"
              >
                Off
              </Button>
            </div>
          </div>

          <div class="form-section">
            <h4>Lautstärke</h4>
            <div class="volume-control">
              <Slider
                v-model="currentVolume"
                :max="100"
                :step="1"
                class="w-full"
              />
              <span>{{ currentVolume[0] }}%</span>
            </div>
            <div class="led-mode">
              <h5>LED Modus</h5>
              <Select v-model="currentLedMode" @update:modelValue="updateLedMode">
                <SelectTrigger>
                  <SelectValue placeholder="Select Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Blink">Blink</SelectItem>
                  <SelectItem value="Flash">Flash</SelectItem>
                  <SelectItem value="Normal">Normal</SelectItem>
                  <SelectItem value="Off">Off</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div class="dialog-footer">
          <Button variant="outline" @click="isDialogOpen = false">Cancel</Button>
          <Button @click="saveChanges">Save changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  </main>
</template>

<style scoped>
.header-container {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.5rem;
}

#add-goalfinder-btn {
  border: 1px solid #e2e8f0;
  background-color: black;
  color: white;
  padding: 1rem;
}

.goalfinder-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
}

.goalfinder-card {
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  box-shadow: none;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 200px;
}

.card-content {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.card-title {
  text-align: center;
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 0.75rem 0;
  color: #1e293b;
}

.state-row {
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
}

.state-label {
  color: #64748b;
}

.state-value {
  color: white;
  background-color: black;
  padding: 0.1rem 1rem;
  margin-left: 0.5rem;
  border: none;
  cursor: default;
}

.card-footer {
  margin-top: auto;
  display: flex;
  justify-content: flex-end;
  padding-top: 1rem;
}

.action-row {
  display: flex;
  gap: 0.5rem;
}

.delete-btn {
  border: 1px solid lightgray;
  color: black;
  padding: 0.5rem 1rem;
  height: auto;
  background-color: white;
}

.edit-btn {
  border: 1px solid lightgray;
  color: black;
  background-color: lightgray;
  padding: 0.5rem 1.5rem;
  height: auto;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin: 1.5rem 0;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.form-section h4 {
  font-size: 0.875rem;
  font-weight: 500;
  margin: 0;
}

.name-input {
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
}

.state-toggle {
  display: flex;
  gap: 0.5rem;
}

.volume-control {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.led-mode {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.led-mode h5 {
  font-size: 0.875rem;
  font-weight: 500;
  margin: 0;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
}
</style>
