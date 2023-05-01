import { createApp } from 'vue'
import App from './App.vue'


// See "About the Monaco Editor" in the project's README.md and don't just
// import * as monaco from 'monaco-editor'
// it creates a huge bundle...
import 'monaco-editor/esm/vs/editor/browser/coreCommands.js';
import 'monaco-editor/esm/vs/editor/contrib/find/browser/findController.js';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';
import 'monaco-editor/esm/vs/basic-languages/yaml/yaml.contribution.js';

import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'

createApp(App).mount('#app')

self.MonacoEnvironment = {
    getWorker(_, label) {
        return new editorWorker()
    }
}

const editor = monaco.editor.create(document.getElementById('monaco-editor'), {
    value: '{}',
    language: 'yaml',
    minimap: { enabled: false },
    automaticLayout: true,
})
