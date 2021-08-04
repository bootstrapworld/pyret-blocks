import {getKarmaConfig} from 'codemirror-blocks/lib/toolkit/karma';

module.exports = (config: any) => {
  config.set(getKarmaConfig(config, __dirname));
}