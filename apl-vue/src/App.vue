<!-- src/App.vue -->
<template>
  <div>
    <header>
      <h1 class="text-xl">Analysis of Programming Languages</h1>
    </header>
    <main>
      <section>
        <CodeEditor @run-code="runCode" />
      </section>
      <section>
        <OutputPanel :output="output" :error="error" />
      </section>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import CodeEditor from './components/CodeEditor.vue'
import OutputPanel from './components/OutputPanel.vue'
import axios from 'axios'

interface Step {
  message: string
  status: 'success' | 'failure'
}

export default defineComponent({
  name: 'App',
  components: { CodeEditor, OutputPanel },
  setup() {
    const output = ref<string>('')
    const error = ref<string>('')
    // const llmExplanation = ref<string>('')

    const runCode = async (code: string) => {
      try {
        const response = await axios.post('http://127.0.0.1:5000/compiler/compile', { code })
        
        if (response.data){
          output.value = response.data.result
        }
        else {
          console.log('No data received from backend' + response.data)
          error.value = response.data.error
        }
      } catch (err: any) {
        error.value = `Failed to execute code: ${err.message}`
        console.error(err.message)
      }
    }
    return { output, error,runCode }
  }
})
</script>