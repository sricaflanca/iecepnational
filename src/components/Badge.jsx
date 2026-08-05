import React from "react";

const TIER_STYLES = {
  Platinum: "bg-graphite text-signal border-graphite",
  Gold: "bg-azure text-signal border-azure",
  Silver: "bg-signal text-graphite border-graphite",
  Bronze: "bg-azure/10 text-azure border-azure",
  Active: "bg-azure text-signal border-azure",
  Inactive: "bg-muted text-muted-foreground border-graphite",
  Lifetime: "bg-graphite text-signal border-graphite",
  Fellow: "bg-azure text-signal border-azure",
};

export default function Badge({ children, variant }) {
  const style = TIER_STYLES[variant] || "bg-signal text-graphite border-graphite";
  return (
    <span className={`inline-block font-mono text-[10px] uppercase tracking-widest px-2 py-1 border-2 ${style}`}>
      {children}
    </span>
  );
}