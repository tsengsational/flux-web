<script setup lang="ts">
/**
 * NestedList.vue
 * A recursive component to render nested lists from EditorJS.
 */
interface ListItem {
  content: string;
  items: ListItem[];
}

const props = defineProps<{
  items: ListItem[];
  listStyle: 'unordered' | 'ordered';
}>();
</script>

<template>
  <component 
    :is="listStyle === 'ordered' ? 'ol' : 'ul'" 
    :class="[
      listStyle === 'ordered' ? 'list-decimal' : 'list-disc',
      'space-y-2 ml-4 mb-4 text-lg leading-relaxed'
    ]"
  >
    <li v-for="(item, index) in items" :key="index" class="marker:text-brand-500">
      <span v-html="item.content"></span>
      <!-- Recursive call for nested items -->
      <NestedList 
        v-if="item.items && item.items.length > 0" 
        :items="item.items" 
        :list-style="listStyle" 
        class="mt-2"
      />
    </li>
  </component>
</template>

<style scoped>
/* Ensure nested lists have appropriate indentation */
ul, ol {
  padding-left: 1.5rem;
  list-style-position: outside;
}

li {
  padding-left: 0.5rem;
}
</style>
