<script>
export default {
    data() {
        return {
            editing: false
        }
    },
    props: ['format', 'dragging'],
    emits: ['formatChanged', 'delete'],
    watch: {
        dragging(nv) {
            // HACK: When dragging starts, disable editing. Because otherwise if
            // formats[0] is being edited before the drag, formats[0] will also
            // be editing after the drag, but then it will be a different
            // element. This is because in Formats.vue (the parent component) we
            // don't have good keys for the array elements, so we use the array
            // index.
            if (nv) {
                this.editing = false
            }
        }
    },
    methods: {
        setTemplate(nv) {
            const format = {
                ...this.format,
                template: nv
            }
            console.log('emitting', format)
            this.$emit('formatChanged', format)
        },
        toggleEditing() {
            this.editing = !this.editing
        },
        formatClass() {
            return {
                editing: this.editing
            }
        },
        deleteFormat() {
            this.$emit('delete')
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
    <div class="card my-2 format">
        <div class="card-body" v-if="editing">
            <h5 class="card-title">Editing: {{ format.name }}</h5>
            <div class="card-text">
                <form>
                    <div class="form-group row">
                        <label for="name" class="col-2 col-form-label">Name</label>
                        <div class="col-10">
                            <input type="text" class="form-control" id="name" v-model="format.name">
                        </div>
                    </div>
                    <div class="form-group row mt-2">
                        <label for="template" class="col-2 col-form-label">Template</label>
                        <div class="col-10">
                            <input type="text" class="form-control" id="template" v-model="format.template">
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
                <button type="button" class="btn btn-primary" @click="toggleEditing">Done</button>
            </div>
        </div>
        <div class="card-body format-card" @click="toggleEditing" v-else>
            <h5 class="card-title">{{ format.name }}</h5>
            <div class="format-controls m-2">
                <div class="ms-2 fa fa-pencil edit-icon" title="Edit"></div>
                <div class="ms-2 fa fa-trash trash-icon" title="Delete" @click.stop="deleteFormat"></div>
            </div>
            <div class="card-text">
                <div class="line">
                    <div class="name">Template</div>
                    <div class="value"><code>{{ format.template }}</code></div>
                </div>
                <div class="line" v-if="'joinString' in format">
                    <div class="name">Join string</div>
                    <div class="value"><code>{{ format.joinString }}</code></div>
                </div>
                <div class="line">
                    <div class="name">Context menu</div>
                    <div class="value">
                        <div v-if="contextMenuBool" class="fa fa-check context-icon" title="Not in context menu"></div>
                        <div v-else class="fa fa-times no-context-icon" title="Not in context menu"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
div.format {
    cursor: grab;
}

.name,
.value {
    display: inline-block
}

.name {
    width: 7em;
}

.format-card {
    position: relative;

}

.format-controls {
    position: absolute;
    top: 0;
    right: 0;
}

.context-icon {
    color: green;
    cursor: pointer;
    font-size: larger;
}

.no-context-icon {
    color: #d63333;
    cursor: pointer;
    font-size: larger;
}

.edit-icon {
    color: #d6a133;
    cursor: pointer;
}

.trash-icon {
    color: #d63333;
    cursor: pointer;
}
</style>
