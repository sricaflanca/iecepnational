import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Calendar, MapPin } from "lucide-react";
import { PageBanner } from "@/pages/About";
import Badge from "@/components/Badge";
import { LoadingGrid, EmptyState } from "@/pages/Events";
import WriteUpDialog, { ReadMoreCue } from "@/components/WriteUpDialog";
import { useWriteUp, clickableCardProps, CARD_CLICK_CLASSES } from "@/lib/writeUp";

const CLUBS = ["All", "Sports", "Arts & Culture", "Outreach", "Fellowship", "Other"];

export default function SocialClubs() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const writeUp = useWriteUp();

  useEffect(() => {
    base44.entities.SocialEvent.list("-date", 50)
      .then(setEvents)
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "All" ? events : events.filter(e => e.club === filter);

  return (
    <div>
      <PageBanner eyebrow="// The Community" title="Social Clubs" subtitle="Fellowship, sports, arts, and outreach activities that bring our community together" />

      <section className="border-b-2 border-graphite">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 md:py-16">
          <div className="flex flex-wrap gap-2 mb-8">
            {CLUBS.map(club => (
              <button
                key={club}
                onClick={() => setFilter(club)}
                className={`font-mono text-xs uppercase tracking-wide px-3 py-2 border-2 transition-all ${
                  filter === club ? "bg-navy text-signal border-graphite nb-shadow" : "bg-signal text-graphite border-graphite hover:bg-muted"
                }`}
              >
                {club}
              </button>
            ))}
          </div>

          {loading ? (
            <LoadingGrid />
          ) : filtered.length === 0 ? (
            <EmptyState message="No social events posted yet." />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(evt => (
                <div
                  key={evt.id}
                  className={`nb-card nb-card-hover p-5 ${CARD_CLICK_CLASSES}`}
                  {...clickableCardProps(() => writeUp.show(evt))}
                >
                  <Badge variant="Active">{evt.club}</Badge>
                  <h3 className="font-heading text-graphite text-lg uppercase leading-tight mt-3">{evt.title}</h3>
                  <div className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground uppercase mt-2">
                    <Calendar className="w-3 h-3" />{formatDate(evt.date)}
                  </div>
                  {evt.location && (
                    <div className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground uppercase mt-1">
                      <MapPin className="w-3 h-3" />{evt.location}
                    </div>
                  )}
                  <p className="mt-3 text-sm text-muted-foreground line-clamp-3">{evt.description}</p>
                  <ReadMoreCue />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <WriteUpDialog
        open={writeUp.open}
        onClose={writeUp.close}
        badges={writeUp.item && <Badge variant="Active">{writeUp.item.club}</Badge>}
        title={writeUp.item?.title}
        meta={writeUp.item ? [
          { icon: Calendar, text: formatDate(writeUp.item.date) },
          { icon: MapPin, text: writeUp.item.location },
        ] : []}
        body={writeUp.item?.description}
      />
    </div>
  );
}

function formatDate(d) {
  if (!d) return "TBA";
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}