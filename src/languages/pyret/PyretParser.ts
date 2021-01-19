import * as TOK from "./pyret-lang/pyret-tokenizer.js";
import * as P from "./pyret-lang/pyret-parser.js";
import * as TR from "./pyret-lang/translate-parse-tree.js";
import PRIMITIVES_CONFIG from './primitives-config';
import {
  AST,
  ASTNode,
  Nodes,
} from 'codemirror-blocks';
const {
  Blank,
} = Nodes
import {Binop,
  Assign,
  ArrowArgnames,
  Bind,
  Block,
  Bracket,
  Check,
  CheckTest,
  Construct,
  Contract,
  DataField,
  For,
  ForBind,
  Func,
  FunctionApp,
  IfBranch,
  IfPipe,
  IfPipeBranch,
  Include,
  Lambda,
  Let,
  LoadTable,
  TableSource,
  Sanitize,
	Table, 
	ATableRow, 
  Paren,
  SpecialImport,
  ProvideAll,
  Reactor,
  Tuple,
  TupleGet,
  Var,
  When,
  IfExpression,
  IfElseExpression,
  IfPipeElseExpression,
  AnnotationApp
} from "./ast";

export interface Position {
  line: number;
  ch: number;
}

class Loc {
  from: Position;
  to: Position;
  constructor(from: Position, to: Position) {
    this.from = from;
    this.to = to;
  }
}

function startOf(srcloc: { startRow: number; startCol: number; }) {
  return {
    "line": srcloc.startRow - 1,
    "ch":   srcloc.startCol
  };
}

function endOf(srcloc: { endRow: number; endCol: number; }) {
  return {
    "line": srcloc.endRow - 1,
    "ch":   srcloc.endCol
  };
}

// ----------------------------------------------------------------------
// getBackgroundColor():: Bind, Expr -> VOID
// Function used to assign the color type of each block in Block Pyret

function getReturnType(name){
	let results;
	PRIMITIVES_CONFIG.primitives.forEach(element => {
		if (element.name === name){
			results = element;
		}
	});
	let availableTypes = ["number", "string", "boolean"];
	let returnType = (results) ? results.returnType.toLowerCase() : "untyped";
	return (availableTypes.includes(returnType)) ? returnType : "untyped";
}

function getLibraryFunctionArgTypes(name){
	let results;
	PRIMITIVES_CONFIG.primitives.forEach(element => {
		if (element.name === name){
			results = element;
		}
	})

	let availableTypes = ["number", "string", "boolean"];
	if (!results){
		return null;
	}

	let argumentTypes = [];
	results.argumentTypes.forEach((value) => {
		let formatted = value.toLowerCase();
		let aType = availableTypes.includes(formatted) ? formatted : "untyped";
		argumentTypes.push(aType);
	});

	return argumentTypes;
}

function getBackgroundColor(rhs: Expr) {
	let fixedSizeDataTypes = ["number", "string", "boolean"];
	// console.log(`%c ${JSON.stringify(PRIMITIVES_CONFIG.primitives, null, 2)}`, "background-color: red");
	// console.log(`%c ${JSON.stringify(rhs, null, 2)}`, "background-color: red");
	// console.log(`%c ${JSON.stringify(rhs, null, 2)}`, "background-color: blue");
	// console.log(`%c ${rhs.type}`, "background-color: red");

	if (fixedSizeDataTypes.includes(rhs.dataType)){
		return rhs.dataType;
	}
	else if (rhs.type === "constructor"){
		return "constructor";
	}
	else if (rhs.type === "binop"){
		return getReturnType(rhs.op.value);
	}
	else if (rhs.type === "funApp"){
		return (rhs.func.value.value) ? getReturnType(rhs.func.value.value) : "untyped";
  }
  else if (rhs.type === "lambdaExp"){
    return "lambdaExp";
  }
	else{
		return "untyped";
	}
}

function getConstructorBackgroundColor(values: any[]) {
  let bgcClassName = "untyped";
  
  if (values === undefined || values.length == 0) {
    return bgcClassName;
  }

	let typingIsConsistent = true;
	values.forEach(element => {
		if (element.dataType !== values[0].dataType){
			typingIsConsistent = false;
		}
	})

	bgcClassName = (typingIsConsistent) ? getBackgroundColor(values[0]) : "";
	return bgcClassName;
}
// ----------------------------------------------------------------------

const checkOP = 'check-op';

const ariaLabel = "aria-label";

const opLookup = {
  "+":   "+",
  "-":   "-",
  "*":   "*",
  "/":   "/",
  "$":   "$",
  "^":   "^",
  "<":   "<",
  "<=":  "<=",
  ">":   ">",
  ">=":  ">=",
  "==":  "==",
  "=~":  "=~",
  "<=>": "<=>",
  "<>":  "<>",
  "and": "and",
  "or":  "or",
  // TODO: check ops
  "is": (loc, _node) => new Nodes.Literal(loc.from, loc.to, 'is', checkOP),
  "is=~": (loc, _node) => new Nodes.Literal(loc.from, loc.to, 'is=~', checkOP),
  "is-not=~": (loc, _node) => new Nodes.Literal(loc.from, loc.to, 'is-not=~', checkOP),
  "is-not==": (loc, _node) => new Nodes.Literal(loc.from, loc.to, 'is-not==', checkOP),
  "raises": (loc, _node) => new Nodes.Literal(loc.from, loc.to, 'raises', 'raises'),
  "satisfies": (loc, _node) => new Nodes.Literal(loc.from, loc.to, 'satisfies', 'satisfies'),
  "is-not<=>": (loc, _node) => new Nodes.Literal(loc.from, loc.to, 'is-not<=>', checkOP),
  "is-not": (loc, _node) => new Nodes.Literal(loc.from, loc.to, 'is-not', checkOP),
  "is<=>": (loc, _node) => new Nodes.Literal(loc.from, loc.to, 'is<=>', checkOP),
};

