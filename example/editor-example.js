import PyretCMB from '../src/languages/pyret';
import StyleSelector from '../src/languages/pyret/style-selection/style-selector';
import './example-page.less';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/search/search';
import 'codemirror/addon/search/searchcursor';
import dsExampleCode from './bootstrap-ds.arr';
import { testing }  from "codemirror-blocks";


/// DEBUGGING STUFF
import {
  wait,
  teardown,
  click,
  keyDown,
} from 'codemirror-blocks/lib/toolkit/test-utils';

document.body.innerHTML += `
<div class="container editor-example">
  <div class="page-header">
    <h1><a href="/">codemirror-blocks</a> <small>Block Editor Example</small></h1>
  </div>
  <div class="row">
    <div class="col-md-12">
    <div id="theme-selector" class="theme-scratch">
      <!-- <div id="cmb-editor" class="editor-container"/> -->
      <div id="cmb-editor" class="editor-container">
      </div>
    </div>
    </div>
  </div>
  <input type="button" value="Test click event" id="testButton"/>
  <div id="style-selector" class="selector-container">
  </div>
</div>`;


const DELAY = 250;



const code = `var msg = "Hello World"
lam(str :: String) -> String:
  doc: "ABC"
  y = str + "A"
  y
end

x = y + 1

ask:
  | x == 9 then: 1
  | otherwise: 2
end

ask:
  | x == 9 then: 5
end
if x == 10:
  x = 10
else:
  t = 9
end
if x > 0:

end
`;

const code1 = `
order some-table:
  column1 ascending,
  column2 descending
end
`;
const smallExampleCode = code1;

const useBigCode = false;
const exampleCode = useBigCode ? dsExampleCode : smallExampleCode;

// grab the DOM Node to host the editor, and use it to instantiate
const container = document.getElementById('cmb-editor');
const editor = PyretCMB(container, {value: exampleCode, collapseAll: false});
editor.setBlockMode(true);

// Constructs the Style Selector below the Code Monitor
const selectorBox = document.getElementById('style-selector');
const selector = new StyleSelector(selectorBox);
selector.display();

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
