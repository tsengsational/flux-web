<script setup lang="ts">
/**
 * BlockRenderer.vue
 * Renders content from Directus, supporting both standard HTML (WYSIWYG)
 * and the structured JSON format from the Block Editor (EditorJS).
 */

interface Block {
  type: string;
  data: any;
}

interface EditorData {
  time?: number;
  blocks: Block[];
  version?: string;
}

const props = defineProps<{
  content: string | EditorData | null | undefined;
}>();

/**
 * Detect if content is EditorJS JSON or raw HTML
 */
const isEditorJS = computed(() => {
  if (!props.content) return false;
  
  // If it's already an object (from the SDK)
  if (typeof props.content === 'object' && props.content.blocks) return true;
  
  // If it's a string, it might be stringified JSON or raw HTML
  if (typeof props.content === 'string') {
    const trimmed = props.content.trim();
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      try {
        const parsed = JSON.parse(props.content);
        return parsed && Array.isArray(parsed.blocks);
      } catch (e) {
        return false;
      }
    }
  }
  return false;
});

const parsedData = computed<EditorData | null>(() => {
  if (!props.content) return null;
  if (typeof props.content === 'object' && props.content.blocks) return props.content;
  
  if (typeof props.content === 'string') {
    try {
      return JSON.parse(props.content);
    } catch (e) {
      return null;
    }
  }
  return null;
});

const { getAssetUrl } = useDirectus();
</script>

<template>
  <div class="block-renderer">
    <!-- Case 1: Simple HTML (WYSIWYG) -->
    <div 
      v-if="!isEditorJS" 
      class="block-renderer__html prose prose-invert prose-lg max-w-none"
      v-html="content"
    />

    <!-- Case 2: Structured Blocks (EditorJS) -->
    <div v-else-if="parsedData" class="block-renderer__blocks space-y-6">
      <template v-for="(block, index) in parsedData.blocks" :key="index">
        <!-- Header -->
        <component 
          :is="`h${block.data.level || 2}`"
          v-if="block.type === 'header'"
          class="font-serif font-bold text-stage-900 mt-12 mb-6"
          :class="{
            'text-4xl lg:text-5xl': (block.data.level === 1),
            'text-3xl lg:text-4xl': (block.data.level === 2),
            'text-2xl lg:text-3xl': (block.data.level === 3),
            'text-xl lg:text-2xl': (block.data.level >= 4)
          }"
        >
          <span v-html="block.data.text || block.data.content" />
        </component>

        <!-- Paragraph -->
        <p 
          v-else-if="block.type === 'paragraph'"
          class="text-stage-900 leading-relaxed text-lg"
          v-html="block.data.text || block.data.content"
        />

        <!-- List -->
        <ul 
          v-else-if="block.type === 'list' && block.data.style === 'unordered'"
          class="list-disc list-inside space-y-2 text-stage-300 ml-4"
        >
          <li v-for="(item, i) in block.data.items" :key="i" v-html="item" />
        </ul>
        <ol 
          v-else-if="block.type === 'list' && block.data.style === 'ordered'"
          class="list-decimal list-inside space-y-2 text-stage-300 ml-4"
        >
          <li v-for="(item, i) in block.data.items" :key="i" v-html="item" />
        </ol>

        <!-- Quote -->
        <blockquote 
          v-else-if="block.type === 'quote'"
          class="border-l-4 border-brand-500 pl-6 py-2 my-8 italic text-stage-200 bg-stage-900/40 rounded-r-lg"
        >
          <p class="text-xl font-serif mb-2" v-html="block.data.text" />
          <cite v-if="block.data.caption" class="text-sm text-stage-500 not-italic">— {{ block.data.caption }}</cite>
        </blockquote>

        <!-- Image -->
        <figure v-else-if="block.type === 'image'" class="my-10 rounded-2xl overflow-hidden border border-stage-800/50">
          <img 
            :src="block.data.file?.url || getAssetUrl(block.data.file?.id)" 
            :alt="block.data.caption || ''"
            class="w-full h-auto object-cover"
          />
          <figcaption v-if="block.data.caption" class="p-4 text-center text-sm text-stage-500 bg-stage-900/20">
            {{ block.data.caption }}
          </figcaption>
        </figure>

        <!-- Delimiter -->
        <hr v-else-if="block.type === 'delimiter'" class="my-12 border-stage-800 border-dashed" />

        <!-- Columns (Custom Implementation for Extension) -->
        <div v-else-if="block.type === 'columns'" class="grid grid-cols-1 md:grid-cols-2 gap-8 my-10">
          <div v-for="(col, i) in block.data.cols" :key="i" class="space-y-4">
             <!-- Nested Blocks in Columns -->
             <template v-for="(colBlock, j) in col.blocks" :key="j">
                <p v-if="colBlock.type === 'paragraph'" v-html="colBlock.data.text" class="text-stage-300 leading-relaxed" />
                <component 
                  :is="`h${colBlock.data.level || 3}`"
                  v-else-if="colBlock.type === 'header'"
                  class="font-serif font-bold text-stage-50"
                  v-html="colBlock.data.text"
                />
             </template>
          </div>
        </div>

        <!-- Raw HTML Block -->
        <div v-else-if="block.type === 'raw'" v-html="block.data.html" />

        <!-- Fallback for unknown blocks -->
        <div v-else class="text-xs text-stage-600 border border-dashed border-stage-800 p-4 rounded my-4">
          Unsupported block type: {{ block.type }}
        </div>

      </template>
    </div>
  </div>
</template>
