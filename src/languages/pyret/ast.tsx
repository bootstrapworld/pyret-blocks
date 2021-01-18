// Documentations of functions in pretty() can be found on:
// https://github.com/brownplt/pretty-fast-pretty-printer

import React from 'react';
import {AST, Pretty as P, DT, Node, Args, Nodes, NodeSpec as Spec} from 'codemirror-blocks';
import { render } from 'react-dom';

const {pluralize, enumerateList } = AST;
const {DropTarget} = DT;

// each class has constructor longDescription pretty render

const INDENT = P.txt("  ");

export class Binop extends AST.ASTNode {
  op: AST.ASTNode;
  left: AST.ASTNode;
  right: AST.ASTNode;
	bgcClassName: string;

  constructor(from, to, op, left, right, bgcClassName, options = {}) {
    super(from, to, 'binop', options);
    // op is just a string, so not a part of children
    this.op = op;
    this.left = left;
    this.right = right;
		this.bgcClassName = bgcClassName;
  }

  static spec = Spec.nodeSpec([
    Spec.required('op'),
    Spec.required('left'),
    Spec.required('right'),
    Spec.value('bgcClassName'),
  ])

  longDescription(level) {
    return `a ${this.op.describe(level)} expression with ${this.left.describe(level)} and ${this.right.describe(level)}`;
  }

  pretty(): P.Doc {
    return P.ifFlat(P.horz(this.left, " ", this.op, " ", this.right),
                    P.vert(this.left, P.horz(" ", this.op, " ", this.right)));
  }

  render(props) {
    return (
			<span className={this.bgcClassName}>
				<Node node={this} {...props}>
					<span className="blocks-operator-container">
						<span className="blocks-operator-input">
							{this.left.reactElement()}  
						</span>
						<span className="blocks-operator-text">
							{this.op.reactElement()}
						</span>
						<span className="blocks-operator-input">
							{this.right.reactElement()}
						</span>
					</span>
				</Node>
			</span>
    );
  }
}

export class Bind extends AST.ASTNode {
  ann: AST.ASTNode | null;
  ident: Nodes.Literal;

  constructor(from, to, id: Nodes.Literal, ann, options = {}) {
    super(from, to, 's-bind', options);
    this.ident = id;
    this.ann = ann;
  }

  static spec = Spec.nodeSpec([
    Spec.required('ident'),
    Spec.optional('ann'),
  ])

  longDescription(level) {
    return `a bind expression with ${this.ident.value} and ${this.ann}`;
  }

  pretty() {
    let ident = this.ident.pretty();
    if (this.ann === null) {
      return ident;
    } else {
      return P.horz(this.ident, P.txt(" :: "), this.ann);
    }
  }

  render(props) {
    return <Node node={this} {...props}>
      {(this.ann === null) ? <span className="blocks-bind">{this.ident.reactElement()}</span>
        :
        (<span className="blocks-bind">{this.ident.reactElement()} :: {this.ann.reactElement()}</span>)
      }</Node>
  }
}

export class Func extends AST.ASTNode {
  name: AST.ASTNode;
  args: AST.ASTNode[];
  retAnn: AST.ASTNode | null;
  doc: AST.ASTNode | null;
  // doc: string | null;
  body: AST.ASTNode;
  block: boolean;

  constructor(from, to, name, args, retAnn, doc, body, block, options = {}) {
    super(from, to, 'funDef', options);
    this.name = name;
    this.args = args;
    this.retAnn = retAnn;
    this.doc = doc;
    this.body = body;
    this.block = block;
  }

  static spec = Spec.nodeSpec([
    Spec.required('name'),
    Spec.list('args'),
    Spec.optional('retAnn'),
    Spec.optional('doc'),
    Spec.required('body'),
    Spec.value('block'),
    Spec.value('onDragOver'),
    Spec.value('onDragEnd')
  ])

  longDescription(level) {
    return `a func expression with ${this.name.describe(level)}, ${this.args} and ${this.body.describe(level)}`;
  }

  pretty() {
    // TODO: show doc
    let retAnn = this.retAnn ? P.horz(" -> ", this.retAnn) : "";
    let header_ending = (this.block)? " block:" : ":";
    let header = P.ifFlat(
      P.horz("fun ", this.name, "(", P.sepBy(this.args, ", ", ","), ")", retAnn, header_ending),
      P.vert(P.horz("fun ", this.name, "("),
             P.horz(INDENT, P.sepBy(this.args, ", ", ","), ")", retAnn, ":"),
             ));
    // either one line or multiple; helper for joining args together
    return P.ifFlat(
      // P.horz(header, " ", this.body, " end"),
      P.horz(header, " ", "doc: \"", this.doc, "\" ", this.body, " end"),
      P.vert(header,
            P.horz(INDENT, "doc: \"", this.doc, "\""),
            P.horz(INDENT, this.body),
             "end"));
  }
  onDragOver(e){
    //this.setState({ hover: true });
    /*
    var target = e.target;
    console.log('enter', target);
    if(target.classList.contains('blocks-func-body'))
    {
      e.target.classList.add('blocks-hover');
      console.log('dragging over', this, target, e.sender );
    } 
    */
  };
  onDragEnd = function(e){
    var target = e.target;
    console.log('exit', target);
    while(!target.classList.contains('blocks-func-body'))
    {
        target = target.parentNode;
    }
    target.classList.remove('blocks-hover');
    console.log('dragging end', target);
  };

  render(props) {
    // TODO: show doc
    let name = this.name.reactElement();
    let body = this.body.reactElement();
		let doc = this.doc.reactElement();
    // let docDOM = <span>
    //   doc: {name} {this.doc}
    // </span>
    
    let args = <span className="blocks-args">
        <Args field="args">{this.args}</Args>
      </span>;
		let header_ending = <span>
      {(this.retAnn != null)? <>&nbsp;-&gt;&nbsp;{this.retAnn.reactElement()}</> : null}{this.block ? <>&nbsp;{"block"}</> : null}
    </span>;
    const NEWLINE = <br />;
    let bodyClass = "blocks-func-body"; //+ (this.state.hover ? " blocks-hover" : "");

    return (
      <Node node={this} {...props} onDragEnter={() => console.log('A')}>
				<span className="blocks-func">
					fun&nbsp;{name}({args}){header_ending}:{NEWLINE}
          <div className="blocks-doc-string">
          doc: {doc}
          </div>
				</span>
        <span onDragLeave={this.onDragEnd}>
          <span className={bodyClass} >
            {body}
          </span>
        </span>
        <span className="blocks-func-footer" id="blocks-style-footer">
          end
        </span>
      </Node>
    );
  }
}

export class Lambda extends AST.ASTNode {
  name: AST.ASTNode | null;
  args: AST.ASTNode[];
  retAnn: AST.ASTNode | null;
  // doc: AST.ASTNode | null;
  doc: string | null;
  body: AST.ASTNode;
  block: boolean

