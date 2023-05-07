import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'

import App from './App.vue'
import appendHTMLTagToBody from '../appendHTMLTagToBody.js'

import routes from './routes'

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

    const app = createApp(App)

    const router = createRouter({
        history: createWebHashHistory(),
        routes,
    })
    app.use(router)

    app.mount('#app')
}

loadPage()
