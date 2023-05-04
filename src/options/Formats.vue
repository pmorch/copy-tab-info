<template>
    <VueDraggable v-model="formatsCopy" @update="onSorted" @start="dragging = true" @end="dragging = false">
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
        emitFormatsCopyChanged() {
            const formats = [
                ...this.formatsCopy
            ]
            this.$emit('formatsChanged', formats)
        },
        onSorted(e, ...args) {
            // https://github.com/Alfred-Skyblue/vue-draggable-plus/issues/15 about nextTick
            nextTick(() => {
                this.emitFormatsCopyChanged()
            })
        },
        formatChanged(index, nv) {
            this.formatsCopy[index] = nv
            this.emitFormatsCopyChanged()
        },
        formatDelete(index) {
            this.formatsCopy.splice(index, 1)
        },
    },
    watch: {
        formats() {
            const equal = deep.equal(this.formats, this.formatsCopy)
            console.log('formats equal', equal)
            if (equal)
                return
            this.formatsCopy = [
                ...this.formats
            ]
            console.log('fc', this.formats, this.formatsCopy)
        }
    }
}
</script>
