<!-- src/components/OutputPanel.vue -->
<template>
    <div>
        <h2 class="text-xl">Output</h2>
        <pre v-if="output">{{ output }}</pre>
        <pre v-if="error" class="error">{{ error }}</pre>
        <div v-if="llmExplanation">
            <h3>LLM Explanation</h3>
            <p>{{ llmExplanation }}</p>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'OutputPanel',
    props: {
        output: { type: String, default: '' },
        error: { type: String, default: '' },
        llmExplanation: { type: String, default: '' }
    }
})
</script>