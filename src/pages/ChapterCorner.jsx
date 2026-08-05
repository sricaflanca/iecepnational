import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { MapPin, Calendar } from "lucide-react";
import { PageBanner } from "@/pages/About";
import Badge from "@/components/Badge";
import { LoadingGrid, EmptyState } from "@/pages/Events";

export default function ChapterCorner() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.ChapterEvent.list("-date", 50)
      .then(setEvents)
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  const chapters = [...new Set(events.map(e => e.chapter))].sort();

  return (
    <div>
      <PageBanner eyebrow="// The Community" title="Chapter Corner" subtitle="Events and activities from IECEP chapters across the nation" />

      <section className="border-b-2 border-graphite">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 md:py-16">
          {chapters.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {chapters.map(ch => (
                <span key={ch} className="font-mono text-[10px] uppercase tracking-wide px-3 py-1 border-2 border-azure text-azure bg-azure/5">
                  {ch}
                </span>
              ))}
            </div>
          )}

          {loading ? (
            <LoadingGrid />
          ) : events.length === 0 ? (
            <EmptyState message="No chapter events posted yet." />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map(evt => (
                <div key={evt.id} className="nb-card nb-card-hover p-5">
                  <Badge variant="Active">{evt.chapter}</Badge>
                  <h3 className="font-heading text-graphite text-lg uppercase leading-tight mt-3">{evt.title}</h3>
                  <div className="flex items-center gap-3 font-mono text-[10px] text-muted-foreground uppercase mt-2">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(evt.date)}</span>
                    {evt.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{evt.location}</span>}
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{evt.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function formatDate(d) {
  if (!d) return "TBA";
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}