import React, { useRef, useEffect } from "react";

// TAIKO MASS — the site.
// Hero descends through three fields: A Fade → B Square → C Mass.
// Energy forming into matter. Builds primary, essays secondary. Monospace only.

const C = { void: "#06070b", ink:"#0b0d14", ash: "#7d8596", pale: "#c9cdd6", ember: "#d98a6a" };

const BUILDS = [
  { title: "Navigator", note: "Cognitive workspace", status: "Refinement", href:"#" },
  { title: "SOMA", note: "Neuroinflammatory food mapping", status: "Development", href:"#" },
  { title: "Wordmark", note: "Identity-to-interface compiler", status: "Building", href:"#" },
  { title: "Orbit", note: "Discovery platform for makers", status: "Prototype", href:"#" },
];
const ESSAYS = [
  { title: "What Is Eating You", note: "On the system that consumes attention", href:"#" },
  { title: "The Ecology of Awareness", note: "Consciousness in information fields", href:"#" },
  { title: "On the Edge", note: "Marginality as a driver of change", href:"#" },
  { title: "The Open Loop", note: "The body as process", href:"#" },
];

function useMembrane(canvasRef) {
  const s = useRef({ tx: 0.5, ty: 0.45, x: 0.5, y: 0.45, t: 0, reduced: false });
  useEffect(() => {
    s.current.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const m = (e) => {
      const el = canvasRef && canvasRef.current;
      if(el){ const r = el.getBoundingClientRect();
        s.current.tx = (e.clientX - r.left) / r.width;
        s.current.ty = (e.clientY - r.top) / r.height;
      } else { s.current.tx = e.clientX / innerWidth; s.current.ty = e.clientY / innerHeight; }
    };
    addEventListener("pointermove", m);
    return () => removeEventListener("pointermove", m);
  }, [canvasRef]);
  return s;
}

// ---------- A · FADE + METEORITE BURN-UP (movement only) ----------
function FieldFade() {
  const ref = useRef(null); const s = useMembrane(ref);
  const last = useRef({ x:0, y:0, has:false });
  useEffect(() => {
    const cv = ref.current, ctx = cv.getContext("2d"); let W,H,DPR,raf;
    const rs = () => { DPR=Math.min(devicePixelRatio||1,2); W=cv.clientWidth; H=cv.clientHeight; cv.width=W*DPR; cv.height=H*DPR; ctx.setTransform(DPR,0,0,DPR,0,0); };
    rs(); addEventListener("resize", rs);

    // movement releases an expanding bloom; reach scales with cursor speed
    const blooms = [];
    const onMove = (e) => {
      const r=cv.getBoundingClientRect();
      const x=e.clientX-r.left, y=e.clientY-r.top; const L=last.current;
      // ignore the cursor when it's outside this panel
      if(x<0||y<0||x>r.width||y>r.height){ L.has=false; return; }
      if(L.has){
        const dx=x-L.x, dy=y-L.y; const sp=Math.hypot(dx,dy);
        if(sp>1.5){
          const reach = Math.min(Math.max(r.width,r.height)*1.1, 100 + sp*22);
          blooms.push({ x, y, r:8, max:reach, life:1, hot:Math.min(1, sp/45) });
        }
      }
      L.x=x; L.y=y; L.has=true;
    };
    addEventListener("pointermove", onMove);

    const draw = () => {
      const st=s.current; st.t+=0.016;
      // soft photographic dawn fade — blue top, warm peach-grey base (matches the photo)
      const g = ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0.00,"#9fb0c9");
      g.addColorStop(0.35,"#aeb6c0");
      g.addColorStop(0.60,"#c8c0b8");
      g.addColorStop(0.80,"#d8b9a3");
      g.addColorStop(0.92,"#c79f9c");
      g.addColorStop(1.00,"#9a8e93");
      ctx.fillStyle=g; ctx.fillRect(0,0,W,H);

      ctx.globalCompositeOperation="lighter";
      for(let i=blooms.length-1;i>=0;i--){ const p=blooms[i];
        // expand toward max, then fade
        p.r += (p.max - p.r) * 0.08;   // easing expansion across the page
        p.life -= 0.022;               // then dissipates
        if(p.life<=0){ blooms.splice(i,1); continue; }
        const rg=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r);
        const a=p.life*0.13;
        rg.addColorStop(0,`rgba(255,${190-p.hot*40},${215-p.hot*30},${a})`);
        rg.addColorStop(0.45,`rgba(236,120,150,${a*0.5})`);
        rg.addColorStop(1,"rgba(220,90,140,0)");
        ctx.fillStyle=rg; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,6.28); ctx.fill();
      }
      ctx.globalCompositeOperation="source-over";
      raf=requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); removeEventListener("resize", rs); removeEventListener("pointermove", onMove); };
  }, []);
  return <canvas ref={ref} style={{ width:"100%", height:"100%", display:"block" }} />;
}

