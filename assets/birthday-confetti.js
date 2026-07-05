(function(){
  if(!document.getElementById('root'))return;
  var canvas=document.createElement('canvas');
  canvas.id='birthday-canvas';
  canvas.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999';
  document.body.appendChild(canvas);
  var ctx=canvas.getContext('2d');
  var W,H;
  function resize(){
    W=canvas.width=window.innerWidth;
    H=canvas.height=window.innerHeight;
  }
  resize();
  window.addEventListener('resize',resize);
  var particles=[];
  var colors=['#f43f5e','#fb7185','#fda4af','#fbbf24','#fef08a','#e11d48','#fff'];
  var TOTAL=180;
  function random(a,b){return Math.random()*(b-a)+a}
  function createParticle(){
    return{
      x:random(0,W),y:random(-H,-20),
      w:random(3,10),h:random(3,10),
      color:colors[Math.floor(Math.random()*colors.length)],
      vx:random(-1,1),vy:random(1,4),
      rot:random(0,360),rotV:random(-3,3),
      opacity:random(0.5,1),
      swing:random(0,Math.PI*2),swingAmp:random(0,1.5),
      type:Math.random()>0.5?'rect':'heart'
    };
  }
  for(var i=0;i<TOTAL;i++)particles.push(createParticle());
  function drawHeart(x,y,s,color,opacity){
    ctx.save();
    ctx.translate(x,y);
    ctx.scale(s/12,s/12);
    ctx.globalAlpha=opacity;
    ctx.fillStyle=color;
    ctx.beginPath();
    ctx.moveTo(0,5);
    ctx.bezierCurveTo(-10,-8,-20,2,0,14);
    ctx.bezierCurveTo(20,2,10,-8,0,5);
    ctx.fill();
    ctx.restore();
  }
  var elapsed=0;
  function loop(){
    elapsed++;
    ctx.clearRect(0,0,W,H);
    for(var i=0;i<particles.length;i++){
      var p=particles[i];
      p.swing+=0.02;
      p.x+=p.vx+Math.sin(p.swing)*p.swingAmp;
      p.y+=p.vy;
      p.rot+=p.rotV;
      p.opacity-=0.001;
      ctx.save();
      ctx.globalAlpha=Math.max(0,p.opacity);
      ctx.translate(p.x,p.y);
      ctx.rotate(p.rot*Math.PI/180);
      ctx.fillStyle=p.color;
      if(p.type==='heart'){
        ctx.restore();
        drawHeart(p.x,p.y,p.w,p.color,Math.max(0,p.opacity));
      }else{
        ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);
        ctx.restore();
      }
      if(p.y>H+20||p.opacity<=0){
        particles[i]=createParticle();
        particles[i].y=random(-20,-5);
        particles[i].opacity=1;
      }
    }
    if(elapsed<600)requestAnimationFrame(loop);
    else{
      var fade=setInterval(function(){
        ctx.clearRect(0,0,W,H);
        var alive=false;
        for(var i=0;i<particles.length;i++){
          var p=particles[i];
          p.y+=p.vy;
          p.opacity-=0.02;
          if(p.opacity>0){
            alive=true;
            ctx.save();
            ctx.globalAlpha=Math.max(0,p.opacity);
            ctx.fillStyle=p.color;
            ctx.fillRect(p.x-p.w/2,p.y-p.h/2,p.w,p.h);
            ctx.restore();
          }
        }
        if(!alive){clearInterval(fade);canvas.remove()}
      },50);
    }
  }
  setTimeout(function(){loop()},500);
})();
