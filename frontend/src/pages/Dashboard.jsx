import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { 
  Compass, 
  FileText, 
  MapPin, 
  Calendar, 
  Plus, 
  ArrowRight, 
  Eye, 
  Trash2,
  AlertCircle
} from "lucide-react";

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalTrips: 0,
    savedItineraries: 0,
    uploadedDocuments: 0,
    upcomingTrips: 0,
  });

  const [recentTrips, setRecentTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, tripsRes] = await Promise.all([
        API.get("/itineraries/stats"),
        API.get("/itineraries"),
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
      }
      if (tripsRes.data.success) {
        // Take the 3 most recent trips
        setRecentTrips(tripsRes.data.itineraries.slice(0, 3));
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteTrip = async (id, e) => {
    e.preventDefault();
    if (!window.confirm("Are you sure you want to delete this trip itinerary?")) {
      return;
    }

    try {
      await API.delete(`/itineraries/${id}`);
      // Refresh statistics and list
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to delete itinerary");
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const statCards = [
    {
      label: "Total Trips",
      value: stats.totalTrips,
      icon: Compass,
      color: "text-indigo-600 bg-indigo-50 border-indigo-100",
    },
    {
      label: "Saved Itineraries",
      value: stats.savedItineraries,
      icon: MapPin,
      color: "text-purple-600 bg-purple-50 border-purple-100",
    },
    {
      label: "Uploaded Documents",
      value: stats.uploadedDocuments,
      icon: FileText,
      color: "text-blue-600 bg-blue-50 border-blue-100",
    },
    {
      label: "Upcoming Trips",
      value: stats.upcomingTrips,
      icon: Calendar,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
  ];

  return (
    <Layout>
      <div className="space-y-8 font-sans">
        {/* Welcome Banner */}
        <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden shadow-sm">
          <div className="absolute -right-16 -top-16 w-48 h-48 bg-indigo-200/20 rounded-full blur-3xl" />
          <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-purple-200/20 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
              Welcome back, {user?.name || "Traveler"}! 👋
            </h1>
            <p className="text-gray-500 max-w-xl font-medium">
              Upload your booking documents and let our AI create the perfect, customized itinerary for your next trip.
            </p>
          </div>
          <Link
            to="/upload"
            className="relative z-10 shrink-0 inline-flex items-center justify-center px-6 py-4 rounded-2xl text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 hover:translate-y-[-1px] space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Upload New Booking</span>
          </Link>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-start space-x-3 text-rose-700 text-sm">
            <AlertCircle className="h-5 w-5 text-rose-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {statCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div 
                key={i} 
                className="bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between"
              >
                <div className="space-y-1">
                  <span className="text-xs md:text-sm font-semibold text-gray-400 block uppercase tracking-wider">{card.label}</span>
                  <span className="text-2xl md:text-3xl font-extrabold text-gray-900 block">
                    {loading ? "..." : card.value}
                  </span>
                </div>
                <div className={`p-3 rounded-xl border ${card.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Trips Section */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Recent Trip Itineraries</h2>
            <Link
              to="/history"
              className="inline-flex items-center text-sm font-bold text-indigo-600 hover:text-indigo-500 transition-colors"
            >
              <span>View All History</span>
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          ) : recentTrips.length === 0 ? (
            <div className="py-16 text-center border-2 border-dashed border-gray-200 rounded-2xl">
              <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <Compass className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">No itineraries generated yet</h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
                Once you upload flight confirmations, hotels, or booking documents, your AI generated itinerary will appear here.
              </p>
              <Link
                to="/upload"
                className="inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-md shadow-indigo-100"
              >
                Upload First Booking
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {recentTrips.map((trip) => (
                <div
                  key={trip._id}
                  className="bg-slate-50 hover:bg-slate-100/80 rounded-2xl p-5 border border-slate-100 hover:border-slate-200 transition duration-200 flex flex-col justify-between group h-full relative"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-lg uppercase tracking-wide">
                        {trip.generatedItinerary?.duration || "Trip"}
                      </div>
                      <button
                        onClick={(e) => handleDeleteTrip(trip._id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Delete Trip"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </div>
                    
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                        {trip.destination}
                      </h3>
                      <p className="text-xs text-gray-500 font-medium flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                      </p>
                    </div>

                    <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                      {trip.generatedItinerary?.summary || "Your customized AI travel plan."}
                    </p>
                  </div>

                  <div className="pt-5 mt-4 border-t border-slate-200/60 flex items-center justify-between">
                    <Link
                      to={`/itinerary/${trip._id}`}
                      className="inline-flex items-center text-sm font-bold text-indigo-600 hover:text-indigo-700 transition"
                    >
                      <Eye className="h-4 w-4 mr-1.5" />
                      <span>View Details</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;