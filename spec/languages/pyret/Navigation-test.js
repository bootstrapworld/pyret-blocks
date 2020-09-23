import CMB from '../../../src/languages/pyret';
import 'codemirror/addon/search/searchcursor.js';
//import { testing } from 'codemirror-blocks';
import { testing } from '../../support/test-utils.js';

const DELAY = 250;

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
  });
});

describe("load-table", function () {
  beforeEach(function () {
    setup.call(this);
    this.cmb.setValue(`load-table: nth, name, home-state
  source: presidents-sheet.sheet-by-name("presidents", true)
end`);
    let ast = this.cmb.getAst();
    this.literal1 = ast.rootNodes[0];
    this.columns = this.literal1.columns;
  });

  afterEach(function () { testing.TeardownAfterTest(); });

  it('should activate the first column name', async function () {
    testing.click(this.literal1);
    await testing.wait(DELAY);

    testing.keyDown("ArrowDown");
    await testing.wait(DELAY);
    expect(this.activeNode()).not.toBe(this.literal1);
    expect(this.activeNode()).toBe(this.columns[0]);

    testing.keyDown("Enter");
    await testing.wait(DELAY);
    testing.keyDown("Enter");
    await testing.wait(DELAY);
  });

  it('should activate the second column name', async function () {
    testing.click(this.columns[0]);
    await testing.wait(DELAY);

    testing.keyDown("ArrowDown");
    await testing.wait(DELAY);
    expect(this.activeNode()).not.toBe(this.literal1);
    expect(this.activeNode()).toBe(this.columns[1]);

    testing.keyDown("Enter");
    await testing.wait(DELAY);
    testing.keyDown("Enter");
    await testing.wait(DELAY);
  });

  it('should activate the third column name', async function () {
    testing.click(this.columns[1]);
    await testing.wait(DELAY);

    testing.keyDown("ArrowDown");
    await testing.wait(DELAY);
    expect(this.activeNode()).not.toBe(this.literal1);
    expect(this.activeNode()).toBe(this.columns[2]);

    testing.keyDown("Enter");
    await testing.wait(DELAY);
    testing.keyDown("Enter");
    await testing.wait(DELAY);
  });

  it('should activate the source when down is pressed', async function () {
    testing.click(this.columns[2]);
    await testing.wait(DELAY);

    testing.keyDown("ArrowDown");
    await testing.wait(DELAY);
    expect(this.activeNode()).not.toBe(this.literal1);
    expect(this.activeNode()).toBe(this.literal1.sources[0]);

    testing.keyDown("Enter");
    await testing.wait(DELAY);
    testing.keyDown("Enter");
    await testing.wait(DELAY);
  });
});

