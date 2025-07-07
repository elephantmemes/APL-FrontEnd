// src/main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { install as VueMonacoEditorPlugin, loader } from '@guolao/vue-monaco-editor'
import * as monaco from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
import './assets/main.css'

self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === 'json') return new jsonWorker()
    if (label === 'css' || label === 'scss' || label === 'less') return new cssWorker()
    if (label === 'html' || label === 'handlebars' || label === 'razor') return new htmlWorker()
    if (label === 'typescript' || label === 'javascript') return new tsWorker()
    return new editorWorker()
  },
}

// monaco.languages.register({ id: 'mylang' })
// monaco.languages.setMonarchTokensProvider('mylang', {
//   tokenizer: {
//     root: [
//       [/\blet\b/, 'keyword'],
//       [/\bif\b|\belse\b|\bfor\b/, 'keyword'],
//       [/\d+/, 'number'],
//       [/\/\/.*$/, 'comment'],
//       [/[a-zA-Z][a-zA-Z0-9]*/, 'identifier'],
//       [/[+\-*/=()]/, 'operator']
//     ]
//   }
// })

loader.config({ monaco })

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(VueMonacoEditorPlugin)
app.mount('#app')