  constructor(from, to, name, args, retAnn, doc, body, block, options = {}) {
    // TODO change this from function definition?
    super(from, to, 'lambdaExp', options);
    this.name = name;
    this.args = args;
    this.retAnn = retAnn;
    this.doc = doc;
    this.body = body;
    this.block = block;
  }

  static spec = Spec.nodeSpec([
    Spec.optional('name'),
    Spec.list('args'),
    Spec.optional('retAnn'),
    Spec.value('doc'),
    Spec.required('body'),
    Spec.value('block'),
  ])

  longDescription(level) {
    return `a func expression with ${this.name.describe(level)}, ${this.args} and ${this.body.describe(level)}`;
  }

  pretty() {
    // TODO: show doc
    let retAnn = this.retAnn ? P.horz(" -> ", this.retAnn) : "";
    let header_ending = (this.block)? " block:" : ":";
    let prefix = (this.name == null)? ["lam("] : ["lam ", this.name, "("];
    let header = P.ifFlat(
      P.horz(P.horzArray(prefix), P.sepBy(this.args, ", ", ","), ")", retAnn, header_ending),
      P.vert(P.horzArray(prefix),
             P.horz(INDENT, P.sepBy(this.args, ", ", ","), ")", retAnn, ":")));
    // either one line or multiple; helper for joining args together
    return P.ifFlat(
      P.horz(header, " ", this.body, " end"),
      P.vert(header,
             P.horz(INDENT, this.body),
             "end"));
  }

  render(props) {
    // TODO: show doc
    let name = (this.name == null)? null : this.name.reactElement();
    let body = this.body.reactElement();
    let args = <span className="blocks-args">
      <Args field="args">{this.args}</Args>
    </span>;
    let header_ending = <span>
      {(this.retAnn != null)? <>&nbsp;-&gt;&nbsp;{this.retAnn.reactElement()}</> : null}{this.block ? <>&nbsp;{"block"}</> : null}
    </span>;
    return (
      <Node node={this} {...props}>
        <span className="blocks-lambda">
          lam&nbsp;{name}({args}){header_ending}:
        </span>
        <span className="blocks-lambda-body">
          {body}
        </span>
        <span className="blocks-lambda-footer" id="blocks-style-footer">
          end
        </span>
      </Node>
    );
  }
}

export class Block extends AST.ASTNode {
  stmts: AST.ASTNode[];
  name: string;

  constructor(from, to, stmts, name, options = {}) {
    super(from, to, 'block', options);
    this.stmts = stmts;
    this.name = name;
  }

  static spec = Spec.nodeSpec([
    Spec.list('stmts'),
    Spec.value('name'),
  ])

  longDescription(level) {
    return `a sequence containing ${enumerateList(this.stmts, level)}`;
  }

  pretty() {
    return P.vertArray(this.stmts);
  }

  render(props) {
    const NEWLINE = <br />;
    let statements = [];
    this.stmts.forEach((element, key) => {
      let span = <span key={key}>
        <DropTarget/>
        {NEWLINE}
        {element.reactElement()}
        {NEWLINE}
      </span>
      statements.push(span);
    });
		statements.push(<span><DropTarget key={this.stmts.length} /></span>);
    // include name here? is it ever a time when it's not block?
    return (
      <Node node = {this} {...props}>
        <span className="blocks-arguments">
          {statements}
        </span>
      </Node>
    )
  }
}

export class Let extends AST.ASTNode {
  ident: AST.ASTNode; // really Bind
  rhs: AST.ASTNode;
	bgcClassName: string;

  constructor(from, to, id, rhs, bgcClassName, options = {}) {
    super(from, to, 's-let', options);
    this.ident = id;
    this.rhs = rhs;
		this.bgcClassName = bgcClassName;
  }

  static spec = Spec.nodeSpec([
    Spec.required('ident'),
    Spec.required('rhs'),
    Spec.value('bgcClassName'),
  ])

  longDescription(level) {
    return `a let setting ${this.ident} to ${this.rhs}`;
  }

  pretty() {
    return P.ifFlat(
      P.horz(this.ident, " = ", this.rhs),
      P.vert(P.horz(this.ident, " ="),
             P.horz(INDENT, this.rhs)));
  }

	render(props) {
		let identifier = this.ident.reactElement();
		return (
			<span className={this.bgcClassName}>
				<Node node={this} {...props}>
					<span className={"blocks-let"}>
						{identifier} &nbsp;=&nbsp; {this.rhs.reactElement()}
					</span>
				</Node>
			</span>
    );
  }
}

export class Var extends AST.ASTNode {
  ident: Nodes.Literal;
  rhs: AST.ASTNode;
	bgcClassName: string;

  constructor(from, to, id, rhs, bgcClassName, options = {}) {
    super(from, to, 's-var', options);
    this.ident = id;
    this.rhs = rhs;
		this.bgcClassName = bgcClassName;
  }

  static spec = Spec.nodeSpec([
    Spec.required('ident'),
    Spec.required('rhs'),
    Spec.value('bgcClassName'),
  ])

  longDescription(level) {
    return `a var setting ${this.ident} to ${this.rhs}`;
  }

  pretty() {
    return P.ifFlat(
      P.horz("var ", this.ident, " = ", this.rhs),
      P.vert(P.horz("var ", this.ident, " ="),
             P.horz(INDENT, this.rhs)));
  }

  render(props) {
    return (
			<span className={this.bgcClassName}>
				<Node node={this} {...props}>
					<span className={"blocks-var"}>
						VAR &nbsp;{this.ident.reactElement()} &nbsp;=&nbsp;{this.rhs.reactElement()}
					{/* <span className="blocks-args">
						<Args>{[this.ident, this.rhs]}</Args>
					</span> */}
					</span>
				</Node>
			</span>
    );
  }
}

export class Assign extends AST.ASTNode {
  ident: Nodes.Literal;
  rhs: AST.ASTNode;

  constructor(from, to, id, rhs, options = {}) {
    super(from, to, 's-assign', options);
    this.ident = id;
    this.rhs = rhs;
  }

  static spec = Spec.nodeSpec([
    Spec.required('ident'),
    Spec.required('rhs'),
  ])

  longDescription(level) {
    return `an assignment setting ${this.ident} to ${this.rhs}`;
  }

  pretty() {
    return P.ifFlat(
      P.horz(this.ident, " := ", this.rhs),
      P.vert(P.horz(this.ident, " :="),
             P.horz(INDENT, this.rhs)));
  }

  render(props) {
    return (
      <Node node={this} {...props}>
        <span className="blocks-assign">
          {this.ident.reactElement()} := {this.rhs.reactElement()}
        </span>
      </Node>
    );
  }
}

export class Construct extends AST.ASTNode {
  modifier: any; // TODO: what is this?
  construktor: AST.ASTNode;
  values: AST.ASTNode[];
	bgcClassName: string;

  constructor(from, to, modifier, construktor, values, bgcClassName, options = {}) {
    super(from, to, 'constructor', options);
    this.modifier = modifier;
    this.construktor = construktor;
    this.values = values;
		this.bgcClassName = bgcClassName;
  }

