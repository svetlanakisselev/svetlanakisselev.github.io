document.addEventListener('DOMContentLoaded',()=>{
console.log("newsletter.js loaded");
const form=document.querySelector('.waitlist form');
if(!form)return;
const email=form.querySelector('input[type=email]');
const status=document.querySelector('.form-note');
const btn=form.querySelector('button');
const WORKER_URL='https://morning-bread-4717.s-uniculus.workers.dev/';
form.addEventListener('submit',async e=>{
console.log("submit intercepted");
e.preventDefault();
btn.disabled=true;
status.textContent='';
try{
const r=await fetch(WORKER_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:email.value.trim()})});
const d=await r.json();
status.textContent=d.message;
}catch(err){
status.textContent='Connection error.';
}
btn.disabled=false;
});
});
