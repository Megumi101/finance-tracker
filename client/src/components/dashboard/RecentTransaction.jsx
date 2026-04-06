import { recentTransactions as dummyRecentTransactions } from "../../data/dashboardData";

function formatRupiah(v) {
	const abs = Math.abs(v);
	if (abs >= 1000000)
		return (v > 0 ? "+" : "") + "Rp " + (abs / 1000000).toFixed(1) + " Jt";
	if (abs >= 1000)
		return (v > 0 ? "+" : "-") + "Rp " + (abs / 1000).toFixed(0) + " Rb";
	return (v > 0 ? "+" : "") + "Rp " + v;
}

const STATUS_MAP = {
	berhasil: { label: "Berhasil", cls: "bg-emerald-500/10 text-emerald-400" },
	tertunda: { label: "Tertunda", cls: "bg-amber-500/10 text-amber-400" },
	gagal: { label: "Gagal", cls: "bg-red-500/10 text-red-400" },
};

const DownloadIcon = () => (
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
		<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
		<polyline points="7,10 12,15 17,10" />
		<line x1="12" y1="15" x2="12" y2="3" />
	</svg>
);
const PlusIcon = () => (
	<svg
		width="13"
		height="13"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2.5"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<line x1="12" y1="5" x2="12" y2="19" />
		<line x1="5" y1="12" x2="19" y2="12" />
	</svg>
);

// Inisial dari nama transaksi
function Initials({ nama, tipe }) {
	const letters = (nama || "T")
		.split(" ")
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase();
	const bg =
		tipe === "masuk"
			? "bg-violet-600/15 text-violet-400"
			: "bg-slate-700/50 text-slate-400";
	return (
		<div
			className={`w-9 h-9 rounded-xl flex items-center justify-center text-[12px] font-bold flex-shrink-0 ${bg}`}
		>
			{letters}
		</div>
	);
}

// Format date to Indonesian format
function formatTanggal(dateStr) {
	try {
		const date = new Date(dateStr);
		return date.toLocaleDateString("id-ID", {
			day: "2-digit",
			month: "short",
			year: "numeric",
		});
	} catch {
		return dateStr || "N/A";
	}
}

export default function RecentTransactions({
	transactions = dummyRecentTransactions,
}) {
	const displayTransactions =
		transactions.length > 0 ? transactions : dummyRecentTransactions;

	return (
		<div className="bg-[#0C1120] border border-white/[0.06] rounded-2xl p-6">
			{/* Header */}
			<div className="flex items-center justify-between mb-5">
				<div>
					<h2 className="text-[15px] font-semibold text-slate-100">
						Transaksi Terbaru
					</h2>
					<p className="text-[12px] text-slate-500 mt-0.5">
						{displayTransactions.length} transaksi terakhir
					</p>
				</div>
				<div className="flex items-center gap-2">
					<button
						className="
            flex items-center gap-1.5 px-3 py-1.5 rounded-lg
            bg-[#111827] border border-white/[0.06]
            text-[12px] text-slate-400 hover:text-slate-200
            transition-colors duration-200
          "
					>
						<DownloadIcon /> Ekspor
					</button>
					<button
						className="
            flex items-center gap-1.5 px-3 py-1.5 rounded-lg
            bg-violet-600 hover:bg-violet-500
            text-[12px] text-white font-medium
            transition-colors duration-200
          "
					>
						<PlusIcon /> Tambah
					</button>
				</div>
			</div>

			{/* Table header */}
			<div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-2 pb-2 border-b border-white/[0.05]">
				{["Transaksi", "Tanggal", "Jumlah", "Status"].map((h) => (
					<span
						key={h}
						className="text-[10px] font-medium tracking-[1.2px] uppercase text-slate-600"
					>
						{h}
					</span>
				))}
			</div>

			{/* Rows */}
			<div className="divide-y divide-white/[0.04]">
				{displayTransactions.map((txn) => {
					const status = STATUS_MAP[txn.status] || STATUS_MAP["berhasil"];
					const isPositive = txn.jumlah > 0;
					const tanggalDisplay = formatTanggal(txn.createdAt || txn.tanggal);
					const namaTransaksi = txn.nama || "Transaksi";
					const kategoriDisplay = txn.kategori || "Umum";
					return (
						<div
							key={txn.id}
							className="grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center px-2 py-3.5 hover:bg-white/[0.02] rounded-xl transition-colors duration-150 cursor-pointer"
						>
							{/* Nama + kategori */}
							<div className="flex items-center gap-3 min-w-0">
								<Initials nama={namaTransaksi} tipe={txn.tipe} />
								<div className="min-w-0">
									<p className="text-[13px] font-medium text-slate-200 truncate">
										{namaTransaksi}
									</p>
									<p className="text-[11px] text-slate-500 mt-0.5">
										{kategoriDisplay}
									</p>
								</div>
							</div>

							{/* Tanggal */}
							<span className="text-[12px] text-slate-500 whitespace-nowrap">
								{tanggalDisplay}
							</span>

							{/* Jumlah */}
							<span
								className={`text-[13px] font-mono font-bold whitespace-nowrap ${isPositive ? "text-emerald-400" : "text-red-400"}`}
							>
								{formatRupiah(txn.jumlah)}
							</span>

							{/* Status */}
							<span
								className={`text-[11px] font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${status.cls}`}
							>
								{status.label}
							</span>
						</div>
					);
				})}
			</div>

			{/* Footer */}
			<div className="mt-4 pt-4 border-t border-white/[0.04] text-center">
				<button className="text-[12px] text-violet-400 hover:text-violet-300 transition-colors">
					Lihat semua transaksi →
				</button>
			</div>
		</div>
	);
}
