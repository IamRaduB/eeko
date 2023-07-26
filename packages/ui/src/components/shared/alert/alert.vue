<template>
  <li class="alert" :class="variant">
    {{ message }}
  </li>
</template>

<script setup lang="ts">
import { AlertTypes } from '../../../types/alert';
import { onMounted } from 'vue';
import { useAlertStore } from '../../../stores/alert';

const props = defineProps<{
  id: string;
  variant: AlertTypes;
  message: string;
}>();

const alertStore = useAlertStore();

onMounted(() => {
  setTimeout(() => {
    alertStore.removeAlert(props.id);
  }, 5000);
});
</script>

<style scoped lang="scss">
.alert {
  @apply px-3 py-2 text-sm font-bold rounded-xl shadow;

  &.info {
    @apply bg-sky-500 text-sky-50;
  }
  &.error {
    @apply bg-rose-700 text-rose-50;
  }
}
</style>
