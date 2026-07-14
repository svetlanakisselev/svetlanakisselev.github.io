document.addEventListener('DOMContentLoaded',()=>{
const form=document.querySelector('.waitlist form');
if(!form)return;
const email=form.querySelector('input[type=email]');
const status=document.querySelector('.form-note');
const btn=form.querySelector('button');
const WORKER_URL='__REPLACE_WITH_WORKER_URL__';
form.addEventListener('submit',async e=>{
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
