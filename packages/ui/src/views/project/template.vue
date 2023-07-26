<template>
  <div class="relative flex flex-col justify-between items-start h-full">
    <div class="placeholder"></div>
    <!--  Action Bar  -->
    <ActionBar
      :node-list="nodeList"
      class="fixed top-2"
      :saving="saving"
      @save="onSave"
      @download="onDownload"
      @import="onImport"
    />

    <div
      class="fixed top-20 right-8 flex flex-col justify-center items-end space-y-8"
    >
      <Legend />

      <button
        class="px-2 py-1 bg-orange-500 text-orange-50 rounded"
        @click="snapshot"
      >
        Snapshot!
      </button>
    </div>

    <!--  Node List  -->
    <ul v-if="rootNode.data" ref="nodeList" class="ml-8 space-y-2 nodeList">
      <TemplateNode
        v-for="(node, index) in rootValue"
        :key="node.id"
        :id="node.id"
        v-model:node-key="node.nodeKey"
        v-model:node-value="node.nodeValue"
        @delete="openDeleteNodeModal(node)"
        @to-nested="onConvertToNested(node)"
        @to-simple="openConvertNodeModal(node)"
        @create-node="onCreateNode(index)"
      />
    </ul>

    <LocalesImportModal
      v-if="importModal"
      @import="onImport"
      @close="toggleImportModal"
    />

    <DeleteNodeModal
      v-if="deleteModal"
      :node="nodeToDelete"
      @close="closeDeleteNodeModal"
      @confirm="onDeleteConfirmation"
    />

    <ConvertNodeModal
      v-if="convertModal"
      :node="nodeToConvert"
      @close="closeConvertNodeModal"
      @confirm="convertNodeToSimple"
    />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import LocalesImportModal from '../../components/locales/import.modal.vue';
import DeleteNodeModal from '../../components/locales/delete-node.modal.vue';
import ConvertNodeModal from '../../components/locales/convert-node.modal.vue';
import { buildNode } from '../../utils/locale-node.factory';
import { useProjectStore } from '../../stores/project';
import TemplateNode from '../../components/shared/template-node.vue';
import type { LocaleNode } from '../../types/locale-node';
import { useDeleteNode } from '../../composables/delete-node.composable';
import { useConvertNode } from '../../composables/convert-node.composable';
import { useCreateNode } from '../../composables/create-node.composable';
import { useImportJson } from '../../composables/import.composable';
import { useShortcutActions } from '../../composables/shortcuts.composable';
import Legend from '../../components/locales/legend.vue';
import { AlertTypes } from '../../types/alert';
import { useAlertStore } from '../../stores/alert';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import ActionBar from '../../components/shared/action-bar.vue';

const projectStore = useProjectStore();
const alertStore = useAlertStore();
const route = useRoute();

const rootNode = reactive<{ data: null | LocaleNode }>({
  data: null,
});
const saving = ref(false);

const {
  deleteModal,
  nodeToDelete,
  openDeleteNodeModal,
  closeDeleteNodeModal,
  deleteNode,
} = useDeleteNode();
const {
  convertModal,
  nodeToConvert,
  closeConvertNodeModal,
  openConvertNodeModal,
  convertNodeToSimple,
  buildNestedNodeValue,
} = useConvertNode();

const { nodeList, insertNodeInList } = useCreateNode();

const { importModal, toggleImportModal, importJson } = useImportJson();

const { downloadJson } = useShortcutActions();

const rootValue = computed(() => {
  return rootNode.data ? (rootNode.data.nodeValue as LocaleNode[]) : [];
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

async function init() {
  if (!projectStore.template) {
    rootNode.data = buildNode(null, {
      exampleKey: 'example value',
      nestedExample: {
        nestedKey: 'nested example value',
      },
    });
  } else {
    rootNode.data = projectStore.template;
  }
}

function onDeleteConfirmation() {
  if (!rootNode.data) {
    return;
  }
  rootNode.data.nodeValue = deleteNode(
    rootNode.data!.nodeValue as LocaleNode[]
  );
}

function onConvertToNested(node: string | LocaleNode) {
  if (typeof node === 'string') {
    return;
  }
  node.nodeValue = buildNestedNodeValue();
}

function onCreateNode(index: number) {
  if (!rootNode.data) {
    return;
  }

  rootNode.data.nodeValue = insertNodeInList(
    index,
    rootNode.data!.nodeValue as LocaleNode[]
  );
}

function onImport(content: unknown) {
  rootNode.data = importJson(content);
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

function onDownload() {
  if (!rootNode.data) {
    return;
  }
  downloadJson(rootNode.data.nodeValue as LocaleNode[]);
}

function snapshot() {
  console.log(rootNode);
}
</script>

<style scoped lang="scss">
.placeholder {
  height: 72px;
}
.nodeList {
  height: calc(100vh - 72px);
  @apply overflow-y-auto pb-20;
}
</style>
