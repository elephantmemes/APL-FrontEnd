<script setup lang="ts">
import { ref } from 'vue'
import OutputTabs from './components/OutputTabs.vue'
import axios from 'axios'
import CodeViewer from './components/CodeViewer.vue'

// Define types
interface Token {
  type: string
  value: string
}

interface Step {
  message: string
  status: 'success' | 'failure'
}


// Reactive variables
const file = ref<File | null>(null)
const output = ref<string>('')
const error = ref<string>('')
const explanation = ref<string>('')
const tokens = ref<Token[]>([])
const parseTree = ref<string>('')
const isLoading = ref(false)
const fileContent = ref<string>('')


// Handle file input change
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  file.value = target.files ? target.files[0] : null

  if (file.value) {
    const reader = new FileReader()
    reader.onload = (e) => {
      fileContent.value = e.target?.result as string
    }
    reader.readAsText(file.value)
  } else {
    fileContent.value = ''
  }
}

// Handle form submission
const handleSubmit = async () => {
  if (!file.value) return

  isLoading.value = true

  try {
    await handleFileUpload()
  } finally {
    isLoading.value = false
  }
}

// Handle file upload
const handleFileUpload = async () => {
  if (!file.value) return

  try {
    const text = '""""' + await file.value.text() + '""""'
    console.log('Uploaded file content:', text)

    // Clear previous results
    output.value = ''
    error.value = ''
    explanation.value = ''
    tokens.value = []
    parseTree.value = ''

    // Send the code content to the backend
    const response = await axios.post('http://localhost:5000/compiler/compile', {
      code: text,
    })

    const result = response.data

    // Populate UI with real backend data
    output.value = result.output || ''
    error.value = result.error || ''
    explanation.value = result.explanation || ''
    tokens.value = result.tokens || []
    parseTree.value = result.parseTree ? JSON.stringify(result.parseTree, null, 2) : ''
  } catch (err: any) {
    // Handle network or server errors
    const errorMessage = err.response?.data?.error
      || err.message
      || 'An unknown error occurred'

    error.value = `Failed to process file: ${errorMessage}`
    explanation.value = ''
    tokens.value = []
    parseTree.value = ''
  }
}
</script>

<template>
  <section class="h-screen items-center w-full bg-stone-100 p-6">
    <h1 class="text-3xl text-center font-bold">Analysis of Programming Languages</h1>
    <div class=" w-full flex flex-col h-full lg:flex-row gap-10 justify-center items-center max-w-7xl mx-auto">
      <!-- Card -->
      <div class="bg-white w-full h-3/4 lg:w-1/2 shadow rounded-lg p-6">
        <!-- File Upload Section -->
        <div class="px-5 flex flex-col gap-5 p-5">
          <h1 class="font-bold text-xl">Uploaded Code File</h1>
          <CodeViewer :code="fileContent" />
          <label for="file-upload" class=" font-semibold text-gray-700">
            Upload Code File
          </label>
          <div class="flex gap-5 justify-center items-center">
            <input type="file" id="file-upload" @change="handleFileChange" accept=".txt,.code" class="text-sm lg:min-w-96 cursor-pointer text-stone-500 file:mr-4 file:py-2 file:px-4
                   file:rounded file:border-0 file:text-sm file:font-semibold
                   file:bg-blue-50 w-full file:text-blue-700 hover:file:bg-blue-100 disabled:bg-stone-300" />

            <!-- Submit Button -->
            <button @click="handleSubmit" :disabled="!file || isLoading" :class="[
              'px-4 py-2 rounded-md font-medium text-blue-700 cursor-pointer text-nowrap text-sm lg:w-56',
              file && !isLoading ? 'bg-blue-200 hover:bg-blue-300' : 'bg-blue-300 cursor-not-allowed'
            ]">
              {{ isLoading ? 'Processing...' : 'Run Code' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Output Section -->
      <!-- <div v-if="output || error || explanation || tokens.length > 0 || parseTree" class="mt-6"> -->
      <div class="w-full lg:w-1/2 h-3/4">
        <OutputTabs :error="error" :explanation="explanation" :output="output" :parse-tree="parseTree"
          :tokens="tokens" />
      </div>
    </div>
  </section>
</template>