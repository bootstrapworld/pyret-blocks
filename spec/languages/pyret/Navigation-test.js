import {Pyret} from '../../../src/languages/pyret';
import 'codemirror/addon/search/searchcursor.js';

/*eslint no-unused-vars: "off"*/
import {
  mac, cmd_ctrl, DELAY, wait, removeEventListeners, teardown, activationSetup,
  click, mouseDown, mouseenter, mouseover, mouseleave, doubleClick, blur, 
  paste, cut, copy, dragstart, dragover, drop, dragenter, dragenterSeq, 
  dragend, dragleave, keyDown, keyPress, insertText
} from 'codemirror-blocks/lib/toolkit/test-utils';

// be sure to call with `apply` or `call`
let setup = function () { activationSetup.call(this, Pyret); };

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

describe("binops", function () {
  let test_binop = function (text) {
    describe(text, function () {
      beforeEach(function () {
        setup.call(this);
        this.cmb.setValue(text);
        let ast = this.cmb.getAst();
        this.root1 = ast.rootNodes[0];
        this.op = this.root1.op;
        this.left = this.root1.left;
        this.right = this.root1.right;
      });

      afterEach(function () { teardown(); });

      it('should activate the operator, lhs, and rhs when down is pressed', async function () {
        mouseDown(this.root1);
        await wait(DELAY);
        keyDown("ArrowDown");
        await wait(DELAY);
        expect(this.activeNode()).not.toBe(this.root1);
        expect(this.activeNode()).toBe(this.op);
        expect(this.activeNode()).not.toBe(this.left);
        expect(this.activeNode()).not.toBe(this.right);

        keyDown("Enter");
        await wait(DELAY);
        keyDown("Enter");
        await wait(DELAY);

        keyDown("ArrowDown");
        await wait(DELAY);
        expect(this.activeNode()).not.toBe(this.root1);
        expect(this.activeNode()).not.toBe(this.op);
        expect(this.activeNode()).toBe(this.left);
        expect(this.activeNode()).not.toBe(this.right);

        keyDown("Enter");
        await wait(DELAY);
        keyDown("Enter");
        await wait(DELAY);

        keyDown("ArrowDown");
        await wait(DELAY);
        expect(this.activeNode()).not.toBe(this.root1);
        expect(this.activeNode()).not.toBe(this.op);
        expect(this.activeNode()).not.toBe(this.left);
        expect(this.activeNode()).toBe(this.right);

        keyDown("Enter");
        await wait(DELAY);
        keyDown("Enter");
        await wait(DELAY);
      });
    });
  };
  test_binop("3 + 5");
  test_binop("3 - 5");
  test_binop("3 * 5");
  test_binop("3 / 5");
  test_binop(`"hello" + ", there"`);
});

describe("functions", function () {
  let test = function (text) {
    describe(text, function () {
      beforeEach(function () {
        setup.call(this);
        this.cmb.setValue(text);
        let ast = this.cmb.getAst();
        this.root1 = ast.rootNodes[0];
        this.fun_name = this.root1.name;
        this.args = this.root1.args;
        this.body = this.root1.body;
      });

      afterEach(function () { teardown(); });

      it("should activate function name, arguments, docsting, and body", async function () {
        mouseDown(this.root1);
        await wait(DELAY);
        // activate fn name
        keyDown("ArrowDown");
        await wait(DELAY);
        expect(this.activeNode()).not.toBe(this.root1);
        expect(this.activeNode()).toBe(this.fun_name);
        expect(this.activeNode()).not.toBe(this.body);
        // toggle editing on fn name
        keyDown("Enter");
        await wait(DELAY);
        keyDown("Enter");
        await wait(DELAY);
        // for each arg, activate and toggle editing
        for (let i = 0; i < this.args.length; i++) {
          keyDown("ArrowDown");
          await wait(DELAY);
          expect(this.activeNode()).not.toBe(this.root1);
          expect(this.activeNode()).not.toBe(this.fun_name);
          expect(this.activeNode()).toBe(this.args[i]);
          expect(this.activeNode()).not.toBe(this.body);
          // toggle editing on arg
          keyDown("Enter");
          await wait(DELAY);
          keyDown("Enter");
          await wait(DELAY);
        }
        // activate doc string
        keyDown("ArrowDown");
        await wait(DELAY);
        // activate body
        keyDown("ArrowDown");
        await wait(DELAY);
        expect(this.activeNode()).not.toBe(this.root1);
        expect(this.activeNode()).not.toBe(this.fun_name);
        expect(this.activeNode()).toBe(this.body);
      });
    });
  };
  test("fun f(x): x + 3 end");
  test("fun f(x, jake): x + jake end");
  test("fun g(): 2 * 4 end");
});

