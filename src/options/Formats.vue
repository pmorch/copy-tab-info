<template>
    <!-- This extra div is necessary to avoid button becoming 100% wide -->
    <div class="add-format-button-container">
        <button type="button" class="btn btn-primary btn-sm" @click="addFormat" title="New Format">
            <div class="fa fa-plus-circle"></div>  New Format
        </button>
    </div>
    <VueDraggable :modelValue="formats" @start="dragging = true" @end="dragging = false">
        <div v-for="(format, index) in formats" :key="`format-${index}`">
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
            dragging: false,
        }
    },
    props: ['formats'],
    components: { VueDraggable, Format },
    emits: ['formatsChanged'],
    methods: {
        formatsChanged(newFormats) {
            this.$emit('formatsChanged', newFormats)
        },
        formatChanged(index, nv) {
            const newFormats = [ ...this.formats ]
            newFormats[index] = nv
            this.formatsChanged(newFormats)
        },
        formatDelete(index) {
            const newFormats = [ ...this.formats ]
            newFormats.splice(index, 1)
            this.formatsChanged(newFormats)
        },
        addFormat() {
            const newFormats = [ ...this.formats ]
            newFormats.push({
                name: 'New Format',
                template: 'Title: {{{title}}} URL: {{{URL}}}{{#suffix}} Suffix: {{{suffix}}}{{/suffix}}'
            })
            this.formatsChanged(newFormats)
        }
    },
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
