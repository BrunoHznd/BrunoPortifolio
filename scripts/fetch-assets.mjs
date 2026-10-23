import fs from 'node:fs/promises';
const assets = [
 ['https://appclima.com.br/TelaPrincipal.png','app-dashboard.png'],
 ['https://appclima.com.br/Cadastro%20Intuitivo.png','app-clientes.png'],
 ['https://appclima.com.br/RegistroFoto.png','app-relatorio.png'],
 ['https://appclima.com.br/logo.png','app-logo.png'],
 ['https://gbclimatizacao.com/assets/logo-gb.webp','gb-logo.webp'],
 ['https://gbclimatizacao.com/assets/about-gb.webp','gb-tecnico.webp']
];
await Promise.all(assets.map(async ([url,name])=>{const r=await fetch(url);if(!r.ok)throw Error(`${name}: ${r.status}`);await fs.writeFile(`dist/assets/${name}`,Buffer.from(await r.arrayBuffer()));console.log(name)}));
const css=await (await fetch('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap',{headers:{'User-Agent':'Mozilla/5.0'}})).text();
let i=0;const fontCss=[];for(const block of css.match(/@font-face\s*\{[^}]+\}/g)||[]){const match=block.match(/url\(([^)]+)\)/);if(!match)continue;const name=`font-${i++}.woff2`;const r=await fetch(match[1]);await fs.writeFile(`dist/assets/${name}`,Buffer.from(await r.arrayBuffer()));fontCss.push(block.replace(match[1],`./${name}`));}await fs.writeFile('dist/assets/fonts.css',fontCss.join('\n'));
const tree=await (await fetch('https://api.github.com/repos/BrunoHznd/Projeto---Lab.-Multiplataforma/git/trees/BrunoDev?recursive=1')).json();
console.log('DOCUMENTATION',tree.tree?.filter(x=>/readme|package.json|pubspec.yaml|\.csproj$|pom.xml/i.test(x.path)).map(x=>x.path).slice(0,40));
