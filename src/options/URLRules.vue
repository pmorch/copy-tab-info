<script>
import { reactive } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import cardArrayState from './cardArrayState.js'
import CardArray from './CardArray.vue'
import CardArrayElement from './CardArrayElement.vue'
import URLRule from './URLRule.vue'
export default {
    data() {
        return {
            arrayState: reactive(new cardArrayState(this.urlRules)),
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
    },
    components: { VueDraggable, URLRule, CardArray, CardArrayElement },
}
</script>

<template>
    <div class="add-urlRule-button-container">
        <button type="button" class="btn btn-primary btn-sm" @click="addUrlRule" title="New Format">
            <div class="fa fa-plus-circle"></div> New URL Rule
        </button>
    </div>
    <CardArray :arrayState="arrayState">
            <CardArrayElement :arrayState="arrayState" :index="index" v-for="(urlRule, index) in urlRules" :key="index">
                <URLRule :elementState="arrayState.getElementState(index)" :urlRule="urlRule"
                    @urlRuleChanged="nv => urlRuleChanged(index, nv)" />
            </CardArrayElement>
    </CardArray>
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
