import { createApp } from 'vue'
import App from './App.vue'
import appendHTMLTagToBody from '../appendHTMLTagToBody.js'

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
}

async function loadPage() {
    await loadMonaco()
    createApp(App).mount('#app')
}

loadPage()
