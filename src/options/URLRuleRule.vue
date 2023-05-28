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
        editing() {
            return this.elementState.getEditing()
        },
        setUseReplacement(event) {
            const nv = event.target.checked
            if (nv) {
                this.rule.replacement = ""
            } else {
                delete this.rule.replacement
            }
        },
        emptyDisp(str) {
            if (str == '')
                return '<empty-string>'
            else
                return str
        }
    },
}
</script>

<template>
    <div class="card-body">
        <div class="card-text" v-if="editing()">
            <form>
                <div class="form-group row">
                    <div class="col-2">Field</div>
                    <div class="col-10">
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="field" id="field1" value="title"
                                v-model="rule.field">
                            <label class="form-check-label" for="field1">title</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="field" id="field1" value="url"
                                v-model="rule.field">
                            <label class="form-check-label" for="field1">URL</label>
                        </div>
                    </div>
                </div>
                <div class="form-group row">
                    <label for="match" class="col-2 col-form-label">Match</label>
                    <div class="col-10">
                        <input type="text" class="form-control" id="match" v-model="rule.match" required>
                    </div>
                </div>
                <div class="form-group row">
                    <div class="col-2">Replacement</div>
                    <div class="col-10">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="useReplacement"
                                :checked="'replacement' in rule" @input="setUseReplacement">
                            <label class="form-check-label" for="useReplacement">
                                Use Replacement
                            </label>
                        </div>
                        <input type="text" class="form-control" id="replacement" v-model="rule.replacement"
                            v-if="'replacement' in rule">
                    </div>
                </div>
            </form>
            <button type="button" class="btn btn-outline-primary btn-sm" @click="doneEditing">Done</button>
        </div>
        <div class="card-text" v-else>
            <div>
                <div class="field-name">
                    Field
                </div>
                <div class="field-value"><code>{{ rule.field }}</code></div>
            </div>
            <div>
                <div class="field-name">
                    Match
                </div>
                <div class="field-value"><code>{{ emptyDisp(rule.match) }}</code></div>
            </div>
            <div v-if="'replacement' in rule">
                <div class="field-name">
                    Replacement
                </div>
                <div class="field-value"><code>{{ emptyDisp(rule.replacement) }}</code></div>
            </div>
        </div>
    </div>
</template>
