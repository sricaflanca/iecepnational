import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { ExternalLink } from "lucide-react";
import { PageBanner } from "@/pages/About";
import { LoadingGrid, EmptyState } from "@/pages/Events";

export default function IECEPistle() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    base44.entities.IECEPistle.list("-date_published", 50)
      .then(data => {
        setIssues(data);
        if (data.length > 0) setSelected(data[0]);
      })
      .catch(() => setIssues([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageBanner eyebrow="// The Knowledge" title="IECEPistle" subtitle="The official newsletter of the Institute of Electronics Engineers of the Philippines" />

      <section className="border-b-2 border-graphite">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 md:py-16">
          {loading ? (
            <LoadingGrid />
          ) : issues.length === 0 ? (
            <EmptyState message="No newsletters published yet." />
          ) : (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Featured issue */}
              {selected && (
                <div className="lg:col-span-2 nb-card p-6 md:p-8">
                  <div className="font-mono text-xs uppercase tracking-widest text-azure mb-3">// FEATURED ISSUE</div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-mono text-xs bg-navy text-signal px-2 py-1">ISSUE #{selected.issue_number}</span>
                    <span className="font-mono text-[10px] text-muted-foreground uppercase">{formatDate(selected.date_published)}</span>
                  </div>
                  <h2 className="font-heading text-graphite text-2xl md:text-3xl uppercase leading-tight">{selected.title}</h2>
                  <p className="mt-4 text-muted-foreground text-base md:text-lg">{selected.summary}</p>
                  {selected.content && (
                    <div className="mt-6 border-l-2 border-azure pl-4 text-sm text-muted-foreground max-h-[300px] overflow-y-auto">
                      {selected.content}
                    </div>
                  )}
                  {selected.file_url && (
                    <a href={selected.file_url} target="_blank" rel="noopener noreferrer" className="nb-btn bg-azure text-signal px-6 py-3 text-xs inline-flex mt-6">
                      Read Full Issue <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  )}
                </div>
              )}

              {/* Archive list */}
              <div>
                <div className="font-mono text-xs uppercase tracking-widest text-azure mb-4">// ARCHIVE</div>
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {issues.map(issue => (
                    <button
                      key={issue.id}
                      onClick={() => setSelected(issue)}
                      className={`w-full text-left border-2 p-4 transition-all ${
                        selected?.id === issue.id
                          ? "bg-navy text-signal border-graphite nb-shadow"
                          : "bg-signal text-graphite border-graphite hover:bg-muted"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-[10px] uppercase opacity-70">ISSUE #{issue.issue_number}</span>
                        <span className="font-mono text-[10px] opacity-70">{formatDate(issue.date_published)}</span>
                      </div>
                      <div className="font-heading text-sm uppercase leading-tight">{issue.title}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short" });
}