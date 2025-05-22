<script setup lang="ts">
import Page from '@/components/Page.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { fetchRestEndpoint } from '@/fetch-rest-endpoint.ts'
import { type Device } from '@/model/model.ts'

const router = useRouter()
const devices = ref<Device[]>([])
const loading = ref(true)

// Dialog state
const isDialogOpen = ref(false)
const currentDevice = ref<Device>({
  macAddress: '',
  name: '',
  volume: 50,
  ledMode: 'Normal',
})
const currentVolume = ref([50])
const currentLedMode = ref('Normal')

const fetchDevices = async () => {
  try {
    devices.value = await fetchRestEndpoint('/devices', 'GET')
  } catch (error) {
    console.error('Error fetching devices:', error)
  } finally {
    loading.value = false
  }
}

const deleteDevice = async (macAddress: string) => {
  try {
    const response = await fetchRestEndpoint(`/devices/${macAddress}`, 'DELETE')
    await fetchDevices()
  } catch (error) {
    console.error('Error deleting device:', error)
  }
}
const openEditDialog = (Device: Device) => {
  currentDevice.value = {
    ...Device,
    volume: Device.volume || 50,
    ledMode: Device.ledMode || 'Normal',
  }
  currentVolume.value = [currentDevice.value.volume || 50]
  currentLedMode.value = currentDevice.value.ledMode || 'Normal'
  isDialogOpen.value = true
}

const saveChanges = async () => {
  try {
    /*const response = await fetch(
      `http://localhost:3000/api/devices/${currentDevice.value.macAddress}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: currentDevice.value.name,
        }),
      },
    )*/

    const response = await fetchRestEndpoint(
      `/devices/${currentDevice.value.macAddress}`,
      'PUT',
      {
        name: currentDevice.value.name,
      },
    )

    await fetchDevices()
    isDialogOpen.value = false
  } catch (error) {
    console.error('Error updating device:', error)
  }
}

onMounted(fetchDevices)
</script>

<template>
  <main>
    <Page title="Overview" description="Overview of all Devices.">
      <div class="header-container">
        <Button @click="router.push('/addDevice')">Add Device</Button>
      </div>

      <div v-if="loading" class="text-muted-foreground">Loading devices...</div>
      <div v-else-if="devices.length === 0" class="text-muted-foreground">
        No Device added yet.
      </div>

      <div class="devices-grid">
        <Card v-for="device in devices" :key="device.macAddress" class="device-card">
          <CardContent class="card-content">
            <h3 class="card-title">{{ device.name }}</h3>
            <p class="card-mac">{{ device.macAddress }}</p>

            <div class="card-footer">
              <div class="action-row">
                <Button @click="openEditDialog(device)"
                >Edit
                </Button>
                <Button
                  variant="destructive"
                  @click="deleteDevice(device.macAddress)"
                >Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog v-model:open="isDialogOpen">
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit {{ currentDevice.name }}</DialogTitle>
            <DialogDescription>Make changes to your Device here.</DialogDescription>
          </DialogHeader>

          <div class="edit-form">
            <div class="form-section">
              <h4>Name</h4>
              <Input v-model="currentDevice.name" placeholder="Device Name" />
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
  </main>
</template>

<style scoped>
.header-container {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.5rem;
}

.devices-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}

.device-card {
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  display: flex;
  flex-basis: 33%;
  flex-grow: 1;
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
