import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import API from "../services/api";
import { 
  Search, 
  Trash2, 
  Eye, 
  Calendar, 
  MapPin, 
  Compass,
  SlidersHorizontal,
  ArrowUpDown,
  AlertCircle 
} from "lucide-react";

function History() {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("dateDesc");
  const [filter, setFilter] = useState("all");

  const fetchItineraries = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {};
      if (search) params.search = search;
      if (sort) params.sort = sort;
      if (filter !== "all") params.filter = filter;

      const res = await API.get("/itineraries", { params });
      if (res.data.success) {
        setItineraries(res.data.itineraries);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load your trip history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search slightly
    const timer = setTimeout(() => {
      fetchItineraries();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, sort, filter]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this itinerary?")) {
      return;
    }

    try {
      await API.delete(`/itineraries/${id}`);
      fetchItineraries();
    } catch (err) {
      console.error(err);
      alert("Failed to delete itinerary.");
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Layout>
      <div className="space-y-8 font-sans">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
            Trip History
          </h1>
          <p className="text-gray-500 font-medium">
            Search, sort, and manage all your past and upcoming AI travel itineraries.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-start space-x-3 text-rose-700 text-sm">
            <AlertCircle className="h-5 w-5 text-rose-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Filter Controls Row */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Search className="h-4.5 w-4.5" />
            </div>
            <input
              type="text"
              placeholder="Search by destination..."
              className="block w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Sort & Filters */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <SlidersHorizontal className="h-4 w-4 text-gray-400" />
              <select
                className="block pl-3 pr-8 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm bg-white cursor-pointer"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Trips</option>
                <option value="upcoming">Upcoming Only</option>
                <option value="past">Past Only</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <ArrowUpDown className="h-4 w-4 text-gray-400" />
              <select
                className="block pl-3 pr-8 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm bg-white cursor-pointer"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="dateDesc">Newest First</option>
                <option value="dateAsc">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* History Grid */}
        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : itineraries.length === 0 ? (
          <div className="py-20 text-center bg-white border border-gray-100 rounded-3xl">
            <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <Compass className="h-6 w-6 text-gray-400 animate-pulse-subtle" />
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">No itineraries found</h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
              Try adjusting your search query, clearing filters, or upload a new booking document to generate a new itinerary.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {itineraries.map((trip) => (
              <div
                key={trip._id}
                className="bg-white hover:bg-slate-50/50 rounded-2xl p-5 border border-gray-150 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between group h-full"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-lg uppercase tracking-wide">
                      {trip.generatedItinerary?.duration || "Trip"}
                    </span>
                    <button
                      onClick={() => handleDelete(trip._id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete Trip"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {trip.destination}
                    </h3>
                    <p className="text-xs text-gray-500 font-semibold flex items-center mt-1">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                    </p>
                  </div>

                  <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                    {trip.generatedItinerary?.summary || "Your customized AI travel plan."}
                  </p>
                </div>

                <div className="pt-5 mt-4 border-t border-gray-100 flex items-center justify-between">
                  <Link
                    to={`/itinerary/${trip._id}`}
                    className="inline-flex items-center text-sm font-bold text-indigo-600 hover:text-indigo-700 transition"
                  >
                    <Eye className="h-4 w-4 mr-1.5" />
                    <span>View Itinerary</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default History;
