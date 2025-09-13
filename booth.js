(async function(){
  const video=document.getElementById('camera');
  const takeBtn=document.getElementById('takeBtn');
  const upload=document.getElementById('upload');
  const countdownEl=document.getElementById('countdown');
  const canvas=document.getElementById('hiddenCanvas');
  const ctx=canvas.getContext('2d');
  let stream=null;

  async function startCamera(){
    try{
      stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user'}});
      video.srcObject=stream; await video.play();
    }catch(e){console.warn('Camera error',e);}
  }
  function stopCamera(){if(stream){stream.getTracks().forEach(t=>t.stop());stream=null;}}

  function applyVintage(){
    let imgData=ctx.getImageData(0,0,canvas.width,canvas.height);
    let d=imgData.data;
    for(let i=0;i<d.length;i+=4){
      let l=(d[i]+d[i+1]+d[i+2])/3;
      let v=(l-128)*1.4+128; v=v*0.95; v=Math.max(0,Math.min(255,v));
      d[i]=d[i+1]=d[i+2]=v;
    }
    ctx.putImageData(imgData,0,0);
  }
  function countdown(n){
    return new Promise(res=>{
      countdownEl.style.display='flex'; countdownEl.textContent=n;
      const id=setInterval(()=>{n--; if(n<=0){clearInterval(id);countdownEl.style.display='none';res();}else{countdownEl.textContent=n;}},1000);
    });
  }
  async function takeSequence(){
    const shots=[];
    for(let i=0;i<4;i++){
      await countdown(3);
      ctx.drawImage(video,0,0,canvas.width,canvas.height);
      applyVintage();
      shots.push(canvas.toDataURL('image/png'));
      await new Promise(r=>setTimeout(r,500));
    }
    localStorage.setItem('photobooth_shots',JSON.stringify(shots));
    stopCamera(); window.location='result.html';
  }
  upload.addEventListener('change',async e=>{
    const files=[...e.target.files].slice(0,4);
    const shots=[];
    for(let f of files){
      const img=await createImageBitmap(f);
      ctx.drawImage(img,0,0,canvas.width,canvas.height);
      applyVintage();
      shots.push(canvas.toDataURL('image/png'));
    }
    while(shots.length<4) shots.push(shots[shots.length-1]);
    localStorage.setItem('photobooth_shots',JSON.stringify(shots));
    stopCamera(); window.location='result.html';
  });
  takeBtn.addEventListener('click',takeSequence);
  startCamera();
  window.addEventListener('beforeunload',stopCamera);
})();