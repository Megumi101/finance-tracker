import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";
import { authApi } from "../../lib/api";

// ─── Page title map ───────────────────────────────────────────────────────────
const PAGE_META = {
	"/": { title: "Dashboard", sub: "Ringkasan keuangan bulan ini" },
	"/transaksi": { title: "Transaksi", sub: "Kelola semua transaksi kamu" },
	"/kategori": { title: "Kategori", sub: "Atur kategori keuangan" },
	"/laporan": { title: "Laporan", sub: "Ekspor & analisis laporan" },
	"/profile": { title: "Profil", sub: "Kelola informasi akun Anda" },
	"/pengaturan": { title: "Pengaturan", sub: "Konfigurasi akun & preferensi" },
	"/filter": {
		title: "Filter & Ekspor",
		sub: "Saring data berdasarkan kriteria",
	},
};

// ─── Icons ────────────────────────────────────────────────────────────────────
const SearchIcon = () => (
	<svg
		width="14"
		height="14"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<circle cx="11" cy="11" r="8" />
		<line x1="21" y1="21" x2="16.65" y2="16.65" />
	</svg>
);
const BellIcon = () => (
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
		<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
		<path d="M13.73 21a2 2 0 0 1-3.46 0" />
	</svg>
);
const CalendarIcon = () => (
	<svg
		width="13"
		height="13"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
		<line x1="16" y1="2" x2="16" y2="6" />
		<line x1="8" y1="2" x2="8" y2="6" />
		<line x1="3" y1="10" x2="21" y2="10" />
	</svg>
);
const ChevronIcon = () => (
	<svg
		width="12"
		height="12"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2.5"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<polyline points="6,9 12,15 18,9" />
	</svg>
);
const LogoutIcon = () => (
	<svg
		width="14"
		height="14"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
		<polyline points="16,17 21,12 16,7" />
		<line x1="21" y1="12" x2="9" y2="12" />
	</svg>
);
const UserIcon = () => (
	<svg
		width="14"
		height="14"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
		<circle cx="12" cy="7" r="4" />
	</svg>
);
const MoonIcon = () => (
	<svg
		width="14"
		height="14"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
	>
		<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
	</svg>
);
const SunIcon = () => (
	<svg
		width="14"
		height="14"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
	>
		<circle cx="12" cy="12" r="5" />
		<line x1="12" y1="1" x2="12" y2="3" />
		<line x1="12" y1="21" x2="12" y2="23" />
		<line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
		<line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
		<line x1="1" y1="12" x2="3" y2="12" />
		<line x1="21" y1="12" x2="23" y2="12" />
		<line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
		<line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
	</svg>
);

// ─── Notification dummy data ───────────────────────────────────────────────────
const NOTIFS = [
	{
		id: 1,
		type: "alert",
		text: "Pengeluaran makanan melebihi budget",
		time: "5 menit lalu",
		unread: true,
	},
	{
		id: 2,
		type: "success",
		text: "Pemasukan Rp 3.500.000 berhasil dicatat",
		time: "1 jam lalu",
		unread: true,
	},
	{
		id: 3,
		type: "info",
		text: "Laporan bulanan Desember siap diunduh",
		time: "3 jam lalu",
		unread: false,
	},
];

