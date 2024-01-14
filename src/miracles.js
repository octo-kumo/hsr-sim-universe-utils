import { writeFileSync } from 'fs';
import mapObject from 'map-obj';
import { join } from 'path';
import { _hsr_root, json } from './config.js';
import { dia_events } from './dialogue_events.js';
import { formatString } from './formatter.js';
import { parseEffect } from './parsers.js';
import { text } from './text.js';

// RogueMiracle.json
// RogueMiracleDisplay.json
// RogueMiracleEffect.json
// RogueMiracleEffectShow.json

const miracle = json(join(_hsr_root, 'ExcelOutput', 'RogueMiracle.json'));
const miracle_display = json(join(_hsr_root, 'ExcelOutput', 'RogueMiracleDisplay.json'));
const miracle_effect = mapObject(json(join(_hsr_root, 'ExcelOutput', 'RogueMiracleEffect.json')), (key, o) => {
  return [key, parseEffect(dia_events, o.MiracleEffectType, o.ParamList)];
});
console.log('miracle', Object.keys(miracle).length);
console.log('miracle_display', Object.keys(miracle_display).length);
console.log('miracle_effect', Object.keys(miracle_effect).length);
// const miracle_effect_show = json(join(_hsr_root, 'ExcelOutput', 'RogueMiracleEffectShow.json'));
const used = new Set();
export const miracles = mapObject(miracle, (key, o) => {
  const d = miracle_display[o.MiracleDisplayID];

  let effect = [miracle_effect[key]];
  used.add(key);
  for (let i = 1, skey; miracle_effect[skey = key + i.toString().padStart(2, '0')] && skey.length >= 4; i++) {
    effect.push(miracle_effect[skey]);
    used.add(skey);
  }
  effect = effect.filter(Boolean);
  // if (String(o.MiracleDisplayID) !== key) return [key, {
  //   display: o.MiracleDisplayID,
  //   broken: o.BrokenChangeMiracleID,
  //   effect,
  // }];
  // else
  return [key, {
    name: text[d.MiracleName.Hash],
    desc: formatString(text[d.MiracleDesc.Hash], d.DescParamList),
    bg: text[d.MiracleBGDesc.Hash],
    tag: text[d.MiracleTag.Hash],
    effect,
  }];
});
let diff = new Set(Object.keys(miracle_effect));
used.forEach(e => diff.delete(e));
diff.forEach(d => {
  if (!miracle_effect[d]?.type) diff.delete(d);
});
console.log(diff);
writeFileSync('out/miracles.json', JSON.stringify(miracles, null, 4));
writeFileSync('out/miracles_effect_extra.json', JSON.stringify(Object.fromEntries(Array.from(diff).map(d => [d, miracle_effect[d]])), null, 4));