describe("lets", function () {
  let test_let = function (text) {
    describe(text, function () {
      beforeEach(function () {
        setup.call(this);
        this.cmb.setValue(text);
        let ast = this.cmb.getAst();
        this.literal1 = ast.rootNodes[0];
      });

      afterEach(function () { testing.TeardownAfterTest(); });

      it('should activate the binding and then the rhs when down is pressed', async function () {
        testing.click(this.literal1);
        await testing.wait(DELAY);
        testing.keyDown("ArrowDown");
        await testing.wait(DELAY);
        expect(this.activeNode()).not.toBe(this.literal1);
        expect(this.activeNode()).toBe(this.literal1.ident);
        expect(this.activeNode()).not.toBe(this.literal1.rhs);

        testing.keyDown("Enter");
        await testing.wait(DELAY);
        testing.keyDown("Enter");
        await testing.wait(DELAY);

        testing.keyDown("ArrowDown");
        await testing.wait(DELAY);
        expect(this.activeNode()).not.toBe(this.literal1);
        expect(this.activeNode()).not.toBe(this.literal1.ident);
        expect(this.activeNode()).toBe(this.literal1.rhs);

        testing.keyDown("Enter");
        await testing.wait(DELAY);
        testing.keyDown("Enter");
        await testing.wait(DELAY);
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
        this.literal1 = ast.rootNodes[0];
        this.op = this.literal1.op;
        this.left = this.literal1.left;
        this.right = this.literal1.right;
      });

      afterEach(function () { testing.TeardownAfterTest(); });

      it('should activate the operator, lhs, and rhs when down is pressed', async function () {
        testing.click(this.literal1);
        await testing.wait(DELAY);
        testing.keyDown("ArrowDown");
        await testing.wait(DELAY);
        expect(this.activeNode()).not.toBe(this.literal1);
        expect(this.activeNode()).toBe(this.op);
        expect(this.activeNode()).not.toBe(this.left);
        expect(this.activeNode()).not.toBe(this.right);

        testing.keyDown("Enter");
        await testing.wait(DELAY);
        testing.keyDown("Enter");
        await testing.wait(DELAY);

        testing.keyDown("ArrowDown");
        await testing.wait(DELAY);
        expect(this.activeNode()).not.toBe(this.literal1);
        expect(this.activeNode()).not.toBe(this.op);
        expect(this.activeNode()).toBe(this.left);
        expect(this.activeNode()).not.toBe(this.right);

        testing.keyDown("Enter");
        await testing.wait(DELAY);
        testing.keyDown("Enter");
        await testing.wait(DELAY);

        testing.keyDown("ArrowDown");
        await testing.wait(DELAY);
        expect(this.activeNode()).not.toBe(this.literal1);
        expect(this.activeNode()).not.toBe(this.op);
        expect(this.activeNode()).not.toBe(this.left);
        expect(this.activeNode()).toBe(this.right);

        testing.keyDown("Enter");
        await testing.wait(DELAY);
        testing.keyDown("Enter");
        await testing.wait(DELAY);
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
        this.literal1 = ast.rootNodes[0];
        this.fun_name = this.literal1.name;
        this.args = this.literal1.args;
        this.body = this.literal1.body;
      });

      afterEach(function () { testing.TeardownAfterTest(); });

      it("should activate function name, arguments, and body", async function () {
        testing.click(this.literal1);
        await testing.wait(DELAY);

        testing.keyDown("ArrowDown");
        await testing.wait(DELAY);
        expect(this.activeNode()).not.toBe(this.literal1);
        expect(this.activeNode()).toBe(this.fun_name);
        expect(this.activeNode()).not.toBe(this.body);

        testing.keyDown("Enter");
        await testing.wait(DELAY);
        testing.keyDown("Enter");
        await testing.wait(DELAY);

        for (let i = 0; i < this.args.length; i++) {
          testing.keyDown("ArrowDown");
          await testing.wait(DELAY);
          expect(this.activeNode()).not.toBe(this.literal1);
          expect(this.activeNode()).not.toBe(this.fun_name);
          expect(this.activeNode()).toBe(this.args[i]);
          expect(this.activeNode()).not.toBe(this.body);

          testing.keyDown("Enter");
          await testing.wait(DELAY);
          testing.keyDown("Enter");
          await testing.wait(DELAY);
        }

        testing.keyDown("ArrowDown");
        await testing.wait(DELAY);
        expect(this.activeNode()).not.toBe(this.literal1);
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
        this.literal1 = ast.rootNodes[0];
        this.fun_name = this.literal1.name;
        this.args = this.literal1.args;
        this.retAnn = this.literal1.retAnn;
        this.body = this.literal1.body;
      });

      afterEach(function () { testing.TeardownAfterTest(); });

      it("should activate function name, arguments, return annotation and body", async function () {
        testing.click(this.literal1);
        await testing.wait(DELAY);

        testing.keyDown("ArrowDown");
        await testing.wait(DELAY);
        expect(this.activeNode()).not.toBe(this.literal1);
        expect(this.activeNode()).toBe(this.fun_name);
        expect(this.activeNode()).not.toBe(this.body);

        testing.keyDown("Enter");
        await testing.wait(DELAY);
        testing.keyDown("Enter");
        await testing.wait(DELAY);

        for (let i = 0; i < this.args.length; i++) {
          testing.keyDown("ArrowDown");
          await testing.wait(DELAY);
          expect(this.activeNode()).not.toBe(this.literal1);
          expect(this.activeNode()).not.toBe(this.fun_name);
          expect(this.activeNode()).toBe(this.args[i]);
          expect(this.activeNode()).not.toBe(this.body);

          testing.keyDown("Enter");
          await testing.wait(DELAY);
          testing.keyDown("Enter");
          await testing.wait(DELAY);
        }

        testing.keyDown("ArrowDown");
        await testing.wait(DELAY);
        expect(this.activeNode()).not.toBe(this.literal1);
        expect(this.activeNode()).not.toBe(this.fun_name);
        expect(this.activeNode()).toBe(this.retAnn);
        expect(this.activeNode()).not.toBe(this.body);

        testing.keyDown("Enter");
        await testing.wait(DELAY);
        testing.keyDown("Enter");
        await testing.wait(DELAY);

        testing.keyDown("ArrowDown");
        await testing.wait(DELAY);
        expect(this.activeNode()).not.toBe(this.literal1);
        expect(this.activeNode()).not.toBe(this.fun_name);
        expect(this.activeNode()).not.toBe(this.retAnn);
        expect(this.activeNode()).toBe(this.body);
      });
    });
  };
  test("fun f(x) -> Number: x + 3 end");
  test("fun f(x, jake) -> String: x + jake end");
  test("fun g() -> Number: 2 * 4 end");
});

