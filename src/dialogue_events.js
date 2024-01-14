import { writeFileSync } from 'fs';
import mapObject from 'map-obj';
import { join } from 'path';
import { _hsr_root, json } from './config.js';
import { parseEffect } from './effect.js';
import { text } from './text.js';

const dia_events_display = mapObject(json(join(_hsr_root, 'ExcelOutput', 'DialogueEventDisplay.json')), (key, o) => [key, {
  title: text[o.EventTitle.Hash],
  desc: text[o.EventDesc.Hash],
  desc2: text[o.EventDetailDesc.Hash],
}]);
export const dia_events = mapObject(json(join(_hsr_root, 'ExcelOutput', 'DialogueEvent.json')), (key, o) => [key, {
  ...dia_events_display[o.EventDisplayID],
  effect: parseEffect(o.RogueEffectType, o.RogueEffectParamList),
  aeon: o.AeonOption,
  cost: o.CostType && [o.CostType, ...o.CostParamList],
  // ...o,
}]);

writeFileSync('out/dia_events.json', JSON.stringify(dia_events, null, 4));
