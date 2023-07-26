<template>
  <Modal app-relative size="w-1/3" @dismiss="$emit('close')">
    <div
      class="flex flex-col items-center justify-center px-8 py-12 bg-slate-50 overflow-hidden rounded-2xl"
    >
      <h2 class="font-semibold text-2xl">Warning!</h2>

      <p class="mt-8">Are you sure you want to delete the selected node?</p>

      <div class="mt-4 w-full flex items-stretch justify-center space-x-8">
        <button
          ref="noBtn"
          class="btn flex-grow px-2 py-3 bg-transparent border-2 border-teal-800 hover:border-teal-500 focus:border-teal-500 text-teal-800 font-semibold rounded-xl"
          @click="$emit('close')"
        >
          No
        </button>

        <button
          class="btn flex-grow px-2 py-3 bg-teal-800 hover:bg-teal-600 focus:bg-teal-600 text-teal-50 font-semibold rounded-xl"
          @click="$emit('confirm')"
        >
          Yes!
        </button>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Modal from '../shared/modal.vue';
const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'confirm'): void;
}>();
const noBtn = ref<HTMLButtonElement | null>(null);

onMounted(() => {
  noBtn.value!.focus();
});
</script>

<style scoped></style>
