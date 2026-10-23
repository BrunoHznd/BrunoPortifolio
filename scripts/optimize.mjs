import sharp from 'sharp';
import fs from 'node:fs/promises';
for (const [name,width] of [['app-dashboard',650],['app-clientes',500],['app-logo',100]]) {
  const meta=await sharp(`dist/assets/${name}.png`).metadata();
  await sharp(`dist/assets/${name}.png`).resize({width,withoutEnlargement:true}).webp({quality:85}).toFile(`dist/assets/${name}.webp`);
  console.log(name,`${meta.width}x${meta.height}`);
}
const html=await fs.readFile('dist/index.html','utf8');
await fs.writeFile('dist/index.html',html.replace(/(app-dashboard|app-clientes|app-logo)\.png/g,'$1.webp').replace('assets/social.svg','assets/social.png'));
await sharp('dist/assets/social.svg').png().toFile('dist/assets/social.png');
const ua='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';
const css=await(await fetch('https://fonts.googleapis.com/css2?family=Manrope:wght@400..800&family=Space+Grotesk:wght@400..700&display=swap',{headers:{'User-Agent':ua}})).text();
const blocks=(css.match(/@font-face\s*\{[^}]+\}/g)||[]).filter(b=>b.includes('U+0000-00FF'));
if(blocks.length!==2)throw Error('Fontes latinas não encontradas');
let index=0;const output=[];
for(const block of blocks){const url=block.match(/url\(([^)]+)\)/)[1];const name=`${index++===0?'manrope':'space-grotesk'}-latin.woff2`;const r=await fetch(url);if(!r.ok)throw Error('Falha no download de fonte');await fs.writeFile(`dist/assets/${name}`,Buffer.from(await r.arrayBuffer()));output.push(block.replace(url,`./${name}`));}
await fs.writeFile('dist/assets/fonts.css',output.join('\n'));
for(const name of await fs.readdir('dist/assets'))if(/^font-\d+\.woff2$/.test(name)||['app-dashboard.png','app-clientes.png','app-logo.png','app-relatorio.png'].includes(name))await fs.unlink(`dist/assets/${name}`);
console.log('Imagens WebP e fontes variáveis prontas.');
