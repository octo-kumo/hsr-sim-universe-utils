import { writeFileSync } from 'fs';
import mapObject from 'map-obj';
import { join } from 'path';
import { _hsr_root, _out, json, lang } from './config.js';
import { text } from './text.js';

const purpose = json(join(_hsr_root, 'ExcelOutput', 'ItemPurpose.json'));

export const items = mapObject(json(join(_hsr_root, 'ExcelOutput', 'ItemConfig.json')), (key, value) => [key, {
  id: value.ID,
  type: value.ItemMainType,
  subtype: value.ItemSubType,
  rarity: value.Rarity,
  purpose: value.PurposeType && text[purpose[value.PurposeType].PurposeText.Hash],
  name: text[value.ItemName.Hash],
  desc: text[value.ItemDesc.Hash],
  bg: text[value.ItemBGDesc.Hash],
}]);

writeFileSync(join(_out, `items${lang}.json`), JSON.stringify(items, null, 4));
