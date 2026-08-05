import React from "react";
import { Link } from "react-router-dom";
import iecepLogo from "@/assets/ieceplogo.png";

const FOOTER_COLUMNS = [
  {
    title: "The Institute",
    links: [
      { label: "About Us", path: "/about" },
      { label: "Corporate Members", path: "/corporate-members" },
      { label: "Admin Login", path: "/admin" },
    ],
  },
  {
    title: "The Professional",
    links: [
      { label: "Member Search", path: "/member-search" },
      { label: "Events", path: "/events" },
      { label: "Resolutions", path: "/resolutions" },
    ],
  },
  {
    title: "The Knowledge",
    links: [
      { label: "IECEPistle", path: "/iecepistle" },
      { label: "Chapter Corner", path: "/chapter-corner" },
      { label: "Student Corner", path: "/student-corner" },
    ],
  },
  {
    title: "The Community",
    links: [
      { label: "Social Clubs", path: "/social-clubs" },
      { label: "Contact", path: "/about" },
      { label: "Privacy Policy", path: "/about" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-navy text-signal border-t-2 border-azure">
      <div className="circuit-grid">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
            {FOOTER_COLUMNS.map(col => (
              <div key={col.title}>
                <div className="font-mono text-[10px] uppercase tracking-widest text-azure mb-4">{col.title}</div>
                <ul className="space-y-2">
                  {col.links.map(link => (
                    <li key={link.label}>
                      <Link to={link.path} className="font-body text-sm text-signal/80 hover:text-signal hover:underline underline-offset-4 transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t-2 border-signal/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              {/* The logo's ink is a similar blue family to the site's navy,
                  so a light backing plate keeps the mark legible on this
                  dark surface regardless of exact palette tuning. */}
              <div className="w-14 h-14 bg-signal border-2 border-azure/40 flex items-center justify-center p-1.5 flex-shrink-0">
                <img src={iecepLogo} alt="IECEP" className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="font-heading text-signal text-sm uppercase">
                  Institute of Electronics Engineers of the Philippines, Inc.
                  <sup className="ml-0.5 text-[9px] align-super">®</sup>
                </div>
                <div className="font-mono text-[10px] text-signal/60 mt-1">www.iecepnational.com</div>
              </div>
            </div>
            <div className="flex flex-col items-start md:items-end gap-1.5">
              <span className="font-mono text-[10px] text-signal/50">© {new Date().getFullYear()} IECEP. ALL RIGHTS RESERVED.</span>
              <span
                className="w-4 h-4 rounded-full border border-signal/50 flex items-center justify-center font-mono text-signal/50"
                style={{ fontSize: "6px" }}
                title="SCR"
              >
                SCR
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}