// Colour sets for the square field — the single source of truth for its colours.
const SQUARE_PALETTES = {
  dawn: {
    bands: [
      { h:0.30, c1:"#0c1430", c2:"#141d3a" },
      { h:0.16, c1:"#141d3a", c2:"#2a2748" },
      { h:0.14, c1:"#2a2748", c2:"#5e3a52" },
      { h:0.14, c1:"#5e3a52", c2:"#9c4f55" },
      { h:0.14, c1:"#9c4f55", c2:"#cf6b4a" },
      { h:0.12, c1:"#cf6b4a", c2:"#e69a5c" },
    ],
    seam: ["rgba(20,16,34,0)","rgba(14,12,26,0.7)","rgba(20,16,34,0)"],
    form: [
      [0.00,"rgba(150,76,108,0.82)"], [0.30,"rgba(196,92,104,0.86)"],
      [0.58,"rgba(232,118,86,0.9)"],  [0.82,"rgba(250,170,96,0.93)"],
      [1.00,"rgba(255,214,150,0.95)"],
    ],
    refTint: ["rgba(255,168,110,0.5)","rgba(255,168,110,0.02)"],
    edge: "255,228,196",
  },
  sun: {
    bands: [
      { h:0.34, c1:"#0a1c40", c2:"#13294d" },
      { h:0.14, c1:"#1c4450", c2:"#2a5a55" },
      { h:0.12, c1:"#356147", c2:"#4a7350" },
      { h:0.12, c1:"#a87f35", c2:"#c39443" },
      { h:0.16, c1:"#cf6238", c2:"#dd7544" },
      { h:0.12, c1:"#b83c54", c2:"#c2425a" },
    ],
    seam: ["rgba(26,15,28,0)","rgba(18,10,20,0.7)","rgba(26,15,28,0)"],
    form: [
      [0.00,"rgba(255,206,64,0.92)"], [0.30,"rgba(252,168,52,0.9)"],
      [0.58,"rgba(248,120,56,0.88)"], [0.80,"rgba(242,84,66,0.86)"],
      [1.00,"rgba(234,52,58,0.84)"],
    ],
    refTint: ["rgba(236,58,58,0.45)","rgba(236,58,58,0.02)"],
    edge: "255,224,180",
  },
};

