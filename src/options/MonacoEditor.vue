<script>

// See Evan You on Twitter: "Btw this is how to get Monaco Editor working in Vite (no config needed!)
// https://twitter.com/youyuxi/status/1355316139144970240?lang=en

// And see about monaco in the project's README.md

import throttle from 'lodash/throttle.js'
import { parse, stringify } from 'yaml'

import { validateConfig } from '../config.js'
import * as deep from '../deep.js'

self.MonacoEnvironment = {
    getWorker(_, label) {
        return new window.monacoExports.editorWorker()
    }
}

function throttleTrailing(func) {
    return throttle(func, 200, { leading: false, trailing: true })
}

export default {
    mounted() {
        this.setMonacoVisible()
    },
    watch: {
        visible() {
            this.setMonacoVisible()
        },
        value: {
            // When the value of the prop has changed from outside this
            // component lets see if the actual stringified version of the JS value
            // has changed, so we avoid overwriting YAML formatting without actual changes.
            handler: throttleTrailing(function (nv, ov) {
                if (!this.monacoEditor || this.pendingChange) {
                    return
                }
                // whitespaces, indents etc should not matter, so run it through this "cycle" to normalize the data to detect changes reliably.
                const equal = deep.equal(this.value, parse(this.monacoEditor.getValue()))
                // console.log('Monaco Editor equal', equal)
                if (! equal) {
                    this.monacoEditor.setValue(stringify(this.value))
                }
            }),
            deep: true
        }
    },
    props: {
        value: {
            required: true
        },
        visible: {
            required: true,
        }
    },
    methods: {
        setMonacoVisible() {
            // console.log('setMonacoVisible', this.visible)

            // Monaco only really works if it is visible all the time...
            // See:
            // When the display of the container is none, the content is not displayed
            // completely after the content is updated through executeEdits
            // https://github.com/microsoft/monaco-editor/issues/1994
            //
            // Tt didn't work if I called monaco.editor.create when it was invisible.
            // Defering the initialization until after it has become visible
            // made everything work.
            if (!this.monacoEditor) {
                if (!this.visible)
                    return
                this.createMonaco()
            }

            // In my testing, I didn't need to save/restore state and model as described
            // in issues/1994 above

            /*
                const viewState = editor.saveViewState();
                const model = editor.getModel();
                editor.setModel(null);
                // hide the container
                // ...
                // restore the container
                editor.setModel(model);
                editor.restoreViewState(viewState);
            */
        },
        createMonaco() {
            const editor = window.monacoExports.monaco.editor.create(document.getElementById('monaco-editor'), {
                value: stringify(this.value),
                language: 'yaml',
                minimap: { enabled: false },
                automaticLayout: true,
            })
            this.monacoEditor = editor
            const throttledOnContentChange = throttleTrailing(() => { this.onContentChange() })
            this.monacoEditor.onDidChangeModelContent(() => {
                this.pendingChange = true
                throttledOnContentChange()
            })
        },
        onContentChange() {
            this.pendingChange = false
            const yamlValue = this.monacoEditor.getValue()
            let jsValue
            try {
                jsValue = parse(yamlValue)
            } catch (error) {
                this.$emit('yamlValidationErrors', error)
                return
            }
            this.$emit('yamlValidationErrors', null)
            const errors = validateConfig(jsValue)
            if (errors) {
                console.log(errors)
                this.$emit('configValidationErrors', errors)
                return
            }
            this.$emit('newValue', jsValue)
        }
    }
}
</script>

<template>
    <div id="monaco-editor"></div>
</template>

<style>
#monaco-editor {
    width: 100%
}
</style>
