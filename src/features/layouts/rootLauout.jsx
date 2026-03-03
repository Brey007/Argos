import { NavLink, Outlet } from 'react-router-dom';

const linkBase = "px-3 py-2 rounded-md text-sm font-medium transition-colors focus-visuble:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500";

const linkClass = ({ isActive }) => `${linkBase} ${isActive ? 'bg-indigo-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`;

export default function RootLayout() {
    return (
        <div className="min-h-screen bg-gray-900">
            <header className = "border-b bg-gray-800">
                <div className = "mx-auto max-w-5x1 px-4 py-3 flex items-center justify-between">
                    <div className = "font-semibold tracking-tight">Argos</div>
                    <nav className = "flex items-center gap-2">
                        <NavLink to = "/" class = {linkClass} end>Home</NavLink>
                        <NavLink to = "/Login" class = {linkClass}>Login</NavLink>
                        <NavLink to = "/Signup" class = {linkClass}>Signup</NavLink>
                        <NavLink to = "/Dashboard" class = {linkClass}>Dashboard</NavLink>
                    </nav>
                </div>
            </header>

            <main className = "mx-auto max-w-5x1 px-4 py-6">
                <Outlet />
            </main>
        </div>
    );
}