import React, { useState, useRef, useEffect } from "react";
import { sortedBuilds, sortedEssays, FOOTER_LINKS } from "./content";

// TAIKO MASS — the site.
// Hero descends through three fields: A Fade → B Square → C Mass.
// Energy forming into matter. Builds primary, essays secondary. Monospace only.

// Theme palettes. Dark = original. Light matches the Stripe-blog reference:
// warm near-white ground, near-black ink, hairline greys. In light mode the
// hero field canvases render at reduced opacity so they blend on white.
const THEMES = {
  dark:  { void:"#06070b", ink:"#0b0d14", ash:"#7d8596", pale:"#c9cdd6", ember:"#d98a6a", mint:"#00e5a0",
           rule:"rgba(125,133,150,0.14)", ruleHover:"rgba(217,138,106,0.5)", fieldOpacity:1, rrBg:"#faf8f5", rrInk:"#26262b", rrTitle:"#1a1a1a" },
  light: { void:"#f7f7f6", ink:"#eeeeec", ash:"#6b6b6b", pale:"#1a1a1a", ember:"#c56a44", mint:"#0a9c6e",
           rule:"rgba(30,30,30,0.12)", ruleHover:"rgba(197,106,68,0.5)", fieldOpacity:0.82, rrBg:"#faf8f5", rrInk:"#26262b", rrTitle:"#1a1a1a" },
};
// Default (dark) — non-theme-aware references still resolve to this.
const C = THEMES.dark;

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
    const blooms = [];
    const onMove = (e) => {
      const r=cv.getBoundingClientRect();
      const x=e.clientX-r.left, y=e.clientY-r.top; const L=last.current;
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
        p.r += (p.max - p.r) * 0.08;
        p.life -= 0.022;
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
function FieldSquare({ palette = "dawn", fieldOpacity = 1, line = false }) {
  const ref = useRef(null); const s = useMembrane(ref);
  // phase indexes ORDER = ["square","circle","triangle"]; start on the triangle (2)
  const motion = useRef({ d: 0, lx: 0, ly: 0, has: false, phase: 2, vel: 0 });
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
      const sg=bx.createLinearGradient(0,seamY-seamH*1.8,0,seamY+seamH*1.8);
      sg.addColorStop(0,PAL.seam[0]); sg.addColorStop(0.5,PAL.seam[1]); sg.addColorStop(1,PAL.seam[2]);
      bx.fillStyle=sg; bx.fillRect(0,seamY-seamH*1.8,W,seamH*3.6);
    };
    rs(); addEventListener("resize", rs);
    // in-app browsers (link previews) don't reliably fire window 'resize' after
    // late layout, leaving the canvas measured at the wrong size → distorted field.
    // A ResizeObserver re-measures whenever the element's own box changes.
    let ro;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => { if (cv.clientWidth && cv.clientHeight) rs(); });
      ro.observe(cv);
    }
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
          m.phase = (cur + diff * 0.08 + 3) % 3;
        }
      }
      ctx.clearRect(0,0,W,H);
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

      if(line){
        // LINE-ART MODE (light theme): fine grey strata lines + outlined shape,
        // on transparent so the white page shows through. Matches the Stripe figure.
        const ink = "40,40,44";
        // horizontal strata — evenly spaced fine lines, denser toward the horizon
        const lines = 26;
        for(let i=0;i<lines;i++){
          const t = i/(lines-1);
          const y = t*H;
          // fade toward top/bottom, strongest near the seam
          const nearSeam = 1 - Math.min(1, Math.abs(y - seamY)/(H*0.5));
          const a = 0.05 + nearSeam*0.10;
          ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y);
          ctx.strokeStyle=`rgba(${ink},${a})`; ctx.lineWidth=1; ctx.stroke();
        }
        // the dark horizon band as two slightly stronger lines
        ctx.strokeStyle=`rgba(${ink},0.28)`; ctx.lineWidth=1;
        ctx.beginPath(); ctx.moveTo(0,seamY-seamH/2); ctx.lineTo(W,seamY-seamH/2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0,seamY+seamH/2); ctx.lineTo(W,seamY+seamH/2); ctx.stroke();
        // reflected outline (fainter, below the seam)
        const refShape=shape.map(p=>[p[0], refSeam + (refSeam-p[1])]);
        ctx.beginPath(); ctx.moveTo(refShape[0][0],refShape[0][1]);
        for(let i=1;i<refShape.length;i++) ctx.lineTo(refShape[i][0],refShape[i][1]); ctx.closePath();
        ctx.strokeStyle=`rgba(${ink},0.14)`; ctx.lineWidth=1; ctx.stroke();
        // the morph shape as a clean stroked outline
        drawPath(ctx);
        ctx.strokeStyle=`rgba(${ink},0.7)`; ctx.lineWidth=1.4; ctx.stroke();
      } else {
        // FILLED MODE (dark theme): the original painted field
        ctx.drawImage(buf,-40,-40,W+80,H+80);
        ctx.save(); ctx.globalAlpha=0.18;
        const refShape=shape.map(p=>[p[0], refSeam + (refSeam-p[1])]);
        ctx.beginPath(); ctx.moveTo(refShape[0][0],refShape[0][1]);
        for(let i=1;i<refShape.length;i++) ctx.lineTo(refShape[i][0],refShape[i][1]); ctx.closePath();
        const refg=ctx.createLinearGradient(0,refSeam,0,refSeam+rad*2);
        refg.addColorStop(0,PAL.refTint[0]); refg.addColorStop(1,PAL.refTint[1]);
        ctx.fillStyle=refg; ctx.fill();
        ctx.restore();
        const pg=ctx.createLinearGradient(0,cy-rad,0,cy+rad);
        for(const [stop,col] of PAL.form) pg.addColorStop(stop,col);
        drawPath(ctx); ctx.fillStyle=pg; ctx.fill();
        drawPath(ctx);
        ctx.strokeStyle=`rgba(${PAL.edge}, ${0.45 * (1 - Math.min(1, m.vel*30))})`;
        ctx.lineWidth=1; ctx.stroke();
      }
      raf=requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); removeEventListener("resize", rs); removeEventListener("pointermove", onMove); if(ro) ro.disconnect(); };
  }, [palette, line]);
  return <canvas ref={ref} style={{ width:"100%", height:"100%", display:"block", opacity:fieldOpacity, transition:"opacity .5s" }} />;
}

