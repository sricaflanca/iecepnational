import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import SectionHeader from "@/components/SectionHeader";
import { base44 } from "@/api/base44Client";

const BLUEPRINT_IMG = "https://media.base44.com/images/public/6a71bda7bbd3a6eea5934e04/a1b9fd9f3_generated_2d2318b0.png";
// Fallback shown until the admin-managed setting loads (or if it's unset).
const DEFAULT_LEADERSHIP_IMG = "https://media.base44.com/images/public/6a71bda7bbd3a6eea5934e04/3ac26d558_generated_c5f7190f.png";

export default function About() {
  const [boardMembers, setBoardMembers] = useState([]);
  const [leadershipImage, setLeadershipImage] = useState(DEFAULT_LEADERSHIP_IMG);

  useEffect(() => {
    // Ascending so members display in the order the admin added them
    // (e.g. President first, then VPs) — matches how the admin dashboard's
    // add-only, no-reorder editing naturally builds up the list.
    base44.entities.BoardMember.list("created_date", 50)
      .then(setBoardMembers)
      .catch(() => setBoardMembers([]));
    base44.settings.about.get()
      .then((s) => { if (s?.leadership_image_url) setLeadershipImage(s.leadership_image_url); })
      .catch(() => {});
  }, []);

  return (
    <div>
      <PageBanner eyebrow="// The Institute" title="About Us" subtitle="Advancing electronics engineering excellence since 1949" />

      <section className="border-b-2 border-graphite">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 md:py-16">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            <div>
              <SectionHeader eyebrow="Our History" title="Seven Decades of Excellence" />
              <div className="space-y-4 text-muted-foreground text-base md:text-lg">
                <p>The Institute of Electronics Engineers of the Philippines (IECEP) was established in 1950 as the professional organization for electronics engineers in the country. Over the past seven decades, IECEP has grown into the largest professional engineering organization in the Philippines, with over 50,000 members and more than 50 chapters nationwide.</p>
                <p>IECEP is accredited by the Professional Regulation Commission (PRC) as the integrated professional organization for electronics engineers and electronics technicians. We are committed to advancing the practice of electronics engineering, upholding professional ethics, and contributing to national development through technology and innovation.</p>
              </div>
            </div>
            <div className="border-2 border-graphite nb-shadow">
              <Image src={BLUEPRINT_IMG} alt="Engineering blueprints" className="w-full h-[400px]" fittingType="fill" />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b-2 border-graphite bg-navy text-signal">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 md:py-16">
          <SectionHeader eyebrow="// Our Purpose" title="Mission & Vision" light />
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border-2 border-signal/30 p-6 md:p-8">
              <div className="font-mono text-xs uppercase tracking-widest text-azure mb-3">MISSION</div>
              <p className="text-signal/90 text-base md:text-lg">To promote the advancement of electronics engineering as a profession, foster technical competence among members, and contribute to national development through the application of electronics and communications technology.</p>
            </div>
            <div className="border-2 border-signal/30 p-6 md:p-8">
              <div className="font-mono text-xs uppercase tracking-widest text-azure mb-3">VISION</div>
              <p className="text-signal/90 text-base md:text-lg">To be the globally recognized professional organization of electronics engineers, driving innovation, excellence, and ethical practice in service to the Filipino people and the engineering community.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b-2 border-graphite">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 md:py-16">
          <SectionHeader eyebrow="// Core Values" title="What We Stand For" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Excellence", desc: "Setting the highest standards of technical competence and professional practice." },
              { title: "Integrity", desc: "Upholding ethical conduct and accountability in all professional endeavors." },
              { title: "Innovation", desc: "Embracing technological advancement and continuous learning." },
              { title: "Service", desc: "Contributing to nation-building through engineering expertise." },
            ].map(val => (
              <div key={val.title} className="nb-card nb-card-hover p-6">
                <div className="font-mono text-azure text-2xl mb-2">0{["Excellence","Integrity","Innovation","Service"].indexOf(val.title)+1}</div>
                <div className="font-heading text-graphite text-lg uppercase">{val.title}</div>
                <p className="mt-2 text-sm text-muted-foreground">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b-2 border-graphite">
        <div className="grid lg:grid-cols-2">
          <div className="border-2 border-graphite nb-shadow m-4 md:m-8">
            <Image src={leadershipImage} alt="IECEP leadership" className="w-full h-[300px] lg:h-full" fittingType="fill" />
          </div>
          <div className="p-6 md:p-12 lg:p-16 flex flex-col justify-center">
            <SectionHeader eyebrow="// Leadership" title="National Board of Directors" />
            <p className="text-muted-foreground text-base md:text-lg mb-6">
              IECEP is governed by a National Board of Directors elected by the membership. The Board sets strategic direction, approves resolutions, and ensures the organization fulfills its mandate to the profession and the public.
            </p>
            <div className="space-y-3">
              {boardMembers.length === 0 ? (
                <p className="font-mono text-xs text-muted-foreground uppercase">Board information coming soon.</p>
              ) : (
                boardMembers.map(member => (
                  <div key={member.id} className="flex items-center justify-between border-2 border-graphite px-4 py-3 nb-shadow bg-card">
                    <div>
                      <div className="font-heading text-graphite text-sm uppercase">{member.name}</div>
                      <div className="font-mono text-[10px] text-muted-foreground uppercase">{member.role}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <Link to="/events" className="nb-btn bg-azure text-signal px-6 py-3 text-xs self-start mt-8">
              Join Our Events <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b-2 border-graphite">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 md:py-16">
          <SectionHeader eyebrow="// Contact" title="Get in Touch" />
          <div className="grid md:grid-cols-3 gap-4">
            <div className="nb-card p-6">
              <div className="font-mono text-xs uppercase tracking-widest text-azure mb-2">ADDRESS</div>
              <p className="text-sm text-muted-foreground">IECEP National Office<br/>52A P. Gomez St, Poblacion<br/>Mandaluyong City, Philippines</p>
            </div>
            <div className="nb-card p-6">
              <div className="font-mono text-xs uppercase tracking-widest text-azure mb-2">EMAIL</div>
              <p className="text-sm text-muted-foreground">secretariat@iecepnational.com<br/>membership@iecepnational.com<br/>president@iecepnational.com</p>
            </div>
            <div className="nb-card p-6">
              <div className="font-mono text-xs uppercase tracking-widest text-azure mb-2">PHONE</div>
              <p className="text-sm text-muted-foreground">+63 (2) 8XXX-XXXX</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export function PageBanner({ eyebrow, title, subtitle }) {
  return (
    <section className="bg-navy text-signal border-b-2 border-graphite">
      <div className="circuit-grid">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 md:py-20">
          <div className="font-mono text-xs uppercase tracking-widest text-azure mb-3">{eyebrow}</div>
          <h1 className="font-heading text-signal text-4xl md:text-6xl lg:text-7xl uppercase leading-none tracking-tight">{title}</h1>
          {subtitle && <p className="mt-4 text-signal/70 text-base md:text-lg max-w-2xl">{subtitle}</p>}
        </div>
      </div>
    </section>
  );
}