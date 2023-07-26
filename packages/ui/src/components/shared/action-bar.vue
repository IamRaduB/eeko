<script setup lang="ts">
import { useSearch } from '../../composables/search.composable';
import { onMounted, ref, onBeforeUnmount } from 'vue';

const props = defineProps<{
  nodeList: HTMLUListElement | null;
  saving: boolean;
}>();

const emit = defineEmits<{
  (e: 'download'): void;
  (e: 'import'): void;
  (e: 'save'): void;
}>();

const searchInput = ref<HTMLInputElement | null>(null);

const { searchString, search } = useSearch(ref(props.nodeList));

onMounted(() => {
  searchInput.value!.focus();
  document.addEventListener('keydown', onKeyEvent);
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeyEvent);
});

function onKeyEvent(ev: KeyboardEvent) {
  if (ev.ctrlKey && ev.shiftKey && ev.code === 'KeyF') {
    ev.preventDefault();
    searchInput.value!.focus();
    return false;
  }
  if (ev.ctrlKey && ev.code === 'KeyD') {
    ev.preventDefault();
    emit('download');
    return false;
  }
  if (ev.ctrlKey && ev.code === 'KeyI') {
    ev.preventDefault();
    emit('import');
    return false;
  }
  if (ev.ctrlKey && ev.code === 'KeyS') {
    ev.preventDefault();
    emit('save');
    return false;
  }
}
</script>

<template>
  <div class="searchBar px-8 grid grid-cols-4 gap-4">
    <div class="inputGroup col-span-3 flex items-center">
      <input
        v-model="searchString"
        ref="searchInput"
        tabindex="0"
        type="text"
        placeholder="Example: general.countries.netherlands"
        class="px-4 py-3 w-1/2 flex-grow border-2 border-orange-500 focus:border-orange-400 outline-none text-center rounded-tl-xl rounded-bl-xl drop-shadow-lg text-lg bg-slate-50"
        @keyup.enter="search"
      />
      <button
        class="px-6 py-3 text-lg border-2 border-orange-500 bg-orange-500 hover:bg-orange-400 hover:border-orange-400 rounded-tr-xl rounded-br-xl text-orange-50 drop-shadow-lg"
        @click="search"
      >
        <i class="fas fa-search" />
      </button>
    </div>

    <div class="flex justify-end space-x-3">
      <button
        title="Import JSON"
        class="btn saveBtn px-4 h-full text-2xl border border-purple-600 bg-purple-600 shadow-lg hover:bg-purple-500 rounded-3xl text-purple-50"
        @click="emit('import')"
      >
        <i class="fas fa-file-import" />
      </button>

      <button
        title="Save"
        class="btn saveBtn px-4 h-full text-2xl border border-teal-600 bg-teal-600 shadow-lg hover:bg-teal-500 disabled:bg-teal-400 disabled:border-teal-400 rounded-3xl text-teal-50"
        :disabled="saving"
        @click="emit('save')"
      >
        <i v-if="!saving" class="fas fa-save" />
        <i v-else class="spinner fas fa-spinner-third"></i>
      </button>
    </div>
  </div>
</template>

<style scoped></style>
