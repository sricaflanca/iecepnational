import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Search, ArrowRight, Calendar, FileText, Users, BookOpen } from "lucide-react";
import { Image } from "@/components/ui/image";

const HERO_IMAGE = "https://media.base44.com/images/public/6a71bda7bbd3a6eea5934e04/2a8c5d322_generated_d3b45498.png";

const QUICK_LINKS = [
  { label: "Events", path: "/events", icon: Calendar, desc: "Upcoming conventions & seminars" },
  { label: "Member Search", path: "/member-search", icon: Search, desc: "Verify member credentials" },
  { label: "Resolutions", path: "/resolutions", icon: FileText, desc: "Board resolutions archive" },
  { label: "IECEPistle", path: "/iecepistle", icon: BookOpen, desc: "Official newsletter" },
  { label: "Corporate Members", path: "/corporate-members", icon: Users, desc: "Industry partners" },
];

export default function Home() {
  const [tickerItems, setTickerItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    base44.entities.IECEPistle.list("-date_published", 8)
      .then(setTickerItems)
      .catch(() => setTickerItems([]));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/member-search?q=${encodeURIComponent(searchQuery)}`);
  };

  const tickerList = tickerItems.length > 0 ? tickerItems : [
    { id: "1", title: "IECEP National Convention 2026 Announced", issue_number: "01" },
    { id: "2", title: "New Board Resolution on Continuing Professional Development", issue_number: "02" },
    { id: "3", title: "Student Chapter Excellence Awards Now Open", issue_number: "03" },
  ];

  return (
    <div>
      {/* HERO */}
      <section className="relative border-b-2 border-graphite">
        <div className="grid lg:grid-cols-2 min-h-[70vh]">
          {/* Left: Ticker */}
          <div className="bg-navy text-signal p-6 md:p-10 lg:p-12 flex flex-col justify-between border-b-2 lg:border-b-0 lg:border-r-2 border-signal/20 relative overflow-hidden">
            <div className="circuit-grid absolute inset-0 opacity-30" />
            <div className="relative z-10">
              <div className="font-mono text-xs uppercase tracking-widest text-azure mb-2">// IECEPISTLE FEED</div>
              <div className="font-heading text-signal text-2xl md:text-3xl uppercase leading-none">Latest Headlines</div>
            </div>
            <div className="relative z-10 mt-8 h-[280px] overflow-hidden">
              <div className="ticker-track flex-col gap-6">
                {[...tickerList, ...tickerList].map((item, i) => (
                  <div key={i} className="border-l-2 border-azure pl-4 py-1">
                    <div className="font-mono text-[10px] text-azure mb-1">ISSUE #{item.issue_number || "—"}</div>
                    <div className="font-heading text-signal text-base md:text-lg uppercase leading-tight">{item.title}</div>
                  </div>
                ))}
              </div>
            </div>
            <Link to="/iecepistle" className="relative z-10 nb-btn bg-azure text-signal px-6 py-3 text-xs self-start mt-8">
              Read IECEPistle <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>

          {/* Right: Member Quick-Search + Identity */}
          <div className="bg-signal p-6 md:p-10 lg:p-12 flex flex-col justify-center relative">
            <div className="circuit-grid absolute inset-0 opacity-50" />
            <div className="relative z-10 max-w-xl">
              <div className="font-mono text-xs uppercase tracking-widest text-azure mb-3">EST. 1950 · PRC ACCREDITED</div>
              <h1 className="font-heading text-graphite text-4xl md:text-6xl lg:text-7xl uppercase leading-[0.9] tracking-tight">
                Institute of Electronics Engineers
                <span className="text-azure block">of the Philippines</span>
              </h1>
              <p className="mt-6 text-muted-foreground text-base md:text-lg max-w-lg">
                The integrated and accredited professional organization of electronics engineers, advancing technical excellence and nation-building since 1949.
              </p>

              <form onSubmit={handleSearch} className="mt-8">
                <label className="font-mono text-xs uppercase tracking-widest text-graphite block mb-2">Member Quick-Search</label>
                <div className="flex border-2 border-graphite nb-shadow">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter name or license number…"
                    className="flex-1 px-4 py-3 bg-signal font-mono text-sm outline-none placeholder:text-muted-foreground/60"
                  />
                  <button type="submit" className="bg-azure text-signal px-5 hover:bg-navy transition-colors flex items-center justify-center" aria-label="Search">
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK LINKS GRID */}
      <section className="border-b-2 border-graphite">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 md:py-16">
          <div className="font-mono text-xs uppercase tracking-widest text-azure mb-6">// QUICK ACCESS</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {QUICK_LINKS.map(link => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="nb-card nb-card-hover p-5 flex flex-col gap-3 group"
                >
                  <div className="w-10 h-10 bg-navy text-signal border-2 border-graphite flex items-center justify-center group-hover:bg-azure transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-heading text-graphite text-sm uppercase">{link.label}</div>
                    <div className="font-mono text-[10px] text-muted-foreground mt-1">{link.desc}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* MISSION / ABOUT TEASER */}
      <section className="border-b-2 border-graphite">
        <div className="grid lg:grid-cols-2">
          <div className="relative min-h-[400px] border-b-2 lg:border-b-0 lg:border-r-2 border-graphite">
            <Image
              src={HERO_IMAGE}
              alt="Circuit board macro photography"
              className="w-full h-full object-cover"
              fittingType="fill"
            />
          </div>
          <div className="p-6 md:p-12 lg:p-16 flex flex-col justify-center">
            <div className="font-mono text-xs uppercase tracking-widest text-azure mb-3">// OUR MANDATE</div>
            <h2 className="font-heading text-graphite text-3xl md:text-4xl uppercase leading-tight">
              Engineering the Nation's Future
            </h2>
            <p className="mt-4 text-muted-foreground text-base md:text-lg">
              IECEP is the globally recognized professional organization uniting over 50,000 electronics engineers across the Philippines. We set the standards for practice, uphold professional ethics, and foster continuous technical advancement.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { num: "75+", label: "Years of Service" },
                { num: "50K+", label: "Members" },
                { num: "50+", label: "Chapters" },
              ].map(stat => (
                <div key={stat.label} className="border-2 border-graphite p-4 nb-shadow">
                  <div className="font-heading text-azure text-2xl md:text-3xl">{stat.num}</div>
                  <div className="font-mono text-[10px] text-muted-foreground uppercase mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
            <Link to="/about" className="nb-btn bg-navy text-signal px-6 py-3 text-xs self-start mt-8">
              About IECEP <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}