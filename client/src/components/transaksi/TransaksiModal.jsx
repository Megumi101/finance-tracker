import { useState, useEffect, useRef } from "react";
import { kategoriApi } from "../../lib/api";

const XIcon = () => (
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
		<line x1="18" y1="6" x2="6" y2="18" />
		<line x1="6" y1="6" x2="18" y2="18" />
	</svg>
);

const inputCls = `
  w-full bg-[#0F1829] border border-white/[0.08] rounded-xl
  text-[13px] text-slate-200 placeholder-slate-600
  px-4 py-2.5 outline-none
  focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20
  transition-all duration-200
`;

const labelCls =
	"block text-[11px] font-medium text-slate-500 uppercase tracking-[1px] mb-2";

const EMPTY_FORM = {
	nama: "",
	jumlah: "",
	tipe: "keluar",
	kategori: "",
	tanggal: new Date().toISOString().split("T")[0],
	status: "berhasil",
	catatan: "",
};

export default function TransaksiModal({ open, onClose, onSave, editData }) {
	const [form, setForm] = useState(EMPTY_FORM);
	const [errors, setErrors] = useState({});
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(false);
	const firstInputRef = useRef(null);

	// Fetch categories from API
	useEffect(() => {
		if (open) {
			fetchCategories();
		}
	}, [open]);

	const fetchCategories = async () => {
		try {
			setLoading(true);
			const res = await kategoriApi.getAll();
			const cats = res.data || [];
			setCategories(cats);
			// Set default category ke yang pertama jika ada
			if (cats.length > 0 && !editData && !form.kategori) {
				setForm((f) => ({ ...f, kategori: cats[0].nama }));
			}
		} catch (err) {
			console.error("Gagal fetch kategori:", err);
			setCategories([]);
		} finally {
			setLoading(false);
		}
	};

	// Populate form when editing
	useEffect(() => {
		if (editData) {
			setForm({
				nama: editData.nama,
				jumlah: String(editData.jumlah),
				tipe: editData.tipe,
				kategori: editData.kategori,
				tanggal: editData.tanggal,
				status: editData.status,
				catatan: editData.catatan || "",
			});
		} else {
			setForm(EMPTY_FORM);
		}
		setErrors({});
	}, [editData, open]);

	// Focus first input when modal opens
	useEffect(() => {
		if (open) setTimeout(() => firstInputRef.current?.focus(), 100);
	}, [open]);

	// Close on Escape
	useEffect(() => {
		const handler = (e) => {
			if (e.key === "Escape") onClose();
		};
		document.addEventListener("keydown", handler);
		return () => document.removeEventListener("keydown", handler);
	}, [onClose]);

	if (!open) return null;

	const set = (field, value) => {
		setForm((f) => ({ ...f, [field]: value }));
		if (errors[field]) setErrors((e) => ({ ...e, [field]: "" }));
	};

	const validate = () => {
		const e = {};
		if (!form.nama.trim()) e.nama = "Nama wajib diisi";
		if (!form.jumlah || isNaN(Number(form.jumlah)) || Number(form.jumlah) <= 0)
			e.jumlah = "Jumlah harus angka positif";
		if (!form.tanggal) e.tanggal = "Tanggal wajib diisi";
		return e;
	};

	const handleSubmit = () => {
		const e = validate();
		if (Object.keys(e).length) {
			setErrors(e);
			return;
		}

		onSave({
			...(editData || {}),
			id: editData?.id ?? Date.now(),
			nama: form.nama.trim(),
			jumlah: Number(form.jumlah),
			tipe: form.tipe,
			kategori: form.kategori,
			tanggal: form.tanggal,
			status: form.status,
			catatan: form.catatan.trim(),
		});
		onClose();
	};

	const isEdit = !!editData;

	return (
		/* Overlay */
		<div
			className="fixed inset-0 z-50 flex items-center justify-center p-4"
			style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
			onClick={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}
		>
			{/* Modal */}
			<div className="w-full max-w-md bg-[#0C1120] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden">
				{/* Header */}
				<div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
					<div>
						<h2 className="text-[16px] font-semibold text-slate-100">
							{isEdit ? "Edit Transaksi" : "Tambah Transaksi"}
						</h2>
						<p className="text-[12px] text-slate-500 mt-0.5">
							{isEdit
								? "Perbarui detail transaksi"
								: "Isi detail transaksi baru"}
						</p>
					</div>
					<button
						onClick={onClose}
						className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-300 hover:bg-white/[0.05] transition-all duration-200"
					>
						<XIcon />
					</button>
				</div>

				{/* Body */}
				<div className="px-6 py-5 flex flex-col gap-4">
					{/* Tipe toggle */}
					<div>
						<label className={labelCls}>Tipe</label>
						<div className="grid grid-cols-2 gap-2">
							{[
								{
									value: "masuk",
									label: "↑ Pemasukan",
									active:
										"bg-emerald-600/15 border-emerald-500/40 text-emerald-400",
								},
								{
									value: "keluar",
									label: "↓ Pengeluaran",
									active: "bg-red-600/15 border-red-500/40 text-red-400",
								},
							].map((opt) => (
								<button
									key={opt.value}
									onClick={() => set("tipe", opt.value)}
									className={`
                    py-2.5 rounded-xl text-[13px] font-medium border transition-all duration-200
                    ${
											form.tipe === opt.value
												? opt.active
												: "bg-[#0F1829] border-white/[0.07] text-slate-500 hover:text-slate-300"
										}
                  `}
								>
									{opt.label}
								</button>
							))}
						</div>
					</div>

					{/* Nama */}
					<div>
						<label className={labelCls}>Nama Transaksi</label>
						<input
							ref={firstInputRef}
							type="text"
							placeholder="cth. Gaji Bulanan"
							value={form.nama}
							onChange={(e) => set("nama", e.target.value)}
							className={inputCls + (errors.nama ? " border-red-500/50" : "")}
						/>
						{errors.nama && (
							<p className="text-[11px] text-red-400 mt-1">{errors.nama}</p>
						)}
					</div>

					{/* Jumlah */}
					<div>
						<label className={labelCls}>Jumlah (Rp)</label>
						<div className="relative">
							<span className="absolute left-4 top-1/2 -translate-y-1/2 text-[13px] text-slate-500">
								Rp
							</span>
							<input
								type="number"
								placeholder="0"
								value={form.jumlah}
								onChange={(e) => set("jumlah", e.target.value)}
								className={
									inputCls +
									" pl-10 " +
									(errors.jumlah ? "border-red-500/50" : "")
								}
								min="0"
							/>
						</div>
						{errors.jumlah && (
							<p className="text-[11px] text-red-400 mt-1">{errors.jumlah}</p>
						)}
					</div>

					{/* Kategori + Tanggal */}
					<div className="grid grid-cols-2 gap-3">
						<div>
							<label className={labelCls}>Kategori</label>
							<div className="relative">
								<select
									value={form.kategori}
									onChange={(e) => set("kategori", e.target.value)}
									disabled={loading || categories.length === 0}
									className={
										inputCls +
										" appearance-none pr-8 " +
										(loading || categories.length === 0
											? "opacity-60 cursor-not-allowed"
											: "")
									}
								>
									<option value="">
										{loading ? "Memuat..." : "Pilih Kategori"}
									</option>
									{categories.map((k) => (
										<option key={k.id} value={k.nama}>
											{k.emoji} {k.nama}
										</option>
									))}
								</select>
								<span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none text-[10px]">
									▾
								</span>
							</div>
						</div>
						<div>
							<label className={labelCls}>Tanggal</label>
							<input
								type="date"
								value={form.tanggal}
								onChange={(e) => set("tanggal", e.target.value)}
								className={
									inputCls + (errors.tanggal ? " border-red-500/50" : "")
								}
								style={{ colorScheme: "dark" }}
							/>
							{errors.tanggal && (
								<p className="text-[11px] text-red-400 mt-1">
									{errors.tanggal}
								</p>
							)}
						</div>
					</div>

					{/* Status */}
					<div>
						<label className={labelCls}>Status</label>
						<div className="grid grid-cols-3 gap-2">
							{[
								{
									value: "berhasil",
									label: "Berhasil",
									cls: "border-emerald-500/40 text-emerald-400 bg-emerald-600/10",
								},
								{
									value: "tertunda",
									label: "Tertunda",
									cls: "border-amber-500/40 text-amber-400 bg-amber-600/10",
								},
								{
									value: "gagal",
									label: "Gagal",
									cls: "border-red-500/40 text-red-400 bg-red-600/10",
								},
							].map((opt) => (
								<button
									key={opt.value}
									onClick={() => set("status", opt.value)}
									className={`
                    py-2 rounded-xl text-[12px] font-medium border transition-all duration-200
                    ${
											form.status === opt.value
												? opt.cls
												: "bg-[#0F1829] border-white/[0.07] text-slate-500 hover:text-slate-300"
										}
                  `}
								>
									{opt.label}
								</button>
							))}
						</div>
					</div>

					{/* Catatan */}
					<div>
						<label className={labelCls}>
							Catatan{" "}
							<span className="normal-case text-slate-700">(opsional)</span>
						</label>
						<textarea
							placeholder="Tambahkan catatan..."
							value={form.catatan}
							onChange={(e) => set("catatan", e.target.value)}
							rows={2}
							className={inputCls + " resize-none"}
						/>
					</div>
				</div>

				{/* Footer */}
				<div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/[0.06]">
					<button
						onClick={onClose}
						className="px-4 py-2 rounded-xl text-[13px] text-slate-400 hover:text-slate-200 border border-white/[0.07] hover:bg-white/[0.04] transition-all duration-200"
					>
						Batal
					</button>
					<button
						onClick={handleSubmit}
						className="px-5 py-2 rounded-xl text-[13px] font-semibold text-white bg-violet-600 hover:bg-violet-500 transition-colors duration-200"
					>
						{isEdit ? "Simpan Perubahan" : "Tambah Transaksi"}
					</button>
				</div>
			</div>
		</div>
	);
}