  static spec = Spec.nodeSpec([
    Spec.value('modifier'),
    Spec.required('construktor'),
    Spec.list('values'),
    Spec.value('bgcClassName'),
  ])

  longDescription(level) {
    return `${this.construktor.describe(level)} with ${enumerateList(this.values, level)}`;
  }

  pretty() {
    let header = P.horz("[", this.construktor, ":");
    let values = P.sepBy(this.values, ", ", "");
    let footer = P.txt("]");
    // either one line or multiple; helper for joining args together
    return P.ifFlat(P.horz(header, P.txt(" "), values, footer),
      P.vert(header,
             P.horz(INDENT, values), // maybe make values in P.vertArray
             footer));
  }

  render(props) {
    let construktor = this.construktor.reactElement();
    let values = <Args field="values">{this.values}</Args>;
			// <span className="constructor">
			//   <Node node={this} {...props}>
			//     <span className={`blocks-construct ${this.bgcClassName}`}>{construktor}</span>
			//     {values}
			//   </Node>
			// </span>
    return (
			<span className={this.bgcClassName}>
				<Node node={this} {...props}>
					<span className="blocks-construct">{construktor}</span>
					{values}
				</Node>
			</span>
    );
  }
}


export class FunctionApp extends AST.ASTNode {
  func: AST.ASTNode;
  args: AST.ASTNode[];

  constructor(from, to, func, args, options={}) {
    super(from, to, 'funApp', options);
    this.func = func;
    this.args = args;
  }

  static spec = Spec.nodeSpec([
    Spec.required('func'),
    Spec.list('args'),
  ])

  longDescription(level) {
    // if it's the top level, enumerate the args
    if ((super.level  - level) == 0) {
      return `applying the function ${this.func.describe(level)} to ${pluralize("argument", this.args)} `+
      this.args.map((a, i, args) => (args.length>1? (i+1) + ": " : "") + a.describe(level)).join(", ");
    }
    // if we're lower than that (but not so low that `.shortDescription()` is used), use "f of A, B, C" format
    else return `${this.func.describe(level)} of `+ this.args.map(a  => a.describe(level)).join(", ");
  }

  pretty() {
    let header = P.txt(this.func + "(");
    let values = (this.args.length != 0)? P.sepBy(this.args.map(p => p.pretty()), ", ", "") : P.txt("");
    // either one line or multiple; helper for joining args together
    return P.ifFlat(
      P.horz(header, values, ")"),
      P.vert(header,
             P.horz(INDENT, values),
             ")"));
  }

  render(props) {
    return (
      <Node node={this} {...props}>
        <span className="blocks-funapp">
          <Args field="func">{[this.func]}</Args>
        </span>
        <span className="blocks-args">
          <Args field="args">{this.args}</Args>
        </span>
    </Node>
    );
  }
}

// could maybe combine this with list to make generic data structure pyret block
export class Tuple extends AST.ASTNode {
  fields: AST.ASTNode[];

  constructor(from, to, fields, options = {}) {
    super(from, to, 's-tuple', options);
    this.fields = fields;
  }

  static spec = Spec.nodeSpec([
    Spec.list('fields'),
  ])

  longDescription(level) {
    return `tuple with ${enumerateList(this.fields, level)}`;
  }

  pretty() {
    let header = P.txt("{");
    let values = P.sepBy(this.fields, "; ", "");
    let footer = P.txt("}");
    // either one line or multiple; helper for joining args together
    return P.ifFlat(
      P.horz(header, values, footer),
      P.vert(header,
             P.horz(INDENT, values),
             footer));
  }

  render(props) {
    let fields = [];
    this.fields.forEach((child, index) => {
      if (index != 0) {
        fields.push(";");
      }
      fields.push(child.reactElement());
    });
    return (
      <Node node={this} {...props}>
        <span className="blocks-tuple">
          {"{"}{fields}{"}"}
        </span>
      </Node>
    );
  }
}

export class TupleGet extends AST.ASTNode {
  base: AST.ASTNode;
  index: AST.ASTNode;

  constructor(from, to, base, index, options = {}) {
    super(from, to, 'tuple-get', options);
    this.base = base;
    this.index = index;
  }

  static spec = Spec.nodeSpec([
    Spec.required('base'),
    Spec.required('index'),
  ])

  longDescription(level) {
    return `${this.index.describe(level)} of ${this.base.describe(level)}`;
  }

  pretty() {
    let base = this.base.pretty();
    let index = this.index.pretty();
    return P.ifFlat(
      P.horz(base, '.{', index, '}'),
      P.vert(P.horz(base, '.{'),
             P.horz(INDENT, index),
             '}'));
  }

  render(props) {
    return (
      <Node node={this} {...props}>
        <span className="blocks-tuple-access">
          {this.base.reactElement()}{".{"}{this.index.reactElement()}{"}"}
        </span>
        <span className="block-args">
        </span>
      </Node>
    );
  }
}

export class Check extends AST.ASTNode {
  name: string | null;
  body: AST.ASTNode;
  keyword_check: boolean;

  constructor(from, to, name, body, keyword_check, options = {}) {
    super(from, to, 's-check', options);
    this.name = name;
    this.body = body;
    this.keyword_check = keyword_check;
  }

  static spec = Spec.nodeSpec([
    Spec.value('name'),
    Spec.required('body'),
    Spec.value('keyword_check'),
  ])

  longDescription(level) {
    return `check with ${this.body}`;
  }

  pretty() {
    let header = P.txt((this.name == null) ? "check:" : `check "${this.name}":`);
    return P.ifFlat(
      P.horz(header, " ", this.body, " end"),
      P.vert(header,
             P.horz(INDENT, this.body),
             "end"));
  }

  render(props) {
    let body = this.body.reactElement();
    return (
      <Node node={this} {...props}>
        <span className="blocks-check">
          {"check" + (this.name != null ? " " + this.name : "")}
        </span>
        <span className="blocks-check-body">
          <span className="blocks-check-left" ></span>
          <span className="blocks-check-args">
            {body}
          </span>
        </span>
        <span className="blocks-check-footer" id="blocks-style-footer">
          end
        </span>
      </Node>
    );
  }
}

export class CheckTest extends AST.ASTNode {
  op: AST.ASTNode;
  refinement: AST.ASTNode | null;
  lhs: AST.ASTNode;
  rhs: AST.ASTNode | null;
  
  constructor(from, to, check_op, refinement, lhs, rhs, options={}) {
    super(from, to, 'checkTest', options);
    this.op = check_op;
    this.refinement = refinement;
    this.lhs = lhs;
    this.rhs = rhs;
  }

  static spec = Spec.nodeSpec([
    Spec.required('op'),
    Spec.optional('refinement'),
    Spec.required('lhs'),
    Spec.optional('rhs'),
  ])

  longDescription(level) {
    // how to deal with when rhs is undefined
    return `${this.lhs.describe(level)} ${this.op.describe(level)} ${(this.rhs != null)? this.rhs.describe(level) : ""}`;
  }

