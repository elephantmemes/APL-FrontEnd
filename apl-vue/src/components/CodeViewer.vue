<template>
  <div role="region" aria-label="Code Viewer"
    class="bg-white text-gray-900 rounded-lg shadow-md flex p-0 border flex-col h-full overflow-hidden border-gray-200">
    <!-- Header -->
    <div class="bg-gray-100 px-4 py-2 font-semibold text-sm flex items-center justify-between border-b border-gray-300">
      <span>Code Viewer</span>
      <button @click="copyCode" class="text-blue-600 hover:text-blue-800 text-xs font-medium transition-colors"
        aria-label="Copy code to clipboard">
        {{ copied ? "Copied!" : "Copy" }}
      </button>
    </div>

    <!-- Code Block with Line Numbers -->
    <div class="flex-1 overflow-auto w-full h-full p-0 m-0 text-sm font-mono">
      <div class="flex w-full">
        <!-- Line Numbers -->
        <div class="text-right pr-4 py-8 bg-stone-50 select-none text-gray-400">
          <div v-for="(_, index) in lineCount" :key="index" class="leading-relaxed">
            {{ index + 1 }}
          </div>
        </div>

        <!-- Highlighted Code -->
        <pre class="whitespace-pre-wrap break-words overflow-x-auto m-0 p-0 flex-1">
          <code ref="codeRef" class="language-javascript text-gray-800">{{ code }}</code>
        </pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import 'highlight.js/styles/github.css' // Choose your favorite theme

hljs.registerLanguage('javascript', javascript)

const props = defineProps<{
  code: string
}>()

const codeRef = ref<HTMLElement | null>(null)
const copied = ref(false)

const highlight = () => {
  if (codeRef.value) {
    hljs.highlightElement(codeRef.value)
  }
}

const lineCount = computed(() => {
  return props.code ? props.code.split('\n').length : 0
})

watch(() => props.code, highlight)
onMounted(highlight)

const copyCode = async () => {
  if (!props.code) return
  try {
    await navigator.clipboard.writeText(props.code)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch (err) {
    console.error('Failed to copy code:', err)
  }
}
</script>
