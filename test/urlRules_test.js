import { assert } from 'chai'

import * as urlRulesModule from '../src/urlRules.js'

describe('urlRules', function () {
    describe('applyUrlRule', () => {
        const urlRule = {
            urlPattern: 'https://foo.com/*',
            rules: [
                {
                    field: 'title',
                    match: 'foo',
                    replacement: 'bar',
                },
            ],
        }

        const tests = [
            {
                desc: "Modifies if url match",
                urlRule,
                input: { title: "this is foo", url: 'https://foo.com/some/page.html' },
                expected: { title: "this is bar", url: 'https://foo.com/some/page.html' },
            },
            {
                desc: "Doesn't modify if urls don't match",
                urlRule,
                input: { title: "this is foo", url: 'https://notfoo.com/some/page.html' },
                expected: { title: "this is foo", url: 'https://notfoo.com/some/page.html' },
            },
        ]
        for (const test of tests) {
            it(test.desc, () => {
                const actual = { ...test.input }
                urlRulesModule.applyUrlRule(actual, test.urlRule)
                assert.deepEqual(actual, test.expected)
            })
        }
    })
    describe('applyUrlRules', () => {
        const urlRules = [
            {
                urlPattern: 'https://*.foo.com/*',
                rules: [
                    {
                        field: 'title',
                        match: 'foo',
                        replacement: 'bar',
                    },
                ],
            },
            {
                urlPattern: 'https://one.foo.com/*',
                rules: [
                    {
                        field: 'url',
                        match: 'one',
                        replacement: 'two',
                    },
                ],
            }
        ]

        const tests = [
            {
                desc: "Modifies if url match",
                urlRules,
                input: { title: "this is foo", url: 'https://one.foo.com/some/page.html' },
                expected: { title: "this is bar", url: 'https://two.foo.com/some/page.html' },
            },
            {
                desc: "Doesn't modify if urls don't match",
                urlRules,
                input: { title: "this is foo", url: 'https://notfoo.com/some/page.html' },
                expected: { title: "this is foo", url: 'https://notfoo.com/some/page.html' },
            },
            {
                desc: "Create a new field",
                urlRules: [
                    {
                        urlPattern: 'https://one.foo.com/*',
                        rules: [
                            {
                                field: 'title',
                                match: '(?<suffix>.+) for (?<_other_field>.+)',
                                replacement: '$<_other_field>',
                            },
                        ],
                    }
                ],
                input: { title: "suffix for foo", url: 'https://one.foo.com/some/page.html' },
                expected: { title: "foo", url: 'https://one.foo.com/some/page.html', suffix: 'suffix' },
            },
            {
                desc: "Pastebin - use value from url in title",
                urlRules: [
                    {
                        urlPattern: 'https://pastebin.com/*',
                        rules: [
                            {
                                field: 'url',
                                match: 'https://pastebin.com/(?<pasteid>.+)$',
                            },
                            {
                                field: 'title',
                                match: '^(?<_title>.+) - Pastebin.com$',
                                replacement: 'pastebin/${pasteid}: $<_title>',
                            },
                        ],
                    }
                ],
                input: {
                    title: "foobar - Pastebin.com",
                    url: 'https://pastebin.com/U2FSNpDX'
                },
                expected: {
                    title: "pastebin/U2FSNpDX: foobar",
                    url: 'https://pastebin.com/U2FSNpDX',
                    pasteid: "U2FSNpDX"
                },
            }
        ]
        for (const test of tests) {
            it(test.desc, () => {
                const actual = { ...test.input }
                urlRulesModule.applyUrlRules(actual, test.urlRules)
                assert.deepEqual(actual, test.expected)
            })
        }
    })
})
