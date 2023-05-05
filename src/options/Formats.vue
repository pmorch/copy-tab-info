<template>
    <VueDraggable v-model="formatsCopy" @start="dragging = true" @end="dragging = false">
        <div v-for="(format, index) in formatsCopy" :key="`format-${index}`">
            <Format :format="format" :dragging="dragging" @formatChanged="nv => formatChanged(index, nv)"
                @delete="formatDelete(index)"></Format>
        </div>
    </VueDraggable>
</template>

<script>
import * as deep from '../deep.js'
import { VueDraggable } from 'vue-draggable-plus'
import { nextTick } from 'vue'
import Format from './Format.vue'
export default {
    data() {
        return {
            formatsCopy: [...this.formats],
            dragging: false,
        }
    },
    props: ['formats'],
    components: { VueDraggable, Format },
    emits: ['formatsChanged'],
    methods: {
        formatChanged(index, nv) {
            this.formatsCopy[index] = nv
        },
        formatDelete(index) {
            this.formatsCopy.splice(index, 1)
        },
    },
    watch: {
        formats: {
            handler() {
                const equal = deep.equal(this.formats, this.formatsCopy)
                if (equal)
                    return
                const formatsCopy = [
                    ...this.formats
                ]
                this.formatsCopy = formatsCopy
            },
            deep: true,
        },
        formatsCopy: {
            handler() {
                const equal = deep.equal(this.formats, this.formatsCopy)
                if (equal)
                    return
                const formats = [
                    ...this.formatsCopy
                ]
                this.$emit('formatsChanged', formats)
            },
            deep: true,
        },
    }
}
</script>
