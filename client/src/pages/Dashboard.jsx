import { useState, useEffect } from 'react'
import MetricCard, { formatRupiah } from '../components/dashboard/MetricCard'
import FinanceChart from '../components/dashboard/FinanceChart'
import CategorySummary from '../components/dashboard/CategorySummary'
import RecentTransactions from '../components/dashboard/RecentTransaction'
import { summaryMetrics, dataChart } from "../data/dashboardData";
import { dashboardApi, transaksiApi, kategoriApi } from "../lib/api";

const METRIC_CARDS = [
	{
		label: "Total Saldo",
		key: "totalSaldo",
		perubahanKey: "saldo",
		icon: "💰",
		accentColor: "linear-gradient(90deg, #7C3AED, #4F46E5)",
		bgColor: "rgba(124,58,237,0.12)",
	},
	{
		label: "Total Pemasukan",
		key: "totalPemasukan",
		perubahanKey: "pemasukan",
		icon: "📈",
		accentColor: "linear-gradient(90deg, #0D9488, #0891B2)",
		bgColor: "rgba(13,148,136,0.12)",
	},
	{
		label: "Total Pengeluaran",
		key: "totalPengeluaran",
		perubahanKey: "pengeluaran",
		icon: "📉",
		accentColor: "linear-gradient(90deg, #BE185D, #9F1239)",
		bgColor: "rgba(190,24,93,0.12)",
	},
	{
		label: "Total Tabungan",
		key: "totalTabungan",
		perubahanKey: "tabungan",
		icon: "🎯",
		accentColor: "linear-gradient(90deg, #D97706, #B45309)",
		bgColor: "rgba(217,119,6,0.12)",
	},
];

// ── Helper: Build chart data from transactions ───────────────────────────────
function buildChartData(transactions) {
	// Initialize months data (last 12 months)
	const months = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"Mei",
		"Jun",
		"Jul",
		"Agu",
		"Sep",
		"Okt",
		"Nov",
		"Des",
	];
	const monthsData = months.map((label) => ({
		label,
		pemasukan: 0,
		pengeluaran: 0,
		tabungan: 0,
	}));

	// Initialize days data (31 days)
	const daysData = Array.from({ length: 31 }, (_, i) => ({
		label: String(i + 1),
		pemasukan: 0,
		pengeluaran: 0,
		tabungan: 0,
	}));

	// Aggregate data from transactions
	transactions.forEach((txn) => {
		const date = new Date(txn.createdAt || txn.tanggal);
		const month = date.getMonth(); // 0-11
		const day = date.getDate(); // 1-31
		const amount = txn.jumlah || 0;

		if (txn.tipe === "masuk") {
			monthsData[month].pemasukan += amount;
			daysData[day - 1].pemasukan += amount;
		} else {
			monthsData[month].pengeluaran += Math.abs(amount);
			daysData[day - 1].pengeluaran += Math.abs(amount);
		}
	});

	// Calculate tabungan (pemasukan - pengeluaran) for each period
	monthsData.forEach((m) => {
		m.tabungan = m.pemasukan - m.pengeluaran;
	});
	daysData.forEach((d) => {
		d.tabungan = d.pemasukan - d.pengeluaran;
	});

	return {
		bulanan: monthsData,
		harian: daysData,
	};
}

