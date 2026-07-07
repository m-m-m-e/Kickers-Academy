export type HomeSectionKey =
  | "hero"
  | "about"
  | "programs"
  | "newsEvents"
  | "merchandise"
  | "gallery"
  | "actions";

export type ImageContentItem = {
  id: string;
  title: string;
  description: string;
  image: string;
  listItems?: string[];
  itemIcons?: string[];
  displayType?: "paragraph" | "accordion" | "grid" | "row" | "callout" | "iconList";
  summary?: string;
  slug?: string;
  kind?: "news" | "event";
  article?: string;
  occurrenceDate?: string;
  pinned?: boolean;
};

export type HeroSlide = ImageContentItem;

export type HomeContentState = {
  heroSlides: HeroSlide[];
  aboutItems: ImageContentItem[];
  aboutSections: ImageContentItem[];
  aboutCoaches: AboutCoach[];
  programsHero: ImageContentItem;
  programsProgressionPath: ProgramsProgressionPathContent;
  storeHero: ImageContentItem;
  joinPage: JoinPageContent;
  joinRegistrations: JoinRegistration[];
  contactPage: ContactPageContent;
  contactSubmissions: ContactSubmission[];
  feedbackSubmissions: FeedbackSubmission[];
  donatePage: DonatePageContent;
  engageSubmissions: EngageSubmission[];
  engageConnectionRequests: EngageConnectionRequest[];
  supportSubmissions: SupportSubmission[];
  notificationSettings: NotificationSettings;
  footerContent: FooterContent;
  programGroups: ProgramGroup[];
  newsEventsHero: ImageContentItem;
  galleryHero: ImageContentItem;
  galleryCategories: GalleryCategory[];
  storeCategories: StoreCategory[];
  programItems: ImageContentItem[];
  newsItems: ImageContentItem[];
  merchandiseItems: ImageContentItem[];
  galleryItems: ImageContentItem[];
  actionCards: ImageContentItem[];
  storeOrders: StoreOrder[];
};

export type FooterLinkItem = {
  id: string;
  label: string;
  href: string;
};

export type FooterIconItem = {
  id: string;
  label: string;
  href: string;
  icon: "tiktok" | "facebook" | "instagram" | "youtube" | "whatsapp" | "email";
};

export type FooterBadgeItem = {
  id: string;
  label: string;
  href: string;
};

export type FooterBrandItem = {
  id: string;
  label: string;
  href: string;
  kind: "sponsor" | "partner";
  badgeImage: string;
  description: string;
  location: string;
  contactEmail: string;
  contactPhone: string;
  services: string[];
  galleryImages: string[];
  socials: FooterIconItem[];
};

export type FooterContent = {
  brandName: string;
  badgeLabel: string;
  badgeImage: string;
  description: string;
  location: string;
  email: string;
  whatsapp: string;
  phone: string;
  links: FooterLinkItem[];
  socials: FooterIconItem[];
  footerBrands: FooterBrandItem[];
};

export type JoinPageContent = {
  hero: ImageContentItem;
  processTitle: string;
  processDescription: string;
  processSteps: string[];
  emailSubject: string;
  emailTitle: string;
  emailIntro: string;
  emailProgramNote: string;
  emailTrainingGroundNote: string;
  emailKitNote: string;
  emailSignOff: string;
  requirements: string[];
  requiredInformation: string[];
  formTitle: string;
  formDescription: string;
  submitLabel: string;
  photoConsentDocumentName: string;
  photoConsentDocumentDescription: string;
  photoConsentDocumentUrl: string;
};

export type JoinRegistrationStatus = "pending" | "approved" | "rejected" | "deleted";
export type PhotoPublicationConsent = "accepted" | "denied";

export type JoinRegistration = {
  id: string;
  playerName: string;
  dateOfBirth: string;
  guardianName: string;
  guardianEmail: string;
  guardianPhone: string;
  emergencyContact: string;
  address: string;
  residence: string;
  medicalInformation: string;
  consent: boolean;
  photoPublicationConsent: PhotoPublicationConsent;
  status: JoinRegistrationStatus;
  submittedAt: string;
  reviewedAt?: string;
  adminNote?: string;
  whatsappConfirmedAt?: string;
  emailConfirmedAt?: string;
};

export type ContactSocialLink = {
  id: string;
  name: string;
  handle: string;
  href: string;
  icon: "tiktok" | "facebook" | "instagram" | "youtube";
};

export type ContactDetailLink = {
  id: string;
  label: string;
  value: string;
  href: string;
};

export type ContactPageContent = {
  hero: ImageContentItem;
  socials: ContactSocialLink[];
  contacts: ContactDetailLink[];
  formTitle: string;
  formDescription: string;
  submitLabel: string;
  mapTitle: string;
  mapLink: string;
  mapQuery: string;
  mapImage: string;
};

export type ContactSubmissionStatus = "new" | "read" | "archived";

export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: ContactSubmissionStatus;
  submittedAt: string;
  adminNote?: string;
};

export type FeedbackSubmissionStatus = "pending" | "approved" | "rejected";

export type FeedbackSubmission = {
  id: string;
  name: string;
  message: string;
  rating: number;
  status: FeedbackSubmissionStatus;
  submittedAt: string;
  reviewedAt?: string;
  adminNote?: string;
};

export type NotificationSettings = {
  toneUrl: string;
  toneName: string;
  soundEnabled: boolean;
};

export type DonateSupportWay = {
  id: string;
  title: string;
  description: string;
  accent: string;
};

export type DonateGratitudeCard = {
  id: string;
  name: string;
  title: string;
  description: string;
  image: string;
};

export type EngagePathwayCard = {
  id: string;
  title: string;
  description: string;
};

export type EngageSubmissionStatus = "new" | "contacted" | "approved" | "archived";

export type EngageSubmission = {
  id: string;
  name: string;
  email: string;
  phone: string;
  engagementType: string;
  occupation: string;
  skills: string;
  message: string;
  status: EngageSubmissionStatus;
  submittedAt: string;
  adminNote?: string;
};

export type EngageConnectionRequestStatus = "new" | "contacted" | "connected" | "archived";

export type EngageConnectionRequest = {
  id: string;
  targetSubmissionId: string;
  targetOccupation: string;
  targetEngagementType: string;
  requesterName: string;
  requesterEmail: string;
  requesterPhone: string;
  reason: string;
  status: EngageConnectionRequestStatus;
  submittedAt: string;
  adminNote?: string;
};

export type SupportSubmissionStatus = "new" | "contacted" | "fulfilled" | "archived";

export type SupportSubmission = {
  id: string;
  name: string;
  email: string;
  phone: string;
  supportType: string;
  supportDetails: string;
  preferredPaymentStream: string;
  amount: string;
  status: SupportSubmissionStatus;
  submittedAt: string;
  adminNote?: string;
};

export type DonatePageContent = {
  hero: ImageContentItem;
  engageIntroTitle: string;
  engageIntroDescription: string;
  engagePathways: EngagePathwayCard[];
  supportWays: DonateSupportWay[];
  impactPoints: string[];
  gratitudeCards: DonateGratitudeCard[];
  supportMessageTitle: string;
  supportMessageDescription: string;
  goodToKnowTitle: string;
  goodToKnowDescription: string;
  formTitle: string;
  formDescription: string;
  submitLabel: string;
};

