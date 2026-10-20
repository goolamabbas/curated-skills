import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {Marked} from 'marked';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const out=path.join(root,'_site');
const esc=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const repo='https://github.com/goolamabbas/curated-skills';
const siteUrl='https://goolamabbas.github.io/curated-skills/';
const skills=[
 {id:'minto',name:'Minto',category:'Clearer arguments',hook:'Find the point.\nBuild the argument.',example:1},
 {id:'xray',name:'Xray',category:'Evidence & incentives',hook:'Look beyond\nthe headline.',example:0},
 {id:'agents-md-author',name:'AGENTS.md Author',category:'Better agent instructions',hook:'Keep the rules\nthat help.',example:0},
 {id:'github-pages-guide',name:'GitHub Pages Guide',category:'Educational websites',hook:'Make your repository\neasier to understand.',example:1},
 {id:'pplx-decision',guideSource:'docs/pplx-decision/guide.md',sourceOrder:true,name:'Perplexity Decisions',category:'Application decisions',hook:'Turn context into\nstructured judgments.',example:0}
];
function list(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?list(path.join(dir,e.name)):[path.join(dir,e.name)]);}
const workedExampleSource='docs/pplx-decision/worked-example.md';
const comparisonSource='docs/pplx-decision/model-comparison.md';
const documentationPages=new Map([
 ['docs/pplx-decision/guide.md','skills/pplx-decision/index.html'],
 [comparisonSource,'skills/pplx-decision/model-comparison.html'],
 [workedExampleSource,'skills/pplx-decision/worked-example.html']
]);
const sources=[...list(path.join(root,'skills')).filter(f=>f.endsWith('.md')),...[...documentationPages.keys()].map(rel=>path.join(root,rel))];
// Reader documentation is separate from the installable skill; records are not published.
const pageFor=rel=>documentationPages.has(rel)?documentationPages.get(rel):rel.endsWith('/README.md')?rel.replace(/README\.md$/,'index.html'):rel==='README.md'?'index.html':rel.replace(/\.md$/,'.html');
const relLink=(current,dest)=>path.posix.relative(path.posix.dirname(current),dest)||path.posix.basename(dest);
function write(dest,data){fs.mkdirSync(path.dirname(path.join(out,dest)),{recursive:true});fs.writeFileSync(path.join(out,dest),data);}
// Rebuild generated output from scratch so retired pages and downloads cannot linger.
fs.rmSync(out,{recursive:true,force:true});
fs.mkdirSync(out,{recursive:true});
const docs=new Set([...sources.map(f=>path.relative(root,f)),'ATTRIBUTION.md','README.md']);
function render(text,source,current){
 const toc=[],ids=new Map();
 const md=new Marked({gfm:true});
 const renderer={
 heading({tokens,depth}){const body=this.parser.parseInline(tokens);const slug=body.replace(/<[^>]+>/g,'').toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu,'').trim().replace(/\s+/g,'-');const count=ids.get(slug)||0;ids.set(slug,count+1);const id=count?`${slug}-${count}`:slug;if(depth===2 && body!=='License')toc.push({id,label:body});return `<h${depth} id="${id}">${body}</h${depth}>\n`;},
 code({text,lang}){return `<div class="code-wrap"><div class="code-head"><span>${lang==='text'?'Prompt to try':'Source example'}</span>${lang==='text'?'<button class="copy" type="button">Copy prompt</button>':''}</div><pre><code>${esc(text)}</code></pre></div>`;},
 link({href,title,tokens}){let label=this.parser.parseInline(tokens);if(href.startsWith(siteUrl)){const target=new URL(href);const dest=target.pathname.slice(new URL(siteUrl).pathname.length)||'index.html';return `<a href="${esc(relLink(current,dest)+target.search+target.hash)}">${label}</a>`;}if(/^https?:/.test(href) && /\.(?:zip|tar\.gz|tgz)(?:[?#]|$)/i.test(href))return `<a href="${esc(href)}">${label}</a>`;if(/^https?:/.test(href))return `<a href="${esc(href)}" target="_blank" rel="noopener noreferrer">${label} <span class="external" aria-label="opens in a new tab">↗</span></a>`;let [file,fragment]=href.split('#');let target=file?path.posix.normalize(path.posix.join(path.posix.dirname(source),file)):source;let url=docs.has(target)?relLink(current,pageFor(target)):relLink(current,target);if(fragment)url+='#'+fragment;return `<a href="${esc(url)}">${label}</a>`;}
 };md.use({renderer});
 let html=md.parse(text).replace(/<table>/g,'<div class="table-scroll" role="region" aria-label="Comparison table" tabindex="0"><table>').replace(/<\/table>/g,'</table></div>');return {html,toc};
}
function shell(title,body,current='index.html',description='Reusable approaches for clearer arguments, thoughtful news analysis, better agent instructions, educational websites, and application decisions.'){
 const home=relLink(current,'index.html'),asset=n=>relLink(current,n);
 return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(title)} · Curated Skills</title><meta name="description" content="${esc(description)}"><meta property="og:title" content="${esc(title)} · Curated Skills"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${esc(new URL(current,siteUrl).href)}"><link rel="icon" href="${asset('favicon.svg')}" type="image/svg+xml"><link rel="stylesheet" href="${asset('style.css')}"><script src="${asset('app.js')}" defer></script></head><body><a class="skip" href="#main">Skip to content</a><div class="wrap"><header class="header"><a class="brand" href="${home}"><span class="mark" aria-hidden="true">c.</span>Curated Skills</a><nav class="nav" aria-label="Main navigation"><a href="${home}#skills">Explore skills</a><a href="${home}#installation">Install</a><a href="${repo}" target="_blank" rel="noopener noreferrer">GitHub <span aria-label="opens in a new tab">↗</span></a></nav></header><main id="main">${body}</main><footer class="footer"><div>Selected, adapted & maintained by Yusuf Goolamabbas.<br>A growing collection. Use what helps.</div><nav aria-label="Footer"><a href="${asset('ATTRIBUTION.html')}">Attribution</a><a href="${asset('LICENSE')}">MIT license</a><a href="${repo}" target="_blank" rel="noopener noreferrer">Repository ↗<span class="status"> (opens in a new tab)</span></a></nav></footer></div><p id="copy-status" class="status" role="status" aria-live="polite"></p></body></html>`;
}
const collection=fs.readFileSync(path.join(root,'README.md'),'utf8');
const installation=collection.split('## Installation\n\n')[1].split('\n## Usage')[0];
if(!installation)throw Error('Missing installation section');
const mintoGuide=fs.readFileSync(path.join(root,'skills/minto/README.md'),'utf8');
const workedExample=mintoGuide.split('## Before and after\n\n')[1].split('## Get a better result')[0];
const details=skills.map(skill=>{const rel=skill.guideSource||`skills/${skill.id}/README.md`;const md=fs.readFileSync(path.join(root,rel),'utf8');const intro=md.split('\n\n')[1];const prompts=[...md.matchAll(/```text\n([\s\S]*?)\n```/g)].map(m=>m[1]);if(!prompts[skill.example])throw Error(`Missing example for ${skill.id}`);return {...skill,rel,md,intro,prompt:prompts[skill.example]};});
let cards=details.map(s=>`<article class="card"><p class="eyebrow">${s.category}</p><h3>${s.name}</h3><p class="card-hook">${s.hook.replace('\n',' ')}</p><p>${esc(s.intro)}</p><div class="name">Ask for <code>${s.id}</code></div><div class="card-links"><a href="skills/${s.id}/index.html">Read the guide →</a><a href="skills/${s.id}/index.html#${s.sourceOrder?'choose-a-starting-point':'try-it'}">${s.sourceOrder?'Choose a prompt':'See an example'} →</a></div></article>`).join('');
const home=`<section class="hero"><p class="eyebrow">A collection by Yusuf Goolamabbas</p><h1>${skills.length} skills for<br><em>your AI agent.</em></h1><p class="lead">Structure an argument, examine a news story, improve AGENTS.md, build an educational website, or develop an application with Perplexity Decisions. Choose a skill, install its folder, and ask for it in plain language.</p><div class="actions"><a class="button" href="#skills">Find a skill →</a><a class="text-link" href="#installation">Ready to install?</a></div></section><aside class="intro-strip"><strong>What is a skill?</strong><p>A skill is a folder of instructions for a particular task. These skills are shared as-is: use your judgment when reviewing the output. Results depend on the model, your inputs, and the tools available to your agent.</p></aside><section class="section" id="skills"><div class="section-head"><p class="eyebrow">Skills</p><h2>What are you working on?</h2><p>Each skill stands on its own. Start with the problem you recognize, not the whole collection.</p></div><div class="cards">${cards}</div></section><section class="section"><p class="eyebrow">Minto in practice</p><h2>A clearer recommendation.</h2><div class="article worked-example">${render(workedExample,'skills/minto/README.md','index.html').html}</div><a href="skills/minto/index.html">Explore Minto →</a></section><section class="section" id="installation"><p class="eyebrow">Get started</p><h2>Choose one. Keep the whole folder.</h2><div class="article">${render(installation,'README.md','index.html').html}</div><div class="actions"><a class="button" href="${repo}" target="_blank" rel="noopener noreferrer">Open the repository ↗<span class="status"> (opens in a new tab)</span></a><a href="${repo}/archive/refs/heads/main.zip">Download the collection ZIP</a></div><div class="callout"><p><strong>Once installed, ask in plain language.</strong></p><p>Ask: <code>Use the &lt;skill&gt; skill to …</code>, replacing <code>&lt;skill&gt;</code> with its slug. Each guide has ready-to-copy prompts.</p></div></section>`;
write('index.html',shell(`${skills.length} skills for your AI agent`,home));
for(const s of details){const current=pageFor(s.rel);let body=s.md.replace(/^# .+\n\n/,'');body=body.slice(s.intro.length).trim();
 if(s.sourceOrder){
  const rendered=render(body,s.rel,current);
  // Preserve previously shared section links while keeping the maintained guide reading order.
  const aliases={
   'choose-a-starting-point':['try-it','copyable-examples','what-to-provide','what-to-expect'],
   'perplexity-decisions-and-typesafejev':['jev-typesafe-and-perplexity-decisions']
  };
  for(const [target,ids] of Object.entries(aliases)){
   const heading=`<h${target==='choose-a-starting-point'?2:3} id="${target}">`;
   if(!rendered.html.includes(heading))throw Error(`Missing alias target ${target}`);
   rendered.html=rendered.html.replace(heading,ids.map(id=>`<span id="${id}"></span>`).join('')+heading);
  }
  const links=rendered.toc.map(x=>`<a href="#${x.id}">${x.label}</a>`).join('');
  const content=`<div class="breadcrumb"><a href="../../index.html#skills">← All skills</a> / ${s.name}</div><header class="guide-hero"><p class="eyebrow">${s.category}</p><h1>${s.name}</h1><p class="lead">${esc(s.intro)}</p><div class="actions"><a class="button" href="#what-is-a-decision-model">Start with the primer ↓</a><a class="text-link" href="#install-this-skill">Install this skill</a><a class="text-link" href="#choose-a-starting-point">Choose a prompt</a><a class="text-link" href="model-comparison.html">Compare Jev, Standard, and Flash →</a><a class="text-link" href="worked-example.html">Follow the worked example →</a></div></header><div class="guide-layout"><aside class="toc" aria-label="On this page"><p>In this guide</p>${links}</aside><article class="article beginner-guide"><details class="mobile-contents"><summary>In this guide</summary>${links}</details>${rendered.html}</article></div>`;
  write(current,shell(s.name,content,current,s.intro));
  continue;
 }
 const existingInstall=body.match(/^## Install and invoke\n\n([\s\S]*?)(?=^## |(?![\s\S]))/m);let installBody='';if(existingInstall){installBody=render(existingInstall[1],s.rel,current).html;body=body.replace(existingInstall[0],'');}let primer={html:'',toc:[]};if(s.primerHeading){const heading=`## ${s.primerHeading}\n`;const start=body.indexOf(heading);if(start<0)throw Error(`Missing primer for ${s.id}`);const end=body.indexOf('\n## ',start+heading.length);const text=body.slice(start,end<0?undefined:end);primer=render(text,s.rel,current);body=body.replace(text,'').trim();}const primerLinks=primer.toc.map(x=>`<a href="#${x.id}">${x.label}</a>`).join('');const rendered=render(body,s.rel,current);const links=rendered.toc.map(x=>`<a href="#${x.id}">${x.label}</a>`).join('');const prompt=render('```text\n'+s.prompt+'\n```',s.rel,current).html;const content=`<div class="breadcrumb"><a href="../../index.html#skills">← All skills</a> / ${s.name}</div><header class="guide-hero"><p class="eyebrow">${s.category}</p><h1>${s.name}</h1><p class="lead">${esc(s.intro)}</p><div class="actions">${primer.toc.length ? `<a class="button" href="#${primer.toc[0].id}">Start with the primer ↓</a><a class="text-link" href="#try-it">Try an example</a>` : '<a class="button" href="#try-it">Try an example ↓</a>'}<a class="text-link" href="#install-this-skill">Install this skill</a></div></header><div class="guide-layout"><aside class="toc" aria-label="On this page"><p>In this guide</p>${primerLinks}<a href="#try-it">Try it on your own work</a><a href="#install-this-skill">Install this skill</a>${links}</aside><article class="article"><details class="mobile-contents"><summary>In this guide</summary>${primerLinks}<a href="#try-it">Try it on your own work</a><a href="#install-this-skill">Install this skill</a>${links}</details>${primer.html}<section id="try-it"><p class="eyebrow">An example to get started</p><h2 class="try-heading">Try it on your own work.</h2><p>Install the skill, then adapt this prompt with your details.</p>${prompt}</section><section id="install-this-skill"><h2>Install this skill</h2>${existingInstall ? '<span id="install-and-invoke"></span>' : ''}${installBody || `<p>From the collection ZIP, copy the complete <code>skills/${s.id}/</code> folder into your application’s skills directory, keeping all its files and subfolders. Back up any existing copy, then follow your application’s reload instructions.</p>`}<p><a href="../../index.html#installation">Full installation steps</a> · <a href="${repo}/tree/main/skills/${s.id}" target="_blank" rel="noopener noreferrer">View the skill folder ↗<span class="status"> (opens in a new tab)</span></a></p></section>${rendered.html}</article></div>`;write(current,shell(s.name,content,current,s.intro));}
for(const source of [...sources.map(f=>path.relative(root,f)),'ATTRIBUTION.md']){if(source.endsWith('/README.md')||details.some(s=>s.rel===source))continue;const text=fs.readFileSync(path.join(root,source),'utf8').replace(/^---\n[\s\S]*?\n---\n/,''),current=pageFor(source);const title=text.match(/^# (.+)$/m)?.[1]||source;const html=render(text,source,current).html;
 const comparison=source===comparisonSource;
 const example=source===workedExampleSource;
 const readerPage=comparison||example;
 const backPage=readerPage?'skills/pplx-decision/index.html':'index.html';
 const backLabel=readerPage?'Perplexity Decisions guide':'Collection';
 const description=comparison?'Choose between Perplexity Standard, Flash, and TypeSafe Jev by task, input, question handling, and total workflow cost.':example?'An illustrative support workflow across Standard, Flash, and Jev: define questions, interpret probabilities, and use code to route or review.':undefined;
 write(current,shell(title,`<div class="breadcrumb"><a href="${relLink(current,backPage)}">← ${backLabel}</a></div><section class="section"><article class="article${readerPage?' beginner-guide reader-page':''}">${html}</article></section>`,current,description));
}
for(const name of ['style.css','app.js'])write(name,fs.readFileSync(path.join(root,'site',name)));
write('favicon.svg','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#325b48"/><text x="13" y="45" fill="#f7f6f0" font-family="Georgia,serif" font-size="45">c.</text></svg>');
write('LICENSE',fs.readFileSync(path.join(root,'LICENSE')));
for(const s of skills)write(`skills/${s.id}/LICENSE`,fs.readFileSync(path.join(root,'skills',s.id,'LICENSE')));
console.log(`Built ${list(out).length} files in _site. Guides and prompt examples derive from maintained Markdown.`);
