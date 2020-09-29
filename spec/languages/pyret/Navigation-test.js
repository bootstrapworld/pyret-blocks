import pyret from '../../../src/languages/pyret';
import 'codemirror/addon/search/searchcursor.js';
import {wait, teardown, activationSetup} from '../../support/test-utils';
import {
  click,
  mouseDown,
  blur,
  keyDown,
  insertText,
} from '../../support/simulate';
const DELAY = 250;

// be sure to call with `apply` or `call`
let setup = function () { activationSetup.call(this, pyret); };

/** //////////////////////////////////////////////////////////
 * Specific navigation tests for programs that use BSDS constructs below
 */
describe("load-spreadsheet", function () {
  beforeEach(async function () {
    setup.call(this);
    this.cmb.setValue('load-spreadsheet("14er5Mh443Lb5SIFxXZHdAnLCuQZaA8O6qtgGlibQuEg")');
    await wait(DELAY);
    let ast = this.cmb.getAst();
    this.root1 = ast.rootNodes[0];
  });

  afterEach(function () {
    teardown();
  });

  it('should activate load-spreadsheet and then url when down is pressed', async function () {
    console.log('@@@@@@@', this.root1);
    mouseDown(this.root1);
    await wait(DELAY);
    keyDown("ArrowDown");
    await wait(DELAY);
    expect(this.activeNode()).not.toBe(this.root1);
    expect(this.activeNode()).toBe(this.root1.func);
    expect(this.activeNode()).not.toBe(this.root1.args);

    keyDown("Enter");
    await wait(DELAY);
    keyDown("Enter");
    await wait(DELAY);

    keyDown("ArrowDown");
    await wait(DELAY);
    expect(this.activeNode()).not.toBe(this.root1);
    expect(this.activeNode()).not.toBe(this.root1.func);
    expect(this.activeNode()).toBe(this.root1.args[0]);

    keyDown("Enter");
    await wait(DELAY);
    keyDown("Enter");
    await wait(DELAY);
  });
});