  pretty() {
    let left = this.lhs.pretty();
    let right = this.rhs ? this.rhs.pretty() : P.txt("");
    let op = this.op.pretty();
    if (this.rhs === null) {
      return P.ifFlat(
        P.horz(left, " ", op),
        P.vert(left,
               P.horz(INDENT, op)));
    } else {
      return P.ifFlat(
        P.horz(left, " ", op, " ", right),
        P.vert(left,
               P.horz(INDENT, op, right)));
    }
  }

  render(props) {
    return (
      <Node node={this} {...props}>
        <span className="blocks-args">
          {this.lhs.reactElement()}
					<span className="blocks-check-test">
						{this.op.reactElement()}
					</span>
          {this.rhs ? this.rhs.reactElement() : null}
        </span>
      </Node>
    );
  }
}

export class Bracket extends AST.ASTNode {
  base: AST.ASTNode;
  index: AST.ASTNode;

  constructor(from, to, base, index, options = {}) {
    super(from, to, 's-bracket', options);
    this.base = base;
    this.index = index;
  }

  static spec = Spec.nodeSpec([
    Spec.required('base'),
    Spec.required('index'),
  ])

  longDescription(level) {
    return `${this.index.describe(level)} of ${this.base.describe(level)}`;
  }

  pretty() {
    let base = this.base.pretty();
    let index = this.index.pretty();
    return P.ifFlat(
      P.horz(base, '[', index, ']'),
      P.vert(P.horz(base, '['),
             P.horz(INDENT, index),
             ']'));
  }

  render(props) {
    return (
      <Node node={this} {...props}>
        <span className="blocks-bracket">
          {this.base.reactElement()} [ {this.index.reactElement()}]
        </span>
        <span className="block-args">
        </span>
      </Node>
    );
  }
}

export class LoadTable extends AST.ASTNode {
  columns: AST.ASTNode[];
  sources: AST.ASTNode[];

  constructor(from, to, rows, sources, options={}) {
    super(from, to, 'loadTable', options);
    this.columns = rows;
    this.sources = sources;
  }

  static spec = Spec.nodeSpec([
    Spec.list('columns'),
    Spec.list('sources'),
  ])

  longDescription(level) {
    return `${enumerateList(this.columns, level)} in a table from ${enumerateList(this.sources, level)}`;
  }

  pretty() {
    let header = P.txt("load-table: ");
    let row_names = P.sepBy(this.columns.map(e => e.pretty()), ", ", "");
    let row_pretty = P.ifFlat(row_names, P.vertArray(this.columns.map(e => e.pretty())));
    let sources = P.horz(P.sepBy(this.sources.map(s => s.pretty())));
    // let sources = P.horz("source: ", P.sepBy(this.sources.map(s => s.pretty())));
    // let sources = P.horz("source: ", P.sepBy(this.sources.map(s => s.pretty()), "", "source: "));
    let footer = P.txt("end");
    return P.vert(
      P.ifFlat(
        P.horz(header, row_pretty),
        P.vert(header,
               P.horz(P.txt("  "), row_pretty))),
      P.horz("  ", sources),
      footer);
  }

  render(props) {

		let sources = [];
		sources.push(<DropTarget />);
		this.sources.forEach((e, index) => {
			sources.push(e.reactElement({key: index}))
			sources.push(<DropTarget />);
		});

		let columns = [];
		columns.push(<DropTarget />);
		this.columns.forEach((e, index) => {
			columns.push(e.reactElement({key: index}))
			columns.push(<DropTarget />);
		});
    return (
      <Node node={this} {...props}>
        <span className="blocks-load-table">
          load-table
        </span>
				<span className="blocks-args">
					{columns}
				</span>
				{sources}
    </Node>
            /* {this.sources.map((e, i) => e.reactElement({key: i}))} */
    );
  }
}

export class TableSource extends AST.ASTNode {
  source: AST.ASTNode;

    constructor(from, to, source, options = {}) {
      super(from, to, 's-table-src', options);
      this.source = source;
    }
  
    static spec = Spec.nodeSpec([
      Spec.required('source')
    ])
  
    longDescription(level) {
      return `source getting table from ${this.source}`;
    }
  
    pretty() {
      return P.horz("source: ", this.source);
    }
  
    render(props) {
      return (
          <Node node={this} {...props}>
            <span className={"blocks-table-source"}>
              source: {this.source.reactElement()}
            </span>
          </Node>
      );
    }
}

export class Sanitize extends AST.ASTNode {
  name: Nodes.Literal;
  sanitizer: Nodes.Literal; // AST.ASTNode;

    constructor(from, to, name, sanitizer, options = {}) {
      super(from, to, 's-sanitize', options);
      this.name = name;
      this.sanitizer = sanitizer;
    }
  
    static spec = Spec.nodeSpec([
      Spec.required('name'),
      Spec.required('sanitizer')
    ])
  
    longDescription(level) {
      return `sanitizing ${this.name} with ${this.sanitizer}`;
    }
  
    pretty() {
      return P.horz("sanitize ", this.name, " using ", this.sanitizer);
    }
  
    render(props) {
      return (
          <Node node={this} {...props}>
            <span className={"blocks-sanitize"}>
              sanitize {this.name.reactElement()} using {this.sanitizer.reactElement()}
            </span>
          </Node>
      );
    }
}

export class Paren extends AST.ASTNode {
  expr: AST.ASTNode;
  constructor(from, to, expr, options) {
    super(from, to, 'paren', options);
    this.expr = expr;
  }

  static spec = Spec.nodeSpec([
    Spec.required('expr'),
  ])

  longDescription(level) {
    return `${this.expr.describe(level)} in parentheses`;
  }

  pretty() {
    let inner = this.expr.pretty();
    return P.ifFlat(
      P.horz("(", inner, ")"),
      P.vert("(", P.horz(INDENT, inner), ")")
    );
  }

  render(props) {
    return <Node node={this} {...props}>
      {this.expr.reactElement()}
    </Node>;
  }
}

export class IfPipe extends AST.ASTNode {
	branches: IfPipeBranch[];
  blocky: boolean;
  constructor(from, to, branches, blocky, options) {
    super(from, to, 'ifPipeExpression', options);
    this.branches = branches;
    this.blocky = blocky;
  }

  static spec = Spec.nodeSpec([
    Spec.list('branches'),
    Spec.value('blocky'),
  ])

  longDescription(level) {
    return `${enumerateList(this.branches, level)} in an ask expression`;
  }

  pretty() {
    let prefix = "ask:";
    let suffix = "end";
    let branches = P.sepBy(this.branches, "", "");
    return P.ifFlat(
      P.horz(prefix, " ", branches, " ", suffix),
      P.vert(prefix, P.horz(INDENT, branches), suffix)
    );
  }

  render(props) {
    const NEWLINE = <br />
    let branches = [];
    this.branches.forEach((element, index) => {
      let span = <span key={index}>
        <DropTarget />
        {NEWLINE}
        {(element as any).reactElement()}
        {NEWLINE}
      </span>;
      branches.push(span);
    });
    branches.push(<DropTarget key={this.branches.length} />);

    return (
      <Node node={this} {...props}>
        <span className="blocks-ask">
          ask:
        </span>
        <div className="blocks-cond-table">
          {branches}
        </div>
        <span className="blocks-ask-footer" id="blocks-style-footer">
          end
        </span>
      </Node>
    );
  }
}

