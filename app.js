'use strict';
const form=document.querySelector('#lead-form');
const status=document.querySelector('#form-status');
const phoneField=form.elements.phone;
phoneField.addEventListener('input',()=>phoneField.setCustomValidity(''));
form.addEventListener('submit',async event=>{
  event.preventDefault();
  const values=Object.fromEntries(new FormData(form));
  const phone=values.phone.replace(/\D/g,'').replace(/^52(?=\d{10}$)/,'');
  if(phone.length!==10){phoneField.setCustomValidity('Escribe un número de WhatsApp de México de 10 dígitos.');phoneField.reportValidity();return;}
  const params=new URLSearchParams(location.search);
  const payload={...values,phone:'+52'+phone,consent:values.consent==='on',source:'ICqUS · ARHITAC 2026',landing_path:location.pathname,utm_source:params.get('utm_source')||'',utm_medium:params.get('utm_medium')||'',utm_campaign:params.get('utm_campaign')||'',utm_content:params.get('utm_content')||''};
  const message=['Hola, Dr. Alan. Me interesa una evaluación inicial de salud laboral con ICqUS.','Nombre: '+payload.name,'Empresa: '+payload.company,'Área: '+payload.role,'WhatsApp: '+payload.phone,'Correo: '+payload.email,payload.interest?'Interés: '+payload.interest:'','Origen: ARHITAC 2026'].filter(Boolean).join('\n');
  const whatsapp='https://wa.me/526641762612?text='+encodeURIComponent(message);
  const button=form.querySelector('button[type="submit"]');
  button.disabled=true;status.textContent='Registrando tu solicitud…';
  try{
    const response=await fetch('/api/solicitudes',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal:AbortSignal.timeout(18000)});
    const result=await response.json();
    if(!response.ok||!result.ok)throw new Error('registration_failed');
    status.textContent='';
    document.querySelector('#continue-whatsapp').href=whatsapp;
    document.querySelector('#form-success').hidden=false;
    form.querySelectorAll('input,select,textarea').forEach(field=>field.disabled=true);
    button.hidden=true;
    document.querySelector('#form-success').scrollIntoView({behavior:'smooth',block:'center'});
  }catch(error){
    status.replaceChildren(document.createTextNode('No pudimos registrar tu solicitud. Tus datos siguen en el formulario para que puedas reintentar. También puedes '));
    const link=document.createElement('a');link.textContent='continuar por WhatsApp con el Dr. Alan';link.href=whatsapp;link.target='_blank';link.rel='noopener noreferrer';link.style.textDecoration='underline';status.append(link,document.createTextNode('.'));
  }finally{button.disabled=false;}
});
const mobileCta=document.querySelector('.mobile-cta');
if('IntersectionObserver' in window){new IntersectionObserver(entries=>mobileCta.classList.toggle('is-hidden',entries[0].isIntersecting),{threshold:0}).observe(document.querySelector('#evaluacion'));}

const demo=window.ICQUS_DEMO;
if(demo&&demo.url){
  try{
    const url=new URL(demo.url,location.href);
    if(url.protocol!=='https:'&&url.origin!==location.origin)throw new Error('Invalid demo URL');
    const stage=document.querySelector('#demo-stage');
    const supportedEmbed=['www.youtube.com','www.youtube-nocookie.com','player.vimeo.com','drive.google.com'].includes(url.hostname);
    let media;
    if(url.pathname.toLowerCase().endsWith('.mp4')){
      media=document.createElement('video');media.muted=true;media.loop=true;media.playsInline=true;media.preload='metadata';media.src=url.href;media.setAttribute('aria-label',demo.title);media.poster=demo.poster||'assets/enterprise-dashboard-branded.png';media.classList.add('demo-video');
      // Loop silencioso: se reproduce solo, salvo si el visitante pidió reducir el movimiento.
      if(matchMedia('(prefers-reduced-motion: reduce)').matches)media.controls=true;else media.autoplay=true;
    }else if(supportedEmbed){
      media=document.createElement('iframe');media.src=url.href;media.title=demo.title;media.loading='lazy';media.allow='encrypted-media; fullscreen; picture-in-picture';media.allowFullscreen=true;media.referrerPolicy='strict-origin-when-cross-origin';
    }else throw new Error('Unsupported demo host');
    media.classList.add('demo-player');stage.replaceChildren(media);
    if(demo.sound&&media.tagName==='VIDEO'){
      const icon='<svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4z"/>';
      const on=icon+'<path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg><span>Escuchar con voz</span>';
      const off=icon+'<path d="m22 9-6 6M16 9l6 6"/></svg><span>Silenciar</span>';
      const sound=document.createElement('button');sound.type='button';sound.className='demo-sound';sound.innerHTML=on;sound.setAttribute('aria-pressed','false');
      sound.addEventListener('click',()=>{
        media.muted=!media.muted;
        if(!media.muted){media.currentTime=0;media.play().catch(()=>{});}
        sound.innerHTML=media.muted?on:off;sound.setAttribute('aria-pressed',String(!media.muted));
      });
      stage.append(sound);
    }
  }catch(error){ /* Preserve the readable demonstration invitation if configuration is invalid. */ }
}
