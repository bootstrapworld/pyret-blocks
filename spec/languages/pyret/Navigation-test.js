import CMB from '../../../src/languages/pyret';
import 'codemirror/addon/search/searchcursor.js';
//import { testing } from 'codemirror-blocks';
import { testing } from '../../support/test-utils.js';

//const DELAY = 250;
const DELAY = 1000;

// be sure to call with `apply` or `call`
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
describe("load-spreadsheet", function () {
  beforeEach(function () {
    setup.call(this);

    this.cmb.setValue('load-spreadsheet("14er5Mh443Lb5SIFxXZHdAnLCuQZaA8O6qtgGlibQuEg")');
    (async function() {
      await testing.wait(5000);
    })();
    let ast = this.cmb.getAst();

    this.literal1 = ast.rootNodes[0];
  });

  afterEach(function () {
    testing.TeardownAfterTest();
  });

  it('should activate load-spreadsheet and then url when down is pressed', async function () {
    testing.click(this.literal1);
    await testing.wait(DELAY);
    testing.keyDown("ArrowDown");
    await testing.wait(DELAY);
    expect(this.activeNode()).not.toBe(this.literal1);
    /*
    expect(this.activeNode()).toBe(this.literal1.func);
    expect(this.activeNode()).not.toBe(this.literal1.args);

    testing.keyDown("Enter");
    await testing.wait(DELAY);
    testing.keyDown("Enter");
    await testing.wait(DELAY);

    testing.keyDown("ArrowDown");
    await testing.wait(DELAY);
    expect(this.activeNode()).not.toBe(this.literal1);
    expect(this.activeNode()).not.toBe(this.literal1.func);
    expect(this.activeNode()).toBe(this.literal1.args[0]);

    testing.keyDown("Enter");
    await testing.wait(DELAY);
    testing.keyDown("Enter");
    await testing.wait(DELAY);
    */
  });
});

