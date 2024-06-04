const translations = {
  translationCHS: {
    'EnhanceRogueBuff': '升级祝福',
    'GetRogueMiracle': '获得奇物',
    'GetRogueBuff': '获得祝福',
    'GetAllRogueBuffInGroup': '获得组内全部祝福',
    'RemoveRogueMiracle': '失去奇物',
    'RemoveRogueBuff': '失去祝福',
    'RepairRogueMiracle': '修复奇物',
    'DestroyRogueMiracle': '摧毀奇物',
    'ReplaceRogueBuff': '变换祝福',

    'TriggerBattle': '触发战斗',
    'TriggerDialogueEventList': '触发所有事件',
    'TriggerDialogueEventListByCondition': '触发条件事件',
    'TriggerRandomEventList': '触发随机事件',

    'TriggerRogueMiracleRepair': '自选修复奇物',
    'TriggerRogueMiracleSelect': '自选获得奇物',
    'TriggerRogueBuffDrop': '自选丢弃祝福',
    'TriggerRogueBuffSelect': '自选获得祝福',
    'TriggerRogueBuffReforge': '自选交换祝福',
    'TriggerRogueMiracleTrade': '自选交换奇物',

    'ChangeRogueNpcWeight': '更改NPC变量',
    'ChangeLineupData': '更改数据',
    'ChangeRogueMiracleToRogueCoin': '奇物交换碎片',

    'ReviveAvatar': '复活角色',
    'RepeatableGamble': '可重复赌博',

    'GetChessRogueCheatDice': '作弊机会',
    'GetChessRogueRerollDice': '重投机会',
    'ChangeChessRogueActionPoint': '倒计时',
    'ChangeNousValue': '认知',
    'Coin': '宇宙碎片',
  },
  translationEN: {
    'GetChessRogueCheatDice': 'Cheat',
    'GetChessRogueRerollDice': 'Reroll',
    'ChangeChessRogueActionPoint': 'Countdown',
    'ChangeNousValue': 'Cognition',
    'Coin': 'Frag',
  },
};
const translation = translations['translation' + lang];

import { lang } from '../config.js';
import { items } from '../items.js';


export function parseEffect(dia_events, type, params = []) {
  if (!type) return type;
  switch (type) {
    case 'TriggerRandomEventList':
      if (params.length % 2 !== 0) throw 'Non-even param list for chance events!';
      const entr = params.map((eid, i) => i % 2 === 0 ? [params[i + 1], dia_events[eid]] : undefined).filter(Boolean);
      const total = entr.map(a => a[0]).reduce((p, a) => p + a, 0);
      entr.forEach(e => e[0] = parseFloat((100 * e[0] / total).toFixed(2)) + '%');
      return [translation[type], entr];
    case 'TriggerDialogueEventList':
      return [translation[type], ...params.map(eid => dia_events[eid] ?? eid)];
    case 'GetItem':
      // if (params.length !== 3) throw 'GetItem param length not 3';
      // if (params[2] !== 2) throw 'GetItem last param not 2' + type + ', ' + params;
      return `+${params[1]} ${items[params[0]].name}`;
    case 'GetItemByPercent':
      return `+${params[1]}% ${items[params[0]].name}`;
    case 'GetChessRogueCheatDice':
      return `+${params[0]} ${translation[type]}`;
    case 'GetChessRogueRerollDice':
      return `+${params[0]} ${translation[type]}`;
    case 'GetCoinByLoseCoin':
      if (params.length !== 4) throw 'GetCoinByLoseCoin param length not 4';
      return `+${params[2]}%(-${params[0]}% ${translation.coin}) ${translation.coin}`;
    // case 'ChangeItemRatio':
    //   return '';
    // case 'TriggerRogueBuffSelect':
    //   if (params.length !== 3) throw 'TriggerRogueBuffSelect param length not 3';
    //   const g = buff_groups[params[0]];
    // case 'GetRogueMiracle':
    case 'ChangeChessRogueActionPoint':
      return `${params[0] < 0 ? '' : '+'}${params[0]} ${translation[type]}`;
    case 'ChangeNousValue':
      return `${params[0] < 0 ? '' : '+'}${params[0]} ${translation[type]}`;


    case 'CostHpCurrentPercent':
      if (params.length !== 1) throw 'CostHpCurrentPercent param length not 1';
      return `-${params[0]}% HP`;
    case 'CostItemValue':
      if (params.length !== 2) throw 'CostItemValue param length not 2';
      return `-${params[1]} ${items[params[0]].name}`;
    case 'CostItemPercent':
      if (params.length !== 2) throw 'CostItemPercent param length not 2';
      return `-${params[1]}% ${items[params[0]].name}`;

    case 'CostHpSpToPercent':
      if (params.length !== 2) throw 'CostHpSpToPercent param length not 2';
      return `HP<${params[0]}% SP<${params[1]}`;
  }
  return [translation[type] ?? type, ...params];
}

