import mapObject from 'map-obj';
import { join } from 'path';
import { _hsr_root, json } from './config.js';

export const buff_groups = mapObject(json(join(_hsr_root, 'ExcelOutput', 'RogueBuffGroup.json')), (key, value) => [key, value.ADJICNNJFEM]);

export function parseEffect(name = '', params = []) {
  switch (name) {
    case 'TriggerRogueBuffSelect':
      if (params.length !== 3) throw 'TriggerRogueBuffSelect param length not 3';
      const g = buff_groups[params[0]];

  }
  return [name, ...params];
}
