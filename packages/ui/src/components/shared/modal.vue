<template>
  <div
    ref="modal"
    class="fixed flex z-modal w-full h-full inset-0 bg-black bg-opacity-50"
    :class="[props.bgColor, props.bgOpacity, props.inset]"
    @keydown.esc.stop="dismiss"
  >
    <div
      class="mask absolute top-0 left-0 w-full h-full"
      @click.stop="dismiss"
    />
    <div
      class="flex flex-col self-center mx-auto relative"
      :class="[props.size]"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';

  const props = defineProps<{
    bgColor?: string
    bgOpacity?: string
    size?: string
    hasClose?: boolean
    appRelative?: boolean
    inset?: string
  }>()
  const emit = defineEmits<{
    (e: 'dismiss'): void
  }>()

  const modal = ref(null)

  onMounted(() => {
    if (props.appRelative && modal.value) {
      const appWrapper = document?.getElementById('app')
      if (appWrapper) appWrapper.appendChild(modal.value as Node)
    }
  })

  function dismiss() {
    emit('dismiss')
  }
</script>

<style scoped>

</style>
