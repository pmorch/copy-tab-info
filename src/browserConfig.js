import factoryConfigYAML from '../public/factoryConfig.yaml?raw'
import { resolveRemoteConfigs } from './config.js'
import { parse, stringify } from 'yaml'

export const storageKey = 'config'

async function remoteConfigFetcher(url) {
    console.log('getting remote', url)
    const response = (await fetch(url)).text()
    let config = parse(string)
    return config
}

function hasStorage() {
    return typeof (chrome) !== 'undefined' && typeof (chrome.storage) !== 'undefined'
}

export async function getConfig() {
    let configYAML
    // console.log('hasStorage', hasStorage())
    if (hasStorage()) {
        configYAML = (await chrome.storage.sync.get([storageKey]))[storageKey]
        // console.log('storage val', configYAML)
    }
    if (!configYAML) {
        configYAML = factoryConfigYAML
        if (hasStorage()) {
            await chrome.storage.sync.set({ config: configYAML })
        }
    }
    return parse(configYAML)
}

export async function setConfig(config) {
    await chrome.storage.sync.set({ config: stringify(config) })
}

export async function resetConfig() {
    await chrome.storage.sync.set({config: factoryConfigYAML })
}

const changeFuncs = []
export function onConfigChange(changeFunc) {
    changeFuncs.push(changeFunc)
}

chrome.storage.onChanged.addListener((changes, namespace) => {
    // console.log('onChange', namespace, changes)
    if (namespace !== "sync")
        throw new Error("Only expected changes to storage")
    // console.log(changes)
    for (let cf of changeFuncs) {
        cf(changes.config.oldValue, changes.config.newValue)
    }
    // for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    //     for 
    //     console.log(
    //         `Storage key "${key}" in namespace "${namespace}" changed to\n${newValue}`
    //     );
    // }
});

self.debugConfig = {
    get: getConfig,
    set: setConfig,
    reset: resetConfig,
    async log() {
        const config = await getConfig()
        console.log('config', config)
        return
    },
    watch() {
        onConfigChange((oldValue, newValue) => {
            console.log({ old: oldValue, new: newValue })
        })
    }
}

export async function getResolvedConfig() {
    return await resolveRemoteConfigs(getConfig(), remoteConfigFetcher)
}

