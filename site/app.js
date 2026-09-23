const copyStatus = document.querySelector('#copy-status');
document.querySelectorAll('button.copy').forEach(button => button.addEventListener('click',async()=>{
 const text=button.closest('.code-wrap').querySelector('code').textContent;
 button.textContent='Copying…';
 try{await Promise.race([navigator.clipboard.writeText(text),new Promise((_,reject)=>setTimeout(()=>reject(new Error('Clipboard unavailable')),1200))]);button.textContent='Copied';copyStatus.textContent='Prompt copied to clipboard.';setTimeout(()=>button.textContent='Copy prompt',2000);}
 catch{const code=button.closest('.code-wrap').querySelector('code');const selection=window.getSelection();const range=document.createRange();range.selectNodeContents(code);selection.removeAllRanges();selection.addRange(range);copyStatus.textContent='Automatic copying was unavailable. The prompt is selected; use your copy command.';button.textContent='Select & copy';}
}));
function revealAnchor(){if(!location.hash)return;const el=document.getElementById(decodeURIComponent(location.hash.slice(1)));if(!el)return;let p=el.parentElement;while(p){if(p.tagName==='DETAILS')p.open=true;p=p.parentElement;}}
window.addEventListener('hashchange',revealAnchor);revealAnchor();
