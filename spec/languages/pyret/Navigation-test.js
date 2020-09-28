import pyret from '../../../src/languages/pyret';
import 'codemirror/addon/search/searchcursor.js';
import {wait, teardown, activationSetup} from '../../support/test-utils';
import { testing } from 'codemirror-blocks';

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
    testing.teardown();
  });

  it('should activate load-spreadsheet and then url when down is pressed', async function () {
    console.log('@@@@@@@', this.root1);
    testing.mouseDown(this.root1);
    await wait(DELAY);
    testing.keyDown("ArrowDown");
    await wait(DELAY);
    expect(this.activeNode()).not.toBe(this.root1);
    expect(this.activeNode()).toBe(this.root1.func);
    expect(this.activeNode()).not.toBe(this.root1.args);

    testing.keyDown("Enter");
    await wait(DELAY);
    testing.keyDown("Enter");
    await wait(DELAY);

    testing.keyDown("ArrowDown");
    await wait(DELAY);
    expect(this.activeNode()).not.toBe(this.root1);
    expect(this.activeNode()).not.toBe(this.root1.func);
    expect(this.activeNode()).toBe(this.root1.args[0]);

    testing.keyDown("Enter");
    await wait(DELAY);
    testing.keyDown("Enter");
    await wait(DELAY);
  });
});

