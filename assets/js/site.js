(function(){
  var SCRIPT=document.currentScript&&document.currentScript.src;
  var EN=(document.documentElement.lang||'').indexOf('en')===0;
  var b=document.getElementById('burger'),m=document.getElementById('menu');
  if(b&&m){b.addEventListener('click',function(){var o=m.classList.toggle('open');b.setAttribute('aria-expanded',o)});
  m.addEventListener('click',function(e){if(e.target.tagName==='A'){m.classList.remove('open');b.setAttribute('aria-expanded','false')}});}

  var c=document.getElementById('copy'),mail=document.getElementById('mail');
  if(c&&mail)c.addEventListener('click',function(){
    function sel(){var r=document.createRange();r.selectNodeContents(mail);var s=getSelection();s.removeAllRanges();s.addRange(r);c.textContent=EN?'Select and copy':'Selecciona y copia'}
    try{navigator.clipboard.writeText(mail.textContent).then(function(){c.textContent=EN?'Copied':'Copiado';setTimeout(function(){c.textContent=EN?'Copy email':'Copiar correo'},1800)},sel)}catch(e){sel()}
  });


  // Pestañas de estudiantes
  var tabs=[].slice.call(document.querySelectorAll('.tab'));
  function sel(t){tabs.forEach(function(x){var on=x===t;x.setAttribute('aria-selected',on);x.tabIndex=on?0:-1;document.getElementById(x.getAttribute('aria-controls')).hidden=!on})}
  if(tabs.length&&location.hash==='#egresados'){sel(document.getElementById('t-egr'))}
  tabs.forEach(function(t,i){t.addEventListener('click',function(){sel(t)});t.addEventListener('keydown',function(e){if(e.key==='ArrowRight'||e.key==='ArrowLeft'){var n=tabs[(i+(e.key==='ArrowRight'?1:tabs.length-1))%tabs.length];sel(n);n.focus()}})});

  // Perfiles de estudiantes: foto, reseña y enlaces desde assets/data/estudiantes.json, con tarjeta flotante
  var leaves=document.querySelectorAll('li[data-slug]');
  if(leaves.length&&SCRIPT&&window.fetch){
    var base=SCRIPT.replace(/js\/site\.js.*$/,'');
    var LB={linkedin:'LinkedIn',researchgate:'ResearchGate',orcid:'ORCID',scholar:'Google Scholar'};
    var pop=document.createElement('div');pop.className='spop';pop.setAttribute('role','dialog');pop.hidden=true;document.body.appendChild(pop);
    var hideT=null,current=null,shownAt=0,noHover=window.matchMedia&&matchMedia('(hover: none)').matches;
    function linksEl(d,cls){var keys=Object.keys(LB).filter(function(k){return d[k]});if(!keys.length)return null;var w=document.createElement('p');w.className=cls;keys.forEach(function(k){var a=document.createElement('a');a.href=d[k];a.textContent=LB[k];a.rel='noopener';a.target='_blank';w.appendChild(a)});return w}
    function show(li,d,anchor){
      clearTimeout(hideT);if(current===li&&!pop.hidden)return;current=li;pop.innerHTML='';
      if(d._src){var im=document.createElement('img');im.src=d._src;im.alt=d.nombre;pop.appendChild(im)}
      var bx=document.createElement('div');bx.className='spop-b';
      var h=document.createElement('p');h.className='spop-n';h.textContent=d.nombre;bx.appendChild(h);
      var lv=li.querySelector('.lv');if(lv){var g=document.createElement('p');g.className='spop-g';g.textContent=lv.textContent;bx.appendChild(g)}
      var bio=EN?(d.resena_en||d.resena_es):(d.resena_es||d.resena_en);if(bio){var p=document.createElement('p');p.className='spop-r';p.textContent=bio;bx.appendChild(p)}
      var l=linksEl(d,'slinks');if(l)bx.appendChild(l);
      pop.appendChild(bx);pop.hidden=false;shownAt=Date.now();
      var r=anchor.getBoundingClientRect(),W=pop.offsetWidth,H=pop.offsetHeight,vw=innerWidth,vh=innerHeight,x,y;
      if(vw<640){x=Math.max(12,(vw-W)/2);y=Math.min(Math.max(12,r.bottom+10),vh-H-12)}
      else{x=r.right+16+W<vw?r.right+16:r.left-W-16;if(x<12)x=Math.min(vw-W-12,r.left);y=Math.min(Math.max(76,r.top-20),vh-H-12)}
      pop.style.left=Math.round(x)+'px';pop.style.top=Math.round(Math.max(12,y))+'px';
    }
    function hide(){hideT=setTimeout(function(){pop.hidden=true;current=null},160)}
    pop.addEventListener('mouseenter',function(){clearTimeout(hideT)});pop.addEventListener('mouseleave',hide);
    document.addEventListener('click',function(e){if(!pop.hidden&&!pop.contains(e.target)&&!(e.target.closest&&e.target.closest('li[data-slug] .av, li[data-slug] b'))){pop.hidden=true;current=null}});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'){pop.hidden=true;current=null}});
    window.addEventListener('scroll',function(){if(!noHover){pop.hidden=true;current=null}},{passive:true});
    fetch(base+'data/estudiantes.json').then(function(r){return r.ok?r.json():{}}).then(function(data){
      leaves.forEach(function(li){
        var d=data[li.getAttribute('data-slug')];if(!d)return;
        if(d.foto){d._src=/^https?:/.test(d.foto)?d.foto:base+'img/estudiantes/'+d.foto;var av=li.querySelector('.av');if(av){var im=document.createElement('img');im.className='av';im.alt='';im.loading='lazy';im.width=48;im.height=48;im.src=d._src;av.replaceWith(im)}}
        var l=linksEl(d,'slinks');if(l)li.appendChild(l);
        if(!(d.foto||d.resena_es||d.resena_en))return;
        li.classList.add('has-prof');
        var name=li.querySelector('b'),pic=li.querySelector('.av');
        name.tabIndex=0;name.setAttribute('aria-haspopup','dialog');
        [name,pic].forEach(function(el){if(!el)return;
          el.addEventListener('mouseenter',function(){if(!noHover)show(li,d,pic||name)});
          el.addEventListener('mouseleave',function(){if(!noHover)hide()});
          el.addEventListener('click',function(e){e.stopPropagation();if(current===li&&!pop.hidden){if(Date.now()-shownAt>400){pop.hidden=true;current=null}}else show(li,d,pic||name)});
        });
        name.addEventListener('focus',function(){show(li,d,pic||name)});name.addEventListener('blur',hide);
      });
    }).catch(function(){});
  }

  // Fibra de cromatina
  var cv=document.getElementById('fiber');if(!cv)return;var ctx=cv.getContext('2d');
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var N=16,kinds=[0,0,1,1,0,1,0,0,1,0,0,1,1,0,0,1],me=[0,1,0,0,1,0,0,1,0,0,1,0,0,0,1,0];
  var chaps={2:'DAXX',3:'ATRX',8:'HIRA',12:'DAXX'};
  var C={dna:'rgba(233,238,255,.55)',wrap:'#e9eeff',can:'#2f5cf0',h33:'#c9a24b',mark:'#ffffff',chapA:'#c9a24b',chapH:'#6f93ff',label:'#e9eeff'};
  function size(){var d=devicePixelRatio||1,r=cv.getBoundingClientRect();cv.width=r.width*d;cv.height=r.height*d;ctx.setTransform(d,0,0,d,0,0);return r}
  var R=size();addEventListener('resize',function(){R=size();if(reduce)draw(0)});
  function draw(t){
    var W=R.width,H=R.height;if(!(W>20&&H>20&&isFinite(W)&&isFinite(H)))return;ctx.clearRect(0,0,W,H);
    var n=W<600?9:N,gap=W/n,rad=Math.min(gap*.30,H*.16),mid=H*.6;
    function y(x){return mid+Math.sin(x/W*Math.PI*2.2+t*.00025)*H*.12}
    ctx.lineWidth=1.6;ctx.strokeStyle=C.dna;ctx.beginPath();
    for(var x=0;x<=W;x+=4){var yy=y(x)+Math.sin(x*.09+t*.001)*2.5;x?ctx.lineTo(x,yy):ctx.moveTo(x,yy)}ctx.stroke();
    for(var i=0;i<n;i++){
      var cx=gap*(i+.5),cy=y(cx),k=kinds[i%N];
      var g=ctx.createRadialGradient(cx-rad*.35,cy-rad*.35,rad*.1,cx,cy,rad);
      g.addColorStop(0,k?'#f1dc9c':'#7d9bff');g.addColorStop(1,k?C.h33:C.can);
      ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(cx,cy,rad,rad*.82,0,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle=C.wrap;ctx.lineWidth=1.4;
      for(var w=-1;w<=1;w+=2){ctx.beginPath();ctx.ellipse(cx,cy+w*rad*.18,rad*1.08,rad*.30,-.22,0,Math.PI*2);ctx.stroke()}
      if(me[i%N]){var mx=cx+rad*.55,my=cy-rad*1.05;ctx.strokeStyle=C.mark;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(cx+rad*.3,cy-rad*.6);ctx.lineTo(mx,my);ctx.stroke();ctx.fillStyle=C.mark;ctx.beginPath();ctx.arc(mx,my,3.2,0,7);ctx.fill()}
      var ch=chaps[i%N];
      if(ch){
        var hy=cy-rad*2.25-Math.sin(t*.0012+i)*3;
        ctx.fillStyle=ch==='HIRA'?C.chapH:C.chapA;
        [[0,0,.42],[-.35,.12,.3],[.33,.14,.3],[0,-.3,.28]].forEach(function(p){ctx.beginPath();ctx.arc(cx+p[0]*rad,hy+p[1]*rad,rad*p[2],0,7);ctx.fill()});
        ctx.font='600 12px Lexend, sans-serif';ctx.fillStyle=C.label;ctx.textAlign='center';ctx.fillText(ch,cx,hy-rad*.62);
      }
      if(k&&i%N===5){ctx.font='600 12px Lexend, sans-serif';ctx.fillStyle=C.h33;ctx.textAlign='center';ctx.fillText('H3.3',cx,cy+rad*1.5+8)}
    }
  }
  if(reduce){draw(0)}else{(function loop(t){try{draw(t)}catch(e){}requestAnimationFrame(loop)})(0)}
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){if(reduce)draw(0)});
})();
