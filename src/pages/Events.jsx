import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Calendar, MapPin } from "lucide-react";
import { Image } from "@/components/ui/image";
import { PageBanner } from "@/pages/About";
import WriteUpDialog, { ReadMoreCue } from "@/components/WriteUpDialog";
import { useWriteUp, clickableCardProps, CARD_CLICK_CLASSES } from "@/lib/writeUp";

const DEFAULT_IMG = "https://media.base44.com/images/public/6a71bda7bbd3a6eea5934e04/2d6aac08e_generated_fbacca28.png";
const TYPES = ["All", "National Convention", "Seminar", "Workshop", "Webinar", "Certification", "General Assembly"];

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const writeUp = useWriteUp();

  useEffect(() => {
    base44.entities.Event.list("-start_date", 50)
      .then(setEvents)
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "All" ? events : events.filter(e => e.type === filter);

  return (
    <div>
      <PageBanner eyebrow="// The Professional" title="Events" subtitle="Conventions, seminars, workshops, and professional development activities" />

      <section className="border-b-2 border-graphite">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 md:py-16">
          <div className="flex flex-wrap gap-2 mb-8">
            {TYPES.map(type => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`font-mono text-xs uppercase tracking-wide px-3 py-2 border-2 transition-all ${
                  filter === type
                    ? "bg-navy text-signal border-graphite nb-shadow"
                    : "bg-signal text-graphite border-graphite hover:bg-muted"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {loading ? (
            <LoadingGrid />
          ) : filtered.length === 0 ? (
            <EmptyState message="No events found for this category." />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(evt => (
                <div
                  key={evt.id}
                  className={`nb-card nb-card-hover overflow-hidden flex flex-col ${CARD_CLICK_CLASSES}`}
                  {...clickableCardProps(() => writeUp.show(evt))}
                >
                  <div className="h-48 border-b-2 border-graphite relative">
                    <Image src={evt.image_url || DEFAULT_IMG} alt={evt.title} className="w-full h-full" fittingType="fill" />
                    <div className="absolute top-0 left-0 bg-azure text-signal font-mono text-[10px] uppercase px-2 py-1 border-r-2 border-b-2 border-graphite">
                      {evt.type}
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-3 font-mono text-[10px] text-muted-foreground uppercase mb-2">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(evt.start_date)}</span>
                    </div>
                    <h3 className="font-heading text-graphite text-lg uppercase leading-tight">{evt.title}</h3>
                    <div className="flex items-center gap-1 font-mono text-xs text-muted-foreground mt-2">
                      <MapPin className="w-3 h-3" />{evt.location}
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground flex-1 line-clamp-3">{evt.description}</p>
                    <ReadMoreCue />
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
        badges={writeUp.item && <span className="bg-azure text-signal font-mono text-[10px] uppercase px-2 py-1 border-2 border-graphite">{writeUp.item.type}</span>}
        title={writeUp.item?.title}
        meta={writeUp.item ? [
          { icon: Calendar, text: formatDateRange(writeUp.item.start_date, writeUp.item.end_date) },
          { icon: MapPin, text: writeUp.item.location },
        ] : []}
        image={writeUp.item?.image_url}
        body={writeUp.item?.description}
      />
    </div>
  );
}

function formatDateRange(start, end) {
  if (!end || end === start) return formatDate(start);
  return `${formatDate(start)} – ${formatDate(end)}`;
}

function formatDate(d) {
  if (!d) return "TBA";
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export function LoadingGrid() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1,2,3,4,5,6].map(i => (
        <div key={i} className="nb-card p-5 animate-pulse">
          <div className="h-48 bg-muted mb-4" />
          <div className="h-4 bg-muted mb-2 w-1/3" />
          <div className="h-6 bg-muted mb-2 w-3/4" />
          <div className="h-3 bg-muted w-1/2" />
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ message }) {
  return (
    <div className="border-2 border-dashed border-graphite p-12 text-center">
      <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{message || "No content found."}</div>
    </div>
  );
}