export type StoreProduct = {
  id: string;
  title: string;
  description: string;
  image: string;
  price: string;
  customizationPrice: string;
  nameOnlyPrice: string;
  numberOnlyPrice: string;
  nameAndNumberPrice: string;
  featured: boolean;
  colorOptions: string[];
  sizeOptions: string[];
  supportsNumber: boolean;
  supportsName: boolean;
  supportsCustomMade: boolean;
};

export type StoreCategory = {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  featured: boolean;
  products: StoreProduct[];
};

export type StoreOrderStatus = "new" | "contacted" | "confirmed" | "processing" | "ready" | "completed" | "cancelled";

export type StoreOrderItem = {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  basePrice: string;
  customizationPrice: string;
  unitPrice: string;
  lineTotal: string;
  color: string;
  size: string;
  quantity: number;
  name: string;
  number: string;
  customMade: boolean;
};

export type StoreOrder = {
  id: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  deliveryPreference: string;
  notes: string;
  items: StoreOrderItem[];
  status: StoreOrderStatus;
  submittedAt: string;
  adminNote?: string;
};

export type GalleryMediaItem = {
  id: string;
  title: string;
  description: string;
  mediaType: "image" | "video";
  src: string;
  thumbnail: string;
};

export type GalleryCategory = {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  featured: boolean;
  items: GalleryMediaItem[];
};

export type ProgramSubSection = {
  id: string;
  title: string;
  description: string;
};

export type ProgramMediaItem = {
  id: string;
  title: string;
  description: string;
  mediaType: "image" | "video";
  src: string;
  thumbnail: string;
};

export type AboutCoach = {
  id: string;
  name: string;
  program: string;
  philosophy: string;
  philosophyPoints?: string[];
  philosophyIcons?: string[];
  image: string;
};

export type ProgramGroup = {
  id: string;
  slug: string;
  ageGroup: string;
  title: string;
  description: string;
  image: string;
  featured: boolean;
  subSections: ProgramSubSection[];
  mediaItems: ProgramMediaItem[];
};

export type ProgressionPathStage = {
  id: string;
  title: string;
  description: string;
};

export type ProgramsProgressionPathContent = {
  eyebrow: string;
  title: string;
  description: string;
  heroImage: string;
  teaserImage: string;
  teaserEyebrow: string;
  teaserTitle: string;
  teaserDescription: string;
  teaserButtonLabel: string;
  teaserPanelEyebrow: string;
  teaserPanelTitle: string;
  teaserPanelDescription: string;
  teaserCheckpoints: string[];
  ageTitle: string;
  ageDescription: string;
  footballTitle: string;
  footballDescription: string;
  stages: ProgressionPathStage[];
};

const makeItem = (id: string, title: string, description: string, image: string): ImageContentItem => ({
  id,
  title,
  description,
  image
});

const defaultProgressionStages: ProgressionPathStage[] = [
  {
    id: "foundation",
    title: "Foundation",
    description:
      "The first stage is not about pressure. It is where the player learns rhythm, balance, listening, movement, courage, and the feeling that football is a place they belong."
  },
  {
    id: "passion",
    title: "Passion",
    description:
      "Passion is when training stops feeling like attendance and starts becoming hunger. The player wants the ball, wants the next session, and begins carrying the game inside them."
  },
  {
    id: "ball-work",
    title: "Ball Work",
    description:
      "The ball becomes a daily language. Passing, receiving, dribbling, turning, shooting, and first touch are repeated until the player starts moving with more calm."
  },
  {
    id: "ball-mastery",
    title: "Ball Mastery",
    description:
      "Mastery is where control appears under pressure. The player can change direction, use both feet, protect the ball, escape tight spaces, and play with confidence."
  },
  {
    id: "discovery",
    title: "Discovery",
    description:
      "This is where the player and coach begin to see the truth: natural position, personality, decision speed, physical profile, leadership, creativity, and the role that fits."
  },
  {
    id: "technical-growth",
    title: "Technical Growth",
    description:
      "Technique becomes sharper and more useful. The player does not only perform actions; they learn when to use them and how to repeat them in real match situations."
  },
  {
    id: "tactical-growth",
    title: "Tactical Growth",
    description:
      "The game opens up. Space, timing, support angles, pressing, transitions, defending, attacking shape, and team responsibility begin to make sense."
  },
  {
    id: "mental-growth",
    title: "Mental Growth",
    description:
      "A stronger player learns patience, discipline, focus, resilience, confidence, and emotional control. They learn to keep playing even when the match becomes difficult."
  },
  {
    id: "game-understanding",
    title: "Game Understanding",
    description:
      "The final layer is reading football. The player starts seeing what is coming next, making better choices, and understanding how their action affects the whole team."
  }
];