describe("functions with return annotations", function () {
  let test = function (text) {
    describe(text, function () {
      beforeEach(function () {
        setup.call(this);
        this.cmb.setValue(text);
        let ast = this.cmb.getAst();
        this.root1 = ast.rootNodes[0];
        this.fun_name = this.root1.name;
        this.args = this.root1.args;
        this.retAnn = this.root1.retAnn;
        this.doc = this.root1.doc;
        this.body = this.root1.body;
      });

      afterEach(function () { teardown(); });

      it("should activate function name, arguments, return annotation, docstring and body", async function () {
        mouseDown(this.root1);
        await wait(DELAY);
        // activate fn name
        keyDown("ArrowDown");
        await wait(DELAY);
        expect(this.activeNode()).not.toBe(this.root1);
        expect(this.activeNode()).toBe(this.fun_name);
        expect(this.activeNode()).not.toBe(this.body);
        // // activate docstring
        // keyDown("ArrowDown");
        // await wait(DELAY);
        // expect(this.activeNode()).not.toBe(this.root1);
        // expect(this.activeNode()).not.toBe(this.fun_name);
        // expect(this.activeNode()).toBe(this.doc);
        // expect(this.activeNode()).not.toBe(this.body);
        // toggle editing on fn name
        keyDown("Enter");
        await wait(DELAY);
        keyDown("Enter");
        await wait(DELAY);

        // in order, activate args and toggle editing on arg
        for (let i = 0; i < this.args.length; i++) {
          keyDown("ArrowDown");
          await wait(DELAY);
          expect(this.activeNode()).not.toBe(this.root1);
          expect(this.activeNode()).not.toBe(this.fun_name);
          expect(this.activeNode()).toBe(this.args[i]);
          expect(this.activeNode()).not.toBe(this.body);
          // toggle editing on arg
          keyDown("Enter");
          await wait(DELAY);
          keyDown("Enter");
          await wait(DELAY);
        }

        // activate return annotation
        keyDown("ArrowDown");
        await wait(DELAY);
        expect(this.activeNode()).not.toBe(this.root1);
        expect(this.activeNode()).not.toBe(this.fun_name);
        expect(this.activeNode()).toBe(this.retAnn);
        expect(this.activeNode()).not.toBe(this.body);
        // toggle editing on return annotation
        keyDown("Enter");
        await wait(DELAY);
        keyDown("Enter");
        await wait(DELAY);
        // activate doc string
        keyDown("ArrowDown");
        await wait(DELAY);
        expect(this.activeNode()).not.toBe(this.root1);
        expect(this.activeNode()).not.toBe(this.fun_name);
        expect(this.activeNode()).toBe(this.doc);
        expect(this.activeNode()).not.toBe(this.body);
        // activate body
        keyDown("ArrowDown");
        await wait(DELAY);
        expect(this.activeNode()).not.toBe(this.root1);
        expect(this.activeNode()).not.toBe(this.fun_name);
        expect(this.activeNode()).not.toBe(this.retAnn);
        expect(this.activeNode()).toBe(this.body);
      });
    });
  };
  test(`fun f(x) -> Number: doc: "A" x + 3 end`);
  test(`fun f(x, jake) -> String: doc: "A" x + jake end`);
  test(`fun g() -> Number: doc: "A" 2 * 4 end`);
});

