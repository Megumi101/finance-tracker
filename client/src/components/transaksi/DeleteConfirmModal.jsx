const TrashIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3,6 5,6 21,6"/><path d="M19,6l-1,14a2,2,0,0,1-2,2H8a2,2,0,0,1-2-2L5,6"/><path d="M10,11v6"/><path d="M14,11v6"/><path d="M9,6V4a1,1,0,0,1,1-1h4a1,1,0,0,1,1,1v2"/>
  </svg>
)

export default function DeleteConfirmModal({ open, onClose, onConfirm, nama }) {
  if (!open) return null

  return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center p-4"
			style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
			onClick={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}
		>
			<div className="w-full max-w-sm bg-navy-900 border border-white/8 rounded-2xl shadow-2xl p-6 text-center">
				{/* Icon */}
				<div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mx-auto mb-4">
					<TrashIcon />
				</div>

				<h2 className="text-[16px] font-semibold text-slate-100 mb-2">
					Hapus Transaksi?
				</h2>
				<p className="text-[13px] text-slate-400 leading-relaxed mb-6">
					Transaksi <span className="text-slate-200 font-medium">"{nama}"</span>{" "}
					akan dihapus permanen dan tidak bisa dikembalikan.
				</p>

				<div className="flex gap-3">
					<button
						onClick={onClose}
						className="flex-1 py-2.5 rounded-xl text-[13px] text-slate-400 border border-white/[0.07] hover:bg-white/4 hover:text-slate-200 transition-all duration-200"
					>
						Batal
					</button>
					<button
						onClick={() => {
							onConfirm();
							onClose();
						}}
						className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-white bg-red-600 hover:bg-red-500 transition-colors duration-200"
					>
						Ya, Hapus
					</button>
				</div>
			</div>
		</div>
	);
}