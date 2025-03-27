<script setup lang="ts">
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

const props = defineProps<{
  title: string;
  description: string;
}>();
</script>

<template>
  <div id="page">
    <Card id="card">
      <CardHeader>
        <CardTitle id="title">{{title}}</CardTitle>
        <CardDescription>{{description}}</CardDescription>
      </CardHeader>
      <CardContent>
        <slot/>
      </CardContent>
    </Card>
  </div>
</template>

<style scoped>
#page {
  margin: 1rem auto;
}

#card {
  min-height: 90vh;
}

#title {
  font-size: 1.5rem;
}

@media (min-width: 768px) {
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
}
</style>
