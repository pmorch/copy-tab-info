<script>
import { reactive } from 'vue'
import cardArrayState from './cardArrayState.js'
import CardArray from './CardArray.vue'
import CardArrayElement from './CardArrayElement.vue'
import Format from './Format.vue'
export default {
    data() {
        return {
            arrayState: reactive(new cardArrayState(this.formats)),
        }
    },
    props: ['formats'],
    methods: {
        addFormat() {
            this.formats.push({
                name: 'New Format',
                template: 'Title: {{{title}}} URL: {{{URL}}}{{#suffix}} Suffix: {{{suffix}}}{{/suffix}}'
            })
        }
    },
    components: { CardArray, CardArrayElement, Format },
}
</script>

<template>
    <!-- This extra div is necessary to avoid button becoming 100% wide -->
    <div class="add-element-button-container">
        <button type="button" class="btn btn-primary btn-sm" @click="addFormat" title="New Format">
            <div class="fa fa-plus-circle"></div> New Format
        </button>
    </div>
    <CardArray :arrayState="arrayState">
        <CardArrayElement :arrayState="arrayState" :index="index" v-for="(format, index) in formats"
            :key="`format-${index}`">
            <Format :format="format" :elementState="arrayState.getElementState(index)"/>
        </CardArrayElement>
    </CardArray>
</template>
