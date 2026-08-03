// CONTENT — edit this file to update the site. No component code here.
// Fields: title, note, status ("Live"|"Building", builds only),
// date "YYYY-MM" (when made live/published — drives newest-first order),
// url ("#" → "Coming soon"), thumb ("/x.png" in public, "" = none), blurb.
// Essays: page ("/x.html" in public) → the row's Read link opens that
// standalone page. Every essay needs one; there is no in-site reader.
export const BUILDS = [
  { title:"KISSA",     note:"Zero-commission POS for independent shops", status:"Live", date:"2026-07", url:"https://kissa-site.vercel.app/", thumb:"/kissa-thumb.png", blurb:"A browser-based, zero-commission point-of-sale system for independent shops — launching across Europe and Japan in 2026/27." },
  { title:"Orbit",     note:"Discovery platform for makers",     status:"Live",     date:"2026-06", url:"https://orbit-nine-liard.vercel.app/", thumb:"/orbit-thumb.png", blurb:"A gamified discovery platform where makers ship, remix, and climb." },
  { title:"Navigator", note:"Cognitive workspace",                status:"Building", date:"2026-05", url:"#", thumb:"", blurb:"A calm thinking environment — journal, write, research, create." },
  { title:"SOMA",      note:"Neuroinflammatory food mapping",     status:"Building", date:"2026-04", url:"#", thumb:"", blurb:"Mapping food to neuroinflammatory load — awareness to protocol." },
  { title:"Wordmark",  note:"Identity-to-interface compiler",     status:"Building", date:"2026-03", url:"#", thumb:"/wordmark-thumb.png", blurb:"Turns a brand's identity into a coherent interface system." },
];
export const ESSAYS = [
  { title:"Humanetics", slug:"humanetics",
    note:"Designing intelligent systems to expand human potential", date:"2026-07",
    url:"#", thumb:"", page:"/humanetics.html",
    blurb:"The founding philosophy — the design of intelligent systems whose purpose is to expand the capacity of human potential." },
  { title:"The Ecology of Awareness", slug:"the-ecology-of-awareness",
    note:"Consciousness in information fields", date:"2026-02",
    url:"#", thumb:"", page:"/the-ecology-of-awareness.html",
    blurb:"Consciousness, attention, and the modern information environment." },
  { title:"On the Edge", slug:"on-the-edge",
    note:"Marginality as a driver of change", date:"2025-12",
    url:"#", thumb:"", page:"/on-the-edge.html",
    blurb:"Constitutional marginality as the engine of systemic change." },
  { title:"The Open Loop", slug:"the-open-loop",
    note:"The body as process", date:"2025-10",
    url:"#", thumb:"", page:"/the-open-loop.html",
    blurb:"The body as an open system of physiological and emotional cycles." },
];
const STATUS_RANK = { Live: 0, Building: 1 };
export const sortedBuilds = [...BUILDS].sort((a,b) =>
  (STATUS_RANK[a.status] - STATUS_RANK[b.status]) || b.date.localeCompare(a.date));
export const sortedEssays = [...ESSAYS].sort((a,b) => b.date.localeCompare(a.date));

// Footer links — add more entries here as they come.
export const FOOTER_LINKS = [
  { label:"LinkedIn", url:"https://www.linkedin.com/in/iaos21/" },
];