export const defaultHomeContent: HomeContentState = {
  heroSlides: [
    makeItem(
      "hero-1",
      "Match Day Pride",
      "A powerful football identity that leads the opening experience.",
      "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=1400&q=80"
    ),
    makeItem(
      "hero-2",
      "Supporters United",
      "The team, the fans, and the energy that drives the club forward.",
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1400&q=80"
    ),
    makeItem(
      "hero-3",
      "Built for Victory",
      "A bold, cinematic platform for football storytelling and merchandise.",
      "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=1400&q=80"
    )
  ],
  aboutItems: [
    makeItem(
      "about-1",
      "About Us",
      "We are a football team driven by passion, discipline, unity, and ambition. Our story is about more than football. It is about the supporters, the community, the culture, and the shared belief that the team can grow into something powerful and unforgettable. We play with heart, we build with purpose, and we invite every supporter to be part of the journey.",
      "https://images.unsplash.com/photo-1527277561026-1d1a9f0e0b0f?auto=format&fit=crop&w=1400&q=80"
    )
  ],
  aboutSections: [
    makeItem(
      "about-us",
      "About Us",
      "We are a football team built on ambition, unity, discipline, and pride. Our identity is shaped by the supporters who stand behind us, the culture we protect, and the standards we carry into every match and every season.",
      "https://images.unsplash.com/photo-1527277561026-1d1a9f0e0b0f?auto=format&fit=crop&w=1400&q=80"
    ),
    makeItem(
      "mission",
      "Mission",
      "Our mission is to grow a strong football institution that develops talent, inspires supporters, serves the community, and competes with courage and professionalism.",
      "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=1400&q=80"
    ),
    makeItem(
      "vision",
      "Vision",
      "We aim to become a respected team known for excellence, identity, and lasting impact both on and off the pitch.",
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1400&q=80"
    ),
    makeItem(
      "core-values",
      "Core Values",
      "These are the standards that guide how we train, speak, and work together as a club.",
      "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=1400&q=80"
    )
      ,
    {
      ...makeItem(
        "core-values",
        "Core Values",
        "These are the standards that guide how we train, speak, and work together as a club.",
        "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=1400&q=80"
      ),
      listItems: ["Respect", "Discipline", "Unity", "Commitment", "Hard Work", "Accountability"],
      displayType: "grid",
      itemIcons: ["🤝", "💪", "🙌", "🎯", "⚡", "✅"]
    },
    makeItem(
      "parent-partnerships",
      "Partnerships With Parents",
      "We value strong relationships with parents because growth is stronger when families, coaches, and the club move in the same direction.",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80"
    ),
    makeItem(
      "leadership-philosophy",
      "Our Leadership Philosophy",
      "Leadership at the club means setting the tone through example, communication, consistency, and service to the team and community.",
      "https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=1400&q=80"
    ),
    {
      ...makeItem(
        "why-choose-us",
        "Why Choose Us",
        "We offer a football environment where identity, development, support, and ambition work together to create a meaningful club experience.",
        "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1400&q=80"
      ),
      listItems: [
        "A clear player development pathway",
        "Supportive coaches who teach with purpose",
        "A club culture that values families and community",
        "Standards that prepare players for the next level"
      ],
      displayType: "row",
      itemIcons: ["🛤️", "👨‍🏫", "🏘️", "📈"]
    },
    {
      ...makeItem(
        "coaching-philosophy",
        "Our Coaching Philosophy",
        "Our coaching approach focuses on discipline, player growth, smart football decisions, teamwork, and a deep respect for the game.",
        "https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?auto=format&fit=crop&w=1400&q=80"
      ),
      listItems: [
        "Discipline comes before display",
        "Players learn through repetition and game-like decisions",
        "Every session should build confidence and responsibility",
        "Respect for the game and for one another stays central"
      ],
      displayType: "iconList",
      itemIcons: ["🎯", "📚", "🌟", "🤝"]
    }
  ],
  aboutCoaches: [
    {
      id: "coach-development",
      name: "Development Coach",
      program: "Foundation and Ball Mastery",
      philosophy:
        "Every player needs a place where confidence can grow before pressure arrives. My work is to build brave touches, strong habits, and love for the game.",
      philosophyPoints: ["Build confidence first", "Strengthen basic technique", "Make training enjoyable and focused"],
      philosophyIcons: ["🌟", "💡", "😊"],
      image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "coach-performance",
      name: "Performance Coach",
      program: "Technical and Tactical Growth",
      philosophy:
        "Football development is about helping players understand the game, make better decisions, and carry discipline into every training session and match.",
      philosophyPoints: ["Teach decision making", "Connect technique to real matches", "Keep standards high and consistent"],
      philosophyIcons: ["🧠", "⚽", "📊"],
      image: "https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=1200&q=80"
    }
  ],
  programsHero: makeItem(
    "programs-hero",
    "Development Pathway",
    "Our programs are built to guide players from development to performance across every stage of the journey.",
    "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=1600&q=80"
  ),
  programsProgressionPath: {
    eyebrow: "Programs / Progression Path",
    title: "The player grows twice.",
    description:
      "One journey is visible: Under 7, Under 9, Under 11, Under 13, Under 15, Under 17. The other journey is deeper: the football mind, the touch, the discipline, the position, the confidence, and the understanding.",
    heroImage: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=1600&q=80",
    teaserImage: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=1600&q=80",
    teaserEyebrow: "Progression Path",
    teaserTitle: "The player grows twice.",
    teaserDescription:
      "Age moves a player from Under 7 toward Under 17. Football growth moves inside the player: confidence, touch, discipline, position, decisions, and understanding of the game.",
    teaserButtonLabel: "Open Progression Path",
    teaserPanelEyebrow: "Inside the module",
    teaserPanelTitle: "The adventure road map",
    teaserPanelDescription:
      "The dedicated progression path explains why every age group matters and how the player grows beyond age.",
    teaserCheckpoints: defaultProgressionStages.slice(0, 6).map((stage) => stage.title),
    ageTitle: "The visible ladder",
    ageDescription:
      "Age groups protect the journey. An Under 7 player does not skip the road and become Under 17 overnight. Each stage adds more intensity, more responsibility, more teamwork, and a bigger football challenge.",
    footballTitle: "The adventure road map",
    footballDescription:
      "Football growth is not measured only by birthdays. It is seen in a cleaner first touch, a braver decision, a player finding their position, a stronger mind, and a deeper understanding of what the game is asking.",
    stages: defaultProgressionStages
  },
  storeHero: makeItem(
    "store-hero",
    "Official Store",
    "A classic club store with jerseys, full kits, track pants, and hoodies presented in a gallery-style collection.",
    "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1600&q=80"
  ),
  joinPage: {
    hero: makeItem(
      "join-hero",
      "Start Your Journey",
      "Begin your football journey with the team and let us guide the player through development, discipline, and growth.",
      "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=1600&q=80"
    ),
    requirements: [
      "Age between 5 and 17.",
      "Enthusiasm and willingness to learn.",
      "Commitment to attend training sessions.",
      "Parent or guardian consent."
    ],
    processTitle: "How registration approval works",
    processDescription:
      "Submitting the form begins the registration review. A player is only officially registered after the academy team verifies the details and confirms the place through WhatsApp and email.",
    processSteps: [
      "The parent or guardian submits the registration form with the player's details.",
      "The admin team reviews the age, contact information, medical notes, and available program fit.",
      "If everything is clear, the admin approves the application in the portal.",
      "The family receives confirmation through WhatsApp and email using the academy contacts shown in the footer."
    ],
    emailSubject: "Registration confirmed for {playerName}",
    emailTitle: "Welcome to Kickers Academy",
    emailIntro:
      "Your registration has been reviewed and approved successfully. We are excited to welcome the player into the academy family.",
    emailProgramNote:
      "The program below is selected automatically from the player's date of birth and the academy age-group pathway.",
    emailTrainingGroundNote:
      "Training ground details are shown below. Our team will contact you with the exact reporting time, session group, and first-day guidance.",
    emailKitNote:
      "Jerseys and training kit details will be shared after confirmation. The academy team will guide you on available sizes, collection, and any kit requirements before the player begins training.",
    emailSignOff: "Regards,\nKickers Academy",
    requiredInformation: [
      "Player's full name.",
      "Date of birth.",
      "Parent or guardian full name.",
      "Parent or guardian email.",
      "Parent or guardian contact information.",
      "Emergency contact information.",
      "Address, if available.",
      "Place of residence.",
      "Medical information, if any."
    ],
    formTitle: "Fill in the details",
    formDescription: "Please complete the form below so we can review the player and contact the family with the next steps.",
    submitLabel: "Submit Registration",
    photoConsentDocumentName: "Photo & Video Publication Consent",
    photoConsentDocumentDescription:
      "Read the academy photo/video publication consent before choosing whether to allow or deny official academy publication.",
    photoConsentDocumentUrl: ""
  },
  joinRegistrations: [],
  contactPage: {
    hero: makeItem(
      "contact-hero",
      "Stay Connected",
      "Reach the club through social media, email, WhatsApp, phone, or visit the training location on the map.",
      "https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=1600&q=80"
    ),
    socials: [
      { id: "contact-tiktok", name: "TikTok", handle: "@kickersacademy", href: "#", icon: "tiktok" },
      { id: "contact-facebook", name: "Facebook", handle: "/kickersacademy", href: "#", icon: "facebook" },
      { id: "contact-instagram", name: "Instagram", handle: "@kickersacademy", href: "#", icon: "instagram" },
      { id: "contact-youtube", name: "YouTube", handle: "/@kickersacademy", href: "#", icon: "youtube" }
    ],
    contacts: [
      { id: "contact-email", label: "Email", value: "info@kickersacademy.com", href: "mailto:info@kickersacademy.com" },
      { id: "contact-phone", label: "Phone", value: "+000 000 000", href: "tel:+000000000" },
      { id: "contact-whatsapp", label: "WhatsApp", value: "+000 000 000", href: "https://wa.me/000000000" }
    ],
    formTitle: "Send us a message",
    formDescription: "Use the form below to ask a question, request information, or get in touch with the team.",
    submitLabel: "Send Message",
    mapTitle: "Find the training ground",
    mapLink: "",
    mapQuery: "football training ground",
    mapImage: ""
  },
  contactSubmissions: [],
  feedbackSubmissions: [],
  donatePage: {
    hero: makeItem(
      "donate-hero",
      "Engage With Kickers Academy",
      "A place for parents, community members, sponsors, partners, volunteers, and supporters to connect their skills, resources, and opportunities with the academy.",
      "https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&w=1600&q=80"
    ),
    engageIntroTitle: "An academy connected to its people",
    engageIntroDescription:
      "Engage is where football meets community. Parents, professionals, businesses, sponsors, volunteers, and supporters can share what they do and discover how we can build value together.",
    engagePathways: [
      {
        id: "engage-parent-skills",
        title: "Parents & Skills Network",
        description: "Parents can share their occupation, skills, or professional services so the academy can connect support, mentorship, and opportunities."
      },
      {
        id: "engage-community",
        title: "Community Partnerships",
        description: "Schools, clinics, businesses, churches, gyms, and community groups can collaborate with the academy on meaningful local impact."
      },
      {
        id: "engage-sponsors",
        title: "Sponsors & Partners",
        description: "Companies and partners can support programs, kits, tournaments, travel, equipment, and long-term player development."
      },
      {
        id: "engage-volunteers",
        title: "Volunteer & Mentor",
        description: "Support training days, match days, media, logistics, tutoring, first aid, mentorship, or player welfare."
      }
    ],
    supportWays: [
      { id: "support-equipment", title: "Training Equipment", description: "Support balls, jerseys, cones, spacemarks, bibs, ladders, and other equipment that improves daily training.", accent: "from-red-400/25" },
      { id: "support-player", title: "Support a Player", description: "Help a player access training, kit, transport, registration, meals, or academy opportunities.", accent: "from-white/15" },
      { id: "support-away", title: "Support an Away Game Day", description: "Cover travel, accommodation, meals, and match-day needs for away tournaments and fixtures.", accent: "from-white/10" },
      { id: "support-partner", title: "Become a Sponsor", description: "Partner with the team and be part of the club's long-term growth story.", accent: "from-red-600/25" },
      { id: "support-direct", title: "Direct Financial Support", description: "Help us meet urgent needs and keep the team moving forward.", accent: "from-white/12" }
    ],
    impactPoints: [
      "More children can play with the right kit and equipment.",
      "Training sessions become safer, better, and more consistent.",
      "Away tournaments become possible for more players.",
      "Sponsors help build a stronger football future for the club."
    ],
    gratitudeCards: [
      {
        id: "gratitude-1",
        name: "Community Sponsor",
        title: "Thank You for Standing With Us",
        description: "Your support has helped us provide the team with better equipment and stronger preparation.",
        image: "https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=1400&q=80"
      },
      {
        id: "gratitude-2",
        name: "Club Partner",
        title: "Your Support Matters",
        description: "We are grateful for your contribution toward match-day needs, travel, and youth development.",
        image: "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=1400&q=80"
      },
      {
        id: "gratitude-3",
        name: "Family Donor",
        title: "Thank You for Your Generosity",
        description: "Your kindness helps players feel supported, equipped, and ready to represent the club.",
        image: "https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&w=1400&q=80"
      },
      {
        id: "gratitude-4",
        name: "Away Trip Sponsor",
        title: "You Help Us Travel Further",
        description: "Your sponsorship makes away competitions and new experiences possible for our players.",
        image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1400&q=80"
      }
    ],
    supportMessageTitle: "Support us willingly",
    supportMessageDescription:
      "Every contribution goes directly toward helping the club grow, helping players stay equipped, and creating more opportunities for football development. If you are a business, community leader, parent, or supporter, your partnership matters to us.",
    goodToKnowTitle: "Good to know",
    goodToKnowDescription:
      "We welcome one-time help, monthly support, in-kind donations, and long-term sponsorships. We can also discuss custom sponsorship packages for matches, tournaments, and club programs.",
    formTitle: "Tell us how you want to engage",
    formDescription: "Use the form below to share your occupation, skills, organization, or support idea so we can connect with you intentionally.",
    submitLabel: "Send Engage Message"
  },
  engageSubmissions: [],
  engageConnectionRequests: [],
  supportSubmissions: [],
  notificationSettings: {
    toneUrl: "",
    toneName: "",
    soundEnabled: true
  },
  footerContent: {
    brandName: "Kickers Academy",
    badgeLabel: "Official Team",
    badgeImage: "",
    description: "A cinematic football academy platform for supporters, news, programs, merchandise, and community impact.",
    location: "Training Grounds, Kickers City",
    email: "info@kickersacademy.com",
    whatsapp: "+000 000 000",
    phone: "+000 000 000",
    links: [
      { id: "footer-home", label: "Home", href: "/" },
      { id: "footer-about", label: "About", href: "/about" },
      { id: "footer-programs", label: "Programs", href: "/programs" },
      { id: "footer-store", label: "Store", href: "/store" },
      { id: "footer-contact", label: "Contact", href: "/contact" },
      { id: "footer-donate", label: "Engage", href: "/engage" }
    ],
    socials: [
      { id: "footer-tiktok", label: "TikTok", href: "#", icon: "tiktok" },
      { id: "footer-facebook", label: "Facebook", href: "#", icon: "facebook" },
      { id: "footer-instagram", label: "Instagram", href: "#", icon: "instagram" },
      { id: "footer-youtube", label: "YouTube", href: "#", icon: "youtube" },
      { id: "footer-whatsapp", label: "WhatsApp", href: "https://wa.me/000000000", icon: "whatsapp" },
      { id: "footer-email", label: "Email", href: "mailto:info@kickersacademy.com", icon: "email" }
    ],
    footerBrands: [
      {
        id: "nexus-gym",
        label: "Nexus Gym",
        href: "#",
        kind: "partner",
        badgeImage: "",
        location: "Nexus Gym training facility",
        contactEmail: "",
        contactPhone: "",
        description:
          "Nexus Gym partners with Kickers Academy by supporting player fitness, strength, conditioning, discipline, and healthier football development.",
        services: [
          "Strength and conditioning",
          "Fitness assessment",
          "Endurance and stamina training",
          "Mobility and flexibility work",
          "Injury prevention support",
          "Player discipline and gym culture"
        ],
        galleryImages: [
          "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1400&q=80",
          "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1400&q=80",
          "https://images.unsplash.com/photo-1571019613914-85f342c6a11e?auto=format&fit=crop&w=1400&q=80"
        ],
        socials: [
          { id: "nexus-instagram", label: "Instagram", href: "#", icon: "instagram" },
          { id: "nexus-facebook", label: "Facebook", href: "#", icon: "facebook" },
          { id: "nexus-whatsapp", label: "WhatsApp", href: "#", icon: "whatsapp" }
        ]
      },
      {
        id: "footer-brand-1",
        label: "Sponsor A",
        href: "#",
        kind: "sponsor",
        badgeImage: "",
        location: "",
        contactEmail: "",
        contactPhone: "",
        description: "A community sponsor supporting the academy journey.",
        services: [],
        galleryImages: [],
        socials: [
          { id: "sponsor-a-instagram", label: "Instagram", href: "#", icon: "instagram" },
          { id: "sponsor-a-facebook", label: "Facebook", href: "#", icon: "facebook" }
        ]
      },
      {
        id: "footer-brand-2",
        label: "Partner A",
        href: "#",
        kind: "partner",
        badgeImage: "",
        location: "",
        contactEmail: "",
        contactPhone: "",
        description: "A partner connected to the academy community.",
        services: [],
        galleryImages: [],
        socials: [
          { id: "partner-a-instagram", label: "Instagram", href: "#", icon: "instagram" },
          { id: "partner-a-facebook", label: "Facebook", href: "#", icon: "facebook" }
        ]
      }
    ]
  },
  newsEventsHero: makeItem(
    "news-events-hero",
    "News & Events",
    "Latest club stories, fixtures, announcements, and match-day updates presented in a dramatic full-width hero.",
    "https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=1600&q=80"
  ),
  galleryHero: makeItem(
    "gallery-hero",
    "Gallery",
    "A visual archive of training, matches, gym work, family moments, community events, and the life of the club.",
    "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1600&q=80"
  ),
  galleryCategories: [
    {
      id: "training",
      slug: "training",
      title: "Training",
      description: "Training sessions, drills, development, and preparation.",
      image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=1400&q=80",
      featured: true,
      items: [
        {
          id: "training-1",
          title: "Morning Drills",
          description: "Sharp ball work and structured development sessions.",
          mediaType: "image",
          src: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=1200&q=80",
          thumbnail: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=600&q=80"
        },
        {
          id: "training-2",
          title: "Training Session Video",
          description: "A short clip from a tactical training block.",
          mediaType: "video",
          src: "https://www.w3schools.com/html/mov_bbb.mp4",
          thumbnail: "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=600&q=80"
        }
      ]
    },
    {
      id: "match-day",
      slug: "match-day",
      title: "Match Day",
      description: "Kickoff moments, celebrations, and game-day energy.",
      image: "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=1400&q=80",
      featured: false,
      items: [
        {
          id: "match-day-1",
          title: "Kickoff",
          description: "The moment before the whistle.",
          mediaType: "image",
          src: "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=1200&q=80",
          thumbnail: "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=600&q=80"
        },
        {
          id: "match-day-2",
          title: "Match Highlight Video",
          description: "A game-day highlight clip.",
          mediaType: "video",
          src: "https://www.w3schools.com/html/movie.mp4",
          thumbnail: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=600&q=80"
        }
      ]
    },
    {
      id: "gym",
      slug: "gym",
      title: "Gym",
      description: "Strength work, conditioning, and athletic development.",
      image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1400&q=80",
      featured: false,
      items: [
        {
          id: "gym-1",
          title: "Strength Work",
          description: "Player conditioning and power sessions.",
          mediaType: "image",
          src: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80",
          thumbnail: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80"
        }
      ]
    },
    {
      id: "parents",
      slug: "parents",
      title: "Parents",
      description: "Supportive family moments, meetings, and team connection.",
      image: "https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&w=1400&q=80",
      featured: false,
      items: [
        {
          id: "parents-1",
          title: "Family Day",
          description: "Parents and supporters around the team.",
          mediaType: "image",
          src: "https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&w=1200&q=80",
          thumbnail: "https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&w=600&q=80"
        }
      ]
    },
    {
      id: "community",
      slug: "community",
      title: "Community",
      description: "Outreach, local impact, and club involvement.",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80",
      featured: false,
      items: [
        {
          id: "community-1",
          title: "Community Outreach",
          description: "Connecting with the local community.",
          mediaType: "image",
          src: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
          thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80"
        }
      ]
    },
    {
      id: "events",
      slug: "events",
      title: "Events",
      description: "Special events, club gatherings, and memorable occasions.",
      image: "https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=1400&q=80",
      featured: false,
      items: [
        {
          id: "events-1",
          title: "Club Event",
          description: "Moments from special club events.",
          mediaType: "image",
          src: "https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=1200&q=80",
          thumbnail: "https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=600&q=80"
        }
      ]
    }
  ],
  storeCategories: [
    {
      id: "jerseys",
      slug: "jerseys",
      title: "Jerseys",
      description: "Official club jerseys in home, away, and alternate looks.",
      image: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1400&q=80",
      featured: true,
      products: [
        {
          id: "jersey-home",
          title: "Home Jersey",
          description: "The primary jersey with the classic club identity.",
          image: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1200&q=80",
          price: "$45",
          customizationPrice: "$8",
          nameOnlyPrice: "$50",
          numberOnlyPrice: "$50",
          nameAndNumberPrice: "$55",
          featured: true,
          colorOptions: ["Black", "Red"],
          sizeOptions: ["XS", "S", "M", "L", "XL", "XXL"],
          supportsNumber: true,
          supportsName: true,
          supportsCustomMade: true
        },
        {
          id: "jersey-away",
          title: "Away Jersey",
          description: "A clean alternate kit for supporters and players.",
          image: "https://images.unsplash.com/photo-1521191266372-93d1f0b2f4b2?auto=format&fit=crop&w=1200&q=80",
          price: "$45",
          customizationPrice: "$8",
          nameOnlyPrice: "$50",
          numberOnlyPrice: "$50",
          nameAndNumberPrice: "$55",
          featured: false,
          colorOptions: ["White", "Black"],
          sizeOptions: ["XS", "S", "M", "L", "XL", "XXL"],
          supportsNumber: true,
          supportsName: true,
          supportsCustomMade: true
        }
      ]
    },
    {
      id: "full-kit",
      slug: "full-kit",
      title: "Full Kit",
      description: "The complete set of jersey, shorts, and socks.",
      image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=1400&q=80",
      featured: false,
      products: [
        {
          id: "full-kit-home",
          title: "Home Full Kit",
          description: "Jersey, shorts, and socks in the main club colors.",
          image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=1200&q=80",
          price: "$70",
          customizationPrice: "$10",
          nameOnlyPrice: "$78",
          numberOnlyPrice: "$78",
          nameAndNumberPrice: "$85",
          featured: true,
          colorOptions: ["Black / Red", "Black / White"],
          sizeOptions: ["XS", "S", "M", "L", "XL", "XXL"],
          supportsNumber: true,
          supportsName: true,
          supportsCustomMade: true
        }
      ]
    },
    {
      id: "track-pants",
      slug: "track-pants",
      title: "Track Pants",
      description: "Classic track pants for training, travel, and everyday wear.",
      image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=1400&q=80",
      featured: false,
      products: [
        {
          id: "track-pants-1",
          title: "Club Track Pants",
          description: "Slim, comfortable, and made for movement.",
          image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=1200&q=80",
          price: "$35",
          customizationPrice: "$0",
          nameOnlyPrice: "$35",
          numberOnlyPrice: "$35",
          nameAndNumberPrice: "$35",
          featured: false,
          colorOptions: ["Black", "Red"],
          sizeOptions: ["XS", "S", "M", "L", "XL", "XXL"],
          supportsNumber: false,
          supportsName: false,
          supportsCustomMade: false
        }
      ]
    },
    {
      id: "hoodies",
      slug: "hoodies",
      title: "Hoodies",
      description: "Warm, classic club hoodies for supporters and players.",
      image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1400&q=80",
      featured: false,
      products: [
        {
          id: "hoodie-1",
          title: "Club Hoodie",
          description: "A clean supporter hoodie with a premium finish.",
          image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80",
          price: "$50",
          customizationPrice: "$6",
          nameOnlyPrice: "$56",
          numberOnlyPrice: "$56",
          nameAndNumberPrice: "$60",
          featured: false,
          colorOptions: ["Black", "Red", "White"],
          sizeOptions: ["XS", "S", "M", "L", "XL", "XXL"],
          supportsNumber: false,
          supportsName: true,
          supportsCustomMade: false
        }
      ]
    }
  ],
  storeOrders: [],
  programGroups: [
    {
      id: "under-7",
      slug: "under-7",
      ageGroup: "Under 7",
      title: "Under 7",
      description: "A first football journey focused on fun, movement, coordination, and confidence.",
      image: "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=1400&q=80",
      featured: true,
      subSections: [
        { id: "u7-technical", title: "Technical", description: "Basic ball familiarization, dribbling, turning, and simple control." },
        { id: "u7-tactical", title: "Tactical", description: "Simple spacing, awareness, and understanding where to move with the ball." },
        { id: "u7-physical", title: "Physical", description: "Movement, agility, balance, and coordination through playful activities." },
        { id: "u7-mental", title: "Mental", description: "Focus, listening, curiosity, and enjoyment in a supportive environment." },
        { id: "u7-confidence", title: "Confidence", description: "Helping young players feel brave enough to try, learn, and improve." },
        { id: "u7-competitiveness", title: "Competitiveness", description: "Friendly games that introduce healthy effort without pressure." }
      ],
      mediaItems: []
    },
    {
      id: "under-9",
      slug: "under-9",
      ageGroup: "Under 9",
      title: "Under 9",
      description: "Building sharper control, passing habits, and first-team concepts in an exciting setting.",
      image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1400&q=80",
      featured: false,
      subSections: [
        { id: "u9-technical", title: "Technical", description: "First touch, passing, shooting, receiving, and dribbling with both feet." },
        { id: "u9-tactical", title: "Tactical", description: "Basic team shape, support angles, and simple attacking and defending ideas." },
        { id: "u9-physical", title: "Physical", description: "Speed, balance, agility, and movement patterns that support football actions." },
        { id: "u9-mental", title: "Mental", description: "Learning from mistakes, concentration, and understanding instructions." },
        { id: "u9-confidence", title: "Confidence", description: "Encouraging players to express themselves with the ball and in games." },
        { id: "u9-competitiveness", title: "Competitiveness", description: "Small-sided challenges that build effort, resilience, and winning habits." }
      ],
      mediaItems: []
    },
    {
      id: "under-11",
      slug: "under-11",
      ageGroup: "Under 11",
      title: "Under 11",
      description: "A more structured phase where technique and decision-making start to merge.",
      image: "https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?auto=format&fit=crop&w=1400&q=80",
      featured: false,
      subSections: [
        { id: "u11-technical", title: "Technical", description: "Passing under pressure, first touch into space, and quality ball striking." },
        { id: "u11-tactical", title: "Tactical", description: "Understanding width, depth, transition moments, and support play." },
        { id: "u11-physical", title: "Physical", description: "Agility, endurance development, coordination, and movement efficiency." },
        { id: "u11-mental", title: "Mental", description: "Concentration, self-control, and thinking about the game while playing." },
        { id: "u11-confidence", title: "Confidence", description: "Building self-belief through repetition, success, and guided challenge." },
        { id: "u11-competitiveness", title: "Competitiveness", description: "Introducing stronger match realism and learning how to compete well." }
      ],
      mediaItems: []
    },
    {
      id: "under-13",
      slug: "under-13",
      ageGroup: "Under 13",
      title: "Under 13",
      description: "A development stage focused on smarter football, stronger technique, and tactical growth.",
      image: "https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=1400&q=80",
      featured: false,
      subSections: [
        { id: "u13-technical", title: "Technical", description: "Sharper passing, control under pressure, finishing, and defending actions." },
        { id: "u13-tactical", title: "Tactical", description: "Shape, pressing triggers, building from the back, and compact defending." },
        { id: "u13-physical", title: "Physical", description: "Strength foundations, endurance, coordination, and movement speed." },
        { id: "u13-mental", title: "Mental", description: "Focus, responsibility, discipline, and decision-making during game moments." },
        { id: "u13-confidence", title: "Confidence", description: "Encouraging players to take ownership and play with intention." },
        { id: "u13-competitiveness", title: "Competitiveness", description: "A stronger match environment that rewards intensity and consistency." }
      ],
      mediaItems: []
    },
    {
      id: "under-15",
      slug: "under-15",
      ageGroup: "Under 15",
      title: "Under 15",
      description: "A more demanding age where performance habits, intensity, and football understanding matter more.",
      image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1400&q=80",
      featured: false,
      subSections: [
        { id: "u15-technical", title: "Technical", description: "Executing skills at speed with less time and more pressure." },
        { id: "u15-tactical", title: "Tactical", description: "Game plan understanding, positioning, pressing, and transitions." },
        { id: "u15-physical", title: "Physical", description: "Strength, speed, recovery, and the physical demands of competitive football." },
        { id: "u15-mental", title: "Mental", description: "Handling pressure, staying composed, and learning to think ahead." },
        { id: "u15-confidence", title: "Confidence", description: "Growing leadership, belief, and bravery in key moments." },
        { id: "u15-competitiveness", title: "Competitiveness", description: "Greater match intensity and developing a strong winning mentality." }
      ],
      mediaItems: []
    },
    {
      id: "under-17",
      slug: "under-17",
      ageGroup: "Under 17",
      title: "Under 17",
      description: "The final youth stage before senior football, focused on performance and maturity.",
      image: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=1400&q=80",
      featured: false,
      subSections: [
        { id: "u17-technical", title: "Technical", description: "Advanced technical execution, consistency, and precision under pressure." },
        { id: "u17-tactical", title: "Tactical", description: "Reading the game, adapting quickly, and understanding team structures." },
        { id: "u17-physical", title: "Physical", description: "Conditioning, strength, speed, and readiness for higher-level football." },
        { id: "u17-mental", title: "Mental", description: "Maturity, resilience, discipline, and managing the demands of competition." },
        { id: "u17-confidence", title: "Confidence", description: "Preparing players to lead, trust their ability, and perform under pressure." },
        { id: "u17-competitiveness", title: "Competitiveness", description: "A strong competitive edge with the ambition to transition into senior football." }
      ],
      mediaItems: []
    }
  ],
  programItems: [
    makeItem("program-1", "Youth Development", "Grow talent through structured football programs.", "https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?auto=format&fit=crop&w=900&q=80"),
    makeItem("program-2", "Community Outreach", "Connect the club to schools and local initiatives.", "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80"),
    makeItem("program-3", "Training Pathway", "Clear progression for players and technical growth.", "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=900&q=80")
  ],
  newsItems: [
    { ...makeItem("news-1", "Latest Fixture", "Match previews, results, and club announcements.", "https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=900&q=80"), slug: "latest-fixture", kind: "news" },
    { ...makeItem("news-2", "Club Update", "Important news posts and supporter communications.", "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=900&q=80"), slug: "club-update", kind: "news" },
    { ...makeItem("news-3", "Event Spotlight", "Events and special moments captured in the feed.", "https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&w=900&q=80"), slug: "event-spotlight", kind: "event" }
  ],
  merchandiseItems: [
    makeItem("merch-1", "Home Jersey", "Official club jersey with premium presentation.", "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=900&q=80"),
    makeItem("merch-2", "Training Shirt", "Performance wear for supporters and athletes.", "https://images.unsplash.com/photo-1521191266372-93d1f0b2f4b2?auto=format&fit=crop&w=900&q=80"),
    makeItem("merch-3", "Club Cap", "Supporter gear with a clean football-club look.", "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=900&q=80")
  ],
  galleryItems: [
    makeItem("gallery-1", "Stadium Energy", "A cinematic image slideshow for the gallery.", "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80"),
    makeItem("gallery-2", "Team Moments", "Winning emotions and club memories.", "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=1200&q=80"),
    makeItem("gallery-3", "Supporters", "The community that powers the badge.", "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=1200&q=80")
  ],
  actionCards: [
    makeItem("action-1", "Join Us", "Registration and supporter sign-up made simple.", "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=900&q=80"),
    makeItem("action-2", "Engage", "Connect your skills, support, or partnership with the academy community.", "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=900&q=80"),
    makeItem("action-3", "Contact Us", "Reach the team and stay connected.", "https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=900&q=80")
  ]
};

