import PyretParser from './PyretParser';
import { CodeMirrorBlocks, Languages }  from "codemirror-blocks";
require('./style.less');

export const Pyret = Languages.addLanguage({
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
});

const constructor = (container, options) => new CodeMirrorBlocks(container, options, Pyret);
export default constructor;

module.exports = constructor;