describe("lambdas", function () {
  let test = function (text) {
    describe(text, function () {
      beforeEach(function () {
        setup.call(this);
        this.cmb.setValue(text);
        let ast = this.cmb.getAst();
        this.root1 = ast.rootNodes[0];
        this.args = this.root1.args;
        this.doc = this.root1.doc;
        this.body = this.root1.body;
      });

      afterEach(function () { teardown(); });

      it("should activate arguments, and body", async function () {
        mouseDown(this.root1);
        await wait(DELAY);
        // for each arg, activate and toggle editing
        for (let i = 0; i < this.args.length; i++) {
          keyDown("ArrowDown");
          await wait(DELAY);
          expect(this.activeNode()).not.toBe(this.root1);
          expect(this.activeNode()).toBe(this.args[i]);
          expect(this.activeNode()).not.toBe(this.body);

          keyDown("Enter");
          await wait(DELAY);
          keyDown("Enter");
          await wait(DELAY);
        }
        // activate doc string
        keyDown("ArrowDown");
        await wait(DELAY);
        expect(this.activeNode()).not.toBe(this.root1);
        expect(this.activeNode()).toBe(this.doc);
        expect(this.activeNode()).not.toBe(this.body);
        // activate body
        keyDown("ArrowDown");
        await wait(DELAY);
        expect(this.activeNode()).not.toBe(this.root1);
        expect(this.activeNode()).toBe(this.body);
      });
    });
  };
  test(`lam(x): doc: "" x + 3 end`);
  test(`lam(x, jake): doc: "" x + jake end`);
  test(`lam(): doc: "" 2 * 4 end`);
});

describe("lambdas with return annotations", function () {
  let test = function (text) {
    describe(text, function () {
      beforeEach(function () {
        setup.call(this);
        this.cmb.setValue(text);
        let ast = this.cmb.getAst();
        this.root1 = ast.rootNodes[0];
        this.args = this.root1.args;
        this.retAnn = this.root1.retAnn;
        this.body = this.root1.body;
      });

      afterEach(function () { teardown(); });

      it("should activate arguments, return annotation and body", async function () {
        // activate the root
        mouseDown(this.root1);
        await wait(DELAY);
        // for each arg, activate and toggle editing
        for (let i = 0; i < this.args.length; i++) {
          keyDown("ArrowDown");
          await wait(DELAY);
          expect(this.activeNode()).not.toBe(this.root1);
          expect(this.activeNode()).toBe(this.args[i]);
          expect(this.activeNode()).not.toBe(this.body);
          // toggle editing
          keyDown("Enter");
          await wait(DELAY);
          keyDown("Enter");
          await wait(DELAY);
        }
        // activate return annotation
        keyDown("ArrowDown");
        await wait(DELAY);
        expect(this.activeNode()).not.toBe(this.root1);
        expect(this.activeNode()).toBe(this.retAnn);
        expect(this.activeNode()).not.toBe(this.body);
        // toggle editing on return annotation
        keyDown("Enter");
        await wait(DELAY);
        keyDown("Enter");
        await wait(DELAY);
        // activate doc string
        keyDown("ArrowDown");
        await wait(DELAY);
        // activate body
        keyDown("ArrowDown");
        await wait(DELAY);
        expect(this.activeNode()).not.toBe(this.root1);
        expect(this.activeNode()).not.toBe(this.retAnn);
        expect(this.activeNode()).toBe(this.body);
      });
    });
  };
  test(`lam(x) -> Number: doc: "" x + 3 end`);
  test(`lam(x, jake) -> String: doc: "" x + jake end`);
  test(`lam() -> Number: doc: "" 2 * 4 end`);
});

describe("method and function applications", function () {
  let test = function (text) {
    describe(text, function () {
      beforeEach(function () {
        setup.call(this);
        this.cmb.setValue(text);
        let ast = this.cmb.getAst();
        this.root1 = ast.rootNodes[0];
        this.func = this.root1.func;
        this.args = this.root1.args;
      });

      afterEach(function () { teardown(); });

      it('should activate the function and arguments when down is pressed', async function () {
        mouseDown(this.root1);
        await wait(DELAY);
        keyDown("ArrowDown");
        await wait(DELAY);
        expect(this.activeNode()).not.toBe(this.root1);
        expect(this.activeNode()).toBe(this.func);
        expect(this.activeNode()).not.toBe(this.args);

        keyDown("Enter");
        await wait(DELAY);
        keyDown("Enter");
        await wait(DELAY);

        for (let i = 0; i < this.args.length; i++) {
          keyDown("ArrowDown");
          await wait(DELAY);
          expect(this.activeNode()).not.toBe(this.root1);
          expect(this.activeNode()).not.toBe(this.func);
          expect(this.activeNode()).toBe(this.args[i]);

          keyDown("Enter");
          await wait(DELAY);
          keyDown("Enter");
          await wait(DELAY);
        }
      });
    });
  };
  test('f(5)');
  test('f(5, 4)');
  test('f()');
  test(`x.len()`);
  test(`l.len()`);
  test(`x.len(3)`);
  test(`x.len(3, 4)`);
});

