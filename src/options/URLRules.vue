<template>
    <VueDraggable ref="el" v-model="list">
        <div v-for="item in list" :key="item.index">
            {{ item }}
        </div>
    </VueDraggable>
</template>

<script>

import * as deep from '../deep.js'

function computeListFromRules(rules) {
    return rules.map((e, index) => {
        return {
            index,
            rule: e
        }
    })
}

function computeRulesFromList(list) {
    return list.map((e) => e.rule)
}

import { VueDraggable } from 'vue-draggable-plus'
export default {
    data() {
        return {
            list: computeListFromRules(this.rules)
        }
    },
    props: {
        rules: null,
    },
    components: { VueDraggable },
    methods: {
    },
    watch: {
        list: {
            handler(nv) {
                const rules = computeRulesFromList(nv)
                if (deep.equal(rules, this.rules))
                    return
                // console.log('wlist', nv)
                this.$emit('urlRulesChanged', rules)
            },
            deep: true
        },
        rules: {
            handler(nv) {
                const rules = computeRulesFromList(this.list)
                if (deep.equal(rules, nv))
                    return
                // console.log('wrules', nv)
                const list = computeListFromRules(nv)
                this.list = list
            },
            deep: true
        }
    }
}
</script>