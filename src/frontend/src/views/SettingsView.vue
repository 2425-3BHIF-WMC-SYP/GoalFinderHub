<script setup lang="ts">
import { ref } from "vue";
import Page from "@/components/Page.vue";
import { Button } from "@/components/ui/button";

const macAddress = ref("");
const ipAddress = ref("");
const version = ref(import.meta.env.VITE_APP_VERSION);

const fetchSettings = async () => {
  try {
    const settings: Settings = await fetchRestEndpoint("/settings", "GET");

    if (settings) {
      macAddress.value = settings.macAddress.toUpperCase();
      ipAddress.value = settings.ipAddress;
    }
  }
  catch (error) {
    console.error(error);
  }
}

const handleRestart = () => {
  alert("System is restarting...");
};

const handleUpdate = () => {
  alert("Performing system update...");
};

onMounted(async () => {
  await fetchSettings();
});
</script>

<template>
  <main>
    <Page title="Settings" description="Configure system settings.">
      <div class="space-y-8 mt-6">

        <section class="space-y-2">
          <h2 class="text-lg font-semibold">System Information</h2>
          <p><strong>MAC Address:</strong> {{ macAddress }}</p>
          <p><strong>IP Address:</strong> {{ ipAddress }}</p>
          <p><strong>Version:</strong> {{ version }}</p>
        </section>

        <section class="space-y-2">
          <h2 class="text-lg font-semibold">Actions</h2>
          <div class="flex gap-4">
            <Button @click="handleRestart" variant="outline">Restart</Button>
            <Button @click="handleUpdate">Update</Button>
          </div>
        </section>

      </div>
    </Page>
  </main>
</template>
