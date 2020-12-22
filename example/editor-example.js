import PyretCMB from '../src/languages/pyret';
// import React, { Component } from 'react';
// import ReactDOMServer from 'react-dom/server';
import StyleSelector from '../src/less/style-selector';
import './example-page.less';
import dsExampleCode from './bootstrap-ds.arr';
import { testing }  from "codemirror-blocks";


/// DEBUGGING STUFF
import { wait, teardown } from '../spec/support/test-utils';
import {
  click,
  keyDown,
  _keyPress,
  _insertText,
} from '../spec/support/simulate';

const DELAY = 250;



const smallExampleCode = `load-spreadsheet("14er5Mh443Lb5SIFxXZHdAnLCuQZaA8O6qtgGlibQuEg")`;

const useBigCode = false;
const exampleCode = useBigCode? dsExampleCode : smallExampleCode;

// grab the DOM Node to host the editor, and use it to instantiate
const container = document.getElementById('cmb-editor');
const editor = PyretCMB(container, {value: exampleCode, collapseAll: false});
editor.setBlockMode(true);

// Constructs the Style Selector below the Code Monitor
const selectorBox = document.getElementById('style-selector');
// const themeBox = document.getElementById('theme-selector');
// console.log(selectorBox);
const selector = new StyleSelector(selectorBox);
selector.display();
// selector.innerHTML = ReactDOMServer.renderToString(<StyleSelector />); // StyleSelector; 

// for debugging purposes
window.editor = editor
document.getElementById('testButton').onclick = runTestEvent;

async function runTestEvent(){
	let ast = editor.getAst();
    this.literal1 = ast.rootNodes[0];
    console.log('first root is', this.literal1);
	console.log('before anything, activeElement is', document.activeElement);
	testing.click(this.literal1);
    await wait(DELAY);
    console.log('after clicking, activeElement is', document.activeElement)
    testing.keyDown("ArrowDown");
    await wait(DELAY);
    console.log('after ArrowDown, activeElement is', document.activeElement)
}

export let selectedStyle = "default";