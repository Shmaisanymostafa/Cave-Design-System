(function () {
  const root=document.documentElement;
  const themeSelect=document.getElementById('theme-select');
  const platformSelect=document.getElementById('platform-select');
  const media=window.matchMedia('(prefers-color-scheme: dark)');
  const read=(key,fallback)=>{try{return localStorage.getItem(key)||fallback;}catch{return fallback;}};
  const save=(key,value)=>{try{localStorage.setItem(key,value);}catch{}};
  const validTheme=value=>['light','dark','black','system'].includes(value)?value:'system';
  let theme=validTheme(read('cave-design-theme','system'));
  let platform=root.dataset.platform==='flutter'?'flutter':'web';
  const previewLanguage=document.getElementById('preview-language');
  const frames=[...document.querySelectorAll('iframe.preview')];
  function updatePreviews() {
    const lang=previewLanguage?.value||root.lang;
    for(const frame of frames) {
      if(frame.closest('[data-playground]'))continue;
      const url=`/previews/${lang}/${frame.dataset.component}.html?theme=${root.dataset.theme}`;
      if(frame.getAttribute('src')!==url) frame.src=url;
      const open=document.querySelector('.preview-open');if(open)open.href=url;
    }
  }
  const bar=document.querySelector('meta[name="theme-color"]');const barBase=bar?.content;
  function syncBarColour() {
    if(!bar)return;
    const dark=root.dataset.theme==='dark'||root.dataset.theme==='black';
    bar.content=dark?getComputedStyle(root).getPropertyValue('--surface').trim()||barBase:barBase;
  }
  function applyTheme(notify=false) {
    root.dataset.theme=theme==='system'?(media.matches?'dark':'light'):theme;
    themeSelect.value=theme;syncBarColour();updatePreviews();if(notify)document.dispatchEvent(new Event('cave:docs-theme'));
  }
  themeSelect?.addEventListener('change',()=>{theme=validTheme(themeSelect.value);save('cave-design-theme',theme);applyTheme(true);});
  media.addEventListener('change',()=>{if(theme==='system')applyTheme(true);});
  function updateLinks() {
    document.querySelectorAll('a[href^="/"]').forEach(link=>{
      const url=new URL(link.getAttribute('href'),location.origin);
      if(/^\/(assets|previews|examples)\//.test(url.pathname)||/^\/downloads\//.test(url.pathname)||link.hasAttribute('download'))return;
      url.searchParams.set('platform',platform);
      if(link.classList.contains('lang'))url.hash=location.hash;
      link.href=url.pathname+url.search+url.hash;
    });
  }
  function applyPlatform(value,replace=false) {
    platform=value==='flutter'?'flutter':'web';root.dataset.platform=platform;platformSelect.value=platform;
    document.querySelectorAll('[data-platform]').forEach(panel=>{if(panel!==root)panel.hidden=panel.dataset.platform!==platform;});
    if(replace){const url=new URL(location.href);url.searchParams.set('platform',platform);history.replaceState(null,'',url);save('cave-design-platform',platform);}
    updateLinks();document.dispatchEvent(new Event('cave:docs-platform'));
  }
  platformSelect?.addEventListener('change',()=>applyPlatform(platformSelect.value,true));
  window.addEventListener('popstate',()=>applyPlatform(new URLSearchParams(location.search).get('platform')));
  window.addEventListener('hashchange',updateLinks);
  previewLanguage?.addEventListener('change',updatePreviews);
  document.querySelectorAll('.copy-code').forEach(button=>button.addEventListener('click',async()=>{
    const wrapper=button.closest('.code-example'),text=wrapper.querySelector('code').textContent,status=wrapper.querySelector('.copy-status');
    try{await navigator.clipboard.writeText(text);status.textContent=button.dataset.copiedLabel;button.textContent=button.dataset.copiedLabel;setTimeout(()=>{button.textContent=button.dataset.copyLabel;},1600);}catch{status.textContent=root.lang==='ar'?'حدد الشيفرة لنسخها يدويًا.':'Select the code to copy it manually.';}
  }));
  const btn=document.getElementById('menu-btn'),side=document.getElementById('side');
  btn?.addEventListener('click',()=>{const open=side.classList.toggle('open');btn.setAttribute('aria-expanded',String(open));});
  window.addEventListener('message',event=>{
    if(event.origin!==location.origin||event.data?.type!=='cave:preview-size')return;
    const frame=frames.find(frame=>frame.contentWindow===event.source);
    if(frame&&Number.isFinite(event.data.height))frame.style.height=`${Math.min(1600,Math.max(160,event.data.height+4))}px`;
  });
  const header=document.querySelector('.top');
  if(header)new ResizeObserver(()=>root.style.setProperty('--header-height',`${header.offsetHeight}px`)).observe(header);
  applyTheme();applyPlatform(platform);
  document.querySelectorAll('#platform-select,#theme-select,#menu-btn,.copy-code').forEach(control=>{control.disabled=false;});
  root.dataset.ready='true';
})();