type AField = any;
type Ann = Nodes.Literal;
type CasesBind = any;
type CasesBindType = any;
type CasesBranch = any;
type CheckOp = any;
type ColumnBinds = any;
type ColumnSort = any;
type ColumnSortOrder = any;
type DefinedType = any;
type DefinedValue = any;
type Expr = ASTNode;
type FieldName = any;
type Hint = any;
type ImportType = Number;
type LetBind = any;
type LetrecBind = any;
type LoadTableSpec = any;
type Member = any;
type Name = String;
type ProvidedAlias = any;
type ProvidedDatatype = any;
type ProvidedValue = any;
type TableExtendField = any;
type TableRow = any;
type TypeLetBind = any;
type Variant = any;
type VariantMember = any;
type VariantMemberType = any;

const DEBUG = false;

const nodeTypes = {
  // data Name
  's-underscore': function(l: Loc) {
    return new Nodes.Literal(
      l.from, l.to, '_', 's-underscore', {[ariaLabel]: `underscore identifier`}
    );
  },
  "s-name": function (pos: Loc, str: string) {
    return new Nodes.Literal(
      pos.from,
      pos.to,
      str,
      's-name',
      {'aria-label': `${str}, a name`});
  },
  // 's-global': function(s: string) {},
  // 's-type-global': function(s: string) {},
  // 's-atom': function(base: string, serial: number) {},

  // data Program
  "s-program": function(_pos: Loc, _prov: any, _provTy: any, imports: ASTNode[], body: Block) {
    let rootNodes = imports.concat(body.stmts);
    return new AST.AST(rootNodes);
  },

  // data Import
  "s-include": function(pos: Loc, mod: ImportType) {
    if (DEBUG) console.log(arguments);
    return new Include(pos.from, pos.to, mod, {'aria-label': `include statement`});
  },
  // "s-import": function(pos: Loc, file: ImportType, name: Name) {},
  // "s-import-types": function(pos: Loc, file: ImportType, name: Name, types: Name) {},
  // "s-import-fields": function(pos: Loc, fields: Name[], file: ImportType) {},
  // "s-import-complete": function(pos: Loc, values: Name[], types: Name[], import_type: ImportType, vals_name: Name, types_name: Name) {},

  // data ProvidedValue
  // "p-value": function(pos: Loc, v: Name, ann: Ann) {},

  // data Provided Alias
  // "p-alias": function(pos: Loc, in_name: Name, out_name: Name, mod: ImportType | null) {},

  // data ProvidedDatatype
  // "p-data": function(pos: Loc, d: Name, mod: ImportType | null) {},

  // data Provide
	// "s-provide": function(pos: Loc, block: ASTNode) { },
	// "s-provide-complete": function(pos: Loc, values: ProvidedValue[], ailases: ProvidedAlias[], data_definition: ProvidedDatatype[]) {},
	"s-provide-all": function(pos: Loc) {
		console.log('found a provide all!')
		// console.log("%c !!!!!!!!!!!!!!", "background-color: red");
		let options = {};
		options['aria-label'] = `provides all`;
		return new ProvideAll(pos.from, pos.to, options);
	},
	"s-provide-none": function(_pos: Loc) { 
		// console.log("%c s provide none called", 'background-color: red');
		return new Nodes.Literal(_pos.from, _pos.to, "provide all", 'operator', {"aria-label": `provide all`});
	},

  // data ProvideTypes
  // "s-provide-types": function(pos: Loc, ann: AField[]) {},
  // "s-provide-types-all": function(l: Loc) {},
  "s-provide-types-none": function(_l: Loc) { 
		// console.log("%c s provide types none called", 'background-color: red');
		return new Nodes.Literal(_l.from, _l.to, "provide all", 'operator', {"aria-label": `provide all`});
	},

  // data ImportType
  "s-const-import": function(l: Loc, mod: string) {
    if(DEBUG) console.log(arguments);
    return new Nodes.Literal(l.from, l.to, mod, "const-import");
  },
  "s-special-import": function(l: Loc, kind: string, args: string[]) {
    if(DEBUG) console.log(arguments);
    let kind_literal = new Nodes.Literal(l.from, l.to, kind, "special-import", {"aria-label": `${kind} import`});
    let args_literals = args.map(e => new Nodes.Literal(l.from, l.to, '"' + e + '"', 'string', {"aria-label": `import piece`}));

    // then seems likely to be of name, url format... anytime when it's not?
    if (args.length == 2) {
      args_literals[0].options["aria-label"] = "resource name";
      args_literals[1].options["aria-label"] = "resource url";
    }
    return new SpecialImport(l.from, l.to, kind_literal, args_literals,
      {'aria-label': `special import`});
  },

  // data Hint
  // "h-use-loc": function(l: Loc) {},

  // data LetBind
  // "s-let-bind": function(l: Loc, b: Bind, value: Expr) {},
	// "s-var-bind": function(l: Loc, b: Bind, value: Expr) {},

  // data LetrecBind
  // "s-letrec-bind": function(l: Loc, b: Bind, value: Expr) {},

  // data TypeLetBind
  // "s-type-bind": function(l: Loc, name: Name, params: Name[], ann: Ann) {},
  // "s-newtype-bind": function(l: Loc, name: Name, namet: Name) {},

  // data DefinedValue
  // "s-defined-value": function(name: string, value: Expr) {},

  // data DefinedType
  // "s-defined-type": function(name: string, typ: Ann) {},

  // data Expr
  // "s-module": function(l: Loc, answer: XPathExpression, defined_values: DefinedValue[], defined_types: DefinedType[], provided_values: Expr, provided_types: AField[], checks: Expr) {},
  "s-template": function(l: Loc) {
    return new Blank(l.from, l.to, null, "blank", {[ariaLabel]: "a placeholder"});
  },
  // "s-type-let-expr": function(l: Loc, binds: TypeLetBind[], body: Expr, block: boolean) {},
  // "s-let-expr": function(l: LoadTable, binds: LetBind[], body: Expr, block: boolean) {},
  // "s-letrec": function(l: Loc, binds: LetrecBind[], body: Expr, block: boolean) {},
  // "s-hint-exp": function(l: Loc, hints: Hint[], exp: Expr) {},
  // "s-instantiate": function(l: Loc, expr: Expr, params: Ann[]) {},
  "s-block": function (pos: Loc, stmts: Expr[]) {
    return new Block(
      pos.from,
      pos.to,
      stmts,
      'block');
  },
  // "s-user-block": function(l: Loc, body: Expr) {},
  // doc: string
  "s-fun": function (pos: Loc, name: string, _params: Name[], args: Bind[], ann: Ann, doc: string, body: Expr, _check_loc: Loc | null, _check: Expr | null, block: boolean) {
    // TODO: ignoring params, check, blocky
    let fun_from = {line: pos.from.line, ch: pos.from.ch + 4};
    let fun_to = {line: pos.from.line, ch: fun_from.ch + name.length};
    if(DEBUG) console.log(arguments);

    let docText = doc ? doc : "";
    console.log("Function ----------------- DOC: ")
    console.log(docText);
    console.log(pos);
    console.log(_params);
    console.log(body);
    console.log(body.from);

    console.log(ann);
    console.log(args);

    let func_head_start = pos.from.line;
    let func_body_start = body.from.line;
    let func_body_ch = body.from.ch;

   // func_body_start - func_head_start) == 0
    let doc_from = {line: pos.from.line, ch: func_body_ch - 2 - doc.length};
    let doc_to = {line: pos.from.line, ch: func_body_ch - 2};

    if ((func_body_start - func_head_start) == 2) {
      doc_from = {line: pos.from.line + 1, ch: pos.from.ch + 2 + 6};
      doc_to = {line: pos.from.line + 1, ch: doc_from.ch + doc.length};
    }

    let docBlock = new Nodes.Literal(doc_from, doc_to, docText, 'operator', {'aria-label': `${docText}, the doc-string of ${name}`});
    console.log(docBlock);
		// new Nodes.Literal(fun_from, fun_to, name, 'function'),
		// new Nodes.Literal(doc_from, doc_to, doc, 'string'),
		// new Nodes.Literal(doc_from, doc_to, "\"" + doc + "\"", 'string', {'aria-label': `${doc}, a docstring`}),
		// new Nodes.Literal(doc_from, doc_to, doc, 'string', {'aria-label': `${doc}, a docstring`}),
    return new Func(
      pos.from,
      pos.to,
			new Nodes.Literal(fun_from, fun_to, name, 'function'),
      args.map(a => idToLiteral(a)),
      ann,
      docBlock,
      body,
      block,
      {'aria-label': `${name}, a function definition with ${args.length} ${inputs_to_fun(args)}`});
  },
  // "s-type": function(l: Loc, name: Name, params: Name[], ann: Ann) {},
  // "s-newtype": function(l: Loc, name: Name, namet: Name) {},
  "s-var": function(l: Loc, name: Bind, value: Expr) {
    let options = {};
    options['aria-label'] = `${name}, a variable definition`;
		let bgcClassName = getBackgroundColor(value);
    return new Var(l.from, l.to, idToLiteral(name), value, bgcClassName, options);
  },
  // "s-rec": function(l: Loc, name: Bind, value: Expr) {},
  "s-let": function (pos: Loc, id: Bind, rhs: Expr, _keyword_val: boolean) {
    if(DEBUG) console.log(arguments);
    console.log(" ------------- Let -----------------");
    console.log(rhs);
    let options = {};
    options['aria-label'] = `${id}, a value definition`;
		let bgcClassName = getBackgroundColor(rhs);

    return new Let(
      pos.from,
      pos.to,
      idToLiteral(id),
      rhs,
			bgcClassName,
      options
    );
  },
  // "s-ref": function(l: Loc, ann: Ann | null) {},
  "s-contract": function(l: Loc, name: Name, _params: Name[], ann: Ann) {
    if(DEBUG) console.log(arguments);
    // TODO: don't know what params do, using binding for now
    return new Contract(l.from, l.to, name, ann, {'aria-label': `contract for ${name}: ${ann}`});
  },
  "s-when": function(l: Loc, test: Expr, block: Expr, blocky: boolean) {
    if (DEBUG) console.log(arguments);
    return new When(l.from, l.to, test, block, blocky, {[ariaLabel]: `when statement`});
  },
  // "s-assign": function(l: Loc, id: Name, value: Expr) {},
  "s-assign": function(l: Loc, id: Name, value: Expr) {
    if(DEBUG) console.log(arguments);
      let options = {};
      options['aria-label'] = `${id}, a value definition`;
      return new Assign(
        l.from,
        l.to,
        id,
        value,
        options
      );
  },
  's-if-pipe': function(l: Loc, branches: IfPipeBranch[], blocky: boolean) {
    if (DEBUG) console.log(arguments);
    branches.forEach((element, index) => {
      (element as any).options["aria-label"] = `branch ${index + 1}`;
    });
    return new IfPipe(l.from, l.to, branches, blocky, {'aria-label': 'ask expression'});
  },
	"s-if-pipe-else": function(l: Loc, branches: IfPipeBranch[], _otherwise: Expr, blocky: boolean) {
    if (DEBUG) console.log(arguments);
		branches.forEach((element, index) => {
			(element as any).options["aria-label"] = `branch ${index + 1}`;
    });

    return new IfPipeElseExpression(l.from, l.to, branches, _otherwise, blocky, {'aria-label': 'ask-otherwise expression'});
	},
  "s-if": function(l: Loc, branches: IfBranch[], blocky: boolean) {
    return new IfExpression(l.from, l.to, branches, blocky, {[ariaLabel]: `if expression with ${branches.length} branches}`});
  },
  "s-if-else": function(l: Loc, branches: IfBranch[], _else: Expr, blocky: boolean) {
    return new IfElseExpression(l.from, l.to, branches, _else, blocky, {[ariaLabel]: `if expression with ${branches.length} branches and an else branch`});
  },
  // "s-cases": function(l: Loc, typ: Ann, val: Expr, branches: CasesBranch[], blocky: boolean) {},
  // "s-cases-else": function(l: Loc, typ: Ann, val: Expr, branches: CasesBranch[], _else: Expr, blocky: boolean) {},
  "s-op": function (pos: Loc, opPos: Loc, op: string, left: Expr, right: Expr) {
    if(DEBUG) console.log(arguments);
    let name = op;
    let bgcClassName = getReturnType(op);

    console.log("Binop --------------------")
    console.log(left);
    console.log(right);
    
    /* Special Exception + 
    Recommend Adding a List of Binops that can return more than One DataType */
    if (op === "+") {
      try{

        let leftType = left.dataType;
        let rightType = right.dataType;

        if (leftType=="number" && rightType=="number") {
          bgcClassName="number";
        }

        if (leftType=="string" && rightType=="string") {
          console.log("String!")
          bgcClassName="string";
        }

        if (left.construktor.value.value=="list" && right.construktor.value.value=="list"){
          bgcClassName="constructor";
        }
      }catch(err) {
        // bgcClassName="number";
      }        
    }
    // --------------------------------------

    return new Binop(
      pos.from,
      pos.to,
      new Nodes.Literal(opPos.from, opPos.to, op, 'operator'),
      left,
      right,
			bgcClassName,
      {'aria-label': `${name} expression`});
  },
  "s-check-test": function(pos: Loc, check_op: CheckOp, refinement: Expr | null, lhs: Expr, rhs: Expr | null) {
    if(DEBUG) console.log(arguments);
    return new CheckTest(
      pos.from, pos.to, check_op, refinement, lhs, rhs, {'aria-label': `${check_op} ${lhs} ${rhs}`}
    );
  },
  // "s-check-expr": function(l: Loc, expr: Expr, ann: Ann) {},
  's-paren': function(pos: Loc, expr: ASTNode) {
    // should maybe have this have aria-label of child?
    // or maybe should be fine since won't render s-paren
    return new Paren(pos.from, pos.to, expr, {'aria-label': 'parenthetical expression'});
  },
  // note this name string is "" if anonymous
  "s-lam": function(l: Loc, name: string, _params: Name[], args: Bind[], ann: Ann, doc: string, body: Expr, _check_loc: Loc | null, _check: Expr | null, blocky: boolean) {
    if(DEBUG) console.log(arguments);
    let fun_from = { line: l.from.line, ch: l.from.ch + 4 };
    let fun_to = {line: l.from.line, ch: fun_from.ch + name.length};
    let real_name = (name == "")? null : new Nodes.Literal(fun_from, fun_to, name, 'lambda');

    let docText = doc ? doc : "";

    let func_head_start = l.from.line;
    let func_body_start = body.from.line;
    let func_body_ch = body.from.ch;

   // func_body_start - func_head_start) == 0
    let doc_from = {line: l.from.line, ch: func_body_ch - 2 - doc.length};
    let doc_to = {line: l.from.line, ch: func_body_ch - 2};

    if ((func_body_start - func_head_start) == 2) {
      doc_from = {line: l.from.line + 1, ch: l.from.ch + 2 + 6};
      doc_to = {line: l.from.line + 1, ch: doc_from.ch + doc.length};
    }

    console.log("----------- Lambda ------------");
    console.log(name);
    console.log(docText);
    console.log(doc_from);
    console.log(doc_to);
    console.log(func_head_start);
    console.log(func_body_start);

    let docBlock = new Nodes.Literal(doc_from, doc_to, doc, 'lambda', {'aria-label': `${docText}, the doc-string of this lambda ${name}`});

    console.log(docBlock);

    // For some reason docBlock does not have a proper id, but name does, since Lambda does not have names, we decided to pass the 
    // docstring through name and put it in where docstring is
    return new Lambda(
      l.from,
      l.to,
      new Nodes.Literal(doc_from, doc_to, doc, 'operator'),// new Nodes.Literal(fun_from, fun_to, name, 'lambda'),
      args.map(a => idToLiteral(a)),
      ann,
      docBlock,// docBlock,
      body,
      blocky,
      {'aria-label': `${name}, a lambda function definition with ${args.length} ${inputs_to_fun(args)}`});



    // return new Lambda(
    //   l.from,
    //   l.to,
    //   real_name,
    //   args.map(a => idToLiteral(a)),
    //   ann,
    //   doc,
    //   body,
    //   blocky,
    //   {'aria-label': `${name}, a function with ${args} with ${body}`});
  },
	// "s-method": function(l: Loc, name: string, params: Name[], args: Bind[], ann: Ann, doc: string, body: Expr, check: Expr | null, blocky: boolean) {},
  // "s-extend": function(l: Loc, supe: Expr, fields: Member[]) {},
  // "s-update": function(l: Loc, supe: Expr, fields: Member[]) {},
  "s-tuple": function(pos: Loc, fields: Expr[]) {
    if(DEBUG) console.log(arguments);
    return new Tuple(
      pos.from, pos.to, fields, {'aria-label': `tuple with ${fields}`}, 
    );
  },
  "s-tuple-get": function(pos: Loc, lhs: ASTNode, index: number, index_pos: Loc) {
    if(DEBUG) console.log(arguments);
    return new TupleGet(
      pos.from, pos.to, lhs, new Nodes.Literal(index_pos.from, index_pos.to, index, "number"), {'aria-label': `${index} element of ${lhs} tuple`}
    )
  },
  // "s-obj": function(l: Loc, fields: Member[]) {},
  // "s-array": function(l: Loc, values: Expr[]) {},
  "s-construct": function (pos: Loc, modifier: any, constructor: any, values: any[]) {
    if(DEBUG) console.log(arguments);
    console.log("-------------------- Constructor ---------------");
    console.log(constructor);
    console.log(values);
		let bgcClassName = getConstructorBackgroundColor(values);
    return new Construct(
      pos.from, pos.to, modifier, constructor, values, bgcClassName, { 'aria-label': `${constructor} with values ${values}` }
    );
  },
  "s-app": function(pos: Loc, fun: Expr, args: Expr[]) {
    if(DEBUG) console.log(arguments);
		// console.log(`%c ${JSON.stringify(fun, null, 2)}`, "background-color: green");
		// console.log(`%c ${JSON.stringify(args, null, 2)}`, "background-color: green");
		// console.log(`%c ${JSON.stringify(fun.value.value, null, 2)}`, "background-color: green");
		let bgcClassName = getReturnType(fun.value.value);
		let argsBgcClassNames = getLibraryFunctionArgTypes(fun.value.value);

    return new FunctionApp(
      pos.from, pos.to, fun, args, bgcClassName, argsBgcClassNames, {'aria-label': `${fun} applied to ${args}`}, 
    );
  },
  // "s-prim-app": function(pos: Loc, fun: string, args: Expr[]) {},
  // "s-prim-val": function(pos: Loc, name: string) {},
  "s-id": function(pos: Loc, str: Name) {
    return new Nodes.Literal(
      pos.from,
      pos.to,
      str,
      's-id',
      {'aria-label': `${str}, an identifier`});
  },
  "s-id-var": function(pos: Loc, str: Name) {
    // TODO make sure this is correct
    return new Nodes.Literal(
      pos.from,
      pos.to,
      "!" + str,
      's-id-var',
      {'aria-label': `${str}, an identifier`});
  },
  // "s-id-letrec": function(pos: Loc, id: Name, safe: boolean) {},
  // "s-undefined": function(pos: Loc) {},
  // "s-srcloc": function(pos: Loc, loc: Loc) {},
  "s-num": function(pos: Loc, x: Number) {
    return new Nodes.Literal(
      pos.from,
      pos.to,
      x,
      'number',
      {'aria-label': `${x}, a number`});
  },
  // "s-frac": function(l: Loc, num: number, den: number) {},
  "s-bool": function(pos: Loc, value: boolean) {
    let ret = new Nodes.Literal(
      pos.from,
      pos.to,
      value,
      'boolean',
      {'aria-label': `${value}, a boolean`});
    return ret;
  },
  "s-str": function(pos: Loc, value: string) {
    if(DEBUG) console.log(arguments);
    return new Nodes.Literal(
      pos.from,
      pos.to,
      "\"" + value + "\"",
      'string',
      {'aria-label': `${value}, a string`}
    );
  },
  's-dot': function(pos: Loc, base: any, method: string) {
    if(DEBUG) console.log(arguments);
    return new Nodes.Literal(
      pos.from, pos.to, base.toString() + "." + method, 'method', {'aria-label': `${method} on data ${base}`}
    )
  },
  's-get-bang': function (pos: Loc, obj: Expr, field: string) {
    // TODO make sure correct
    if(DEBUG) console.log(arguments);
    return new Nodes.Literal(
      pos.from, pos.to, obj.toString() + "." + field, 'method', {'aria-label': `${field} on data ${obj}`}
    )
  },
  's-bracket': function(pos: Loc, base: any, index: any) {
    if(DEBUG) console.log(arguments);
    return new Bracket(
      pos.from, pos.to, base, index, {'aria-label': `${index} of ${base}, a lookup expression`}
    )
  },
  // "s-data": function(l: Loc, name: string, params: Name[], mixins: Expr[], variants: Variant[], shared_members: Member[], check: Expr | null) {},
  // "s-data-expr": function(l: Loc, name: string, namet: Name, params: Name[], mixins: Expr[], variants: Variant[], shared_members: Member[], check: Expr | null) {},
  's-for': function(l: Loc, iterator: Expr, bindings: ForBind[], ann: Ann, body: Expr, blocky: boolean) {
    if (DEBUG || true) console.log(arguments);
    console.log("--------------- For -------------");
    console.log(body);
    return new For(l.from, l.to, iterator, bindings, ann, body, blocky, {[ariaLabel]: `a for expression`});
  },
  "s-check": function(pos: Loc, name: string | undefined, body: any, keyword_check: boolean) {
    return new Check(
      pos.from, pos.to, name, body, keyword_check, { 'aria-label': ((name != undefined)? `${name} `: "") + `checking ${body}`}
    );
  },
  's-reactor': function(l: Loc, fields: Member[]) {
    if (DEBUG) console.log(arguments);
    return new Reactor(l.from, l.to, fields, {'aria-label': `reactor`});
  },
  // 's-table-extend': function(l: LoadTable, column_binds: ColumnBinds, extensions: TableExtendField[]) {},
  // 's-table-update': function(l: Loc, column_binds: ColumnBinds, updates: Member[]) {},
  // 's-table-select': function(l: Loc, columns: Name[], table: Expr) {},
  // 's-table-order': function(l: Loc, table: Expr, ordering: ColumnSort) {},
  // 's-table-filter': function(l: Loc, column_binds: ColumnBinds, predicate: Expr) {},
  // 's-table-extract': function(l: Loc, column: Name, table: Expr) {},
	's-table': function(l: Loc, headers: FieldName[], rows: TableRow[]) {
		if(DEBUG) console.log(arguments);
    console.log("------------ Table Parser -------------");
		// console.log("%c !!!!!!!!!!!!!!!!", "background-color: green");
		// console.log(JSON.stringify(headers, null, 2));
		// console.log(headers);
    console.log(rows);
    // console.log("-------------------------");
    console.log(headers);
		return new Table(l.from, l.to, headers, rows, {'aria-label': `table`});
	},
  's-load-table': function (pos: Loc, rows: FieldName[], sources: LoadTableSpec[]) {
    if(DEBUG) console.log(arguments);
    console.log("------------ Load Table -------------");
    console.log(pos);
    console.log(rows);
    console.log(sources);

    return new LoadTable(
      pos.from, pos.to, rows, sources, {'aria-label': `load table with ${rows.length} columns`}
    );
  },

  // data TableRow
	's-table-row': function(l: Loc, elems: Expr[]) {
    // if(DEBUG) console.log(arguments);
    let nodes = [];
    console.log("------------- TABLE ROW --------------------");
    console.log(elems);
		// console.log("%c !!!!!!!!!!!!!!!!", "background-color: red");
    // console.log(JSON.stringify(elems, null, 2));
    

		// elems.map((aCell, index) => {
		// 	let aNode;
		// 	if (aCell.construktor){
		// 		let bgcClassName = getConstructorBackgroundColor(aCell.values);
		// 		aNode = new Construct(aCell.from, aCell.to, aCell.modifier, aCell.construktor, aCell.values, bgcClassName, 
		// 			{ 'aria-label': `${aCell.construktor} with values ${aCell.values}` });
		// 	}
		// 	else{
		// 		aNode = new Nodes.Literal(aCell.from, aCell.to, aCell.value, aCell.dataType, {'aria-label': `${aCell.value}, a ${aCell.dataType}`});
		// 	}
		// 	nodes.push(aNode);
		// });

		return new ATableRow(l.from, l.to, elems, {'aria-label': `table-row`});
	},
  
  // data ConstructModifer
  's-construct-normal': function() { return null; },
  // 's-construct-lazy': function() { return null; },

  // data Bind
  "s-bind": function (pos: Loc, _shadows: boolean, id: Name, ann: Ann) {
    // TODO: ignoring shadowing for now.
    return new Bind(
      pos.from,
      pos.to,
      id,
      ann);
  },
  // 's-tuple-bind': function(l: LoadTable, fields: Bind[], as_name: Bind | null) {},

  // data Member
  's-data-field': function(l: Loc, name: string, value: Expr) {
    if(DEBUG) console.log(arguments);
    return new DataField(l.from, l.to, name, value,
      {'aria-label': `${name}`});
  },
  // 's-mutable-field': function(l: Loc, name: string, ann: Ann, value: Expr) {},
  // 's-method-field': function(l: Loc, name: string, params: Name[], args: Bind[], ann: Ann, doc: string, body: Expr, check: Expr | null, blocky: boolean) {},

  // data FieldName
  // examples of this _other have been ABlank...
  's-field-name': function(pos: Loc, name: string, _other: any) {
    if(DEBUG) console.log(arguments);
    console.log("Field Name -----------------");
    console.log(pos);
    console.log(name);
    console.log(_other);
    // console.log(_other.ann);
    // console.log(_other.args);

		let options = {};
		options['aria-label'] = `${name}, a column`;

		if (_other){
			// console.log("%c-----------------", "background-color: purple");
      // console.log(JSON.stringify(_other.value.value, null, 2));
      if (_other.value){
        options['datatype'] = _other.value.value;
        name = `${name} :: ${_other.value.value}`;
      }else{
        console.log("No value field");
        let header = _other.ann.value.value;
        let temp = "";
        let body = _other.args.map((branch, index) => {
            return(branch.value.value);
        });

        let type = header + "<" + body.join() + ">";

        console.log(type);
        options['datatype'] = type;
        name = `${name} :: ${type}`;
      }

		}
    return new Nodes.Literal(pos.from, pos.to, name, 'field-name', options);
  },
  
  // data ForBind
  's-for-bind': function(l: Loc, bind: Bind, value: Expr) {
    if (DEBUG || true) console.log(arguments);
    return new ForBind(l.from, l.to, idToLiteral(bind), value, {aria: `binding for for expression`});
  },

  // data ColumnBinds
  // 's-column-binds': function(l: Loc, binds: Bind[], table: Expr) {},

  /**
   * Not sure what to do with this for now...
   * data ColumnSortOrder:
  | ASCENDING with:
    method tosource(self):
      PP.str("ascending")
    end
  | DESCENDING with:
    method tosource(self):
      PP.str("descending")
    end
sharing:
  method visit(self, visitor):
    self._match(visitor, lam(): raise("No visitor field for " + torepr(self)) end)
  end
end
   */
  
  // data ColumnSort
  // 's-column-sort': function(l: LoadTable, column: Name, direction: ColumnSortOrder) {},

  // data TableExtendField
  // 's-table-extend-field': function(l: Loc, name: string, value: Expr, ann: Ann) {},
  // 's-table-extend-reducer': function(l: Loc, name: string, reducer: Expr, col: Name, ann: Ann) {},

  // data LoadTableSpec
  's-sanitize': function(l: Loc, name: Name, sanitizer: Expr) {
    console.log("-------- Sanitize -----------");
    console.log(l);
    console.log(name);
    console.log(sanitizer);
    
    let output = "sanitize " + name + " using " + sanitizer.value;

    // return new Nodes.Literal(l.from, l.to, output, 'field-name');
    
    return new Sanitize(
      l.from,
      l.to,
      name,
      sanitizer,
      {'aria-label': `sanitizing ${name} with ${sanitizer}`});

    // return new Sanitize(
    //   l.from,
    //   l.to,
    //   new Nodes.Literal(l.from, l.to, name, 'field-name'),
    //   new Nodes.Literal(l.from, l.to, sanitizer.value, 'field-name'),
    //   {'aria-label': `sanitizing ${name} with ${sanitizer}`});
  },
  's-table-src': function (pos: Loc, source: any) {
    if(DEBUG) console.log(arguments);
    console.log("-------- Table Source  -----------");
    console.log(pos);
    console.log(source);


    // return source;
    return new TableSource(
      pos.from,
      pos.to,
      source,
      {'aria-label': `source getting table from ${source}`});
  },

  // not doing data VariantMemberType

  // data VariantMember
  // 's-variant-member': function(l: Loc, member_type: VariantMemberType, bind: Bind) {},

  // data Variant
  // 's-variant': function(l: Loc, constr_loc: Loc, name: string, members: VariantMember[], with_members: Member[]) {},
  // 's-singleton-variant': function(l: Loc, name: string, with_members: Member[]) {},

  //data IfBranch
  's-if-branch': function(l: Loc, test: Expr, body: Expr) {
    if (DEBUG) console.log(arguments);
    return new IfBranch(l.from, l.to, test, body, {[ariaLabel]: `if branch`});
  },

  //data IfPipeBranch
  's-if-pipe-branch': function(pos: Loc, test: ASTNode, body: ASTNode) {
    return new IfPipeBranch(pos.from, pos.to, test, body, {'aria-label': `ask branch`});
  },
  
  // data CasesBind
  // 's-cases-bind': function(l: Loc, field_type: CasesBindType, bind: Bind) {},

  // data CasesBranch
  // 's-cases-branch': function(l: Loc, pattern_loc: Loc, name: string, args: CasesBind[], body: Expr) {},
  // 's-singleton-cases-branch': function(l: LoadTable, pattern_loc: Loc, name: string, body: Expr) {},

  // data CheckOp --> not doing for now?

  // data Ann
  "a-blank": function() {
    return null;
  },
  // 'a-any': function(l: Loc) {},
  "a-name": function(pos: Loc, id: Name) {
    return new Nodes.Literal(
      pos.from,
      pos.to,
      id,
      'a-name',
      // make sure that this matches the pedagogy used in classroom:
      // "variable", "identifier", "name", ...; other languages
      {'aria-label': `${id}, an identifier`});
  },
  // 'a-type-var': function(l: Loc, id: Name) {},
  // 'a-arrow': function(l: Loc, args: Ann[], ret: Ann, use_parens: boolean) {},
  'a-arrow-argnames': function(l: Loc, args: AField[], ret: Ann, uses_parens: boolean) {
    if(DEBUG) console.log(arguments);
    return new ArrowArgnames(l.from, l.to,
      args,
      ret,
      uses_parens,
      {'aria-label': `${args} to ${ret}`});
  },
  // 'a-method': function(l: Let, args: Ann[], ret: Ann) {},
  // 'a-record': function(l: Loc, fields: AField[]) {},
  // 'a-tuple': function(l: Loc, fields: AField[]) {},
  'a-app': function(l: Loc, ann: Ann, args: Ann[]) {
    if (DEBUG || true) console.log(arguments);
    return new AnnotationApp(l.from, l.to, ann, args, {[ariaLabel]: `appication annotation`});
  },
  // 'a-pred': function(l: Loc, ann: Ann, exp: Expr) {},
  // 'a-dot': function(l: Loc, obj: Name, field: string) {},
  // 'a-checked': function(checked: Ann, residual: Ann) {},

  // data AField
  'a-field': function(l: Loc, name: string, ann: Ann) {
    if(DEBUG) console.log(arguments);
    return new Nodes.Literal(
      l.from, l.to,
      name + " :: " + ann.value, 'a-field',
      {'aria-label': `${name}, annotated as a ${ann}`}
    )
  },
}

