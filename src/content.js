// CONTENT — edit this file to update the site. No component code here.
// Fields: title, note, status ("Live"|"Building", builds only),
// date "YYYY-MM" (when made live/published — drives newest-first order),
// url ("#" → "Coming soon"), thumb ("/x.png" in public, "" = none), blurb.
export const BUILDS = [
  { title:"Orbit",     note:"Discovery platform for makers",     status:"Live",     date:"2026-06", url:"https://orbit-nine-liard.vercel.app/", thumb:"/orbit-thumb.png", blurb:"A gamified discovery platform where makers ship, remix, and climb." },
  { title:"Navigator", note:"Cognitive workspace",                status:"Building", date:"2026-05", url:"#", thumb:"", blurb:"A calm thinking environment — journal, write, research, create." },
  { title:"SOMA",      note:"Neuroinflammatory food mapping",     status:"Building", date:"2026-04", url:"#", thumb:"", blurb:"Mapping food to neuroinflammatory load — awareness to protocol." },
  { title:"Wordmark",  note:"Identity-to-interface compiler",     status:"Building", date:"2026-03", url:"#", thumb:"", blurb:"Turns a brand's identity into a coherent interface system." },
];
export const ESSAYS = [
  { title:"What Is Eating You",        note:"On the system that consumes attention", date:"2026-05", url:"#", thumb:"", blurb:"A forensic look at what captures and consumes human attention." },
  { title:"The Ecology of Awareness",  note:"Consciousness in information fields",    date:"2026-02", url:"#", thumb:"", blurb:"Consciousness, attention, and the modern information environment." },
  { title:"On the Edge",               note:"Marginality as a driver of change",      date:"2025-12", url:"#", thumb:"", blurb:"Constitutional marginality as the engine of systemic change." },
  { title:"The Open Loop",             note:"The body as process",                    date:"2025-10", url:"#", thumb:"", blurb:"The body as an open system of physiological and emotional cycles." },
];
const STATUS_RANK = { Live: 0, Building: 1 };
export const sortedBuilds = [...BUILDS].sort((a,b) =>
  (STATUS_RANK[a.status] - STATUS_RANK[b.status]) || b.date.localeCompare(a.date));
export const sortedEssays = [...ESSAYS].sort((a,b) => b.date.localeCompare(a.date));
