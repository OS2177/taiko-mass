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
  { title:"What Is Eating You", slug:"what-is-eating-you",
    note:"On the system that consumes attention", date:"2026-05",
    url:"#", thumb:"", blurb:"A forensic look at what captures and consumes human attention.",
    body:`## The System

There is a machine built to hold your attention, and it never sleeps. It measures, predicts, and adjusts — and it is very good at its work.

> What consumes your attention consumes your life.

It does not ask permission. It learns what *moves* you and feeds you more of it, until the feed becomes the **frame** through which you see.

## What Is Required

The first act is noticing. Attention can be reclaimed, but only once you can see the thing that takes it.

Begin small. Notice once a day. Then twice.` },
  { title:"The Ecology of Awareness", slug:"the-ecology-of-awareness",
    note:"Consciousness in information fields", date:"2026-02",
    url:"#", thumb:"", blurb:"Consciousness, attention, and the modern information environment.",
    body:`## A Field, Not a Container

Awareness is not a box that holds thoughts. It is an *ecology* — a living field where attention grows, drifts, and decays.

> Mind is weather before it is architecture.

What you attend to becomes the **climate** of your inner life.

## Tending the Field

You cannot command awareness, but you can cultivate it. Remove what poisons it; plant what nourishes it.

The garden tends the gardener in return.` },
  { title:"On the Edge", slug:"on-the-edge",
    note:"Marginality as a driver of change", date:"2025-12",
    url:"#", thumb:"", blurb:"Constitutional marginality as the engine of systemic change.",
    body:`## The Centre Holds, The Edge Moves

Change rarely begins at the centre. The centre is *invested* in things staying as they are.

> The margin is where the new becomes thinkable.

It is at the **edge** — uncomfortable, uncertain, overlooked — that other futures first take shape.

## Standing There On Purpose

To stand at the edge by choice is not exile. It is a vantage point.

From here, the whole field is visible.` },
  { title:"The Open Loop", slug:"the-open-loop",
    note:"The body as process", date:"2025-10",
    url:"#", thumb:"", blurb:"The body as an open system of physiological and emotional cycles.",
    body:`## Not An Object

The body is not a thing you *have*. It is a process you *are* — an open loop of exchange that never fully closes.

> Breath in, breath out: the loop is the life.

Food, air, feeling, and waste move through it in **cycles**, not lines.

## Closing Nothing

Health is not a finished state. It is the loop kept open and moving.

Let it flow, and tend the flow.` },
];
const STATUS_RANK = { Live: 0, Building: 1 };
export const sortedBuilds = [...BUILDS].sort((a,b) =>
  (STATUS_RANK[a.status] - STATUS_RANK[b.status]) || b.date.localeCompare(a.date));
export const sortedEssays = [...ESSAYS].sort((a,b) => b.date.localeCompare(a.date));
