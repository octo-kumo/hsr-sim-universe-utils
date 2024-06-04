import { existsSync, readFileSync } from 'fs';
import mapObject from 'map-obj';
import { join } from 'path';
import { aeons } from '../aeons.js';
import { _hsr_root } from '../config.js';
import { dia_events } from '../dialogue_events.js';
import { sentence } from '../sentence.js';
import { text } from '../text.js';

const missions = mapObject(JSON.parse(readFileSync(join(_hsr_root, 'ExcelOutput', 'SubMission.json')).toString()), (k, o) => [k, {
  id: o.SubMissionID,
  text: text[o.TargetText.Hash],
  desc: text[o.DescrptionText.Hash],
}]);

export function dialogue(dialogue) {
  const events = [];
  dialogue = dialogue.OnStartSequece.map(sequence => {
    const meta = {};
    const t = {
      lines: sequence.TaskList.map(task => {
        switch (task['$type']) {
          case 'RPG.GameCore.WaitCustomString': // CustomString.value: string
            meta.on = task.CustomString.Value;
            return undefined;
          case 'RPG.GameCore.TriggerCustomString':
            // if (meta.triggers && !(
            //   task.CustomString.Value === 'DialogueFinished' && meta.triggers === 'ALL_TALK_END'
            // )) throw 'TriggerCustomString: meta.triggers already set ' + meta.triggers + ', ' + task.CustomString.Value;
            meta.triggers ??= [];
            meta.triggers.push(task.CustomString.Value);
            return undefined;
          case 'RPG.GameCore.FinishLevelGraph':
            // if (meta.triggers && !(
            //   meta.triggers === 'DialogueFinished'
            // )) throw 'FinishLevelGraph: meta.triggers already set ' + meta.triggers;
            meta.triggers ??= [];
            meta.triggers.push('ALL_TALK_END');
            return undefined;
          case 'RPG.GameCore.WaitDialogueEvent':
            events.push({
              // ...task,
              ...Object.fromEntries(task.DialogueEventList.filter(o => o.DialogueEventID).map(o => [o.SuccessCustomString ?? 'FAIL:' + o.FailureCustomString, {
                ...dia_events[o.DialogueEventID],
              }])),
            });
            return undefined;
          case 'RPG.GameCore.WaitPerformanceEnd':
          // meta.onEnd = 'WaitPerformanceEnd';
          // return undefined;
          case 'RPG.GameCore.WaitRogueSimpleTalkFinish':
          // meta.onFinish = 'WaitRogueSimpleTalkFinish';
          // return undefined;
          case 'RPG.GameCore.SetAllRogueDoorState': // TaskEnabled: boolean
          case 'RPG.GameCore.SetRogueRoomFinish': // TaskEnabled: boolean
          // case 'RPG.GameCore.FinishLevelGraph': // MakeOwnerEntityDie: boolean
          case 'RPG.GameCore.SwitchUIMenuBGM': // ShouldStop: boolean | StateName: string
          case 'RPG.GameCore.ShowRogueTalkUI':
          case 'RPG.GameCore.ShowRogueTalkBg': //TalkBgID
          case 'RPG.GameCore.AdvNpcFaceToPlayer':
            return undefined;
          case 'RPG.GameCore.PlayAndWaitRogueSimpleTalk':
          case 'RPG.GameCore.PlayRogueSimpleTalk':
            return task.SimpleTalkList.map(i => sentence[i.TalkSentenceID].text);
          case 'RPG.GameCore.PlayOptionTalk':
          case 'RPG.GameCore.PlayRogueOptionTalk':
            return task.OptionList.map(i => ({
              text: (i.TalkSentenceID && sentence[i.TalkSentenceID].text) ?? (i.OptionTextmapID && text[i.OptionTextmapID.Hash]),
              triggers: [i.TriggerCustomString],
              ...dia_events[i.DialogueEventID],
            })).reduce((acc, value) => {
              let c = { ...value };
              delete c.aeon;
              delete c.text;
              delete c.title;
              delete c.display;
              acc[(value.aeon ? `「${Object.values(aeons).find(a => a.pathEN.replace(/\s/g, '') === value.aeon).path}」 ` : '') + value.text] = c;
              return acc;
            }, {});
          case 'RPG.GameCore.PlayTimeline':
            let p = join(_hsr_root, task.TimelineName.replace('.playable', '.json'));
            if (existsSync(p)) {
              const insert = JSON.parse(readFileSync(p).toString());
              let d = dialogue(insert);
              console.log(d);
              return d;
            } else {
              let match = task.TimelineName?.match(/\D+(\d+)(\d{2})\.playable$/);
              const id = match?.[1];
              const play = match?.[2];
              if (!missions[id]) return 'PLAY::' + task.TimelineName;
              return { ...missions[id], play };
            }
        }
        return null;
      }).filter(Boolean),
    };
    if (Object.keys(meta).length === 0) return t;
    return Object.assign(t, meta);
  }).filter(a => a.lines.length > 0);
  if (dialogue.filter(d => !d.on).length !== 1) {
    // throw 'There is a non single prompt count!';
    return dialogue;
  }
  let names = events.map(e => Object.keys(e)).flat();
  if (names.length !== new Set(names).size) throw 'Duplicate event id! ' + names;
  dialogue = {
    prompt: dialogue.find(d => !d.on),
    events: Object.fromEntries(events.map(e => Object.entries(e)).flat()),
    triggers: Object.fromEntries(dialogue.filter(d => d.on).map(({ on, ...rest }) => [
      on, rest,
    ])),
  };
  Object.keys(dialogue.events).forEach(key => {
    if (key.includes('ALL_TALK_END')) return;
    if (!dialogue.triggers[key]) throw 'Event exists, but not trigger! ' + key;
    const noneExist = Object.keys(dialogue.events[key]).every(p => !Object.keys(dialogue.triggers[key]).includes(p));
    if (!noneExist) throw 'Property overlap between event and dialogue!' + key;
    dialogue.triggers[key] = { ...dialogue.triggers[key], ...dialogue.events[key] };
    delete dialogue.events[key];
  });
  if (Object.keys(dialogue.prompt).length === 1) dialogue.prompt = dialogue.prompt.lines;
  if (Object.keys(dialogue.events).length === 0) delete dialogue.events;
  if (Object.keys(dialogue.triggers).length === 0) delete dialogue.triggers;
  // dialogue.prompt.forEach(d => {
  //   d.lines.forEach(line => {
  //     if (line instanceof Object) {
  //       Object.values(line).forEach(l => {
  //         if (l.triggers) {
  //           l.triggers = dialogue.triggers[l.triggers];
  //         }
  //       });
  //     }
  //   });
  // });
  return dialogue;
}
