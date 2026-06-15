export type Trainer = {
  name: string;
  specialty: string;
  location: string;
  rating: number;
  sessions: number;
  price: number; // ETB per session
  tags: string[];
  initials: string;
  accent: string;
  image: string;
};

export const trainers: Trainer[] = [
  {
    name: "Selam Bekele",
    specialty: "Strength & Conditioning",
    location: "Addis Ababa",
    rating: 4.9,
    sessions: 320,
    price: 700,
    tags: ["Strength", "Weight loss"],
    initials: "SB",
    accent: "#7c5cff",
    image: "/images/trainer-selam.jpg",
  },
  {
    name: "Dawit Girma",
    specialty: "Functional Training",
    location: "Bole, Addis Ababa",
    rating: 4.8,
    sessions: 210,
    price: 600,
    tags: ["Mobility", "Athletic"],
    initials: "DG",
    accent: "#cdff4a",
    image: "/images/trainer-dawit.jpg",
  },
  {
    name: "Hanna Tesfaye",
    specialty: "Yoga & Nutrition",
    location: "Addis Ababa",
    rating: 5.0,
    sessions: 415,
    price: 550,
    tags: ["Yoga", "Nutrition"],
    initials: "HT",
    accent: "#b8a4ff",
    image: "/images/trainer-hanna.jpg",
  },
  {
    name: "Yonas Alemu",
    specialty: "Bodybuilding Coach",
    location: "Piassa, Addis Ababa",
    rating: 4.9,
    sessions: 280,
    price: 800,
    tags: ["Hypertrophy", "Prep"],
    initials: "YA",
    accent: "#7c5cff",
    image: "/images/trainer-yonas.jpg",
  },
];

export const stats = [
  { value: 500, suffix: "+", label: "Certified trainers" },
  { value: 12, suffix: "K+", label: "Sessions booked" },
  { value: 8, suffix: "", label: "Cities in Ethiopia" },
  { value: 4.9, decimals: 1, suffix: "", label: "Average rating" },
];

export const steps = [
  {
    no: "01",
    title: "Discover your match",
    body: "Filter by goal, specialty, location, price, and rating. Our smart match surfaces the trainers who fit you best.",
  },
  {
    no: "02",
    title: "Book in seconds",
    body: "See real-time availability, pick a slot, and confirm. No back-and-forth, no double bookings — ever.",
  },
  {
    no: "03",
    title: "Train & transform",
    body: "Get custom workout and nutrition plans, track your progress, and pay securely with Telebirr or CBE.",
  },
];

export const features = [
  {
    title: "Smart trainer matching",
    body: "A compatibility score ranks trainers by your goals, budget, and schedule — not just alphabetically.",
    icon: "sparkles",
  },
  {
    title: "Verified professionals",
    body: "Every trainer is manually vetted. Certifications and IDs are checked before a Verified badge appears.",
    icon: "shield",
  },
  {
    title: "Progress tracking",
    body: "Log weight, body-fat, and photos. Watch your trends plot on beautiful timeline charts.",
    icon: "chart",
  },
  {
    title: "Secure Ethiopian payments",
    body: "Pay with Telebirr, CBE Birr, or card via Chapa. Funds are held safely until your session is done.",
    icon: "wallet",
  },
  {
    title: "Custom plans",
    body: "Trainers build your workout and nutrition programs and push them straight to your dashboard.",
    icon: "clipboard",
  },
  {
    title: "In-app messaging",
    body: "Chat with your trainer, share voice notes, and get booking updates in real time.",
    icon: "chat",
  },
];

export const testimonials = [
  {
    quote:
      "I found a strength coach 10 minutes from my gym in Bole. Booking took seconds and I've lost 8kg in three months.",
    name: "Meron A.",
    role: "Trainee, Addis Ababa",
  },
  {
    quote:
      "CoachBridge doubled my client base. The verified badge builds instant trust and payments just work.",
    name: "Yonas A.",
    role: "Bodybuilding Coach",
  },
  {
    quote:
      "The progress charts keep me accountable. Seeing the line go up every week is addictive.",
    name: "Kalkidan T.",
    role: "Trainee, Adama",
  },
];

export const pricing = [
  {
    name: "Free",
    price: "0",
    cadence: "forever",
    tagline: "Explore and find your coach.",
    features: [
      "Browse all trainers",
      "Smart match previews",
      "In-app messaging",
      "Book up to 2 sessions/mo",
    ],
    cta: "Get started",
    featured: false,
  },
  {
    name: "Pro",
    price: "499",
    cadence: "per month",
    tagline: "For trainees who are serious.",
    features: [
      "Unlimited bookings",
      "Full progress tracking",
      "Custom workout & nutrition plans",
      "Priority smart matching",
      "Session reminders",
    ],
    cta: "Start Pro",
    featured: true,
  },
  {
    name: "Trainer",
    price: "0",
    cadence: "+ commission",
    tagline: "Grow your coaching business.",
    features: [
      "Professional profile & badge",
      "Availability & booking tools",
      "Client progress dashboard",
      "Secure payouts to Telebirr/CBE",
    ],
    cta: "Apply as trainer",
    featured: false,
  },
];
