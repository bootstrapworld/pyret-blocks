import CMB, {store} from '../../../src/languages/pyret';
import 'codemirror/addon/search/searchcursor.js';
import { wait, cleanupAfterTest } from '../../support/test-utils';
import {
  click,
  keyDown,
  _keyPress,
  _insertText,
} from '../../support/simulate';

const DELAY = 250;

describe('The CodeMirrorBlocks Class', function () {
  beforeEach(function () {
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
  });

  afterEach(function () {
    cleanupAfterTest('root', store);
  });

  /** //////////////////////////////////////////////////////////
   * Specific navigation tests for programs that use BSDS constructs below
   */
  describe("load-spreadsheet", function () {
    beforeEach(function () {
      this.cmb.setValue('load-spreadsheet("14er5Mh443Lb5SIFxXZHdAnLCuQZaA8O6qtgGlibQuEg")');
      let ast = this.cmb.getAst();
      this.literal1 = ast.rootNodes[0];
    });

    it('should activate load-spreadsheet and then url when down is pressed', async function () {
      console.log("START");
      click(this.literal1);
      await wait(DELAY);
      keyDown("ArrowDown");
      await wait(DELAY);
      expect(this.activeNode()).not.toBe(this.literal1);
      expect(this.activeNode()).toBe(this.literal1.func);
      expect(this.activeNode()).not.toBe(this.literal1.args);

      keyDown("Enter");
      await wait(DELAY);
      keyDown("Enter");
      await wait(DELAY);

      keyDown("ArrowDown");
      await wait(DELAY);
      expect(this.activeNode()).not.toBe(this.literal1);
      expect(this.activeNode()).not.toBe(this.literal1.func);
      expect(this.activeNode()).toBe(this.literal1.args[0]);

      keyDown("Enter");
      await wait(DELAY);
      keyDown("Enter");
      await wait(DELAY);
    });
  });

});
