import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { 
  Compass, 
  Sparkles, 
  Calendar, 
  MapPin, 
  Copy, 
  Share2, 
  Printer, 
  Coffee, 
  Sun, 
  Moon, 
  Utensils, 
  Check, 
  AlertCircle,
  ArrowRight
} from "lucide-react";

function SharedItinerary() {
  const { shareId } = useParams();

  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchSharedItinerary = async () => {
      try {
        setLoading(true);
        // Note: we call the public endpoint directly via a standard axios request (doesn't need Bearer token)
        const res = await axios.get(`https://trip-ai-yiyj.onrender.com/api/itineraries/share/${shareId}`
);
        if (res.data.success) {
          setItinerary(res.data.itinerary);
        }
      } catch (err) {
        console.error(err);
        setError("This shared itinerary could not be found or has been deleted.");
      } finally {
        setLoading(false);
      }
    };

    fetchSharedItinerary();
  }, [shareId]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `Check out this AI-generated travel itinerary for ${itinerary?.destination}! 🚀\n${window.location.href}`
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-500 font-semibold animate-pulse">Loading shared travel plans...</p>
        </div>
      </div>
    );
  }

  if (error || !itinerary) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-6 font-sans">
        <div className="max-w-md w-full text-center space-y-6">
          <Link to="/" className="inline-flex items-center space-x-2 group justify-center">
            <div className="bg-indigo-600 p-2 rounded-xl text-white">
              <Compass className="h-6 w-6" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-gray-900">
              Trrip<span className="text-indigo-600 font-extrabold">AI</span>
            </span>
          </Link>

          <div className="p-5 bg-rose-50 text-rose-700 rounded-3xl border border-rose-100 flex items-start space-x-3 text-sm text-left">
            <AlertCircle className="h-5 w-5 text-rose-500 shrink-0" />
            <span>{error || "Itinerary not found."}</span>
          </div>

          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition"
          >
            Create Your Own Trip
          </Link>
        </div>
      </div>
    );
  }

  const { destination, startDate, endDate, generatedItinerary, extractedData } = itinerary;

  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-50 via-slate-50 to-indigo-50/20 flex flex-col font-sans">
      {/* Branding Header */}
      <header className="glass-panel sticky top-0 z-40 bg-white/80 border-b border-gray-150 py-3.5 px-4 sm:px-6 lg:px-8 no-print">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
              <Compass className="h-4.5 w-4.5" />
            </div>
            <span className="font-bold text-lg text-gray-900">
              Trrip<span className="text-indigo-600 font-extrabold">AI</span>
            </span>
          </Link>

          <Link
            to="/register"
            className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-md shadow-indigo-100"
          >
            <span>Create Your Itinerary</span>
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Action Bar */}
        <div className="flex justify-end items-center gap-2 no-print">
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-bold bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 transition shadow-sm"
          >
            {copied ? (
              <>
                <Check className="mr-1.5 h-4 w-4 text-emerald-500" />
                <span className="text-emerald-600">Copied Link!</span>
              </>
            ) : (
              <>
                <Copy className="mr-1.5 h-4 w-4" />
                <span>Copy Link</span>
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
            <span>Print / PDF</span>
          </button>
        </div>

        {/* Hero Cover Banner */}
        <div className="relative h-48 sm:h-64 rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 flex items-center p-6 md:p-10 shadow-lg text-white">
          <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[1px]" />
          <div className="relative z-10 space-y-2">
            <div className="flex items-center space-x-1.5 text-indigo-100 text-xs sm:text-sm font-bold uppercase tracking-widest">
              <Sparkles className="h-4 w-4" />
              <span>Shared Travel Plans</span>
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
            {/* Summary */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6">
              <h3 className="font-bold text-lg text-gray-900 pb-3 border-b border-gray-100">
                Booking references
              </h3>

              {/* Flights */}
              {extractedData?.flightDetails?.length > 0 && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Flights</span>
                  {extractedData.flightDetails.map((f, i) => (
                    <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-150 text-xs text-gray-700 space-y-1">
                      <div className="flex justify-between font-bold text-gray-850">
                        <span>{f.airline}</span>
                        <span>{f.flightNumber}</span>
                      </div>
                      <div className="text-gray-500">{f.departureCity} to {f.arrivalCity}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Hotels */}
              {extractedData?.hotelDetails?.length > 0 && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Hotels</span>
                  {extractedData.hotelDetails.map((h, i) => (
                    <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-150 text-xs text-gray-700">
                      <p className="font-bold text-gray-850">{h.hotelName}</p>
                      <p className="text-gray-500 mt-0.5">{h.address}</p>
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
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-150 py-6 text-center text-sm text-gray-500 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Trrip AI. Generated automatically with Artificial Intelligence.</p>
        </div>
      </footer>
    </div>
  );
}

export default SharedItinerary;
