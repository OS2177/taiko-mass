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
           rule:"rgba(125,133,150,0.14)", ruleHover:"rgba(217,138,106,0.5)", fieldOpacity:1 },
  light: { void:"#f7f7f6", ink:"#eeeeec", ash:"#6b6b6b", pale:"#1a1a1a", ember:"#c56a44", mint:"#0a9c6e",
           rule:"rgba(30,30,30,0.12)", ruleHover:"rgba(197,106,68,0.5)", fieldOpacity:0.82 },
};

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

// ---------------- THE SITE ----------------

// ---------- Builds / Writing — click-to-expand accordion ----------
function WorkRow({ item, size, open, onOpen, onClose, T=THEMES.dark }){
  const hasUrl = item.url && item.url !== "#";
  const toggle = ()=> onOpen(open ? null : item._key);

  /*
    HOW FAR TO SHRINK THE 1440px FRAME so it fills this column exactly.

    It cannot be done in CSS alone: the frame's width is a fixed pixel value
    and the box's is whatever the column happens to be, and `scale()` takes a
    ratio rather than a length, so there is nothing to divide by. Measuring is
    the honest answer.

    Re-measured on resize rather than once, or the frame keeps the scale it
    was given at the width the page happened to open at — which on a phone
    rotation is wrong by half.
  */
  const liveRef = useRef(null);
  useEffect(()=>{
    const el = liveRef.current;
    if(!el || !open) return;
    const fit = ()=> el.style.setProperty("--s", String(el.clientWidth / 1440));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return ()=> ro.disconnect();
  }, [open]);
  return (
    <div className="workrow" onMouseLeave={open ? onClose : undefined}>
      <div className="row" role="button" tabIndex={0}
        onClick={toggle}
        onKeyDown={(e)=>{ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); toggle(); } }}>
        <span className="ttl" style={{ fontSize:size, color:T.pale }}><GlitchText>{item.title}</GlitchText></span>
        <span className="note" style={{ color:T.ash, fontSize:12 }}>{item.note}</span>
        {item.status && (
          <span className="lbl" style={{ color: item.status==="Live" ? T.mint : undefined }}>{item.status}</span>
        )}
        <span className="arr" style={{ fontSize:14, transform: open ? "rotate(90deg)" : "rotate(0deg)" }}>→</span>
      </div>
      <div className={open ? "preview" : "preview closing"} style={{ maxHeight: open ? 900 : 0 }}>
        <div className="preview-inner">
          <div className="preview-body">
            <p style={{ margin:0, color:T.pale, fontSize:13, lineHeight:1.65 }}>{item.blurb}</p>
            <div style={{ display:"flex", gap:20, alignItems:"center" }}>
              {item.page && (
                <a className="visit" href={item.page}>Read ↗</a>
              )}
              {!item.page && hasUrl && (
                <a className="visit" href={item.url} target="_blank" rel="noopener">Visit ↗</a>
              )}
              {!item.page && !hasUrl && (
                <span className="visit" style={{ opacity:0.5 }}>Coming soon</span>
              )}
            </div>
          </div>

          {/*
            THE LIVE VIEW — the build itself, running, the full width of the
            column. It replaced a 240x150 thumbnail that was too small to show
            anything: at that size a whole site is a smudge, and the one build
            with a dark design read as a grey rectangle.

            IT IS THE REAL SITE IN AN IFRAME, not a screenshot, so it can
            never go stale — which is the thing a screenshot of your own work
            always eventually does.

            MOUNTED ONLY WHILE OPEN. `open &&` is load-bearing: without it
            every build on the page fetches its whole site on first paint,
            which is six sites nobody has asked to see.

            RENDERED WIDE AND SCALED DOWN. An 800px iframe makes a site lay
            itself out for an 800px screen, so you would be looking at the
            tablet breakpoint of every build. It is given a 1440px viewport
            and scaled to fit, so what shows is the desktop design the build
            was actually composed for. `transform-origin` is the top left or
            it scales away from the centre and crops.

            NOT INTERACTIVE, deliberately. A live page inside a page will
            swallow scrolls and clicks meant for this one, and a visitor who
            starts navigating a build inside a 500px window has been trapped
            rather than served. `pointer-events:none` makes it a moving
            poster; VISIT is the way in. The thumbnail stays behind it as a
            fallback for anything that refuses to be framed — none of the
            builds send X-Frame-Options today, but that is their choice to
            change and not ours.
          */}
          {!item.page && hasUrl && (
            <div className="preview-live" ref={liveRef} aria-hidden="true"
              style={{ backgroundImage: item.thumb ? `url(${item.thumb})` : undefined }}>
              {open && (
                <iframe src={item.url} title={`${item.title} — live`}
                  loading="lazy" tabIndex={-1} scrolling="no"
                  sandbox="allow-scripts allow-same-origin" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function WorkList({ items, size, T=THEMES.dark }){
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
        return <WorkRow key={key} item={item} size={size} open={openKey===key} onOpen={setOpen} onClose={closeSoon} T={T} />;
      })}
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
        /* Nothing may push the page sideways — on a phone that reads as the
           whole page sliding around under the thumb. */
        html,body{overflow-x:hidden;max-width:100%;}
        html{scroll-behavior:smooth;}
        a{color:inherit;text-decoration:none;}
        .lbl{letter-spacing:0.32em;text-transform:uppercase;font-size:10px;color:${T.ash};}
        .row{border-top:1px solid ${T.rule};padding:26px 0;display:flex;justify-content:space-between;align-items:baseline;gap:24px;transition:border-color .5s,padding-left .4s;cursor:pointer;}
        .row:hover{border-color:${T.ruleHover};padding-left:18px;}
        .row:hover .ttl{color:${T.ember};}
        .row:hover .arr{opacity:1;}
        .ttl{transition:color .5s;}
        .note{flex:1;}
        .arr{opacity:0.5;transition:transform .4s cubic-bezier(0.16,1,0.3,1),opacity .4s,color .4s;color:${T.ember};}
        .preview{overflow:hidden;max-height:0;transition:max-height .8s cubic-bezier(0.22,0.61,0.36,1);}
        .preview.closing{transition:max-height .55s cubic-bezier(0.16,1,0.3,1);}
        .preview-inner{display:flex;flex-direction:column;gap:22px;padding:4px 0 30px;}
        .preview-body{display:flex;flex-direction:column;gap:14px;}
        /* 16:10 rather than 16:9 — a landing page is taller than a video, and
           the extra band is where the fold actually falls. */
        .preview-live{position:relative;width:100%;aspect-ratio:16/10;border:1px solid ${T.rule};border-radius:2px;overflow:hidden;background-color:${isLight?"rgba(30,30,30,0.04)":"rgba(125,133,150,0.06)"};background-size:cover;background-position:top center;}
        /* 1440 wide, then scaled to whatever the column is. The height is the
           same ratio as the box so the scaled frame fills it exactly. */
        .preview-live iframe{position:absolute;top:0;left:0;width:1440px;height:900px;border:0;transform:scale(var(--s,0.55));transform-origin:top left;pointer-events:none;}
        .visit{display:inline-block;color:${T.ember};padding:6px 0;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;transition:opacity .3s,letter-spacing .3s;}
        .visit:hover{opacity:0.7;letter-spacing:0.24em;}

        /* Narrow screens: title, status and arrow hold the first line; the
           description drops underneath the title instead of being squeezed
           between them (which used to overflow the viewport). */
        @media(max-width:600px){
          .row{flex-wrap:wrap;}
          .row .ttl{order:1;}
          .row .lbl{order:2;}
          .row .arr{order:3;}
          .row .note{order:4;flex:0 0 100%;margin-top:6px;}
        }
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
        <WorkList items={sortedBuilds} size={19} T={T}/>

        <div className="lbl" style={{ margin:"10vh 0 32px" }}>Writing</div>
        <WorkList items={sortedEssays} size={15} T={T}/>
      </main>

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
