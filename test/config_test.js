'use strict';

import { promises } from 'fs'
import * as configModule from "../src/config.js";
import { assert } from 'chai'
import schemaValidator from '../src/generated-code/config-schema-validate.js'
import { parse } from 'yaml'
import * as url from 'url';
import { resolve} from 'path';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const config1YAML = `
formats:
    HTML:
        template: <a href="%{URL}">%{ESCAPED_TITLE}</a>
        joinString: <br>
        contextMenu: false
    text:
        template: |
            old format: %{TITLE}
            %{URL}
        contextMenu: true
remoteRules:
- https://server/url1
urlRules:
- urlPattern: http://server/pattern1
  rules:
  - field: title
    match: " - suffix$"
    replacement: ""
`

const config2YAML = `
formats:
    text:
        template: |
            %{TITLE}
            %{URL}
        contextMenu: true
    Markdown:
        template: "[%{TITLE}](%{URL})"
remoteRules:
- https://server/url2
urlRules:
- urlPattern: http://server/pattern2
  rules:
  - field: title
    match: " - suffix2$"
    replacement: ""
`

const expectedMergeYAML = `
formats:
    HTML:
        template: <a href="%{URL}">%{ESCAPED_TITLE}</a>
        joinString: <br>
        contextMenu: false
    text:
        template: |
            %{TITLE}
            %{URL}
        contextMenu: true
    Markdown:
        template: "[%{TITLE}](%{URL})"
remoteRules:
- https://server/url1
- https://server/url2
urlRules:
- urlPattern: http://server/pattern1
  rules:
  - field: title
    match: " - suffix$"
    replacement: ""
- urlPattern: http://server/pattern2
  rules:
  - field: title
    match: " - suffix2$"
    replacement: ""
`

function parseAndCheckConfig(yaml) {
    const config = parse(yaml)
    assert.isTrue(schemaValidator(config))
    assert.isNull(schemaValidator.errors)
    return config
}

// import factoryConfig from '../public/factoryConfig.yaml' assert { type: "text" };
async function getConfig() {
    const factoryConfigString = (await promises.readFile(resolve(__dirname, '..', 'public', 'factoryConfig.yaml'))).toString()
    const config = parseAndCheckConfig(factoryConfigString)
    return config
}

describe('config', async function () {
    let config = await getConfig()
    describe('factoryConfig', () => {
        it('should be a config', async () => {
            assert.typeOf(config, "object")
            assert.typeOf(config.formats, "object")
            assert.typeOf(config.urlRules, "array")
        });
    })
    describe('getContextMenus', () => {
        it('returns config menus', () => {
            const contextMenus = configModule.contextMenus(config)
            const expected = [
                { id: 'Markdown', title: 'Markdown', contexts: ['action'] },
                { id: 'Asciidoc', title: 'Asciidoc', contexts: ['action'] }
            ]
            assert.deepEqual(contextMenus, expected)
        })
    })
    describe('mergeConfigs', () => {
        let config1, config2, expectedMerge
        it('tests valid configs', () => {
            for (const yaml of [config1, config2, expectedMerge]) {
                config1 = parseAndCheckConfig(config1YAML)
                config2 = parseAndCheckConfig(config2YAML)
                expectedMerge = parseAndCheckConfig(expectedMergeYAML)
            }
        })
        it('merges formats', () => {
            const actual = configModule.mergeConfigs([config1, config2])
            assert.deepEqual(actual, expectedMerge)
        })
    })
    describe('remote rules', () => {
        /*
            We want to test that remote rules work (recursively). So we create this test case.
            There are a number of "urls" (integers) where some of them have some others as remotes.
            In the following, 1-4 are without remotes, 5 has 1 and 2 as remotes etc. I hope this "picture" explains it

            = url
                = Remote
            1
            2
            3
            4
            5
                1
                2
            6
                3
                4
            7
                5
                6

            And so when we ask for url 7 to be resolved, it means that it resolves 5 and 6
            first and they in turn also get resolved. In the end, we want the sequence in expectedResolvedSequence
        */
        const expectedResolvedSequence = [
            1,
            2,
            5,
            3,
            4,
            6,
            7,
        ]

        function fetchConfig(url) {
            config = {
                formats: {
                    ['format_' + url]: {
                        template: `This is url: ${url}`
                    }
                },
                urlRules: [{
                    urlPattern: 'http://server_' + url,
                    rules: []
                }]
            }
            let remotes = []
            if (url == 5)
                remotes = [1, 2]
            if (url == 6)
                remotes = [3, 4]
            if (url == 7)
                remotes = [5, 6]
            config.remoteRules = remotes
            return config
        }
        it('can fetchRemoteConfigs', async function () {
            const origConfig = fetchConfig(7)
            const resolved = await configModule.fetchRemoteConfigs(origConfig.remoteRules, fetchConfig)
            const servers = resolved.map(r => parseInt(r.urlRules[0].urlPattern.replace(/^http:\/\/server_/, '')))
            const expect = [5, 6]
            assert.deepEqual(servers, expect)
        })

        it('can resolveRemoteConfigs', async function () {
            const config = fetchConfig(7)
            const resolved = await configModule.resolveRemoteConfigs(config, fetchConfig)
            const servers = resolved.urlRules.map(u => parseInt(u.urlPattern.replace(/^http:\/\/server_/, '')))
            assert.deepEqual(servers, expectedResolvedSequence)
        })
    })
});
