<template>
  <label class="flex flex-col">
    <span>{{ label }}</span>
    <input
      ref="input"
      v-model="value"
      :type="inputType"
      :placeholder="props.placeholder"
      class="px-2 py-1 rounded"
      :class="{
        'border border-slate-700': !hasError,
        'border border-red-700': hasError
      }"
      @input="onInput"
      @keyup.enter="$emit('enter-up')"
    >
    <span class="flex flex-col h-4 text-xs text-red-700 text-right" :class="{
      'invisible': !hasError
    }">
      <slot name="error"/>
    </span>
  </label>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { computed } from 'vue';

const props = defineProps<{
  modelValue: string | number
  label?: string
  numeric?: boolean
  placeholder?: string
  initFocus?: boolean
  hasError?: boolean
  password?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void,
  (e: 'enter-up'): void
}>()

const value = ref(props.modelValue)
const input = ref<HTMLInputElement | null>(null)
const inputType = computed(() => props.numeric ? 'number' : props.password ? 'password' : 'text')

onMounted(() => {
  if (props.initFocus) {
    input.value!.focus()
  }
})

function onInput(event: any) {
  emit('update:modelValue', props.numeric ? parseInt(`${value.value}`) : value.value)
}
</script>

<style scoped>

</style>