export function createEmptyItem(prefix: string, index: number): ImageContentItem {
  return {
    id: `${prefix}-${Date.now()}-${index}`,
    title: "",
    description: "",
    image: ""
  };
}

export function normalizeHomeContent(content: HomeContentState): HomeContentState {
  const normalizedNewsItems =
    content.newsItems.length > 0
      ? content.newsItems.map((item, index) => ({
          ...item,
          slug: item.slug ?? (item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || `news-${index + 1}`),
          kind: item.kind ?? "news",
          article: item.article ?? item.description,
          occurrenceDate: item.occurrenceDate ?? "",
          pinned: Boolean(item.pinned)
        }))
      : defaultHomeContent.newsItems;

  return {
    ...content,
    aboutItems:
      content.aboutItems.length > 0
        ? [content.aboutItems[0]]
        : [
            makeItem(
              "about-1",
              "About Us",
              "We are a football team driven by passion, discipline, unity, and ambition.",
              "https://images.unsplash.com/photo-1527277561026-1d1a9f0e0b0f?auto=format&fit=crop&w=1400&q=80"
            )
          ],
    aboutSections:
      content.aboutSections.length > 0
        ? content.aboutSections
        : defaultHomeContent.aboutSections,
    aboutCoaches: content.aboutCoaches?.length ? content.aboutCoaches : defaultHomeContent.aboutCoaches,
    programsHero: content.programsHero ?? defaultHomeContent.programsHero,
    programsProgressionPath: normalizeProgramsProgressionPath(content.programsProgressionPath),
    storeHero: content.storeHero ?? defaultHomeContent.storeHero,
    joinPage: normalizeJoinPage(content.joinPage),
    joinRegistrations: normalizeJoinRegistrations(content.joinRegistrations),
    contactPage: normalizeContactPage(content.contactPage),
    contactSubmissions: normalizeContactSubmissions(content.contactSubmissions),
    feedbackSubmissions: normalizeFeedbackSubmissions(content.feedbackSubmissions),
    donatePage: normalizeDonatePage(content.donatePage),
    engageSubmissions: normalizeEngageSubmissions(content.engageSubmissions),
    engageConnectionRequests: normalizeEngageConnectionRequests(content.engageConnectionRequests),
    supportSubmissions: normalizeSupportSubmissions(content.supportSubmissions),
    notificationSettings: normalizeNotificationSettings(content.notificationSettings),
    footerContent: normalizeFooterContent(content.footerContent),
    newsEventsHero: content.newsEventsHero ?? defaultHomeContent.newsEventsHero,
    galleryHero: content.galleryHero ?? defaultHomeContent.galleryHero,
    galleryCategories: content.galleryCategories?.length ? content.galleryCategories : defaultHomeContent.galleryCategories,
    storeCategories: normalizeStoreCategories(content.storeCategories),
    storeOrders: normalizeStoreOrders(content.storeOrders),
    programGroups: normalizeProgramGroups(content.programGroups),
    newsItems: normalizedNewsItems,
    actionCards: content.actionCards?.length ? content.actionCards : defaultHomeContent.actionCards
  };
}