describe("checks and testing", function () {
  let test_binop = function (text) {
    describe(text, function () {
      beforeEach(function () {
        setup.call(this);
        this.cmb.setValue(text);
        let ast = this.cmb.getAst();
        this.root1 = ast.rootNodes[0];
        this.op = this.root1.op;
        this.left = this.root1.lhs;
        this.right = this.root1.rhs;
      });

      afterEach(function () { teardown(); });

      it('should activate the operator, lhs, and rhs when down is pressed', async function () {
        mouseDown(this.root1);
        await wait(DELAY);
        keyDown("ArrowDown");
        await wait(DELAY);
        expect(this.activeNode()).not.toBe(this.root1);
        expect(this.activeNode()).toBe(this.op);
        expect(this.activeNode()).not.toBe(this.left);
        expect(this.activeNode()).not.toBe(this.right);

        keyDown("Enter");
        await wait(DELAY);
        keyDown("Enter");
        await wait(DELAY);

        keyDown("ArrowDown");
        await wait(DELAY);
        expect(this.activeNode()).not.toBe(this.root1);
        expect(this.activeNode()).not.toBe(this.op);
        expect(this.activeNode()).toBe(this.left);
        expect(this.activeNode()).not.toBe(this.right);

        keyDown("Enter");
        await wait(DELAY);
        keyDown("Enter");
        await wait(DELAY);

        keyDown("ArrowDown");
        await wait(DELAY);
        expect(this.activeNode()).not.toBe(this.root1);
        expect(this.activeNode()).not.toBe(this.op);
        expect(this.activeNode()).not.toBe(this.left);
        expect(this.activeNode()).toBe(this.right);

        keyDown("Enter");
        await wait(DELAY);
        keyDown("Enter");
        await wait(DELAY);
      });
    });
  };
  test_binop("7 is 7");

  let test = function (text) {
    describe(text, function () {
      beforeEach(function () {
        setup.call(this);
        this.cmb.setValue(text);
        let ast = this.cmb.getAst();
        this.root1 = ast.rootNodes[0];
        this.body = this.root1.body;
      });

      afterEach(function() { teardown(); });

      it("should move to body", async function () {
        mouseDown(this.root1);
        await wait(DELAY);
        keyDown("ArrowDown");
        await wait(DELAY);
        expect(this.activeNode()).not.toBe(this.root1);
        expect(this.activeNode()).toBe(this.body);
      });
    });
  };

  test(`check: 3 + 5 is 8 end`);
  test(`check "arithmetic": 3 + 5 is 8 end`);
  test(`check: 3 + 4 end`);
});

describe("tuples", function () {
  let test = function (text) {
    describe(text, function () {
      beforeEach(function () {
        setup.call(this);
        this.cmb.setValue(text);
        let ast = this.cmb.getAst();
        this.root1 = ast.rootNodes[0];
        this.fields = this.root1.fields;
      });

      afterEach(function () { teardown(); });

      it('should activate the arguments on each press', async function () {
        mouseDown(this.root1);
        await wait(DELAY);
        expect(this.activeNode()).toBe(this.root1);

        for (let i = 0; i < this.fields.length; i++) {
          keyDown("ArrowDown");
          await wait(DELAY);
          expect(this.activeNode()).not.toBe(this.root1);
          expect(this.activeNode()).toBe(this.fields[i]);

          keyDown("Enter");
          await wait(DELAY);
          keyDown("Enter");
          await wait(DELAY);
        }
      });
    });
  };
  test('{1;2}');
  test('{1; 2}');
  test('{1; 2; 3}');
  test('{1}');

  describe("tuple-get", function () {
    beforeEach(function () {
      setup.call(this);
      this.cmb.setValue("tupple.{0}");
      let ast = this.cmb.getAst();
      this.root1 = ast.rootNodes[0];
      this.base = this.root1.base;
      this.index = this.root1.index;
    });

    afterEach(function () { teardown(); });

    it('should activate the index', async function () {
      mouseDown(this.root1);
      await wait(DELAY);
      keyDown("ArrowDown");
      await wait(DELAY);
      expect(this.activeNode()).toBe(this.base);

      keyDown("Enter");
      await wait(DELAY);
      keyDown("Enter");
      await wait(DELAY);

      keyDown("ArrowDown");
      await wait(DELAY);
      expect(this.activeNode()).toBe(this.index);

      keyDown("Enter");
      await wait(DELAY);
      keyDown("Enter");
      await wait(DELAY);
    });
  });
});

