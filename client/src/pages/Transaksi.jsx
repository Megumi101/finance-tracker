import { useState, useMemo, useEffect } from "react";
import { transaksiData as initialData } from "../Data/transaksiData";
import TransaksiFilter from "../components/transaksi/TransaksiFilter";
import TransaksiTable from "../components/transaksi/TransaksiTable";
import TransaksiModal from "../components/transaksi/TransaksiModal";
import DeleteConfirmModal from "../components/transaksi/DeleteConfirmModal";
import { transaksiApi } from "../lib/api";

// ─── Icons ────────────────────────────────────────────────────────────────────
const PlusIcon = () => (
	<svg
		width="14"
		height="14"
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
const DownloadIcon = () => (
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
		<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
		<polyline points="7,10 12,15 17,10" />
		<line x1="12" y1="15" x2="12" y2="3" />
	</svg>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatRupiah(v) {
	if (v >= 1000000) return "Rp " + (v / 1000000).toFixed(1) + " Jt";
	if (v >= 1000) return "Rp " + (v / 1000).toFixed(0) + " Rb";
	return "Rp " + v;
}

function exportCSV(data) {
	const header = [
		"ID",
		"Nama",
		"Kategori",
		"Tipe",
		"Jumlah",
		"Tanggal",
		"Status",
		"Catatan",
	];
	const rows = data.map((t) => [
		t.id,
		t.nama,
		t.kategori,
		t.tipe,
		t.jumlah,
		t.tanggal,
		t.status,
		t.catatan,
	]);
	const csv = [header, ...rows]
		.map((r) => r.map((c) => `"${c}"`).join(","))
		.join("\n");
	const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = `transaksi_${new Date().toISOString().split("T")[0]}.csv`;
	a.click();
	URL.revokeObjectURL(url);
}

function exportPDF(data) {
	const fmt = (v) => {
		const abs = Math.abs(v);
		const sign = v > 0 ? "+" : "-";
		if (abs >= 1000000)
			return sign + "Rp " + (abs / 1000000).toFixed(1) + " Jt";
		if (abs >= 1000) return sign + "Rp " + (abs / 1000).toFixed(0) + " Rb";
		return sign + "Rp " + abs;
	};

	const rows = data
		.map(
			(t) => `
    <tr>
      <td>${t.nama}</td>
      <td>${t.kategori}</td>
      <td>${t.tanggal}</td>
      <td style="color:${t.tipe === "masuk" ? "#10B981" : "#F87171"};font-weight:600">${fmt(t.tipe === "masuk" ? t.jumlah : -t.jumlah)}</td>
      <td>${t.status}</td>
    </tr>
  `,
		)
		.join("");

	const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Laporan Transaksi</title>
  <style>
    body { font-family: sans-serif; font-size: 13px; color: #1e293b; padding: 32px; }
    h1   { font-size: 20px; margin-bottom: 4px; }
    p    { color: #64748b; margin-bottom: 24px; font-size: 12px; }
    table{ width: 100%; border-collapse: collapse; }
    th   { background: #f1f5f9; text-align: left; padding: 10px 12px; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; }
    td   { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; }
  </style>
</head>
<body>
  <h1>Laporan Transaksi</h1>
  <p>Diekspor pada ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })} · ${data.length} transaksi</p>
  <table>
    <thead><tr><th>Nama</th><th>Kategori</th><th>Tanggal</th><th>Jumlah</th><th>Status</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
</body>
</html>`;

	const blob = new Blob([html], { type: "text/html" });
	const url = URL.createObjectURL(blob);
	const win = window.open(url);
	win.onload = () => {
		win.print();
		URL.revokeObjectURL(url);
	};
}

// ─── Summary bar ─────────────────────────────────────────────────────────────
function SummaryBar({ data }) {
	const totalMasuk = data
		.filter((t) => t.tipe === "masuk")
		.reduce((s, t) => s + t.jumlah, 0);
	const totalKeluar = data
		.filter((t) => t.tipe === "keluar")
		.reduce((s, t) => s + t.jumlah, 0);
	const saldo = totalMasuk - totalKeluar;

	return (
		<div className="grid grid-cols-3 gap-4">
			{[
				{
					label: "Total Pemasukan",
					value: totalMasuk,
					color: "text-emerald-400",
					bg: "bg-emerald-500/5 border-emerald-500/10",
				},
				{
					label: "Total Pengeluaran",
					value: totalKeluar,
					color: "text-red-400",
					bg: "bg-red-500/5 border-red-500/10",
				},
				{
					label: "Selisih",
					value: saldo,
					color: saldo >= 0 ? "text-violet-400" : "text-red-400",
					bg: "bg-violet-500/5 border-violet-500/10",
				},
			].map((item) => (
				<div key={item.label} className={`rounded-2xl p-4 border ${item.bg}`}>
					<p className="text-[11px] uppercase tracking-[1px] text-slate-500 font-medium mb-2">
						{item.label}
					</p>
					<p className={`text-[20px] font-mono font-bold ${item.color}`}>
						{formatRupiah(Math.abs(item.value))}
					</p>
					<p className="text-[11px] text-slate-600 mt-1">
						{data.length} transaksi
					</p>
				</div>
			))}
		</div>
	);
}

// ─── Pagination ───────────────────────────────────────────────────────────────
function Pagination({ page, totalPages, total, perPage, onPage }) {
	if (totalPages <= 1) return null;
	return (
		<div className="flex items-center justify-between px-2">
			<p className="text-[12px] text-slate-500">
				Menampilkan {Math.min((page - 1) * perPage + 1, total)}–
				{Math.min(page * perPage, total)} dari {total} transaksi
			</p>
			<div className="flex items-center gap-1">
				<PageBtn
					label="←"
					disabled={page === 1}
					onClick={() => onPage(page - 1)}
				/>
				{Array.from({ length: totalPages }, (_, i) => i + 1)
					.filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
					.reduce((acc, p, i, arr) => {
						if (i > 0 && arr[i - 1] !== p - 1) acc.push("...");
						acc.push(p);
						return acc;
					}, [])
					.map((p, i) =>
						p === "..." ? (
							<span key={i} className="text-slate-600 px-1 text-[12px]">
								···
							</span>
						) : (
							<PageBtn
								key={p}
								label={p}
								active={p === page}
								onClick={() => onPage(p)}
							/>
						),
					)}
				<PageBtn
					label="→"
					disabled={page === totalPages}
					onClick={() => onPage(page + 1)}
				/>
			</div>
		</div>
	);
}

function PageBtn({ label, active, disabled, onClick }) {
	return (
		<button
			onClick={onClick}
			disabled={disabled}
			className={`
        min-w-[32px] h-8 px-2 rounded-lg text-[12px] font-medium transition-all duration-150
        ${active ? "bg-violet-600 text-white" : ""}
        ${!active && !disabled ? "text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]" : ""}
        ${disabled ? "text-slate-700 cursor-not-allowed" : ""}
      `}
		>
			{label}
		</button>
	);
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
const EMPTY_FILTERS = {
	search: "",
	tipe: "",
	kategori: "",
	status: "",
	dari: "",
	sampai: "",
};
const PER_PAGE = 8;

export default function Transaksi() {
	const [data, setData] = useState(initialData);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [filters, setFilters] = useState(EMPTY_FILTERS);
	const [sort, setSort] = useState({ key: "tanggal", dir: "desc" });
	const [page, setPage] = useState(1);
	const [modalOpen, setModalOpen] = useState(false);
	const [editData, setEditData] = useState(null);
	const [deleteTarget, setDeleteTarget] = useState(null);
	const [showExport, setShowExport] = useState(false);

	// ── Fetch transactions on mount ──
	useEffect(() => {
		const fetchTransactions = async () => {
			try {
				setLoading(true);
				const response = await transaksiApi.getAll();
				setData(response.data || initialData);
				setError(null);
			} catch (err) {
				console.error("Failed to fetch transactions:", err);
				setData(initialData);
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};
		fetchTransactions();
	}, []);

	// ── Filter logic ──
	const filtered = useMemo(() => {
		let d = [...data];
		if (filters.search)
			d = d.filter((t) =>
				t.nama.toLowerCase().includes(filters.search.toLowerCase()),
			);
		if (filters.tipe) d = d.filter((t) => t.tipe === filters.tipe);
		if (filters.kategori) d = d.filter((t) => t.kategori === filters.kategori);
		if (filters.status) d = d.filter((t) => t.status === filters.status);
		if (filters.dari) d = d.filter((t) => t.tanggal >= filters.dari);
		if (filters.sampai) d = d.filter((t) => t.tanggal <= filters.sampai);
		return d;
	}, [data, filters]);

	// ── Sort logic ──
	const sorted = useMemo(() => {
		return [...filtered].sort((a, b) => {
			let va = a[sort.key],
				vb = b[sort.key];
			if (sort.key === "jumlah") {
				va = Number(va);
				vb = Number(vb);
			}
			if (va < vb) return sort.dir === "asc" ? -1 : 1;
			if (va > vb) return sort.dir === "asc" ? 1 : -1;
			return 0;
		});
	}, [filtered, sort]);

	// ── Paginate ──
	const totalPages = Math.ceil(sorted.length / PER_PAGE);
	const paginated = sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE);

	const handleFilter = (field, value) => {
		setFilters((f) => ({ ...f, [field]: value }));
		setPage(1);
	};
	const handleSort = (key) => {
		setSort((s) => ({
			key,
			dir: s.key === key && s.dir === "asc" ? "desc" : "asc",
		}));
		setPage(1);
	};

	const activeCount = Object.values(filters).filter(Boolean).length;

	const handleSave = async (txn) => {
		try {
			if (editData) {
				await transaksiApi.update(txn.id, txn);
				setData((d) => d.map((t) => (t.id === txn.id ? txn : t)));
			} else {
				const response = await transaksiApi.create(txn);
				setData((d) => [response.data || txn, ...d]);
			}
			setModalOpen(false);
			setEditData(null);
		} catch (err) {
			console.error("Failed to save transaction:", err);
			alert("Gagal menyimpan transaksi: " + err.message);
		}
	};

	const handleDelete = async () => {
		try {
			await transaksiApi.delete(deleteTarget.id);
			setData((d) => d.filter((t) => t.id !== deleteTarget.id));
			setDeleteTarget(null);
		} catch (err) {
			console.error("Failed to delete transaction:", err);
			alert("Gagal menghapus transaksi: " + err.message);
		}
	};

	return (
		<div className="flex flex-col gap-5">
			{/* ── Top bar ── */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-[20px] font-bold text-slate-100 tracking-tight">
						Semua Transaksi
					</h1>
					<p className="text-[12px] text-slate-500 mt-0.5">
						{data.length} transaksi tercatat
					</p>
				</div>
				<div className="flex items-center gap-2">
					{/* Export dropdown */}
					<div className="relative">
						<button
							onClick={() => setShowExport((e) => !e)}
							className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] text-slate-400 border border-white/[0.07] hover:text-slate-200 hover:bg-white/[0.04] transition-all duration-200"
						>
							<DownloadIcon /> Ekspor ▾
						</button>
						{showExport && (
							<div className="absolute right-0 top-full mt-2 w-40 bg-[#111827] border border-white/[0.08] rounded-xl shadow-2xl py-1.5 z-10">
								<button
									onClick={() => {
										exportCSV(sorted);
										setShowExport(false);
									}}
									className="w-full text-left px-4 py-2.5 text-[12px] text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition-colors"
								>
									📄 Export CSV
								</button>
								<button
									onClick={() => {
										exportPDF(sorted);
										setShowExport(false);
									}}
									className="w-full text-left px-4 py-2.5 text-[12px] text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition-colors"
								>
									🖨️ Export PDF
								</button>
							</div>
						)}
					</div>

					<button
						onClick={() => {
							setEditData(null);
							setModalOpen(true);
						}}
						className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold text-white bg-violet-600 hover:bg-violet-500 transition-colors duration-200"
					>
						<PlusIcon /> Tambah Transaksi
					</button>
				</div>
			</div>

			{/* ── Summary bar ── */}
			<SummaryBar data={filtered} />

			{/* ── Filter ── */}
			<TransaksiFilter
				filters={filters}
				onChange={handleFilter}
				onReset={() => {
					setFilters(EMPTY_FILTERS);
					setPage(1);
				}}
				activeCount={activeCount}
			/>

			{/* ── Table ── */}
			<TransaksiTable
				data={paginated}
				sort={sort}
				onSort={handleSort}
				onEdit={(txn) => {
					setEditData(txn);
					setModalOpen(true);
				}}
				onDelete={(txn) => setDeleteTarget(txn)}
			/>

			{/* ── Pagination ── */}
			<Pagination
				page={page}
				totalPages={totalPages}
				total={sorted.length}
				perPage={PER_PAGE}
				onPage={setPage}
			/>

			{/* ── Modals ── */}
			<TransaksiModal
				open={modalOpen}
				onClose={() => setModalOpen(false)}
				onSave={handleSave}
				editData={editData}
			/>
			<DeleteConfirmModal
				open={!!deleteTarget}
				onClose={() => setDeleteTarget(null)}
				onConfirm={handleDelete}
				nama={deleteTarget?.nama}
			/>
		</div>
	);
}
