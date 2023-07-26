<template>
  <div class="h-full">
    <Sidebar />

    <div class="h-full pl-32">
      <RouterView />
    </div>

    <AlertList />
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import AlertList from './components/shared/alert/alert-list.vue';
import { useRouter } from 'vue-router';
import { useProjectStore } from './stores/project';
import Sidebar from './components/shared/sidebar.vue';

const router = useRouter();
const projectStore = useProjectStore();

onBeforeMount(async () => {
  await projectStore.listProjectFiles();
});
</script>

<style scoped lang="scss">
.router-link-exact-active {
  @apply border-orange-400;
}
</style>