// ---------- B · SQUARE — haze bands that blend on movement, resettle on stillness ----------
function FieldSquare({ palette = "dawn" }) {
  const ref = useRef(null); const s = useMembrane(ref);
  const motion = useRef({ d: 0, lx: 0, ly: 0, has: false, phase: 0, vel: 0 });
  useEffect(() => {
    const PAL = SQUARE_PALETTES[palette] || SQUARE_PALETTES.dawn;
    const cv = ref.current, ctx = cv.getContext("2d"); let W,H,DPR,raf;
    // offscreen buffer holds the crisp banded field; we blur it by `disturbance`
    const buf = document.createElement("canvas");
    const bx = buf.getContext("2d");
    const rs = () => { DPR=Math.min(devicePixelRatio||1,2); W=cv.clientWidth; H=cv.clientHeight;
      cv.width=W*DPR; cv.height=H*DPR; ctx.setTransform(DPR,0,0,DPR,0,0);
      buf.width=W; buf.height=H; paintBuffer(); };

    const upper = PAL.bands;

    // paint the settled banded field into the buffer (lower opacity = delicate sea)
    const paintBuffer = () => {
      const seamY=H*0.56, seamH=H*0.04, upH=seamY-seamH/2;
      bx.clearRect(0,0,W,H);
      const A=0.6; // global band opacity — a softer sea of colour
      const band=(y,h,c1,c2)=>{ const g=bx.createLinearGradient(0,y,0,y+h); g.addColorStop(0,c1); g.addColorStop(1,c2); return g; };
      bx.globalAlpha=A;
      let y=0;
      for(const b of upper){ const bh=b.h*upH; bx.fillStyle=band(y,bh,b.c1,b.c2); bx.fillRect(0,y,W,bh+1); y+=bh; }
      y=seamY+seamH/2; const lowH=H-(seamY+seamH/2);
      for(let i=upper.length-1;i>=0;i--){ const b=upper[i]; const bh=b.h*lowH;
        bx.fillStyle=band(y,bh,b.c2,b.c1); bx.fillRect(0,y,W,bh+1);
        bx.fillStyle="rgba(6,5,11,0.42)"; bx.fillRect(0,y,W,bh+1); y+=bh; }
      bx.globalAlpha=1;
      // fading seam
      const sg=bx.createLinearGradient(0,seamY-seamH*1.8,0,seamY+seamH*1.8);
      sg.addColorStop(0,PAL.seam[0]); sg.addColorStop(0.5,PAL.seam[1]); sg.addColorStop(1,PAL.seam[2]);
      bx.fillStyle=sg; bx.fillRect(0,seamY-seamH*1.8,W,seamH*3.6);
    };

    rs(); addEventListener("resize", rs);

    const onMove = (e) => {
      const r=cv.getBoundingClientRect();
      const x=e.clientX-r.left, y=e.clientY-r.top; const m=motion.current;
      if(x<0||y<0||x>r.width||y>r.height){ m.has=false; return; }
      if(m.has){ const sp=Math.hypot(x-m.lx, y-m.ly);
        m.d = Math.min(1, m.d + sp*0.012);
        m.vel = Math.min(0.05, m.vel + sp*0.0012);
      }
      m.lx=x; m.ly=y; m.has=true;
    };
    addEventListener("pointermove", onMove);

    // morph helper: returns N points for square/circle/triangle, then blends them
    const NPTS = 96;
    const shapePoints = (kind, cx, cy, rad) => {
      const pts=[];
      for(let i=0;i<NPTS;i++){
        const u=i/NPTS;                 // 0..1 around the perimeter
        let x,y;
        if(kind==="circle"){
          const a=u*Math.PI*2 - Math.PI/2; x=cx+Math.cos(a)*rad; y=cy+Math.sin(a)*rad;
        } else if(kind==="square"){
          // walk the 4 sides
          const s=u*4, side=Math.floor(s), f=s-side; const r=rad;
          if(side===0){ x=cx-r+2*r*f; y=cy-r; }
          else if(side===1){ x=cx+r; y=cy-r+2*r*f; }
          else if(side===2){ x=cx+r-2*r*f; y=cy+r; }
          else { x=cx-r; y=cy+r-2*r*f; }
        } else { // triangle (pointing up)
          const s=u*3, side=Math.floor(s)%3, f=s-side; const r=rad*1.18;
          const verts=[ [cx, cy-r], [cx+r*0.866, cy+r*0.5], [cx-r*0.866, cy+r*0.5] ];
          const a=verts[side], b=verts[(side+1)%3];
          x=a[0]+(b[0]-a[0])*f; y=a[1]+(b[1]-a[1])*f;
        }
        pts.push([x,y]);
      }
      return pts;
    };
    const lerpShapes = (A,B,t)=>A.map((p,i)=>[p[0]+(B[i][0]-p[0])*t, p[1]+(B[i][1]-p[1])*t]);
    const ORDER=["square","circle","triangle"]; // cycle, loops back to square

    const draw = () => {
      const st=s.current; st.t+=0.016; const m=motion.current;
      if(!st.reduced){
        m.d += (0 - m.d) * 0.03;
        if(m.vel > 0.0015){
          m.phase = (m.phase + m.vel) % 3;   // morphing under cursor speed
          m.vel *= 0.955;
        } else {
          // cursor stopped — glide smoothly all the way onto the nearest shape
          m.vel = 0;
          const cur = m.phase % 3;
          let target = Math.round(cur) % 3;
          let diff = target - cur;
          if(diff > 1.5) diff -= 3;
          if(diff < -1.5) diff += 3;
          // exponential ease — approaches target asymptotically, no jump
          m.phase = (cur + diff * 0.08 + 3) % 3;
        }
      }
      const baseBlur = 16;
      const blur = baseBlur + m.d * 30;
      ctx.clearRect(0,0,W,H);
      ctx.save(); ctx.filter=`blur(${blur}px)`; ctx.drawImage(buf,-40,-40,W+80,H+80); ctx.restore();

      const seamY=H*0.5, seamH=H*0.04, rad=Math.min(W,H)*0.21;
      const cx=W/2, cy=H*0.5; // dead center
      const refSeam = cy + rad + H*0.02; // fold sits just below the form

      const seg=Math.floor(m.phase), f=m.phase-seg;
      const ease=f<0.5 ? 2*f*f : 1-Math.pow(-2*f+2,2)/2;
      const cur=shapePoints(ORDER[seg%3], cx, cy, rad);
      const nxt=shapePoints(ORDER[(seg+1)%3], cx, cy, rad);
      const shape=lerpShapes(cur,nxt,ease);

      const drawPath=(g)=>{ g.beginPath(); g.moveTo(shape[0][0],shape[0][1]);
        for(let i=1;i<shape.length;i++) g.lineTo(shape[i][0],shape[i][1]); g.closePath(); };

      // soft mirrored reflection below the seam
      ctx.save(); ctx.globalAlpha=0.22; ctx.filter=`blur(${5+m.d*8}px)`;
      const refShape=shape.map(p=>[p[0], refSeam + (refSeam-p[1])]);
      ctx.beginPath(); ctx.moveTo(refShape[0][0],refShape[0][1]);
      for(let i=1;i<refShape.length;i++) ctx.lineTo(refShape[i][0],refShape[i][1]); ctx.closePath();
      const refg=ctx.createLinearGradient(0,refSeam,0,refSeam+rad*2);
      refg.addColorStop(0,PAL.refTint[0]); refg.addColorStop(1,PAL.refTint[1]);
      ctx.fillStyle=refg; ctx.fill();
      ctx.restore();

      // THE FORM — sun gradient from the image: golden top, soft fade into red
      // edges soften while morphing, ease back to crisp as it settles
      const morphRate = Math.abs(m.vel) + (m.d * 0.002);
      const edgeSoft = Math.min(7, morphRate * 90);
      const pg=ctx.createLinearGradient(0,cy-rad,0,cy+rad);
      for(const [stop,col] of PAL.form) pg.addColorStop(stop,col);
      ctx.save();
      ctx.filter = `blur(${edgeSoft}px)`;
      drawPath(ctx); ctx.fillStyle=pg; ctx.fill();
      ctx.restore();
      // hairline edge fades out as the form softens during morph
      drawPath(ctx);
      ctx.strokeStyle=`rgba(${PAL.edge}, ${0.45 * (1 - Math.min(1, m.vel*30))})`;
      ctx.lineWidth=1; ctx.stroke();

      raf=requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); removeEventListener("resize", rs); removeEventListener("pointermove", onMove); };
  }, [palette]);
  return <canvas ref={ref} style={{ width:"100%", height:"100%", display:"block" }} />;
}

