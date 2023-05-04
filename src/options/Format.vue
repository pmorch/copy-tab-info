<script>
export default {
    data() {
        return {
            editing: false
        }
    },
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
        },
        toggleEditing() {
            this.editing = ! this.editing
        },
        formatClass() {
            return {
                editing: this.editing
            }
        }
    }
}
</script>

<template>
    <div class="format my-2" :class="formatClass()" @click="toggleEditing">
        {{ editing }}
        <p>template: {{ format.template }}</p>
        <input type="text" :value="format.template" @input="e => setTemplate(e.target.value)" />
        <pre>{{ format }}</pre>
    </div>
</template>

<style>
    div.format {
        border: 1px solid green
    }
    div.format.editing {
        border: 1px solid red
    }
</style>
