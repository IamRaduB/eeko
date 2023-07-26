<template>
  <Modal app-relative size="w-1/3" @dismiss="$emit('close')">
    <div
      class="flex flex-col items-center justify-center px-8 py-12 bg-slate-50 overflow-hidden rounded-2xl"
    >
      <h2 class="font-semibold text-2xl">New Translation</h2>

      <p class="mt-8 font-semibold text-lg">
        How many locales would you like to create?
      </p>
      <div class="mt-2 flex items-start space-x-2">
        <UiInput
          v-model="createCount"
          init-focus
          numeric
          @enterUp="setNumberOfLocales"
        />
        <div class="">
          <button
            class="btn px-3 py-1 h-full bg-orange-500 hover:bg-orange-400 text-orange-50 font-semibold text-lg"
            @click="setNumberOfLocales"
          >
            Set
          </button>
        </div>
      </div>

      <template v-if="numberSet">
        <div
          ref="localeContainer"
          class="mt-4 flex flex-col items-center justify-center space-x-2"
        >
          <UiInput
            v-for="(lang, index) in locales.length"
            :key="index"
            v-model="locales[index]"
            type="text"
            placeholder="Locale name"
            class="localeName"
            @enterUp="onStart"
          />
        </div>

        <button
          class="mt-4 w-48 px-3 py-2 bg-teal-700 hover:bg-teal-600 text-xl font-semibold transform text-teal-50 rounded-xl"
          @click="onStart"
        >
          Start
        </button>
      </template>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import UiInput from '../shared/ui-input.vue';
import Modal from '../shared/modal.vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const createCount = ref(0);
let locales = reactive<string[]>([]);
const numberSet = ref(false);
const localeContainer = ref<HTMLDivElement | null>(null);

const emit = defineEmits<{
  (e: 'start', locales: string[]): void;
  (e: 'close'): void;
}>();

function setNumberOfLocales() {
  if (createCount.value <= 0) {
    return;
  }

  locales.splice(0, locales.length);
  for (let i = 0; i < createCount.value; i++) {
    locales.push('');
  }
  numberSet.value = true;

  setTimeout(() => {
    (
      localeContainer.value!.querySelector('.localeName') as HTMLInputElement
    ).focus();
  });
}

function onStart() {
  if (locales.every((loc) => !!loc)) {
    emit('start', locales);
  }
}
</script>

<style scoped></style>
