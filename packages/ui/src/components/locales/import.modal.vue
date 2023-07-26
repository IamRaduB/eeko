<template>
  <Modal app-relative size="w-1/3" @dismiss="$emit('close')">
    <div
      class="flex flex-col items-center justify-center px-8 py-12 bg-slate-50 overflow-hidden rounded-2xl"
    >
      <h2 class="font-semibold text-2xl">Import JSON content</h2>

      <textarea
        ref="contentTa"
        v-model.trim="content"
        class="content mt-8 w-full max-h-60 p-2 border-2 border-teal-700 focus:border-teal-500 bg-teal-50 rounded-xl font-mono"
      />

      <div class="mt-4 w-full grid grid-cols-2 gap-8 space-x-8">
        <button
          class="btn flex-grow px-2 py-3 bg-transparent border-2 border-teal-800 hover:border-teal-500 focus:border-teal-500 text-teal-800 focus:text-teal-500 font-semibold rounded-xl"
          @click="$emit('close')"
        >
          Cancel
        </button>

        <button
          ref="importBtn"
          class="btn flex-grow px-2 py-3 bg-teal-800 hover:bg-teal-600 focus:bg-teal-600 text-teal-50 font-semibold rounded-xl"
          @keydown.tab="onFocusOut"
          @click="onConfirm"
        >
          Import
        </button>
      </div>

      <p
        class="mt-8 px-3 py-6 w-full bg-orange-400 text-orange-50 rounded-xl font-semibold"
      >
        Warning: Importing JSON content will overwrite the translation tree!<br />
        It does <b>NOT</b> overwrite the bucket contents.
      </p>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import Modal from '../shared/modal.vue';
import { onMounted, ref } from 'vue';
import { useAlertStore } from '../../stores/alert';
import { AlertTypes } from '../../types/alert';

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'import', content: any): void;
}>();

const alert = useAlertStore();

const content = ref<string>('');
const contentTa = ref<HTMLTextAreaElement | null>(null);
const importBtn = ref(null);

onMounted(() => {
  focusFirst();
});

function focusFirst() {
  contentTa.value!.focus();
}

function onFocusOut($event: any) {
  $event.preventDefault();
  focusFirst();
}

function onConfirm() {
  try {
    const converted = JSON.parse(content.value);
    emit('import', converted);
  } catch (e) {
    alert.addAlert(
      AlertTypes.ERROR,
      'Unable to import provided JSON. Check the console for more information'
    );
    console.error(e);
  }
}
</script>

<style scoped lang="scss">
.content {
  min-height: 10rem;
}
</style>