export default function Dashboard() {
	const [metrics, setMetrics] = useState(summaryMetrics);
	const [categories, setCategories] = useState([]);
	const [chartData, setChartData] = useState(dataChart);
	const [recentTransactions, setRecentTransactions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// ── Fetch dashboard data and transactions on mount ──
	useEffect(() => {
		const fetchDashboardData = async () => {
			try {
				setLoading(true);

				// Fetch summary metrics
				const summaryResponse = await dashboardApi.getSummary();
				if (summaryResponse.data) {
					setMetrics({
						...summaryResponse.data.summaryMetrics,
						perubahan: summaryMetrics.perubahan,
					});
				}

				// Fetch transactions for chart and recent transactions
				const transactionsResponse = await transaksiApi.getAll();
				if (
					transactionsResponse.data &&
					Array.isArray(transactionsResponse.data)
				) {
					const allTransactions = transactionsResponse.data;

					// Calculate real tabungan from transactions
					let totalPemasukan = 0;
					let totalPengeluaran = 0;
					allTransactions.forEach((txn) => {
						if (txn.tipe === "masuk") {
							totalPemasukan += txn.jumlah || 0;
						} else {
							totalPengeluaran += Math.abs(txn.jumlah || 0);
						}
					});
					const totalTabungan = totalPemasukan - totalPengeluaran;

					// Build chart data from transactions
					const builtChartData = buildChartData(allTransactions);
					setChartData(builtChartData);

					// Get recent transactions (last 5)
					const recent = allTransactions
						.sort(
							(a, b) =>
								new Date(b.createdAt || b.tanggal) -
								new Date(a.createdAt || a.tanggal),
						)
						.slice(0, 5);
					setRecentTransactions(recent);

					// Update metrics with real data from database
					setMetrics((prevMetrics) => ({
						...prevMetrics,
						totalPemasukan,
						totalPengeluaran,
						totalTabungan,
						totalSaldo: totalTabungan,
					}));
				}

				// Fetch kategori stats with transaction totals
				try {
					const kategoriResponse = await kategoriApi.getStats();
					if (kategoriResponse.data && Array.isArray(kategoriResponse.data)) {
						// Calculate total expenses per category and format for display
						const formattedCategories = kategoriResponse.data
							.map((cat) => {
								// Count transactions and sum amount for this category (expenses only)
								const categoryTransactions = cat.transactions || [];
								const totalAmount = categoryTransactions
									.filter((t) => t.type === "EXPENSE")
									.reduce((sum, t) => sum + (t.amount || 0), 0);

								return {
									id: cat.id,
									nama: cat.name,
									emoji: cat.icon,
									warna: cat.color || "#8B5CF6",
									jumlah: totalAmount,
									transaksi: categoryTransactions.filter(
										(t) => t.type === "EXPENSE",
									).length,
									persen: 0, // Will be calculated below
								};
							})
							.filter((cat) => cat.jumlah > 0); // Only show categories with expenses

						// Calculate percentage
						const totalExpenses = formattedCategories.reduce(
							(sum, cat) => sum + cat.jumlah,
							0,
						);
						const categoriesWithPercent = formattedCategories.map((cat) => ({
							...cat,
							persen:
								totalExpenses > 0
									? Math.round((cat.jumlah / totalExpenses) * 100)
									: 0,
						}));

						setCategories(categoriesWithPercent);
					}
				} catch (err) {
					console.error("Failed to fetch category stats:", err);
					setCategories([]);
				}

				setError(null);
			} catch (err) {
				console.error("Failed to fetch dashboard data:", err);
				setError(err.message);
				// Keep using default data on error
			} finally {
				setLoading(false);
			}
		};
		fetchDashboardData();
	}, []);

	return (
		<div className="flex flex-col gap-6">
			{/* ── Metric Cards ── */}
			<div className="grid grid-cols-4 gap-4">
				{METRIC_CARDS.map((card) => (
					<MetricCard
						key={card.key}
						label={card.label}
						value={metrics[card.key]}
						perubahan={metrics.perubahan?.[card.perubahanKey] || 0}
						icon={card.icon}
						accentColor={card.accentColor}
						bgColor={card.bgColor}
					/>
				))}
			</div>

			{/* ── Chart + Category ── */}
			<div className="grid grid-cols-[1fr_360px] gap-4">
				<FinanceChart chartData={chartData} />
				<CategorySummary categories={categories} />
			</div>

			{/* ── Recent Transactions ── */}
			<RecentTransactions transactions={recentTransactions} />
		</div>
	);
}
