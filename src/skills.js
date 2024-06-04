// ExcelOutput\AvatarSkillConfig.json
import { writeFileSync } from 'fs';
import mapObject from 'map-obj';
import { join } from 'path';
import { _hsr_root, _out, json, lang } from './config.js';
import { extra_effects } from './extra_effect.js';
import { formatString } from './formatter.js';
import { extractCommonAttributes } from './lib/utils.js';
import { text } from './text.js';

function filterNull(value) {
  if (value === -1) return undefined;
  return value ?? undefined;
}

export const skills = mapObject(json(join(_hsr_root, 'ExcelOutput', 'AvatarSkillConfig.json')), (key, o) => [key, extractCommonAttributes(Object.values(o).map(s => ({
  id: s.SkillID,
  name: text[s.SkillName.Hash],
  tag: text[s.SkillTag.Hash],
  type: { skill: text[s.SkillTypeDesc.Hash], attack: s.AttackType, effect: s.SkillEffect },
  desc: formatString(text[s.SkillDesc.Hash], s.ParamList),
  sdesc: formatString(text[s.SimpleSkillDesc.Hash], s.SimpleParamList),
  needs: formatString(text[s.SkillNeed.Hash], s.ParamList),
  maxLevel: s.MaxLevel,
  triggerKey: s.SkillTriggerKey,

  skillTree: s.RatedSkillTreeID,
  ratedRank: s.RatedRankID,
  extraEffects: s.ExtraEffectIDList.map(eid => extra_effects[eid]),
  simpleExtraEffects: s.SimpleExtraEffectIDList.map(eid => extra_effects[eid]),
  weakness: {
    type: s.StanceDamageType,
    target: s.ShowStanceList[0].Value,
    spread: s.ShowStanceList[2].Value,
    all: s.ShowStanceList[1].Value,
  },
  energy: { recovers: filterNull(s.SPBase?.Value), needs: filterNull(s.SPNeed?.Value) },
  skillPoint: {
    needs: filterNull(s.BPNeed?.Value),
    adds: filterNull(s.BPAdd?.Value),
    multiply: s.SPMultipleRatio?.Value,
  },
  skillCombo: filterNull(s.SkillComboValueDelta?.Value),
  initCoolDown: filterNull(s.InitCoolDown?.Value),
  coolDown: filterNull(s.CoolDown?.Value),
  delay: s.DelayRatio.Value,
  ...s,
  SkillID: undefined,
  SkillName: undefined,
  SkillTag: undefined,
  SkillTypeDesc: undefined,
  AttackType: undefined,
  SkillEffect: undefined,
  SkillDesc: undefined,
  SimpleSkillDesc: undefined,
  SkillNeed: undefined,
  MaxLevel: undefined,
  SkillTriggerKey: undefined,
  RatedSkillTreeID: undefined,
  RatedRankID: undefined,
  ExtraEffectIDList: undefined,
  ShowStanceList: undefined,
  SPBase: undefined,
  SPNeed: undefined,
  BPNeed: undefined,
  BPAdd: undefined,
  SkillComboValueDelta: undefined,
  ParamList: undefined,
  SimpleParamList: undefined,
  InitCoolDown: undefined,
  SPMultipleRatio: undefined,
  CoolDown: undefined,
  StanceDamageType: undefined,
  SimpleExtraEffectIDList: undefined,
  DelayRatio: undefined,

//ignored
  Level: undefined,
  SkillIcon: undefined,
  UltraSkillIcon: undefined,
  LevelUpCostList: undefined,
  ShowDamageList: undefined,
  ShowHealList: undefined,
})))]);
writeFileSync(join(_out, `skills${lang}.json`), JSON.stringify(skills, null, 4));
