import React from "react";

export default function SectionHeader({ eyebrow, title, description, align = "left", light = false }) {
  return (
    <div className={`mb-8 md:mb-12 ${align === "center" ? "text-center" : ""}`}>
      {eyebrow && (
        <div className={`font-mono text-xs uppercase tracking-widest text-azure mb-3 ${align === "center" ? "flex items-center justify-center gap-2" : "flex items-center gap-2"}`}>
          <span className="w-6 h-[2px] bg-azure" />
          {eyebrow}
        </div>
      )}
      <h2 className={`font-heading text-3xl md:text-5xl uppercase leading-none tracking-tight ${light ? "text-signal" : "text-graphite"}`}>
        {title}
      </h2>
      {description && (
        <p className={`mt-4 text-muted-foreground text-base md:text-lg max-w-2xl ${align === "center" ? "mx-auto" : ""}`}>
          {description}
        </p>
      )}
    </div>
  );
}