export class IfPipeBranch extends AST.ASTNode {
  test: AST.ASTNode;
  body: AST.ASTNode;
  constructor(from, to, test, body, options) {
    super(from, to, 'condClause', options);
    this.test = test;
    this.body = body;
  }

  static spec = Spec.nodeSpec([
    Spec.required('test'),
    Spec.required('body'),
  ])

  longDescription(level) {
    return `${this.test.describe(level)} testing with ${this.body.describe(level)} body in an if pipe`;
  }

  pretty() {
    let prefix = "|";
    let intermediate = "then:";
    let test = this.test.pretty();
    let body = this.body.pretty();
    return P.sepBy([prefix, test, intermediate, body], " ", "");
  }

  render(props) {
    const NEWLINE = <br />
    return (
			<Node node={this} {...props}>
				<div className="blocks-cond-predicate">
					{this.test.reactElement()}
				</div>
				{NEWLINE}
				<div className="blocks-cond-result">
					{this.body.reactElement()}
				</div>
      </Node>
    )
  }
}

const prettyAsks = function(branches: IfBranch[], _else: AST.ASTNode | undefined, blocky: boolean): P.Doc {
  // TODO what do do if empty branches?
  let length = branches.length;
  if (length == 0) {
    throw new Error("if constructed with no branches—this should not have parsed(?)");
  }
  else if (length == 1) {
    let prefix = ifPrefix(branches[0]);
    if (_else != undefined) {
      return P.vert(prefix, ifElse(_else), "end");
    }
    else {
      return P.vert(P.concat("ask: ", branches[0].pretty()), "end");
    }
  }
  else {
    let prefix = ifPrefix(branches[0]);
    let suffix = "end";
    let pretty_branches = branches.slice(1, length).map(b => P.concat("else if ", b.pretty()));
    if (_else != undefined) {
      return P.vert(prefix, ...pretty_branches, ifElse(_else), suffix);
    }
    else {
      return P.vert(prefix, ...pretty_branches, suffix);
    }
  }
};
export class IfPipeElseExpression extends AST.ASTNode {

  branches: IfPipeBranch[];
	otherwise_branch: IfPipeBranch;
  blocky: boolean;
  constructor(from, to, branches, otherwise_branch, blocky, options) {
    super(from, to, 'ifPipeElseExpression', options);
    this.branches = branches;
    this.otherwise_branch = otherwise_branch;
    this.blocky = blocky;
  }

  static spec = Spec.nodeSpec([
    Spec.list('branches'),
    Spec.required('otherwise_branch'),
    Spec.value('blocky'),
  ])

  longDescription(level) {
    return `${enumerateList([this.branches, this.otherwise_branch], level)} in an ask expression with otherwise`;
  }

  pretty() {
    let prefix = "ask:";
    let suffix = "end";
    // let mainlength = this.branches.length;
    let branches = P.sepBy(this.branches, "", "");
    let otherwise_branch = "| otherwise: "+this.otherwise_branch;
    return P.ifFlat(
      P.horz(prefix, " ", branches, " ", otherwise_branch+" "+suffix),
      P.vert(prefix, P.horz(INDENT, branches), suffix)
    );

  }

  render(props) {
    const NEWLINE = <br />
    let branches = [];
    this.branches.forEach((element, index) => {
      let span = <span key={index}>
        <DropTarget />
        {NEWLINE}
        {(element as any).reactElement()}
        {NEWLINE}
      </span>;
      branches.push(span);
    });
    branches.push(<DropTarget key={this.branches.length} />);

    return (
      <Node node={this} {...props}>
        <span className="blocks-ask">
          ask:
        </span>
        <div className="blocks-cond-table">
          {branches}
          {NEWLINE}
				</div>
				<span className="blocks-otherwise">
					otherwise:
				</span>
				<div className="blocks-cond-table">
					{NEWLINE}
					{(this.otherwise_branch as any).reactElement()}
        </div>
        <span className="blocks-ask-footer" id="blocks-style-footer">
          end
        </span>
      </Node>
    );
  }
}

export class ArrowArgnames extends AST.ASTNode {
  args: AST.ASTNode[];
  ret: AST.ASTNode; // TODO: is ret ever empty?
  uses_parens: boolean;
  constructor(from, to, args, ret, uses_parens, options) {
    super(from, to, 'ArrowArgnames', options);
    this.args = args;
    this.ret = ret;
    this.uses_parens = uses_parens;
  }

  static spec = Spec.nodeSpec([
    Spec.list('args'),
    Spec.required('ret'),
    Spec.value('uses_parens'),
  ])

  longDescription(level) {
    return `parameters ${enumerateList(this.args, level)} resulting in ${this.ret.describe(level)}`;
  }

  pretty() {
    let args = P.sepBy(this.args.map(e => e.pretty()), ", ", ",");
    let ret = this.ret.pretty();
    let inner = P.sepBy([P.horz("(", args, ")"), "->", ret], " ", "");
    return this.uses_parens? P.horz("(", inner, ")") : inner;
  }

  render(props) {
    let args = this.args.map(e => e.reactElement());
    let inner = <>({args})&nbsp;&rarr;&nbsp;{this.ret.reactElement()}</>;
    return (
      <Node node={this} {...props}>
        <div className="blocks-cond-result">
          {this.uses_parens? <> ( {inner}) </> : inner}
        </div>
      </Node>
    )
  }
}

export class Contract extends AST.ASTNode {
  ann: AST.ASTNode;
  name: Nodes.Literal;

  constructor(from, to, id: Nodes.Literal, ann, options = {}) {
    super(from, to, 's-contract', options);
    this.name = id;
    this.ann = ann;
  }

  static spec = Spec.nodeSpec([
    Spec.required('name'),
    Spec.required('ann'),
  ])

  longDescription(level) {
    return `a contract with ${this.name.describe(level)} and ${this.ann.describe(level)}`;
  }

  pretty() {
    return P.horz(this.name, P.txt(" :: "), this.ann);
  }

  render(props) {
    return <Node node={this} {...props}>
      <span className="blocks-contract">{this.name.reactElement()} :: {this.ann.reactElement()}</span>
    </Node>
  }
}

export class Include extends AST.ASTNode {
  mod: AST.ASTNode;

  constructor(from, to, mod, options = {}) {
    super(from, to, 's-include', options);
    this.mod = mod;
  }

  static spec = Spec.nodeSpec([
    Spec.required('mod'),
  ])

  longDescription(level) {
    return `include the module ${this.mod.describe(level)}`;
  }

  pretty() {
    return P.horz("include ", this.mod.pretty());
  }

  render(props) {
    return <Node node={this} {...props}>
      <span className="blocks-include">include&nbsp;{this.mod.reactElement()}</span>
    </Node>
  }
}

