<script>
import { reactive } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import arrayState from './arrayState.js'
import ArrayElement from './ArrayElement.vue'
import URLRule from './URLRule.vue'
export default {
    data() {
        return {
            arrayState: reactive(new arrayState()),
        }
    },
    props: {
        urlRules: null,
    },
    methods: {
        addUrlRule() {
            // Add a new urlRule with bogus data
            this.urlRules.push({
                urlPattern: "https://new-website/*",
                rules: [{
                    field: 'title',
                    match: '^Some (?<_demo>regexp)$',
                    replacement: "Other $<_demo>"
                }]
            })
        },
        deleteUrlRule(index) {
            this.urlRules.splice(index, 1)
        }
    },
    components: { VueDraggable, URLRule, ArrayElement },
}
</script>

<template>
    <div class="add-urlRule-button-container">
        <button type="button" class="btn btn-primary btn-sm" @click="addUrlRule" title="New Format">
            <div class="fa fa-plus-circle"></div> New URL Rule
        </button>
    </div>
    <VueDraggable :modelValue="urlRules" @start="arrayState.setDragging(true)" @end="arrayState.setDragging(false)">
        <div v-for="(urlRule, index) in urlRules" :key="index">
            <ArrayElement :elementState="arrayState.getElementState(index)" @delete="deleteUrlRule(index)">
                <URLRule :elementState="arrayState.getElementState(index)" :urlRule="urlRule"
                    @urlRuleChanged="nv => urlRuleChanged(index, nv)" />
            </ArrayElement>
        </div>
    </VueDraggable>
</template>

<style>
.add-urlRule-button-container {
    position: relative;
}

.add-urlRule-button-container .btn {
    position: absolute;
    top: -2.6em;
    right: 0;
}
</style>
