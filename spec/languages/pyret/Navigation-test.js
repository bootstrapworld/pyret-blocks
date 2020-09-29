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

describe("load-table", function () {
  beforeEach(async function () {
    setup.call(this);
    this.cmb.setValue(`load-table: nth, name, home-state
  source: presidents-sheet.sheet-by-name("presidents", true)
end`);
    await wait(DELAY);
    let ast = this.cmb.getAst();
    this.root1 = ast.rootNodes[0];
    this.columns = this.root1.columns;
    mouseDown(this.root1);
  });

  afterEach(function () { teardown(); });

  it('should activate the first column name', async function () {
    mouseDown(this.root1); await wait(DELAY);

    //click(this.root1);

    keyDown("ArrowDown"); await wait(DELAY);

    expect(this.activeNode()).not.toBe(this.root1);
    expect(this.activeNode()).toBe(this.columns[0]);

    keyDown("Enter"); await wait(DELAY);
    keyDown("Enter"); await wait(DELAY);
  });

  it('should activate the second column name', async function () {
    mouseDown(this.columns[0]); await wait(DELAY);

    // TODO: The old tests simply want to click, but that doesn't work yet.
    //
    //click(this.columns[0]);

    keyDown("ArrowDown"); await wait(DELAY);

    expect(this.activeNode()).not.toBe(this.root1);
    expect(this.activeNode()).not.toBe(this.columns[0]);
    expect(this.activeNode()).toBe(this.columns[1]);

    keyDown("Enter"); await wait(DELAY);
    keyDown("Enter"); await wait(DELAY);
  });

  it('should activate the third column name', async function () {
    mouseDown(this.columns[1]); await wait(DELAY);
    //click(this.columns[1]);

    keyDown("ArrowDown"); await wait(DELAY);

    expect(this.activeNode()).not.toBe(this.root1);
    expect(this.activeNode()).not.toBe(this.columns[0]);
    expect(this.activeNode()).not.toBe(this.columns[1]);
    expect(this.activeNode()).toBe(this.columns[2]);

    keyDown("Enter"); await wait(DELAY);
    keyDown("Enter"); await wait(DELAY);
  });

  it('should activate the source when down is pressed', async function () {
    mouseDown(this.columns[2]); await wait(DELAY);
    //click(this.columns[2]);

    keyDown("ArrowDown"); await wait(DELAY);

    expect(this.activeNode()).not.toBe(this.root1);
    expect(this.activeNode()).toBe(this.root1.sources[0]);

    keyDown("Enter"); await wait(DELAY);
    keyDown("Enter"); await wait(DELAY);
  });

});

describe("lets", function () {
  let test_let = function (text) {
    describe(text, function () {
      beforeEach(function () {
        setup.call(this);
        this.cmb.setValue(text);
        let ast = this.cmb.getAst();
        this.root1 = ast.rootNodes[0];
      });

      afterEach(function () { teardown(); });

      it('should activate the binding and then the rhs when down is pressed', async function () {
        mouseDown(this.root1);
        await wait(DELAY);
        keyDown("ArrowDown");
        await wait(DELAY);
        expect(this.activeNode()).not.toBe(this.root1);
        expect(this.activeNode()).toBe(this.root1.ident);
        expect(this.activeNode()).not.toBe(this.root1.rhs);

        keyDown("Enter");
        await wait(DELAY);
        keyDown("Enter");
        await wait(DELAY);

        keyDown("ArrowDown");
        await wait(DELAY);
        expect(this.activeNode()).not.toBe(this.root1);
        expect(this.activeNode()).not.toBe(this.root1.ident);
        expect(this.activeNode()).toBe(this.root1.rhs);

        keyDown("Enter");
        await wait(DELAY);
        keyDown("Enter");
        await wait(DELAY);
      });
    });
  };
  test_let("x = 3");
  test_let("x = true");
  test_let(`data-type = "string"`);
});
