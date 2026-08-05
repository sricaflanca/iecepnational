import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import iecepLogo from "@/assets/ieceplogo.png";

const NAV_COLUMNS = [
  {
    pillar: "The Institute",
    links: [
      { label: "About Us", path: "/about" },
      { label: "Corporate Members", path: "/corporate-members" },
      { label: "Partners", path: "/partners" },
    ],
  },
  {
    pillar: "The Professional",
    links: [
      { label: "Member Search", path: "/member-search" },
      { label: "Events", path: "/events" },
      { label: "Specializations", path: "/specializations" },
    ],
  },
  {
    pillar: "The Knowledge",
    links: [
      { label: "Resolutions", path: "/resolutions" },
      { label: "IECEPistle", path: "/iecepistle" },
    ],
  },
  {
    pillar: "The Community",
    links: [
      { label: "Chapter Corner", path: "/chapter-corner" },
      { label: "Student Corner", path: "/student-corner" },
      { label: "Social Clubs", path: "/social-clubs" },
    ],
  },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-signal border-b-2 border-graphite">
        <div className="max-w-[2000px] mx-auto px-4 md:px-8 flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={iecepLogo}
              alt="IECEP"
              className="w-10 h-10 md:w-12 md:h-12 object-contain group-hover:scale-105 transition-transform"
            />
            <div className="hidden sm:block">
              <div className="font-heading text-graphite text-sm md:text-base leading-none">Institute of Electronics Engineers of the Philippines, Inc.</div>
              <div className="font-mono text-[12px] text-muted-foreground leading-none mt-1">EST. 1950</div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            <Link to="/" className="font-mono text-xs uppercase tracking-wide px-3 py-2 border-2 border-transparent hover:border-graphite transition-colors">Home</Link>
            {NAV_COLUMNS.flatMap(col => col.links).map(link => (
              <Link key={link.path} to={link.path} className="font-mono text-xs uppercase tracking-wide px-3 py-2 border-2 border-transparent hover:border-graphite transition-colors">
                {link.label}
              </Link>
            ))}
            <Link to="/admin" className="ml-2 nb-btn bg-azure text-navy px-4 py-2 text-xs">Admin</Link>
          </nav>

          <button
            onClick={() => setOpen(true)}
            className="lg:hidden nb-btn bg-navy text-signal px-3 py-2"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-[60] bg-navy flex flex-col">
          <div className="flex items-center justify-between h-16 md:h-20 px-4 md:px-8 border-b-2 border-signal/20">
            <span className="font-heading text-signal text-base">NAVIGATION</span>
            <button
              onClick={() => setOpen(false)}
              className="nb-btn bg-azure text-navy px-3 py-2"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-4 overflow-y-auto">
            {NAV_COLUMNS.map((col, idx) => (
              <div key={col.pillar} className="border-b-2 md:border-b-0 md:border-r-2 border-signal/20 p-6 md:p-8 animate-overlay-item" style={{ animationDelay: `${idx * 0.05}s` }}>
                <div className="font-mono text-xs uppercase tracking-widest text-azure mb-4">{col.pillar}</div>
                <div className="space-y-1">
                  {col.links.map(link => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="block font-heading text-signal text-lg md:text-xl uppercase hover:text-azure transition-colors py-2"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t-2 border-signal/20 p-4 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link to="/admin" className="nb-btn bg-azure text-navy px-6 py-3 text-sm">Admin Login</Link>
            <span className="font-mono text-xs text-signal/60">INSTITUTE OF ELECTRONICS ENGINEERS OF THE PHILIPPINES</span>
          </div>
        </div>
      )}
    </>
  );
}