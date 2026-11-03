import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { PageBanner } from "@/pages/About";
import Badge from "@/components/Badge";
import { LoadingGrid, EmptyState } from "@/pages/Events";
import WriteUpDialog, { ReadMoreCue } from "@/components/WriteUpDialog";
import { useWriteUp, clickableCardProps, CARD_CLICK_CLASSES } from "@/lib/writeUp";

const TIERS = ["All", "Platinum", "Gold", "Silver", "Bronze"];

export default function CorporateMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const writeUp = useWriteUp();

  useEffect(() => {
    base44.entities.CorporateMember.list("company_name", 100)
      .then(setMembers)
      .catch(() => setMembers([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "All" ? members : members.filter(m => m.tier === filter);

  return (
    <div>
      <PageBanner eyebrow="// The Institute" title="Corporate Members" subtitle="Industry partners and corporate sponsors supporting the electronics engineering profession" />

      <section className="border-b-2 border-graphite">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 md:py-16">
          <div className="flex flex-wrap gap-2 mb-8">
            {TIERS.map(tier => (
              <button
                key={tier}
                onClick={() => setFilter(tier)}
                className={`font-mono text-xs uppercase tracking-wide px-3 py-2 border-2 transition-all ${
                  filter === tier ? "bg-navy text-signal border-graphite nb-shadow" : "bg-signal text-graphite border-graphite hover:bg-muted"
                }`}
              >
                {tier}
              </button>
            ))}
          </div>

          {loading ? (
            <LoadingGrid />
          ) : filtered.length === 0 ? (
            <EmptyState message="No corporate members in this tier." />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(m => (
                <div
                  key={m.id}
                  className={`nb-card nb-card-hover p-6 ${CARD_CLICK_CLASSES}`}
                  {...clickableCardProps(() => writeUp.show(m))}
                >
                  <Badge variant={m.tier}>{m.tier} Member</Badge>
                  <h3 className="font-heading text-graphite text-lg uppercase leading-tight mt-3">{m.company_name}</h3>
                  {m.industry && <div className="font-mono text-[10px] text-muted-foreground uppercase mt-1">{m.industry}</div>}
                  <p className="mt-3 text-sm text-muted-foreground line-clamp-3">{m.description}</p>
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
        badges={writeUp.item && <Badge variant={writeUp.item.tier}>{writeUp.item.tier} Member</Badge>}
        title={writeUp.item?.company_name}
        meta={writeUp.item ? [{ text: writeUp.item.industry }] : []}
        body={writeUp.item?.description}
      />
    </div>
  );
}