<script>
export default {
    data() {
        return {
        }
    },
    props: ['index', 'elementState' ],
    emits: ['delete'],
    methods: {
        edit() {
            this.elementState.setEditing(true)
        },
        deleteElement() {
            this.elementState.disableAllEditing()
            this.$emit('delete')
        }
    },
    components: {},
}
</script>

<template>
    <div class="card my-2 arrayElement">
        <div class="arrayElement-controls"  v-if="! elementState.getEditing()">
            <div class="p-2 fa fa-pencil edit-icon" title="Edit" @click="edit"></div>
            <div class="fa fa-trash p-2 trash-icon" title="Delete" @click.stop="deleteElement"></div>
        </div>
        <slot></slot>
    </div>
</template>

<style scoped>
div.arrayElement {
    cursor: grab;
    position: relative
}
div.arrayElement-controls {
    position: absolute;
    top: 0;
    right: 0;
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