function idToLiteral(id: Bind): Nodes.Literal {
  if (DEBUG) console.log(id);
  let name = id.ident.value;
  if (DEBUG) console.log(name);

  return new Nodes.Literal(
    (id as ASTNode).from, (id as ASTNode).to, (id.ann != null)? name + " :: " + id.ann : name, "identifier", {'aria-label': name}
  );
}

function inputs_to_fun(args: Bind[]): string {
  if (args.length == 0) {
    return "inputs";
  }
  else if (args.length == 1) {
    return "input: " + args[0];
  }
  else {
    return "inputs: " + args.join(", ");
  }
}

function makeNode(nodeType: string) {
  const args = Array.prototype.slice.call(arguments, 1);
  const constructor = nodeTypes[nodeType];
  console.log('node:', nodeType);
  if (constructor === undefined) {
    console.log("Warning: node type", nodeType, "NYI");
    return;
  } else {
    return constructor.apply(this, args);
  }
}

function makeSrcloc(_fileName: any, srcloc: any) {
  return new Loc(startOf(srcloc), endOf(srcloc));
}

function combineSrcloc(_fileName: any, startPos: any, endPos: any) {
  return new Loc(startOf(startPos), endOf(endPos));
}

function translateParseTree(parseTree: any, fileName: string) {
  function NYI(msg: string) {
    return function() {
      console.log(msg, "not yet implemented");
    }
  }
  const constructors = {
    "makeNode": makeNode,
    "opLookup": opLookup,
    "makeLink": function(a: any, b: any[]) {
      b.unshift(a);
      return b;
    },
    "makeEmpty": function() {
      return new Array();
    },
    "makeString": function(str: any) {
      return str;
    },
    "makeNumberFromString": function(str: string) {
      // TODO: error handling
      return parseFloat(str);
    },
    "makeBoolean": function(bool: any) {
      return bool;
    },
    "makeNone": function() {
      return null;
    },
    "makeSome": function(value: any) {
      return value;
    },
    "getRecordFields": NYI("getRecordFields"),
    "makeSrcloc": makeSrcloc,
    "combineSrcloc": combineSrcloc,
    "detectAndComplainAboutOperatorWhitespace": function(_kids: any, _fileName: any) {
      return;
    }
  };
  return TR.translate(parseTree, fileName, constructors);
}

