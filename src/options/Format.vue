<script>
export default {
    props: ['format', 'elementState'],
    methods: {
        doneEditing() {
            this.elementState.setEditing(false)
        },
        editing() {
            return this.elementState.getEditing()
        },
    },
    computed: {
        contextMenuBool: {
            get() {
                return !('contextMenu' in this.format)
            },
            set(nv) {
                if (nv) {
                    delete this.format.contextMenu
                } else {
                    this.format.contextMenu = false
                }
            }
        }
    }
}
</script>

<template>
    <div class="card-body">
        <h5 class="card-title"><span v-if="editing()">Editing: </span>{{ format.name }}</h5>
        <div class="card-text" v-if="editing()">
            <form class="was-validated">
                <div class="form-group row">
                    <label for="name" class="col-2 col-form-label">Name</label>
                    <div class="col-10">
                        <input type="text" class="form-control" id="name" v-model="format.name" required>
                    </div>
                    <div class="invalid-feedback">
                        Please provide a name for the format.
                    </div>
                </div>
                <div class="form-group row mt-2">
                    <label for="template" class="col-2 col-form-label">
                        Template
                        <a href="https://mustache.github.io/mustache.5.html" target="_blank">
                            <div class="fa fa-question-circle-o question-icon" title="Template is a Mustache Template">
                            </div>
                        </a>
                    </label>
                    <div class="col-10">
                        <input type="text" class="form-control" id="template" v-model="format.template" required>
                    </div>
                    <div class="invalid-feedback">
                        Please provide a
                        <a href="https://mustache.github.io/mustache.5.html" target="_blank">Mustache template</a>
                        for the format.
                    </div>
                </div>
                <div class="form-group row mt-2">
                    <label for="joinString" class="col-2 col-form-label">Join string</label>
                    <div class="col-10">
                        <input type="text" class="form-control" id="joinString" v-model="format.joinString"
                            placeholder="Join String">
                    </div>
                </div>
                <div class="form-group row mt-2">
                    <label for="contextMenu" class="col-2 col-form-label">Context menu</label>
                    <div class="col-10">
                        <input type="checkbox" class="form-check-input mt-3" id="contextMenu" v-model="contextMenuBool">
                    </div>
                </div>
            </form>
            <button type="button" class="btn btn-outline-primary btn-sm" @click="doneEditing">Done</button>
        </div>
        <div class="card-text" v-else>
            <div class="line">
                <div class="field-name">
                    Template
                    <a href="https://mustache.github.io/mustache.5.html" target="_blank">
                        <div class="fa fa-question-circle-o question-icon" title="Template is a Mustache Template">
                        </div>
                    </a>
                </div>
                <div class="field-value"><code>{{ format.template }}</code></div>
            </div>
            <div class="line" v-if="'joinString' in format">
                <div class="field-name">Join string</div>
                <div class="field-value"><code>{{ format.joinString }}</code></div>
            </div>
            <div class="line">
                <div class="field-name">Context menu</div>
                <div class="field-value">
                    <div v-if="contextMenuBool" class="fa fa-check context-icon" title="Not in context menu"></div>
                    <div v-else class="fa fa-times no-context-icon" title="Not in context menu"></div>
                </div>
            </div>
        </div>
    </div>
</template>