// export class ProvideAll extends AST.ASTNode{

//   constructor(from, to, options = {}) {
//     super(from, to, 's-provide-all', options);
//   }

//   static spec = Spec.nodeSpec([
//     // Spec.required('mod'),
//   ]);

//   longDescription(level) {
//     return `provide all statement`;
//   }

//   pretty() {
//     return P.horz("provide *");
//   }

//   render(props) {

//     console.log("provde all !!!!!!!!");
//     return( <Node node={this} {...props}>
//       <span className="blocks-provide-all">provide *</span>
//     </Node>)
//   }
// }

export class SpecialImport extends AST.ASTNode {
  func: AST.ASTNode;
  args: AST.ASTNode[];

  constructor(from, to, func, args, options={}) {
    super(from, to, 'specialImport', options);
    this.func = func;
    this.args = args;
  }

  static spec = Spec.nodeSpec([
    Spec.required('func'),
    Spec.list('args'),
  ])

  longDescription(level) {
    // if it's the top level, enumerate the args
    if ((super.level  - level) == 0) {
      return `importing the module ${this.func.describe(level)} with ${pluralize("argument", this.args)} `+
      this.args.map((a, i, args) => (args.length>1? (i+1) + ": " : "") + a.describe(level)).join(", ");
    }
    // if we're lower than that (but not so low that `.shortDescription()` is used), use "f of A, B, C" format
    else return `${this.func.describe(level)} of `+ this.args.map(a  => a.describe(level)).join(", ");
  }

  pretty() {
    let header = P.txt(this.func + "(");
    let values = (this.args.length != 0)? P.sepBy(this.args.map(p => p.pretty()), ", ", "") : P.txt("");
    // either one line or multiple; helper for joining args together
    return P.ifFlat(
      P.horz(header, values, ")"),
      P.vert(header,
             P.horz(INDENT, values),
             ")"));
  }

  render(props) {
    return (
      <Node node={this} {...props}>
        <span className="blocks-special-import">
          <Args>{[this.func]}</Args>
        </span>
        <span className="blocks-args">
          <Args>{this.args}</Args>
        </span>
    </Node>
    );
  }
}

export class DataField extends AST.ASTNode {
  name: string;
  value: AST.ASTNode;

  constructor(from, to, name: string, value, options = {}) {
    super(from, to, 's-data-field', options);
    this.name = name;
    this.value = value;
  }

  static spec = Spec.nodeSpec([
    Spec.value('name'),
    Spec.required('value'),
  ])

  longDescription(level) {
    return `a data field with name ${this.name} and value ${this.value.describe(level)}`;
  }

  pretty() {
    return P.horz(this.name, P.txt(": "), this.value.pretty());
  }

  render(props) {
    return <Node node={this} {...props}>
      <span className="blocks-data-field">{this.name}:&nbsp;{this.value.reactElement()}</span>
    </Node>
  }
}

export class Reactor extends AST.ASTNode {
  fields: AST.ASTNode[];
  
  constructor(from, to, fields, options) {
    super(from, to, 's-reactor', options);
    this.fields = fields;
  }

  static spec = Spec.nodeSpec([
    Spec.list('fields'),
  ])

  longDescription(level) {
    return `${enumerateList(this.fields, level)} in a reactor`;
  }

  pretty() {
    let prefix = "reactor:";
    let suffix = "end";
    let branches = P.sepBy(this.fields, ", ", ",");
    return P.ifFlat(
      P.horz(prefix, " ", branches, " ", suffix),
      P.vert(prefix, P.horz(INDENT, branches), suffix)
    );
  }

  render(props) {
    let branches = this.fields.map((branch, index) => branch.reactElement({key: index}));
    return (
      <Node node={this} {...props}>
        <span className="blocks-reactor">
          reactor:
        </span>
        <div className="blocks-cond-table">
          {branches}
        </div>
      </Node>
    );
  }
}

// --------------------------------- Table Render Implemented -------------------------------
export class Table extends AST.ASTNode {
  headers: AST.ASTNode[];
  rows: AST.ASTNode[] | null;
  
  constructor(from, to, headers, rows, options) {
		super(from, to, 's-table', options);
    this.headers = headers;
    this.rows = rows;
    // let rowBranches = this.rows.map((rowBranches, index) => console.log(rowBranches));
    // let rowBranches = this.rows.map((rowBranches, index) => rowBranches.reactElement({key: index}));
    // console.log(`%c ${JSON.stringify(headers, null, 2)}`, 'background-color: blue');
    

		// console.log(`%c ${JSON.stringify(this.headers, null, 2)}`, 'background-color: purple');
		// console.log(`%c ${JSON.stringify(this.rows[0], null, 2)}`, 'background-color: blue');

		// console.log(`%c ${this.headers}`, 'background-color: purple');
		// console.log(`%c ${this.rows}`, 'background-color: blue');
    
    // console.log(`%c ${JSON.stringify(this.headers, null, 2)}`);
    // console.log(`%c ${JSON.stringify(this.rows, null, 2)}`);
    
    // console.log("Headers");
		// console.log(`%c ${this.headers}`);
    // console.log("Rows:")
    // console.log(`%c ${this.rows}`);

		// console.log(this.headers);
		// console.log(this.rows);
  }

  static spec = Spec.nodeSpec([
    Spec.list('headers'),
    Spec.list('rows'),
  ])

  longDescription(level) {
    return `${enumerateList(this.headers, level)} in a table`;
  }

  pretty() {
    console.log("------------ Table Pretty -------------");
    
    let header = P.horz("table: ", P.sepBy(this.headers, ", ", ""));
    let prefix = "table:";
    let suffix = "end";
    let branches = P.sepBy(this.headers, ", ", "");
    let rowBranches = P.sepBy(this.rows, " ", "");
    // let rowBranches = P.sepBy(this.rows, ", ", "");
    // console.log(this.rows[0]);
    // console.log(branches);
    // console.log(rowBranches);
    return P.ifFlat(
      P.horz(prefix, " ", branches, " ", rowBranches, " ", suffix),
      P.vert(header, P.horz(INDENT, rowBranches), suffix)
    );
  }

