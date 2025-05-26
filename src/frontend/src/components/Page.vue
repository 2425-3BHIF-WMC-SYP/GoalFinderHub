<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { onMounted, ref } from 'vue'

const props = defineProps<{
  title: string
  description: string
  onInit?: () => Promise<void>
}>()

const isLoading = ref(true)

onMounted(async () => {
  try {
    if (props.onInit) {
      await props.onInit()
    }
  } finally {
    isLoading.value = false
  }
});
</script>

<template>
  <div id="page">
    <Card id="card">
      <div>
        <CardHeader>
          <CardTitle id="title">{{ props.title }}</CardTitle>
          <CardDescription>{{ props.description }}</CardDescription>
        </CardHeader>
        <CardContent v-if="!isLoading">
          <slot />
        </CardContent>
        <div v-else class="flex justify-center items-center min-h-[70vh]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="animate-spin"
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        </div>
      </div>
    </Card>
  </div>
</template>

<style scoped>
#card {
  min-height: 90vh;
}

#title {
  font-size: 1.5rem;
}

#page {
  margin: 1rem 1rem;
}

/*@media (min-width: 768px) {
  #page {
    width: 750px;
  }
}
@media (min-width: 992px) {
  #page {
    width: 970px;
  }
}
@media (min-width: 1200px) {
  #page {
    width: 1200px;
  }
}*/
</style>
