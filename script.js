// header scroll state + right-edge scroll rail
const header = document.getElementById('siteHeader');
const rail = document.getElementById('scrollRail');
const railFill = document.getElementById('railFill');
const railMarker = document.getElementById('railMarker');
let railHideTimer;
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
  if(!rail) return;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const pct = max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0;
  railFill.style.height = pct + '%';
  railMarker.style.top = pct + '%';
  rail.classList.toggle('show', window.scrollY > 20);
  clearTimeout(railHideTimer);
  railHideTimer = setTimeout(() => { if(window.scrollY <= 20) rail.classList.remove('show'); }, 1200);
}, {passive:true});

// nav dropdowns (click to support touch; CSS handles hover)
document.querySelectorAll('.navdrop-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const d = btn.closest('.navdrop');
    document.querySelectorAll('.navdrop.open').forEach(o => { if(o !== d) o.classList.remove('open'); });
    d.classList.toggle('open');
  });
});
document.addEventListener('click', () => {
  document.querySelectorAll('.navdrop.open').forEach(o => o.classList.remove('open'));
});

// reveal on scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
}, {threshold:0.15});
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// portfolio filter (only present on portfolio.html)
const buttons = document.querySelectorAll('.pfilter button');
const cards = document.querySelectorAll('.pcard');
buttons.forEach(b => b.addEventListener('click', () => {
  buttons.forEach(x => x.classList.remove('active'));
  b.classList.add('active');
  const f = b.dataset.f;
  cards.forEach(c => { c.style.display = (f==='all' || c.dataset.c===f) ? '' : 'none'; });
}));

// particle canvas — only present on index.html hero
const canvas = document.getElementById('particles');
if(canvas){
  const ctx = canvas.getContext('2d');
  let w, h, particles = [];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const PCOUNT = reduceMotion ? 0 : (window.innerWidth < 700 ? 45 : 90);

  function resize(){
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }
  function init(){
    resize();
    particles = Array.from({length:PCOUNT}, () => ({
      x: Math.random()*w, y: Math.random()*h,
      vx: (Math.random()-0.5)*0.35, vy: (Math.random()-0.5)*0.35,
      r: Math.random()*1.6+0.6
    }));
  }
  function tick(){
    ctx.clearRect(0,0,w,h);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if(p.x<0||p.x>w) p.vx*=-1;
      if(p.y<0||p.y>h) p.vy*=-1;
    });
    for(let i=0;i<particles.length;i++){
      const p = particles[i];
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle = 'rgba(240,146,58,0.6)';
      ctx.fill();
      for(let j=i+1;j<particles.length;j++){
        const q = particles[j];
        const dx=p.x-q.x, dy=p.y-q.y, dist=Math.sqrt(dx*dx+dy*dy);
        if(dist<130){
          ctx.beginPath();
          ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y);
          ctx.strokeStyle = `rgba(247,178,103,${0.18*(1-dist/130)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(tick);
  }
  window.addEventListener('resize', resize, {passive:true});
  if(!reduceMotion){ init(); tick(); } else { resize(); }
}
