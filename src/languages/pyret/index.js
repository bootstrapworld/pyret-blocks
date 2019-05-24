import PyretParser from './PyretParser';
import CodeMirrorBlocks, {store as Store} from "../../../node_modules/codemirror-blocks";
require('./style.less');

export const language = {
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

console.log(language);
console.log(language.getParser());

export const store = Store.store;

const constructor = (container, options) => new CodeMirrorBlocks(container, options, language);
export default constructor;