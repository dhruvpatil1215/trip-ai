const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

// Check if Gemini API is configured
const isGeminiConfigured = () => {
  const key = process.env.GEMINI_API_KEY;
  return key && key.trim() !== "" && !key.includes("<") && !key.includes("YOUR_API_KEY");
};

// Helper to convert local file to Gemini inline data part
const fileToGenerativePart = (filePath, mimeType) => {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(filePath)).toString("base64"),
      mimeType,
    },
  };
};

/**
 * Extracts structured travel data from a file (PDF or Image) using Gemini API
 */
const extractTravelData = async (filePath, fileType, originalName) => {
  console.log(`Extracting data for ${originalName} (MIME: ${fileType}) using Gemini. Configured: ${isGeminiConfigured()}`);

  if (!isGeminiConfigured()) {
    console.warn("Gemini API key not configured. Using fallback mock extraction.");
    return getMockExtractedData(originalName);
  }

  const prompt = `
    You are an expert travel assistant. Analyze the uploaded travel booking document (could be a flight ticket, hotel confirmation, train ticket, bus voucher, or package booking). 
    Extract all relevant details and return them strictly in JSON format.
    If a detail is missing or not applicable, set it to an empty string or empty array.
    
    Respond only with a JSON object following this schema:
    {
      "destination": "Name of the main city/country destination",
      "startDate": "YYYY-MM-DD (format of start date of booking)",
      "endDate": "YYYY-MM-DD (format of end date of booking, or check-out date, or arrival date)",
      "flightDetails": [
        {
          "airline": "Airline name",
          "flightNumber": "Flight number",
          "departureCity": "City name",
          "arrivalCity": "City name",
          "departureDate": "YYYY-MM-DD",
          "departureTime": "HH:MM",
          "arrivalTime": "HH:MM"
        }
      ],
      "hotelDetails": [
        {
          "hotelName": "Hotel name",
          "checkInDate": "YYYY-MM-DD",
          "checkOutDate": "YYYY-MM-DD",
          "address": "Full hotel address"
        }
      ],
      "transportDetails": [
        {
          "type": "Train, Bus, Rental Car, or Ferry",
          "details": "Full description of transport, including provider, times, and booking reference"
        }
      ]
    }
  `;

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    // Send both PDFs and Images natively as base64 inline to Gemini vision model
    const filePart = fileToGenerativePart(filePath, fileType);
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [filePart, { text: prompt }]
        }
      ],
      generationConfig: { responseMimeType: "application/json" }
    });
    
    let resultText = result.response.text();
    console.log("Raw Gemini extraction response:", resultText);
    return JSON.parse(resultText);
  } catch (error) {
    console.error("Gemini Extraction Error:", error.message);
    return getMockExtractedData(originalName);
  }
};

/**
 * Generates a full day-wise itinerary based on extracted travel data using Gemini API
 */
