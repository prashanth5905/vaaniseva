import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
    ClipboardList,
    FileText,
    Landmark,
    LayoutDashboard,
    LogOut,
    Menu,
    X,
} from "lucide-react";

const navigationItems = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/apply", label: "Apply", icon: FileText },
    { to: "/documents", label: "Documents", icon: Landmark },
    { to: "/applications", label: "My Applications", icon: ClipboardList },
];

export default function Navbar() {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    function logout() {
        localStorage.removeItem("token");
        navigate("/");
    }

    function closeMenu() {
        setIsMenuOpen(false);
    }

    return (
        <nav className="sticky top-0 z-20 border-b border-blue-500/20 bg-blue-700 text-white shadow-sm">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
                <Link
                    to="/dashboard"
                    onClick={closeMenu}
                    className="flex items-center gap-2.5 text-xl font-bold tracking-tight sm:text-2xl"
                >
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20">
                        <Landmark size={19} aria-hidden="true" />
                    </span>
                    VaaniSeva
                </Link>

                <div className="hidden items-center gap-1 md:flex">
                    {navigationItems.map(({ to, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) => `rounded-lg px-3 py-2 text-sm font-medium transition ${
                                isActive ? "bg-white/15 text-white" : "text-blue-100 hover:bg-white/10 hover:text-white"
                            }`}
                        >
                            {label}
                        </NavLink>
                    ))}
                    <button
                        onClick={logout}
                        className="ml-2 inline-flex items-center gap-2 rounded-lg bg-white/15 px-3 py-2 text-sm font-semibold transition hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-white"
                    >
                        <LogOut size={16} aria-hidden="true" />
                        Logout
                    </button>
                </div>

                <button
                    type="button"
                    onClick={() => setIsMenuOpen((current) => !current)}
                    aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
                    className="rounded-lg p-2 text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white md:hidden"
                >
                    {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            {isMenuOpen && (
                <div className="border-t border-white/15 bg-blue-700 px-4 py-3 md:hidden">
                    <div className="mx-auto grid max-w-6xl gap-1">
                        {navigationItems.map(({ to, label, icon: Icon }) => (
                            <NavLink
                                key={to}
                                to={to}
                                onClick={closeMenu}
                                className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium ${
                                    isActive ? "bg-white/15" : "text-blue-100 hover:bg-white/10 hover:text-white"
                                }`}
                            >
                                <Icon size={18} aria-hidden="true" />
                                {label}
                            </NavLink>
                        ))}
                        <button
                            onClick={logout}
                            className="mt-1 flex items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-semibold text-blue-100 hover:bg-red-500 hover:text-white"
                        >
                            <LogOut size={18} aria-hidden="true" />
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}
