import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import Badge from "@/components/Badge";
import { Cpu, MapPin, Calendar, Newspaper, Loader2 } from "lucide-react";

const SPECIALIZATIONS = [
  "All",
  "Telecommunications",
  "Semiconductor Design",
  "Broadcast Engineering",
  "Power Electronics",
  "IoT & Embedded Systems",
  "Industrial Automation",
  "Network Engineering",
  "Signal Processing",
  "Renewable Energy",
  "Biomedical Electronics",
];

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

export default function SpecializationsCorner() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  useEffect(() => {
    (async () => {
      try {
        const data = await base44.entities.Specialization.list("-date", 50);
        setEntries(data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = entries.filter((e) => {
    const specMatch = filter === "All" || e.specialization === filter;
    const typeMatch = typeFilter === "All" || e.type === typeFilter;
    return specMatch && typeMatch;
  });

  return (
    <div className="min-h-screen bg-signal">
      {/* Banner */}
      <section className="bg-navy text-signal border-b-2 border-graphite circuit-grid">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-16 md:py-24">
          <div className="font-mono text-xs uppercase tracking-widest text-azure mb-3 flex items-center gap-2">
            <span className="w-6 h-[2px] bg-azure" /> The Professional
          </div>
          <h1 className="font-heading text-signal text-4xl md:text-6xl uppercase leading-none tracking-tight mb-4">
            Specializations Corner
          </h1>
          <p className="text-signal/70 text-base md:text-lg max-w-2xl">
            Track events and news across every electronics engineering discipline — from telecommunications to biomedical electronics.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b-2 border-graphite bg-signal sticky top-16 md:top-20 z-30">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-4">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mr-2">Type:</span>
            {["All", "Event", "News"].map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`font-mono text-[10px] uppercase tracking-wide px-3 py-1.5 border-2 transition-all ${
                  typeFilter === t
                    ? "bg-azure text-navy border-azure"
                    : "bg-signal text-graphite border-graphite hover:bg-muted"
                }`}
              >
                {t === "All" ? "All Types" : t}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mr-2">Field:</span>
            {SPECIALIZATIONS.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`font-mono text-[10px] uppercase tracking-wide px-3 py-1.5 border-2 transition-all ${
                  filter === s
                    ? "bg-navy text-signal border-navy"
                    : "bg-signal text-graphite border-graphite hover:bg-muted"
                }`}
              >
                {s === "All" ? "All Fields" : s}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 md:py-16">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-azure" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed border-graphite/30">
            <Cpu className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="font-heading text-graphite text-lg uppercase">No entries found</p>
            <p className="font-mono text-xs text-muted-foreground mt-2">Try a different specialization or type filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((entry) => (
              <article key={entry.id} className="nb-card nb-card-hover bg-card flex flex-col">
                {entry.image_url ? (
                  <div className="border-b-2 border-foreground h-44 overflow-hidden">
                    <Image src={entry.image_url} fittingType="fill" className="w-full h-full" />
                  </div>
                ) : (
                  <div className="border-b-2 border-foreground h-32 bg-navy flex items-center justify-center">
                    {entry.type === "News" ? (
                      <Newspaper className="w-10 h-10 text-signal/40" />
                    ) : (
                      <Cpu className="w-10 h-10 text-signal/40" />
                    )}
                  </div>
                )}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant={entry.type === "News" ? "Active" : "Lifetime"}>{entry.type}</Badge>
                    <Badge>{entry.specialization}</Badge>
                  </div>
                  <h3 className="font-heading text-graphite text-lg uppercase leading-tight mb-2">{entry.title}</h3>
                  <p className="text-muted-foreground text-sm flex-1 line-clamp-3">{entry.description}</p>
                  <div className="mt-4 pt-3 border-t-2 border-foreground/10 space-y-1">
                    <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
                      <Calendar className="w-3 h-3" /> {formatDate(entry.date)}
                    </div>
                    {entry.location && (
                      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
                        <MapPin className="w-3 h-3" /> {entry.location}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}