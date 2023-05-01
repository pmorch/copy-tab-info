<script>
import { getConfig, onConfigChange } from '../browserConfig.js'
export default {
    data() {
        return {
            config: null
        }
    },
    async mounted() {
        const config = await getConfig()
        this.config = config
        // onConfigChange((oldVal, newVal) => {
        //     // One could use this:
        //     // https://www.npmjs.com/package/json-stable-stringify
        //     // to compare the this.config with newVal to see if this
        //     // is a real config change
        //     //
        //     // But we'll need to debounce it to ensure that config changes that we performed in the past
        //     // don't cause us to revert to a previous value
        //     // The config really should have a version number so we can detect if this is a new or old change
        //     // here be dragons: Linear version numbers in a distributed system? This is asking for trouble...
        // })
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