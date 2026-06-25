import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Compass, Upload, Cpu, Calendar, Share2, ArrowRight, CheckCircle } from "lucide-react";

const Landing = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      title: "Document Upload",
      description: "Drag & drop PDF, JPG, PNG, or JPEG travel confirmations instantly.",
      icon: Upload,
      color: "from-blue-500 to-indigo-500",
    },
    {
      title: "AI Travel Extraction",
      description: "Gemini Vision reads details, flight dates, hotel details, and transport numbers automatically.",
      icon: Cpu,
      color: "from-indigo-500 to-purple-500",
    },
    {
      title: "Automatic Itineraries",
      description: "Get detailed day-by-day activity outlines, hidden gems, and local recommendations.",
      icon: Calendar,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Share Trip Plans",
      description: "Instantly copy web share links, send via WhatsApp, or download a printable travel PDF.",
      icon: Share2,
      color: "from-pink-500 to-rose-500",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Upload bookings",
      description: "Upload flight tickets, hotel vouchers, or train passes in image/PDF formats."
    },
    {
      number: "02",
      title: "AI parsing",
      description: "Our backend runs Gemini AI to extract dates, destinations, and bookings."
    },
    {
      number: "03",
      title: "Generate day plans",
      description: "Receive customized morning, afternoon, and evening recommendations."
    },
    {
      number: "04",
      title: "Share & export",
      description: "Save plans to your dashboard history, share via URL, or export to PDF."
    }
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden flex flex-col font-sans">
      {/* Header/Nav */}
      <nav className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center z-10 relative">
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="bg-indigo-600 p-2 rounded-xl text-white group-hover:scale-105 transition-transform">
            <Compass className="h-5 w-5 animate-spin-slow" />
          </div>
          <span className="font-bold text-xl tracking-tight text-gray-900">
            Trrip<span className="text-indigo-600 font-extrabold">AI</span>
          </span>
        </Link>
        <div>
          <Link
            to={isAuthenticated ? "/dashboard" : "/login"}
            className="inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
          >
            {isAuthenticated ? "Go to Dashboard" : "Sign In"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-10 pb-20 md:pt-16 md:pb-28">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 -z-10 w-full h-[600px] bg-gradient-to-b from-indigo-50/50 via-purple-50/20 to-transparent rounded-bl-[100px] md:rounded-bl-[200px]" />
        <div className="absolute top-40 left-10 -z-10 h-72 w-72 bg-purple-200 rounded-full blur-3xl opacity-30 animate-pulse-subtle" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-6 border border-indigo-100/50">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
            </span>
            <span>Next-Gen Travel AI Assistant</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.1] max-w-4xl mx-auto mb-6">
            Turn Travel Bookings Into{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Smart AI Itineraries
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload flight tickets, hotel bookings, and travel documents. Let AI instantly create a complete personalized travel itinerary.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              to={isAuthenticated ? "/dashboard" : "/register"}
              className="w-full sm:w-auto text-center px-8 py-4 rounded-xl text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-xl shadow-indigo-200 hover:translate-y-[-2px]"
            >
              Get Started Free
            </Link>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto text-center px-8 py-4 rounded-xl text-base font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 transition"
            >
              View How It Works
            </a>
          </div>

          {/* Dummy Dashboard UI Preview */}
          <div className="mt-16 max-w-5xl mx-auto glass-panel p-2 rounded-2xl md:rounded-3xl shadow-2xl border border-white/50 animate-float">
            <div className="bg-slate-900 rounded-xl md:rounded-2xl overflow-hidden aspect-[1.8/1] shadow-inner relative flex flex-col items-center justify-center p-8 text-white">
              {/* Background gradient effects inside screen mock */}
              <div className="absolute top-10 right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl" />
              <div className="absolute bottom-10 left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl" />
              
              <div className="relative z-10 text-center max-w-md">
                <div className="mx-auto w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-4">
                  <Upload className="h-6 w-6 text-indigo-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">Drag and drop travel documents</h3>
                <p className="text-sm text-slate-400 mb-6">PDF, PNG, JPG, or JPEG vouchers from airlines & hotels.</p>
                <div className="inline-flex space-x-2 bg-slate-800/80 px-4 py-2 rounded-lg text-xs font-semibold text-indigo-300 border border-slate-700">
                  <span>Try: "flight_ticket_tokyo.pdf"</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-50 py-20 md:py-28 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Everything you need for seamless planning
            </h2>
            <p className="text-base text-gray-500">
              No more juggling between tabs or copying dates. Upload documents and watch the timeline construct itself.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition duration-250 flex flex-col items-start">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.color} text-white mb-5`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Ready in 4 simple steps
            </h2>
            <p className="text-base text-gray-500">
              Go from booking invoice to local hotspots in under a minute.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            {steps.map((step, i) => (
              <div key={i} className="relative flex flex-col items-start p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-4xl font-extrabold text-indigo-100 mb-4 block">
                  {step.number}
                </span>
                <h3 className="font-bold text-lg text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-purple-950 py-16 md:py-24 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent -z-10" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to plan your next adventure?</h2>
          <p className="text-indigo-200/80 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Create a secure account, upload booking passes, and let our artificial intelligence craft the ultimate trip.
          </p>
          <Link
            to={isAuthenticated ? "/dashboard" : "/register"}
            className="inline-flex items-center px-8 py-4 rounded-xl text-base font-bold text-indigo-900 bg-white hover:bg-indigo-50 transition shadow-xl"
          >
            Create Your Account
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-gray-50 border-t border-gray-100 py-12 text-center text-sm text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
                <Compass className="h-4 w-4" />
              </div>
              <span className="font-bold text-lg text-gray-900">
                Trrip<span className="text-indigo-600 font-extrabold">AI</span>
              </span>
            </Link>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-gray-900">About</a>
              <a href="#" className="hover:text-gray-900">Contact</a>
              <a href="#" className="hover:text-gray-900">Privacy Policy</a>
              <a href="#" className="hover:text-gray-900">GitHub</a>
            </div>
          </div>
          <p>© {new Date().getFullYear()} Trrip AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
