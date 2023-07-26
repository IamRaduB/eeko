<template>
<button class="px-3 py-2 rounded transform duration-300 cursor-pointer border" :class="[variants[variant]]"><slot /></button>
</template>

<script setup lang="ts">
const variants = {
  primary: 'bg-teal-700 hover:bg-teal-600 border-teal-700 hover:border-teal-600 text-teal-50',
  secondary: 'bg-slate-700 hover:bg-slate-600 border-slate-700 hover:border-slate-600 text-slate-50',
  danger: 'bg-red-700 hover:bg-red-600 border-red-700 hover:border-red-600 text-red-50'
}

const props = defineProps<{
  variant: keyof typeof variants
}>()
</script>

<style scoped>

</style>