function normalizeProgramGroups(groups: ProgramGroup[] | undefined): ProgramGroup[] {
  const source = groups?.length ? groups : defaultHomeContent.programGroups;

  return source.map((group) => ({
    ...group,
    subSections: group.subSections ?? [],
    mediaItems: group.mediaItems ?? []
  }));
}

function normalizeStoreCategories(categories: StoreCategory[] | undefined): StoreCategory[] {
  const source = categories?.length ? categories : defaultHomeContent.storeCategories;

  return source.map((category) => ({
    ...category,
    products: (category.products ?? []).map((product) => ({
      ...product,
      customizationPrice: product.customizationPrice ?? "$0",
      nameOnlyPrice: product.nameOnlyPrice ?? product.customizationPrice ?? product.price ?? "$0",
      numberOnlyPrice: product.numberOnlyPrice ?? product.customizationPrice ?? product.price ?? "$0",
      nameAndNumberPrice: product.nameAndNumberPrice ?? product.customizationPrice ?? product.price ?? "$0",
      colorOptions: product.colorOptions ?? [],
      sizeOptions: product.sizeOptions ?? [],
      supportsNumber: Boolean(product.supportsNumber),
      supportsName: Boolean(product.supportsName),
      supportsCustomMade: Boolean(product.supportsCustomMade)
    }))
  }));
}

