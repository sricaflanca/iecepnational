import React from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/diaglog";

// Full-text view for a card's write-up. `meta` is a list of
// { icon, text } rows (date, location…); empty text is skipped. `children`
// renders after the body, e.g. a download link.
export default function WriteUpDialog({ open, onClose, badges, title, meta = [], image, body, children }) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0 border-2 border-graphite bg-card nb-shadow-lg">
        <div className="p-6 md:p-8">
          {badges && <div className="flex flex-wrap items-center gap-2 mb-3 pr-8">{badges}</div>}
          <DialogTitle className="font-heading text-graphite text-2xl md:text-3xl uppercase leading-tight tracking-normal pr-8">
            {title}
          </DialogTitle>
          <DialogDescription className="sr-only">Full write-up</DialogDescription>

          {meta.some((m) => m.text) && (
            <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3 font-mono text-xs uppercase text-muted-foreground">
              {meta.filter((m) => m.text).map((m, i) => (
                <span key={i} className="flex items-center gap-1">
                  {m.icon && <m.icon className="w-3 h-3" />}
                  {m.text}
                </span>
              ))}
            </div>
          )}

          {image && (
            <img src={image} alt={title} className="w-full max-h-80 object-cover border-2 border-graphite mt-5" />
          )}

          {body && (
            <p className="mt-6 text-base text-foreground whitespace-pre-line break-words">{body}</p>
          )}

          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Small prompt at the bottom of a clickable card.
export function ReadMoreCue() {
  return (
    <div className="mt-4 font-mono text-[10px] uppercase tracking-widest text-azure">Read full write-up →</div>
  );
}
