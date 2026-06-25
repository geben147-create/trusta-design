(function(){
  var seen = new WeakSet(), io;
  function reveal(el){ el.classList.add('mo-in'); el.classList.remove('mo-reveal'); drawSvg(el); }
  function drawSvg(scope){
    scope.querySelectorAll('svg polyline').forEach(function(pl){
      try{
        var len = pl.getTotalLength(); if(!len) return;
        pl.style.strokeDasharray = len; pl.style.strokeDashoffset = len;
        pl.getBoundingClientRect();
        pl.style.transition = 'stroke-dashoffset 1.5s cubic-bezier(.4,0,.2,1)';
        requestAnimationFrame(function(){ pl.style.strokeDashoffset = '0'; });
      }catch(e){}
    });
  }
  function setup(){
    if(!io){
      io = new IntersectionObserver(function(es){
        es.forEach(function(e){ if(e.isIntersecting){ reveal(e.target); io.unobserve(e.target); } });
      }, { threshold:0, rootMargin:'0px 0px -8% 0px' });
    }
    document.querySelectorAll('section, footer').forEach(function(s){
      if(seen.has(s)) return; seen.add(s);
      var r = s.getBoundingClientRect();
      if(r.top < (window.innerHeight||800)*0.9){ reveal(s); }
      else { s.classList.add('mo-reveal'); io.observe(s); }
    });
  }
  function scrollFallback(){
    document.querySelectorAll('.mo-reveal').forEach(function(s){
      if(s.getBoundingClientRect().top < (window.innerHeight||800)*0.88){ reveal(s); if(io) io.unobserve(s); }
    });
  }
  function go(){
    setup();
    var n=0; var t=setInterval(function(){ setup(); if(++n>30) clearInterval(t); }, 200);
    window.addEventListener('scroll', scrollFallback, {passive:true});
  }
  if(document.readyState !== 'loading') go();
  else document.addEventListener('DOMContentLoaded', go);
})();