function normalizeStoreOrders(orders: StoreOrder[] | undefined): StoreOrder[] {
  if (!orders?.length) {
    return [];
  }

  return orders.map((order) => ({
    ...order,
    buyerName: order.buyerName ?? "",
    buyerEmail: order.buyerEmail ?? "",
    buyerPhone: order.buyerPhone ?? "",
    deliveryPreference: order.deliveryPreference ?? "",
    notes: order.notes ?? "",
    items: (order.items ?? []).map((item) => ({
      ...item,
      unitPrice: item.unitPrice ?? item.basePrice ?? "",
      lineTotal: item.lineTotal ?? item.unitPrice ?? item.basePrice ?? ""
    })),
    status: order.status ?? "new",
    submittedAt: order.submittedAt ?? new Date().toISOString(),
    adminNote: order.adminNote ?? ""
  }));
}

function normalizeProgramsProgressionPath(
  content: ProgramsProgressionPathContent | undefined
): ProgramsProgressionPathContent {
  const defaults = defaultHomeContent.programsProgressionPath;

  if (!content) {
    return defaults;
  }

  return {
    ...defaults,
    ...content,
    teaserCheckpoints: content.teaserCheckpoints?.length
      ? content.teaserCheckpoints
      : (content.stages?.length ? content.stages : defaults.stages).slice(0, 6).map((stage) => stage.title),
    stages: content.stages?.length ? content.stages : defaults.stages
  };
}

