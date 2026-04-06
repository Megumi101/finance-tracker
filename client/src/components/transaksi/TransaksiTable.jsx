const STATUS_MAP = {
  berhasil: { label: 'Berhasil', cls: 'bg-emerald-500/10 text-emerald-400' },
  tertunda: { label: 'Tertunda', cls: 'bg-amber-500/10  text-amber-400'   },
  gagal:    { label: 'Gagal',    cls: 'bg-red-500/10    text-red-400'     },
}

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
)
const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3,6 5,6 21,6"/><path d="M19,6l-1,14a2,2,0,0,1-2,2H8a2,2,0,0,1-2-2L5,6"/><path d="M10,11v6"/><path d="M14,11v6"/>
  </svg>
)
const SortIcon = ({ dir }) => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    {dir === 'asc'  && <polyline points="18,15 12,9 6,15"/>}
    {dir === 'desc' && <polyline points="6,9 12,15 18,9"/>}
    {!dir && <><polyline points="18,15 12,9 6,15" opacity="0.35"/><polyline points="6,15 12,21 18,15" opacity="0.35"/></>}
  </svg>
)

function formatRupiah(v) {
  const abs = Math.abs(v)
  const sign = v > 0 ? '+' : '-'
  if (abs >= 1000000) return sign + 'Rp ' + (abs / 1000000).toFixed(1) + ' Jt'
  if (abs >= 1000)    return sign + 'Rp ' + (abs / 1000).toFixed(0) + ' Rb'
  return sign + 'Rp ' + abs
}

function formatTanggal(str) {
  const d = new Date(str)
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

function Initials({ nama, tipe }) {
	const letters = (nama || "T")
		.split(" ")
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase();
	return (
		<div
			className={`
      w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-bold flex-shrink-0
      ${tipe === "masuk" ? "bg-violet-600/15 text-violet-400" : "bg-slate-700/40 text-slate-400"}
    `}
		>
			{letters}
		</div>
	);
}

const COLS = [
	{ key: "nama", label: "Transaksi" },
	{ key: "kategori", label: "Kategori" },
	{ key: "tanggal", label: "Tanggal" },
	{ key: "jumlah", label: "Jumlah" },
	{ key: "status", label: "Status" },
];

export default function TransaksiTable({
	data,
	sort,
	onSort,
	onEdit,
	onDelete,
}) {
	if (data.length === 0) {
		return (
			<div className="bg-[#0C1120] border border-white/[0.06] rounded-2xl p-16 flex flex-col items-center justify-center text-center">
				<div className="text-4xl mb-3">🔍</div>
				<p className="text-[14px] font-medium text-slate-400">
					Tidak ada transaksi ditemukan
				</p>
				<p className="text-[12px] text-slate-600 mt-1">
					Coba ubah filter atau tambah transaksi baru
				</p>
			</div>
		);
	}

	return (
		<div className="bg-[#0C1120] border border-white/[0.06] rounded-2xl overflow-hidden">
			<table className="w-full border-collapse">
				{/* Head */}
				<thead>
					<tr className="border-b border-white/[0.05]">
						{COLS.map((col) => (
							<th
								key={col.key}
								onClick={() => onSort(col.key)}
								className="text-left px-5 py-3.5 cursor-pointer select-none group"
							>
								<div className="flex items-center gap-1.5">
									<span className="text-[10px] font-medium tracking-[1.2px] uppercase text-slate-600 group-hover:text-slate-400 transition-colors">
										{col.label}
									</span>
									<span
										className={`transition-colors ${sort.key === col.key ? "text-violet-400" : "text-slate-700 group-hover:text-slate-500"}`}
									>
										<SortIcon dir={sort.key === col.key ? sort.dir : null} />
									</span>
								</div>
							</th>
						))}
						<th className="px-5 py-3.5 text-right">
							<span className="text-[10px] font-medium tracking-[1.2px] uppercase text-slate-600">
								Aksi
							</span>
						</th>
					</tr>
				</thead>

				{/* Body */}
				<tbody className="divide-y divide-white/[0.04]">
					{data.map((txn) => {
						const status = STATUS_MAP[txn.status] || STATUS_MAP["berhasil"]; // Default to 'berhasil' if undefined
						const isPos = txn.tipe === "masuk";

						return (
							<tr
								key={txn.id}
								className="hover:bg-white/[0.02] transition-colors duration-150 group"
							>
								{/* Nama */}
								<td className="px-5 py-4">
									<div className="flex items-center gap-3">
										<Initials nama={txn.nama} tipe={txn.tipe} />
										<div>
											<p className="text-[13px] font-medium text-slate-200">
												{txn.nama}
											</p>
											{txn.catatan && (
												<p className="text-[11px] text-slate-600 mt-0.5 truncate max-w-[160px]">
													{txn.catatan}
												</p>
											)}
										</div>
									</div>
								</td>

								{/* Kategori */}
								<td className="px-5 py-4">
									<span className="text-[12px] text-slate-400 bg-white/[0.04] px-2.5 py-1 rounded-lg">
										{txn.kategori}
									</span>
								</td>

								{/* Tanggal */}
								<td className="px-5 py-4">
									<span className="text-[12px] text-slate-500">
										{formatTanggal(txn.tanggal)}
									</span>
								</td>

								{/* Jumlah */}
								<td className="px-5 py-4">
									<span
										className={`text-[13px] font-mono font-bold ${isPos ? "text-emerald-400" : "text-red-400"}`}
									>
										{formatRupiah(isPos ? txn.jumlah : -txn.jumlah)}
									</span>
								</td>

								{/* Status */}
								<td className="px-5 py-4">
									<span
										className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${status.cls}`}
									>
										{status.label}
									</span>
								</td>

								{/* Aksi */}
								<td className="px-5 py-4">
									<div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
										<button
											onClick={() => onEdit(txn)}
											className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-violet-400 hover:bg-violet-500/10 transition-all duration-150"
											title="Edit"
										>
											<EditIcon />
										</button>
										<button
											onClick={() => onDelete(txn)}
											className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150"
											title="Hapus"
										>
											<TrashIcon />
										</button>
									</div>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}