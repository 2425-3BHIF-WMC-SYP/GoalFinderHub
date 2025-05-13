// src/stores/goalFinderStore.ts
import { ref } from 'vue'

export interface Goalfinder {
  id: number
  name: string
  state: 'On' | 'Off'
}

export const goalfinders = ref<Goalfinder[]>([])
