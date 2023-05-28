class arrayElementState {
    constructor(arrayState, index) {
        this.arrayState = arrayState
        this.index = index
    }
    getEditing() {
        return this.arrayState.getEditing(this.index)
    }
    setEditing(nv) {
        this.arrayState.setEditing(this.index, nv)
    }
    toggleEditing() {
        this.arrayState.toggleEditing(this.index)
    }
    disableAllEditing() {
        this.arrayState.disableAllEditing()
    }
}

export default class arrayState {
    constructor() {
        this.isDragging = false
        this.isEditing = {}
    }
    getDragging() {
        return this.isDragging
    }
    setDragging(nv) {
        if (nv) {
            this.disableAllEditing()
        }
        this.isDragging = nv
    }
    disableAllEditing() {
        for (const index in this.isEditing) {
            this.setEditing(index, false)
        }
    }
    getElementState(index) {
        return new arrayElementState(this, index)
    }
    setEditing(index, nv) {
        if (nv) {
            this.isEditing[index] = true
        } else {
            delete this.isEditing[index]
        }
    }
    getEditing(index) {
        return index in this.isEditing
    }
    toggleEditing(index) {
        this.setEditing(index, !this.getEditing(index))
    }
}