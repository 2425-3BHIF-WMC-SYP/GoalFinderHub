<script setup lang="ts">
import Page from "@/components/Page.vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from '@/components/ui/slider';
import { Input } from "@/components/ui/input";
import { useRouter } from "vue-router";
import { onMounted, ref } from 'vue';

interface Goalfinder {
  MacAddress: string;
  Name: string;
  State?: string;
  Volume?: number;
  LedMode?: string;
}

const router = useRouter();
const goalfinders = ref<Goalfinder[]>([]);
const loading = ref(true);

// Dialog state
const isDialogOpen = ref(false);
const currentGoalfinder = ref<Goalfinder>({
  MacAddress: '',
  Name: '',
  State: 'Off',
  Volume: 50,
  LedMode: 'Normal'
});
const currentVolume = ref([50]);
const currentLedMode = ref('Normal');

const fetchDevices = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/devices');
    if (!response.ok) {
      throw new Error('Error fetching devices');
    }
    const data = await response.json();
    goalfinders.value = data;
  } catch (error) {
    console.error("Error fetching devices:", error);
  } finally {
    loading.value = false;
  }
};

const deleteGoalfinder = async (macAddress: string) => {
  try {
    const response = await fetch(`http://localhost:3000/api/devices/${macAddress}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error deleting device');
    await fetchDevices();
  } catch (error) {
    console.error("Error deleting device:", error);
  }
};
const openEditDialog = (goalfinder: Goalfinder) => {
  currentGoalfinder.value = {
    ...goalfinder,
    State: goalfinder.State || 'Off',
    Volume: goalfinder.Volume || 50,
    LedMode: goalfinder.LedMode || 'Normal'
  };
  currentVolume.value = [currentGoalfinder.value.Volume || 50];
  currentLedMode.value = currentGoalfinder.value.LedMode || 'Normal';
  isDialogOpen.value = true;
};


const saveChanges = async () => {
  try {
    const response = await fetch(`http://localhost:3000/api/devices/${currentGoalfinder.value.MacAddress}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: currentGoalfinder.value.Name,
      })
    });

    if (!response.ok) throw new Error('Error updating device');
    await fetchDevices();
    isDialogOpen.value = false;
  } catch (error) {
    console.error("Error updating device:", error);
  }
};


onMounted(fetchDevices);
</script>

<template>
  <Page title="Overview" description="Overview of all GoalFinders." id="devices">
    <div class="header-container">
      <Button @click="router.push('/addDevice')" variant="outline" size="sm">Add Goalfinder</Button>
    </div>

    <div v-if="loading" class="text-muted-foreground">Loading devices...</div>
    <div v-else-if="goalfinders.length === 0" class="text-muted-foreground">No Goalfinder added yet.</div>

    <div class="goalfinder-grid">
      <Card v-for="goalfinder in goalfinders" :key="goalfinder.MacAddress" class="goalfinder-card">
        <CardContent class="card-content">
          <h3 class="card-title">{{ goalfinder.Name }}</h3>
          <p class="card-mac">{{ goalfinder.MacAddress }}</p>

          <div class="card-footer">
            <div class="action-row">
              <Button variant="link" size="sm" class="delete-btn" @click="deleteGoalfinder(goalfinder.MacAddress)">Delete</Button>
              <Button variant="link" size="sm" class="edit-btn" @click="openEditDialog(goalfinder)">Edit</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <Dialog v-model:open="isDialogOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit {{ currentGoalfinder.Name }}</DialogTitle>
          <DialogDescription>Make changes to your Goalfinder here.</DialogDescription>
        </DialogHeader>

        <div class="edit-form">
          <div class="form-section">
            <h4>Name</h4>
            <Input v-model="currentGoalfinder.Name" placeholder="GoalFinder Name" />
          </div>

          <div class="form-section">
            <h4>Lautstärke</h4>
            <div class="volume-control">
              <Slider v-model="currentVolume" :max="100" :step="1" class="w-full" />
              <span>{{ currentVolume[0] }}%</span>
            </div>
          </div>

          <div class="form-section">
            <h4>LED Modus</h4>
            <Select v-model="currentLedMode">
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

        <div class="dialog-footer">
          <Button variant="outline" @click="isDialogOpen = false">Cancel</Button>
          <Button @click="saveChanges">Save changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  </Page>
</template>

<style scoped>
.header-container {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.5rem;
}

#devices {
  margin-left: 13rem;
  margin-top: 1rem;
}

.goalfinder-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
}

.goalfinder-card {
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
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
  margin-bottom: 0.5rem;
  color: #1e293b;
}

.card-mac {
  text-align: center;
  font-size: 0.875rem;
  color: #475569;
  margin-bottom: auto;
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
  background-color: white;
}

.edit-btn {
  border: 1px solid lightgray;
  color: black;
  padding: 0.5rem 1rem;
  background-color: lightgray;
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

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
}
</style>
