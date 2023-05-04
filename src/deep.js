import jsonStableStringify from 'json-stable-stringify'

export function equal(a, b) {
    return jsonStableStringify(a) == jsonStableStringify(b)
}

export function copy(src) {
    return JSON.parse(JSON.stringify(src))
}

