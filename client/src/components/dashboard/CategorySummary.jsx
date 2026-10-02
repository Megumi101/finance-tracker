import { useState } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

function formatRupiah(v) {
	if (v >= 1000000) return "Rp " + (v / 1000000).toFixed(1) + " Jt";
	if (v >= 1000) return "Rp " + (v / 1000).toFixed(0) + " Rb";
	return "Rp " + v;
}

function CustomTooltip({ active, payload }) {
	if (!active || !payload?.length) return null;
	const d = payload[0].payload;
	return (
		<div className="bg-[#111827] border border-white/10 rounded-xl px-3 py-2 shadow-2xl">
			<p className="text-[12px] font-semibold text-slate-200">
				{d.emoji} {d.nama}
			</p>
			<p className="text-[11px] text-slate-400 mt-0.5">
				{formatRupiah(d.jumlah)}
			</p>
		</div>
	);
}

export default function CategorySummary({ categories = [] }) {
	const [hovered, setHovered] = useState(null);

	// Calculate total amount across all categories
	const total = categories.reduce((sum, k) => sum + (k.jumlah || 0), 0);

	// Handle empty state
	if (categories.length === 0) {
		return (
			<div className="bg-[#0C1120] border border-white/[0.06] rounded-2xl p-6 flex flex-col items-center justify-center min-h-[300px]">
				<div className="text-slate-400 text-sm">
					<p className="text-[13px] font-medium">Belum ada kategori</p>
					<p className="text-[12px] text-slate-500 mt-1">
						Buat kategori untuk melihat ringkasan
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-[#0C1120] border border-white/[0.06] rounded-2xl p-6 flex flex-col">
			{/* Header */}
			<div className="flex items-center justify-between mb-5">
				<div>
					<h2 className="text-[15px] font-semibold text-slate-100">
						Ringkasan Kategori
					</h2>
					<p className="text-[12px] text-slate-500 mt-0.5">
						Pengeluaran per kategori
					</p>
				</div>
				<button className="text-[11px] text-violet-400 hover:text-violet-300 transition-colors">
					Lihat semua →
				</button>
			</div>

			{/* Donut chart */}
			<div className="relative w-full h-[160px] flex items-center justify-center mb-4">
				<ResponsiveContainer width="100%" height="100%">
					<PieChart>
						<Pie
							data={categories}
							cx="50%"
							cy="50%"
							innerRadius={52}
							outerRadius={72}
							paddingAngle={3}
							dataKey="jumlah"
							onMouseEnter={(_, i) => setHovered(i)}
							onMouseLeave={() => setHovered(null)}
							strokeWidth={0}
						>
							{categories.map((entry, i) => (
								<Cell
									key={entry.id}
									fill={entry.warna || "#8B5CF6"}
									opacity={hovered === null || hovered === i ? 1 : 0.3}
									style={{ cursor: "pointer", transition: "opacity 0.2s" }}
								/>
							))}
						</Pie>
						<Tooltip content={<CustomTooltip />} />
					</PieChart>
				</ResponsiveContainer>

				{/* Center label */}
				<div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
					{hovered !== null ? (
						<>
							<span className="text-[18px]">
								{categories[hovered].emoji || "📦"}
							</span>
							<span className="text-[11px] text-slate-400 mt-0.5">
								{categories[hovered].nama}
							</span>
						</>
					) : (
						<>
							<span className="text-[13px] font-mono font-bold text-slate-200">
								{formatRupiah(total)}
							</span>
							<span className="text-[10px] text-slate-600 mt-0.5">Total</span>
						</>
					)}
				</div>
			</div>

			{/* Category list */}
			<div className="flex flex-col gap-1">
				{categories.map((k, i) => (
					<div
						key={k.id}
						className="flex items-center gap-3 py-2.5 border-b border-white/[0.04] last:border-0 cursor-pointer group"
						onMouseEnter={() => setHovered(i)}
						onMouseLeave={() => setHovered(null)}
					>
						{/* Emoji icon */}
						<div
							className="w-8 h-8 rounded-lg flex items-center justify-center text-[14px] flex-shrink-0 transition-transform duration-150 group-hover:scale-110"
							style={{ background: (k.warna || "#8B5CF6") + "18" }}
						>
							{k.emoji || "📦"}
						</div>

						{/* Name + bar */}
						<div className="flex-1 min-w-0">
							<div className="flex justify-between items-center mb-1">
								<span className="text-[12px] font-medium text-slate-300">
									{k.nama}
								</span>
								<span className="text-[11px] text-slate-500">
									{k.transaksi || 0} transaksi
								</span>
							</div>
							<div className="w-full h-[3px] bg-white/[0.05] rounded-full overflow-hidden">
								<div
									className="h-full rounded-full transition-all duration-500"
									style={{
										width: k.persen + "%",
										background: k.warna || "#8B5CF6",
									}}
								/>
							</div>
						</div>

						{/* Amount */}
						<span className="text-[12px] font-mono font-semibold text-slate-300 flex-shrink-0 w-20 text-right">
							{formatRupiah(k.jumlah || 0)}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}