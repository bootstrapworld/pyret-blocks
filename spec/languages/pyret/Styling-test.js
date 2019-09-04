import CMB from '../../../src/languages/pyret';
import 'codemirror/addon/search/searchcursor.js';
import { TeardownAfterTest } from 'codemirror-blocks';
import { wait } from '../../support/test-utils.js';
import {
  _keyPress,
  _insertText,
} from '../../support/simulate';

const DELAY = 250;

let setup = function () {
  const fixture = `
      <div id="root">
        <div id="cmb-editor" class="editor-container"/>
      </div>
    `;
  document.body.insertAdjacentHTML('afterbegin', fixture);
  const container = document.getElementById('cmb-editor');
  this.cmb = CMB(container, { collapseAll: false, value: "" });
  this.cmb.setBlockMode(true);

  this.activeNode = () => this.cmb.getFocusedNode();
  this.activeAriaId = () =>
    this.cmb.getScrollerElement().getAttribute('aria-activedescendent');
  this.selectedNodes = () => this.cmb.getSelectedNodes();
};

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

      afterEach(function () { TeardownAfterTest(); });

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