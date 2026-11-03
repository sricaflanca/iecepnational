import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Search, Download, Calendar } from "lucide-react";
import { PageBanner } from "@/pages/About";
import Badge from "@/components/Badge";
import { LoadingGrid, EmptyState } from "@/pages/Events";
import WriteUpDialog, { ReadMoreCue } from "@/components/WriteUpDialog";
import { useWriteUp, clickableCardProps, CARD_CLICK_CLASSES } from "@/lib/writeUp";

const CATEGORIES = ["All", "Board Resolution", "Administrative", "Policy", "Ethics", "Election"];

export default function Resolutions() {
  const [resolutions, setResolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const writeUp = useWriteUp();

  useEffect(() => {
    base44.entities.Resolution.list("-date_issued", 100)
      .then(setResolutions)
      .catch(() => setResolutions([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = resolutions.filter(r => {
    const matchesCat = filter === "All" || r.category === filter;
    const q = query.toLowerCase();
    const matchesQuery = !q ||
      (r.title || "").toLowerCase().includes(q) ||
      (r.resolution_number || "").toLowerCase().includes(q) ||
      (r.summary || "").toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  return (
    <div>
      <PageBanner eyebrow="// The Knowledge" title="Resolutions" subtitle="Official board resolutions, policies, and administrative issuances" />

      <section className="border-b-2 border-graphite">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 md:py-16">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex border-2 border-graphite nb-shadow flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search resolutions…"
                className="flex-1 px-4 py-3 bg-signal font-mono text-sm outline-none placeholder:text-muted-foreground/60"
              />
              <div className="bg-azure text-signal px-4 flex items-center"><Search className="w-4 h-4" /></div>
            </div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`font-mono text-xs uppercase tracking-wide px-3 py-2 border-2 transition-all whitespace-nowrap ${
                    filter === cat ? "bg-navy text-signal border-graphite nb-shadow" : "bg-signal text-graphite border-graphite hover:bg-muted"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <LoadingGrid />
          ) : filtered.length === 0 ? (
            <EmptyState message="No resolutions found." />
          ) : (
            <div className="space-y-3">
              {filtered.map(res => (
                <div
                  key={res.id}
                  className={`nb-card nb-card-hover flex flex-col md:flex-row ${CARD_CLICK_CLASSES}`}
                  {...clickableCardProps(() => writeUp.show(res))}
                >
                  <div className="bg-navy text-signal p-4 md:w-56 border-b-2 md:border-b-0 md:border-r-2 border-graphite flex flex-col justify-center">
                    <div className="font-mono text-[10px] uppercase tracking-widest text-azure mb-1">Resolution No.</div>
                    <div className="font-heading text-lg uppercase break-all">{res.resolution_number}</div>
                    <div className="font-mono text-[10px] text-signal/60 mt-2">{formatDate(res.date_issued)}</div>
                  </div>
                  <div className="p-5 flex-1">
                    <div className="mb-2"><Badge variant="Active">{res.category}</Badge></div>
                    <h3 className="font-heading text-graphite text-lg uppercase leading-tight">{res.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{res.summary}</p>
                    <ReadMoreCue />
                    {res.file_url && (
                      <a
                        href={res.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-2 mt-3 font-mono text-xs uppercase text-azure hover:underline underline-offset-4"
                      >
                        <Download className="w-3 h-3" /> Download Document
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <WriteUpDialog
        open={writeUp.open}
        onClose={writeUp.close}
        badges={writeUp.item && <Badge variant="Active">{writeUp.item.category}</Badge>}
        title={writeUp.item?.title}
        meta={writeUp.item ? [
          { text: `Resolution No. ${writeUp.item.resolution_number}` },
          { icon: Calendar, text: formatDate(writeUp.item.date_issued) },
        ] : []}
        body={writeUp.item?.summary}
      >
        {writeUp.item?.file_url && (
          <a
            href={writeUp.item.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-6 font-mono text-xs uppercase text-azure hover:underline underline-offset-4"
          >
            <Download className="w-3 h-3" /> Download Document
          </a>
        )}
      </WriteUpDialog>
    </div>
  );
}

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}