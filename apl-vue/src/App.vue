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

// Reactive variables
const file = ref<File | null>(null)
const output = ref<string>('')
const error = ref<string>('')
const explanation = ref<string>('')
const tokens = ref<Token[]>([])
const parseTree = ref<string>('')
const isLoading = ref(false)
const fileContent = ref<string>('')

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
    const response = await axios.post('https://apl-compiler-backend.onrender.com/compiler/compile', {
      code: text,
    })

    const result = response.data

    // Populate UI with real backend data
    output.value = result.output || ''
    // error.value = result.error || ''
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


// // Utility function to simulate waiting (e.g., for API call)
// const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
// // Simulate successful backend response
// const simulateResponse = async () => {
//   isLoading.value = true

//   try {
//     // Simulate network delay (e.g., 1.5 seconds)
//     await sleep(1500)

//     // Set mock response data
//     const simulatedResponse = {
//       data: {
//         tokens: [
//           { type: 'keyword', value: 'let' },
//           { type: 'identifier', value: 'x' },
//           { type: 'operator', value: '=' },
//           { type: 'number', value: '15' },
//           { type: 'keyword', value: 'let' },
//           { type: 'identifier', value: 'y' },
//           { type: 'operator', value: '=' },
//           { type: 'number', value: '64' },
//           { type: 'keyword', value: 'let' },
//           { type: 'identifier', value: 'result' },
//           { type: 'operator', value: '=' },
//           { type: 'operator', value: '(' },
//           { type: 'identifier', value: 'x' },
//           { type: 'operator', value: '+' },
//           { type: 'identifier', value: 'y' },
//           { type: 'operator', value: ')' },
//           { type: 'operator', value: '*' },
//           { type: 'number', value: '8' },
//           { type: 'operator', value: '-' },
//           { type: 'number', value: '2' }
//         ],
//         parseTree: {
//           type: 'Program',
//           body: [
//             { type: 'VariableDeclaration', identifier: 'x', value: 15 },
//             { type: 'VariableDeclaration', identifier: 'y', value: 64 },
//             {
//               type: 'VariableDeclaration',
//               identifier: 'result',
//               value: {
//                 type: 'BinaryExpression',
//                 operator: '-',
//                 left: {
//                   type: 'BinaryExpression',
//                   operator: '*',
//                   left: {
//                     type: 'BinaryExpression',
//                     operator: '+',
//                     left: { type: 'Identifier', name: 'x' },
//                     right: { type: 'Identifier', name: 'y' },
//                   },
//                   right: { type: 'Literal', value: 8 },
//                 },
//                 right: { type: 'Literal', value: 2 },
//               },
//             },
//           ],
//         },
//         explanation:
//           'The code declares two variables, x and y, and performs an arithmetic operation:\n\n1. x is assigned the value 15.\n2. y is assigned the value 64.\n3. The expression (x + y) * 8 - 2 is evaluated as follows:\n   - x + y = 15 + 64 = 79\n   - 79 * 8 = 632\n   - 632 - 2 = 630\n\nThe final result is 630.',
//         output: '630',
//       },
//     }

//     // Update UI with response data
//     output.value = simulatedResponse.data.output
//     explanation.value = simulatedResponse.data.explanation
//     tokens.value = simulatedResponse.data.tokens
//     parseTree.value = JSON.stringify(simulatedResponse.data.parseTree, null, 2)
//     buttonState.value = 'success'
//   } catch (err) {
//     error.value = 'An error occurred while simulating response.'
//     buttonState.value = 'error'
//   } finally {
//     isLoading.value = false
//   }
// }

</script>

<template>
  <section class="h-screen items-center w-full bg-stone-100 p-6">
    <h1 class="text-3xl text-center font-bold">Analysis of Programming Languages</h1>

    <div class="w-full flex flex-col h-full lg:flex-row gap-10 justify-center items-center max-w-7xl mx-auto">
      <!-- Card -->
      <div class="bg-white w-full h-3/4 lg:w-1/2 shadow rounded-lg p-6">
        <!-- File Upload Section -->
        <div class="px-5 flex flex-col gap-5 p-5">
          <h1 class="font-bold text-xl">Uploaded Code File</h1>
          <CodeViewer :code="fileContent" />
          <label for="file-upload" class="font-semibold text-gray-700">
            Upload Code File
          </label>
          <div class="flex gap-5 justify-center items-center">
            <input type="file" id="file-upload" @change="handleFileChange" accept=".txt,.code" class="text-sm lg:min-w-96 cursor-pointer text-stone-500 file:mr-4 file:py-2 file:px-4
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
              <!-- Loading Spinner -->
              <span v-if="buttonState === 'loading'">
                <LoadingSpinner :show="true" />
              </span>

              <!-- Success Icon -->
              <span v-else-if="buttonState === 'success'">
                <CheckmarkIcon />
              </span>

              <!-- Error Icon + Retry Option -->
              <span v-else-if="buttonState === 'error'" class="flex items-center gap-2">
                <AlertIcon />
                <span>Try Again</span>
              </span>

              <!-- Default Text -->
              <span v-else>{{ buttonState === 'idle' ? 'Run Code' : 'Processing' }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Output Section -->


      <div class="w-full lg:w-1/2 h-3/4">
        <OutputTabs :error="error" :explanation="explanation" :output="output" :parse-tree="parseTree"
          :tokens="tokens" />
      </div>
    </div>

  </section>
</template>