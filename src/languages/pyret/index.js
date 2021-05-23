import PyretParser from './PyretParser';
import { CodeMirrorBlocks, Languages }  from "codemirror-blocks";
require('./style.less');

let parser = new PyretParser();

export const Pyret = Languages.addLanguage({
  id: 'pyret',
  name: 'Pyret',
  description: 'The Pyret language',
  parse: parser.parse,
  getExceptionMessage: parser.getExceptionMessage,
  getASTNodeForPrimitive: parser.getASTNodeForPrimitive,
  getLiteralNodeForPrimitive: parser.getLiteralNodeForPrimitive,
  //primitives: [],
  primitivesFn() {
    return this.primitives;
  },
  getRenderOptions() {
    return {
      // TODO: perhaps also ['functionDefinition', 'variableDefinition', 'structDefinition']?
      lockNodesOfType: ['comment']
    };
  },
});

const constructor = (container, options) => new CodeMirrorBlocks(container, options, Pyret);
export default constructor;