import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { _hsr_root, _out, lang } from './config.js';
import { dialogue } from './lib/dialogue.js';

// console.log('huh');
const stories = readdirSync(join(_hsr_root, 'Story', 'Mission')).map(id => ({
  id,
  stories: Object.fromEntries(readdirSync(join(_hsr_root, 'Story', 'Mission', id)).map(f => [f.replace('.json', ''), dialogue(JSON.parse(readFileSync(join(_hsr_root, 'Story', 'Mission', id, f)).toString()))])),
}));
writeFileSync(join(_out, `stories${lang}.json`), JSON.stringify(stories, null, 4));
