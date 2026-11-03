import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import Badge from "@/components/Badge";
import { ExternalLink, Building2, Loader2, Globe } from "lucide-react";

const CATEGORIES = ["All", "Industry", "Academe", "Government", "Media", "Technology", "Professional Association"];

export default function Partners() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    (async () => {
      try {
        const data = await base44.entities.Partner.list("-created_date", 50);
        setPartners(data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = filter === "All" ? partners : partners.filter((p) => p.category === filter);

  return (
    <div className="min-h-screen bg-signal">
      {/* Banner */}
      <section className="bg-navy text-signal border-b-2 border-graphite circuit-grid">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-16 md:py-24">
          <div className="font-mono text-xs uppercase tracking-widest text-azure mb-3 flex items-center gap-2">
            <span className="w-6 h-[2px] bg-azure" /> The Institute
          </div>
          <h1 className="font-heading text-signal text-4xl md:text-6xl uppercase leading-none tracking-tight mb-4">
            Partners & Links
          </h1>
          <p className="text-signal/70 text-base md:text-lg max-w-2xl">
            Official links to our industry, academe, government, and media partners — organizations working alongside IECEP to advance the electronics engineering profession.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b-2 border-graphite bg-signal sticky top-16 md:top-20 z-30">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mr-2">Category:</span>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`font-mono text-[10px] uppercase tracking-wide px-3 py-1.5 border-2 transition-all ${
                  filter === c
                    ? "bg-navy text-signal border-navy"
                    : "bg-signal text-graphite border-graphite hover:bg-muted"
                }`}
              >
                {c === "All" ? "All Categories" : c}
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
            <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="font-heading text-graphite text-lg uppercase">No partners found</p>
            <p className="font-mono text-xs text-muted-foreground mt-2">Try a different category filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((partner) => (
              <a
                key={partner.id}
                href={partner.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="nb-card nb-card-hover bg-card p-6 flex flex-col group"
              >
                <div className="flex items-start gap-4 mb-4">
                  {partner.logo_url ? (
                    <div className="w-16 h-16 border-2 border-foreground overflow-hidden flex-shrink-0 bg-signal">
                      <Image src={partner.logo_url} fittingType="fit" className="w-full h-full" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 border-2 border-foreground bg-navy flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-7 h-7 text-signal" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <Badge>{partner.category}</Badge>
                  </div>
                </div>
                <h3 className="font-heading text-graphite text-lg uppercase leading-tight mb-2 group-hover:text-azure transition-colors">
                  {partner.company_name}
                </h3>
                <p className="text-muted-foreground text-sm flex-1 mb-4 whitespace-pre-line">{partner.description}</p>
                <div className="mt-auto pt-3 border-t-2 border-foreground/10 flex items-center gap-2 font-mono text-[10px] uppercase tracking-wide text-azure">
                  <ExternalLink className="w-3 h-3" />
                  <span className="truncate">{partner.website_url.replace(/^https?:\/\//, "").replace(/\/$/, "")}</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}