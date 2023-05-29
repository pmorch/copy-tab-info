<script>
import { VueDraggable } from 'vue-draggable-plus'
export default {
    props: ['arrayState'],
    components: { VueDraggable },
}
</script>

<template>
    <VueDraggable :modelValue="arrayState.getArray()" @start="arrayState.setDragging(true)"
        @end="arrayState.setDragging(false)">
        <slot></slot>
    </VueDraggable>
</template>