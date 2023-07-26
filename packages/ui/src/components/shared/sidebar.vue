<script setup lang="ts">
import { useProjectStore } from '../../stores/project';
import { ref } from 'vue';
import AddLocaleModal from '../locales/add-locale.modal.vue';

const projectStore = useProjectStore();

const addTranslationToggle = ref(false);

function toggleAddTranslation() {
  addTranslationToggle.value = !addTranslationToggle.value;
}

async function onStart(locales: string[]) {
  const promises = locales.map((localeName) => {
    return projectStore.createTranslationFile(localeName);
  });

  await Promise.all(promises);

  toggleAddTranslation();
}
</script>

<template>
  <nav
    class="fixed h-screen flex flex-col py-4 space-y-8 items-center w-24 bg-teal-700 text-white"
  >
    <RouterLink to="/" class="px-4 w-full text-2xl text-center font-medium">
      <img src="/images/eeko-logo.png" alt="logo" class="avatar rounded-full" />
    </RouterLink>

    <div class="flex-1 px-4 flex flex-col space-y-8 overflow-y-auto">
      <RouterLink
        :to="{ name: 'template' }"
        active-class="border-orange-400"
        title="Template"
        class="px-4 py-2 text-center text-xl font-semibold border-b-2 transform duration-150 border-teal-500 hover:border-orange-400 cursor-pointer"
      >
        <i class="fas fa-sitemap"></i>
      </RouterLink>

      <RouterLink
        v-for="file in projectStore.filesExceptTemplate"
        :key="file.fileName"
        :to="{ path: `/project/${file.fileName}` }"
        active-class="border-orange-400"
        class="flex items-center justify-center space-x-2 text-center text-xl font-semibold border-b-2 transform duration-150 border-teal-500 hover:border-orange-400 cursor-pointer"
      >
        <span class="relative">
          {{ file.fileName.toUpperCase() }}
          <i
            v-if="!file.valid"
            class="text-sm fas fa-exclamation-triangle text-yellow-500"
          />
        </span>
      </RouterLink>
      <div class="w-full flex flex-col items-center justify-center">
        <button
          class="btn text-xl w-full py-3 flex items-center justify-center bg-orange-500 hover:bg-orange-400"
          @click="toggleAddTranslation"
        >
          <i class="fas fa-plus"></i>
        </button>
      </div>
    </div>

    <div class="px-6 flex flex-col items-center justify-center">
      <div class="w-full">
        <img
          src="/images/idle-logo.gif"
          alt="logo"
          class="avatar rounded-full w-full h-auto"
        />
      </div>
    </div>

    <AddLocaleModal
      v-if="addTranslationToggle"
      @start="onStart"
      @close="toggleAddTranslation"
    />
  </nav>
</template>

<style scoped lang="scss">
.avatar {
  image-rendering: pixelated;
}
</style>
