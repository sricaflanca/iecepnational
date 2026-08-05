import React, { useState, useMemo } from "react";
import { useAuth } from "@/lib/AuthContext";
import { Link } from "react-router-dom";
import { FileText, Calendar, BookOpen, MapPin, Users, GraduationCap, LogOut, LayoutGrid, Cpu, Globe, UserCog, KeyRound, Landmark } from "lucide-react";
import AdminCrudManager from "@/components/admin/AdminCrudManager";
import UsersManager from "@/components/admin/UsersManager";
import ChangePassword from "@/components/admin/ChangePassword";
import LeadershipImageManager from "@/components/admin/LeadershipImageManager";
import AnimatedBackground from "@/components/AnimatedBackground";

const TABS = [
  {
    id: "resolutions",
    label: "Resolutions",
    icon: FileText,
    entity: "Resolution",
    title: "Board Resolutions",
    fields: [
      { key: "resolution_number", label: "Resolution No.", type: "text", required: true, placeholder: "e.g. BR-2026-001" },
      { key: "title", label: "Title", type: "text", required: true },
      { key: "date_issued", label: "Date Issued", type: "date", required: true, sortBy: true },
      { key: "category", label: "Category", type: "select", required: true, options: ["Board Resolution", "Administrative", "Policy", "Ethics", "Election"] },
      { key: "summary", label: "Summary", type: "textarea", required: true },
      { key: "file_url", label: "Document", type: "file" },
    ],
  },
  {
    id: "events",
    label: "Events",
    icon: Calendar,
    entity: "Event",
    title: "Events",
    fields: [
      { key: "title", label: "Event Title", type: "text", required: true },
      { key: "start_date", label: "Start Date", type: "date", required: true, sortBy: true },
      { key: "end_date", label: "End Date", type: "date" },
      { key: "type", label: "Event Type", type: "select", required: true, options: ["National Convention", "Seminar", "Workshop", "Webinar", "Certification", "General Assembly"] },
      { key: "location", label: "Location", type: "text", required: true },
      { key: "description", label: "Description", type: "textarea", required: true },
      { key: "image_url", label: "Image", type: "file" },
    ],
  },
  {
    id: "iecepistle",
    label: "IECEPistle",
    icon: BookOpen,
    entity: "IECEPistle",
    title: "IECEPistle Newsletter",
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "issue_number", label: "Issue Number", type: "text", required: true, placeholder: "e.g. Vol. 76 No. 3" },
      { key: "date_published", label: "Date Published", type: "date", required: true, sortBy: true },
      { key: "summary", label: "Summary", type: "textarea", required: true },
      { key: "content", label: "Full Content", type: "textarea" },
      { key: "file_url", label: "Newsletter PDF", type: "file" },
    ],
  },
  {
    id: "chapters",
    label: "Chapter Corner",
    icon: MapPin,
    entity: "ChapterEvent",
    title: "Chapter Events",
    fields: [
      { key: "chapter", label: "Chapter Name", type: "text", required: true, placeholder: "e.g. IECEP NCR Chapter" },
      { key: "title", label: "Event Title", type: "text", required: true },
      { key: "date", label: "Date", type: "date", required: true, sortBy: true },
      { key: "location", label: "Location", type: "text" },
      { key: "description", label: "Description", type: "textarea", required: true },
    ],
  },
  {
    id: "social",
    label: "Social Clubs",
    icon: Users,
    entity: "SocialEvent",
    title: "Social Club Events",
    fields: [
      { key: "title", label: "Event Title", type: "text", required: true },
      { key: "club", label: "Club / Category", type: "select", required: true, options: ["Sports", "Arts & Culture", "Outreach", "Fellowship", "Other"] },
      { key: "date", label: "Date", type: "date", required: true, sortBy: true },
      { key: "location", label: "Location", type: "text" },
      { key: "description", label: "Description", type: "textarea", required: true },
    ],
  },
  {
    id: "students",
    label: "Student Corner",
    icon: GraduationCap,
    entity: "StudentActivity",
    title: "Student Activities",
    fields: [
      { key: "title", label: "Activity Title", type: "text", required: true },
      { key: "school", label: "School / University", type: "text", required: true },
      { key: "category", label: "Category", type: "select", required: true, options: ["Competition", "Seminar", "Outreach", "Workshop", "Recognition"] },
      { key: "date", label: "Date", type: "date", required: true, sortBy: true },
      { key: "description", label: "Description", type: "textarea", required: true },
    ],
  },
  {
    id: "specializations",
    label: "Specializations",
    icon: Cpu,
    entity: "Specialization",
    title: "Specializations Corner",
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "type", label: "Entry Type", type: "select", required: true, options: ["Event", "News"] },
      { key: "specialization", label: "Specialization", type: "select", required: true, options: ["Telecommunications", "Semiconductor Design", "Broadcast Engineering", "Power Electronics", "IoT & Embedded Systems", "Industrial Automation", "Network Engineering", "Signal Processing", "Renewable Energy", "Biomedical Electronics"] },
      { key: "date", label: "Date", type: "date", required: true, sortBy: true },
      { key: "location", label: "Location", type: "text" },
      { key: "description", label: "Description", type: "textarea", required: true },
      { key: "image_url", label: "Image", type: "file" },
    ],
  },
  {
    id: "partners",
    label: "Partners",
    icon: Globe,
    entity: "Partner",
    title: "Partners & Links",
    fields: [
      { key: "company_name", label: "Partner Name", type: "text", required: true },
      { key: "website_url", label: "Website URL", type: "text", required: true, placeholder: "https://..." },
      { key: "category", label: "Category", type: "select", required: true, options: ["Industry", "Academe", "Government", "Media", "Technology", "Professional Association"] },
      { key: "description", label: "Description", type: "textarea", required: true },
      { key: "logo_url", label: "Logo Image", type: "file" },
    ],
  },
  {
    id: "leadership",
    label: "Leadership",
    icon: Landmark,
    entity: "BoardMember",
    title: "National Board of Directors",
    fields: [
      { key: "name", label: "Full Name", type: "text", required: true, placeholder: "e.g. Engr. Juan Dela Cruz, PECE" },
      { key: "role", label: "Board Role", type: "text", required: true, placeholder: "e.g. National President" },
    ],
    // Rendered above the AdminCrudManager list for this tab — lets whoever
    // manages the board also swap the photo shown beside it.
    extra: LeadershipImageManager,
  },
  // No entity/fields — renders UsersManager instead of AdminCrudManager.
  // Only visible to (and usable by) admins.
  {
    id: "users",
    label: "Staff Access",
    icon: UserCog,
    role: "admin",
  },
  // Every signed-in user can change their own password, regardless of role.
  {
    id: "account",
    label: "Change Password",
    icon: KeyRound,
    alwaysVisible: true,
  },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  // Each tab requires its own role (defaulting to its id) unless it
  // declares one explicitly (the Users tab requires "admin"), or opts out
  // of role-gating entirely (the Change Password tab is always visible).
  // "admin" itself always sees every tab. This means visibleTabs always has
  // at least the Change Password tab, so currentTab is never undefined.
  const visibleTabs = useMemo(() => {
    const roles = user?.roles || [];
    return TABS.filter((tab) => tab.alwaysVisible || roles.includes("admin") || roles.includes(tab.role || tab.id));
  }, [user]);

  const [activeTab, setActiveTab] = useState(null);
  const currentTab = visibleTabs.find((t) => t.id === activeTab) || visibleTabs[0];

  const handleLogout = () => {
    logout(false);
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative">
      <AnimatedBackground />
      {/* Sidebar */}
      <aside className="lg:w-72 bg-navy text-signal border-r-2 border-graphite lg:min-h-screen flex flex-col">
        <div className="p-6 border-b-2 border-signal/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-azure border-2 border-signal flex items-center justify-center">
              <LayoutGrid className="w-5 h-5 text-signal" />
            </div>
            <div>
              <div className="font-heading text-signal text-sm uppercase">Command Center</div>
              <div className="font-mono text-[10px] text-signal/60">IECEP ADMIN</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-x-auto lg:overflow-x-visible">
          {visibleTabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 border-2 font-mono text-xs uppercase tracking-wide transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-azure text-navy border-azure"
                    : "bg-transparent text-signal/70 border-transparent hover:bg-signal/10"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" /> {tab.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t-2 border-signal/20">
          <div className="font-mono text-[10px] text-signal/60 mb-2 truncate">{user?.email || "admin@iecep.org"}</div>
          <div className="flex gap-2">
            <Link to="/" className="flex-1 nb-btn bg-azure text-navy border-azure px-3 py-2 text-[10px] justify-center">View Site</Link>
            <button onClick={handleLogout} className="flex-1 nb-btn bg-destructive text-signal px-3 py-2 text-[10px] justify-center">
              <LogOut className="w-3 h-3 mr-1" />Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-x-hidden">
        <div className="font-mono text-xs uppercase tracking-widest text-azure mb-2">// MANAGE {currentTab.label.toUpperCase()}</div>
        <h1 className="font-heading text-graphite text-2xl md:text-3xl uppercase mb-8">Content Management</h1>

        {currentTab.id === "users" ? (
          <UsersManager />
        ) : currentTab.id === "account" ? (
          <ChangePassword />
        ) : (
          <>
            {currentTab.extra && <currentTab.extra />}
            <AdminCrudManager
              key={currentTab.id}
              entityName={currentTab.entity}
              title={currentTab.title}
              fields={currentTab.fields}
              icon={currentTab.icon}
            />
          </>
        )}
      </main>
    </div>
  );
}