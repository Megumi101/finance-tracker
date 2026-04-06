import { useState } from "react";
import {
	ResponsiveContainer,
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
} from "recharts";
import { dataChart } from "../../data/dashboardData";

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }) {
	if (!active || !payload?.length) return null;

	const fmt = (v) => {
		if (v >= 1000000) return "Rp " + (v / 1000000).toFixed(1) + " Jt";
		if (v >= 1000) return "Rp " + (v / 1000).toFixed(0) + " Rb";
		return "Rp " + v;
	};

	const colorMap = {
		pemasukan: "#7C3AED",
		pengeluaran: "#F87171",
		tabungan: "#10B981",
	};

	return (
		<div className="bg-[#111827] border border-white/10 rounded-xl px-4 py-3 shadow-2xl">
			<p className="text-[11px] text-slate-500 mb-2 font-medium">{label}</p>
			{payload.map((entry) => (
				<div
					key={entry.dataKey}
					className="flex items-center gap-2 mb-1 last:mb-0"
				>
					<span
						className="w-2 h-2 rounded-sm flex-shrink-0"
						style={{ background: colorMap[entry.dataKey] }}
					/>
					<span className="text-[12px] text-slate-400 capitalize w-24">
						{entry.dataKey}
					</span>
					<span className="text-[12px] font-mono font-semibold text-slate-200">
						{fmt(entry.value)}
					</span>
				</div>
			))}
		</div>
	);
}

// ─── Period Toggle Button ─────────────────────────────────────────────────────
function PeriodBtn({ label, active, onClick }) {
	return (
		<button
			onClick={onClick}
			className={`
        px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-200
        ${
					active
						? "bg-[#1A1F35] text-violet-400"
						: "text-slate-500 hover:text-slate-300"
				}
      `}
		>
			{label}
		</button>
	);
}

// ─── FinanceChart ─────────────────────────────────────────────────────────────
export default function FinanceChart({ chartData = dataChart }) {
	const [period, setPeriod] = useState("bulanan");

	const data = chartData[period] || dataChart[period];

	const fmtY = (v) => {
		if (v >= 1000000) return (v / 1000000).toFixed(0) + "Jt";
		if (v >= 1000) return (v / 1000).toFixed(0) + "Rb";
		return v;
	};

	// For harian, show every 5th label to avoid clutter
	const tickFormatter = (label) => {
		if (period === "harian") {
			const n = parseInt(label);
			return n % 5 === 0 || n === 1 ? label : "";
		}
		return label;
	};

	return (
		<div className="bg-[#0C1120] border border-white/[0.06] rounded-2xl p-6">
			{/* Header */}
			<div className="flex items-center justify-between mb-5">
				<div>
					<h2 className="text-[15px] font-semibold text-slate-100">
						Grafik Keuangan
					</h2>
					<p className="text-[12px] text-slate-500 mt-0.5">
						Pemasukan, pengeluaran & tabungan
					</p>
				</div>
				<div className="flex items-center gap-1 bg-[#080C14] rounded-xl p-1 border border-white/[0.05]">
					<PeriodBtn
						label="Harian"
						active={period === "harian"}
						onClick={() => setPeriod("harian")}
					/>
					<PeriodBtn
						label="Bulanan"
						active={period === "bulanan"}
						onClick={() => setPeriod("bulanan")}
					/>
				</div>
			</div>

			{/* Legend */}
			<div className="flex items-center gap-5 mb-5">
				{[
					{ key: "pemasukan", color: "#7C3AED", label: "Pemasukan" },
					{ key: "pengeluaran", color: "#F87171", label: "Pengeluaran" },
					{ key: "tabungan", color: "#10B981", label: "Tabungan" },
				].map((item) => (
					<div key={item.key} className="flex items-center gap-2">
						<span
							className="w-2.5 h-2.5 rounded-sm"
							style={{ background: item.color }}
						/>
						<span className="text-[12px] text-slate-500">{item.label}</span>
					</div>
				))}
			</div>

			{/* Chart */}
			<div className="w-full h-[240px]">
				<ResponsiveContainer width="100%" height="100%">
					<AreaChart
						data={data}
						margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
					>
						<defs>
							<linearGradient id="gradPemasukan" x1="0" y1="0" x2="0" y2="1">
								<stop offset="5%" stopColor="#7C3AED" stopOpacity={0.25} />
								<stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
							</linearGradient>
							<linearGradient id="gradPengeluaran" x1="0" y1="0" x2="0" y2="1">
								<stop offset="5%" stopColor="#F87171" stopOpacity={0.2} />
								<stop offset="95%" stopColor="#F87171" stopOpacity={0} />
							</linearGradient>
							<linearGradient id="gradTabungan" x1="0" y1="0" x2="0" y2="1">
								<stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
								<stop offset="95%" stopColor="#10B981" stopOpacity={0} />
							</linearGradient>
						</defs>

						<CartesianGrid
							strokeDasharray="3 3"
							stroke="rgba(255,255,255,0.04)"
							vertical={false}
						/>
						<XAxis
							dataKey="label"
							tick={{ fill: "#475569", fontSize: 11 }}
							axisLine={false}
							tickLine={false}
							tickFormatter={tickFormatter}
							dy={8}
						/>
						<YAxis
							tick={{ fill: "#475569", fontSize: 11 }}
							axisLine={false}
							tickLine={false}
							tickFormatter={fmtY}
							width={42}
						/>
						<Tooltip
							content={<CustomTooltip />}
							cursor={{ stroke: "rgba(255,255,255,0.06)", strokeWidth: 1 }}
						/>

						<Area
							type="monotone"
							dataKey="pemasukan"
							stroke="#7C3AED"
							strokeWidth={2}
							fill="url(#gradPemasukan)"
							dot={false}
							activeDot={{ r: 4, fill: "#7C3AED", strokeWidth: 0 }}
						/>
						<Area
							type="monotone"
							dataKey="pengeluaran"
							stroke="#F87171"
							strokeWidth={2}
							fill="url(#gradPengeluaran)"
							dot={false}
							activeDot={{ r: 4, fill: "#F87171", strokeWidth: 0 }}
						/>
						<Area
							type="monotone"
							dataKey="tabungan"
							stroke="#10B981"
							strokeWidth={2}
							fill="url(#gradTabungan)"
							dot={false}
							activeDot={{ r: 4, fill: "#10B981", strokeWidth: 0 }}
						/>
					</AreaChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}