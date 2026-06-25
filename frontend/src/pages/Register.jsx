import { useState, useEffect, useRef } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Compass, User, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [slowWarning, setSlowWarning] = useState(false);
  const slowTimerRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSlowWarning(false);

    if (!form.name || !form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setSubmitting(true);

    // Show "waking up server" notice after 5s (Render cold start)
    slowTimerRef.current = setTimeout(() => setSlowWarning(true), 5000);

    try {
      const { data } = await API.post("/auth/register", form);
      clearTimeout(slowTimerRef.current);
      setSlowWarning(false);
      setSuccess(true);

      // Auto-login with the token returned from register
      if (data.token && data.user) {
        login(data.token, data.user);
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (err) {
      clearTimeout(slowTimerRef.current);
      setSlowWarning(false);
      console.error(err);
      setError(
        err.response?.data?.message || "Registration failed. Try a different email."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Cleanup timer on unmount
  useEffect(() => () => clearTimeout(slowTimerRef.current), []);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-50 via-slate-100 to-indigo-50/50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center space-x-2 group justify-center">
          <div className="bg-indigo-600 p-2 rounded-xl text-white group-hover:scale-105 transition-transform">
            <Compass className="h-6 w-6" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-gray-900">
            Trrip<span className="text-indigo-600 font-extrabold">AI</span>
          </span>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          Create travel account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500">
          Or{" "}
          <Link
            to="/login"
            className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
          >
            log in to existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white/80 backdrop-blur-md py-8 px-6 border border-gray-150 shadow-xl rounded-2xl sm:px-10 relative overflow-hidden">
          {/* Top colored accent line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500" />

          {success && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-start space-x-3 text-emerald-700 text-sm animate-fadeIn">
              <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
              <div>
                <p className="font-bold">Account created!</p>
                <p className="text-emerald-600">Redirecting to dashboard...</p>
              </div>
            </div>
          )}

          {slowWarning && !success && (
            <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start space-x-3 text-amber-700 text-sm">
              <Loader2 className="h-5 w-5 text-amber-500 shrink-0 animate-spin" />
              <div>
                <p className="font-semibold">Waking up the server...</p>
                <p className="text-amber-600">The server was sleeping. This may take up to 30 seconds on first request.</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-100 flex items-start space-x-3 text-rose-700 text-sm animate-fadeIn">
              <AlertCircle className="h-5 w-5 text-rose-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-700 mb-1.5"
              >
                Full Name
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <User className="h-4.5 w-4.5" />
                </div>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  placeholder="John Doe"
                  className="block w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition-all"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-1.5"
              >
                Email Address
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  placeholder="name@example.com"
                  className="block w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition-all"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-1.5"
              >
                Password
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="h-4.5 w-4.5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  required
                  placeholder="•••••••• (Min 6 chars)"
                  className="block w-full pl-10 pr-10 py-3 rounded-xl border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition-all"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4.5 w-4.5" />
                  ) : (
                    <Eye className="h-4.5 w-4.5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={submitting || success}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-100 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-75 disabled:cursor-not-allowed hover:translate-y-[-1px]"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating account...
                  </span>
                ) : "Sign Up"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;