function normalizeFooterContent(content: FooterContent | undefined): FooterContent {
  const defaults = defaultHomeContent.footerContent;

  if (!content) {
    return defaults;
  }

  return {
    ...defaults,
    ...content,
    brandName: normalizeBrandName(content.brandName, defaults.brandName),
    badgeImage: content.badgeImage ?? defaults.badgeImage,
    links: content.links?.length ? content.links : defaults.links,
    socials: content.socials?.length ? content.socials : defaults.socials,
    footerBrands: content.footerBrands?.length
      ? content.footerBrands.map((brand) => ({
          ...brand,
          badgeImage: (brand as FooterBrandItem & { badgeImage?: string }).badgeImage ?? "",
          description: brand.description ?? "",
          location: brand.location ?? "",
          contactEmail: brand.contactEmail ?? "",
          contactPhone: brand.contactPhone ?? "",
          services: brand.services ?? [],
          galleryImages: brand.galleryImages ?? [],
          socials: brand.socials?.length ? brand.socials : []
        }))
      : defaults.footerBrands
  };
}

function normalizeJoinPage(content: JoinPageContent | undefined): JoinPageContent {
  const defaults = defaultHomeContent.joinPage;

  if (!content) {
    return defaults;
  }

  return {
    ...defaults,
    ...content,
    hero: content.hero ?? defaults.hero,
    requirements: content.requirements?.length ? content.requirements : defaults.requirements,
    requiredInformation: content.requiredInformation?.length ? content.requiredInformation : defaults.requiredInformation,
    processSteps: content.processSteps?.length ? content.processSteps : defaults.processSteps,
    emailSubject: content.emailSubject ?? defaults.emailSubject,
    emailTitle: content.emailTitle ?? defaults.emailTitle,
    emailIntro: content.emailIntro ?? defaults.emailIntro,
    emailProgramNote: content.emailProgramNote ?? defaults.emailProgramNote,
    emailTrainingGroundNote: content.emailTrainingGroundNote ?? defaults.emailTrainingGroundNote,
    emailKitNote: content.emailKitNote ?? defaults.emailKitNote,
    emailSignOff: content.emailSignOff ?? defaults.emailSignOff,
    photoConsentDocumentName: content.photoConsentDocumentName ?? defaults.photoConsentDocumentName,
    photoConsentDocumentDescription: content.photoConsentDocumentDescription ?? defaults.photoConsentDocumentDescription,
    photoConsentDocumentUrl: content.photoConsentDocumentUrl ?? defaults.photoConsentDocumentUrl
  };
}

