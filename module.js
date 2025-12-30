// module.js — shared logic for module pages (camera preview, local file select, run placeholder)

document.addEventListener('DOMContentLoaded', ()=>{
  const backBtn = document.getElementById('backBtn');
  backBtn && backBtn.addEventListener('click', ()=>{ window.location.href = 'dashboard.html'; });

  // show user greeting from session
  const greetEl = document.getElementById('greet');
  const headerUser = document.getElementById('headerUser');
  const name = sessionStorage.getItem('dt_name') || '';
  const email = sessionStorage.getItem('dt_email') || 'user@example.com';
  const display = name || email;
  if(greetEl){
    // derive module name from existing heading (right side of '—')
    const parts = greetEl.textContent.split('—');
    const moduleName = (parts[1] || parts[0] || '').trim();
    // friendly, module-specific greeting
    greetEl.textContent = `Welcome, ${display} — You opened ${moduleName} controls.`;
  }
  if(headerUser){
    const initials = (name || email).split(' ').map(s=>s[0]||'').slice(0,2).join('').toUpperCase();
    headerUser.textContent = initials;
  }

  const realtimeBtn = document.getElementById('realtimeBtn');
  const localBtn = document.getElementById('localBtn');
  const fileInput = document.getElementById('fileInput');
  const preview = document.getElementById('preview');
  const runBtn = document.getElementById('runBtn');

  let currentSource = null; // 'camera' | 'file'
  let stream = null;

  function clearPreview(){
    preview.innerHTML = '';
    if(stream){
      stream.getTracks().forEach(t=>t.stop());
      stream = null;
    }
  }

  realtimeBtn && realtimeBtn.addEventListener('click', async ()=>{
    try{
      clearPreview();
      const video = document.createElement('video');
      video.autoplay = true; video.muted = true; video.playsInline = true; video.style.maxWidth = '100%';
      preview.appendChild(video);
      const s = await navigator.mediaDevices.getUserMedia({video:true, audio:false});
      stream = s;
      video.srcObject = s;
      currentSource = 'camera';
    }catch(e){
      alert('Unable to access camera: ' + (e.message || e));
    }
  });

  localBtn && localBtn.addEventListener('click', ()=>{
    fileInput && fileInput.click();
  });

  fileInput && fileInput.addEventListener('change', (ev)=>{
    const f = ev.target.files && ev.target.files[0];
    if(!f) return;
    clearPreview();
    const url = URL.createObjectURL(f);
    // choose element by mime
    if(f.type.startsWith('image/')){
      const img = document.createElement('img'); img.src = url; img.style.maxWidth='100%'; preview.appendChild(img);
    } else {
      const video = document.createElement('video'); video.controls = true; video.src = url; video.style.maxWidth='100%'; preview.appendChild(video);
    }
    currentSource = 'file';
  });

  runBtn && runBtn.addEventListener('click', ()=>{
    // placeholder run behavior
    if(currentSource === 'camera'){
      alert('Running object detection on live camera (demo placeholder).');
    } else if(currentSource === 'file'){
      alert('Running object detection on selected file (demo placeholder).');
    } else {
      alert('Select Real-time or Local file first.');
    }
  });

});
