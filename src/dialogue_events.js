import { writeFileSync } from 'fs';
import mapObject from 'map-obj';
import { join } from 'path';
import { _hsr_root, json } from './config.js';
import { formatString } from './formatter.js';
import { parseEffect } from './parsers.js';
import { text } from './text.js';

const dia_events_display = mapObject(json(join(_hsr_root, 'ExcelOutput', 'DialogueEventDisplay.json')), (key, o) => [key, {
  // display: key,
  title: text[o.EventTitle.Hash],
  desc: text[o.EventDesc.Hash],
  desc2: text[o.EventDetailDesc.Hash],
}]);
export const dia_events = mapObject(json(join(_hsr_root, 'ExcelOutput', 'DialogueEvent.json')), (key, o) => {
  const d = dia_events_display[o.EventDisplayID];
  return [key, {
    // id: key,
    ...d,
    title: formatString(d?.title, ['当前命途', o.DescValue], false),
    desc: formatString(d?.desc, ['当前命途', o.DescValue], false),

    aeon: o.AeonOption,
    // effect: o.RogueEffectType && parseEffect(o.RogueEffectType, o.RogueEffectParamList),
    // cost: o.CostType && parseCost(o.CostType, o.CostParamList),
    o,
  }];
});
Object.values(dia_events).forEach(e => {
  e.effect = parseEffect(dia_events, e.o.RogueEffectType, e.o.RogueEffectParamList);
  e.cost = parseEffect(dia_events, e.o.CostType, e.o.CostParamList);
  // e.desc ??= e.effect;
  delete e.o;
});

writeFileSync('out/dia_events.json', JSON.stringify(dia_events, null, 4));
