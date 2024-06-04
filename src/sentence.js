import { writeFileSync } from 'fs';
import mapObject from 'map-obj';
import { join } from 'path';
import { _hsr_root, _out, json, lang } from './config.js';
import { text } from './text.js';

export const sentence = mapObject(json(join(_hsr_root, 'ExcelOutput', 'TalkSentenceConfig.json')), (key, value) => [key, {
  id: value.TalkSentenceID,
  name: text[value.TextmapTalkSentenceName.Hash],
  text: text[value.TalkSentenceText.Hash],
}]);

writeFileSync(join(_out, `sentence${lang}.json`), JSON.stringify(sentence, null, 4));