describe("lambdas", function () {
  let test = function (text) {
    describe(text, function () {
      beforeEach(function () {
        setup.call(this);
        this.cmb.setValue(text);
        let ast = this.cmb.getAst();
        this.literal1 = ast.rootNodes[0];
        this.args = this.literal1.args;
        this.body = this.literal1.body;
      });

      afterEach(function () { testing.TeardownAfterTest(); });

      it("should activate arguments, and body", async function () {
        testing.click(this.literal1);
        await testing.wait(DELAY);

        for (let i = 0; i < this.args.length; i++) {
          testing.keyDown("ArrowDown");
          await testing.wait(DELAY);
          expect(this.activeNode()).not.toBe(this.literal1);
          expect(this.activeNode()).toBe(this.args[i]);
          expect(this.activeNode()).not.toBe(this.body);

          testing.keyDown("Enter");
          await testing.wait(DELAY);
          testing.keyDown("Enter");
          await testing.wait(DELAY);
        }

        testing.keyDown("ArrowDown");
        await testing.wait(DELAY);
        expect(this.activeNode()).not.toBe(this.literal1);
        expect(this.activeNode()).toBe(this.body);
      });
    });
  };
  test("lam(x): x + 3 end");
  test("lam(x, jake): x + jake end");
  test("lam(): 2 * 4 end");
});

describe("lambdas with return annotations", function () {
  let test = function (text) {
    describe(text, function () {
      beforeEach(function () {
        setup.call(this);
        this.cmb.setValue(text);
        let ast = this.cmb.getAst();
        this.literal1 = ast.rootNodes[0];
        this.args = this.literal1.args;
        this.retAnn = this.literal1.retAnn;
        this.body = this.literal1.body;
      });

      afterEach(function () { testing.TeardownAfterTest(); });

      it("should activate arguments, return annotation and body", async function () {
        testing.click(this.literal1);
        await testing.wait(DELAY);

        for (let i = 0; i < this.args.length; i++) {
          testing.keyDown("ArrowDown");
          await testing.wait(DELAY);
          expect(this.activeNode()).not.toBe(this.literal1);
          expect(this.activeNode()).toBe(this.args[i]);
          expect(this.activeNode()).not.toBe(this.body);

          testing.keyDown("Enter");
          await testing.wait(DELAY);
          testing.keyDown("Enter");
          await testing.wait(DELAY);
        }

        testing.keyDown("ArrowDown");
        await testing.wait(DELAY);
        expect(this.activeNode()).not.toBe(this.literal1);
        expect(this.activeNode()).toBe(this.retAnn);
        expect(this.activeNode()).not.toBe(this.body);

        testing.keyDown("Enter");
        await testing.wait(DELAY);
        testing.keyDown("Enter");
        await testing.wait(DELAY);

        testing.keyDown("ArrowDown");
        await testing.wait(DELAY);
        expect(this.activeNode()).not.toBe(this.literal1);
        expect(this.activeNode()).not.toBe(this.retAnn);
        expect(this.activeNode()).toBe(this.body);
      });
    });
  };
  test("lam(x) -> Number: x + 3 end");
  test("lam(x, jake) -> String: x + jake end");
  test("lam() -> Number: 2 * 4 end");
});

