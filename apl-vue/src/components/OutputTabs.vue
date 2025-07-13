<template>
    <div :class="[
        'min-h-96 h-full w-full shadow rounded-lg p-6 transition-all duration-200',
        outputHasError ? 'bg-red-100' : 'bg-white'
    ]">
        <!-- Tab Navigation -->
        <div class="mb-6 w-full">
            <nav class="flex justify-center w-full gap-3" aria-label="Tabs">
                <button @click="activeTab = 'output'" :class="[activeTab === 'output'
                    ? 'bg-blue-50 text-blue-700 border-blue-500'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300',
                    'px-4 py-2 font-medium text-sm w-full rounded-t-md border-b-2 transition'
                ]">
                    Output & Explanation
                </button>
                <button @click="activeTab = 'analysis'" :class="[activeTab === 'analysis'
                    ? 'bg-blue-50 text-blue-700 border-blue-500'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300',
                    'px-4 py-2 font-medium text-sm w-full rounded-t-md border-b-2 transition'
                ]">
                    Tokens & Parse Tree
                </button>
            </nav>
        </div>

        <!-- Output & Explanation Tab -->
        <div v-show="activeTab === 'output'" class="tab-content animate-fadeIn">
            <div class="space-y-6">

                <!-- Output Block -->
                <div v-if="isLoading || output.length" :class="[
                    'p-4 rounded-md shadow-sm border-l-4',
                    isLoading
                        ? 'bg-yellow-50 border-yellow-400'
                        : outputHasError
                            ? 'bg-red-50 border-red-500'
                            : 'bg-green-50 border-green-400'
                ]">
                    <h3 class="text-lg font-semibold mb-2 flex items-center" :class="{
                        'text-yellow-700': isLoading,
                        'text-red-700': !isLoading && outputHasError,
                        'text-green-700': !isLoading && !outputHasError
                    }">
                        <span class="inline-block w-2 h-2 rounded-full mr-2" :class="{
                            'bg-yellow-500': isLoading,
                            'bg-red-500': !isLoading && outputHasError,
                            'bg-green-500': !isLoading && !outputHasError
                        }"></span>
                        {{
                            isLoading
                                ? 'Processing...'
                                : outputHasError
                                    ? 'Execution Error'
                                    : 'Execution Output'
                        }}
                    </h3>

                    <!-- Spinner while loading -->
                    <div v-if="isLoading" class="flex items-center gap-2 text-sm text-gray-700">
                        <svg class="animate-spin h-5 w-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                        </svg>
                        Running code...
                    </div>

                    <!-- Actual Output -->
                    <pre v-else
                        class="whitespace-pre-wrap font-mono text-sm bg-gray-100 p-3 rounded overflow-auto max-h-60">
                        <code v-for="(line, index) in output" :key="'out-' + index" :class="outputHasError ? 'text-red-700' : ''">
                            {{ line }}
                        </code>
                    </pre>
                </div>
                <!-- Markdown Explanation -->
                <div v-if="explanation"
                    class="bg-blue-50 border-l-4 border-blue-100 overflow-auto h-72 p-4 border rounded-md shadow-sm">
                    <h3 class="text-lg font-semibold mb-2 flex items-center">
                        <span class="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        LLM Explanation
                    </h3>
                    <vue-markdown :source="explanation" class="prose max-w-none text-gray-800" />
                </div>
            </div>
        </div>

        <!-- Tokens & Parse Tree Tab -->
        <div v-show="activeTab === 'analysis'" class="tab-content animate-fadeIn">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Tokens -->
                <div>
                    <h3 class="text-lg font-semibold mb-2">Tokens</h3>
                    <div v-if="tokens.length"
                        class="bg-gray-50 border border-gray-200 rounded-md p-4 overflow-auto max-h-96 shadow-inner font-mono text-sm space-y-4">
                        <div v-for="(group, index) in groupedTokens" :key="'tok-' + index" class="border-b pb-2">
                            <div>
                                <span class="font-bold px-2 py-1 rounded text-white text-xs"
                                    :class="tokenColorClass(group[0])">
                                    {{ extractTokenType(group[0]) }}
                                </span>
                                <span class="ml-2">{{ group[0] }}</span>
                            </div>
                            <div class="text-gray-700">{{ group[1] }}</div>
                            <div class="text-blue-700">{{ group[2] }}</div>
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
import { defineComponent, ref, computed, type PropType } from 'vue'
import VueMarkdown from 'vue3-markdown-it'

