<script>
export default {
    props: {
        format: null
    },
    emits: ['formatChanged'],
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
    <div class="format my-2">
        <p>template: {{ format.template }}</p>
        <input type="text" :value="format.template" @input="e => setTemplate(e.target.value)" />
        <pre>{{ format }}</pre>
    </div>
</template>

<style>
    div.format {
        border: 1px solid red
    }
</style>
