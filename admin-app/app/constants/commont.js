// module.exports = {
//   CATEGORY_OPTIONS: [
//     "WEDDING",
//     "PORTRAIT",
//     "EVENT",
//     "FASHION",
//     "COMMERCIAL",
//     "LANDSCAPE",
//     "OTHER",
//   ],
// };
const SERVICE_DETAILS = {
  PORTRAIT: [
    {
      name: "Individual portrait",
      code: "INDIVIDUAL_PORTRAIT",
      price: 310000,
      description:
        "A personalized portrait session capturing your unique personality and style.",
    },
    {
      name: "Family portrait",
      code: "FAMILY_PORTRAIT",
      price: 500000,
      description:
        "A beautiful family portrait session to cherish your loved ones.",
    },
    {
      name: "Baby & Kids portrait",
      code: "BABY_KIDS_PORTRAIT",
      price: 754000,
      description:
        "Capturing the innocence and joy of your little ones in a playful setting.",
    },
    {
      name: "Graduation portrait",
      code: "GRADUATION_PORTRAIT",
      price: 754000,
      description:
        "Celebrate your academic achievements with a stunning graduation portrait.",
    },
    {
      name: "Professional headshots",
      code: "PROFESSIONAL_HEADSHOTS",
      price: 420000,
      description:
        "Make a lasting impression with a professional headshot that showcases your personality.",
    },
  ],
  WEDDING: [
    {
      name: "Pre-wedding photoshoot",
      code: "PRE_WEDDING_PHOTOSHOOT",
      description:
        "Capture the love and excitement leading up to your big day with a pre-wedding photoshoot.",
      price: 1500000,
    },
    {
      name: "Engagement photoshoot",
      code: "ENGAGEMENT_PHOTOSHOOT",
      description: "Celebrate your love with a stunning engagement photoshoot.",
      price: 1200000,
    },
    {
      name: "Wedding day documentary",
      description:
        "A comprehensive coverage of your wedding day, capturing every special moment.",
      code: "WEDDING_DAY_DOCUMENTARY",
      price: 2500000,
    },
    {
      name: "Reception / Party coverage",
      description:
        "Capture the joy and excitement of your wedding reception or party with our professional coverage.",
      code: "RECEPTION_PARTY_COVERAGE",
      price: 1800000,
    },
    {
      name: "Wedding album design & printing",
      description:
        "Create a beautiful keepsake of your wedding day with our custom album design and printing services.",
      code: "WEDDING_ALBUM_PRINTING",
      price: 2000000,
    },
  ],
  FASHION: [
    {
      name: "Lookbook photoshoot",
      description:
        "Showcase your fashion collection with a professional lookbook photoshoot.",
      code: "LOOKBOOK_PHOTOSHOOT",
      price: 2000000,
    },
    {
      name: "Editorial shoot",
      code: "EDITORIAL_SHOOT",
      price: 5000000,
      description:
        "Create stunning editorial images for magazines, websites, or portfolios with our expert photography services.",
    },
    {
      name: "Model portfolio",
      code: "MODEL_PORTFOLIO",
      price: 1500000,
      description:
        "Build a strong model portfolio with a variety of high-quality images showcasing your versatility and style.",
    },
    {
      name: "E-commerce fashion product shoot",
      description:
        "Highlight your fashion products with professional e-commerce photography that captures every detail.",
      code: "ECOMMERCE_FASHION_PRODUCT_SHOOT",
      price: 1200000,
    },
  ],
  COMMERCIAL: [
    {
      name: "Product photography",
      description:
        "Showcase your products with stunning product photography that highlights their features.",
      code: "PRODUCT_PHOTOGRAPHY",
      price: 1000000,
    },
    {
      name: "Food photography",
      description:
        "Capture the deliciousness of your culinary creations with our professional food photography.",
      code: "FOOD_PHOTOGRAPHY",
      price: 800000,
    },
    {
      name: "Brand campaign photoshoot",
      description:
        "Create a cohesive and visually striking brand identity with our expert campaign photoshoot services.",
      code: "BRAND_CAMPAIGN_PHOTOSHOOT",
      price: 3000000,
    },
    {
      name: "Corporate photography",
      description:
        "Professional corporate photography services for business profiles, events, and marketing materials.",
      code: "CORPORATE_PHOTOGRAPHY",
      price: 1800000,
    },
  ],
  EVENT: [
    {
      name: "Corporate events",
      code: "CORPORATE_EVENTS",
      price: 2000000,
      description:
        "Professional coverage of corporate events, conferences, and seminars to capture key moments and networking opportunities.",
    },
    {
      name: "Concerts & Festivals",
      description:
        "Dynamic photography services for concerts, music festivals, and live performances to capture the energy and excitement of the event.",
      code: "CONCERTS_FESTIVALS",
      price: 3500000,
    },
    {
      name: "Private parties",
      description:
        "Intimate and personalized photography services for private parties and gatherings.",
      code: "PRIVATE_PARTIES",
      price: 1500000,
    },
    {
      name: "Launching events",
      description:
        "Comprehensive coverage of product launches and promotional events to showcase your brand.",
      code: "LAUNCHING_EVENTS",
      price: 2200000,
    },
    {
      name: "On-site printing",
      description:
        "Instant on-site printing services to provide guests with memorable keepsakes from your event.",
      code: "ON_SITE_PRINTING",
      price: 250000,
    },
  ],
  LANDSCAPE: [
    {
      name: "Destination photoshoot",
      description:
        "Capture the beauty of your chosen location with a stunning destination photoshoot.",
      code: "DESTINATION_PHOTOSHOOT",
      price: 1800000,
    },
    {
      name: "Resort & Hotel photography",
      description:
        "Showcase the elegance and amenities of your resort or hotel with professional photography.",
      code: "RESORT_HOTEL_PHOTOGRAPHY",
      price: 2200000,
    },
    {
      name: "Tourism promotion campaign",
      description:
        "Promote your tourism business with captivating images that highlight the unique attractions and experiences you offer.",
      code: "TOURISM_PROMOTION_CAMPAIGN",
      price: 3500000,
    },
  ],
  ARCHITECTURE: [
    {
      name: "Real estate photography",
      description:
        "Capture the essence of properties with stunning real estate photography.",
      code: "REAL_ESTATE_PHOTOGRAPHY",
      price: 1200000,
    },
    {
      name: "Interior design portfolio",
      description:
        "Showcase your interior design projects with a professional portfolio that highlights your style and creativity.",
      code: "INTERIOR_DESIGN_PORTFOLIO",
      price: 1500000,
    },
    {
      name: "Architectural showcase",
      description:
        "Highlight the beauty and innovation of architectural designs with expert photography services.",
      code: "ARCHITECTURAL_SHOWCASE",
      price: 2000000,
    },
  ],
  STREET: [
    {
      name: "Lifestyle photoshoot",
      description:
        "Capture candid moments and the essence of everyday life with our lifestyle photoshoot services.",
      code: "LIFESTYLE_PHOTOSHOOT",
      price: 900000,
    },
    {
      name: "Cultural documentation",
      description:
        "Document and celebrate the richness of diverse cultures through our cultural photography services.",
      code: "CULTURAL_DOCUMENTATION",
      price: 1400000,
    },
    {
      name: "NGO / Charity event coverage",
      description:
        "Professional coverage of NGO and charity events to raise awareness and support for important causes.",
      code: "NGO_CHARITY_EVENT_COVERAGE",
      price: 1600000,
    },
  ],
  DOCUMENTARY: [
    {
      name: "Photo essay project",
      description:
        "Create a compelling visual narrative with our photo essay project services.",
      code: "PHOTO_ESSAY_PROJECT",
      price: 1800000,
    },
    {
      name: "Social issue documentation",
      description:
        "Document and raise awareness about social issues through powerful photography.",
      code: "SOCIAL_ISSUE_DOCUMENTATION",
      price: 2200000,
    },
  ],
  FINEART: [
    {
      name: "Creative concept photoshoot",
      description:
        "Bring your artistic vision to life with a creative concept photoshoot tailored to your ideas.",
      code: "CREATIVE_CONCEPT_PHOTOSHOOT",
      price: 2000000,
    },
    {
      name: "Exhibition prints",
      description:
        "High-quality prints for art exhibitions, showcasing your work in the best light.",
      code: "EXHIBITION_PRINTS",
      price: 2500000,
    },
  ],
  MACRO: [
    {
      name: "Floral close-up photography",
      description:
        "Capture the intricate details of flowers with our floral close-up photography services.",
      code: "FLORAL_CLOSEUP_PHOTOGRAPHY",
      price: 600000,
    },
    {
      name: "Insect / Wildlife macro",
      description:
        "Explore the fascinating world of insects and wildlife up close with our macro photography services.",
      code: "INSECT_WILDLIFE_MACRO",
      code: "INSECT_WILDLIFE_MACRO",
      price: 900000,
    },
  ],
  SPORTS: [
    {
      name: "Sports event coverage",
      description:
        "Capture the excitement and intensity of sports events with our professional photography services.",
      code: "SPORTS_EVENT_COVERAGE",
      price: 2500000,
    },
    {
      name: "Athlete portfolio",
      description:
        "Showcase your skills and achievements with a stunning athlete portfolio.",
      code: "ATHLETE_PORTFOLIO",
      price: 1500000,
    },
  ],
  WILDLIFE: [
    {
      name: "Wildlife safari coverage",
      description:
        "Experience the thrill of a wildlife safari with our expert photography services.",
      code: "WILDLIFE_SAFARI_COVERAGE",
      price: 3500000,
    },
    {
      name: "Nature conservation photography",
      description:
        "Support conservation efforts with powerful images that highlight the beauty and importance of wildlife and natural habitats.",
      code: "NATURE_CONSERVATION_PHOTOGRAPHY",
      price: 2800000,
    },
  ],
  ASTRO: [
    {
      name: "Milky Way photoshoot",
      description:
        "Capture the beauty of the Milky Way with our specialized astrophotography services.",
      code: "MILKY_WAY_PHOTOSHOOT",
      price: 1500000,
    },
    {
      name: "Deep sky astrophotography",
      description:
        "Explore the wonders of the universe with our deep sky astrophotography services, capturing stunning images of distant galaxies and nebulae.",
      code: "DEEP_SKY_ASTROPHOTOGRAPHY",
      price: 2500000,
    },
  ],
  UNDERWATER: [
    {
      name: "Scuba diving photoshoot",
      description:
        "Capture the vibrant underwater world with our professional scuba diving photoshoot services.",
      code: "SCUBA_DIVING_PHOTOSHOOT",
      price: 2000000,
    },
    {
      name: "Marine life photography",
      description:
        "Explore the beauty of marine life with our specialized underwater photography services.",
      code: "MARINE_LIFE_PHOTOGRAPHY",
      price: 2800000,
    },
  ],
  DRONE: [
    {
      name: "Aerial landscape photography",
      description:
        "Capture stunning aerial views of landscapes with our professional drone photography services.",
      code: "AERIAL_LANDSCAPE_PHOTOGRAPHY",
      price: 1200000,
    },
    {
      name: "Real estate aerial package",
      description:
        "Showcase properties from above with our real estate aerial photography package.",
      code: "REAL_ESTATE_AERIAL_PACKAGE",
      price: 1500000,
    },
    {
      name: "Event aerial coverage",
      description:
        "Capture the excitement of your event from above with our drone aerial coverage services.",
      code: "EVENT_AERIAL_COVERAGE",
      code: "EVENT_AERIAL_COVERAGE",
      price: 2000000,
    },
  ],
};
const SPECIALITY_SERVICES = [
  { name: "Portrait Photography", code: "PORTRAIT" },
  { name: "Wedding Photography", code: "WEDDING" },
  { name: "Fashion Photography", code: "FASHION" },
  { name: "Commercial / Advertising Photography", code: "COMMERCIAL" },
  { name: "Event Photography", code: "EVENT" },
  { name: "Landscape Photography", code: "LANDSCAPE" },
  { name: "Architectural & Interior Photography", code: "ARCHITECTURE" },
  { name: "Street Photography", code: "STREET" },
  { name: "Documentary Photography", code: "DOCUMENTARY" },
  { name: "Fine Art Photography", code: "FINEART" },
  { name: "Macro Photography", code: "MACRO" },
  { name: "Sports Photography", code: "SPORTS" },
  { name: "Wildlife Photography", code: "WILDLIFE" },
  { name: "Astrophotography", code: "ASTRO" },
  { name: "Underwater Photography", code: "UNDERWATER" },
  { name: "Drone Photography", code: "DRONE" },
];
const TIME_SLOTS = {
  morning: ["09:00 - 11:00", "09:30 - 11:30", "10:00 - 12:00"],
  afternoon: [
    "13:00 - 15:00",
    "13:30 - 15:30",
    "14:00 - 16:00",
    "14:30 - 16:30",
    "15:00 - 17:00",
  ],
  evening: [
    "16:00 - 18:00",
    "16:30 - 18:30",
    "17:00 - 19:00",
    "17:30 - 19:30",
    "18:00 - 20:00",
  ],
};
const DISCOUNT_PERCENTAGE = 5; // 5% discount for bookings over 5 million VND
module.exports = {
  SERVICE_DETAILS,
  SPECIALITY_SERVICES,
  TIME_SLOTS,
  DISCOUNT_PERCENTAGE,
};
