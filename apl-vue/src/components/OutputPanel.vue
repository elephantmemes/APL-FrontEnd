<!-- src/components/OutputPanel.vue -->
<template>
    <div class="cont">
        <h2 class="text-xl">Output</h2>
        <pre v-if="output">{{ output }}</pre>
        <pre v-if="error" class="error">{{ error }}</pre>
        <!-- <div v-if="llmExplanation" class="cont">
            <h3><b>LLM Explanation</b></h3>
            <p>{{ llmExplanation }}</p>
        </div>
        <div v-if="steps.length" class="cont steps-panel">
            <h3>Processing Steps</h3>
            <div v-for="(step, index) in steps" :key="index" :class="['step', step.status]">
                {{ step.message }}
            </div>
        </div> -->
    </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'

interface Step {
    message: string
    status: 'success' | 'failure'
}

export default defineComponent({
    name: 'OutputPanel',
    props: {
        output: { type: String, default: '' },
        error: { type: String, default: '' },
        // llmExplanation: { type: String, default: '' },
        // steps: {
        //     type: Array as PropType<Step[]>,
        //     default: () => []
        // }
    }
})
</script>