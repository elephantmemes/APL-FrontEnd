<script setup lang="ts">
import { ref } from 'vue'
import OutputTabs from './components/OutputTabs.vue'
import axios from 'axios'
import CodeViewer from './components/CodeViewer.vue'
import AlertIcon from './components/AlertIcon.vue'
import CheckmarkIcon from './components/CheckmarkIcon.vue'
// Define types
interface Token {
  type: string
  value: string
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
const upload = ref(false)

// Define button states
type ButtonState = 'idle' | 'loading' | 'success' | 'error'
const buttonState = ref<ButtonState>('idle')


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

// const resetAndRetry = async () => {
//   // Reset all states
//   output.value = ''
//   error.value = ''
//   explanation.value = ''
//   tokens.value = []
//   parseTree.value = ''

//   // Retry execution
//   buttonState.value = 'loading'

//   try {
//     await handleFileUpload()
//     buttonState.value = 'success'
//   } catch (err) {
//     error.value = 'Failed to run code. Please try again.'
//     buttonState.value = 'error'
//   }

//   setTimeout(() => {
//     if (buttonState.value !== 'loading') {
//       buttonState.value = 'idle'
//     }
//   }, 3000)
// }

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
  if (!file.value) return error.value = "Must have file content"

  try {
    const text = '""""' + await file.value.text() + '""""'
    console.log('File uploading')

    // Clear previous results
    output.value = ''
    error.value = ''
    explanation.value = ''
    tokens.value = []
    parseTree.value = ''

    // Send the code content to the backend
    const response = await axios.post('https://apl-compiler-backend.onrender.com/compiler/compile', {
      code: text,
    })

    const result = response.data
    upload.value = true
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
  <section class="h-screen lg:p-16 items-center w-full bg-stone-100 p-6">
    <h1 class="text-3xl text-center font-bold">Analysis of Programming Languages</h1>

    <div class="w-full flex flex-col h-full lg:flex-row gap-10 justify-center items-center mx-auto">
      <!-- Card -->
      <div class="bg-white w-full h-5/6 lg:w-1/2 shadow rounded-lg p-6">
        <!-- File Upload Section -->
        <div class="px-5 flex h-full flex-col gap-5 p-5">
          <h1 class="font-bold text-xl">Uploaded Code File</h1>
          <CodeViewer :code="fileContent" />
          <label for="file-upload" class="font-semibold text-gray-700">
            Upload Code File
          </label>
          <div class="flex gap-5 justify-center items-center">
            <input type="file" id="file-upload" required @change="handleFileChange" accept=".txt,.code" class="text-sm lg:min-w-96 cursor-pointer text-stone-500 file:mr-4 file:py-2 file:px-4
                     file:rounded file:border-0 file:text-sm file:font-semibold
                     file:bg-blue-50 w-full file:text-blue-700 hover:file:bg-blue-100 disabled:bg-stone-300" />

            <!-- Submit Button -->
            <button @click="handleSubmit" :disabled="buttonState === 'loading'" :class="[
              'px-4 py-2 rounded-md font-medium cursor-pointer text-sm lg:w-56 flex items-center justify-center gap-2 transition-colors',
              {
                'bg-blue-200 hover:bg-blue-300 text-blue-700': buttonState === 'idle',
                'bg-green-200 text-green-700': buttonState === 'success',
                'bg-red-200 text-red-700': buttonState === 'error',
                'bg-blue-300 text-gray-500 cursor-not-allowed': buttonState === 'loading'
              }
            ]">
              <!-- Success Icon -->
              <span v-if="(buttonState === 'success' && upload)">
                <CheckmarkIcon />
              </span>

              <!-- Error Icon + Retry Option -->
              <span v-else-if="buttonState === 'error'" class="flex items-center gap-2">
                <AlertIcon />
                <span>Try Again</span>
              </span>

              <!-- Loading Spinner -->
              <span v-else-if="buttonState === 'loading'">
                <p>Processing</p>
              </span>

              <!-- Default Text -->
              <span v-else>{{ buttonState === 'idle' ? 'Run Code' : 'Processing...' }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Output Section -->
      <div class="w-full lg:w-1/2 h-5/6">
        <OutputTabs :error="error" :explanation="explanation" :output="output" :parse-tree="parseTree"
          :tokens="tokens" />
      </div>
    </div>

  </section>
</template>