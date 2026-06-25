import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import API from "../services/api";
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Clock, 
  Copy, 
  Share2, 
  Printer, 
  Compass,
  Sparkles,
  Coffee,
  Sun,
  Moon,
  Utensils,
  Check,
  AlertCircle
} from "lucide-react";

function ItineraryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/itineraries/${id}`);
        if (res.data.success) {
          setItinerary(res.data.itinerary);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load itinerary details.");
      } finally {
        setLoading(false);
      }
    };

    fetchItinerary();
  }, [id]);

  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}/share/${itinerary?.shareId}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const shareUrl = `${window.location.origin}/share/${itinerary?.shareId}`;
    const text = encodeURIComponent(
      `Check out my AI-generated travel itinerary for ${itinerary?.destination}! 🚀\n${shareUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <Layout>
        <div className="py-20 flex flex-col items-center justify-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          <p className="text-gray-500 font-medium animate-pulse">Assembling your itinerary...</p>
        </div>
      </Layout>
    );
  }

  if (error || !itinerary) {
    return (
      <Layout>
        <div className="max-w-md mx-auto py-12 text-center space-y-6">
          <div className="p-4 bg-rose-50 text-rose-700 rounded-2xl border border-rose-100 flex items-start space-x-3 text-sm">
            <AlertCircle className="h-5 w-5 text-rose-500 shrink-0" />
            <span>{error || "Itinerary not found."}</span>
          </div>
          <Link
            to="/dashboard"
            className="inline-flex items-center text-sm font-bold text-indigo-600 hover:text-indigo-500"
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </Layout>
    );
  }

  const { destination, startDate, endDate, generatedItinerary, extractedData } = itinerary;

  // Visual gradients representing trip destinations
  const gradientStyles = "from-indigo-600 via-purple-600 to-pink-500";

  return (
    <Layout>
      <div className="space-y-8 font-sans">
        {/* Back Link & Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 no-print">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-gray-700 transition"
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-bold bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 transition shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="mr-1.5 h-4 w-4 text-emerald-500" />
                  <span className="text-emerald-600">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="mr-1.5 h-4 w-4" />
                  <span>Copy Share Link</span>
                </>
              )}
            </button>

            <button
              onClick={handleWhatsAppShare}
              className="inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-md shadow-emerald-100"
            >
              <Share2 className="mr-1.5 h-4 w-4" />
              <span>Share to WhatsApp</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-md shadow-indigo-100"
            >
              <Printer className="mr-1.5 h-4 w-4" />
              <span>Export PDF / Print</span>
            </button>
          </div>
        </div>

        {/* Hero Cover Banner */}
        <div className={`relative h-48 sm:h-64 rounded-3xl overflow-hidden bg-gradient-to-r ${gradientStyles} flex items-center p-6 md:p-10 shadow-lg text-white`}>
          <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[1px]" />
          <div className="relative z-10 space-y-2">
            <div className="flex items-center space-x-1.5 text-indigo-100 text-xs sm:text-sm font-bold uppercase tracking-widest">
              <Sparkles className="h-4 w-4" />
              <span>AI-Powered Itinerary</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
              {destination}
            </h1>
            <p className="text-sm sm:text-base text-indigo-100/90 font-medium">
              {formatDate(startDate)} — {formatDate(endDate)} ({generatedItinerary?.duration})
            </p>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Timeline Column */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Compass className="h-5.5 w-5.5 mr-2 text-indigo-600 animate-spin-slow" />
                <span>Day-Wise Plan</span>
              </h2>

              <div className="space-y-12 relative before:absolute before:inset-y-1 before:left-4 before:w-0.5 before:bg-gray-100">
                {generatedItinerary?.itinerary?.map((day, idx) => (
                  <div key={idx} className="relative pl-10 space-y-6">
                    {/* Circle timeline dot */}
                    <div className="absolute left-1.5 top-1.5 w-5 h-5 rounded-full border-4 border-white bg-indigo-600 shadow-md shadow-indigo-150" />

                    {/* Day Header */}
                    <div>
                      <span className="text-indigo-600 text-xs font-bold uppercase tracking-wider block">
                        Day {day.day}
                      </span>
                      <h3 className="text-lg md:text-xl font-bold text-gray-800">
                        {day.title}
                      </h3>
                    </div>

                    {/* Daily Activities Outline */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      {/* Morning */}
                      {day.activities.morning && (
                        <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2">
                          <div className="flex items-center space-x-1.5 text-amber-500">
                            <Coffee className="h-4 w-4" />
                            <span className="text-xs font-bold uppercase tracking-wider">Morning ({day.activities.morning.time})</span>
                          </div>
                          <h4 className="font-bold text-sm text-gray-800">{day.activities.morning.title}</h4>
                          <p className="text-xs text-gray-500 leading-relaxed">{day.activities.morning.description}</p>
                          <span className="inline-block text-[10px] bg-slate-200/50 px-2 py-0.5 rounded text-gray-500 font-semibold">{day.activities.morning.duration}</span>
                        </div>
                      )}

                      {/* Afternoon */}
                      {day.activities.afternoon && (
                        <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2">
                          <div className="flex items-center space-x-1.5 text-indigo-500">
                            <Sun className="h-4 w-4" />
                            <span className="text-xs font-bold uppercase tracking-wider">Afternoon ({day.activities.afternoon.time})</span>
                          </div>
                          <h4 className="font-bold text-sm text-gray-800">{day.activities.afternoon.title}</h4>
                          <p className="text-xs text-gray-500 leading-relaxed">{day.activities.afternoon.description}</p>
                          <span className="inline-block text-[10px] bg-slate-200/50 px-2 py-0.5 rounded text-gray-500 font-semibold">{day.activities.afternoon.duration}</span>
                        </div>
                      )}

                      {/* Evening */}
                      {day.activities.evening && (
                        <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2">
                          <div className="flex items-center space-x-1.5 text-purple-500">
                            <Moon className="h-4 w-4" />
                            <span className="text-xs font-bold uppercase tracking-wider">Evening ({day.activities.evening.time})</span>
                          </div>
                          <h4 className="font-bold text-sm text-gray-800">{day.activities.evening.title}</h4>
                          <p className="text-xs text-gray-500 leading-relaxed">{day.activities.evening.description}</p>
                          <span className="inline-block text-[10px] bg-slate-200/50 px-2 py-0.5 rounded text-gray-500 font-semibold">{day.activities.evening.duration}</span>
                        </div>
                      )}

                      {/* Dinner */}
                      {day.activities.dinner && (
                        <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2">
                          <div className="flex items-center space-x-1.5 text-rose-500">
                            <Utensils className="h-4 w-4" />
                            <span className="text-xs font-bold uppercase tracking-wider">Dinner ({day.activities.dinner.time})</span>
                          </div>
                          <h4 className="font-bold text-sm text-gray-800">{day.activities.dinner.title}</h4>
                          <p className="text-xs text-gray-500 leading-relaxed">{day.activities.dinner.description}</p>
                        </div>
                      )}
                    </div>

                    {/* Day Tip */}
                    {day.tips && (
                      <div className="p-3 bg-indigo-50/50 border border-indigo-100/50 rounded-xl text-xs text-indigo-700 leading-relaxed">
                        <strong className="font-bold text-indigo-900 block mb-0.5">💡 Day Tip</strong>
                        {day.tips}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar Column */}
          <div className="space-y-8 no-print">
            {/* Trip Summary Card */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6">
              <h3 className="font-bold text-lg text-gray-900 pb-3 border-b border-gray-100">
                Booking Reference details
              </h3>

              {/* Flights */}
              {extractedData?.flightDetails?.length > 0 && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Flight Confirmations</span>
                  {extractedData.flightDetails.map((f, i) => (
                    <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-150 text-xs text-gray-700 space-y-1.5">
                      <div className="flex justify-between font-bold text-gray-800">
                        <span>{f.airline}</span>
                        <span>{f.flightNumber}</span>
                      </div>
                      <div className="flex justify-between text-gray-500 font-semibold">
                        <span>{f.departureCity} ✈ {f.arrivalCity}</span>
                      </div>
                      <div className="text-[10px] text-gray-400">
                        Date: {f.departureDate} | {f.departureTime} - {f.arrivalTime}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Hotels */}
              {extractedData?.hotelDetails?.length > 0 && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Hotel Details</span>
                  {extractedData.hotelDetails.map((h, i) => (
                    <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-150 text-xs text-gray-700 space-y-1.5">
                      <p className="font-bold text-gray-800">{h.hotelName}</p>
                      <p className="text-gray-500 font-semibold">{h.address}</p>
                      <div className="text-[10px] text-gray-400">
                        Stay: {h.checkInDate} to {h.checkOutDate}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Other transport */}
              {extractedData?.transportDetails?.length > 0 && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Other Transport</span>
                  {extractedData.transportDetails.map((t, i) => (
                    <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-150 text-xs text-gray-700">
                      <strong className="font-bold text-gray-800 block mb-0.5">{t.type}</strong>
                      <p className="text-gray-500 font-semibold">{t.details}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Travel Recommendations & Tips */}
            <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white rounded-3xl p-6 space-y-6 shadow-md shadow-indigo-100">
              <h3 className="font-bold text-lg text-white pb-3 border-b border-indigo-800 flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-indigo-300" />
                <span>AI Travel Tips</span>
              </h3>

              {/* Travel Tips */}
              {generatedItinerary?.travelTips && (
                <div className="space-y-3 text-xs">
                  <span className="text-indigo-200/80 font-bold uppercase tracking-wider">General Tips</span>
                  <ul className="list-disc pl-4 space-y-2 text-indigo-100">
                    {generatedItinerary.travelTips.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Hidden Gems */}
              {generatedItinerary?.hiddenGems && (
                <div className="space-y-3 text-xs pt-4 border-t border-indigo-800">
                  <span className="text-indigo-200/80 font-bold uppercase tracking-wider">Hidden Gems</span>
                  <ul className="list-disc pl-4 space-y-2 text-indigo-100">
                    {generatedItinerary.hiddenGems.map((gem, i) => (
                      <li key={i}>{gem}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Local Cuisines */}
              {generatedItinerary?.foodRecommendations && (
                <div className="space-y-3 text-xs pt-4 border-t border-indigo-800">
                  <span className="text-indigo-200/80 font-bold uppercase tracking-wider">Food to Try</span>
                  <ul className="list-disc pl-4 space-y-2 text-indigo-100">
                    {generatedItinerary.foodRecommendations.map((food, i) => (
                      <li key={i}>{food}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ItineraryDetail;
