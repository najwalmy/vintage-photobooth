(async function () {
  let data = JSON.parse(localStorage.getItem('photobooth_shots') || '[]');
  if (!data || data.length === 0) {
    data = [
      "https://picsum.photos/320/240?1",
      "https://picsum.photos/320/240?2",
      "https://picsum.photos/320/240?3",
      "https://picsum.photos/320/240?4"
    ];
  }

  const frameW = 320, frameH = 240, frames = 4, seam = 6;
  const border = 12; 
  const canvas = document.getElementById('stripCanvas');
  const ctx = canvas.getContext('2d');

  const canvasW = frameW + border * 2;
  const canvasH = frameH * frames + (frames - 1) * seam + border * 2;
  canvas.width = canvasW;
  canvas.height = canvasH;

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvasW, canvasH);

  for (let i = 0; i < frames; i++) {
    await new Promise(res => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const y = border + i * (frameH + seam);
        ctx.drawImage(img, border, y, frameW, frameH);
        res();
      };
      img.src = data[i];
    });
  }

  ctx.lineWidth = border;
  ctx.strokeStyle = "black";
  ctx.strokeRect(border / 2, border / 2, canvasW - border, canvasH - border);

  document.getElementById('downloadBtn').addEventListener('click', e => {
    e.target.href = canvas.toDataURL('image/png');
    e.target.download = 'photostrip.png';
  });

  document.getElementById('printBtn').addEventListener('click', () => {
    const url = canvas.toDataURL('image/png');
    const w = window.open('');
    w.document.write(`<img src="${url}" style="width:100%">`);
    w.document.close();
    w.print();
  });
})();

