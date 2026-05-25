
const qs=(s,scope=document)=>scope.querySelector(s);
const qsa=(s,scope=document)=>[...scope.querySelectorAll(s)];
const header=qs('[data-header]');
const toggle=qs('[data-menu-toggle]');
const nav=qs('[data-nav]');
window.addEventListener('scroll',()=>{ if(header) header.classList.toggle('scrolled',window.scrollY>24); });
if(toggle&&nav){
  toggle.addEventListener('click',()=>{
    const open=nav.classList.toggle('open');
    toggle.classList.toggle('active',open);
    toggle.setAttribute('aria-expanded',String(open));
  });
  qsa('a',nav).forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle.classList.remove('active');toggle.setAttribute('aria-expanded','false');}));
}
const revealEls=qsa('.reveal');
if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}});
  },{threshold:.08,rootMargin:'0px 0px -4% 0px'});
  revealEls.forEach(el=>observer.observe(el));
}else{revealEls.forEach(el=>el.classList.add('visible'));}
function animateCount(el){
  if(el.dataset.done==='true') return;
  el.dataset.done='true';
  const target=Number(el.dataset.count||0), suffix=el.dataset.suffix||'';
  const duration=1100; const start=performance.now();
  function frame(now){
    const p=Math.min((now-start)/duration,1); const eased=1-Math.pow(1-p,3);
    el.textContent=Math.round(target*eased)+suffix;
    if(p<1) requestAnimationFrame(frame); else el.textContent=target+suffix;
  }
  requestAnimationFrame(frame);
}
const countEls=qsa('[data-count]');
if('IntersectionObserver' in window){
  const countObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){animateCount(entry.target);countObserver.unobserve(entry.target);}}),{threshold:.5});
  countEls.forEach(el=>countObserver.observe(el));
}else{countEls.forEach(animateCount);}
qsa('[data-hero-rotator]').forEach(rotator=>{
  const slides=qsa('.hero-slide',rotator); if(slides.length<2) return;
  let index=0;
  setInterval(()=>{slides[index].classList.remove('active'); index=(index+1)%slides.length; slides[index].classList.add('active');},5200);
});
qsa('[data-form]').forEach(form=>{
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const status=qs('.form-status',form);
    if(status) status.textContent='Demo submitted. Connect this form to your live email/CRM handler before launch.';
    form.reset();
  });
});


// Premium video poster rotator and modal
qsa('[data-video-posters]').forEach(frame=>{
  const slides=qsa('.video-poster-layer', frame);
  if(slides.length<2) return;
  let index=0;
  setInterval(()=>{
    slides[index].classList.remove('active');
    index=(index+1)%slides.length;
    slides[index].classList.add('active');
  },4600);
});
const videoModal=qs('[data-video-modal]');
const videoOpen=qs('[data-video-open]');
const closeVideo=()=>{
  if(!videoModal) return;
  videoModal.classList.remove('open');
  videoModal.setAttribute('aria-hidden','true');
  document.body.classList.remove('video-locked');
};
if(videoModal&&videoOpen){
  videoOpen.addEventListener('click',()=>{
    videoModal.classList.add('open');
    videoModal.setAttribute('aria-hidden','false');
    document.body.classList.add('video-locked');
  });
  qsa('[data-video-close]',videoModal).forEach(el=>el.addEventListener('click',closeVideo));
  document.addEventListener('keydown',e=>{if(e.key==='Escape') closeVideo();});
}


// V6 safety: make sure every hero rotator has one active slide.
qsa('[data-hero-rotator]').forEach(rotator=>{
  const slides=qsa('.hero-slide',rotator);
  if(slides.length && !slides.some(s=>s.classList.contains('active'))) slides[0].classList.add('active');
});
