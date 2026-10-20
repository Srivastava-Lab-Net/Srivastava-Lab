(function(){
  /* keep the sticky bars clear of each other at any nav height */
  function setOffsets(){
    var nav=document.querySelector('.nav'), sub=document.querySelector('.subnav'), r=document.documentElement;
    r.style.setProperty('--navh', (nav?nav.offsetHeight:70)+'px');
    if(sub && sub.offsetParent!==null) r.style.setProperty('--subh', sub.offsetHeight+'px');
  }
  window.addEventListener('resize', setOffsets);
  window.addEventListener('load', setOffsets);
  setOffsets();

  /* compact brand appears once the masthead scrolls away */
  var masthead=document.querySelector('.masthead'), navbar=document.querySelector('.nav');
  function syncStuck(){
    if(!masthead||!navbar) return;
    navbar.classList.toggle('stuck', masthead.getBoundingClientRect().bottom<=0);
  }
  window.addEventListener('scroll', syncStuck, {passive:true});
  syncStuck();

  /* research sub-header tracks the section in view */
  var subLinks=Array.prototype.slice.call(document.querySelectorAll('.subnav a'));
  function syncSubnav(){
    if(!subLinks.length) return;
    var best=null, bestTop=-Infinity;
    subLinks.forEach(function(a){
      var el=document.getElementById(a.getAttribute('href').split('#')[1]);
      if(!el) return;
      var top=el.getBoundingClientRect().top-140;
      if(top<=0 && top>bestTop){ bestTop=top; best=a; }
    });
    if(!best) best=subLinks[0];
    subLinks.forEach(function(a){ a.classList.toggle('on', a===best); });
  }
  window.addEventListener('scroll', syncSubnav, {passive:true});
  window.addEventListener('resize', function(){ setOffsets(); syncSubnav(); });
  syncSubnav();

  /* publications filter */
  var fbtns=Array.prototype.slice.call(document.querySelectorAll('.ftag'));
  var activeTag='all';
  function applyFilter(tag){
    var pubs=Array.prototype.slice.call(document.querySelectorAll('.publist .pub')), shown=0;
    if(!pubs.length) return;
    pubs.forEach(function(p){
      var ok = tag==='all' || (p.getAttribute('data-tags')||'').split(' ').indexOf(tag)>-1;
      p.classList.toggle('hide', !ok); if(ok) shown++;
    });
    Array.prototype.slice.call(document.querySelectorAll('.publist .pubyear')).forEach(function(h){
      var n=h.nextElementSibling, any=false;
      while(n && !n.classList.contains('pubyear')){
        if(n.classList.contains('pub') && !n.classList.contains('hide')) any=true;
        n=n.nextElementSibling;
      }
      h.classList.toggle('hide', !any);
      var line=h.nextElementSibling;
      if(line && line.classList.contains('yearline')) line.classList.toggle('hide', !any);
    });
    var covers=document.querySelector('.publist .covers');
    if(covers){
      covers.classList.toggle('hide', tag!=='all');
      var ch=covers.previousElementSibling;
      if(ch && ch.classList.contains('yearline')) ch.classList.toggle('hide', tag!=='all');
    }
    activeTag=tag;
    fbtns.forEach(function(b){ b.classList.toggle('on', b.getAttribute('data-filter')===tag); });
    var note=document.getElementById('fcount');
    if(note) note.textContent = tag==='all' ? '' : shown+' of '+pubs.length+' shown';
    Array.prototype.slice.call(document.querySelectorAll('.ptag')).forEach(function(t){
      t.classList.toggle('active', (t.getAttribute('data-tag')||t.getAttribute('data-filter'))===tag && tag!=='all');
    });
  }
  document.addEventListener('click', function(e){
    var t=e.target.closest('.ptag'); if(!t) return;
    e.preventDefault(); e.stopPropagation();
    var tg=t.getAttribute('data-tag') || t.getAttribute('data-filter');
    if(!tg) return;
    applyFilter(activeTag===tg ? 'all' : tg);
  });

  /* deep link: publications.html#fundamentals applies that filter */
  if(location.hash && document.querySelector('.publist')){
    var h=location.hash.slice(1);
    if(document.querySelector('.ftag[data-filter="'+h+'"]')) applyFilter(h);
  }
})();
