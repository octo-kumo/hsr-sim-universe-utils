import { writeFileSync } from 'fs';
import mapObject from 'map-obj';
import { join } from 'path';
import { _hsr_root, _out, json, lang } from './config.js';
import { text } from './text.js';


const groups = json(join(_hsr_root, 'ExcelOutput', 'BackGroundMusicGroup.json'));
export const bgm = mapObject(json(join(_hsr_root, 'ExcelOutput', 'BackGroundMusic.json')), (key, value) => [key, {
  id: value.ID,
  group: text[groups[value.GroupID].GroupName.Hash],
  name: text[value.MusicName.Hash],
  desc: text[value.BGMDesc.Hash],
  unlock_desc: text[value.UnlockDesc.Hash],
  bpm: value.BPM,
}]);
writeFileSync(join(_out, `bgm${lang}.json`), JSON.stringify(bgm, null, 4));
