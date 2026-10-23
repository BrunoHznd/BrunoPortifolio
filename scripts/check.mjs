import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {spawnSync} from 'node:child_process';
import {parseHTML} from 'linkedom';

const html=await fs.readFile('dist/index.html','utf8');
const {document,window}=parseHTML(html);
const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);
assert.equal(new Set(ids).size,ids.length,'IDs duplicados');
assert.equal(document.documentElement.lang,'pt-BR');
assert.equal(document.querySelectorAll('h1').length,1);
for(const el of document.querySelectorAll('[src],[href]')){
  const value=el.getAttribute('src')||el.getAttribute('href');
  if(value.startsWith('#'))assert(ids.includes(value.slice(1)),`Âncora ausente: ${value}`);
  else if(value.startsWith('./'))await fs.access(path.join('dist',value));
  if(el.getAttribute('target')==='_blank')assert(el.getAttribute('rel')?.includes('noopener'),'Link externo sem proteção');
}
for(const image of document.querySelectorAll('img'))assert(image.hasAttribute('alt'),'Imagem sem alt');
JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent);
for(const name of ['app.js','depth.js']){const r=spawnSync(process.execPath,['--check',`dist/${name}`],{encoding:'utf8'});assert.equal(r.status,0,r.stderr);}
const css=await fs.readFile('dist/style.css','utf8');
assert.equal((css.match(/\{/g)||[]).length,(css.match(/\}/g)||[]).length,'Blocos CSS desequilibrados');
assert(css.includes('prefers-reduced-motion:reduce'));
let clipboard='';const timers=new Map();let timerId=0;const frames=[];
const media=new Map();function matchMedia(query){if(!media.has(query))media.set(query,{matches:query.includes('prefers-reduced-motion'),addEventListener(){}});return media.get(query);}
// Use browser-equivalent URL hashes, which linkedom does not compute.
for(const anchor of document.querySelectorAll('a[href]'))Object.defineProperty(anchor,'hash',{get(){return new URL(this.getAttribute('href'),'https://portfolio.test').hash;}});
const context=vm.createContext({document,window,matchMedia,navigator:{clipboard:{async writeText(text){clipboard=text;}},hardwareConcurrency:8},innerHeight:900,scrollY:0,requestAnimationFrame(fn){frames.push(fn);return frames.length;},cancelAnimationFrame(){},setTimeout(fn){timers.set(++timerId,fn);return timerId;},clearTimeout(id){timers.delete(id);},addEventListener(){},console});
for(const section of document.querySelectorAll('main section[id]'))section.getBoundingClientRect=()=>({top:section.id==='inicio'?0:1000});
vm.runInContext(await fs.readFile('dist/app.js','utf8'),context,{filename:'app.js'});
function click(selector){document.querySelector(selector).dispatchEvent(new window.Event('click',{bubbles:true}));while(frames.length)frames.shift()();}
for(const [category,count] of [['app',1],['system',1],['landing',2],['all',4]]){
  click(`[data-filter="${category}"]`);
  assert.equal([...document.querySelectorAll('.project-card')].filter(c=>!c.hidden).length,count,`Filtro ${category}`);
  assert.equal(document.querySelectorAll('.filter[aria-pressed="true"]').length,1);
  assert.equal(document.querySelector('#project-count').textContent,`${count} ${count===1?'projeto':'projetos'}`);
}
click('.menu-toggle');assert.equal(document.querySelector('.menu-toggle').getAttribute('aria-expanded'),'true');assert.equal(document.querySelector('.mobile-nav').hidden,false);
click('.mobile-nav a');assert.equal(document.querySelector('.mobile-nav').hidden,true);
click('.menu-toggle');const escape=new window.Event('keydown');escape.key='Escape';document.dispatchEvent(escape);assert.equal(document.querySelector('.mobile-nav').hidden,true);
click('#copy-email');await new Promise(resolve=>setImmediate(resolve));assert.equal(clipboard,'bruno.olivcarvalho@gmail.com');assert(document.querySelector('#copy-feedback').textContent.includes('E-mail copiado'));
assert.equal(document.querySelector('#typed-text').textContent,'Do conceito à experiência.','Movimento reduzido deve preservar o texto');
console.log('OK: referências locais, âncoras, metadados, sintaxe, 4 filtros, menu, Escape, cópia de e-mail e redução de movimento.');
