<template>
  <div role="region" aria-label="Code viewer"
    class="bg-stone-50 text-stone-900 rounded-md h-full overflow-hidden shadow-lg">
    <div class="bg-stone-200 px-4 py-2 font-semibold text-sm flex items-center justify-between">
      <p>Code Viewer</p>
    </div>
    <pre class="p-4 font-mono text-sm whitespace-pre-wrap break-all overflow-auto">
      <code>{{ code }}</code>
    </pre>
  </div>
</template>

<script setup lang="ts">
defineProps({
  code: {
    type: String,
    default: ''
  }
})
</script>
