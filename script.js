(function(){
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];

  /* toast for stub buttons */
  const toast=$('#toast'); let tt;
  function showToast(msg){toast.textContent=msg||'Демо-версия: эта кнопка заработает после запуска сайта';toast.classList.add('is-on');clearTimeout(tt);tt=setTimeout(()=>toast.classList.remove('is-on'),2600)}
  $$('.stub').forEach(el=>el.addEventListener('click',e=>{e.preventDefault();showToast(el.classList.contains('booking__go')?'Демо-версия: онлайн-бронирование подключим после запуска сайта':null)}));

  /* mobile menu */
  const mm=$('#mmenu');
  $('.burger').addEventListener('click',()=>mm.classList.add('is-open'));
  $('.mmenu__close').addEventListener('click',()=>mm.classList.remove('is-open'));
  $$('#mmenu nav a, #mmenu .btn').forEach(a=>a.addEventListener('click',()=>mm.classList.remove('is-open')));

  /* ---------- booking UI (без реального бронирования) ---------- */
  const popCal=$('#pop-cal'), popG=$('#pop-guests');
  let target=null; // 'cal-in' | 'cal-out'
  let dIn=new Date(2026,5,1), dOut=new Date(2026,5,3), view=new Date(2026,5,1);
  const pad=n=>String(n).padStart(2,'0'), fmt=d=>pad(d.getDate())+'-'+pad(d.getMonth()+1)+'-'+d.getFullYear();
  const months=['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
  function closeAll(){[popCal,popG].forEach(p=>p.classList.remove('is-open'));$$('.field').forEach(f=>f.classList.remove('is-open'))}
  function renderCal(){
    $('.cal__title',popCal).textContent=months[view.getMonth()]+' '+view.getFullYear();
    const g=$('.cal__grid',popCal); g.innerHTML='';
    ['ПН','ВТ','СР','ЧТ','ПТ','СБ','ВС'].forEach(w=>g.insertAdjacentHTML('beforeend','<span class="wd">'+w+'</span>'));
    const first=new Date(view.getFullYear(),view.getMonth(),1), off=(first.getDay()+6)%7, days=new Date(view.getFullYear(),view.getMonth()+1,0).getDate();
    for(let i=0;i<off;i++) g.insertAdjacentHTML('beforeend','<span></span>');
    for(let d=1;d<=days;d++){
      const dt=new Date(view.getFullYear(),view.getMonth(),d), b=document.createElement('button');
      b.type='button';b.textContent=d;
      if(+dt===+dIn||+dt===+dOut) b.className='sel'; else if(dt>dIn&&dt<dOut) b.className='rng';
      b.onclick=()=>{ if(target==='cal-in'){dIn=dt; if(dOut<=dIn) dOut=new Date(dt.getFullYear(),dt.getMonth(),dt.getDate()+1);} else { if(dt<=dIn){dIn=dt;dOut=new Date(dt.getFullYear(),dt.getMonth(),dt.getDate()+1)} else dOut=dt; }
        $$('.field')[0].querySelector('.field__val').textContent=fmt(dIn);$$('.field')[1].querySelector('.field__val').textContent=fmt(dOut);closeAll();};
      g.appendChild(b);
    }
  }
  $$('.cal__nav',popCal).forEach((b,i)=>b.addEventListener('click',e=>{e.stopPropagation();view=new Date(view.getFullYear(),view.getMonth()+(i?1:-1),1);renderCal()}));
  $$('.field').forEach(f=>f.addEventListener('click',e=>{
    e.preventDefault();e.stopPropagation();
    const k=f.dataset.pop, wasOpen=f.classList.contains('is-open'); closeAll(); if(wasOpen) return;
    f.classList.add('is-open');
    if(k==='guests'){popG.classList.add('is-open')}
    else{target=k;view=new Date((k==='cal-in'?dIn:dOut).getFullYear(),(k==='cal-in'?dIn:dOut).getMonth(),1);renderCal();
      popCal.style.left=(window.innerWidth<700?'':(f.offsetLeft)+'px');popCal.classList.add('is-open')}
  }));
  [popCal,popG].forEach(p=>p.addEventListener('click',e=>e.stopPropagation()));
  document.addEventListener('click',closeAll);
  const cnt={a:1,c:0};
  $$('.cnt button',popG).forEach(b=>b.addEventListener('click',()=>{
    const k=b.dataset.k, d=+b.dataset.d; const max=k==='a'?12-cnt.c:12-cnt.a;
    cnt[k]=Math.max(k==='a'?1:0,Math.min(max,cnt[k]+d));
    $('[data-v="'+k+'"]',popG).textContent=cnt[k]; $('#guests-val').textContent=cnt.a+cnt.c;
  }));

  /* ---------- Наше пространство: вкладки ---------- */
  const SPACE=[
    {t:'Вид',img:'img/video-terrace.jpg',pos:'50% 50%',chips:['Панорама','До 12 гостей'],d:'Коттеджи с панорамным видом на берегу Суходольского озера'},
    {t:'Терраса',img:'img/hero.jpg',pos:'50% 60%',chips:['Индивидуальная терраса','Зона барбекю','Костровая зона'],d:'Индивидуальная терраса, зона барбекю и костровая зона'},
    {t:'Пирс',img:'img/pier.jpg',pos:'50% 75%',chips:['Шезлонги','Лодки и сапы'],d:'Частный пирс у Суходольского озера в нескольких метрах от дома'},
    {t:'Интерьер',img:'img/interior.jpg',pos:'50% 66%',chips:['До 12 гостей','Камин','Панорама','King-size'],d:'Минималистичный интерьер с панорамным видом на озеро. Природа и стиль в гармонии'},
    {t:'Баня',img:'img/svc-banya.jpg',pos:'50% 50%',chips:['Веники и чай включены'],d:'Дровяная баня: отдых и комфорт! Топим настоящими дровами'},
    {t:'Территория',img:'img/vis-picnic.jpg',pos:'50% 60%',chips:['Костровая зона','Шезлонги','Парковка на 6 машин'],d:'Зона барбекю, костровая зона и место для отдыха на свежем воздухе'},
    {t:'Кинотеатр',img:'img/vis-cinema.jpg',pos:'50% 60%',chips:['Онлайн-кино','Smart TV'],d:'Wi-Fi 100 Мбит/с, Smart TV и всё необходимое для комфортного проживания'}
  ];
  const sp=$('.space'), spImg=$('.space__img',sp); let cur=3;
  function setSpace(i,init){
    cur=(i+SPACE.length)%SPACE.length; const s=SPACE[cur];
    $$('.tab').forEach((t,j)=>t.classList.toggle('is-on',j===cur));
    spImg.style.opacity=0;
    setTimeout(()=>{spImg.src=s.img;spImg.alt=s.t;spImg.style.objectPosition=s.pos;spImg.style.opacity=1},180);
    $('.space__title',sp).textContent=s.t; $('.space__desc',sp).textContent=s.d;
    $('.chips',sp).innerHTML=s.chips.map(c=>'<span>'+c+'</span>').join('');
    const tab=$$('.tab')[cur]; const tabs=$('.tabs'); if(!init&&tabs.scrollWidth>tabs.clientWidth) tabs.scrollTo({left:tab.offsetLeft-tabs.offsetLeft-16,behavior:'smooth'});
  }
  $$('.tab').forEach((t,j)=>t.addEventListener('click',()=>setSpace(j)));
  $$('[data-space]').forEach(b=>b.addEventListener('click',()=>setSpace(cur+ +b.dataset.space)));
  setSpace(3,true);
  if(window.innerWidth<700){const r=$('.vis__row');const m=r.children[1];r.scrollLeft=m.offsetLeft-(r.clientWidth-m.clientWidth)/2}

  /* ---------- карусели со стрелками ---------- */
  $$('.arrows').forEach(a=>{
    const tr=document.getElementById(a.dataset.for); if(!tr) return;
    const [prev,next]=$$('button',a);
    const step=()=>{const c=tr.children[0];return c.getBoundingClientRect().width+parseFloat(getComputedStyle(tr).columnGap||24)};
    prev.addEventListener('click',()=>tr.scrollBy({left:-step()}));
    next.addEventListener('click',()=>tr.scrollBy({left:step()}));
    const upd=()=>{prev.style.opacity=tr.scrollLeft<4?.6:1;next.style.opacity=tr.scrollLeft+tr.clientWidth>=tr.scrollWidth-4?.6:1};
    tr.addEventListener('scroll',upd,{passive:true}); upd();
  });
  /* визуал: стрелки по бокам */
  const vr=$('.vis__row');
  $$('[data-vis]').forEach(b=>b.addEventListener('click',()=>{
    if(vr.scrollWidth>vr.clientWidth) vr.scrollBy({left:(+b.dataset.vis)*246,behavior:'smooth'});
    else{ const imgs=$$('img',vr); const srcs=imgs.map(i=>i.src); const d=+b.dataset.vis;
      imgs.forEach((im,i)=>{im.style.opacity=0;setTimeout(()=>{im.src=srcs[(i+d+srcs.length)%srcs.length];im.style.opacity=1},160)}); }
  }));
  $$('.vis__row img').forEach(i=>i.style.transition='opacity .3s');
})();
