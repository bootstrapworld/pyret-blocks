import PyretParser from './PyretParser';
import CodeMirrorBlocks from "../../../node_modules/codemirror-blocks";
require('./style.less');

const language = {
  id: 'Pyret',
  name: 'Pyret',
  description: 'The Pyret language',
  getParser() {
    return new PyretParser();
  },
  getRenderOptions() {
    return {
      // TODO: perhaps also ['functionDefinition', 'variableDefinition', 'structDefinition']?
      lockNodesOfType: ['comment']
    };
  },
};

const constructor = (container, options) => new CodeMirrorBlocks(container, options, language);
export default constructor;