// ---------- C · MASS — layered filament sphere (smoke/fascia strata) ----------
function FieldMass() {
  const ref = useRef(null); const s = useMembrane(ref);
  useEffect(() => {
    const cv = ref.current, ctx = cv.getContext("2d"); let W,H,DPR,raf;
    const rs = () => { DPR=Math.min(devicePixelRatio||1,2); W=cv.clientWidth; H=cv.clientHeight; cv.width=W*DPR; cv.height=H*DPR; ctx.setTransform(DPR,0,0,DPR,0,0); };
    rs(); addEventListener("resize", rs);

    // Build filament strands: chains of points in normalized sphere space,
    // clustered into horizontal strata, denser at the equator (the layered look).
    const STRANDS = 220, SEG = 20;
    const strands = [];
    for(let i=0;i<STRANDS;i++){
      const yb = (Math.random()*2-1);
      const y0 = Math.sign(yb)*Math.pow(Math.abs(yb),1.5) * 0.92;
      let x0 = (Math.random()*2-1)*0.95;
      const pts=[];
      let px=x0, py=y0;
      const dir = (Math.random()<0.5?-1:1);
      const wave = 0.015+Math.random()*0.03;
      for(let j=0;j<SEG;j++){
        pts.push([px,py]);
        px += dir*(0.04+Math.random()*0.04);
        py += Math.sin(j*0.6+i)*wave + (Math.random()*2-1)*0.012;
      }
      strands.push({ pts, seed:Math.random()*6.28, spd:0.2+Math.random()*0.5,
        amp:0.012+Math.random()*0.03, bright:0.3+Math.random()*0.7 });
    }

    const draw = () => {
      const st=s.current; st.t+=0.016;
      st.x += (st.tx-st.x)*(st.reduced?0:0.015);
      st.y += (st.ty-st.y)*(st.reduced?0:0.015);
      ctx.clearRect(0,0,W,H);
      const cx=W*0.5, cy=H*0.46, R=Math.min(W,H)*0.36;
      const mx=st.x*W, my=st.y*H, MR=Math.min(W,H)*0.5;
      const rot = st.reduced?0:st.t*0.02;
      const skew = Math.sin(rot)*0.05; // very subtle volumetric sway

      ctx.lineCap="round"; ctx.lineJoin="round";
      ctx.globalCompositeOperation="lighter";
      for(const str of strands){
        // compute screen points; fade alpha near sphere boundary instead of dropping
        const sp=[]; let avgFade=0, n=0;
        for(let j=0;j<str.pts.length;j++){
          let [nx,ny]=str.pts[j];
          if(!st.reduced){
            nx += Math.sin(st.t*0.3*str.spd + str.seed + j*0.4)*str.amp;
            ny += Math.cos(st.t*0.25*str.spd + str.seed + j*0.3)*str.amp*0.6;
          }
          const r=Math.sqrt(nx*nx+ny*ny);
          // contain within a sphere: hard cutoff at the boundary, soft fade approaching it
          const fade = r>1 ? 0 : Math.min(1, (1-r)*3.0);
          let X = cx + nx*R + ny*skew*R;
          let Y = cy + ny*R;
          const dx=X-mx, dy=Y-my, d=Math.hypot(dx,dy);
          if(d<MR){ const f=(1-d/MR); const push=f*f*55; const a=Math.atan2(dy,dx);
            X+=Math.cos(a)*push; Y+=Math.sin(a)*push; }
          sp.push([X,Y,fade]); avgFade+=fade; n++;
        }
        avgFade = n?avgFade/n:0;
        if(avgFade<0.02) continue;
        // draw segment-by-segment so each fades by its own boundary distance —
        // gives a clean spherical silhouette, strands cut exactly at the edge
        for(let j=1;j<sp.length;j++){
          const f = Math.min(sp[j-1][2], sp[j][2]);
          if(f<=0) continue;
          ctx.beginPath(); ctx.moveTo(sp[j-1][0],sp[j-1][1]); ctx.lineTo(sp[j][0],sp[j][1]);
          ctx.strokeStyle=`rgba(210,218,230,${0.075*str.bright*f})`;
          ctx.lineWidth=2.2; ctx.stroke();
          ctx.strokeStyle=`rgba(246,250,255,${0.08*str.bright*f})`;
          ctx.lineWidth=0.8; ctx.stroke();
        }
      }
      ctx.globalCompositeOperation="source-over";

      // faint spherical containment edge
      ctx.beginPath(); ctx.arc(cx,cy,R*1.04,0,6.28);
      ctx.strokeStyle="rgba(170,182,200,0.045)"; ctx.lineWidth=1; ctx.stroke();

      raf=requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); removeEventListener("resize", rs); };
  }, []);
  return <canvas ref={ref} style={{ width:"100%", height:"100%", display:"block" }} />;
}


