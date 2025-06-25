<!-- src/components/CodeEditor.vue -->
<template>
    <div class="cont">
        <p class="text-xl">Source Code</p>
        <VueMonacoEditor v-model:value="code" theme="vs-dark" language="mylang"
            :options="{ automaticLayout: true, minimap: { enabled: false } }"
            style="height: 50vh; min-height: 200px; max-height: 500px" />
        <button @click="runCode">Run Code</button>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { VueMonacoEditor } from '@guolao/vue-monaco-editor'

export default defineComponent({
    name: 'CodeEditor',
    components: { VueMonacoEditor },
    emits: ['run-code'],
    setup(props, { emit }) {
        const code = ref<string>(`let x = 15\nlet y = 64\nlet result = (x + y) * 8 - 2`)

        const runCode = () => {
            emit('run-code', code.value)
        }

        return { code, runCode }
    }
})
</script>