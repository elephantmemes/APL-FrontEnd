<template>
  <div class="bg-stone-200 text-stone-900 rounded-md overflow-hidden shadow-lg">
    <div class="bg-stone-400 px-4 py-2 font-semibold text-sm flex items-center justify-between">
      Code Viewer
    </div>
    <pre class="p-4 font-mono text-sm whitespace-pre-wrap break-all max-h-96 overflow-auto">
      {{ code }}
    </pre>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

defineProps({
  code: {
    type: String,
    default: ''
  }
})
</script>