<script>
export default {
    props: {
        format: null
    },
    methods: {
        setTemplate(nv) {
            const format = {
                ...this.format,
                template: nv
            }
            console.log('emitting', format)
            this.$emit('formatChanged', format)
        }
    }
}
</script>

<template>
    <div>
        <p>template: {{ format.template }}</p>
        <input type="text" :value="format.template" @input="e => setTemplate(e.target.value)" />
        <pre>{{ format }}</pre>
    </div>
</template>