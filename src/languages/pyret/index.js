import PyretParser from './PyretParser';
import CodeMirrorBlocks  from "codemirror-blocks";
require('./style.less');

export const language = {
  id: 'pyret',
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

module.exports = constructor;