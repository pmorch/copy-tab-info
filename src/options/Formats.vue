<template>
    <!-- This extra div is necessary to avoid button becoming 100% wide -->
    <div class="add-format-button-container">
        <button type="button" class="btn btn-primary btn-sm" @click="addFormat" title="New Format">
            <div class="fa fa-plus-circle"></div>  New Format
        </button>
    </div>
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
        addFormat() {
            this.formatsCopy.push({
                name: 'New Format',
                template: 'Title: {{{title}}} URL: {{{URL}}}{{#suffix}} Suffix: {{{suffix}}}{{/suffix}}'
            })
        }
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

<style>
.add-format-button-container {
    position: relative;
}

.add-format-button-container .btn {
    position: absolute;
    top: -2.6em;
    right: 0;
}</style>
