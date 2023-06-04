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

// validateConfig returns null or any errors  as [{path, message}]
export function validateConfig(config) {
    const isValid = schemaValidator(config)
    if (!isValid)
        return schemaValidator.errors.map(e => {
            return {
                path: e.instancePath,
                message: e.message
            }
        })
    const seenNames = {}
    for (const [index, format] of config.formats.entries()) {
        if (format.name === "") {
            return [{
                path: `/formats/${index}/name`,
                message: "name is required"
            }]
        }
        if (format.name in seenNames) {
            return [{
                path: `/formats/${index}/name`,
                message: `name "${format.name}" is not unique`
            }]
        }
        if (format.template === "") {
            return [{
                path: `/formats/${index}/template`,
                message: "template is required"
            }]
        }
        seenNames[format.name] = true
    }
    for (const [index, urlRule] of config.urlRules.entries()) {
        if (urlRule.urlPattern === "") {
            return [{
                path: `/urlRules/${index}/urlPattern`,
                message: "urlPattern is required"
            }]
        }
        for (const [ruleIndex, rule] of urlRule.rules.entries()) {
            if (rule.match === "") {
                return [{
                    path: `/urlRules/${index}/rules/${ruleIndex}/match`,
                    message: "match is required"
                }]
            }
        }
    }
    return null
}

export function checkConfigSchema(config) {
    const errors = validateConfig(config)
    if (errors)
        throw new Error("Unexpected errors from validating config: " +
            JSON.stringify(errors, null, '    '))
}


export function originalName() {
    return 'Original Text'
}

export function contextMenus(config) {
    let cmenus = []
    function addMenuItem(name, type = "normal") {
        cmenus.push({
            id: name,
            title: name,
            contexts: ["action"],
            type,
        })
    }
    let seenOriginal = false
    for (const format of config.formats) {
        if (('contextMenu' in format) && !format.contextMenu) {
            continue;
        }
        addMenuItem(format.name)
        if (format.title === originalName())
            seenOriginal = true
    }
    if (!seenOriginal) {
        addMenuItem(originalName() + 'Separator', 'separator')
        addMenuItem(originalName())
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
        formats: [],
        remoteRules: [],
        urlRules: []
    }
    const seenFormats = {}
    for (const c of configs) {
        if (c.formats) {
            for (const format of c.formats) {
                if (format.name in seenFormats) {
                    config.formats[seenFormats[format.name]] = format
                } else {
                    seenFormats[format.name] = config.formats.length
                    config.formats.push(format)
                }
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
