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
    if(url.protocol!=='https:')throw new Error('Invalid demo URL');
    const stage=document.querySelector('#demo-stage');
    const supportedEmbed=['www.youtube.com','www.youtube-nocookie.com','player.vimeo.com','drive.google.com'].includes(url.hostname);
    let media;
    if(url.pathname.toLowerCase().endsWith('.mp4')){
      media=document.createElement('video');media.controls=true;media.preload='metadata';media.playsInline=true;media.src=url.href;media.setAttribute('aria-label',demo.title);media.poster='assets/enterprise-dashboard-branded.png';
    }else if(supportedEmbed){
      media=document.createElement('iframe');media.src=url.href;media.title=demo.title;media.loading='lazy';media.allow='encrypted-media; fullscreen; picture-in-picture';media.allowFullscreen=true;media.referrerPolicy='strict-origin-when-cross-origin';
    }else throw new Error('Unsupported demo host');
    media.className='demo-player';stage.replaceChildren(media);
  }catch(error){ /* Preserve the readable demonstration invitation if configuration is invalid. */ }
}
