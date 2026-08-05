import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Search, ShieldCheck } from "lucide-react";
import { PageBanner } from "@/pages/About";
import Badge from "@/components/Badge";
import { LoadingGrid, EmptyState } from "@/pages/Events";

export default function MemberSearch() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!query.trim()) {
      setMembers([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    setSearched(true);
    try {
      const results = await base44.entities.Member.filter({}, "full_name", 50);
      const q = query.toLowerCase();
      setMembers(results.filter(m =>
        (m.full_name || "").toLowerCase().includes(q) ||
        (m.license_number || "").toLowerCase().includes(q) ||
        (m.chapter || "").toLowerCase().includes(q)
      ));
    } catch {
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchParams.get("q")) handleSearch();
  }, []);

  return (
    <div>
      <PageBanner eyebrow="// The Professional" title="Member Search" subtitle="Verify the membership status and credentials of registered electronics engineers" />

      <section className="border-b-2 border-graphite">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 md:py-16">
          <form onSubmit={handleSearch} className="mb-8">
            <label className="font-mono text-xs uppercase tracking-widest text-graphite block mb-2">Search Member Directory</label>
            <div className="flex border-2 border-graphite nb-shadow">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter name, license number, or chapter…"
                className="flex-1 px-4 py-3 bg-signal font-mono text-sm outline-none placeholder:text-muted-foreground/60"
              />
              <button type="submit" className="bg-azure text-signal px-6 hover:bg-navy transition-colors flex items-center gap-2 font-mono text-xs uppercase">
                <Search className="w-4 h-4" /> Search
              </button>
            </div>
          </form>

          {loading ? (
            <LoadingGrid />
          ) : searched ? (
            members.length === 0 ? (
              <EmptyState message="No members found matching your search." />
            ) : (
              <div className="overflow-x-auto">
                <div className="min-w-[600px]">
                  <div className="grid grid-cols-12 gap-0 border-2 border-graphite font-mono text-[10px] uppercase tracking-widest text-azure bg-navy">
                    <div className="col-span-4 p-3 border-r-2 border-signal/20">Name</div>
                    <div className="col-span-3 p-3 border-r-2 border-signal/20">License No.</div>
                    <div className="col-span-3 p-3 border-r-2 border-signal/20">Chapter</div>
                    <div className="col-span-2 p-3">Status</div>
                  </div>
                  {members.map(m => (
                    <div key={m.id} className="grid grid-cols-12 gap-0 border-2 border-t-0 border-graphite hover:bg-muted transition-colors">
                      <div className="col-span-4 p-3 border-r-2 border-graphite">
                        <div className="font-heading text-graphite text-sm uppercase">{m.full_name}</div>
                        {m.specialization && <div className="font-mono text-[10px] text-muted-foreground mt-1">{m.specialization}</div>}
                      </div>
                      <div className="col-span-3 p-3 border-r-2 border-graphite font-mono text-sm text-graphite">{m.license_number}</div>
                      <div className="col-span-3 p-3 border-r-2 border-graphite font-mono text-sm text-muted-foreground">{m.chapter || "—"}</div>
                      <div className="col-span-2 p-3"><Badge variant={m.membership_status}>{m.membership_status}</Badge></div>
                    </div>
                  ))}
                </div>
              </div>
            )
          ) : (
            <div className="border-2 border-dashed border-graphite p-12 text-center">
              <ShieldCheck className="w-12 h-12 text-azure mx-auto mb-4" />
              <div className="font-heading text-graphite text-lg uppercase">Search the Member Directory</div>
              <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">Enter a member's name, PRC license number, or chapter to verify their membership status and credentials.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}