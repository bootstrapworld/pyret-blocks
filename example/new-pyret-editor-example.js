import PyretCMB from '../src/languages/pyret';
import './example-page.less';
import dsExampleCode from './bootstrap-ds.arr';

const smallExampleCode = `1 + 2`;

const useBigCode = true;
const exampleCode = useBigCode? dsExampleCode : smallExampleCode;

// grab the DOM Node to host the editor, and use it to instantiate
const container = document.getElementById('cmb-editor');
const editor = PyretCMB(container, {value: exampleCode, collapseAll: false});
editor.setBlockMode(true);

// for debugging purposes
window.editor = editor
console.log(editor);
