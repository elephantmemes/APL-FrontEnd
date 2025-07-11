<template>
    <div class="bg-white min-h-96 h-full w-full shadow rounded-lg p-6">
        <!-- Tab Navigation -->
        <div class="border-b border-gray-200 mb-4">
            <nav class="w-full flex justify-center" aria-label="Tabs">
                <button @click="activeTab = 'output'" :class="[
                    activeTab === 'output'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                    'whitespace-nowrap w-full py-2 px-1 cursor-pointer border-b-2 font-medium'
                ]">
                    Output & Explanation
                </button>
                <button @click="activeTab = 'analysis'" :class="[
                    activeTab === 'analysis'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                    'whitespace-nowrap w-full cursor-pointer py-2 px-1 border-b-2 font-medium'
                ]">
                    Tokens & Parse Tree
                </button>
            </nav>
        </div>

        <!-- Tab Content -->
        <div v-show="activeTab === 'output'" class="tab-content">
            <div class="space-y-6">
                <!-- Output -->
                <div v-if="output" class="output bg-gray-100 p-4 rounded-md overflow-auto max-h-96">
                    <h3 class="text-lg font-semibold mb-2">Output</h3>
                    <pre>{{ output }}</pre>
                </div>
                <div v-if="error" class="error bg-red-100 text-red-700 p-4 rounded-md">
                    <h3 class="text-lg font-semibold mb-2">Error</h3>
                    <pre>{{ error }}</pre>
                </div>
                <!-- LLM Explanation -->
                <div v-if="explanation" class="explanation mt-4">
                    <h3 class="text-lg font-semibold mb-2">LLM Explanation</h3>
                    <p class="whitespace-pre-wrap">{{ explanation }}</p>
                </div>
            </div>
        </div>

        <div v-show="activeTab === 'analysis'" class="tab-content">
            <div class=" border grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Tokens -->
                <div>
                    <h3 class="text-lg font-semibold mb-2">Tokens</h3>
                    <div v-if="tokens.length" class="tokens bg-gray-100 p-4 rounded-md overflow-auto max-h-96">
                        <div v-for="(token, index) in tokens" :key="index" class="mb-1">
                            <span class="font-mono">{{ token.type }}: {{ token.value }}</span>
                        </div>
                    </div>
                    <p v-else class="text-gray-500 italic">No tokens available.</p>
                </div>

                <!-- Parse Tree -->
                <div>
                    <h3 class="text-lg font-semibold mb-2">Parse Tree</h3>
                    <div v-if="parseTree" class="parse-tree bg-gray-100 p-4 rounded-md overflow-auto max-h-96">
                        <pre class="font-mono text-sm">{{ parseTree }}</pre>
                    </div>
                    <p v-else class="text-gray-500 italic">No parse tree available.</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

interface Token {
    type: string
    value: string
}

export default defineComponent({
    name: 'OutputTabs',
    props: {
        output: { type: String, default: '' },
        error: { type: String, default: '' },
        explanation: { type: String, default: '' },
        tokens: { type: Array as () => Token[], default: () => [] },
        parseTree: { type: String, default: '' }
    },
    setup() {
        const activeTab = ref('output')
        return { activeTab }
    }
})
</script>