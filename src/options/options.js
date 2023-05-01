import { createApp } from 'vue'
import App from './App.vue'
import appendHTMLTagToBody from '../appendHTMLTagToBody.js'

createApp(App).mount('#app')

// See README.md about how the monaco bundling
async function loadMonaco() {
    try {
        await appendHTMLTagToBody('script', {
            src: '/monaco/monaco.js',
            type: "module",
            async: true

        })
        await appendHTMLTagToBody('link', {
            href: '/monaco/monaco.css',
            rel: "stylesheet",
        })
    } catch (e) {
        console.log("Error loading monaco", e);
    }

    window.MonacoEnvironment = {
        getWorker(_, label) {
            return new window.monacoExports.editorWorker()
        }
    }
    window.editor = window.monacoExports.monaco.editor.create(document.getElementById('monaco-editor'), {
        value: '{}',
        language: 'yaml',
        minimap: { enabled: false },
        automaticLayout: true,
    })
}

loadMonaco()
