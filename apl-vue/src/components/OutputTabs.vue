<template>
    <div class="bg-white min-h-96 h-full w-full shadow rounded-lg p-6 transition-all duration-200">
        <!-- Tab Navigation -->
        <div class=" mb-6 w-full">
            <nav class="flex justify-center w-full gap-3" aria-label="Tabs">
                <button @click="activeTab = 'output'" :class="[
                    activeTab === 'output'
                        ? 'bg-blue-50 text-blue-700 border-blue-500'
                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300',
                    'px-4 py-2 font-medium text-sm w-full rounded-t-md border-b-2 transition'
                ]">
                    Output & Explanation
                </button>
                <button @click="activeTab = 'analysis'" :class="[
                    activeTab === 'analysis'
                        ? 'bg-blue-50 text-blue-700 border-blue-500'
                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300',
                    'px-4 py-2 font-medium text-sm w-full rounded-t-md border-b-2 transition'
                ]">
                    Tokens & Parse Tree
                </button>
            </nav>
        </div>

        <!-- Tab Content -->
        <div v-show="activeTab === 'output'" class="tab-content animate-fadeIn">
            <div class="space-y-6">
                <!-- Output -->
                <div v-if="output" class="bg-green-50 border-l-4 border-green-400 p-4 rounded-md shadow-sm">
                    <h3 class="text-lg font-semibold mb-2 flex items-center">
                        <span class="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        Execution Output
                    </h3>
                    <pre
                        class="whitespace-pre-wrap font-mono text-sm bg-gray-100 p-3 rounded overflow-auto max-h-60">{{ output }}</pre>
                </div>

                <!-- Error -->
                <div v-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-sm">
                    <h3 class="text-lg font-semibold mb-2 flex items-center text-red-700">
                        <span class="inline-block w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                        Error
                    </h3>
                    <pre
                        class="whitespace-pre-wrap font-mono text-sm bg-red-100 p-3 rounded overflow-auto max-h-60">{{ error }}</pre>
                </div>

                <!-- Explanation -->
                <div v-if="explanation" class="bg-blue-50 border-l-4 border-blue-100 overflow-auto p-4 border rounded-md shadow-sm">
                    <h3 class="text-lg font-semibold mb-2 flex items-center">
                        <span class="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        LLM Explanation
                    </h3>
                    <p class="whitespace-pre-wrap text-gray-800 leading-relaxed">{{ explanation }}</p>
                </div>
            </div>
        </div>

        <div v-show="activeTab === 'analysis'" class="tab-content animate-fadeIn">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Tokens -->
                <div>
                    <h3 class="text-lg font-semibold mb-2">Tokens</h3>
                    <div v-if="tokens.length"
                        class="bg-gray-50 border border-gray-200 rounded-md p-4 overflow-auto max-h-96 shadow-inner">
                        <div v-for="(token, index) in tokens" :key="index" class="mb-2">
                            <span class="inline-block px-2 py-1 rounded text-xs font-mono font-bold text-white mr-2"
                                :class="{
                                    'bg-purple-500': token.type === 'keyword',
                                    'bg-blue-500': token.type === 'identifier',
                                    'bg-yellow-600': token.type === 'operator',
                                    'bg-green-600': token.type === 'number',
                                    'bg-gray-500': ['string', 'comment'].includes(token.type),
                                    'bg-orange-500': token.type === 'delimiter',
                                    'bg-teal-500': token.type === 'boolean',
                                    'bg-pink-500': token.type === 'type',
                                    'bg-indigo-500': token.type === 'function',
                                }">
                                {{ token.type }}
                            </span>
                            <span class="font-mono">{{ token.value }}</span>
                        </div>
                    </div>
                    <p v-else class="text-gray-500 italic">No tokens available.</p>
                </div>

                <!-- Parse Tree -->
                <div>
                    <h3 class="text-lg font-semibold mb-2">Parse Tree</h3>
                    <div v-if="parseTree"
                        class="bg-gray-50 border border-gray-200 rounded-md p-4 overflow-auto max-h-96 shadow-inner font-mono text-sm">
                        <pre>{{ parseTree }}</pre>
                    </div>
                    <p v-else class="text-gray-500 italic">No parse tree available.</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, type PropType } from 'vue'

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
        tokens: { type: Array as PropType<Token[]>, default: () => [] },
        parseTree: { type: String, default: '' }
    },
    setup() {
        const activeTab = ref('output')
        return { activeTab }
    }
})
</script>