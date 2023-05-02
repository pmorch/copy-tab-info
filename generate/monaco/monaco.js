// See "About the Monaco Editor" in the project's README.md and don't just
// import * as monaco from 'monaco-editor'
// it creates a huge bundle...
// See also https://stackoverflow.com/a/76151598/345716
import 'monaco-editor/esm/vs/editor/browser/coreCommands.js';
import 'monaco-editor/esm/vs/editor/contrib/find/browser/findController.js';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';
import 'monaco-editor/esm/vs/basic-languages/yaml/yaml.contribution.js';

import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'

window.monacoExports = {
    editorWorker,
    monaco
}
