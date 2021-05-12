import pyret from '../../../src/languages/pyret';
import 'codemirror/addon/search/searchcursor.js';
/*eslint no-unused-vars: "off"*/
import {
  mac, cmd_ctrl, DELAY, wait, removeEventListeners, teardown, activationSetup,
  click, mouseDown, mouseenter, mouseover, mouseleave, doubleClick, blur, 
  paste, cut, copy, dragstart, dragover, drop, dragenter, dragenterSeq, 
  dragend, dragleave, keyDown, keyPress, insertText
} from '../../support/test-utils';

// be sure to call with `apply` or `call`
let setup = function () { activationSetup.call(this, pyret); };

/** //////////////////////////////////////////////////////////
 * Specific navigation tests for programs that use BSDS constructs below
 */

describe("functions", function () {
  let test = function (text) {
    describe(text, function () {
      beforeEach(function () {
        setup.call(this);
        this.cmb.setValue(text);
        let ast = this.cmb.getAst();
        this.literal1 = ast.rootNodes[0];
        this.fun_name = this.literal1.name;
        this.args = this.literal1.args;
        this.body = this.literal1.body;
      });

      afterEach(function () { teardown(); });

      it("should have a white background for fun name", function () {
        // console.log("FUNNAME", this.fun_name);
        // expect(this.fun_name.style.background).toEqual('white');
      });
    });
  };
  test("fun f(x): x + 3 end");
  test("fun f(x, jake): x + jake end");
  test("fun g(): 2 * 4 end");
});
