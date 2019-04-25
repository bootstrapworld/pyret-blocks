// import pyret from '../node_modules/codemirror-blocks';
import CodeMirrorBlocks from '../node_modules/codemirror-blocks/dist/CodeMirrorBlocks';
import './example-page.less';
import dsExampleCode from './bootstrap-ds.arr';
//import bigExampleCode from './ast-test.rkt';


//const smallExampleCode = `(+ 1 2) ;comment\n(+ 3 4)`;
const smallExampleCode = `1 + 2`;

const useBigCode = true;
//const exampleCode = useBigCode ? bigExampleCode : smallExampleCode;
const exampleCode = useBigCode? dsExampleCode : smallExampleCode;

// grab the DOM Node to host the editor, and use it to instantiate
const container = document.getElementById('cmb-editor');
const editor = new CodeMirrorBlocks(container, {value: exampleCode}, pyret);
editor.setBlockMode(true);

// for debugging purposes
window.editor = editor
console.log(editor);
