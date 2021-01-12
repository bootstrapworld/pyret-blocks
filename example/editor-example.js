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
a-num = 3
a-string = "three"
a-boolean = true
a-binop = 1 + 3
a-constructor = [list: 1, 2, 3]
a-variable = foo
var a-mutable = 3
var a-mutable-construktor = [list: "a"]


x = for map(elem from range(0, 3)):
  elem + 2
end

lam(x): x + 1 end

lam(x):
  lam(y):
    z = y + x
    a = z / 2
    a + z
  end
end

if (x):
  y = x + 1
  3
else:
  z = x + 1
  5
end

var all-for-one = "ONE FOR ALL FULL COWLING"
all-for-one := 1

fun add(n :: Number) -> Number:
  doc: "ABCDEFG"
  n
end

fun add(n :: Number) -> Number:
  doc: "Phil when Wilbur says that he gets sand from fish tanks: YOU NEED TO STOP Phil when Wilbur says that he gets it from crematoriums: bruhhh"
  x = n + 1
  x
end

vert = a(b(c(d(e(1)))))

fun cull(beings :: List<Being>) -> List<Being>:
  for filter(b from beings):
    p = b.posn
    (p.x > 0) and (p.x < WIDTH) and
    (p.y > 0) and (p.y < HEIGHT)
  end
end

a = ask: 
| x == 4 then: 43
| x < 1 then: 1
end

a = ask: 
| x == 4 then: 43
| otherwise: 1
end

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

ask:
| x == 3 then:
y = x + 1
y
| x == 1 then:
z = x + 2
z
| otherwise: x
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
