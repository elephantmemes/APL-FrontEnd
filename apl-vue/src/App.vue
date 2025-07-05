<!-- src/App.vue -->
<template>
  <div>
    <header>
      <h1 class="text-xl">Analysis of Programming Languages</h1>
    </header>
    <main>
      <section>
        <CodeEditor @run-code="runCode" />
        <CodeInput @natural-input="processNaturalInput" />
      </section>
      <section>
        <OutputPanel :output="output" :error="error" :llm-explanation="llmExplanation" :steps="steps" />
      </section>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import CodeEditor from './components/CodeEditor.vue'
import CodeInput from './components/CodeInput.vue'
import OutputPanel from './components/OutputPanel.vue'
import { getGeminiExplanation } from './api/gemini'

interface Step {
  message: string
  status: 'success' | 'failure'
}

export default defineComponent({
  name: 'App',
  components: { CodeEditor, CodeInput, OutputPanel },
  setup() {
    const output = ref<string>('')
    const error = ref<string>('')
    const llmExplanation = ref<string>('')
    const steps = ref<Step[]>([])

    // Mock steps for the sample code
    const mockSteps = (code: string): Step[] => {
      if (code.includes('let x = 15')) {
        return [
          { message: 'Lexical Analysis: Tokenized "let x = 15" as [keyword:let, identifier:x, operator:=, number:15]', status: 'success' },
          { message: 'Syntactic Analysis: Parsed variable declaration "let x = 15"', status: 'success' },
          { message: 'Lexical Analysis: Tokenized "let y = 64" as [keyword:let, identifier:y, operator:=, number:64]', status: 'success' },
          { message: 'Syntactic Analysis: Parsed variable declaration "let y = 64"', status: 'success' },
          { message: 'Lexical Analysis: Tokenized "let result = (x + y) * 8 - 2" as [keyword:let, identifier:result, operator:=, operator:(, identifier:x, operator:+, identifier:y, operator:), operator:*, number:8, operator:-, number:2]', status: 'success' },
          { message: 'Syntactic Analysis: Parsed expression "(x + y) * 8 - 2"', status: 'success' },
          { message: 'Semantic Analysis: Validated variables x and y are defined', status: 'success' },
          { message: 'Semantic Analysis: Evaluated expression (15 + 64) * 8 - 2 = 630', status: 'success' }
        ]
      }
      return [
        { message: 'Lexical Analysis: Failed to tokenize invalid code', status: 'failure' },
        { message: 'Syntactic Analysis: Aborted due to lexical error', status: 'failure' }
      ]
    }

    const runCode = async (code: string) => {
      try {
        // Mock backend response for /api/run
        const mockResponse = {
          data: {
            output: code.includes('let x = 15') ? '630' : '',
            error: code.includes('let x = 15') ? '' : 'Invalid syntax',
            explanation: ''
          }
        }
        output.value = mockResponse.data.output
        error.value = mockResponse.data.error
        llmExplanation.value = await getGeminiExplanation(code)
        steps.value = mockSteps(code)
      } catch (err: any) {
        error.value = `Failed to execute code: ${err.message}`
        steps.value = [
          { message: 'Execution Failed: Mock error', status: 'failure' }
        ]
      }
    }

    const processNaturalInput = async (input: string) => {
      try {
        // Mock backend response for /api/natural
        const mockResponse = {
          data: {
            output: input.toLowerCase().includes('set x to 5') ? 'let x = 5' : '',
            error: input.toLowerCase().includes('set x to 5') ? '' : 'Invalid natural language input',
            explanation: input.toLowerCase().includes('set x to 5') ? 'Translated "set x to 5" to code: let x = 5' : ''
          }
        }
        output.value = mockResponse.data.output
        error.value = mockResponse.data.error
        llmExplanation.value = mockResponse.data.explanation || 'No explanation provided'
        steps.value = mockResponse.data.output ? [
          { message: 'Natural Language Processing: Parsed input successfully', status: 'success' },
          { message: 'Translated to code: ' + mockResponse.data.output, status: 'success' }
        ] : [
          { message: 'Natural Language Processing: Failed to parse input', status: 'failure' }
        ]
      } catch (err: any) {
        error.value = `Failed to process input: ${err.message}`
        steps.value = [
          { message: 'Natural Language Processing: Failed to parse input', status: 'failure' }
        ]
      }
    }

    return { output, error, llmExplanation, steps, runCode, processNaturalInput }
  }
})
</script>