function normalizeJoinRegistrations(registrations: JoinRegistration[] | undefined): JoinRegistration[] {
  if (!registrations?.length) {
    return [];
  }

  return registrations.map((registration) => ({
    ...registration,
    address: registration.address ?? "",
    residence: registration.residence ?? "",
    medicalInformation: registration.medicalInformation ?? "",
    consent: Boolean(registration.consent),
    photoPublicationConsent: registration.photoPublicationConsent ?? "denied",
    status: registration.status ?? "pending",
    submittedAt: registration.submittedAt ?? new Date().toISOString(),
    adminNote: registration.adminNote ?? ""
  }));
}

function normalizeContactSubmissions(submissions: ContactSubmission[] | undefined): ContactSubmission[] {
  if (!submissions?.length) {
    return [];
  }

  return submissions.map((submission) => ({
    ...submission,
    name: submission.name ?? "",
    email: submission.email ?? "",
    phone: submission.phone ?? "",
    subject: submission.subject ?? "",
    message: submission.message ?? "",
    status: submission.status ?? "new",
    submittedAt: submission.submittedAt ?? new Date().toISOString(),
    adminNote: submission.adminNote ?? ""
  }));
}

function normalizeFeedbackSubmissions(submissions: FeedbackSubmission[] | undefined): FeedbackSubmission[] {
  if (!submissions?.length) {
    return [];
  }

  return submissions.map((submission) => ({
    ...submission,
    name: submission.name ?? "",
    message: submission.message ?? "",
    rating: Number.isFinite(submission.rating) ? Math.min(5, Math.max(1, Math.round(submission.rating))) : 5,
    status: submission.status === "approved" || submission.status === "rejected" ? submission.status : "pending",
    submittedAt: submission.submittedAt ?? new Date().toISOString(),
    reviewedAt: submission.reviewedAt ?? "",
    adminNote: submission.adminNote ?? ""
  }));
}

function normalizeEngageSubmissions(submissions: EngageSubmission[] | undefined): EngageSubmission[] {
  if (!submissions?.length) {
    return [];
  }

  return submissions.map((submission) => ({
    ...submission,
    name: submission.name ?? "",
    email: submission.email ?? "",
    phone: submission.phone ?? "",
    engagementType: submission.engagementType ?? "",
    occupation: submission.occupation ?? "",
    skills: submission.skills ?? "",
    message: submission.message ?? "",
    status: submission.status ?? "new",
    submittedAt: submission.submittedAt ?? new Date().toISOString(),
    adminNote: submission.adminNote ?? ""
  }));
}

function normalizeNotificationSettings(settings: NotificationSettings | undefined): NotificationSettings {
  const defaults = defaultHomeContent.notificationSettings;

  return {
    toneUrl: settings?.toneUrl ?? defaults.toneUrl,
    toneName: settings?.toneName ?? defaults.toneName,
    soundEnabled: settings?.soundEnabled ?? defaults.soundEnabled
  };
}

function normalizeEngageConnectionRequests(requests: EngageConnectionRequest[] | undefined): EngageConnectionRequest[] {
  if (!requests?.length) {
    return [];
  }

  return requests.map((request) => ({
    ...request,
    targetSubmissionId: request.targetSubmissionId ?? "",
    targetOccupation: request.targetOccupation ?? "",
    targetEngagementType: request.targetEngagementType ?? "",
    requesterName: request.requesterName ?? "",
    requesterEmail: request.requesterEmail ?? "",
    requesterPhone: request.requesterPhone ?? "",
    reason: request.reason ?? "",
    status: request.status ?? "new",
    submittedAt: request.submittedAt ?? new Date().toISOString(),
    adminNote: request.adminNote ?? ""
  }));
}

function normalizeSupportSubmissions(submissions: SupportSubmission[] | undefined): SupportSubmission[] {
  if (!submissions?.length) {
    return [];
  }

  return submissions.map((submission) => ({
    ...submission,
    name: submission.name ?? "",
    email: submission.email ?? "",
    phone: submission.phone ?? "",
    supportType: submission.supportType ?? "",
    supportDetails: submission.supportDetails ?? "",
    preferredPaymentStream: submission.preferredPaymentStream ?? "",
    amount: submission.amount ?? "",
    status: submission.status ?? "new",
    submittedAt: submission.submittedAt ?? new Date().toISOString(),
    adminNote: submission.adminNote ?? ""
  }));
}

function normalizeContactPage(content: ContactPageContent | undefined): ContactPageContent {
  const defaults = defaultHomeContent.contactPage;

  if (!content) {
    return defaults;
  }

  return {
    ...defaults,
    ...content,
    hero: content.hero ?? defaults.hero,
    socials:
      content.socials?.length
        ? content.socials
        : defaults.socials,
    contacts:
      content.contacts?.length ? content.contacts : defaults.contacts,
    mapLink: content.mapLink ?? defaults.mapLink,
    mapImage: content.mapImage ?? defaults.mapImage
  };
}

function normalizeDonatePage(content: DonatePageContent | undefined): DonatePageContent {
  const defaults = defaultHomeContent.donatePage;

  if (!content) {
    return defaults;
  }

  return {
    ...defaults,
    ...content,
    hero: content.hero ?? defaults.hero,
    engagePathways: content.engagePathways?.length ? content.engagePathways : defaults.engagePathways,
    supportWays: normalizeSupportWays(content.supportWays),
    impactPoints: content.impactPoints?.length ? content.impactPoints : defaults.impactPoints,
    gratitudeCards: content.gratitudeCards?.length ? content.gratitudeCards : defaults.gratitudeCards
  };
}

function normalizeSupportWays(supportWays: DonateSupportWay[] | undefined): DonateSupportWay[] {
  const defaults = defaultHomeContent.donatePage.supportWays;

  if (!supportWays?.length) {
    return defaults;
  }

  const hasOlderDonateDefaults = supportWays.some((item) => item.id === "support-balls" || item.id === "support-jersey");
  if (hasOlderDonateDefaults) {
    return defaults;
  }

  return supportWays;
}

function normalizeBrandName(value: string | undefined, fallback: string) {
  const normalized = (value ?? "").trim();
  if (!normalized) return fallback;
  if (normalized.toLowerCase() === "black red united") return fallback;
  return normalized;
}
