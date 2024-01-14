import { handbook_events } from '../handbook_events.js';

const eventID = '10';
const event = handbook_events[eventID];
console.log(Object.keys(handbook_events).map(k => [k, handbook_events[k].dialogue.triggers ? Object.keys(handbook_events[k].dialogue.triggers).length : 0])
  .sort((a, b) => b[1] - a[1]));
const keys = ['prompt', ...Object.keys(event.dialogue.triggers), 'ALL_TALK_END'];
const text = [event.title, ...Object.values(event.dialogue.triggers).map(e => {
  return e.lines.filter(l => Array.isArray(l)).map(l => l.join('\n')).join('\n');
}), '结束'];
let addRandom = false;
const outgoing = [event.dialogue.prompt, ...Object.values(event.dialogue.triggers)].map(ls => {
  let outlinks = Array.isArray(ls) ? ls : ls.lines;
  outlinks = outlinks.filter(l => !Array.isArray(l)).map(e => Object.entries(e).map(([k, o]) => ({
    text: `|"${k}${o.desc ? '\\n' + o.desc : ''}"|`,
    to: o.triggers ?? 'random',
  }))).flat();
  if (!Array.isArray(ls) && ls.triggers) outlinks.push({
    text: '',
    to: ls.triggers,
  });
  if (outlinks.some(o => o.to === 'random')) addRandom = true;
  return outlinks;
});
if (addRandom) {
  keys.push('random');
  text.push('随机');
}
const mermaid_code = 'flowchart TD\n' +
  keys.map((k, i) => `\t${k}("${truncate(text[i])}")`).join('\n') + '\n\n' +
  outgoing.map((a, i) => a.map(l => `\t${keys[i]} -->${l.text} ${l.to}`).join('\n')).join('\n\n');
console.log(mermaid_code);

function truncate(input) {
  if (input.length > 10) return input.substring(0, 10) + '...';
  return input;
}
