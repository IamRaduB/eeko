<template>
  <li ref="lNode" class="flex flex-col justify-center space-y-2 ml-4">
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
      </div>

      <!--  string value  -->
      <div class="flex items-center">
        <input
          v-if="valueIsString"
          v-model="editableValue"
          class="valueInput ml-2 px-2 bg-transparent border-b-2 border-slate-300 focus:border-teal-600 focus:drop-shadow outline-none"
          type="text"
          @input="$emit('update:node-value', editableValue)"
        />
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
      <LNode
        v-for="node in editableValue"
        :id="node.id"
        :key="node.id"
        v-model:node-key="node.nodeKey"
        v-model:node-value="node.nodeValue"
      />
    </ul>
  </li>
</template>

<script lang="ts">
export default {
  name: 'LNode',
};
</script>

<script setup lang="ts">
import type { LocaleNode } from '../../types/locale-node';
import { computed, ref, watch } from 'vue';
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

const { nodeList } = useCreateNode();

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
</script>