  render(props) {
    let headerBranches = <Args>{this.headers}</Args>;
    // let headerBranches = this.headers.map((branch, index) => <th key={index} className={branch.options.bgcClassName}> {branch.reactElement()} </th>);

		let rowBranches = [];
		this.rows.forEach((aRow, index) => {
			let cellElements = [];
			// aRow.elems.forEach((cell, cellIndex) => {
			//   console.log(`%c ---------------------------`, "background-color: red");
			//   console.log(cell);
			//   cellElements.push(<td key={cellIndex}>cell.reactElement()</td>);
			// });
			// console.log(aRow);
			// let rowElement = <tr key={index} draggable="true"> <Args>{aRow.elems}</Args> </tr>
			// let rowElement = <span key={index} draggable="true" className="aRow"> {aRow.elems}</Args> </span>
			// let rowElement = <span key={index} draggable="true" className="aRow"> <Args>{cellElements}</Args> </span>
			// rowBranches.push(rowElement);
			rowBranches.push(aRow.reactElement());
		});

		// let rowBranches = this.rows;
		// rowBranches.map((aRow, index) => {
		//   aRow.reactElement({key: index});
		//   console.log(aRow);
		// });

    let columnBranches = this.headers.map((branch, index) => {
      let colType = "untyped";
      let strBranch = String(branch).split(" ");
      if (strBranch.length == 3) {
        colType = strBranch[2];
        if (colType.includes("<") || colType.includes(">")) {
          colType = "constructor";
          // let startPos = colType.indexOf('<');
          // colType = colType.substring(0, startPos);
        }
      }
      return(<col key={index} span={2} className={colType.toLowerCase()}/>);
    });

    return (
      <Node node={this} {...props}>
				<span className="blocks-table">
					<table>
						<colgroup>
							{columnBranches}
						</colgroup>
						<tr className="blocks-table-header">{headerBranches}</tr>
			{
				// rowBranches
				<Args>{this.rows}</Args>
			}
					</table>
				</span>
      </Node>
    );
  }
}

export class ATableRow extends AST.ASTNode {
	elems: AST.ASTNode[];
	
	constructor(from, to, elems, options) {
		super(from, to, 's-table-row', options);
		this.elems = elems;
	}

	static spec = Spec.nodeSpec([
		Spec.list('elems'),
	])

	longDescription(level) {
		return `${enumerateList(this.elems, level)} in a table row`;
	}

	pretty() {
    let prefix = "row:";
    console.log("TABLE ROW ___________________________")
    console.log(this.elems);
		// let suffix = "end";
    let vertBranches = P.sepBy(this.elems, ", ", ",");
    let hortBranches = P.sepBy(this.elems, ", ", ",");
		return P.ifFlat(
			P.horz(prefix, " ", hortBranches),
			P.vert(prefix, P.horz(INDENT, vertBranches))
		);
	}

	render(props) {
    let branches = this.elems.map((branch, index) => {return(branch.reactElement())});
    // this.elems.map((branch, index) => <td key={index}> {branch.reactElement()} </td>);
    
		return (
			<Node node={this} {...props}>
				{/* {branches} */}
        <Args>{this.elems}</Args>
			</Node>
		);
	}
}
// ------------------  xx  ------------ Table Render Implemented ------ xx  ----------------------
export class IfBranch extends AST.ASTNode {
  test: AST.ASTNode;
  body: AST.ASTNode;
  constructor(from, to, test, body, options) {
    super(from, to, 'if-clause', options);
    this.test = test;
    this.body = body;
  }

  static spec = Spec.nodeSpec([
    Spec.required('test'),
    Spec.required('body'),
  ])

  longDescription(level) {
    return `${this.test.describe(level)} testing with ${this.body.describe(level)} body in an if branch`;
  }

  pretty() {
    let intermediate = ":";
    let test = this.test.pretty();
    let body = this.body.pretty();
    return P.vert(P.horz(test, intermediate), P.horz(INDENT, body));
  }

  render(props) {
    return (
      <Node node={this} {...props}>
				<div className="blocks-cond-predicate">
					{this.test.reactElement()}
				</div>
        <div className="blocks-cond-row">
          <div className="blocks-cond-result">
            {this.body.reactElement()}
          </div>
        </div>
      </Node>
      // <Node node={this} {...props}>
      //   <div className="blocks-cond-row">
      //     <div className="blocks-cond-predicate">
      //       {this.test.reactElement()}
      //     </div>
      //     <div className="blocks-cond-result">
      //       {this.body.reactElement()}
      //     </div>
      //   </div>
      // </Node>
    )
  }
}

const ifPrefix = function(first_branch: IfBranch): P.Doc {
  return P.concat("if ", first_branch.pretty());
}

const ifElse = function(_else: AST.ASTNode): P.Doc {
  return P.vert("else:", P.horz(INDENT, _else.pretty()));
}

const prettyIfs = function(branches: IfBranch[], _else: AST.ASTNode | undefined, blocky: boolean): P.Doc {
  // TODO what do do if empty branches?
  let length = branches.length;
  if (length == 0) {
    throw new Error("if constructed with no branches—this should not have parsed(?)");
  }
  else if (length == 1) {
    let prefix = ifPrefix(branches[0]);
    if (_else != undefined) {
      return P.vert(prefix, ifElse(_else), "end");
    }
    else {
      return P.vert(P.concat("if ", branches[0].pretty()), "end");
    }
  }
  else {
    let prefix = ifPrefix(branches[0]);
    let suffix = "end";
    let pretty_branches = branches.slice(1, length).map(b => P.concat("else if ", b.pretty()));
    if (_else != undefined) {
      return P.vert(prefix, ...pretty_branches, ifElse(_else), suffix);
    }
    else {
      return P.vert(prefix, ...pretty_branches, suffix);
    }
  }
};

export class IfExpression extends AST.ASTNode {
  branches: IfBranch[];
  blocky: boolean;
  constructor(from, to, branches, blocky, options) {
    super(from, to, 'if-Expression', options);
    this.branches = branches;
    this.blocky = blocky;
  }

  static spec = Spec.nodeSpec([
    Spec.list('branches'),
    Spec.value('blocky'),
  ])

  longDescription(level) {
    return `${enumerateList(this.branches, level)} in an if expression`;
  }

  pretty() {
    return prettyIfs(this.branches, undefined, this.blocky);
  }

  render(props) {
    const NEWLINE = <br />
    let branches = [];
    this.branches.forEach((element, index) => {
      let span = <span key={index}>
        <DropTarget />
        {NEWLINE}
        {(element as any).reactElement()}
        {NEWLINE}
      </span>;
      branches.push(span);
    });
    branches.push(<DropTarget key={this.branches.length} />);

    return (
      <Node node={this} {...props}>
        <span className="blocks-if">
          if:
        </span>
        <div className="blocks-cond-table">
          {branches}
        </div>
        <span className="blocks-if-footer" id="blocks-style-footer">
          end
        </span>
      </Node>
    );
  }
}

export class IfElseExpression extends AST.ASTNode {
  branches: IfBranch[];
  else_branch: IfBranch;
  blocky: boolean;
  constructor(from, to, branches, else_branch, blocky, options) {
    super(from, to, 'if-else-Expression', options);
    this.branches = branches;
    this.else_branch = else_branch;
    this.blocky = blocky;
  }

  static spec = Spec.nodeSpec([
    Spec.list('branches'),
    Spec.required('else_branch'),
    Spec.value('blocky'),
  ])

  longDescription(level) {
    return `${enumerateList([this.branches, this.else_branch], level)} in an if expression`;
  }

  pretty() {
    return prettyIfs(this.branches, this.else_branch, this.blocky);
  }

