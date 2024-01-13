import { readFileSync, writeFileSync } from 'fs';
import mapObject from 'map-obj';
import { join } from 'path';
import { _hsr_root } from './config.js';

const p = P => JSON.parse(readFileSync(P).toString());
const text = p(join(_hsr_root, 'TextMap', 'TextMapCHS.json'));

const sentence = mapObject(p(join(_hsr_root, 'ExcelOutput', 'TalkSentenceConfig.json')), (key, value) => [key, {
  id: value.TalkSentenceID,
  name: text[value.TextmapTalkSentenceName.Hash],
  text: text[value.TalkSentenceText.Hash],
}]);
// console.log(sentence);
const type = mapObject(p(join(_hsr_root, 'ExcelOutput', 'RogueHandBookEventType.json')), (key, o) => [key, {
  id: o.RogueHandBookEventType,
  title: text[o.RogueEventTypeTitle.Hash],
}]);

const data = p(join(_hsr_root, 'ExcelOutput', 'RogueHandBookEvent.json'));
const rewards = p(join(_hsr_root, 'ExcelOutput', 'RewardData.json'));
const dia_events = mapObject(p(join(_hsr_root, 'ExcelOutput', 'DialogueEvent.json')), (key, o) => [key, {
  effect: [o.RogueEffectType, ...o.RogueEffectParamList],
  aeon: o.AeonOption,
  cost: o.CostType && [o.CostType, ...o.CostParamList],
  ...o,
}]);

const not_supported = new Set();

function dialogue(dialogue) {
  dialogue = dialogue.OnStartSequece.map(sequence => {
    const meta = {};
    const t = {
      lines: sequence.TaskList.map(task => {
        switch (task['$type']) {
          case 'RPG.GameCore.WaitCustomString': // CustomString.value: string
            meta.on = task.CustomString.Value;
          case 'RPG.GameCore.SetAllRogueDoorState': // TaskEnabled: boolean
          case 'RPG.GameCore.SetRogueRoomFinish': // TaskEnabled: boolean
          case 'RPG.GameCore.FinishLevelGraph': // MakeOwnerEntityDie: boolean
          case 'RPG.GameCore.SwitchUIMenuBGM': // ShouldStop: boolean | StateName: string
          case 'RPG.GameCore.ShowRogueTalkUI':
          case 'RPG.GameCore.ShowRogueTalkBg': //TalkBgID
          case 'RPG.GameCore.WaitRogueSimpleTalkFinish':
          case 'RPG.GameCore.AdvNpcFaceToPlayer':
          case 'RPG.GameCore.WaitPerformanceEnd':
            return undefined;
            return undefined;
          case 'RPG.GameCore.WaitDialogueEvent':
            return task.DialogueEventList ?? 'NO EVENT LIST';
          case 'RPG.GameCore.PlayAndWaitRogueSimpleTalk':
          case 'RPG.GameCore.PlayRogueSimpleTalk':
            return task.SimpleTalkList.map(i => sentence[String(i.TalkSentenceID)].text).join('\n');
          case 'RPG.GameCore.PlayOptionTalk':
          case 'RPG.GameCore.PlayRogueOptionTalk':
            return task.OptionList.map(i => ({
              choice: i.OptionTextmapID && text[i.OptionTextmapID.Hash],
              text: i.TalkSentenceID && sentence[String(i.TalkSentenceID)].text,
              triggers: i.TriggerCustomString,
              ...dia_events[i.DialogueEventID],
            }));
        }
        return null;
      }).filter(a => !!a),
    };
    return Object.assign(t, meta);
  }).filter(a => a.lines.length > 0);
  dialogue.forEach(d=>{
    d.lines.forEach(line=>{
      if(line instanceof Array){
        line.forEach(l=>{
          if(l.triggers){
            l.triggers =
          }
        })
      }
    })
  })
  return dialogue;
}

export function parseHandbookEvents() {
  const events = Object.values(data).map(d => ({
    id: d.EventID,
    title: text[d.EventTitle.Hash],
    type: text[d.EventType.Hash],
    reward: rewards[d.EventReward],
    in: d.EventTypeList.map(i => type[i].title),
    dialogue: dialogue(p(join(_hsr_root, d.DialoguePath))),
  }));

  writeFileSync('out.json', JSON.stringify(events, null, 4));

  console.log(not_supported);
}
