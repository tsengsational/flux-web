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

// ── Custom Scroll Reveal Directive ──
const vReveal = {
  mounted(el: HTMLElement) {
    // Initial state: hidden
    el.classList.add('reveal-init');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Trigger animation
          el.classList.add('reveal-active');
          // Once revealed, we can stop observing
          observer.unobserve(el);
        }
      });
    }, { 
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px' // Trigger slightly before it hits the viewport
    });

    observer.observe(el);
  }
};

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
  <div class="block-renderer flow-root">
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
          class="font-serif font-bold mt-12 mb-6"
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
          class="leading-relaxed text-lg"
          v-html="block.data.text || block.data.content"
        />

        <!-- List -->
        <ul 
          v-else-if="block.type === 'list' && block.data.style === 'unordered'"
          class="list-disc list-inside space-y-2 ml-4"
        >
          <li v-for="(item, i) in block.data.items" :key="i" v-html="item" />
        </ul>
        <ol 
          v-else-if="block.type === 'list' && block.data.style === 'ordered'"
          class="list-decimal list-inside space-y-2 ml-4"
        >
          <li v-for="(item, i) in block.data.items" :key="i" v-html="item" />
        </ol>

        <!-- Quote -->
        <blockquote 
          v-else-if="block.type === 'quote'"
          class="border-l-4 border-brand-500 pl-6 py-2 my-8 italic bg-stage-900/40 rounded-r-lg"
        >
          <p class="text-xl font-serif mb-2" v-html="block.data.text" />
          <cite v-if="block.data.caption" class="text-sm not-italic opacity-60">— {{ block.data.caption }}</cite>
        </blockquote>

        <!-- Image (with Aggressive Breakout support on Desktop) -->
        <figure 
          v-else-if="block.type === 'image'" 
          v-reveal
          class="my-10 overflow-visible reveal-init"
          :class="{
            'md:float-left md:mr-10 md:mb-6 md:max-w-[44%] lg:max-w-[60%] lg:-ml-24 xl:-ml-32': (block.data.alignment === 'left' || (block.data.caption && block.data.caption.startsWith('[left]'))),
            'md:float-right md:ml-10 md:mb-6 md:max-w-[44%] lg:max-w-[60%] lg:-mr-24 xl:-mr-32': (block.data.alignment === 'right' || (block.data.caption && block.data.caption.startsWith('[right]'))),
            'w-full': !block.data.alignment && !(block.data.caption && (block.data.caption.startsWith('[left]') || block.data.caption.startsWith('[right]')))
          }"
        >
          <div class="rounded-2xl overflow-hidden border border-stage-800/50">
            <img 
              :src="getAssetUrl(block.data.file?.id || (typeof block.data.file === 'string' ? block.data.file : null) || (block.data.file?.url?.split('/assets/')?.[1]), { width: 1200 })!" 
              :alt="block.data.caption || ''"
              class="w-full h-auto object-cover"
            />
          </div>
          <figcaption 
            v-if="block.data.caption && !block.data.caption.startsWith('[left]') && !block.data.caption.startsWith('[right]')" 
            class="p-4 text-center text-sm opacity-60"
          >
            {{ block.data.caption }}
          </figcaption>
          <figcaption 
            v-else-if="block.data.caption" 
            class="p-4 text-center text-sm opacity-60"
          >
            {{ block.data.caption.replace('[left]', '').replace('[right]', '').trim() }}
          </figcaption>
        </figure>

        <!-- Delimiter -->
        <hr v-else-if="block.type === 'delimiter'" class="my-12 border-stage-800 border-dashed" />

        <!-- Columns (Custom Implementation for Extension) -->
        <div v-else-if="block.type === 'columns'" class="grid grid-cols-1 md:grid-cols-2 gap-8 my-10">
          <div v-for="(col, i) in block.data.cols" :key="i" class="space-y-4">
             <!-- Nested Blocks in Columns -->
             <template v-for="(colBlock, j) in col.blocks" :key="j">
                <p v-if="colBlock.type === 'paragraph'" v-html="colBlock.data.text" class="leading-relaxed" />
                <component 
                  :is="`h${colBlock.data.level || 3}`"
                  v-else-if="colBlock.type === 'header'"
                  class="font-serif font-bold"
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

<style lang="scss" scoped>
.block-renderer {
  /* --- Fly-in Animations --- */
  .reveal-init {
    opacity: 0;
    filter: blur(10px);
    transition: all 1.2s cubic-bezier(0.16, 1, 0.3, 1);
    will-change: transform, opacity, filter;
  }

  /* Left-aligned fly-in */
  :deep(.md\:float-left.reveal-init) {
    transform: translateX(-60px) rotate(-1deg);
  }

  /* Right-aligned fly-in */
  :deep(.md\:float-right.reveal-init) {
    transform: translateX(60px) rotate(1deg);
  }

  /* Centered / Full-width fly-in */
  :deep(.w-full.reveal-init) {
    transform: translateY(30px);
  }

  /* Active State */
  :deep(.reveal-active) {
    opacity: 1 !important;
    filter: blur(0) !important;
    transform: translate(0, 0) rotate(0) !important;
  }
}
</style>
