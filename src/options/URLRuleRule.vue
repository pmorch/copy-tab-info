<script>
export default {
    data() {
        return {
        }
    },
    props: ['rule', 'elementState'],
    emits: ['ruleChanged', 'delete'],
    methods: {
        doneEditing() {
        this.elementState.setEditing(false)
        },
        deleteRule() {
            this.$emit('delete')
        },
        editing() {
            return this.elementState.getEditing()
        }
    },
}
</script>

<template>
    <div class="card-body">
        <div class="card-text" v-if="editing()">
            <form class="was-validated">
                <div class="form-group row">
                    <label for="field" class="col-2 col-form-label">Field</label>
                    <div class="col-10">
                        <input type="text" class="form-control" id="field" v-model="rule.field" required>
                    </div>
                    <div class="invalid-feedback">
                        Please provide a field for the rule.
                    </div>
                </div>
                <div class="form-group row">
                    <label for="match" class="col-2 col-form-label">Match</label>
                    <div class="col-10">
                        <input type="text" class="form-control" id="match" v-model="rule.match" required>
                    </div>
                    <div class="invalid-feedback">
                        Please provide a match for the rule.
                    </div>
                </div>
                <div class="form-group row">
                    <label for="replacement" class="col-2 col-form-label">Replacement</label>
                    <div class="col-10">
                        <input type="text" class="form-control" id="replacement" v-model="rule.replacement">
                    </div>
                </div>
            </form>
            <button type="button" class="btn btn-outline-primary btn-sm" @click="doneEditing">Done</button>
        </div>
        <div class="card-text" v-else>
            {{  rule }}
        </div>
    </div>
</template>

<style>
.name,
.value {
    display: inline-block
}

.name {
    width: 7em;
}

.question-icon {
    color: black;
    cursor: pointer;

}
</style>
