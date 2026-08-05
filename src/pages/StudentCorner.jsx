import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Calendar, School } from "lucide-react";
import { PageBanner } from "@/pages/About";
import Badge from "@/components/Badge";
import { LoadingGrid, EmptyState } from "@/pages/Events";

const CATEGORIES = ["All", "Competition", "Seminar", "Outreach", "Workshop", "Recognition"];

export default function StudentCorner() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    base44.entities.StudentActivity.list("-date", 50)
      .then(setActivities)
      .catch(() => setActivities([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "All" ? activities : activities.filter(a => a.category === filter);

  return (
    <div>
      <PageBanner eyebrow="// The Community" title="Student Corner" subtitle="Activities, competitions, and events from IECEP student chapters" />

      <section className="border-b-2 border-graphite">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 md:py-16">
          <div className="flex flex-wrap gap-2 mb-8">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`font-mono text-xs uppercase tracking-wide px-3 py-2 border-2 transition-all ${
                  filter === cat ? "bg-navy text-signal border-graphite nb-shadow" : "bg-signal text-graphite border-graphite hover:bg-muted"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <LoadingGrid />
          ) : filtered.length === 0 ? (
            <EmptyState message="No student activities posted yet." />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(act => (
                <div key={act.id} className="nb-card nb-card-hover p-5">
                  <Badge variant="Active">{act.category}</Badge>
                  <h3 className="font-heading text-graphite text-lg uppercase leading-tight mt-3">{act.title}</h3>
                  <div className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground uppercase mt-2">
                    <School className="w-3 h-3" />{act.school}
                  </div>
                  <div className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground uppercase mt-1">
                    <Calendar className="w-3 h-3" />{formatDate(act.date)}
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{act.description}</p>
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