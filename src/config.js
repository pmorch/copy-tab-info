import yaml from 'yaml'

// We cannot simply compile the schema runtime,
// because in the extension, that would
// require the code to be compiled from a string in the extension, and
// that is not allowed. See:
//
// ajv-validator/ajv #406: Use with CSP & Unsafe-Eval
// https://github.com/ajv-validator/ajv/issues/406
//
//     import Ajv from 'ajv/dist/jtd.js'
//     const ajv = new Ajv()
//     const validate = ajv.compile(schema)
//
// instead:
import schemaValidator from './generated-code/config-schema-validate.js'

export function checkConfigSchema(config) {
    const isValid = schemaValidator(config)
    if (!isValid)
        throw new Error(`Unexpected errors from validating config: ${JSON.stringify(schemaValidator.errors)}`)
}

export function contextMenus(config) {
    let cmenus = []
    for (const name in config.formats) {
        let format = config.formats[name]
        if (('contextMenu' in format) && !format.contextMenu) {
            continue;
        }
        cmenus.push({
            id: name,
            title: name,
            contexts: ["action"]
        })
    }
    return cmenus
}

// fetcher is of type async (url: string) => config object
export async function fetchRemoteConfigs(remotes, fetcher) {
    const configs = []
    for (const remote of remotes) {
        const config = await fetcher(remote)
        checkConfigSchema(config)
        configs.push(config)
    }
    return configs
}

export function mergeConfigs(configs) {
    const config = {
        formats: {},
        remoteRules: [],
        urlRules: []
    }
    for (const c of configs) {
        if (c.formats) {
            for (const f in c.formats) {
                config.formats[f] = c.formats[f]
            }
        }
        if (c.remoteRules) {
            config.remoteRules.push(...c.remoteRules)
        }
        if (c.urlRules) {
            config.urlRules.push(...c.urlRules)
        }
    }
    return config
}

// fetcher is of type async (url: string) => config object
export async function resolveRemoteConfigs(config, fetcher) {
    if (config.remoteRules && config.remoteRules.length > 0) {
        const remoteConfigs = await fetchRemoteConfigs(config.remoteRules, fetcher)
        const resolvedRemoteConfigs = []
        for (const r of remoteConfigs) {
            resolvedRemoteConfigs.push(await resolveRemoteConfigs(r, fetcher))
        }
        const configs = [...resolvedRemoteConfigs, config]
        config = mergeConfigs(configs)
        config.remoteRules = []
    }
    return config
}