const generateItineraryPlan = async (extractedData) => {
  const destination = extractedData.destination || "Unknown Destination";
  console.log(`Generating itinerary for ${destination} using Gemini. Configured: ${isGeminiConfigured()}`);

  if (!isGeminiConfigured()) {
    console.warn("Gemini API key not configured. Using fallback mock itinerary generator.");
    return getMockItinerary(destination, extractedData.startDate, extractedData.endDate);
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are an expert travel itinerary planner. Create a premium, detailed, day-by-day travel itinerary for a trip to "${destination}" based on the following extracted booking data:
      
      ${JSON.stringify(extractedData, null, 2)}

      Calculate the duration of the trip (in days) using the startDate (${extractedData.startDate}) and endDate (${extractedData.endDate}). Ensure you plan activities for every single day of the trip.
      
      Make the itinerary exciting, realistic, and tailored to the destination. For each day, provide logical timing details for activities.
      
      Respond only with a JSON object following this schema:
      {
        "destination": "${destination}",
        "startDate": "${extractedData.startDate}",
        "endDate": "${extractedData.endDate}",
        "duration": "X Days",
        "summary": "A captivating description summarizing this trip (1-2 sentences).",
        "itinerary": [
          {
            "day": 1,
            "title": "Theme or headline of the day",
            "activities": {
              "morning": {
                "time": "HH:MM",
                "title": "Morning activity title",
                "description": "Detailed description of what to do, where to go, and why it is interesting.",
                "duration": "Estimated duration (e.g. 2 hours)"
              },
              "afternoon": {
                "time": "HH:MM",
                "title": "Afternoon activity title",
                "description": "Detailed description of afternoon sights, travels, or explorations.",
                "duration": "Estimated duration"
              },
              "evening": {
                "time": "HH:MM",
                "title": "Evening activity title",
                "description": "Detailed description of sunset points, light strolls, or night tours.",
                "duration": "Estimated duration"
              },
              "dinner": {
                "time": "HH:MM",
                "title": "Dinner suggestion",
                "description": "Specific food recommendations or restaurant types to try for dinner.",
                "duration": "Estimated duration"
              }
            },
            "tips": "Helpful day-specific travel tip or clothing/pricing note"
          }
        ],
        "travelTips": [
          "General travel tip 1",
          "General travel tip 2",
          "General travel tip 3"
        ],
        "hiddenGems": [
          "Unique less-known local experience or hidden gem spot 1",
          "Unique less-known local experience or hidden gem spot 2"
        ],
        "foodRecommendations": [
          "Famous local dish or drink 1 and where to try it",
          "Famous local dish or drink 2 and where to try it"
        ]
      }
    `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" }
    });

    const text = result.response.text();
    console.log("Raw Gemini itinerary response:", text);
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Itinerary Generation Error:", error.message);
    return getMockItinerary(destination, extractedData.startDate, extractedData.endDate);
  }
};

// ==========================================
// FALLBACK MOCK DATA GENERATORS (UNCHANGED)
// ==========================================

const getMockExtractedData = (fileName) => {
  const nameLower = fileName.toLowerCase();
  
  let destination = "Paris, France";
  let startDate = "2026-07-15";
  let endDate = "2026-07-20";
  let hotelName = "Hotel Pullman Paris Tour Eiffel";
  let hotelAddress = "18 Avenue De Suffren, 75015 Paris, France";
  let airline = "Air France";
  let flightNumber = "AF015";

  if (nameLower.includes("tokyo") || nameLower.includes("japan")) {
    destination = "Tokyo, Japan";
    startDate = "2026-10-10";
    endDate = "2026-10-15";
    hotelName = "Shinjuku Granbell Hotel";
    hotelAddress = "2-14-5 Kabukicho, Shinjuku, Tokyo 160-0021";
    airline = "Japan Airlines";
    flightNumber = "JL006";
  } else if (nameLower.includes("bali") || nameLower.includes("indonesia")) {
    destination = "Bali, Indonesia";
    startDate = "2026-09-01";
    endDate = "2026-09-07";
    hotelName = "Maya Ubud Resort & Spa";
    hotelAddress = "Jl. Raya Ubud, Ubud, Kabupaten Gianyar, Bali 80571";
    airline = "Singapore Airlines";
    flightNumber = "SQ938";
  } else if (nameLower.includes("london") || nameLower.includes("uk")) {
    destination = "London, United Kingdom";
    startDate = "2026-12-20";
    endDate = "2026-12-25";
    hotelName = "The Ned London";
    hotelAddress = "27 Poultry, London EC2R 8AJ";
    airline = "British Airways";
    flightNumber = "BA112";
  }

  return {
    destination,
    startDate,
    endDate,
    flightDetails: [
      {
        airline,
        flightNumber,
        departureCity: "New York (JFK)",
        arrivalCity: destination.split(",")[0],
        departureDate: startDate,
        departureTime: "18:45",
        arrivalTime: "08:15"
      }
    ],
    hotelDetails: [
      {
        hotelName,
        checkInDate: startDate,
        checkOutDate: endDate,
        address: hotelAddress
      }
    ],
    transportDetails: [
      {
        type: "Airport Express",
        details: "Direct train line from the international arrival terminal to the city center."
      }
    ]
  };
};

const getMockItinerary = (destination, startDate, endDate) => {
  const start = new Date(startDate || "2026-07-15");
  const end = new Date(endDate || "2026-07-20");
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 5;

  const destName = destination.split(",")[0].trim();

  let dayPlans = [];
  let tips = [];
  let gems = [];
  let foods = [];
  let summary = "";

  if (destName === "Tokyo") {
    summary = "A mesmerizing exploration of Tokyo, blending ultra-modern neon-lit skyscrapers with ancient temples and rich culinary heritage.";
    tips = [
      "Buy a Suica or Pasmo IC card at the airport for seamless train travel.",
      "Cash is still king in many traditional shops; keep Japanese Yen handy.",
      "Remember that trash cans are rare in public; carry a small bag to store trash."
    ];
    gems = [
      "Stroll through Yanaka Ginza, a nostalgic neighborhood showing Tokyo's older Shitamachi vibe.",
      "Visit Todoroki Valley, a secret wooded ravine right inside the metropolis."
    ];
    foods = [
      "Fresh sushi at the outer Tsukiji Market.",
      "Tonkotsu Ramen in a private booth at Ichiran Shinjuku.",
      "Takoyaki (octopus balls) at Gindaco in Harajuku."
    ];

    dayPlans = [
      {
        day: 1,
        title: "Neon & Skyscrapers of Shinjuku",
        activities: {
          morning: { time: "09:00", title: "Arrival & Hotel Drop-off", description: "Land at Narita/Haneda Airport, check into your Shinjuku hotel, and grab a quick vending machine coffee.", duration: "2 hours" },
          afternoon: { time: "13:00", title: "Metropolitan Government Building", description: "Head to the observatory floor for a stunning bird's-eye view of Tokyo's sprawling skyline. If clear, you might spot Mount Fuji.", duration: "1.5 hours" },
          evening: { time: "17:00", title: "Kabukicho & Omoide Yokocho", description: "Explore the bustling entertainment district of Kabukicho and grab pictures under the glowing red gate, then stroll through the narrow alleys of Omoide Yokocho.", duration: "3 hours" },
          dinner: { time: "20:00", title: "Yakitori Alley Dining", description: "Eat fresh, grilled chicken skewers in a cozy, atmospheric alley stall while interacting with friendly locals.", duration: "2 hours" }
        },
        tips: "Omoide Yokocho stalls are small (often only seating 5-8 people); be respectful and order quickly."
      },
      {
        day: 2,
        title: "Temples & Tradition in Asakusa",
        activities: {
          morning: { time: "09:00", title: "Senso-ji Temple Visit", description: "Visit Tokyo's oldest Buddhist temple. Walk through the Kaminarimon gate and explore Nakamise-dori street shopping.", duration: "2.5 hours" },
          afternoon: { time: "13:00", title: "Sumida Park Cruise", description: "Take a beautiful scenic cruise down the Sumida River toward Odaiba, enjoying views of modern architecture and bridges.", duration: "2 hours" },
          evening: { time: "17:30", title: "Odaiba Seaside Park", description: "Watch the sunset behind Tokyo's Rainbow Bridge and take a selfie with the miniature Statue of Liberty.", duration: "2.5 hours" },
          dinner: { time: "19:30", title: "Monjayaki Dinner", description: "Dine at an interactive hotplate restaurant in Tsukishima to cook and enjoy Tokyo's signature Monjayaki pancake.", duration: "2 hours" }
        },
        tips: "Buy traditional snacks like Senbei (rice crackers) or Ningyo-yaki cakes along the temple market path."
      }
    ];
  } else if (destName === "Bali") {
    summary = "A serene escape to Bali, focusing on natural terraced hills, rich artistic cultures, beachside sunsets, and spiritual landmarks.";
    tips = [
      "Rent a scooter to easily navigate narrow Ubud streets, but wear a helmet.",
      "Dress respectfully (covering shoulders and knees) when visiting local temples.",
      "Stay hydrated with fresh coconut water and carry organic insect repellent."
    ];
    gems = [
      "Take a refreshing swim in Nungnung Waterfall, avoiding the crowded Tegenungan crowds.",
      "Visit the serene Tirta Gangga Water Palace in East Bali early in the morning."
    ];
    foods = [
      "Babi Guling (Balinese spit-roasted pig) at Warung Ibu Oka.",
      "Nasi Campur (rice with mixed Indonesian sides) in a local beachfront warung."
    ];

    dayPlans = [
      {
        day: 1,
        title: "Ubud Culture & Sacred Forests",
        activities: {
          morning: { time: "08:30", title: "Sacred Monkey Forest Sanctuary", description: "Walk through the giant banyan trees and watch hundreds of playful Balinese long-tailed monkeys in their natural habitat.", duration: "2 hours" },
          afternoon: { time: "12:00", title: "Campuhan Ridge Walk", description: "Hike the lush green ridge trail flanked by beautiful valley rivers, and stop at a scenic jungle cafe.", duration: "2 hours" },
          evening: { time: "16:00", title: "Ubud Palace & Art Market", description: "Browse handwoven bags, paintings, and wooden carvings at the traditional market, then see the palace architecture.", duration: "2.5 hours" },
          dinner: { time: "19:00", title: "Organic Garden Dining at Sari Organik", description: "Dine in open-air bamboo structures overlooking organic rice paddies, tasting local Balinese spices.", duration: "2 hours" }
        },
        tips: "Avoid wearing loose sunglasses or dangling jewelry when visiting the Monkey Forest."
      },
      {
        day: 2,
        title: "Jungle Swings & Water Temples",
        activities: {
          morning: { time: "08:00", title: "Tegalalang Rice Terraces", description: "Walk down the green terraced rice fields of Ubud and take photos on the famous high-altitude jungle swing.", duration: "2.5 hours" },
          afternoon: { time: "12:30", title: "Tirta Empul Holy Springs", description: "Visit the sacred water temple and witness locals and travelers undergoing spiritual purification rituals in natural spring pools.", duration: "2 hours" },
          evening: { time: "16:00", title: "Kanto Lampo Waterfall", description: "Descend into a scenic canyon to view the cascading tiered water wall and cool off with a swim.", duration: "2 hours" },
          dinner: { time: "19:00", title: "Crispy Duck Feast", description: "Savor the local specialty Bebek Bengil (crispy duck) served with traditional sambal paste.", duration: "2 hours" }
        },
        tips: "Sarongs are available at Tirta Empul; renting one is mandatory to enter the temple gates."
      }
    ];
  } else {
    summary = `A beautiful getaway to ${destName}, filled with historical monuments, local culinary secrets, and relaxing neighborhood walks.`;
    tips = [
      "Wear comfortable walking shoes; exploring on foot is the best way to see the city.",
      "Download a offline city transit map for easy route checking.",
      "Check museums in advance as many require reservation timeslots."
    ];
    gems = [
      "Stroll through quiet residential gardens off the main tourist track.",
      "Find cozy neighborhood bistros that do not have English menus on the window."
    ];
    foods = [
      "Traditional buttery pastries from a neighborhood bakery.",
      "Freshly brewed local coffee paired with local cheeses."
    ];

    dayPlans = [
      {
        day: 1,
        title: "Arrival & Exploring Neighborhoods",
        activities: {
          morning: { time: "09:00", title: "Arrival & Cozy Café Check-in", description: "Check into your accommodations, find a nearby traditional bakery, and enjoy a warm coffee and croissant.", duration: "2 hours" },
          afternoon: { time: "13:00", title: "Historic District Stroll", description: "Take a walking tour of the historic quarter, viewing historic houses, art studios, and beautiful town plazas.", duration: "3 hours" },
          evening: { time: "17:00", title: "Riverfront Sunset Walk", description: "Walk along the banks of the river, watching the historic bridges light up as the sun starts to set.", duration: "2 hours" },
          dinner: { time: "19:30", title: "Traditional Bistro Dinner", description: "Settle into a local corner restaurant and order a classic regional dish paired with local wine.", duration: "2 hours" }
        },
        tips: "Always say hello ('Bonjour' or equivalent local greeting) when walking into cafes."
      },
      {
        day: 2,
        title: "Art, History & Views",
        activities: {
          morning: { time: "09:00", title: "World-Class Museum Tour", description: "Explore the rooms of a famous local museum, viewing masterpieces of art and sculpture.", duration: "3 hours" },
          afternoon: { time: "13:30", title: "Park Picnic & Garden Stroll", description: "Buy fresh cheese, bread, and fruits from a local street market and enjoy a picnic lunch in the central park.", duration: "2 hours" },
          evening: { time: "16:30", title: "Panoramic Viewpoint Climb", description: "Climb up to a prominent hill or architectural view deck to witness the city layout at sunset.", duration: "2.5 hours" },
          dinner: { time: "20:00", title: "Cozy Neighborhood Dinner", description: "Enjoy a leisurely dinner featuring slow-cooked meats and seasonal desserts.", duration: "2 hours" }
        },
        tips: "Book museum tickets online beforehand to skip long queues."
      }
    ];
  }

  for (let i = 3; i <= diffDays; i++) {
    dayPlans.push({
      day: i,
      title: `Day ${i}: Hidden Gems & Leisurely Discoveries`,
      activities: {
        morning: { time: "09:30", title: "Local Market Exploration", description: `Explore a traditional open-air morning market in ${destName}. Taste fresh fruits, cheeses, or street snacks and observe local life.`, duration: "2 hours" },
        afternoon: { time: "13:00", title: "Artisanal Neighborhood Tour", description: "Spend the afternoon exploring narrow winding lanes filled with local boutique designers, antique shops, and independent bookstores.", duration: "3.5 hours" },
        evening: { time: "18:00", title: "Sunset Skyline Lounge", description: "Find a premium rooftop café or panoramic sky terrace to enjoy a refreshing local beverage with views over the rooftops.", duration: "2 hours" },
        dinner: { time: "20:00", title: "Grand Finale Dining", description: "Celebrate the final evening of the trip with a tasting menu at an acclaimed local restaurant specializing in modern cuisine.", duration: "2 hours" }
      },
      tips: "Reserve final dinner tables at least a few days in advance."
    });
  }

  return {
    destination,
    startDate,
    endDate,
    duration: `${diffDays} Days`,
    summary,
    itinerary: dayPlans,
    travelTips: tips,
    hiddenGems: gems,
    foodRecommendations: foods
  };
};

module.exports = {
  extractTravelData,
  generateItineraryPlan,
};
