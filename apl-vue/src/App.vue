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
        <OutputPanel :output="output" :error="error" :llm-explanation="llmExplanation" />
      </section>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import axios from 'axios'
import CodeEditor from './components/CodeEditor.vue'
import CodeInput from './components/CodeInput.vue'
import OutputPanel from './components/OutputPanel.vue'

export default defineComponent({
  name: 'App',
  components: { CodeEditor, CodeInput, OutputPanel },
  setup() {
    const output = ref<string>('')
    const error = ref<string>('')
    const llmExplanation = ref<string>('')

    const runCode = async (code: string) => {
      try {
        const response = await axios.post('http://localhost:3000/run', { code }) // Replace with backend URL
        output.value = response.data.output
        error.value = response.data.error || ''
        llmExplanation.value = response.data.explanation
      } catch (err: any) {
        error.value = `Failed to execute code: ${err.message}`
      }
    }

    const processNaturalInput = async (input: string) => {
      try {
        const response = await axios.post('http://localhost:3000/natural', { input }) // Replace with backend URL
        output.value = response.data.output
        error.value = response.data.error || ''
        llmExplanation.value = response.data.explanation
      } catch (err: any) {
        error.value = `Failed to process input: ${err.message}`
      }
    }

    return { output, error, llmExplanation, runCode, processNaturalInput }
  }
})
</script>