// ---------------- THE SITE ----------------

// Still frames: one painted frame, no animation loop. Shown on resting panels
// so only the hovered panel actually animates — far less motion at once.
function StillFade(){
  const ref=useRef(null);
  useEffect(()=>{ const cv=ref.current,ctx=cv.getContext("2d");
    const DPR=Math.min(devicePixelRatio||1,2); const W=cv.clientWidth,H=cv.clientHeight;
    cv.width=W*DPR;cv.height=H*DPR;ctx.setTransform(DPR,0,0,DPR,0,0);
    const g=ctx.createLinearGradient(0,0,0,H);
    g.addColorStop(0,"#9fb0c9");g.addColorStop(0.35,"#aeb6c0");g.addColorStop(0.6,"#c8c0b8");
    g.addColorStop(0.8,"#d8b9a3");g.addColorStop(0.92,"#c79f9c");g.addColorStop(1,"#9a8e93");
    ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  },[]);
  return <canvas ref={ref} style={{width:"100%",height:"100%",display:"block"}}/>;
}
function StillSquare(){
  const ref=useRef(null);
  useEffect(()=>{ const cv=ref.current,ctx=cv.getContext("2d");
    const DPR=Math.min(devicePixelRatio||1,2); const W=cv.clientWidth,H=cv.clientHeight;
    cv.width=W*DPR;cv.height=H*DPR;ctx.setTransform(DPR,0,0,DPR,0,0);
    const upper=[["#0a1c40","#13294d",0.34],["#1c4450","#2a5a55",0.14],["#356147","#4a7350",0.12],
      ["#a87f35","#c39443",0.12],["#cf6238","#dd7544",0.16],["#b83c54","#c2425a",0.12]];
    const seamY=H*0.5,seamH=H*0.04,upH=seamY-seamH/2; let y=0;
    ctx.globalAlpha=0.6;
    for(const [c1,c2,h] of upper){ const bh=h*upH; const bg=ctx.createLinearGradient(0,y,0,y+bh);
      bg.addColorStop(0,c1);bg.addColorStop(1,c2);ctx.fillStyle=bg;ctx.fillRect(0,y,W,bh+1);y+=bh; }
    y=seamY+seamH/2;const lowH=H-(seamY+seamH/2);
    for(let i=upper.length-1;i>=0;i--){ const [c1,c2,h]=upper[i];const bh=h*lowH;
      const bg=ctx.createLinearGradient(0,y,0,y+bh);bg.addColorStop(0,c2);bg.addColorStop(1,c1);
      ctx.fillStyle=bg;ctx.fillRect(0,y,W,bh+1);ctx.fillStyle="rgba(6,5,11,0.42)";ctx.fillRect(0,y,W,bh+1);y+=bh; }
    ctx.globalAlpha=1;
    // settled circle (a clean shape at rest), sun gradient
    const rad=Math.min(W,H)*0.21,cx=W/2,cy=H*0.5;
    const pg=ctx.createLinearGradient(0,cy-rad,0,cy+rad);
    pg.addColorStop(0,"rgba(255,206,64,0.92)");pg.addColorStop(0.3,"rgba(252,168,52,0.9)");
    pg.addColorStop(0.58,"rgba(248,120,56,0.88)");pg.addColorStop(0.8,"rgba(242,84,66,0.86)");
    pg.addColorStop(1,"rgba(234,52,58,0.84)");
    ctx.beginPath();ctx.arc(cx,cy,rad,0,6.28);ctx.fillStyle=pg;ctx.fill();
  },[]);
  return <canvas ref={ref} style={{width:"100%",height:"100%",display:"block"}}/>;
}
function StillMass(){
  // reuse the live mass but it will be replaced by full Comp on hover; a calm
  // single-frame approximation keeps the resting state quiet.
  const ref=useRef(null);
  useEffect(()=>{ const cv=ref.current,ctx=cv.getContext("2d");
    const DPR=Math.min(devicePixelRatio||1,2); const W=cv.clientWidth,H=cv.clientHeight;
    cv.width=W*DPR;cv.height=H*DPR;ctx.setTransform(DPR,0,0,DPR,0,0);
    ctx.fillStyle="#06070b";ctx.fillRect(0,0,W,H);
    const cx=W*0.5,cy=H*0.5,R=Math.min(W,H)*0.36;
    ctx.globalCompositeOperation="lighter";ctx.lineCap="round";
    for(let i=0;i<200;i++){
      const yb=(Math.random()*2-1);const y0=Math.sign(yb)*Math.pow(Math.abs(yb),1.5)*0.92;
      let nx=(Math.random()*2-1)*0.95,ny=y0;const dir=Math.random()<0.5?-1:1;
      ctx.beginPath();let started=false;
      for(let j=0;j<20;j++){ const r=Math.sqrt(nx*nx+ny*ny);
        if(r<=1){ const f=Math.min(1,(1-r)*3); const X=cx+nx*R,Y=cy+ny*R;
          if(!started){ctx.moveTo(X,Y);started=true;}else ctx.lineTo(X,Y);
          ctx.strokeStyle=`rgba(220,228,240,${0.06*f})`; }
        nx+=dir*(0.04+Math.random()*0.04);ny+=Math.sin(j*0.6+i)*0.025;
      }
      ctx.lineWidth=2;ctx.stroke();
    }
    ctx.globalCompositeOperation="source-over";
  },[]);
  return <canvas ref={ref} style={{width:"100%",height:"100%",display:"block"}}/>;
}

