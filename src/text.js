import mapObject from 'map-obj';
import { join } from 'path';
import { _hsr_root, json } from './config.js';

export const text = mapObject(json(join(_hsr_root, 'TextMap', 'TextMapCHS.json')), (key, value) => [
  key, process(value),
]);
export const textEN = mapObject(json(join(_hsr_root, 'TextMap', 'TextMapEN.json')), (key, value) => [
  key, process(value),
]);

function process(text) {
  return text.replace(/<\/?unbreak>/g, '')
    .replace(/\\n/g, '\n')
    .replace(/<\/?u>/g, '')
    .replace(/<\/?i>/g, '')
    .replace(/ /g, '')
    .replace(/<\/?color(?:=#[a-fA-F0-9]{6,8})?>/g, '');
}
