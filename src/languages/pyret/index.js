import PyretParser from './PyretParser';
import {Languages} from '../../../node_modules/codemirror-blocks';
const {addLanguage} = Languages;
require('./style.less');

export default addLanguage(
  {
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
  });
