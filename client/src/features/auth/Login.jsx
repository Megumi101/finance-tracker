import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

// ─── Icons ────────────────────────────────────────────────────────────────────
const EyeIcon = ({ open }) =>
	open ? (
		<svg
			width="15"
			height="15"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
			<circle cx="12" cy="12" r="3" />
		</svg>
	) : (
		<svg
			width="15"
			height="15"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
			<path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
			<line x1="1" y1="1" x2="23" y2="23" />
		</svg>
	);
const LockIcon = () => (
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
		<rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
		<path d="M7 11V7a5 5 0 0 1 10 0v4" />
	</svg>
);
const MailIcon = () => (
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
		<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
		<polyline points="22,6 12,13 2,6" />
	</svg>
);
const ArrowIcon = () => (
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
		<line x1="5" y1="12" x2="19" y2="12" />
		<polyline points="12,5 19,12 12,19" />
	</svg>
);

function Background() {
	return (
		<div className="fixed inset-0 pointer-events-none overflow-hidden">
			<svg
				className="absolute inset-0 w-full h-full opacity-[0.035]"
				xmlns="http://www.w3.org/2000/svg"
			>
				<defs>
					<pattern id="g" width="52" height="52" patternUnits="userSpaceOnUse">
						<path
							d="M 52 0 L 0 0 0 52"
							fill="none"
							stroke="#7C3AED"
							strokeWidth="0.6"
						/>
					</pattern>
				</defs>
				<rect width="100%" height="100%" fill="url(#g)" />
			</svg>
			<div
				className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
				style={{
					background:
						"radial-gradient(circle, rgba(124,58,237,0.14) 0%, transparent 65%)",
				}}
			/>
			<div
				className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] rounded-full"
				style={{
					background:
						"radial-gradient(circle, rgba(79,70,229,0.1) 0%, transparent 65%)",
				}}
			/>
		</div>
	);
}

