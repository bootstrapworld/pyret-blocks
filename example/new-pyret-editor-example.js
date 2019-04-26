import './example-page.less';
import dsExampleCode from './bootstrap-ds.arr';
import pyret from '../src/languages/pyret';
import CodeMirrorBlocks from 'codemirror-blocks';

const smallExampleCode = `1 + 2`;

const useBigCode = true;
const exampleCode = useBigCode? dsExampleCode : smallExampleCode;

// grab the DOM Node to host the editor, and use it to instantiate
const container = document.getElementById('cmb-editor');
const editor = new CodeMirrorBlocks(container, {value: exampleCode}, pyret);
editor.setBlockMode(true);

// for debugging purposes
window.editor = editor
console.log(editor);
