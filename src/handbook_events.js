import { writeFileSync } from 'fs';
import stringify from 'json-stringify-pretty-compact';
import mapObject from 'map-obj';
import { join } from 'path';
import { _hsr_root, _out, json, lang } from './config.js';
import { dialogue } from './lib/dialogue.js';
import { text } from './text.js';


// console.log(sentence);
const eventTypes = mapObject(json(join(_hsr_root, 'ExcelOutput', 'RogueHandBookEventType.json')), (key, o) => [key, {
  id: o.RogueHandBookEventType,
  title: text[o.RogueEventTypeTitle.Hash],
}]);

const data = json(join(_hsr_root, 'ExcelOutput', 'RogueHandBookEvent.json'));
const rewards = json(join(_hsr_root, 'ExcelOutput', 'RewardData.json'));


export const handbook_events = mapObject(data, (k, d) => [k, {
  id: d.EventID,
  title: text[d.EventTitle.Hash],
  type: text[d.EventType.Hash],
  reward: rewards[d.EventReward],
  in: d.EventTypeList.map(i => eventTypes[i].title),
  dialogue: dialogue(json(join(_hsr_root, d.DialoguePath))),
}]);
writeFileSync(join(_out, `handbook_events${lang}.json`), stringify(handbook_events));