export default defineComponent({
    name: 'OutputTabs',
    components: { VueMarkdown },
    props: {
        output: { type: Array as PropType<string[]>, default: () => [] },
        explanation: { type: String, default: '' },
        tokens: { type: Array as PropType<string[]>, default: () => [] },
        parseTree: { type: String, default: '' },
        isLoading: { type: Boolean, default: false }
    },
    setup(props) {
        const isLoading = computed(() => props.isLoading)
        const outputHasError = computed(() => {
            return props.output.some(line => /^\s*(error|exception|traceback)/i.test(line))
        })

        const activeTab = ref('output')

        const groupedTokens = computed(() => {
            const result: string[][] = []
            for (let i = 0; i < props.tokens.length; i += 3) {
                result.push(props.tokens.slice(i, i + 3))
            }
            return result
        })

        // Extract token type from LexToken(TYPE,...
        const extractTokenType = (line: string) => {
            const match = line.match(/LexToken\(([^,]+)/)
            return match ? match[1] : 'UNKNOWN'
        }

        // Map token types to Tailwind color classes
        const tokenColorClass = (line: string) => {
            const type = extractTokenType(line)
            const colors: Record<string, string> = {
                KEYWORD: 'bg-purple-500',
                IDENTIFIER: 'bg-blue-500',
                INTEGER: 'bg-green-500',
                FLOAT: 'bg-teal-500',
                STRING: 'bg-gray-500',
                ASSIGNMENT_OP: 'bg-yellow-500',
                PLUS_OP: 'bg-orange-400',
                MINUS_OP: 'bg-orange-400',
                TIMES_OP: 'bg-orange-400',
                DIVIDE_OP: 'bg-orange-400',
                EQ_OP: 'bg-yellow-600',
                LT_OP: 'bg-yellow-500',
                GT_OP: 'bg-yellow-500',
                LE_OP: 'bg-yellow-500',
                GE_OP: 'bg-yellow-500',
                NE_OP: 'bg-yellow-500',
                LPAREN: 'bg-gray-500',
                RPAREN: 'bg-gray-500',
                COMMA: 'bg-gray-500',
                SEMICOLON: 'bg-gray-400',
                LBRACE: 'bg-gray-500',
                RBRACE: 'bg-gray-500',
                KEYWORD_AND: 'bg-purple-500',
                KEYWORD_OR: 'bg-purple-500',
                KEYWORD_NOT: 'bg-purple-500',
                KEYWORD_TRUE: 'bg-teal-600',
                KEYWORD_FALSE: 'bg-teal-600',
                KEYWORD_BEGIN: 'bg-purple-600',
                KEYWORD_END: 'bg-purple-600',
                KEYWORD_LET: 'bg-purple-600',
                KEYWORD_IF: 'bg-purple-600',
                KEYWORD_ELSE: 'bg-purple-600',
                KEYWORD_ELSEIF: 'bg-purple-600',
                KEYWORD_FOR: 'bg-purple-600',
                KEYWORD_WHILE: 'bg-purple-600',
                KEYWORD_PRINT: 'bg-purple-600',
                KEYWORD_FUNCTION: 'bg-indigo-600',
                KEYWORD_RETURN: 'bg-indigo-600',
                KEYWORD_BREAK: 'bg-indigo-600',
                KEYWORD_CONTINUE: 'bg-indigo-600',
                KEYWORD_TO: 'bg-purple-600',
                KEYWORD_STEP: 'bg-purple-600',
                FROM: 'bg-purple-600',
                BY: 'bg-purple-600',
                NATURAL_LANG: 'bg-pink-500',
                NEWLINE: 'bg-gray-300'
            }

            // Support tokens like KEYWORD_IF or KEYWORD_BEGIN
            const baseType = type.includes('_') ? type.split('_')[0] : type
            return colors[baseType] || 'bg-gray-600'
        }

        return {
            activeTab,
            groupedTokens,
            extractTokenType,
            tokenColorClass,
            outputHasError,
            isLoading
        }

    }
})
</script>
