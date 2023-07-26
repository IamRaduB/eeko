<template>
  <ul class="fixed bottom-10 right-10 w-fit space-y-2">
    <Alert
      v-for="alert in alertStore.alerts"
      :id="alert.id"
      :variant="alert.type"
      :message="alert.message"
    />
  </ul>
</template>

<script setup lang="ts">
import Alert from './alert.vue';
import { useAlertStore } from '../../../stores/alert';

const alertStore = useAlertStore();
</script>

<style scoped></style>
