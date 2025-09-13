(async function(){
  let data = JSON.parse(localStorage.getItem('photobooth_shots')||'[]');
  if(!data || data.length===0){
    data = [
      "https://picsum.photos/320/240?1",
      "https://picsum.photos/320/240?2",
      "https://picsum.photos/320/240?3",
      "https://picsum.photos/320/240?4"
    ];
  }

  const frameW = 320, frameH = 240, frames = 4, border = 12;
  const canvas = document.getElementById('stripCanvas');
  const ctx = canvas.getContext('2d');

  const canvasW = frameW + border*2;
  const canvasH = frameH*frames + border*(frames+1);
  canvas.width = canvasW;
  canvas.height = canvasH;

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvasW, canvasH);

  for(let i=0;i<frames;i++){
    await new Promise(res=>{
      const img=new Image();
      img.crossOrigin="anonymous";
      img.onload=()=>{
        const y = border + i*(frameH + border);

        const imgRatio = img.width / img.height;
        const frameRatio = frameW / frameH;
        let sx, sy, sw, sh;
        if(imgRatio > frameRatio){
          sh = img.height;
          sw = sh * frameRatio;
          sx = (img.width - sw)/2;
          sy = 0;
        } else {
          sw = img.width;
          sh = sw / frameRatio;
          sx = 0;
          sy = (img.height - sh)/2;
        }

        ctx.drawImage(img, sx, sy, sw, sh, border, y, frameW, frameH);
        res();
      };
      img.src = data[i];
    });
  }

  document.getElementById('downloadBtn').addEventListener('click', e=>{
    e.target.href = canvas.toDataURL('image/png');
    e.target.download = 'photostrip.png';
  });
})();
