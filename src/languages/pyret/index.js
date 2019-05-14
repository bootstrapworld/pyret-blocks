import PyretParser from './PyretParser';
require('./style.less');

export default 
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
  };
