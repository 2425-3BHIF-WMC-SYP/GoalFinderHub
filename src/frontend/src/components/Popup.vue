<script setup lang="ts">
</script>

<template>

  <div class="popup">
    <div class="popups-inner">
      <slot/>
    </div>
  </div>

</template>

<style scoped>
.popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.2);

  display: flex;
  align-items: center;
  justify-content: center;
}

.popups-inner {
  position: relative;
  z-index: 10000;
  background: #FFFFFF;
  padding: 2rem;
  border-radius: 0.5rem;
}
</style>