export default function TaikoMassSite() {
  return (
    <div style={{ background:C.void, color:C.pale, fontFamily:"'Space Mono', monospace" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');
        *{box-sizing:border-box;} body{margin:0;background:#06070b;}
        html{scroll-behavior:smooth;}
        a{color:inherit;text-decoration:none;}
        .lbl{letter-spacing:0.32em;text-transform:uppercase;font-size:10px;color:${C.ash};}
        .row{border-top:1px solid rgba(125,133,150,0.14);padding:26px 0;display:flex;justify-content:space-between;align-items:baseline;gap:24px;transition:border-color .5s,padding-left .4s;cursor:pointer;}
        .row:hover{border-color:rgba(217,138,106,0.5);padding-left:18px;}
        .row:hover .ttl{color:${C.ember};}
        .row:hover .arr{opacity:1;transform:translateX(0);}
        .ttl{transition:color .5s;}
        .arr{opacity:0;transform:translateX(-8px);transition:all .4s;color:${C.ember};}
        .panel{position:relative;flex:1;overflow:hidden;}
        :focus-visible{outline:1px solid ${C.ember};outline-offset:4px;}
        /* hero: a centered square field, edge-to-edge canvas */
        .hero3{display:flex;width:100%;max-width:880px;aspect-ratio:1/1;margin:0 auto;}
        @media(prefers-reduced-motion:reduce){html{scroll-behavior:auto;}}
      `}</style>

      {/* HERO — the Matter field, constrained to the content column (maxWidth 880, 40px gutters). */}
      <section className="hero" style={{ overflow:"hidden", padding:"0" }}>
        <div className="hero3">
          {/* .panel is position:relative — the square field box the labels pin to */}
          <div className="panel">
            <FieldSquare />
            <div className="lbl" style={{ position:"absolute", top:28, left:40, color:C.ember, pointerEvents:"none" }}>Taiko&nbsp;Mass</div>
          </div>
        </div>
      </section>

      {/* WORKS */}
      <main style={{ maxWidth:880, margin:"0 auto", padding:"12vh 40px 14vh", position:"relative", background:C.void }}>
        <div className="lbl" style={{ marginBottom:32 }}>Builds</div>
        {BUILDS.map((b,i)=>(
          <a key={i} href={b.href} className="row">
            <span className="ttl" style={{ fontSize:19, color:C.pale }}>{b.title}</span>
            <span style={{ flex:1, color:C.ash, fontSize:12 }}>{b.note}</span>
            <span className="lbl">{b.status}</span>
            <span className="arr" style={{ fontSize:14 }}>→</span>
          </a>
        ))}

        <div className="lbl" style={{ margin:"10vh 0 32px" }}>Writing</div>
        {ESSAYS.map((e,i)=>(
          <a key={i} href={e.href} className="row" style={{ padding:"22px 0" }}>
            <span className="ttl" style={{ fontSize:15, color:C.pale }}>{e.title}</span>
            <span style={{ flex:1, color:C.ash, fontSize:12 }}>{e.note}</span>
            <span className="arr" style={{ fontSize:13 }}>→</span>
          </a>
        ))}

        <div style={{ marginTop:"12vh", display:"flex", justifyContent:"space-between", borderTop:"1px solid rgba(125,133,150,0.14)", paddingTop:28 }}>
          <span className="lbl">Taiko Mass</span>
          <span className="lbl">West Flanders · {new Date().getFullYear()}</span>
        </div>
      </main>

      {/* ENERGY — a second square field, mirrored, hot "sun" palette. */}
      <section className="hero">
        <div className="hero3">
          <div className="panel">
            {/* flipped wrapper mirrors the field; label sits outside so text stays upright */}
            <div style={{ width:"100%", height:"100%", transform:"scaleY(-1)" }}>
              <FieldSquare palette="sun" />
            </div>
            <div className="lbl" style={{ position:"absolute", top:28, left:40, color:C.ember, pointerEvents:"none" }}>Energy</div>
          </div>
        </div>
      </section>
    </div>
  );
}
