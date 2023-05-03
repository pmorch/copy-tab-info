import jsonStableStringify from 'json-stable-stringify'

export function equal(a, b) {
    return jsonStableStringify(a) == jsonStableStringify(b)
}

