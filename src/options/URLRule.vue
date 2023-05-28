<script>
import { reactive } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import arrayState from './arrayState.js'
import ArrayElement from './ArrayElement.vue'
import URLRuleRule from './URLRuleRule.vue'

export default {
    data() {
        return {
            rulesArrayState: reactive(new arrayState()),
        }
    },
    props: ['urlRule', 'elementState'],
    emits: ['urlRuleChanged', 'delete'],
    methods: {
        doneEditing() {
            this.elementState.setEditing(false)
        },
        deleteUrlRule() {
            this.$emit('delete')
        },
        addRule() {
            this.urlRule.rules.push({
                field: 'title',
                match: '^Some (?<_demo>regexp)$',
                replacement: "Other $<_demo>"
            })
        },
        deleteRule(index) {
            this.urlRule.rules.splice(index, 1)
        },
        editing() {
            return this.elementState.getEditing()
        }
    },
    components: { VueDraggable, ArrayElement, URLRuleRule },
}
</script>

<template>
    <div class="card-body">
        <h5 class="card-title">
            <span v-if="editing()">Editing </span>
            URL Pattern: <code>{{ urlRule.urlPattern }}</code>
        </h5>
        <div class="card-text" v-if="editing()">
            <form class="was-validated">
                <div class="form-group row">
                    <label for="pattern" class="col-2 col-form-label">URL Pattern</label>
                    <div class="col-10">
                        <input type="text" class="form-control" id="pattern" v-model="urlRule.urlPattern" required>
                    </div>
                    <div class="invalid-feedback">
                        Please provide a name for the format.
                    </div>
                </div>
            </form>
            <button type="button" class="btn btn-outline-primary btn-sm" @click="doneEditing">Done</button>
        </div>
        <div class="card-text" v-else>
            <div class="row me-5">
                <div class="col-2">
                    Field Match Rules
                    <div>
                        <button type="button" class="mt-2 btn btn-primary btn-sm" @click="addRule" title="New Format">
                            <div class="fa fa-plus-circle"></div> New Rule
                        </button>
                    </div>
                </div>
                <div class="col-10">
                    <VueDraggable :modelValue="urlRule.rules" @start="rulesArrayState.setDragging(true)"
                        @end="rulesArrayState.setDragging(false)">
                        <ArrayElement :elementState="rulesArrayState.getElementState(index)" @delete="deleteRule(index)"
                            v-for="(rule, index) in urlRule.rules" :key="index">
                            <URLRuleRule :elementState="rulesArrayState.getElementState(index)" :rule="rule" />
                        </ArrayElement>
                    </VueDraggable>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
</style>
