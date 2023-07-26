<template>
  <li ref="tNode" class="flex flex-col justify-center space-y-2 ml-4">
    <div class="keyValue flex items-center">
      <div class="flex items-center">
        <button
          v-if="!valueIsString"
          tabindex="-1"
          class="fab h-8 w-6 hover:text-teal-600"
          @click="childrenExpanded = !childrenExpanded"
        >
          <span v-if="childrenExpanded"><i class="fas fa-caret-down" /></span>
          <span v-if="!childrenExpanded"><i class="fas fa-caret-right" /></span>
        </button>
        <input
          v-model="editableKey"
          :id="id"
          class="keyInput px-2 border-b-2 border-slate-300 focus:border-teal-600 focus:drop-shadow bg-transparent outline-none"
          :class="{
            'ml-6': valueIsString,
          }"
          type="text"
          @keyup.ctrl.enter="$emit('create-node')"
          @focusin="childrenExpanded = true"
          @blur="$emit('update:node-key', editableKey)"
        />
        <button
          v-if="!valueIsString"
          tabindex="-1"
          title="Convert to text field"
          class="fab ml-4 h-7 w-7 text-xs border-purple-600 bg-purple-600 hover:bg-purple-500 text-purple-50"
          @click="$emit('to-simple')"
        >
          <i class="fas fa-font"></i>
        </button>
        <button
          tabindex="-1"
          class="fab ml-4 h-7 w-7 text-xs border-rose-600 bg-rose-600 hover:bg-rose-500 text-rose-50"
          @click="$emit('delete')"
        >
          <i class="fas fa-trash" />
        </button>

        <button
          v-if="valueIsString"
          tabindex="-1"
          title="Convert to nested field"
          class="fab ml-4 h-7 w-7 text-xs border-teal-800 bg-teal-800 hover:bg-teal-700 text-teal-50"
          @click="$emit('to-nested')"
        >
          <i class="fas fa-sitemap" />
        </button>
      </div>
    </div>

    <!--  hierarchy value  -->
    <ul
      v-if="!valueIsString"
      ref="nodeList"
      class="hierarchy space-y-2 ml-2"
      :class="{
        hidden: !childrenExpanded,
      }"
    >
      <TemplateNode
        v-for="(node, index) in editableValue"
        :id="node.id"
        :key="node.id"
        v-model:node-key="node.nodeKey"
        v-model:node-value="node.nodeValue"
        @delete="openDeleteNodeModal(node)"
        @to-nested="onConvertToNested(node)"
        @to-simple="openConvertNodeModal(node)"
        @create-node="onChildCreateNode(index)"
      />
    </ul>

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
  </li>
</template>

<script lang="ts">
export default {
  name: 'TemplateNode',
};
</script>

<script setup lang="ts">
import type { LocaleNode } from '../../types/locale-node';
import { computed, ref, watch } from 'vue';
import DeleteNodeModal from '../locales/delete-node.modal.vue';
import ConvertNodeModal from '../locales/convert-node.modal.vue';
import { useDeleteNode } from '../../composables/delete-node.composable';
import { useConvertNode } from '../../composables/convert-node.composable';
import { useCreateNode } from '../../composables/create-node.composable';

const props = defineProps<{
  id: string;
  nodeKey: string | null;
  nodeValue: string | LocaleNode[];
}>();

const emit = defineEmits<{
  (e: 'update:node-key', value: string): void;
  (e: 'update:node-value', value: LocaleNode[] | string): void;

  (e: 'delete'): void;
  (e: 'create-node'): void;
  (e: 'to-simple'): void;
  (e: 'to-nested'): void;
}>();

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

const tNode = ref<HTMLLIElement | null>(null);

const editableKey = ref(props.nodeKey);
const editableValue = ref(props.nodeValue as LocaleNode[]);

watch(
  () => props.nodeKey,
  (newV: string | null) => {
    editableKey.value = newV;
  }
);
watch(
  () => props.nodeValue,
  (newV: string | LocaleNode[]) => {
    if (typeof newV === 'string') {
      return;
    }
    editableValue.value = newV;
  }
);

const childrenExpanded = ref(true);

const valueIsString = computed(() => {
  return typeof editableValue.value === 'string';
});

function onDeleteConfirmation() {
  if (valueIsString.value) {
    return;
  }

  editableValue.value = deleteNode(editableValue.value as LocaleNode[]);

  // if there are no more children in the list
  // automatically convert the node to simple form
  if (editableValue.value.length) {
    emit('update:node-value', editableValue.value);
  } else {
    emit('to-simple');
  }
}

function onConvertToNested(node: string | LocaleNode) {
  if (typeof node === 'string') {
    return;
  }
  node.nodeValue = buildNestedNodeValue();
  // it seems that changing the node value of a child, is propagated automatically to the top
  // TODO investigate why its not necessary to emit the update:node-value event here
}

function onChildCreateNode(index: number) {
  editableValue.value = insertNodeInList(
    index,
    editableValue.value as LocaleNode[]
  );
  emit('update:node-value', editableValue.value);
}
</script>