export default function Login() {
	const navigate = useNavigate();
	const { login } = useAuth();

	const [form, setForm] = useState({ email: "", password: "" });
	const [showPass, setShowPass] = useState(false);
	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(false);
	const [serverErr, setServerErr] = useState("");

	const set = (field, value) => {
		setForm((f) => ({ ...f, [field]: value }));
		if (errors[field]) setErrors((e) => ({ ...e, [field]: "" }));
		if (serverErr) setServerErr("");
	};

	const validate = () => {
		const e = {};
		if (!form.email.trim()) e.email = "Email wajib diisi";
		else if (!/\S+@\S+\.\S+/.test(form.email))
			e.email = "Format email tidak valid";
		if (!form.password) e.password = "Password wajib diisi";
		else if (form.password.length < 6)
			e.password = "Password minimal 6 karakter";
		return e;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const errs = validate();
		if (Object.keys(errs).length) {
			setErrors(errs);
			return;
		}

		setLoading(true);
		setServerErr("");

		try {
			await login(form.email, form.password);
			navigate("/");
		} catch (err) {
			setServerErr(err.message);
		} finally {
			setLoading(false);
		}
	};

	const inputCls = (hasErr) => `
    w-full bg-[#0F1829] border rounded-xl
    text-[13px] text-slate-200 placeholder-slate-600
    pl-10 pr-4 py-3 outline-none transition-all duration-200
    ${
			hasErr
				? "border-red-500/50 focus:border-red-500/70"
				: "border-white/[0.08] focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20"
		}
  `;

	return (
		<div className="min-h-screen bg-[#080C14] flex items-center justify-center p-6 relative">
			<Background />

			<div className="relative w-full max-w-[420px] bg-[#0C1120] border border-white/[0.07] rounded-2xl shadow-2xl overflow-hidden">
				<div
					className="h-[2px] w-full"
					style={{
						background: "linear-gradient(90deg, #7C3AED, #4F46E5, #0891B2)",
					}}
				/>

				<div className="px-8 py-9">
					{/* Logo */}
					<div className="flex flex-col items-center text-center mb-8">
						<div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold text-[18px] mb-4 shadow-lg shadow-violet-900/30">
							₿
						</div>
						<h1 className="font-mono font-bold text-[18px] text-white tracking-tight mb-1">
							FinTrack
						</h1>
						<p className="text-[13px] text-slate-500">Masuk ke akun kamu</p>
					</div>

					{/* Server error */}
					{serverErr && (
						<div className="mb-5 flex items-center gap-3 bg-red-500/[0.07] border border-red-500/20 rounded-xl px-4 py-3">
							<span className="text-red-400 text-[14px] flex-shrink-0">⚠</span>
							<p className="text-[12px] text-red-400">{serverErr}</p>
						</div>
					)}

					{/* Form */}
					<form onSubmit={handleSubmit} className="flex flex-col gap-4">
						{/* Email */}
						<div>
							<label className="block text-[11px] font-medium text-slate-500 uppercase tracking-[1px] mb-2">
								Email
							</label>
							<div className="relative">
								<span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600">
									<MailIcon />
								</span>
								<input
									type="email"
									placeholder="kamu@email.com"
									value={form.email}
									onChange={(e) => set("email", e.target.value)}
									className={inputCls(!!errors.email)}
									autoComplete="email"
									autoFocus
								/>
							</div>
							{errors.email && (
								<p className="text-[11px] text-red-400 mt-1.5">
									{errors.email}
								</p>
							)}
						</div>

						{/* Password */}
						<div>
							<div className="flex items-center justify-between mb-2">
								<label className="block text-[11px] font-medium text-slate-500 uppercase tracking-[1px]">
									Password
								</label>
								<button
									type="button"
									className="text-[11px] text-violet-400 hover:text-violet-300 transition-colors"
								>
									Lupa password?
								</button>
							</div>
							<div className="relative">
								<span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600">
									<LockIcon />
								</span>
								<input
									type={showPass ? "text" : "password"}
									placeholder="••••••••"
									value={form.password}
									onChange={(e) => set("password", e.target.value)}
									className={inputCls(!!errors.password) + " pr-11"}
									autoComplete="current-password"
								/>
								<button
									type="button"
									onClick={() => setShowPass((s) => !s)}
									className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
								>
									<EyeIcon open={showPass} />
								</button>
							</div>
							{errors.password && (
								<p className="text-[11px] text-red-400 mt-1.5">
									{errors.password}
								</p>
							)}
						</div>

						{/* Remember me */}
						<label className="flex items-center gap-2.5 cursor-pointer group">
							<div className="relative flex-shrink-0">
								<input type="checkbox" className="sr-only peer" />
								<div className="w-4 h-4 rounded bg-[#0F1829] border border-white/[0.12] peer-checked:bg-violet-600 peer-checked:border-violet-600 transition-all duration-200" />
								<div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none">
									<svg width="9" height="9" viewBox="0 0 12 12" fill="none">
										<polyline
											points="2,6 5,9 10,3"
											stroke="white"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</div>
							</div>
							<span className="text-[12px] text-slate-500 group-hover:text-slate-400 transition-colors">
								Ingat saya selama 30 hari
							</span>
						</label>

						{/* Submit */}
						<button
							type="submit"
							disabled={loading}
							className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-[14px] text-white mt-1 transition-all duration-200
                ${loading ? "bg-violet-700/50 cursor-not-allowed" : "bg-violet-600 hover:bg-violet-500 active:scale-[0.98]"}`}
						>
							{loading ? (
								<>
									<svg
										className="animate-spin w-4 h-4"
										viewBox="0 0 24 24"
										fill="none"
									>
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										/>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
										/>
									</svg>
									Masuk...
								</>
							) : (
								<>
									Masuk ke Dashboard <ArrowIcon />
								</>
							)}
						</button>
					</form>

					<div className="flex items-center gap-3 my-6">
						<div className="flex-1 h-px bg-white/[0.05]" />
						<span className="text-[11px] text-slate-700">atau</span>
						<div className="flex-1 h-px bg-white/[0.05]" />
					</div>

					<p className="text-center text-[12px] text-slate-600">
						Belum punya akun?{" "}
						<Link
							to="/register"
							className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
						>
							Daftar sekarang
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}