import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Compass, Upload, History, LogOut, User, Menu, X, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: Compass },
    { label: "Upload Booking", path: "/upload", icon: Upload },
    { label: "History", path: "/history", icon: History },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-50 via-slate-50 to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/20 text-gray-900 dark:text-slate-100 flex flex-col transition-colors duration-250">
      {/* Header */}
      <header className="glass-panel sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 border-b border-gray-100 dark:border-slate-800/80 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center space-x-2 group">
              <div className="bg-indigo-600 p-2 rounded-xl text-white group-hover:scale-105 transition-transform">
                <Compass className="h-5 w-5 animate-spin-slow" />
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">
                Trrip<span className="text-indigo-600 dark:text-indigo-400 font-extrabold">AI</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      isActive(item.path)
                        ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 shadow-sm"
                        : "text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* User Actions */}
            <div className="hidden md:flex items-center space-x-4 border-l border-gray-200 dark:border-slate-800 pl-4">
              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl transition"
                title="Toggle Theme"
              >
                {darkMode ? <Sun className="h-4.5 w-4.5 text-amber-500" /> : <Moon className="h-4.5 w-4.5" />}
              </button>

              <div className="flex items-center space-x-2.5">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold shadow-md shadow-indigo-200 dark:shadow-none">
                  {user?.name ? user.name[0].toUpperCase() : "U"}
                </div>
                <span className="text-sm font-semibold text-gray-750 dark:text-slate-200 max-w-[120px] truncate">
                  {user?.name || "User"}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-500 dark:text-slate-400 hover:text-red-650 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all"
                title="Log Out"
              >
                <LogOut className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Mobile Actions (Menu & Theme) */}
            <div className="flex items-center space-x-2 md:hidden">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl"
              >
                {darkMode ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5" />}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-850 rounded-xl"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-panel border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-4 px-4 space-y-2 absolute w-full left-0 shadow-lg animate-fadeIn">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                    isActive(item.path)
                      ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400"
                      : "text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <div className="border-t border-gray-150 dark:border-slate-800 pt-4 mt-2 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-9 w-9 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-base font-bold">
                  {user?.name ? user.name[0].toUpperCase() : "U"}
                </div>
                <span className="text-base font-bold text-gray-700 dark:text-slate-200">
                  {user?.name || "User"}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-red-650 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl font-semibold"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800/80 py-6 text-center text-sm text-gray-500 dark:text-slate-400 no-print transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Trrip AI. Built with ❤️ for modern travelers.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
