import { writeFileSync } from 'fs';
import mapObject from 'map-obj';
import { join } from 'path';
import { _hsr_root, _out, json, lang } from './config.js';
import { items } from './items.js';
import { extractCommonAttributes } from './lib/utils.js';
import { skills } from './skills.js';
import { text } from './text.js';

function tttV(object) {
  for (let key in object) {
    if (!isNaN(object[key].Value)) {
      object[key] = object[key].Value;
    }
  }
  object.PromotionCostList = object.PromotionCostList.map(i => items[i.ItemID].name + '*' + i.ItemNum);
  return object;
}

function extractStats(o) {
  delete o.AvatarID;
  delete o.Promotion;
  delete o.PlayerLevelRequire;
  delete o.WorldLevelRequire;
  return o;
}

const promotion = json(join(_hsr_root, 'ExcelOutput', 'AvatarPromotionConfig.json'));
export const characters = mapObject(json(join(_hsr_root, 'ExcelOutput', 'AvatarConfig.json')), (key, c) => [key, {
  id: c.AvatarID,
  tag: c.AvatarVOTag,
  name: text[c.AvatarName.Hash],
  desc: text[c.AvatarDesc.Hash],
  full: text[c.AvatarFullName.Hash],
  type: {
    base: c.AvatarBaseType,
    element: c.DamageType,
  },
  rarity: c.Rarity.startsWith('CombatPowerAvatarRarityType') ? c.Rarity.substring('CombatPowerAvatarRarityType'.length) : 'ERROR!',
  energy: c.SPNeed.Value,
  skin: {
    name: text[c.AvatarInitialSkinName.Hash],
    desc: text[c.AvatarInitialSkinDesc.Hash],
  },
  ranks: c.RankIDList,
  intro: text[c.AvatarCutinIntroText.Hash],
  rewards: c.RewardList.map(i => (items[i.ItemID]?.name ?? i.ItemID) + '*' + i.ItemNum),
  stats: extractStats(extractCommonAttributes(Object.values(promotion[c.AvatarID]).map(tttV))),
  skills: c.SkillList.map(sid => skills[sid]),
}]);
writeFileSync(join(_out, `characters${lang}.json`), JSON.stringify(characters, null, 4));
