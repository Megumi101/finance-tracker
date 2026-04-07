import { useState } from "react";
import {
	BrowserRouter,
	Routes,
	Route,
	Outlet,
	Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import { ThemeProvider } from "./context/ThemeProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/layouts/Sidebar";
import Navbar from "./components/layouts/Navbar";
import Dashboard from "./pages/Dashboard";
import Kategori from "./pages/Kategori";
import Transaksi from "./pages/Transaksi";
import Laporan from "./pages/Laporan";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";

const Page = ({ title }) => (
	<div className="text-slate-400 text-sm">
		Halaman <span className="text-violet-400 font-semibold">{title}</span> —
		coming soon
	</div>
);

function AppLayout() {
	const [collapsed, setCollapsed] = useState(false);

	return (
		<div className="flex h-screen bg-[#080C14] overflow-hidden">
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
			<AuthProvider>
				<ThemeProvider>
					<Routes>
						{/* Protected — harus login */}
						<Route
							element={
								<ProtectedRoute>
									<AppLayout />
								</ProtectedRoute>
							}
						>
							<Route path="/" element={<Dashboard />} />
							<Route path="/transaksi" element={<Transaksi />} />
							<Route path="/kategori" element={<Kategori title="Kategori" />} />
							<Route path="/laporan" element={<Laporan />} />
							<Route path="/profile" element={<Profile />} />
							<Route path="/pengaturan" element={<Settings />} />
							<Route
								path="/filter"
								element={<Page title="Filter & Ekspor" />}
							/>
						</Route>

						{/* Public — auth pages */}
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Register title="Register" />} />

						{/* Fallback */}
						<Route path="*" element={<Navigate to="/" replace />} />
					</Routes>
				</ThemeProvider>
			</AuthProvider>
		</BrowserRouter>
	);
}
