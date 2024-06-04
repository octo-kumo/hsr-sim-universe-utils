import { writeFileSync } from 'fs';
import mapObject from 'map-obj';
import { join } from 'path';
import { _hsr_root, _out, json, lang } from './config.js';
import { formatString } from './formatter.js';
import { text } from './text.js';

export const extra_effects = mapObject(json(join(_hsr_root, 'ExcelOutput', 'ExtraEffectConfig.json')), (key, o) => [key, {
  id: o.ExtraEffectID,
  name: text[o.ExtraEffectName.Hash],
  desc: formatString(text[o.ExtraEffectDesc.Hash], o.DescParamList),
  type: o.ExtraEffectType,
}]);
writeFileSync(join(_out, `extra_effect${lang}.json`), JSON.stringify(extra_effects, null, 4));
