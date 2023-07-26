<template>
  <div
    class="relative flex flex-col justify-between items-start h-full overflow-y-scroll"
  >
    <ActionBar
      :node-list="nodeList"
      class="fixed top-2"
      :saving="saving"
      @save="onSave"
      @download="onDownload"
    />

    <!--  Node List  -->
    <ul v-if="rootNode.data" ref="nodeList" class="pt-24 ml-8 space-y-2">
      <LNode
        v-for="node in rootValue"
        :key="node.id"
        :id="node.id"
        v-model:node-key="node.nodeKey"
        v-model:node-value="node.nodeValue"
      />
    </ul>

    <div
      class="fixed top-20 right-8 flex flex-col justify-center items-end space-y-8"
    >
      <AppLegend />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LocaleNode } from '../../types/locale-node';
import LNode from '../../components/shared/locale-node.vue';
import AppLegend from '../../components/locales/legend.vue';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useProjectStore } from '../../stores/project';
import { useRoute, useRouter } from 'vue-router';
import { useCreateNode } from '../../composables/create-node.composable';
import { useShortcutActions } from '../../composables/shortcuts.composable';
import { useAlertStore } from '../../stores/alert';
import { AlertTypes } from '../../types/alert';
import { buildNode } from '../../utils/locale-node.factory';
import ActionBar from '../../components/shared/action-bar.vue';

const projectStore = useProjectStore();
const alertStore = useAlertStore();
const route = useRoute();
const router = useRouter();

const rootNode = reactive<{ data: null | LocaleNode }>({
  data: null,
});
const saving = ref(false);

const { nodeList } = useCreateNode();

const { downloadJson } = useShortcutActions();

const projectTranslationForLang = computed(() => {
  return projectStore.files.find(
    (file) => file.fileName === route.params.language
  );
});

onMounted(() => {
  if (!projectStore.loading) {
    init();
  }
});

watch(
  () => projectStore.loading,
  (newV) => {
    if (!newV) {
      init();
    }
  }
);

watch(
  () => route.params.language,
  (newV, oldV) => {
    if (newV !== oldV) {
      init();
    }
  }
);

const rootValue = computed(() => {
  return rootNode.data ? (rootNode.data.nodeValue as LocaleNode[]) : [];
});

async function init() {
  if (!projectTranslationForLang.value) {
    console.warn(
      'Unable to locate translation file for language',
      route.params.language
    );
    alertStore.addAlert(
      AlertTypes.ERROR,
      `${route.params.language} not found! You must create a translation file first`
    );
    return router.push({
      path: '/',
    });
  }

  let content = await projectStore.getTranslation(
    projectTranslationForLang.value!.fileName
  );

  if (!content) {
    rootNode.data = projectStore.template;
    return;
  }

  rootNode.data = buildNode(
    null,
    content && Object.keys(content).length
      ? content
      : {
          exampleKey: 'example value',
          nestedExample: {
            nestedKey: 'nested example value',
          },
        }
  );
}

function onDownload() {
  if (!rootNode.data) {
    return;
  }
  downloadJson(rootNode.data.nodeValue as LocaleNode[]);
}

async function onSave() {
  saving.value = true;
  if (!rootNode.data) {
    return;
  }

  await projectStore.updateTranslationFile(
    (route.params.language as string) ?? 'template',
    rootNode.data.nodeValue as LocaleNode[]
  );
  alertStore.addAlert(AlertTypes.INFO, `Project template saved!`);
  saving.value = false;
}
</script>

<style scoped lang="scss">
.saveBtn {
  @apply rounded-xl;
}

.spinner {
  @apply animate-spin;
}
</style>
