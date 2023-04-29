import { matchPattern } from 'browser-extension-url-match'
import memoize from 'lodash.memoize'

const memoizedMatchPattern = memoize(matchPattern)


export function applyUrlRule(fields, urlRule) {
    const matcher = memoizedMatchPattern(urlRule.urlPattern)
    if (! matcher.match(fields.url)) {
        // console.log("nomatch", urlRule.urlPattern, fields.url )
        return
    }
    // console.log("match", urlRule.urlPattern, fields.url )
    for (const rule of urlRule.rules) {
        if (!(rule.field in fields)) {
            throw new Error(`Didn't find ${rule.field} in fields`)
        }
        // Store them if there are named capture groups that don't start with an
        // _underscore
        if (rule.match.match(/\(\?\<[^_]/)) {
            const match = fields[rule.field].match(rule.match)
            if (match && match.groups) {
                for (const f in match.groups) {
                    if (f.match(/^_/))
                        continue
                    fields[f] = match.groups[f]
                }
            }
        }
        fields[rule.field] = fields[rule.field].replace(new RegExp(rule.match), rule.replacement)
    }
}

export function applyUrlRules(fields, urlRules) {
    for (const urlRule of urlRules) {
        applyUrlRule(fields, urlRule)
    }
}