export default class PyretParser {
  // TODO: Proper error handling.
  //       See `pyret-lang/src/js/trove/parse-pyret.js`.
  parse(text: string) {
    // Tokenize
    console.log('text to be parsed:', text);
    console.trace();
    const tokenizer = TOK.Tokenizer;
    tokenizer.tokenizeFrom(text);
    // Parse
    console.log("@going to parse");
    const parsed = P.PyretGrammar.parse(tokenizer);
    console.log('parsed:', parsed);
    if (parsed) {
      console.log("@valid parse");
      // Count parse trees
      const countParses = P.PyretGrammar.countAllParses(parsed);
      if (countParses === 1) {
        console.log("@exactly one valid parse", parsed);
        // Construct parse tree
        const parseTree = P.PyretGrammar.constructUniqueParse(parsed);
        console.log("@reconstructed unique parse");
        console.log('pt:', parseTree);
        // Translate parse tree to AST
        const ast = translateParseTree(parseTree, "<editor>.arr");
        console.log(ast);
        return ast;
      } else {
        throw "Multiple parses";
      }
    } else {
      console.log("Invalid parse");
      console.log(text);
      // really, curTok does exist, but ts isn't smart enough to detect
      console.log("Next token is " + (tokenizer as any).curTok.toRepr(true)
                  + " at " + (tokenizer as any).curTok.pos.toString(true));
    }
  }

  getExceptionMessage(error: any) {
    return error;
  }
}

function testRun() {
  const data = `
  fun foo(x :: Number):
  x + 3
  end
  `
  const parser = new PyretParser();
  const ast = parser.parse(data);
  console.log("\nBlocky AST:\n");
  console.log(ast.toString());
  console.log("\nBlocky AST (JS view):\n");
  console.log(ast);
}
