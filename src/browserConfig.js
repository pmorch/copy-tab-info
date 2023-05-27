import factoryConfigYAML from './factoryConfig.yaml?raw'
import { resolveRemoteConfigs } from './config.js'
import { parse, stringify } from 'yaml'

export const storageKey = 'config'

async function remoteConfigFetcher(url) {
    console.log('getting remote', url)
    const response = (await fetch(url)).text()
    let config = parse(string)
    return config
}

export async function getResolvedConfig() {
    return await resolveRemoteConfigs(getConfig(), remoteConfigFetcher)
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
    if (! hasStorage()) {
        console.log('Not actually setting configuration because '+
                    'this is not running in an extension')
        return
    }
    await chrome.storage.sync.set({ config: stringify(config) })
}

export async function resetConfig() {
    if (! hasStorage()) {
        console.log('Not actually resetting configuration because '+
                    'this is not running in an extension')
        return
    }
    await chrome.storage.sync.set({ config: factoryConfigYAML })
}

const changeFuncs = []
export function onConfigChange(changeFunc) {
    changeFuncs.push(changeFunc)
}

if (hasStorage()) {
    chrome.storage.onChanged.addListener((changes, namespace) => {
        // console.log('onChange', namespace, changes)
        if (namespace !== "sync")
            throw new Error("Only expected changes to storage")
        // console.log(changes)
        for (let cf of changeFuncs) {
            cf(parse(changes.config.newValue), parse(changes.config.oldValue))
        }
    })
}

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
        onConfigChange((nv, ov) => {
            console.log({ nv, ov })
        })
    }
}
