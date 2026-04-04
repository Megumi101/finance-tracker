import { useState } from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Sidebar from "./components/layouts/Sidebar";
import Navbar from "./components/layouts/Navbar";
import Dashboard from "./pages/Dashboard";
import Transaksi from "./pages/Transaksi";
import Kategori from "./pages/Kategori";
import Laporan from "./pages/Laporan";

// Placeholder pages — ganti dengan komponen halaman kamu
const Page = ({ title }) => (
	<div className="text-slate-400 text-sm">
		Halaman <span className="text-violet-400 font-semibold">{title}</span> —
		coming soon
	</div>
);

function AppLayout() {
	const [collapsed, setCollapsed] = useState(false);

	return (
		<div className="flex h-screen bg-navy-950 overflow-hidden">
			<Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
			<div className="flex flex-col flex-1 min-w-0 overflow-hidden">
				<Navbar />
				<main className="flex-1 overflow-y-auto px-8 py-7">
					<Outlet />
				</main>
			</div>
		</div>
	);
}

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				{/* Halaman dengan Sidebar + Navbar */}
				<Route element={<AppLayout />}>
					<Route path="/" element={<Dashboard />} />
					<Route path="/transaksi" element={<Transaksi />} />
					<Route path="/kategori" element={<Kategori />} />
					<Route path="/laporan" element={<Laporan title="Laporan" />} />
					<Route path="/filter" element={<Page title="Filter & Ekspor" />} />
					<Route path="/pengaturan" element={<Page title="Pengaturan" />} />
				</Route>

				{/* Halaman tanpa Sidebar + Navbar (auth) */}
				<Route path="/login" element={<Page title="Login" />} />
				<Route path="/register" element={<Page title="Register" />} />
			</Routes>
		</BrowserRouter>
	);
}
