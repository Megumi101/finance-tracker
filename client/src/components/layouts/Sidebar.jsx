import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

// ─── Icons (inline SVG, no extra dep) ────────────────────────────────────────
const Icon = ({ name }) => {
	const icons = {
		dashboard: (
			<svg
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<rect x="3" y="3" width="7" height="7" rx="1" />
				<rect x="14" y="3" width="7" height="7" rx="1" />
				<rect x="3" y="14" width="7" height="7" rx="1" />
				<rect x="14" y="14" width="7" height="7" rx="1" />
			</svg>
		),
		transaction: (
			<svg
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<path d="M7 16V4m0 0L3 8m4-4 4 4M17 8v12m0 0 4-4m-4 4-4-4" />
			</svg>
		),
		category: (
			<svg
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<path d="M4 6h16M4 12h10M4 18h6" />
			</svg>
		),
		report: (
			<svg
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
				<polyline points="14,2 14,8 20,8" />
				<line x1="8" y1="13" x2="16" y2="13" />
				<line x1="8" y1="17" x2="12" y2="17" />
			</svg>
		),
		filter: (
			<svg
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46" />
			</svg>
		),
		settings: (
			<svg
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<circle cx="12" cy="12" r="3" />
				<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
			</svg>
		),
		chevronLeft: (
			<svg
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<polyline points="15,18 9,12 15,6" />
			</svg>
		),
		bolt: (
			<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
				<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
			</svg>
		),
	};
	return icons[name] ?? null;
};

// ─── Nav config ───────────────────────────────────────────────────────────────
const NAV_MAIN = [
	{ label: "Dashboard", icon: "dashboard", to: "/" },
	{ label: "Transaksi", icon: "transaction", to: "/transaksi" },
	{ label: "Kategori", icon: "category", to: "/kategori" },
	{ label: "Laporan", icon: "report", to: "/laporan" },
];

const NAV_OTHER = [
	{ label: "Filter & Ekspor", icon: "filter", to: "/filter" },
	{ label: "Pengaturan", icon: "settings", to: "/pengaturan" },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function Sidebar({ collapsed, onToggle }) {
	const location = useLocation();

	return (
		<aside
			className={`
        relative flex flex-col h-screen bg-[#0C1120] border-r border-white/[0.06]
        transition-all duration-300 ease-in-out flex-shrink-0
        ${collapsed ? "w-[68px]" : "w-[220px]"}
      `}
		>
			{/* ── Logo ── */}
			<div className={`flex items-center gap-3 px-5 pt-7 pb-8 overflow-hidden`}>
				<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
					₿
				</div>
				{!collapsed && (
					<span className="font-mono font-bold text-[14px] text-white tracking-tight whitespace-nowrap">
						FinTrack
					</span>
				)}
			</div>

			{/* ── Main Nav ── */}
			<NavSection label="Menu" collapsed={collapsed} />
			<nav className="flex flex-col gap-0.5 px-2">
				{NAV_MAIN.map((item) => (
					<SidebarLink key={item.to} item={item} collapsed={collapsed} />
				))}
			</nav>

			{/* ── Other Nav ── */}
			<NavSection label="Lainnya" collapsed={collapsed} />
			<nav className="flex flex-col gap-0.5 px-2">
				{NAV_OTHER.map((item) => (
					<SidebarLink key={item.to} item={item} collapsed={collapsed} />
				))}
			</nav>

			{/* ── Upgrade Card ── */}
			{!collapsed && (
				<div className="mt-auto mx-3 mb-5 p-4 rounded-xl bg-violet-600/10 border border-violet-500/20">
					<p className="text-[12px] font-semibold text-violet-300 flex items-center gap-1.5">
						<Icon name="bolt" /> Mode Pro
					</p>
					<p className="text-[11px] text-slate-400 mt-1 mb-3 leading-relaxed">
						Akses laporan lengkap & AI Insight keuangan.
					</p>
					<button className="w-full bg-violet-600 hover:bg-violet-500 text-white text-[11px] font-semibold py-1.5 px-3 rounded-lg transition-colors duration-200">
						Upgrade Sekarang
					</button>
				</div>
			)}

			{/* ── Collapse Toggle ── */}
			<button
				onClick={onToggle}
				className="
          absolute -right-3 top-9
          w-6 h-6 rounded-full
          bg-[#1A1F35] border border-white/10
          flex items-center justify-center
          text-slate-400 hover:text-violet-400
          transition-all duration-200 hover:border-violet-500/40
          z-10
        "
				aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
			>
				<span
					className={`transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
				>
					<Icon name="chevronLeft" />
				</span>
			</button>
		</aside>
	);
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function NavSection({ label, collapsed }) {
	if (collapsed)
		return <div className="my-3 mx-auto w-6 border-t border-white/[0.06]" />;
	return (
		<p className="text-[10px] font-medium tracking-[1.8px] text-slate-600 uppercase px-5 pt-5 pb-2">
			{label}
		</p>
	);
}

function SidebarLink({ item, collapsed }) {
	return (
		<NavLink
			to={item.to}
			end={item.to === "/"}
			className={({ isActive }) => `
        flex items-center gap-3 px-3 py-2.5 rounded-lg
        transition-all duration-150 group relative
        border-l-2
        ${
					isActive
						? "bg-violet-600/8 text-violet-400 border-violet-600"
						: "text-slate-500 border-transparent hover:text-slate-300 hover:bg-white/[0.03]"
				}
        ${collapsed ? "justify-center" : ""}
      `}
		>
			{/* Icon */}
			<span className="flex-shrink-0 transition-colors duration-150">
				<Icon name={item.icon} />
			</span>

			{/* Label */}
			{!collapsed && (
				<span className="text-[13px] font-medium whitespace-nowrap">
					{item.label}
				</span>
			)}

			{/* Tooltip on collapsed */}
			{collapsed && (
				<span
					className="
          absolute left-full ml-3 px-2.5 py-1.5
          bg-[#1A1F35] border border-white/10
          text-slate-200 text-[12px] font-medium rounded-lg
          whitespace-nowrap opacity-0 pointer-events-none
          group-hover:opacity-100 transition-opacity duration-200
          shadow-xl z-50
        "
				>
					{item.label}
				</span>
			)}
		</NavLink>
	);
}