describe("lists", function () {
  let test = function (text) {
    describe(text, function () {
      beforeEach(function () {
        setup.call(this);
        this.cmb.setValue(text);
        let ast = this.cmb.getAst();
        this.root1 = ast.rootNodes[0];
        this.construct = this.root1.construktor;
        this.fields = this.root1.values;
      });

      afterEach(function () { teardown(); });

      it('should activate the arguments on each press', async function () {
        mouseDown(this.root1);
        await wait(DELAY);
        expect(this.activeNode()).toBe(this.root1);

        keyDown("ArrowDown");
        await wait(DELAY);
        expect(this.activeNode()).toBe(this.construct);

        keyDown("Enter");
        await wait(DELAY);
        keyDown("Enter");
        await wait(DELAY);

        for (let i = 0; i < this.fields.length; i++) {
          keyDown("ArrowDown");
          await wait(DELAY);
          expect(this.activeNode()).not.toBe(this.root1);
          expect(this.activeNode()).not.toBe(this.construct);
          expect(this.activeNode()).toBe(this.fields[i]);

          keyDown("Enter");
          await wait(DELAY);
          keyDown("Enter");
          await wait(DELAY);
        }
      });
    });
  };
  test('[list: 1, 2, 3]');
  test('[list: 1]');
  test('[list: ]');
  test('[list:]');

  let test_get = function (text) {
    describe(text, function () {
      beforeEach(function () {
        setup.call(this);

        this.cmb.setValue(text);
        let ast = this.cmb.getAst();
        this.root1 = ast.rootNodes[0];
        this.base = this.root1.base;
        this.index = this.root1.index;
      });

      afterEach(function() { teardown(); });

      it('should activate the index', async function () {
        mouseDown(this.root1);
        await wait(DELAY);
        keyDown("ArrowDown");
        await wait(DELAY);
        expect(this.activeNode()).toBe(this.base);

        keyDown("Enter");
        await wait(DELAY);
        keyDown("Enter");
        await wait(DELAY);

        keyDown("ArrowDown");
        await wait(DELAY);
        expect(this.activeNode()).toBe(this.index);

        keyDown("Enter");
        await wait(DELAY);
        keyDown("Enter");
        await wait(DELAY);
      });
    });
  };
  test_get('row["field"]');
  test_get('row[""]');
  test_get('row["three word column"]');
  test_get('row[0]');
});

describe("contracts", function () {
  beforeEach(function () {
    setup.call(this);
    this.cmb.setValue("is-fixed :: (animal :: Row) -> Boolean");
    let ast = this.cmb.getAst();
    this.root1 = ast.rootNodes[0];
    this.name = this.root1.name;
    this.ann = this.root1.ann;
  });

  afterEach(function () { teardown(); });

  it('should activate the name and then the annotation when down is pressed', async function () {
    mouseDown(this.root1);
    await wait(DELAY);
    keyDown("ArrowDown");
    await wait(DELAY);
    expect(this.activeNode()).not.toBe(this.root1);
    expect(this.activeNode()).toBe(this.name);
    expect(this.activeNode()).not.toBe(this.ann);

    keyDown("Enter");
    await wait(DELAY);
    keyDown("Enter");
    await wait(DELAY);

    keyDown("ArrowDown");
    await wait(DELAY);
    expect(this.activeNode()).not.toBe(this.root1);
    expect(this.activeNode()).not.toBe(this.root1.name);
    expect(this.activeNode()).toBe(this.root1.ann);

    keyDown("Enter");
    await wait(DELAY);
    keyDown("Enter");
    await wait(DELAY);
  });
});

