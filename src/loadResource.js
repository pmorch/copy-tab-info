// import { readFileSync } from 'fs'
// import { resolve, dirname, basename } from 'path';
// import { fileURLToPath } from 'url';

import { parse } from 'yaml'

function isBrowser() {
    return typeof(window) !== 'undefined' || typeof(chrome) !== 'undefined'
}
// export const isBrowser=new Function(`
//     try {
//         return this===window
//     } catch(e) {
//         return false
//     }
// `)

const basename = () => {}
const fileURLToPath = () => {}

export async function loadResourceAsString(resource) {
    // throw new Error(`isBrowser ${isBrowser()}X${typeof(window)}Y`)
    if (isBrowser()) {
        const response = await fetch(chrome.runtime.getURL(basename(resource)))
        return await response.text()
    } else {
        const __dirname = dirname(fileURLToPath(import.meta.url));
        return readFileSync(resolve(__dirname, "..", resource)).toString()
    }
}

export async function loadYAMLResource(resource) {
    const string = await loadResourceAsString(resource)
    return parse(string)
}