describe("method and function applications", function () {
  let test = function (text) {
    describe(text, function () {
      beforeEach(function () {
        setup.call(this);
        this.cmb.setValue(text);
        let ast = this.cmb.getAst();
        this.literal1 = ast.rootNodes[0];
        this.func = this.literal1.func;
        this.args = this.literal1.args;
      });

      afterEach(function () { testing.TeardownAfterTest(); });

      it('should activate the function and arguments when down is pressed', async function () {
        testing.click(this.literal1);
        await testing.wait(DELAY);
        testing.keyDown("ArrowDown");
        await testing.wait(DELAY);
        expect(this.activeNode()).not.toBe(this.literal1);
        expect(this.activeNode()).toBe(this.func);
        expect(this.activeNode()).not.toBe(this.args);

        testing.keyDown("Enter");
        await testing.wait(DELAY);
        testing.keyDown("Enter");
        await testing.wait(DELAY);

        for (let i = 0; i < this.args.length; i++) {
          testing.keyDown("ArrowDown");
          await testing.wait(DELAY);
          expect(this.activeNode()).not.toBe(this.literal1);
          expect(this.activeNode()).not.toBe(this.func);
          expect(this.activeNode()).toBe(this.args[i]);

          testing.keyDown("Enter");
          await testing.wait(DELAY);
          testing.keyDown("Enter");
          await testing.wait(DELAY);
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
        this.literal1 = ast.rootNodes[0];
        this.op = this.literal1.op;
        this.left = this.literal1.lhs;
        this.right = this.literal1.rhs;
      });

      afterEach(function () { testing.TeardownAfterTest(); });

      it('should activate the operator, lhs, and rhs when down is pressed', async function () {
        testing.click(this.literal1);
        await testing.wait(DELAY);
        testing.keyDown("ArrowDown");
        await testing.wait(DELAY);
        expect(this.activeNode()).not.toBe(this.literal1);
        expect(this.activeNode()).toBe(this.op);
        expect(this.activeNode()).not.toBe(this.left);
        expect(this.activeNode()).not.toBe(this.right);

        testing.keyDown("Enter");
        await testing.wait(DELAY);
        testing.keyDown("Enter");
        await testing.wait(DELAY);

        testing.keyDown("ArrowDown");
        await testing.wait(DELAY);
        expect(this.activeNode()).not.toBe(this.literal1);
        expect(this.activeNode()).not.toBe(this.op);
        expect(this.activeNode()).toBe(this.left);
        expect(this.activeNode()).not.toBe(this.right);

        testing.keyDown("Enter");
        await testing.wait(DELAY);
        testing.keyDown("Enter");
        await testing.wait(DELAY);

        testing.keyDown("ArrowDown");
        await testing.wait(DELAY);
        expect(this.activeNode()).not.toBe(this.literal1);
        expect(this.activeNode()).not.toBe(this.op);
        expect(this.activeNode()).not.toBe(this.left);
        expect(this.activeNode()).toBe(this.right);

        testing.keyDown("Enter");
        await testing.wait(DELAY);
        testing.keyDown("Enter");
        await testing.wait(DELAY);
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
        this.literal1 = ast.rootNodes[0];
        this.body = this.literal1.body;
      });

      afterEach(function() { testing.TeardownAfterTest(); });

      it("should move to body", async function () {
        testing.click(this.literal1);
        await testing.wait(DELAY);
        testing.keyDown("ArrowDown");
        await testing.wait(DELAY);
        expect(this.activeNode()).not.toBe(this.literal1);
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
        this.literal1 = ast.rootNodes[0];
        this.fields = this.literal1.fields;
      });

      afterEach(function () { testing.TeardownAfterTest(); });

      it('should activate the arguments on each press', async function () {
        testing.click(this.literal1);
        await testing.wait(DELAY);
        expect(this.activeNode()).toBe(this.literal1);

        for (let i = 0; i < this.fields.length; i++) {
          testing.keyDown("ArrowDown");
          await testing.wait(DELAY);
          expect(this.activeNode()).not.toBe(this.literal1);
          expect(this.activeNode()).toBe(this.fields[i]);

          testing.keyDown("Enter");
          await testing.wait(DELAY);
          testing.keyDown("Enter");
          await testing.wait(DELAY);
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
      this.literal1 = ast.rootNodes[0];
      this.base = this.literal1.base;
      this.index = this.literal1.index;
    });

    afterEach(function () { testing.TeardownAfterTest(); });

    it('should activate the index', async function () {
      testing.click(this.literal1);
      await testing.wait(DELAY);
      testing.keyDown("ArrowDown");
      await testing.wait(DELAY);
      expect(this.activeNode()).toBe(this.base);

      testing.keyDown("Enter");
      await testing.wait(DELAY);
      testing.keyDown("Enter");
      await testing.wait(DELAY);

      testing.keyDown("ArrowDown");
      await testing.wait(DELAY);
      expect(this.activeNode()).toBe(this.index);

      testing.keyDown("Enter");
      await testing.wait(DELAY);
      testing.keyDown("Enter");
      await testing.wait(DELAY);
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
        this.literal1 = ast.rootNodes[0];
        this.construct = this.literal1.construktor;
        this.fields = this.literal1.values;
      });

      afterEach(function () { testing.TeardownAfterTest(); });

      it('should activate the arguments on each press', async function () {
        testing.click(this.literal1);
        await testing.wait(DELAY);
        expect(this.activeNode()).toBe(this.literal1);

        testing.keyDown("ArrowDown");
        await testing.wait(DELAY);
        expect(this.activeNode()).toBe(this.construct);

        testing.keyDown("Enter");
        await testing.wait(DELAY);
        testing.keyDown("Enter");
        await testing.wait(DELAY);

        for (let i = 0; i < this.fields.length; i++) {
          testing.keyDown("ArrowDown");
          await testing.wait(DELAY);
          expect(this.activeNode()).not.toBe(this.literal1);
          expect(this.activeNode()).not.toBe(this.construct);
          expect(this.activeNode()).toBe(this.fields[i]);

          testing.keyDown("Enter");
          await testing.wait(DELAY);
          testing.keyDown("Enter");
          await testing.wait(DELAY);
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
        this.literal1 = ast.rootNodes[0];
        this.base = this.literal1.base;
        this.index = this.literal1.index;
      });

      afterEach(function() { testing.TeardownAfterTest(); });

      it('should activate the index', async function () {
        testing.click(this.literal1);
        await testing.wait(DELAY);
        testing.keyDown("ArrowDown");
        await testing.wait(DELAY);
        expect(this.activeNode()).toBe(this.base);

        testing.keyDown("Enter");
        await testing.wait(DELAY);
        testing.keyDown("Enter");
        await testing.wait(DELAY);

        testing.keyDown("ArrowDown");
        await testing.wait(DELAY);
        expect(this.activeNode()).toBe(this.index);

        testing.keyDown("Enter");
        await testing.wait(DELAY);
        testing.keyDown("Enter");
        await testing.wait(DELAY);
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
    this.literal1 = ast.rootNodes[0];
    this.name = this.literal1.name;
    this.ann = this.literal1.ann;
  });

  afterEach(function () { testing.TeardownAfterTest(); });

  it('should activate the name and then the annotation when down is pressed', async function () {
    testing.click(this.literal1);
    await testing.wait(DELAY);
    testing.keyDown("ArrowDown");
    await testing.wait(DELAY);
    expect(this.activeNode()).not.toBe(this.literal1);
    expect(this.activeNode()).toBe(this.name);
    expect(this.activeNode()).not.toBe(this.ann);

    testing.keyDown("Enter");
    await testing.wait(DELAY);
    testing.keyDown("Enter");
    await testing.wait(DELAY);

    testing.keyDown("ArrowDown");
    await testing.wait(DELAY);
    expect(this.activeNode()).not.toBe(this.literal1);
    expect(this.activeNode()).not.toBe(this.literal1.name);
    expect(this.activeNode()).toBe(this.literal1.ann);

    testing.keyDown("Enter");
    await testing.wait(DELAY);
    testing.keyDown("Enter");
    await testing.wait(DELAY);
  });
});
/*
NOTE(Emmanuel): this appears to be dead code
const testing.click_expect = async function(to_testing.click, active_node, result, check_editable = false) {
  testing.click(to_testing.click);
  await testing.wait(DELAY);

  testing.keyDown("ArrowDown");
  expect(active_node()).toBe(result);

  if (check_editable) {
    testing.keyDown("Enter");
    await testing.wait(DELAY);
    testing.keyDown("Enter");
    await testing.wait(DELAY);
  }
};
*/
describe("if statements", function () {
  const testify = function (text) {
    describe(text, function () {
      beforeEach(function () {
        setup.call(this);
        this.cmb.setValue(text);
        let ast = this.cmb.getAst();
        this.literal1 = ast.rootNodes[0];
        this.branches = this.literal1.branches;
        this.else_branch = this.literal1.else_branch;
      });

      afterEach(function () { testing.TeardownAfterTest(); });

      it('should activate the first branch', async function() {
        testing.click(this.literal1);
        await testing.wait(DELAY);

        testing.keyDown("ArrowDown");
        await testing.wait(DELAY);
        expect(this.activeNode()).toBe(this.branches[0]);
      });

      it('should activate each branch', async function() {
        for(let i = 0; i < this.branches.length - 1; i ++) {
          testing.click(this.branches[i].body.stmts[0]);
          await testing.wait(DELAY);

          testing.keyDown("ArrowDown");
          await testing.wait(DELAY);
          expect(this.activeNode()).toBe(this.branches[i + 1]);
        }
      });

      it('should activate the else branch if it exists', async function() {
        if (this.else_branch != undefined) {
          let length = this.branches.length;
          testing.click(this.branches[length - 1].body.stmts[0]);
          await testing.wait(DELAY);

          testing.keyDown("ArrowDown");
          await testing.wait(DELAY);
          expect(this.activeNode()).toBe(this.else_branch);
        }
      });
    });
  };

  testify(`if x == 4:
  4
end`);
  testify(`if x == 3:
  2
else:
  3
end`);
  testify(`if x == 5:
  5
else if x >= 5:
  7
else if x < 3:
  2
end`);
  testify(`if x == 5:
  5
else if x >= 5:
  7
else if x < 3:
  2
else:
  0
end`);
});

describe('parentheses', function() {
  beforeEach(function() {
    setup.call(this);
    this.cmb.setValue('(i * i) - i');
    let ast = this.cmb.getAst();
    this.literal1 = ast.rootNodes[0];
    this.outside_op = this.literal1.op;
    this.parens = this.literal1.left;
    this.inner = this.parens.expr;
    this.inside_op = this.inner.op;
    this.inner_left = this.inner.left;
    this.inner_right = this.inner.right;
    this.i = this.literal1.right;
  });

  afterEach(function () { testing.TeardownAfterTest(); });

  it('should move to inside of parens', async function () {
    testing.click(this.literal1);
    await testing.wait(DELAY);
    
    testing.keyDown("ArrowDown");
    await testing.wait(DELAY);
    expect(this.activeNode()).toBe(this.outside_op);

    testing.keyDown("ArrowDown");
    await testing.wait(DELAY);
    expect(this.activeNode()).toBe(this.parens);

    testing.keyDown("ArrowDown");
    await testing.wait(DELAY);
    expect(this.activeNode()).toBe(this.inner);

    testing.keyDown("ArrowDown");
    await testing.wait(DELAY);
    expect(this.activeNode()).toBe(this.inside_op);

    testing.keyDown("ArrowDown");
    await testing.wait(DELAY);
    expect(this.activeNode()).toBe(this.inner_left);

    testing.keyDown("ArrowDown");
    await testing.wait(DELAY);
    expect(this.activeNode()).toBe(this.inner_right);

    testing.keyDown("ArrowDown");
    await testing.wait(DELAY);
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

    afterEach(function() { testing.TeardownAfterTest(); });

    it('should progress', async function() {
      let previous = this.start;
      testing.click(this.start);
      await testing.wait(DELAY);

      testing.keyDown("ArrowDown");
      await testing.wait(DELAY);
      let current = this.activeNode();

      while(current !== this.end) {
        expect(current).not.toBe(previous);
        if (current === previous) {
          break;
        }
        previous = current;
        testing.keyDown("ArrowDown");
        await testing.wait(DELAY);
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