describe("if statements", function () {
  const testify = function (text) {
    describe(text, function () {
      beforeEach(function () {
        setup.call(this);
        this.cmb.setValue(text);
        let ast = this.cmb.getAst();
        this.root1 = ast.rootNodes[0];
        this.branches = this.root1.branches;
        this.else_branch = this.root1.else_branch;
      });

      afterEach(function () { teardown(); });

      it('should activate the first branch', async function() {
        mouseDown(this.root1);
        await wait(DELAY);

        keyDown("ArrowDown");
        await wait(DELAY);
        expect(this.activeNode()).toBe(this.branches[0]);
      });

        /* DEBUG
      it('should activate each branch', async function() {
        for(let i = 0; i < this.branches.length - 1; i ++) {
          mouseDown(this.branches[i].body.stmts[0]);
          await wait(DELAY);

          keyDown("ArrowDown");
          await wait(DELAY);
          expect(this.activeNode()).toBe(this.branches[i + 1]);
        }
      });
      */

        /* DEBUG
      it('should activate the else branch if it exists', async function() {
        if (this.else_branch != undefined) {
          let length = this.branches.length;
          mouseDown(this.branches[length - 1].body.stmts[0]);
          await wait(DELAY);

          keyDown("ArrowDown");
          await wait(DELAY);
          expect(this.activeNode()).toBe(this.else_branch);
        }
      });
      */
    });
  };

  testify(`if x == 4: 4 end`);
  testify(`if x == 3: 2 else: 3 end`);
  testify(`if x == 5: 5 else if x >= 5: 7 else if x < 3: 2 end`);
  testify(`if x == 5: 5 else if x >= 5: 7 else if x < 3: 2 else: 0 end`);
});

describe('parentheses', function() {
  beforeEach(function() {
    setup.call(this);
    this.cmb.setValue('(i * i) - i');
    let ast = this.cmb.getAst();
    this.root1 = ast.rootNodes[0];
    this.outside_op = this.root1.op;
    this.parens = this.root1.left;
    this.inner = this.parens.expr;
    this.inside_op = this.inner.op;
    this.inner_left = this.inner.left;
    this.inner_right = this.inner.right;
    this.i = this.root1.right;
  });

  afterEach(function () { teardown(); });

  it('should move to inside of parens', async function () {
    mouseDown(this.root1);
    await wait(DELAY);

    keyDown("ArrowDown");
    await wait(DELAY);
    expect(this.activeNode()).toBe(this.outside_op);

    keyDown("ArrowDown");
    await wait(DELAY);
    expect(this.activeNode()).toBe(this.parens);

    keyDown("ArrowDown");
    await wait(DELAY);
    expect(this.activeNode()).toBe(this.inner);

    keyDown("ArrowDown");
    await wait(DELAY);
    expect(this.activeNode()).toBe(this.inside_op);

    keyDown("ArrowDown");
    await wait(DELAY);
    expect(this.activeNode()).toBe(this.inner_left);

    keyDown("ArrowDown");
    await wait(DELAY);
    expect(this.activeNode()).toBe(this.inner_right);

    keyDown("ArrowDown");
    await wait(DELAY);
    expect(this.activeNode()).toBe(this.i);
  });
});

function general_test(text, label = text) {
  describe(label, function() {
    beforeEach(function() {
      setup.call(this);
      let final_text = `${text}\nx = 3`;
      this.cmb.setValue(final_text);
      let ast = this.cmb.getAst();
      let length = ast.rootNodes.length;
      this.start = ast.rootNodes[0];
      this.end = ast.rootNodes[length - 1];
    });

    afterEach(function() { teardown(); });

    it('should progress', async function() {
      let previous = this.start;
      mouseDown(this.start);
      await wait(DELAY);

      keyDown("ArrowDown");
      await wait(DELAY);
      let current = this.activeNode();

      while(current !== this.end) {
        expect(current).not.toBe(previous);
        if (current === previous) {
          break;
        }
        previous = current;
        keyDown("ArrowDown");
        await wait(DELAY);
        current = this.activeNode();
      }
    });
  });
}

general_test(`load-table: nth, name, home-state
  source: presidents-sheet.sheet-by-name("presidents", true)
end`);

general_test(`(3 - 4)`);
general_test(`3 - 4`);