// ---------- C · MASS — layered filament sphere (smoke/fascia strata) ----------
function FieldMass() {
  const ref = useRef(null); const s = useMembrane(ref);
  useEffect(() => {
    const cv = ref.current, ctx = cv.getContext("2d"); let W,H,DPR,raf;
    const rs = () => { DPR=Math.min(devicePixelRatio||1,2); W=cv.clientWidth; H=cv.clientHeight; cv.width=W*DPR; cv.height=H*DPR; ctx.setTransform(DPR,0,0,DPR,0,0); };
    rs(); addEventListener("resize", rs);
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
        const sp=[]; let avgFade=0, n=0;
        for(let j=0;j<str.pts.length;j++){
          let [nx,ny]=str.pts[j];
          if(!st.reduced){
            nx += Math.sin(st.t*0.3*str.spd + str.seed + j*0.4)*str.amp;
            ny += Math.cos(st.t*0.25*str.spd + str.seed + j*0.3)*str.amp*0.6;
          }
          const r=Math.sqrt(nx*nx+ny*ny);
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

// ---------- Builds / Writing — click-to-expand accordion ----------
function WorkRow({ item, size, open, onOpen, onClose, onRead, T=THEMES.dark }){
  const hasUrl = item.url && item.url !== "#";
  const toggle = ()=> onOpen(open ? null : item._key);
  return (
    <div className="workrow" onMouseLeave={open ? onClose : undefined}>
      <div className="row" role="button" tabIndex={0}
        onClick={toggle}
        onKeyDown={(e)=>{ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); toggle(); } }}>
        <span className="ttl" style={{ fontSize:size, color:T.pale }}><GlitchText>{item.title}</GlitchText></span>
        <span style={{ flex:1, color:T.ash, fontSize:12 }}>{item.note}</span>
        {item.status && (
          <span className="lbl" style={{ color: item.status==="Live" ? T.mint : undefined }}>{item.status}</span>
        )}
        <span className="arr" style={{ fontSize:14, transform: open ? "rotate(90deg)" : "rotate(0deg)" }}>→</span>
      </div>
      <div className={open ? "preview" : "preview closing"} style={{ maxHeight: open ? 260 : 0 }}>
        <div className="preview-inner">
          {!item.body && !item.page && (
            <div className="preview-thumb">
              <span className="lbl" style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", color:T.ash, textAlign:"center", padding:"0 12px" }}>{item.title}</span>
              {item.thumb && (
                <img src={item.thumb} alt={item.title}
                  style={{ position:"relative", width:"100%", height:"100%", objectFit:"contain" }}
                  onError={(e)=>{ e.currentTarget.style.display="none"; }} />
              )}
            </div>
          )}
          <div className="preview-body">
            <p style={{ margin:0, color:T.pale, fontSize:13, lineHeight:1.65 }}>{item.blurb}</p>
            <div style={{ display:"flex", gap:20, alignItems:"center" }}>
              {item.page && (
                <a className="visit" href={item.page}>Read ↗</a>
              )}
              {!item.page && item.body && (
                <button className="visit" onClick={()=>onRead(item)}
                  style={{ background:"none", border:"none", cursor:"pointer", padding:"6px 0" }}>Read ↗</button>
              )}
              {!item.page && !item.body && hasUrl && (
                <a className="visit" href={item.url} target="_blank" rel="noopener">Visit ↗</a>
              )}
              {!item.page && !item.body && !hasUrl && (
                <span className="visit" style={{ opacity:0.5 }}>Coming soon</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WorkList({ items, size, onRead, T=THEMES.dark }){
  const [openKey, setOpenKey] = useState(null);
  const timer = useRef(null);
  const setOpen = (key)=>{ clearTimeout(timer.current); setOpenKey(key); };
  const closeSoon = ()=>{ clearTimeout(timer.current); timer.current = setTimeout(()=>setOpenKey(null), 220); };
  useEffect(()=>()=>clearTimeout(timer.current), []);
  return (
    <div>
      {items.map((item,i)=>{
        const key = item.title + i;
        item._key = key;
        return <WorkRow key={key} item={item} size={size} open={openKey===key} onOpen={setOpen} onClose={closeSoon} onRead={onRead} T={T} />;
      })}
    </div>
  );
}

// ---------- Essay reading room — tiny markdown renderer ----------
function renderInline(text){
  // split on **bold** / *italic*, keeping the delimiters
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((p,i)=>{
    if(p.startsWith("**") && p.endsWith("**")) return <strong key={i}>{p.slice(2,-2)}</strong>;
    if(p.startsWith("*") && p.endsWith("*")) return <em key={i}>{p.slice(1,-1)}</em>;
    return <span key={i}>{p}</span>;
  });
}

function Markdown({ text }){
  const blocks = text.split(/\n\s*\n/);
  return blocks.map((block,i)=>{
    const b = block.trim();
    if(!b) return null;
    if(b.startsWith("## ")) return <h2 key={i} className="rr-h2">{renderInline(b.slice(3))}</h2>;
    if(b.startsWith("> ")) return <blockquote key={i} className="rr-quote">{renderInline(b.slice(2))}</blockquote>;
    return <p key={i} className="rr-p">{renderInline(b)}</p>;
  });
}

function ReadingRoom({ essay, onClose, T=THEMES.dark }){
  useEffect(()=>{
    if(!essay) return;
    const onKey = (e)=>{ if(e.key==="Escape") onClose(); };
    addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return ()=>{ removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [essay, onClose]);
  if(!essay) return null;
  return (
    <div className="rr-scroll" onClick={onClose}>
      <div className="rr-bg" />
      <div className="rr-scrim" />
      <button className="rr-close" onClick={(e)=>{ e.stopPropagation(); onClose(); }}>✕</button>
      <div className="rr-fade" onClick={(e)=>e.stopPropagation()}>
        <article className="rr-col">
          <div className="lbl" style={{ color:C.ember }}>{essay.date}</div>
          <h1 className="rr-title">{essay.title}</h1>
          <div className="lbl" style={{ color:"#8a8a90" }}>{essay.note}</div>
          <Markdown text={essay.body} />
          {essay.url!=="#" && (
            <a className="visit" href={essay.url} target="_blank" rel="noopener" style={{ color:C.ember }}>Read on the web ↗</a>
          )}
        </article>
      </div>
    </div>
  );
}

// Scramble/decode flicker on hover — letters cycle through glitch glyphs then
// resettle to the SAME text (for build/essay titles). Same char effect as the wordmark.
function GlitchText({ children, style, className }){
  const target = typeof children === "string" ? children : "";
  const [text, setText] = useState(target);
  const [on, setOn] = useState(false);
  const raf = useRef(null);
  const frame = useRef(0);
  useEffect(()=>{ setText(target); }, [target]);

  const scramble = () => {
    cancelAnimationFrame(raf.current);
    setOn(true);
    const queue = [];
    for (let i = 0; i < target.length; i++){
      const start = Math.floor(Math.random() * 8);
      const end = start + Math.floor(Math.random() * 12) + 5;
      queue.push({ ch: target[i], start, end, g: "" });
    }
    frame.current = 0;
    const run = () => {
      let out = "", done = 0;
      for (const q of queue){
        if (frame.current >= q.end){ done++; out += q.ch; }
        else if (frame.current >= q.start){
          if (q.ch === " ") { out += " "; done++; }
          else { if (!q.g || Math.random() < 0.3) q.g = GLYPHS[Math.floor(Math.random()*GLYPHS.length)]; out += q.g; }
        } else out += q.ch;
      }
      setText(out);
      if (done >= queue.length){ setText(target); setOn(false); return; }
      frame.current++;
      raf.current = requestAnimationFrame(run);
    };
    run();
  };
  useEffect(()=>()=>cancelAnimationFrame(raf.current), []);

  return (
    <span
      className={className}
      style={{ ...style, position:"relative", display:"inline-block", whiteSpace:"nowrap" }}
      onMouseEnter={scramble}
    >
      <span className={on ? "glitch-rgb" : ""} data-text={text}>{text}</span>
    </span>
  );
}

// ---------- Glitch wordmark: "Taiko Mass" ⇄ "Jack Vintage" on hover ----------
const GLITCH_A = "Taiko Mass";
const GLITCH_B = "Jack Vintage";
const GLYPHS = "!<>-_\\/[]{}—=+*^?#________";
// How much longer the return scramble (Jack Vintage → Taiko Mass) runs vs the
// flip out. 2× then increased by a third → 8/3 ≈ 2.67.
const RETURN_SCALE = 8 / 3;

function GlitchWordmark({ variant = "rgb", style, className }) {
  const [text, setText] = useState(GLITCH_A);
  const [glitching, setGlitching] = useState(false);
  const raf = useRef(null);
  const frame = useRef(0);

  // scale stretches the whole scramble (start stagger + per-char span); the
  // return to "Taiko Mass" passes scale=2 to run twice as long as the flip out.
  const scrambleTo = (from, to, scale = 1) => {
    cancelAnimationFrame(raf.current);
    const len = Math.max(from.length, to.length);
    const queue = [];
    for (let i = 0; i < len; i++) {
      const start = Math.floor(Math.random() * 5) * scale;
      const end = start + (Math.floor(Math.random() * 7) + 5) * scale; // +1 frame (~17ms) longer base
      queue.push({ fromCh: from[i] || "", toCh: to[i] || "", start, end, ch: "" });
    }
    frame.current = 0;
    setGlitching(true);
    const run = () => {
      let out = "", done = 0;
      for (const q of queue) {
        if (frame.current >= q.end) { done++; out += q.toCh; }
        else if (frame.current >= q.start) {
          if (q.toCh === " " && q.fromCh === " ") { out += " "; }
          else { if (!q.ch || Math.random() < 0.28) q.ch = GLYPHS[Math.floor(Math.random() * GLYPHS.length)]; out += q.ch; }
        } else out += q.fromCh;
      }
      setText(out);
      if (done === queue.length) { setText(to); setGlitching(false); return; }
      frame.current++;
      raf.current = requestAnimationFrame(run);
    };
    run();
  };

  const hovering = useRef(false);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  // Auto-blip: flash to "Jack Vintage" for 800ms, settle back to "Taiko Mass",
  // then wait 10s before the next one. Skipped while hovered so the pointer
  // stays in control and the two never collide.
  useEffect(() => {
    let timers = [];
    const cycle = () => {
      if (!hovering.current) scrambleTo(GLITCH_A, GLITCH_B);
      timers.push(setTimeout(() => {
        if (!hovering.current) scrambleTo(GLITCH_B, GLITCH_A, RETURN_SCALE);
        timers.push(setTimeout(cycle, 10000));
      }, 800));
    };
    timers.push(setTimeout(cycle, 10000));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <span
      className={className}
      style={{ position:"relative", display:"inline-block", cursor:"default", whiteSpace:"nowrap", ...style }}
      onMouseEnter={() => scrambleTo(GLITCH_A, GLITCH_B)}
      onMouseLeave={() => scrambleTo(GLITCH_B, GLITCH_A, RETURN_SCALE)}
      data-text={text}
    >
      <span className={variant === "rgb" && glitching ? "glitch-rgb" : ""} data-text={text}>{text}</span>
    </span>
  );
}

export default function TaikoMassSite() {
  const [reading, setReading] = useState(null);
  // Persist the theme choice across visits. A stored choice always wins; on a
  // first visit with nothing stored, default to dark at night (local time 20:00
  // through 06:59), otherwise light.
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("tm-theme");
    if (saved) return saved;
    const hour = new Date().getHours();
    return (hour >= 20 || hour < 7) ? "dark" : "light";
  });
  useEffect(() => { localStorage.setItem("tm-theme", theme); }, [theme]);
  const T = THEMES[theme];
  const isLight = theme === "light";
  return (
    <div style={{ background:T.void, color:T.pale, fontFamily:"'Space Mono', monospace", transition:"background .5s,color .5s" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');
        *{box-sizing:border-box;} body{margin:0;background:${T.void};transition:background .5s;}
        html{scroll-behavior:smooth;}
        a{color:inherit;text-decoration:none;}
        .lbl{letter-spacing:0.32em;text-transform:uppercase;font-size:10px;color:${T.ash};}
        .row{border-top:1px solid ${T.rule};padding:26px 0;display:flex;justify-content:space-between;align-items:baseline;gap:24px;transition:border-color .5s,padding-left .4s;cursor:pointer;}
        .row:hover{border-color:${T.ruleHover};padding-left:18px;}
        .row:hover .ttl{color:${T.ember};}
        .row:hover .arr{opacity:1;}
        .ttl{transition:color .5s;}
        .arr{opacity:0.5;transition:transform .4s cubic-bezier(0.16,1,0.3,1),opacity .4s,color .4s;color:${T.ember};}
        .preview{overflow:hidden;max-height:0;transition:max-height .8s cubic-bezier(0.22,0.61,0.36,1);}
        .preview.closing{transition:max-height .55s cubic-bezier(0.16,1,0.3,1);}
        .preview-inner{display:flex;gap:24px;padding:4px 0 30px;}
        .preview-thumb{position:relative;flex:0 0 240px;height:150px;border:1px solid ${T.rule};border-radius:2px;overflow:hidden;background:${isLight?"rgba(30,30,30,0.04)":"rgba(125,133,150,0.06)"};}
        .preview-body{flex:1;display:flex;flex-direction:column;gap:14px;}
        .visit{display:inline-block;color:${T.ember};padding:6px 0;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;transition:opacity .3s,letter-spacing .3s;}
        .visit:hover{opacity:0.7;letter-spacing:0.24em;}
        @media(max-width:680px){.preview-inner{flex-direction:column;}.preview-thumb{flex:0 0 auto;width:100%;}}
        .rr-scroll{position:fixed;inset:0;z-index:10000;overflow-y:auto;-webkit-overflow-scrolling:touch;background:${T.rrBg};}
        .rr-bg{display:none;} .rr-scrim{display:none;}
        .rr-close{position:fixed;top:24px;right:28px;z-index:3;background:none;border:none;color:#9a9aa0;font-size:20px;cursor:pointer;line-height:1;transition:color .3s,transform .3s;}
        .rr-close:hover{color:${T.ember};transform:rotate(90deg);}
        .rr-fade{position:relative;z-index:2;animation:rrFade .5s cubic-bezier(0.22,0.61,0.36,1);}
        @keyframes rrFade{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}
        .rr-col{position:relative;max-width:660px;margin:0 auto;padding:14vh 28px 20vh;}
        .rr-title{font-family:'Space Mono',monospace;color:${T.rrTitle};font-size:29px;line-height:1.25;letter-spacing:0.01em;margin:0 0 14px;font-weight:700;}
        .rr-h2{font-family:'Space Mono',monospace;color:${T.ember};font-size:12px;letter-spacing:0.3em;text-transform:uppercase;margin:54px 0 18px;font-weight:700;}
        .rr-p{font-family:'Space Mono',monospace;color:${T.rrInk};font-size:15px;line-height:1.9;margin:0 0 22px;}
        .rr-quote{font-family:'Space Mono',monospace;color:${T.rrTitle};font-size:16px;line-height:1.7;border-left:2px solid ${T.ember};padding-left:22px;margin:30px 0;}
        @media(max-width:680px){.rr-col{padding:12vh 22px 16vh;}.rr-title{font-size:22px;}.rr-p{font-size:14px;}}
        .panel{position:relative;flex:1;overflow:hidden;}
        :focus-visible{outline:1px solid ${T.ember};outline-offset:4px;}
        /* hero: a centered square field, edge-to-edge canvas */
        .hero3{display:flex;width:100%;max-width:880px;aspect-ratio:1/1;margin:0 auto;}
        .theme-toggle{position:fixed;bottom:22px;right:24px;z-index:9998;background:none;border:1px solid ${T.rule};border-radius:2px;color:${T.ash};font-family:'Space Mono',monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;padding:7px 12px;cursor:pointer;transition:color .3s,border-color .3s;}
        .theme-toggle:hover{color:${T.ember};border-color:${T.ruleHover};}
        /* RGB-split static glitch for the footer wordmark */
        .glitch-rgb{position:relative;display:inline-block;}
        .glitch-rgb::before,.glitch-rgb::after{content:attr(data-text);position:absolute;left:0;top:0;width:100%;overflow:hidden;}
        .glitch-rgb::before{color:#ff2f6e;animation:glitchA .18s steps(2) infinite;}
        .glitch-rgb::after{color:#2fd4ff;animation:glitchB .21s steps(2) infinite;}
        @keyframes glitchA{0%{transform:translate(-1.5px,0.5px);clip-path:inset(0 0 55% 0);}50%{transform:translate(1.5px,-0.5px);clip-path:inset(45% 0 0 0);}100%{transform:translate(-1px,0);clip-path:inset(20% 0 30% 0);}}
        @keyframes glitchB{0%{transform:translate(1.5px,-0.5px);clip-path:inset(60% 0 0 0);}50%{transform:translate(-1.5px,0.5px);clip-path:inset(0 0 50% 0);}100%{transform:translate(1px,0);clip-path:inset(30% 0 20% 0);}}
        @media(prefers-reduced-motion:reduce){html{scroll-behavior:auto;}}
      `}</style>

      {/* warm tint — only in dark mode; on white it would muddy the page */}
      {!isLight && <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:9999, background:"#ff8a3d", mixBlendMode:"overlay", opacity:0.22 }} />}

      {/* dark ↔ light toggle */}
      <button className="theme-toggle" onClick={()=>setTheme(isLight?"dark":"light")}>
        {isLight ? "☾ Dark" : "☀ Light"}
      </button>

      {/* HERO — the Matter field, constrained to the content column (maxWidth 880, 40px gutters). */}
      <section className="hero" style={{ overflow:"hidden", padding:"0" }}>
        <div className="hero3">
          {/* .panel is position:relative — the square field box the labels pin to */}
          <div className="panel">
            <FieldSquare fieldOpacity={isLight?1:T.fieldOpacity} line={isLight} />
            <GlitchWordmark variant="rgb" className="lbl" style={{ position:"absolute", top:28, left:40, color:T.ember }} />
            <div className="lbl" style={{ position:"absolute", top:28, right:40, color:T.ash, pointerEvents:"none" }}>iAOS21</div>
          </div>
        </div>
      </section>

      {/* WORKS */}
      <main style={{ maxWidth:880, margin:"0 auto", padding:"12vh 40px 14vh", position:"relative", background:T.void, transition:"background .5s" }}>
        <div className="lbl" style={{ marginBottom:32 }}>Builds</div>
        <WorkList items={sortedBuilds} size={19} onRead={setReading} T={T}/>

        <div className="lbl" style={{ margin:"10vh 0 32px" }}>Writing</div>
        <WorkList items={sortedEssays} size={15} onRead={setReading} T={T}/>
      </main>

      <ReadingRoom essay={reading} onClose={()=>setReading(null)} T={T} />

      {/* ENERGY — a second square field, mirrored, hot "sun" palette. */}
      <section className="hero">
        <div className="hero3">
          <div className="panel">
            {/* flipped wrapper mirrors the field; label sits outside so text stays upright */}
            <div style={{ width:"100%", height:"100%", transform:"scaleY(-1)" }}>
              <FieldSquare palette="sun" fieldOpacity={isLight?1:T.fieldOpacity} line={isLight} />
            </div>
            <GlitchWordmark variant="rgb" className="lbl" style={{ position:"absolute", top:28, left:40, color:T.ember }} />
            <div className="lbl" style={{ position:"absolute", top:28, right:40, color:T.ash, pointerEvents:"none" }}>iAOS21</div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ maxWidth:880, margin:"0 auto", padding:"8vh 40px 10vh" }}>
        <div style={{ borderTop:`1px solid ${T.rule}`, paddingTop:32, display:"flex", flexWrap:"wrap", gap:24, alignItems:"baseline", justifyContent:"space-between" }}>
          <GlitchWordmark variant="rgb" className="lbl" style={{ color:T.ember }} />
          <nav style={{ display:"flex", gap:28, flexWrap:"wrap" }}>
            {FOOTER_LINKS.map((l,i)=>(
              <a key={i} className="visit" href={l.url} target="_blank" rel="noopener">{l.label}&nbsp;↗</a>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}
