import { writeFileSync } from 'fs';
import mapObject from 'map-obj';
import { join } from 'path';
import { aeons } from './aeons.js';
import { _hsr_root, _out, json, lang } from './config.js';
import { formatString } from './formatter.js';
import { text } from './text.js';

const rogue_buff = json(join(_hsr_root, 'ExcelOutput', 'RogueBuff.json'));
const maze_buff = json(join(_hsr_root, 'ExcelOutput', 'MazeBuff.json'));
const rogue_maze_buff = json(join(_hsr_root, 'ExcelOutput', 'RogueMazeBuff.json'));
export const buff_groups = mapObject(json(join(_hsr_root, 'ExcelOutput', 'RogueBuffGroup.json')), (key, value) => [key, Object.values(value).find(e => String(e) !== key)]);
const rogue_buff_type = mapObject(json(join(_hsr_root, 'ExcelOutput', 'RogueBuffType.json')), (key, o) => [key, {
  title: text[o.RogueBuffTypeTitle.Hash],
  subtitle: text[o.RogueBuffTypeSubTitle.Hash],
  hint: text[o.HintDesc.Hash],
}]);
// console.table([rogue_buff, maze_buff, rogue_maze_buff].map(a => Object.keys(a).length));

export const buffs = mapObject(rogue_buff, (key, o) => {
  const _buff = maze_buff[o['1'].MazeBuffID] ?? rogue_maze_buff[o['1'].MazeBuffID];
  // if (!aeons[o['1'].AeonID]) console.log(o);
  const buff = {
    path: aeons[o['1'].AeonID]?.path,
    levels: Object.values(_buff).sort((a, b) => a.Lv - b.Lv).map(l => ({
      name: text[l.BuffName.Hash],
      desc: formatString(text[l.BuffDesc.Hash], l.ParamList),
    })),
  };
  const extract = ['name'];
  for (let field of extract) {
    const _field = new Set(buff.levels.map(o => o[field]));
    if (_field.size !== 1) throw `Not all levels have the same field '${field}'! ${[..._field]}`;
    buff[field] = _field.values().next().value;
  }
  buff.rarity = o['1'].RogueBuffRarity;
  buff.type = rogue_buff_type[o['1'].RogueBuffType];
  buff.tags = Object.entries(o).sort((a, b) => a[0] - b[0]).map(l => l[1].RogueBuffTag);
  if (/^「(.+)」的祝福$/.test(buff.type.title)) {
    const m = buff.type.title.match(/^(「.+」)的祝福$/);
    buff.name = m[1] + buff.name;
    delete buff.type;
  }
  buff.levels = buff.levels.map(l => l.desc);
  return [key, buff];
});

writeFileSync(join(_out, `buffs${lang}.json`), JSON.stringify(buffs, null, 4));
Object.values(buff_groups).forEach(a => a.forEach((B, i) => {
  const F = Object.values(buffs).find(b => b.tags.includes(B));
  a[i] = F ? F.name + '%' + (F.tags.indexOf(B) + 1) : B;
}));
// Object.values(buff_groups).forEach(a => a.forEach((B, i) => {
//   if (typeof B === 'number') {
//     a[i] = buff_groups[B] ?? B;
//   }
// }));
// Object.entries(buff_groups).forEach(([k, a]) => buff_groups[k] = a.flat(Infinity));
writeFileSync(join(_out, `buff_groups${lang}.json`), JSON.stringify(buff_groups, null, 4));
