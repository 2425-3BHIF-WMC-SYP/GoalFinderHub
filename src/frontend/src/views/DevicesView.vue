<script setup lang="ts">
import Page from '@/components/Page.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
   Dialog,
   DialogClose,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
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
import { ref } from 'vue'
import { fetchRestEndpoint } from '@/fetch-rest-endpoint.ts'
import { type Device } from '@/model/model.ts'

const router = useRouter()
const devices = ref<Device[]>([])
const loading = ref(true)

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
      devices.value.forEach((device) => {
         device.volume = device.volume || 50
         device.ledMode = device.ledMode || 'Normal'
      })
   } catch (error) {
      console.error('Error fetching devices:', error)
   } finally {
      loading.value = false
   }
}

const deleteDevice = async (macAddress: string) => {
   try {
      await fetchRestEndpoint(`/devices/${macAddress}`, 'DELETE')
      await fetchDevices()
   } catch (error) {
      console.error('Error deleting device:', error)
   }
}

const openEditDialog = (device: Device) => {
   currentDevice.value = {
      ...device,
      volume: device.volume || 50,
      ledMode: device.ledMode || 'Normal',
   }
   currentVolume.value = [currentDevice.value.volume!]
   currentLedMode.value = currentDevice.value.ledMode!
}

const saveChanges = async () => {
   try {
      await fetchRestEndpoint(`/devices/${currentDevice.value.macAddress}`, 'PUT', {
         name: currentDevice.value.name,
      })

      const deviceIndex = devices.value.findIndex(
         (d) => d.macAddress === currentDevice.value.macAddress,
      )
      if (deviceIndex !== -1) {
         devices.value[deviceIndex] = {
            ...devices.value[deviceIndex],
            name: currentDevice.value.name,
            volume: currentVolume.value[0],
            ledMode: currentLedMode.value,
         }
      }
   } catch (error) {
      console.error('Error updating device:', error)
   }
}

async function onInit() {
   try {
      await fetchDevices()
   } catch (error) {
      console.error(error)
   }
}
</script>
<template>
   <main>
      <Page title="Devices" description="Overview of all Devices." :on-init="onInit">
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
                  <p class="card-mac">{{ device.ipAddress }}</p>

                  <div class="device-details">
                     <div class="detail-row">
                        <span class="detail-label">Volume:</span>
                        <span class="detail-value">{{ device.volume || 50 }}%</span>
                     </div>
                     <div class="detail-row">
                        <span class="detail-label">LED Mode:</span>
                        <span class="detail-value">{{ device.ledMode || 'Normal' }}</span>
                     </div>
                     <div class="detail-row">
                        <span class="detail-label">Status: </span>
                        <span class="detail-value">{{ device.isActive ? 'On' : 'Off' }}</span>
                     </div>
                  </div>

                  <div class="card-footer">
                     <div class="action-row">
                        <Dialog>
                           <DialogTrigger>
                              <Button @click="openEditDialog(device)">Edit</Button>
                           </DialogTrigger>
                           <DialogContent>
                              <DialogHeader>
                                 <DialogTitle>Edit {{ currentDevice.name }}</DialogTitle>
                                 <DialogDescription
                                    >Make changes to your Device here.
                                 </DialogDescription>
                              </DialogHeader>

                              <div class="edit-form">
                                 <div class="form-section">
                                    <h4>Name</h4>
                                    <Input v-model="currentDevice.name" placeholder="Device Name" />
                                 </div>

                                 <div class="form-section">
                                    <h4>Volume</h4>
                                    <div class="volume-control">
                                       <Slider
                                          v-model="currentVolume"
                                          :max="100"
                                          :step="1"
                                          class="w-full"
                                       />
                                       <span>{{ currentVolume[0] }}%</span>
                                    </div>
                                 </div>

                                 <div class="form-section">
                                    <h4>LED Mode</h4>
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
                              <DialogFooter>
                                 <DialogClose>
                                    <Button variant="outline">Cancel</Button>
                                 </DialogClose>
                                 <DialogClose>
                                    <Button @click="saveChanges">Save changes</Button>
                                 </DialogClose>
                              </DialogFooter>
                           </DialogContent>
                        </Dialog>
                        <Button variant="destructive" @click="deleteDevice(device.macAddress)"
                           >Delete
                        </Button>
                     </div>
                  </div>
               </CardContent>
            </Card>
         </div>
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
   margin-bottom: 0.5rem;
}

.device-details {
   margin: 1rem 0;
   padding: 0.75rem;
   background-color: #f8fafc;
   border-radius: 0.5rem;
}

.detail-row {
   display: flex;
   justify-content: space-between;
   margin-bottom: 0.5rem;
}

.detail-row:last-child {
   margin-bottom: 0;
}

.detail-label {
   font-weight: 500;
   color: #334155;
}

.detail-value {
   color: #475569;
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

.volume-control {
   display: flex;
   align-items: center;
   gap: 1rem;
}
</style>