// ─── Period options ────────────────────────────────────────────────────────────
const PERIODS = [
	"Jan – Mar 2025",
	"Apr – Jun 2025",
	"Jul – Sep 2025",
	"Okt – Des 2025",
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function Navbar() {
	const location = useLocation();
	const navigate = useNavigate();
	const { user: authUser, logout } = useAuth();
	const { theme, toggleTheme } = useTheme();
	const meta = PAGE_META[location.pathname] ?? { title: "FinTrack", sub: "" };

	const [searchFocused, setSearchFocused] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [showNotifs, setShowNotifs] = useState(false);
	const [showPeriod, setShowPeriod] = useState(false);
	const [showProfile, setShowProfile] = useState(false);
	const [selectedPeriod, setSelectedPeriod] = useState("Okt – Des 2025");
	const [notifs, setNotifs] = useState(NOTIFS);
	const [user, setUser] = useState(authUser);

	const notifRef = useRef(null);
	const periodRef = useRef(null);
	const profileRef = useRef(null);

	const unreadCount = notifs.filter((n) => n.unread).length;

	// ── Fetch user data on mount ──
	useEffect(() => {
		const fetchUser = async () => {
			try {
				const response = await authApi.me();
				if (response.data) {
					setUser(response.data);
				}
			} catch (err) {
				console.error("Failed to fetch user:", err);
			}
		};

		if (authUser) {
			setUser(authUser);
		} else {
			fetchUser();
		}
	}, [authUser]);

	// Close dropdowns on outside click
	useEffect(() => {
		const handler = (e) => {
			if (notifRef.current && !notifRef.current.contains(e.target))
				setShowNotifs(false);
			if (periodRef.current && !periodRef.current.contains(e.target))
				setShowPeriod(false);
			if (profileRef.current && !profileRef.current.contains(e.target))
				setShowProfile(false);
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, []);

	const markAllRead = () =>
		setNotifs((prev) => prev.map((n) => ({ ...n, unread: false })));

	return (
		<header
			className="
      sticky top-0 z-20
      flex items-center justify-between
      px-8 py-4
      bg-[#080C14]/80 backdrop-blur-md
      border-b border-white/[0.05]
    "
		>
			{/* ── Left: Page title ── */}
			<div>
				<h1 className="text-[20px] font-bold text-slate-100 tracking-tight leading-none">
					{meta.title}
				</h1>
				{meta.sub && (
					<p className="text-[12px] text-slate-500 mt-1">{meta.sub}</p>
				)}
			</div>

			{/* ── Right: Controls ── */}
			<div className="flex items-center gap-3">
				{/* Search */}
				<div
					className={`
          flex items-center gap-2 px-3 py-2 rounded-lg
          bg-[#0F1829] border transition-all duration-200
          ${searchFocused ? "border-violet-500/40 w-56" : "border-white/[0.07] w-44"}
        `}
				>
					<span className="text-slate-500 flex-shrink-0">
						<SearchIcon />
					</span>
					<input
						type="text"
						placeholder="Cari transaksi..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						onFocus={() => setSearchFocused(true)}
						onBlur={() => setSearchFocused(false)}
						className="
              bg-transparent text-[12px] text-slate-300 placeholder-slate-600
              outline-none w-full
            "
					/>
					{searchQuery && (
						<button
							onClick={() => setSearchQuery("")}
							className="text-slate-600 hover:text-slate-400 flex-shrink-0 text-xs"
						>
							✕
						</button>
					)}
				</div>

				{/* Theme Toggle */}
				<button
					onClick={toggleTheme}
					className="
            w-9 h-9 rounded-lg flex items-center justify-center
            bg-[#0F1829] border border-white/[0.07]
            text-slate-400 hover:text-slate-200
            hover:border-white/[0.12] transition-all duration-200
          "
					title={theme === "dark" ? "Mode Terang" : "Mode Gelap"}
				>
					{theme === "dark" ? <SunIcon /> : <MoonIcon />}
				</button>

				{/* Period Picker */}
				<div ref={periodRef} className="relative">
					<button
						onClick={() => {
							setShowPeriod((p) => !p);
							setShowNotifs(false);
							setShowProfile(false);
						}}
						className="
              flex items-center gap-2 px-3 py-2 rounded-lg
              bg-[#0F1829] border border-white/[0.07]
              text-[12px] text-slate-300 hover:text-slate-100
              hover:border-white/[0.12] transition-all duration-200
            "
					>
						<CalendarIcon />
						<span>{selectedPeriod}</span>
						<ChevronIcon />
					</button>

					{showPeriod && (
						<div
							className="
              absolute right-0 top-full mt-2 w-48
              bg-[#111827] border border-white/[0.08] rounded-xl
              shadow-2xl shadow-black/40 py-1.5 overflow-hidden
            "
						>
							{PERIODS.map((p) => (
								<button
									key={p}
									onClick={() => {
										setSelectedPeriod(p);
										setShowPeriod(false);
									}}
									className={`
                    w-full text-left px-4 py-2.5 text-[12px] transition-colors duration-150
                    ${
											selectedPeriod === p
												? "text-violet-400 bg-violet-600/10"
												: "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
										}
                  `}
								>
									{p}
								</button>
							))}
						</div>
					)}
				</div>

				{/* Notification Bell */}
				<div ref={notifRef} className="relative">
					<button
						onClick={() => {
							setShowNotifs((n) => !n);
							setShowPeriod(false);
							setShowProfile(false);
						}}
						className="
              relative w-9 h-9 rounded-lg flex items-center justify-center
              bg-[#0F1829] border border-white/[0.07]
              text-slate-400 hover:text-slate-200
              hover:border-white/[0.12] transition-all duration-200
            "
					>
						<BellIcon />
						{unreadCount > 0 && (
							<span
								className="
                absolute -top-1 -right-1
                w-4 h-4 rounded-full bg-violet-600
                text-white text-[9px] font-bold
                flex items-center justify-center
                border-2 border-[#080C14]
              "
							>
								{unreadCount}
							</span>
						)}
					</button>

					{showNotifs && (
						<div
							className="
              absolute right-0 top-full mt-2 w-80
              bg-[#111827] border border-white/[0.08] rounded-xl
              shadow-2xl shadow-black/40 overflow-hidden
            "
						>
							<div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
								<span className="text-[13px] font-semibold text-slate-200">
									Notifikasi
								</span>
								<button
									onClick={markAllRead}
									className="text-[11px] text-violet-400 hover:text-violet-300 transition-colors"
								>
									Tandai semua dibaca
								</button>
							</div>
							<div>
								{notifs.map((n) => (
									<div
										key={n.id}
										className={`
                      flex items-start gap-3 px-4 py-3 border-b border-white/[0.04]
                      last:border-0 transition-colors duration-150 cursor-pointer
                      ${n.unread ? "bg-violet-600/[0.04] hover:bg-violet-600/[0.08]" : "hover:bg-white/[0.03]"}
                    `}
									>
										<span
											className={`
                      mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0
                      ${n.unread ? "bg-violet-500" : "bg-transparent"}
                    `}
										/>
										<div className="flex-1 min-w-0">
											<p className="text-[12px] text-slate-300 leading-relaxed">
												{n.text}
											</p>
											<p className="text-[11px] text-slate-600 mt-1">
												{n.time}
											</p>
										</div>
									</div>
								))}
							</div>
						</div>
					)}
				</div>

				{/* Profile */}
				<div ref={profileRef} className="relative">
					<button
						onClick={() => {
							setShowProfile((p) => !p);
							setShowNotifs(false);
							setShowPeriod(false);
						}}
						className="flex items-center gap-2.5 group"
					>
						<div
							className="
              w-9 h-9 rounded-full
              bg-gradient-to-br from-violet-600 to-indigo-600
              flex items-center justify-center
              text-white font-bold text-[13px]
              ring-2 ring-transparent group-hover:ring-violet-500/30
              transition-all duration-200
            "
						>
							{user?.name?.charAt(0)?.toUpperCase() || "U"}
						</div>
						<div className="hidden sm:block text-left">
							<p className="text-[12px] font-semibold text-slate-200 leading-none">
								{user?.name || "User"}
							</p>
							<p className="text-[10px] text-slate-500 mt-0.5">Admin</p>
						</div>
						<span className="hidden sm:block text-slate-600 group-hover:text-slate-400 transition-colors">
							<ChevronIcon />
						</span>
					</button>

					{showProfile && (
						<div
							className="
              absolute right-0 top-full mt-2 w-52
              bg-[#111827] border border-white/[0.08] rounded-xl
              shadow-2xl shadow-black/40 overflow-hidden
            "
						>
							{/* Profile header */}
							<div className="px-4 py-3 border-b border-white/[0.06]">
								<p className="text-[13px] font-semibold text-slate-200">
									{user?.name || "User"}
								</p>
								<p className="text-[11px] text-slate-500 mt-0.5">
									{user?.email || "email@example.com"}
								</p>
							</div>
							{/* Menu items */}
							<div className="py-1.5">
								<ProfileMenuItem
									icon={<UserIcon />}
									label="Profil Saya"
									onClick={() => {
										navigate("/profile");
										setShowProfile(false);
									}}
								/>
								<ProfileMenuItem
									icon={
										<svg
											width="14"
											height="14"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<circle cx="12" cy="12" r="3" />
											<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
										</svg>
									}
									label="Pengaturan"
									onClick={() => {
										navigate("/pengaturan");
										setShowProfile(false);
									}}
								/>
							</div>
							<div className="border-t border-white/[0.06] py-1.5">
								<ProfileMenuItem
									icon={<LogoutIcon />}
									label="Keluar"
									danger
									onClick={() => {
										logout();
										navigate("/login");
									}}
								/>
							</div>
						</div>
					)}
				</div>
			</div>
		</header>
	);
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function ProfileMenuItem({ icon, label, danger, onClick }) {
	return (
		<button
			onClick={onClick}
			className={`
      w-full flex items-center gap-3 px-4 py-2.5
      text-[12px] transition-colors duration-150
      ${
				danger
					? "text-red-400 hover:bg-red-500/10 hover:text-red-300"
					: "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
			}
    `}
		>
			<span>{icon}</span>
			<span>{label}</span>
		</button>
	);
}