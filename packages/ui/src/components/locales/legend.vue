<template>
  <div
    v-show="visible"
    class="relative px-4 py-2 shadow rounded-lg bg-slate-600"
  >
    <button
      class="absolute top-2 right-4 text-orange-50"
      @click="visible = false"
    >
      <i class="fas fa-times" />
    </button>
    <ul
      class="legend w-fit mt-6 mb-2 flex flex-col space-y-2 justify-between"
    >
      <li class="legend-line">
        <code class="code">Ctrl + F</code>
        <span class="info">Default browser search</span>
      </li>
      <li class="legend-line">
        <code class="code">Ctrl + Shift + F</code>
        <span class="info">Focus on top search bar</span>
      </li>
      <li class="h-px w-full bg-slate-500"></li>
      <li class="legend-line">
        <code class="code">Tab/ Sift+Tab</code>
        <span class="info">Navigate through keys and values</span>
      </li>
      <li class="legend-line">
        <code class="code">Ctrl + Enter</code>
        <span class="info">Create new sibling record</span>
      </li>
      <li class="legend-line">
        <code class="code">Shift + Enter</code>
        <span class="info text-slate-400">Convert value to nested structure</span>
      </li>
      <li class="h-px w-full bg-slate-500"></li>
      <li class="legend-line">
        <code class="code">Ctrl + I</code>
        <span class="info">Open import JSON modal</span>
      </li>
      <li class="legend-line">
        <code class="code">Ctrl + D</code>
        <span class="info text-slate-400">Download JSON</span>
      </li>
      <li class="legend-line">
        <code class="code">Ctrl + S</code>
        <span class="info text-slate-400">Save file to bucket</span>
      </li>
      <li class="h-px w-full bg-slate-500"></li>
      <li class="legend-line">
        <code class="code">Ctrl + Shift + L</code>
        <span class="info">Toggle shortcuts description</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

const visible = ref(true)
onMounted(() => {
  document.addEventListener('keydown', onKeyEvent)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeyEvent)
})

function onKeyEvent(ev: KeyboardEvent) {
  if (ev.ctrlKey && ev.shiftKey && ev.code === 'KeyL') {
    ev.preventDefault();
    visible.value = !visible.value
    return false
  }
}
</script>

<style scoped lang="scss">
.legend {
  @apply text-white;
  &-line {
    @apply flex items-center space-x-4 justify-between;
  }
}

.code {
  @apply px-2 font-semibold bg-orange-500 rounded-lg text-white;
}

.info {
  @apply text-sm;
}
</style>
