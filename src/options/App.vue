<script>
import { getConfig, onConfigChange } from '../browserConfig.js'
import jsonStableStringify from 'json-stable-stringify'

export default {
    data() {
        return {
            config: null
        }
    },
    async mounted() {
        const config = await getConfig()
        this.config = config
        onConfigChange((oldVal, newVal) => {
            // There is a potential race condition here. If we save a config,
            // and we assume it takes an hour for the onConfigChange to fire,
            // the user could save again in the mean time. Then when the
            // onConfigChange eventually fires, we will set it back to an old
            // version and then when the second onConfigChange fires, we will
            // set it to the new version. I think it is unlikely to happen in
            // real life, though.

            // We do check though that 'essentially' this is the same value
            if (jsonStableStringify(this.config) === jsonStableStringify(newVal))
                return
            this.config = newVal
        })
    }
}
</script>
<template>
    <p v-if="config === null">Config is null</p>
    <div v-else>
        <p>This is config:</p>
        <pre>{{ config }}</pre>
    </div>
</template>