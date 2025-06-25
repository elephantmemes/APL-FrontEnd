<!-- src/components/CodeInput.vue -->
<template>
    <div style="margin-top: 1rem;" class="cont">
        <input v-model="codeInput" type="text" placeholder="e.g., set x to 5" />
        <button @click="processCodeInput">Submit</button>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
    name: 'CodeInput',
    emits: ['natural-input'],
    setup(props, { emit }) {
        const codeInput = ref<string>('')

        const processCodeInput = () => {
            emit('natural-input', codeInput.value)
        }

        return { codeInput, processCodeInput }
    }
})
</script>