import { writeFileSync } from 'fs';
import mapObject from 'map-obj';
import { join } from 'path';
import { _hsr_root, json } from './config.js';
import { text, textEN } from './text.js';

export const aeons = mapObject(json(join(_hsr_root, 'ExcelOutput', 'RogueAeonDisplay.json')), (key, value) => [key, {
  id: value.DisplayID,
  name: text[value.RogueAeonName.Hash],
  nameEN: textEN[value.RogueAeonName.Hash],
  path: text[value.RogueAeonPathName2.Hash],
  pathEN: textEN[value.RogueAeonPathName2.Hash],
}]);

writeFileSync('out/aeons.json', JSON.stringify(aeons, null, 4));