  render(props) {
    const NEWLINE = <br />
    let branches = [];
    this.branches.forEach((element, index) => {
      let span = <span key={index}>
				<DropTarget key={index}/>
        {NEWLINE}
        {(element as any).reactElement()}
        {NEWLINE}
      </span>;
      branches.push(span);
    });
    branches.push(<DropTarget key={this.branches.length} />);

    return (
      <Node node={this} {...props}>
        <span className="blocks-if">
          if:
        </span>
        <div className="blocks-cond-table">
					{branches}
          {NEWLINE}
				</div>
				<span className="blocks-else">
					else:
				</span>
				<div className="blocks-cond-table">
					{NEWLINE}
          {(this.else_branch as any).reactElement()}
        </div>
        <span className="blocks-if-footer" id="blocks-style-footer">
          end
        </span>
      </Node>
    );
  }
}

export class For extends AST.ASTNode {
  iterator: AST.ASTNode;
  bindings: AST.ASTNode[];
  ann: AST.ASTNode | null;
  body: AST.ASTNode;
  block: boolean

  constructor(from, to, iterator: AST.ASTNode, bindings: ForBind[], ann, body: AST.ASTNode, blocky: boolean, options = {}) {
    super(from, to, 's-for', options);
    this.iterator = iterator;
    this.bindings = bindings;
    this.ann = ann;
    this.body = body;
    this.block = blocky;
  }

  static spec = Spec.nodeSpec([
    Spec.required('iterator'),
    Spec.list('bindings'),
    Spec.optional('ann'),
    Spec.required('body'),
    Spec.value('block'),
  ])

  longDescription(level) {
    let ann_description = (this.ann == null)? "no annotation," : `annotation ${this.ann.describe(level)},`;
    return `a for expression with iterator ${this.iterator.describe(level)}, bindings ${enumerateList(this.bindings, level)}, ${ann_description} and ${this.body.describe(level)}`;
  }

  pretty() {
    let retAnn = this.ann ? P.horz(" -> ", this.ann) : "";
    let header_ending = (this.block)? " block:" : ":";
    let header = P.ifFlat(
      P.horz("for ", this.iterator, "(", P.sepBy(this.bindings, ", ", ","), ")", retAnn, header_ending),
      P.vert(P.horz("fun ", this.iterator, "("),
             P.horz(INDENT, P.sepBy(this.bindings, ", ", ","), ")", retAnn, ":")));
    // either one line or multiple; helper for joining args together
    return P.ifFlat(
      P.horz(header, " ", this.body, " end"),
      P.vert(header,
             P.horz(INDENT, this.body),
             "end"));
  }

  render(props) {
    let name = this.iterator.reactElement();
    let body = this.body.reactElement();
    let args = <Args>{this.bindings}</Args>;
    let header_ending = <span>
      {(this.ann != null)? <>&nbsp;-&gt;&nbsp;{this.ann.reactElement()}</> : null}{this.block ? <>&nbsp;{"block"}</> : null}
    </span>;
    return (
      <Node node={this} {...props}>
        <span className="blocks-for">
          for&nbsp;{name}({args}){header_ending}:
        </span>
        <span className="blocks-for-body">
        {body}
        </span>
        <span className="blocks-for-footer" id="blocks-style-footer">
          end
        </span>
      </Node>
    );
  }
}

export class ForBind extends AST.ASTNode {
  value: AST.ASTNode;
  bind: Bind;

  constructor(from, to, bind: Bind, value: AST.ASTNode, options = {}) {
    super(from, to, 's-for-bind', options);
    this.bind = bind;
    this.value = value;
  }

  static spec = Spec.nodeSpec([
    Spec.required('bind'),
    Spec.required('value'),
  ])

  longDescription(level) {
    return `a for binding with ${(this.bind as any).describe(level)} and ${this.value.describe(level)}`;
  }

  pretty() {
    return P.horz(this.bind, " from ", this.value);
  }

  render(props) {
    return <Node node={this} {...props}>
      <span className="blocks-for-bind">
        {(this.bind as any).reactElement()}from&nbsp;{this.value.reactElement()}
      </span>
    </Node>
  }
}

export class When extends AST.ASTNode {
  test: AST.ASTNode;
  body: AST.ASTNode;
  blocky: boolean;
  constructor(from, to, test, body, blocky, options) {
    super(from, to, 's-when', options);
    this.test = test;
    this.body = body;
    this.blocky = blocky;
  }

  static spec = Spec.nodeSpec([
    Spec.required('test'),
    Spec.required('body'),
    Spec.value('blocky'),
  ])

  longDescription(level) {
    return `when statement testing ${this.test.describe(level)} with result ${this.body.describe(level)}`;
  }

  pretty() {
    let prefix = "when ";
    let intermediate = ":";
    let suffix = "end";
    let test = this.test.pretty();
    let body = this.body.pretty();
    return P.vert(P.horz(prefix, test, intermediate), P.horz(INDENT, body), suffix);
  }

  render(props) {
    return (
      <Node node={this} {...props}>
        <div className="blocks-when">
          <div className="blocks-when-header">
            <div className="blocks-cond-predicate">
            when {this.test.reactElement()} :
            </div>
            </div>
          </div>
            <div className="blocks-cond-result">
              {this.body.reactElement()}
            </div>
            <span className="blocks-when-footer" id="blocks-style-footer">
            end
            </span>
      </Node>

          //   <Node node={this} {...props}>
          //   <div className="blocks-when">
          //     when
          //     <div className="blocks-cond-predicate">
          //       {this.test.reactElement()}
          //     </div>
          //     <div className="blocks-cond-result">
          //       {this.body.reactElement()}
          //     </div>
          //   </div>
          // </Node>
    )
  }
}

export class AnnotationApp extends AST.ASTNode {
  ann: AST.ASTNode;
  args: AST.ASTNode[];

  constructor(from, to, ann: AST.ASTNode, args: AST.ASTNode[], options = {}) {
    super(from, to, 'annApp', options);
    this.ann = ann;
    this.args = args;
  }

  static spec = Spec.nodeSpec([
    Spec.required('ann'),
    Spec.list('args'),
  ])

  longDescription(level) {
    return `an application annotation with ${this.ann.describe(level)} and ${enumerateList(this.args, level)}`;
  }

  pretty() {
    return P.horz(this.ann, P.txt("<"), P.sepBy(this.args, ", ", ","), P.txt(">"));
  }

  render(props) {
		// let typeArgument = "<" + String(this.args) + ">";
    return <Node node={this} {...props}>
      <span className="blocks-a-app">{this.ann.reactElement()}
		{"<"} <Args field="args">{this.args}</Args> {">"}
      </span>
    </Node>
  }
}

export class ProvideAll extends AST.ASTNode {

	constructor(from, to, options = {}) {
		super(from, to, 'provide-stmt', options);
		console.log("%c provide all called", "background-color: blue");
  }

  static spec = Spec.nodeSpec([
  ])

  longDescription(level) {
    return `an application annotation with `;
  }

  pretty() {
    return P.horz(P.txt("provide *"));
  }

  render(props) {
		// let typeArgument = "<" + String(this.args) + ">";
		console.log("%c provide all called from render", "background-color: green");
    return <Node node={this} {...props}>
      <span>provide hi *</span>
    </Node>
  }
}
