<script>
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.esm.js'

import 'font-awesome/css/font-awesome.css'

import { getConfig, setConfig, resetConfig as resetBrowserConfig, onConfigChange } from '../browserConfig.js'
import * as deep from '../deep.js'
import Formats from './Formats.vue'
import URLRules from './URLRules.vue'
import MonacoEditor from './MonacoEditor.vue'

const pageNavItems = [
    { name: 'formats', title: "Formats" },
    { name: 'urlRules', title: "URL Rules" },
    { name: 'editor', title: "Editor" },
]

const initialPageNavItemName = 'formats'

export default {
    data() {
        return {
            config: null,
            yamlValidationErrors: null,
            schemaValidationErrors: null,
            pageNavItem: pageNavItems.filter(ni => ni.name === initialPageNavItemName)[0],
            pageNavItems,
        }
    },
    async mounted() {
        const config = await getConfig()
        this.config = config
        onConfigChange((newVal) => {
            // There is a potential race condition here. If we save a config,
            // and we assume it takes an hour for the onConfigChange to fire,
            // the user could save again in the mean time. Then when the
            // onConfigChange eventually fires, we will set it back to an old
            // version and then when the second onConfigChange fires, we will
            // set it to the new version. I think it is unlikely to happen in
            // real life, though.

            // We do check though that 'essentially' this is the same value, so
            // we we don't call newConfig because newConfig set the value
            if (deep.equal(this.config, newVal))
                return
            this.newConfig(newVal)
        })
    },
    methods: {
        newConfig(newValue) {
            this.config = newValue
            this.onYamlValidationErrors(null)
            this.onSchemaValidationErrors(null)
        },
        isMonacoVisible() {
            return true
        },
        onYamlValidationErrors(errors) {
            this.yamlValidationErrors = errors
        },
        onSchemaValidationErrors(errors) {
            this.schemaValidationErrors = errors
        },
        saveConfig() {
            setConfig(this.config)
        },
        async resetConfig() {
            await resetBrowserConfig()
            this.config = await getConfig()
        },
        navItemClass(item) {
            return {
                "nav-link": true,
                active: item.name == this.pageNavItem.name
            }
        },
        ariaCurrent(item) {
            return item.name == this.pageNavItem.name
        },
        setUrlRules(nv) {
            this.config.urlRules = nv
        },
        setFormats(nv) {
            console.log('setFormats', nv)
            this.config.formats = nv
        }
    },
    components: { Formats, URLRules, MonacoEditor }
}
</script>
<template>
    <!-- Modal -->
    <div class="modal fade" id="resetConfigModal" tabindex="-1" aria-labelledby="resetConfigModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="resetConfigModalLabel">Reset Configuration</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    Are you sure you want to reset back to the factory configuration?
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button @click="resetConfig" type="button" class="btn btn-primary"
                        data-bs-dismiss="modal">Reset</button>
                </div>
            </div>
        </div>
    </div>

    <p v-if="config === null">Loading config...</p>
    <div class="container.fluid d-flex flex-column h-100" v-else>
        <nav class="navbar navbar-expand navbar-dark bg-dark p-2 mx-n2">
            <img class="me-2" src="/icons/link-32.png">
            <span class="navbar-brand">Copy Tab Info Options:</span>

            <div class="collapse navbar-collapse" id="navbarsExampleXxl">
                <ul class="navbar-nav me-auto mb-0">
                    <li class="nav-item" v-for="pni in pageNavItems">
                        <a :class="navItemClass(pni)" @click="pageNavItem = pni" :aria-current="ariaCurrent(pni)"
                            href="#">{{ pni.title }}</a>
                    </li>
                </ul>
            </div>
        </nav>
        <h4 class="p-2 mb-0">{{ pageNavItem.title }}</h4>
        <div class="container.fluid p-2 d-flex flex-column flex-grow" v-if="pageNavItem.name == 'formats'">
            <Formats :formats="config.formats" @formatsChanged="setFormats"></Formats>
        </div>
        <div class="container.fluid p-2 d-flex flex-column h-100" v-else-if="pageNavItem.name == 'urlRules'">
            <URLRules :rules="config.urlRules" @urlRulesChanged="setUrlRules"></URLRules>
        </div>
        <div class="container.fluid p-2 d-flex flex-column h-100" v-else-if="pageNavItem.name == 'editor'">
            <div class="h-100 d-flex flex-column">
                <MonacoEditor class="yaml-editor mb-4 flex-grow-1" :visible="isMonacoVisible()" :value="config"
                    @newValue="newConfig" @yamlValidationErrors="onYamlValidationErrors"
                    @schemaValidationErrors="onSchemaValidationErrors" />
                <div id="validation-errors-alerts" class="d-flex flex-column justify-content-center">
                    <div v-if="yamlValidationErrors == null && schemaValidationErrors == null" class="alert alert-success"
                        role="alert">
                        <b>YAML</b> and <b>Schema</b> are both valid
                    </div>
                    <div v-else-if="yamlValidationErrors != null" class="alert alert-danger" role="alert">
                        <p><b>YAML</b> is invalid:</p>
                        <pre class="mb-0">{{ yamlValidationErrors }}</pre>
                    </div>
                    <div v-else-if="schemaValidationErrors != null" class="alert alert-danger" role="alert">
                        <p><b>Schema</b> is invalid:</p>
                        <p v-for="error in schemaValidationErrors">
                            <code>{{ error.instancePath }}</code>: {{ error.message }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div class="container.fluid p-2 d-flex flex-column h-100" v-else>
            No "{{ pageNavItem.title }}" implementation yet
        </div>
        <div class="p-2">
            <button class="btn btn-primary"
                :class="{ disabled: yamlValidationErrors != null || schemaValidationErrors != null }"
                @click="saveConfig">Save</button>
            <button type="button" class="ms-2 btn btn-secondary" data-bs-toggle="modal" data-bs-target="#resetConfigModal">
                Reset configuration...
            </button>
        </div>
        <!--
        <pre>{{ config }}</pre>
        -->
    </div>
</template>

<style>
html,
body,
#app {
    height: 100vh;
}

#validation-errors-alerts {
    height: 200px;
    overflow-y: auto;
}

.yaml-editor {
    /* This makes no sense to me.
     If this is missing growing works, but shrinking doesn't
     With this present, height acts as min-height, which is exactly what I want */
    height: 150px;
    border: 2px solid grey;
    overflow: hidden
}
</style>
