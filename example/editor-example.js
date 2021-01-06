import PyretCMB from '../src/languages/pyret';
import StyleSelector from '../src/languages/pyret/style-selection/style-selector';
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



const smallExampleCode = `
lam(x): x + 1 end
f = lam(x): x + 1 end\nx = 1\na = x + 1\n 

ask: | x == 3 then: 3| x == 5 then: 5 end

fun f(x): 
  y = x - 10 
  z = x - 10 
  y
end

reactor:
  seconds-per-tick: 0.1,
  title: "Count by 10",
  on-tick: tencrement,
  init: 10,
end

a = lam(n :: Number) -> Number:
  y = n + 1
  z = y * 2
  z
end

fun add(n :: Number) -> Number:
  fun sub(num :: Number) -> Number:
    num - 1
  end
  n + 1
end

when x > 1:
  y = x + 5
  y
end

check "test message": 
  3 is 3
  foo-bar-baz() is 12345
  3 is-not 4
  5 is=~ 5.000001
end

if x == 3: 4
else: 5
end

if x > 5:
  y = x + 1
  z = y + 1
  z
else:
  x
end
`;

const useBigCode = false;
const exampleCode = useBigCode? dsExampleCode : smallExampleCode;

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
