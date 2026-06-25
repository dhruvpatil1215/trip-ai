import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import API from "../services/api";
import { UploadCloud, File, AlertCircle, Compass, HelpCircle, ArrowRight } from "lucide-react";

function UploadBooking() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState("");

  const steps = [
    "Uploading travel voucher securely...",
    "Gemini Vision reading document text...",
    "Extracting check-in times and flight routes...",
    "Generating day-wise itinerary suggestions...",
  ];

  // Cycle loading messages to look highly premium and dynamic
  const startLoadingAnimation = () => {
    setLoadingStep(0);
    const interval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 4500);
    return interval;
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    setError("");
    const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
    
    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Unsupported file format. Please upload PDF, JPG, JPEG, or PNG.");
      setFile(null);
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File is too large. Maximum size allowed is 10MB.");
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select or drop a file to upload.");
      return;
    }

    setLoading(true);
    setError("");
    const loadingInterval = startLoadingAnimation();

    try {
      // 1. Upload & Extract details
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await API.post("/uploads", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!uploadRes.data.success) {
        throw new Error("Failed to process document");
      }

      const { extractedData } = uploadRes.data;

      // 2. Generate final day-wise itinerary
      const itineraryRes = await API.post("/itineraries", { extractedData });

      if (itineraryRes.data.success) {
        clearInterval(loadingInterval);
        const itineraryId = itineraryRes.data.itinerary._id;
        navigate(`/itinerary/${itineraryId}`);
      }
    } catch (err) {
      console.error(err);
      clearInterval(loadingInterval);
      setError(
        err.response?.data?.message || 
        "AI processing failed. Please ensure the document is clear and matches flight or hotel confirmations."
      );
      setLoading(false);
    }
  };

  const docTypes = [
    { type: "Flight Tickets", desc: "Boarding passes & invoice printouts" },
    { type: "Hotel Bookings", desc: "Check-in confirmations & vouchers" },
    { type: "Train & Bus Passes", desc: "Local booking slips & tickets" },
    { type: "Travel Packages", desc: "Consolidated travel tour documents" },
  ];

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-8 font-sans">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
            Upload Travel Booking
          </h1>
          <p className="text-gray-500 font-medium">
            Upload travel tickets or confirmations to instantly map out your day-by-day vacation plan.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-start space-x-3 text-rose-700 text-sm animate-fadeIn">
            <AlertCircle className="h-5 w-5 text-rose-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          /* Premium Loading Screen */
          <div className="bg-white rounded-3xl border border-gray-100 shadow-md p-10 text-center space-y-8 py-20 flex flex-col items-center">
            <div className="relative h-20 w-20">
              {/* Spinning loading circles */}
              <div className="absolute inset-0 rounded-full border-4 border-indigo-100"></div>
              <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
              <div className="absolute inset-4 rounded-full bg-indigo-50 flex items-center justify-center">
                <Compass className="h-6 w-6 text-indigo-600 animate-pulse-subtle" />
              </div>
            </div>

            <div className="space-y-3 max-w-sm">
              <h3 className="font-extrabold text-xl text-gray-900">Processing Your Itinerary</h3>
              <p className="text-sm font-semibold text-indigo-600 transition-all duration-300 animate-pulse">
                {steps[loadingStep]}
              </p>
              <p className="text-xs text-gray-400">
                This might take a minute as our AI models analyze the text layout.
              </p>
            </div>

            {/* Visual Step Tracker */}
            <div className="flex items-center space-x-2 pt-6">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === loadingStep
                      ? "w-8 bg-indigo-600"
                      : index < loadingStep
                      ? "w-2 bg-indigo-200"
                      : "w-2 bg-gray-100"
                  }`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Drag & Drop Card */}
            <div
              className={`bg-white rounded-3xl border-2 border-dashed transition-all p-8 md:p-12 text-center relative ${
                dragActive
                  ? "border-indigo-500 bg-indigo-50/20"
                  : "border-gray-200 hover:border-indigo-400"
              }`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="file-upload-input"
                className="hidden"
                accept=".pdf, image/jpeg, image/jpg, image/png"
                onChange={handleChange}
              />

              <div className="flex flex-col items-center">
                <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600 mb-6">
                  <UploadCloud className="h-8 w-8" />
                </div>

                {file ? (
                  <div className="space-y-2 mb-6">
                    <p className="font-bold text-lg text-gray-900">Ready to extract</p>
                    <div className="inline-flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-gray-700 font-semibold max-w-[320px] truncate">
                      <File className="h-4.5 w-4.5 text-indigo-600 shrink-0" />
                      <span>{file.name}</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="font-extrabold text-xl text-gray-900 mb-2">
                      Drag and drop travel documents
                    </h3>
                    <p className="text-sm text-gray-400 mb-6 max-w-sm">
                      Upload flight confirmations, hotel receipts, or passes in PDF, JPG, PNG, or JPEG format (Max 10MB).
                    </p>
                  </>
                )}

                <label
                  htmlFor="file-upload-input"
                  className="inline-flex items-center justify-center px-5 py-3 rounded-xl text-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition cursor-pointer mb-2"
                >
                  Select File From Device
                </label>
              </div>
            </div>

            {/* Doc Types Assist Grid */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                <HelpCircle className="h-4 w-4 mr-2 text-indigo-600" />
                <span>Supported Booking Document Formats</span>
              </h4>
              <div className="grid sm:grid-cols-2 gap-4">
                {docTypes.map((doc, idx) => (
                  <div key={idx} className="flex space-x-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="h-2 w-2 rounded-full bg-indigo-500 mt-2 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-gray-800">{doc.type}</p>
                      <p className="text-xs text-gray-500">{doc.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Launch Action */}
            <button
              onClick={handleUpload}
              disabled={!file}
              className={`w-full py-4 rounded-2xl text-base font-bold text-white shadow-lg transition-all ${
                file
                  ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100 hover:translate-y-[-1px]"
                  : "bg-gray-300 shadow-none cursor-not-allowed"
              }`}
            >
              Analyze & Generate Itinerary
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default UploadBooking;
