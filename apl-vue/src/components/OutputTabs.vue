<template>
  <div class="bg-white min-h-96 h-full w-full shadow rounded-lg p-6 transition-all duration-200">
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
        <!-- Output -->
        <div v-if="output.length" class="bg-green-50 border-l-4 border-green-400 p-4 rounded-md shadow-sm">
          <h3 class="text-lg font-semibold mb-2 flex items-center">
            <span class="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Execution Output
          </h3>
          <pre class="whitespace-pre-wrap font-mono text-sm bg-gray-100 p-3 rounded overflow-auto max-h-60">
            <div v-for="(line, index) in output" :key="'out-' + index">{{ line }}</div>
          </pre>
        </div>

        <!-- Error -->
        <div v-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-sm">
          <h3 class="text-lg font-semibold mb-2 flex items-center text-red-700">
            <span class="inline-block w-2 h-2 bg-red-500 rounded-full mr-2"></span>
            Execution Error
          </h3>
          <div class="whitespace-pre-wrap text-red-700">
            <div v-for="(line, index) in error" :key="'err-' + index">{{ line }}</div>
          </div>
        </div>

        <!-- Markdown Explanation -->
        <div v-if="explanation"
             class="bg-blue-50 border-l-4 border-blue-100 overflow-auto h-70 p-4 border rounded-md shadow-sm">
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
    error: { type: String, default: ''  },
    explanation: { type: String, default: '' },
    tokens: { type: Array as PropType<string[]>, default: () => [] },
    parseTree: { type: String, default: '' }
  },
  setup(props) {
    const activeTab = ref('output')

    // Group every 3 lines into one token display
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
        KEYWORD: 'bg-purple-600',
        IDENTIFIER: 'bg-blue-600',
        ASSIGNMENT_OP: 'bg-yellow-600',
        INTEGER: 'bg-green-600',
        STRING: 'bg-gray-700',
        COMMENT: 'bg-gray-500',
        DELIMITER: 'bg-orange-500',
        BOOLEAN: 'bg-teal-600',
        TYPE: 'bg-pink-600',
        FUNCTION: 'bg-indigo-600',
        EQ_OP: 'bg-yellow-700',
        LT_OP: 'bg-yellow-500',
        GT_OP: 'bg-yellow-500',
        PLUS_OP: 'bg-orange-400',
        SEMICOLON: 'bg-gray-400',
        LPAREN: 'bg-gray-500',
        RPAREN: 'bg-gray-500',
        COMMA: 'bg-gray-500'
      }

      // Support tokens like KEYWORD_IF or KEYWORD_BEGIN
      const baseType = type.includes('_') ? type.split('_')[0] : type
      return colors[baseType] || 'bg-gray-600'
    }

    return {
      activeTab,
      groupedTokens,
      extractTokenType,
      tokenColorClass
    }
  }
})
</script>

<style scoped>
/* Optional: extra styling if needed */
</style>

<!-- vue3-markdown-it.d.ts -->

