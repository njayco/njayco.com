import { db } from "@workspace/db";
import {
  divisionsTable,
  artistsTable,
  albumsTable,
  tracksTable,
  documentsTable,
} from "@workspace/db/schema";

async function seed() {
  console.log("Seeding NJAYCO OS database...");

  await db.delete(tracksTable);
  await db.delete(albumsTable);
  await db.delete(artistsTable);
  await db.delete(documentsTable);
  await db.delete(divisionsTable);

  // --- DIVISIONS ---
  const divisions = await db.insert(divisionsTable).values([
    {
      slug: "my-njayco",
      name: "My NJAYCO",
      shortDescription: "Your personal NJAYCO OS file explorer",
      fullDescription: "Browse the entire NJAYCO company archive — divisions, documents, media, and more.",
      iconType: "folder",
      iconColor: "#F59E0B",
      windowType: "explorer",
      status: "live",
      category: "corporate",
      sortOrder: 1,
      featured: true,
    },
    {
      slug: "about-najee",
      name: "About Najee Jeremiah",
      shortDescription: "CEO & Founder of The Najee Jeremiah Company",
      fullDescription: "Najee Jeremiah is a multi-industry entrepreneur, technologist, educator, and creative visionary based in New York. He is the founder and CEO of The Najee Jeremiah Company (NJAYCO), a holding company spanning music, education, technology, media, and local business infrastructure.",
      iconType: "person",
      iconColor: "#6366F1",
      windowType: "custom",
      status: "live",
      category: "corporate",
      sortOrder: 2,
      featured: true,
    },
    {
      slug: "njayco-corporate",
      name: "NJAYCO Corporate",
      shortDescription: "The official headquarters of The Najee Jeremiah Company",
      fullDescription: "NJAYCO (The Najee Jeremiah Company) is a multi-industry holding company building products and services across music, education, software, media, design, and business infrastructure. Founded by Najee Jeremiah.",
      iconType: "building",
      iconColor: "#1D4ED8",
      windowType: "custom",
      status: "live",
      category: "corporate",
      sortOrder: 3,
      featured: true,
    },
    {
      slug: "uv-empire",
      name: "UV EMPIRE",
      shortDescription: "The creative and cultural umbrella of the NJAYCO ecosystem",
      fullDescription: "UV EMPIRE is the high-level creative and entrepreneurial brand identity tied to Najee's vision, cultural leadership, and execution. It represents the umbrella identity under which music, design, media, and product ventures are built.",
      iconType: "crown",
      iconColor: "#7C3AED",
      windowType: "notepad",
      notepadContent: `UV_EMPIRE_OVERVIEW.txt
=====================================
UV EMPIRE — Brand Overview
Version 1.0 | Updated 2024
=====================================

MISSION STATEMENT
-----------------
UV EMPIRE exists to build cultural equity through creativity,
entrepreneurship, and innovation. We create brands, products,
and platforms that amplify Black excellence across industries.

BRAND PILLARS
-------------
1. Creative Leadership
   — Original music, media, and art from UV artists
   — Design-forward product development
   — Cultural storytelling and narrative ownership

2. Entrepreneurial Infrastructure
   — Holding company for creative ventures
   — Incubator for next-generation brands
   — Strategic partnerships and co-ventures

3. Cultural Capital
   — Community-centered growth
   — Education as empowerment
   — Technology as liberation

ECOSYSTEM MAP
-------------
UV EMPIRE → UV Music Group → Artists (Naww G, Urbanswave, System The One, The Unrevealed Band)
UV EMPIRE → Unrevealed Brand (Design & Development Studio)
UV EMPIRE → Howard Unrevealed (Cultural/Educational Media)
UV EMPIRE → Wax Radio (Music Discovery Platform)

DESIGN PHILOSOPHY
-----------------
Bold. Premium. Cultural.
Every UV EMPIRE product leads with excellence and authenticity.

For inquiries: empire@njayco.com
`,
      status: "live",
      category: "creative",
      sortOrder: 4,
      featured: true,
    },
    {
      slug: "unrevealed-brand",
      name: "Unrevealed Brand",
      shortDescription: "NJAYCO's product development & creative technology studio",
      fullDescription: "Unrevealed Brand is the internal product incubator and digital infrastructure arm of NJAYCO — building apps, websites, branding systems, and rapid AI-assisted digital products for NJAYCO divisions and clients.",
      websiteUrl: "https://njayco.com",
      iconType: "lightbulb",
      iconColor: "#0EA5E9",
      windowType: "notepad",
      notepadContent: `UNREVEALED_BRAND.txt
=====================================
Unrevealed Brand — Studio Overview
Creative Technology Division of NJAYCO
=====================================

WHAT WE ARE
-----------
Unrevealed Brand is the product development arm
and creative technology studio of The Najee Jeremiah Company.

We build:
  * Mobile & web applications
  * Branding systems and design frameworks
  * AI-assisted rapid development products
  * Internal NJAYCO digital infrastructure
  * Client-facing software and platforms

SERVICES
--------
→ App Development (iOS, Android, Web)
→ Brand Identity & Design Systems
→ Website Design & Development
→ Business Software Prototyping
→ AI-Assisted Product Development
→ Digital Strategy Consulting

REVENUE STREAMS
---------------
1. Client App Builds — custom software development
2. Website Development — design + engineering
3. Branding Packages — identity, logo, guidelines
4. Design Systems — scalable component libraries
5. Business Software — internal tools and SaaS
6. Consulting — tech strategy and product direction

NOTABLE PROJECTS
----------------
- NJAYCO OS (this platform)
- UV Music Group digital infrastructure
- YsUp academic platform
- Greet Me application

STATUS: Active Development
Contact: build@njayco.com
`,
      status: "live",
      category: "tech",
      sortOrder: 5,
      featured: false,
    },
    {
      slug: "uv-music-group",
      name: "UV Music Group",
      shortDescription: "Independent record label and music commerce hub",
      fullDescription: "UV Music Group is NJAYCO's independent record label — home to Naww G, Urbanswave, System The One, and The Unrevealed Band. We handle music releases, artist development, digital distribution, and direct-to-fan commerce.",
      iconType: "music",
      iconColor: "#DC2626",
      windowType: "music",
      status: "live",
      category: "music",
      sortOrder: 6,
      featured: true,
    },
    {
      slug: "howard-unrevealed",
      name: "Howard Unrevealed",
      shortDescription: "Cultural & educational media division",
      fullDescription: "Howard Unrevealed is a legacy, cultural, and educational media brand rooted in the Howard University tradition — building platforms for stories, student culture, and creative community.",
      iconType: "graduation",
      iconColor: "#B45309",
      windowType: "notepad",
      notepadContent: `HOWARD_UNREVEALED.txt
=====================================
Howard Unrevealed — Concept Overview
Cultural & Educational Media Division
=====================================

ORIGIN
------
Rooted in the Howard University tradition of excellence,
Howard Unrevealed is a cultural and educational media brand
dedicated to amplifying the stories and achievements of
students, creators, and change-makers.

PURPOSE
-------
→ Stories from HBCU culture and student life
→ Educational content and resources
→ Media platform for Black collegiate creators
→ Legacy documentation and archiving
→ Community building for alumni networks

CONTENT PILLARS
---------------
1. Student Stories — personal narratives, achievements
2. Alumni Spotlight — where are they now?
3. Campus Culture — events, art, music, movements
4. Educational Resources — study tools, career prep
5. Creative Showcase — film, music, design, writing

ROADMAP
-------
Q1 2025 — Brand identity finalized
Q2 2025 — Content pilot (20 stories)
Q3 2025 — Platform beta launch
Q4 2025 — Partnership with HBCU institutions

STATUS: Concept Stage
For partnerships: hbcu@njayco.com
`,
      status: "concept",
      category: "education",
      sortOrder: 7,
      featured: false,
    },
    {
      slug: "wax-radio",
      name: "Wax Radio",
      shortDescription: "Community-driven music discovery radio platform",
      fullDescription: "Wax Radio is a music discovery platform where tracks surface through listener interaction and heat. Hear the first 30 seconds, like or skip, and watch hot songs rise. Artist-fan engagement meets community-driven discovery.",
      iconType: "radio",
      iconColor: "#7C3AED",
      windowType: "browser",
      websiteUrl: "https://njayco.com",
      status: "development",
      category: "music",
      sortOrder: 8,
      featured: false,
    },
    {
      slug: "ysup-inc",
      name: "YsUp, Inc.",
      shortDescription: "Education technology company with game-based learning tools",
      fullDescription: "YsUp, Inc. is an education technology company building game-based, AI-powered, socially connected learning tools for classrooms and campuses. We partner with schools to bring gamified learning to every student.",
      websiteUrl: "https://ysup.co",
      iconType: "rocket",
      iconColor: "#059669",
      windowType: "browser",
      status: "live",
      category: "education",
      sortOrder: 9,
      featured: true,
    },
    {
      slug: "ysup-campus",
      name: "YsUp Campus",
      shortDescription: "Student-facing campus networking & academic utility hub",
      fullDescription: "YsUp Campus is the student-facing product of YsUp — a campus networking and academic utility platform with game mechanics, rewards, and tools built for modern students.",
      websiteUrl: "https://ysup.co",
      iconType: "campus",
      iconColor: "#16A34A",
      windowType: "browser",
      status: "live",
      category: "education",
      sortOrder: 10,
      featured: false,
    },
    {
      slug: "greet-me",
      name: "Greet Me",
      shortDescription: "Digital greeting card & music-as-gift platform",
      fullDescription: "Greet Me is a digital greeting platform that turns cards into experiences. Send music-powered greeting cards with voice notes, custom messages, and music clips. Giving made meaningful.",
      websiteUrl: "https://njayco.com",
      iconType: "handshake",
      iconColor: "#F97316",
      windowType: "browser",
      status: "development",
      category: "tech",
      sortOrder: 11,
      featured: true,
    },
    {
      slug: "denoko",
      name: "Denoko",
      shortDescription: "Cooperative innovation platform for community & infrastructure",
      fullDescription: "Denoko is a cooperative-style innovation umbrella focused on community infrastructure, communications, transport, and software platforms built with community ownership at the center.",
      iconType: "square",
      iconColor: "#1F2937",
      windowType: "notepad",
      notepadContent: `DENOKO_BUSINESS_MODEL.txt
=====================================
DENOKO — BUSINESS MODEL OVERVIEW
Version 1.2 | Updated Oct 2024
=====================================

1. STRATEGIC GOALS
   — Sustainable Growth
   — Global Expansion
   — Community-centered platform ownership

2. REVENUE STREAMS
   — Technology Licensing (30%)
   — Consultancy Services (40%)
   — Product Sales (20%)
   — R&D Grants (10%)

3. KEY MARKETS
   — Enterprise Software
   — Logistics Automation
   — Community Platforms

4. CORE DIVISIONS
   → Denoko Tech Solutions
     Innovating infrastructure, software, and public technology

   → Denoko Business Consultancy
     Strategic planning and business management consultancy

   → Denoko Innovations Labs
     R&D, procurement innovation, strategic technologies

   → Denoko Logistics & Asset Management
     Software-driven logistics, global systems, and monitoring

   → Denoko Communications
     Community messaging, local discovery, platform tools

   → Denoko Housing & Infrastructure
     Community housing and local development platforms

5. PLATFORM PHILOSOPHY
   Cooperative economics. Community ownership.
   Technology as a public utility.

6. DEVELOPMENT ROADMAP
   Phase 1 (2024) — Core tech infrastructure
   Phase 2 (2025) — Launch 2 core products
   Phase 3 (2026) — Community partnerships
   Phase 4 (2027) — National scale

...

— Updated Oct 2024
`,
      status: "concept",
      category: "tech",
      sortOrder: 12,
      featured: false,
    },
    {
      slug: "denoko-taxi",
      name: "Denoko Taxi",
      shortDescription: "SaaS dispatch platform for local transportation businesses",
      fullDescription: "Denoko Taxi is a digital dispatch tool for local transportation businesses — dispatcher dashboard, call pins, driver location, ride assignment, and revenue tracking as a white-label SaaS.",
      websiteUrl: "https://denokotaxi.com",
      iconType: "car",
      iconColor: "#FBBF24",
      windowType: "browser",
      status: "development",
      category: "logistics",
      sortOrder: 13,
      featured: false,
    },
    {
      slug: "frankies-elite",
      name: "Frankie's Elite Transport",
      shortDescription: "Premium towing & transport operations platform",
      fullDescription: "Frankie's Elite Transport is a luxury towing and transport business with a digital platform for service requests, live tracking, dispatch management, and payments.",
      websiteUrl: "https://frankieselitetransport.com",
      iconType: "truck",
      iconColor: "#78716C",
      windowType: "browser",
      status: "development",
      category: "logistics",
      sortOrder: 14,
      featured: false,
    },
    {
      slug: "teemer-moving",
      name: "Teemer Moving & Storage",
      shortDescription: "Tech-enabled moving and logistics platform",
      fullDescription: "Teemer Moving & Storage is a modern moving company powered by technology — job booking, crew management, dispatch, quote flows, and route tracking for seamless local moves.",
      websiteUrl: "https://teemermovingandstorage.replit.app",
      iconType: "box",
      iconColor: "#92400E",
      windowType: "browser",
      status: "development",
      category: "logistics",
      sortOrder: 15,
      featured: false,
    },
    {
      slug: "prom-queen",
      name: "Prom Queen",
      shortDescription: "Consumer media & lifestyle brand concept",
      fullDescription: "Prom Queen is a consumer media and lifestyle brand concept targeting young adults and students — content, experiences, and community built around celebration culture.",
      iconType: "crown",
      iconColor: "#EC4899",
      windowType: "notepad",
      notepadContent: `PROM_QUEEN_CONCEPT.txt
=====================================
PROM QUEEN — Brand Concept
NJAYCO Creative Division
=====================================

CONCEPT SUMMARY
---------------
Prom Queen is a consumer media and lifestyle brand
celebrating achievement, style, and the milestone moments
that define youth culture.

TARGET AUDIENCE
---------------
Primary: Ages 16-25, students, young adults
Secondary: Parents, event planners, lifestyle brands
Geographic: US-focused, eventual global expansion

THE OFFER
---------
→ Lifestyle content (editorial, video, social)
→ Event curation and promotion
→ Style guides and trend reporting
→ Brand partnerships with lifestyle companies
→ Milestone celebration platform (prom, grad, etc.)

CONTENT STRATEGY
----------------
Instagram-first content → YouTube → TikTok
Focus on achievement culture, style, joy

ROADMAP
-------
2024 — Brand identity development
2025 — Content pilot launch (social-first)
2026 — Platform and app development
2027 — Event sponsorship & partnerships

MONETIZATION
------------
→ Brand sponsorships and partnerships
→ Affiliate marketing
→ Premium content subscriptions
→ Event ticketing and promotion
→ Licensing (designs, content)

STATUS: Concept Stage
`,
      status: "concept",
      category: "media",
      sortOrder: 16,
      featured: false,
    },
    {
      slug: "phone-msgr",
      name: "Phone Msgr",
      shortDescription: "Kindness-based local social messenger",
      fullDescription: "Phone Msgr is a flagship social messaging concept built on kindness economics — local discovery, buddy networks, social feeds, and future mesh/offline resilience.",
      iconType: "chat",
      iconColor: "#22C55E",
      windowType: "browser",
      websiteUrl: "https://phonemsgr.com",
      status: "development",
      category: "tech",
      sortOrder: 17,
      featured: true,
    },
    {
      slug: "contact",
      name: "Contact",
      shortDescription: "Get in touch with NJAYCO",
      fullDescription: "Contact The Najee Jeremiah Company for partnerships, investment inquiries, booking, press, and business proposals.",
      iconType: "envelope",
      iconColor: "#6B7280",
      windowType: "custom",
      status: "live",
      category: "corporate",
      sortOrder: 18,
      featured: false,
    },
    {
      slug: "press-kit",
      name: "Press Kit",
      shortDescription: "Media resources for journalists and press",
      fullDescription: "Official press materials for The Najee Jeremiah Company including bios, headshots, company overview, and media guidelines.",
      iconType: "newspaper",
      iconColor: "#64748B",
      windowType: "explorer",
      status: "live",
      category: "corporate",
      sortOrder: 19,
      featured: false,
    },
    {
      slug: "investor-info",
      name: "Investor Info",
      shortDescription: "Investment opportunities and company financials",
      fullDescription: "NJAYCO investor information including executive summary, growth metrics, division overview, and investment opportunities.",
      iconType: "chart",
      iconColor: "#16A34A",
      windowType: "explorer",
      status: "live",
      category: "corporate",
      sortOrder: 20,
      featured: false,
    },
    {
      slug: "recycle-bin",
      name: "Recycle Bin",
      shortDescription: "Recycle Bin",
      fullDescription: "The Recycle Bin",
      iconType: "trash",
      iconColor: "#9CA3AF",
      windowType: "custom",
      status: "live",
      category: "corporate",
      sortOrder: 99,
      featured: false,
    },
  ]).returning();

  console.log(`Inserted ${divisions.length} divisions`);

  // --- ARTISTS ---
  const artists = await db.insert(artistsTable).values([
    {
      slug: "naww-g",
      name: "Naww G",
      bio: "Naww G is a versatile hip-hop artist and storyteller from New York City. Known for blending sharp lyricism with atmospheric beats, his music captures the raw energy of urban life with a poetic depth that sets him apart. Albums include Street Poetry and Concrete Jungle.",
      genre: "Hip-Hop / Rap",
      featured: true,
    },
    {
      slug: "urbanswave",
      name: "Urbanswave",
      bio: "Urbanswave is a boundary-pushing electronic and R&B producer known for crafting immersive soundscapes that blend synthesizer-driven future-funk with soulful melodies. His debut album Future Funk redefined UV Music Group's sonic palette.",
      genre: "Electronic / R&B",
      featured: true,
    },
    {
      slug: "system-the-one",
      name: "System The One",
      bio: "System The One is a genre-defying artist merging alternative hip-hop, ambient electronics, and experimental sound design. His introspective tracks explore identity, technology, and human connection in the digital age.",
      genre: "Alternative / Experimental",
      featured: false,
    },
    {
      slug: "the-unrevealed-band",
      name: "The Unrevealed Band",
      bio: "The Unrevealed Band is a collective of multi-genre musicians pushing the boundaries of neo-soul, jazz, and contemporary R&B. Their debut album Echoes showcases a rich tapestry of live instrumentation and layered harmonies.",
      genre: "Neo-Soul / Jazz / R&B",
      featured: false,
    },
  ]).returning();

  console.log(`Inserted ${artists.length} artists`);

  const [nawwG, urbanswave, systemTheOne, unrevealed] = artists;

  // --- ALBUMS ---
  const albums = await db.insert(albumsTable).values([
    {
      artistId: nawwG.id,
      title: "Street Poetry",
      releaseYear: 2023,
      genre: "Hip-Hop",
      price: 9.99,
      albumType: "album",
      featured: true,
    },
    {
      artistId: nawwG.id,
      title: "Concrete Jungle",
      releaseYear: 2024,
      genre: "Hip-Hop",
      price: 9.99,
      albumType: "album",
      featured: true,
    },
    {
      artistId: nawwG.id,
      title: "Urban Anthems",
      releaseYear: 2024,
      genre: "Hip-Hop",
      price: 8.99,
      albumType: "ep",
      featured: false,
    },
    {
      artistId: urbanswave.id,
      title: "Future Funk",
      releaseYear: 2024,
      genre: "Electronic",
      price: 10.99,
      albumType: "album",
      featured: true,
    },
    {
      artistId: systemTheOne.id,
      title: "Digital Shift",
      releaseYear: 2023,
      genre: "Alternative",
      price: 9.99,
      albumType: "album",
      featured: false,
    },
    {
      artistId: unrevealed.id,
      title: "Echoes",
      releaseYear: 2024,
      genre: "Neo-Soul",
      price: 9.99,
      albumType: "album",
      featured: false,
    },
  ]).returning();

  console.log(`Inserted ${albums.length} albums`);

  const [streetPoetry, concreteJungle, urbanAnthems, futureFunk, digitalShift, echoes] = albums;

  // --- TRACKS ---
  const tracks = await db.insert(tracksTable).values([
    // Street Poetry
    { albumId: streetPoetry.id, artistId: nawwG.id, title: "Intro (Street Life)", trackNumber: 1, duration: 142, price: 0.99, streamable: true, featured: false },
    { albumId: streetPoetry.id, artistId: nawwG.id, title: "Brooklyn Nights", trackNumber: 2, duration: 218, price: 0.99, streamable: true, featured: true },
    { albumId: streetPoetry.id, artistId: nawwG.id, title: "Letter to the Block", trackNumber: 3, duration: 244, price: 0.99, streamable: true, featured: false },
    { albumId: streetPoetry.id, artistId: nawwG.id, title: "No Shortcuts", trackNumber: 4, duration: 196, price: 0.99, streamable: true, featured: false },
    { albumId: streetPoetry.id, artistId: nawwG.id, title: "Rise", trackNumber: 5, duration: 221, price: 0.99, streamable: true, featured: true },
    // Concrete Jungle
    { albumId: concreteJungle.id, artistId: nawwG.id, title: "Concrete Jungle (Intro)", trackNumber: 1, duration: 108, price: 0.99, streamable: true, featured: false },
    { albumId: concreteJungle.id, artistId: nawwG.id, title: "Rhythm Of The Night", trackNumber: 2, duration: 245, price: 0.99, streamable: true, featured: true },
    { albumId: concreteJungle.id, artistId: nawwG.id, title: "City Lights", trackNumber: 3, duration: 233, price: 0.99, streamable: true, featured: false },
    { albumId: concreteJungle.id, artistId: nawwG.id, title: "Grind Season", trackNumber: 4, duration: 252, price: 0.99, streamable: true, isExplicit: true, featured: false },
    { albumId: concreteJungle.id, artistId: nawwG.id, title: "Legacy", trackNumber: 5, duration: 267, price: 0.99, streamable: true, featured: true },
    // Urban Anthems
    { albumId: urbanAnthems.id, artistId: nawwG.id, title: "We Made It", trackNumber: 1, duration: 198, price: 0.99, streamable: true, featured: false },
    { albumId: urbanAnthems.id, artistId: nawwG.id, title: "For The Culture", trackNumber: 2, duration: 214, price: 0.99, streamable: true, featured: true },
    { albumId: urbanAnthems.id, artistId: nawwG.id, title: "Anthem", trackNumber: 3, duration: 231, price: 0.99, streamable: true, featured: false },
    // Future Funk
    { albumId: futureFunk.id, artistId: urbanswave.id, title: "Neon Dreams", trackNumber: 1, duration: 272, price: 0.99, streamable: true, featured: true },
    { albumId: futureFunk.id, artistId: urbanswave.id, title: "Synthwave Sunset", trackNumber: 2, duration: 318, price: 0.99, streamable: true, featured: false },
    { albumId: futureFunk.id, artistId: urbanswave.id, title: "Future Funk (Title Track)", trackNumber: 3, duration: 354, price: 0.99, streamable: true, featured: true },
    { albumId: futureFunk.id, artistId: urbanswave.id, title: "Electric Soul", trackNumber: 4, duration: 289, price: 0.99, streamable: true, featured: false },
    { albumId: futureFunk.id, artistId: urbanswave.id, title: "Midnight Drive", trackNumber: 5, duration: 401, price: 0.99, streamable: true, featured: false },
    // Digital Shift
    { albumId: digitalShift.id, artistId: systemTheOne.id, title: "01010101", trackNumber: 1, duration: 187, price: 0.99, streamable: true, featured: false },
    { albumId: digitalShift.id, artistId: systemTheOne.id, title: "Algorithm", trackNumber: 2, duration: 243, price: 0.99, streamable: true, featured: true },
    { albumId: digitalShift.id, artistId: systemTheOne.id, title: "Digital Shift", trackNumber: 3, duration: 311, price: 0.99, streamable: true, featured: false },
    // Echoes
    { albumId: echoes.id, artistId: unrevealed.id, title: "First Light", trackNumber: 1, duration: 264, price: 0.99, streamable: true, featured: false },
    { albumId: echoes.id, artistId: unrevealed.id, title: "Echoes", trackNumber: 2, duration: 298, price: 0.99, streamable: true, featured: true },
    { albumId: echoes.id, artistId: unrevealed.id, title: "Soul Search", trackNumber: 3, duration: 341, price: 0.99, streamable: true, featured: false },
    { albumId: echoes.id, artistId: unrevealed.id, title: "Harmony", trackNumber: 4, duration: 277, price: 0.99, streamable: true, featured: false },
  ]).returning();

  console.log(`Inserted ${tracks.length} tracks`);

  // --- DOCUMENTS ---
  await db.insert(documentsTable).values([
    {
      title: "Executive Summary",
      filename: "Executive_Summary.doc",
      category: "corporate",
      content: `NJAYCO — EXECUTIVE SUMMARY
=====================================
The Najee Jeremiah Company (NJAYCO)
Digital Headquarters | NJAYCO OS v1.0

COMPANY OVERVIEW
----------------
The Najee Jeremiah Company (NJAYCO) is a multi-industry holding company 
and portfolio ecosystem focused on music, technology, education, media, 
digital product design, logistics, and local business infrastructure.

Founded by Najee Jeremiah in New York, NJAYCO operates as the parent 
company for a growing portfolio of products, brands, and businesses.

DIVISIONS
---------
• UV Music Group — Independent record label
• UV EMPIRE — Creative brand umbrella
• Unrevealed Brand — Digital product studio
• YsUp, Inc. — Education technology
• YsUp Campus — Campus networking platform
• Greet Me — Digital greeting platform
• Wax Radio — Music discovery platform
• Denoko — Cooperative innovation platform
• Denoko Taxi — Transportation software
• Howard Unrevealed — Cultural media
• Phone Msgr — Social messaging app
• Frankie's Elite Transport — Transport operations
• Teemer Moving & Storage — Moving technology
• Prom Queen — Lifestyle media brand

REVENUE MODEL
-------------
→ Music sales, streaming, and licensing (UV Music Group)
→ App development and tech services (Unrevealed Brand)
→ EdTech subscriptions and partnerships (YsUp)
→ SaaS software licensing (Denoko Taxi, Teemer)
→ Advertising and sponsorships (Wax Radio, Phone Msgr)
→ Premium memberships and services

VISION
------
NJAYCO is building the infrastructure for a new generation 
of Black-owned enterprises — where technology, culture, and 
community converge into lasting economic value.

For more information: njayco.com
`,
      fileType: "doc",
      public: true,
    },
    {
      title: "Founder Bio",
      filename: "Founder_Bio.pdf",
      category: "corporate",
      content: `NAJEE JEREMIAH — FOUNDER BIO
=====================================
CEO & Founder, The Najee Jeremiah Company (NJAYCO)
BS Computer Science | 10+ Years Experience
=====================================

Najee Jeremiah is a multi-industry entrepreneur, technologist, educator, 
and creative visionary based in New York. He is the founder and CEO of 
The Najee Jeremiah Company (NJAYCO), a multi-industry holding company 
spanning music, education, technology, media, and local business 
infrastructure.

With a background in computer science and over a decade of experience 
building at the intersection of technology and culture, Najee has 
developed products used by students, musicians, entrepreneurs, and 
local businesses across the country.

KEY VENTURES
------------
• UV Music Group — Independent label and music commerce platform
• YsUp, Inc. — Award-winning education technology company
• Unrevealed Brand — Creative technology studio
• NJAYCO OS — Interactive digital headquarters

EXPERTISE
---------
→ Software Architecture & Engineering
→ Music Industry & Artist Development
→ Education Technology & Curriculum Design
→ Brand Development & Creative Direction
→ Business Strategy & Startup Operations
→ Community Development & Social Impact

PHILOSOPHY
----------
"Build systems that outlast you. Create culture that matters.
Serve communities that are underserved. Execute every day."
— Najee Jeremiah

CONTACT
-------
Email: najee@njayco.com
Web: njayco.com
`,
      fileType: "pdf",
      public: true,
    },
    {
      title: "NJAYCO Press Kit",
      filename: "NJAYCO_Press_Kit.pdf",
      category: "press",
      content: `NJAYCO — PRESS KIT
=====================================
Media Resources | The Najee Jeremiah Company
=====================================

ABOUT NJAYCO
------------
The Najee Jeremiah Company (NJAYCO) is a multi-industry holding company
built on the belief that technology, creativity, and community are the 
pillars of lasting economic power.

Founded by Najee Jeremiah, NJAYCO spans music (UV Music Group), 
education (YsUp), technology (Unrevealed Brand), logistics (Denoko Taxi,
Frankie's Elite, Teemer), and media (Wax Radio, Howard Unrevealed).

KEY FACTS
---------
• Founded: 2018
• Headquarters: New York, NY
• Divisions: 14 active/development stage
• Industries: Music, Tech, Education, Logistics, Media
• Founder: Najee Jeremiah (CEO)

MEDIA ASSETS
------------
→ Company logo (available on request)
→ Founder headshots (available on request)  
→ Division brand assets (available on request)
→ Product screenshots (available on request)

PRESS CONTACT
-------------
Email: press@njayco.com
Web: njayco.com/press

NOTE: All press materials subject to approval.
Please submit press inquiries before publication.
`,
      fileType: "pdf",
      public: true,
    },
    {
      title: "Investor Deck 2024",
      filename: "Investor_Deck_2024.ppt",
      category: "investor",
      content: `NJAYCO — INVESTOR DECK 2024
=====================================
Confidential | For Investor Review Only
=====================================

OPPORTUNITY OVERVIEW
--------------------
NJAYCO represents a diversified holding company opportunity 
across high-growth markets: EdTech, Music Tech, Logistics SaaS,
and Social/Messaging applications.

MARKET OPPORTUNITY
------------------
→ EdTech Market: $404B by 2025 (YsUp)
→ Music Tech Market: $25B+ (UV Music Group)
→ Logistics Software: $16B (Denoko Taxi, Teemer)
→ Social Messaging: $108B+ (Phone Msgr)

TRACTION
--------
• YsUp: Active pilot programs in 3+ school districts
• UV Music Group: 4 signed artists, growing catalog
• Unrevealed Brand: Revenue-generating client projects
• NJAYCO OS: Live digital headquarters launch

TEAM
----
CEO: Najee Jeremiah (10+ years tech/music/education)
[Team profiles available upon request]

INVESTMENT USE
--------------
→ 40% — Product development and engineering
→ 25% — Marketing and business development
→ 20% — Operations and infrastructure
→ 15% — Legal, compliance, and admin

CONTACT
-------
Investor Relations: invest@njayco.com
Web: njayco.com/investor
`,
      fileType: "ppt",
      public: false,
    },
    {
      title: "Service Catalog",
      filename: "Service_Catalog.doc",
      category: "services",
      content: `NJAYCO — SERVICE CATALOG
=====================================
Available Services | The Najee Jeremiah Company
=====================================

TECHNOLOGY SERVICES (Unrevealed Brand)
---------------------------------------
→ Custom App Development
   Web, mobile (iOS/Android), and cross-platform
   Timeline: 4-12 weeks | Starting at $5,000

→ Brand Identity & Design Systems
   Logo, typography, color, guidelines, component libraries
   Timeline: 2-4 weeks | Starting at $2,500

→ Website Design & Development
   Custom-built, CMS-powered, e-commerce ready
   Timeline: 2-6 weeks | Starting at $1,500

→ AI-Assisted Rapid Prototyping
   MVP validation and rapid product development
   Timeline: 1-3 weeks | Starting at $3,000

→ Tech Strategy Consulting
   Product roadmaps, architecture review, tech due diligence
   Timeline: Ongoing | Starting at $150/hr

MUSIC SERVICES (UV Music Group)
--------------------------------
→ Music Licensing (sync, commercial, film, TV)
   Contact: licensing@uvmusicgroup.com

→ Artist Development Inquiries
   Contact: artists@uvmusicgroup.com

→ Custom Music Production
   Contact: production@uvmusicgroup.com

EDUCATION TECHNOLOGY (YsUp, Inc.)
----------------------------------
→ School Partnerships
   Pilot programs, district licenses, integration support
   Contact: schools@ysup.co

→ Student Subscriptions
   Premium features, advanced tools
   Visit: ysup.co

LOGISTICS SOLUTIONS
--------------------
→ Dispatch Software (Denoko Taxi)
   White-label SaaS for transportation businesses
   Contact: saas@denoko.com

→ Moving & Logistics Platform (Teemer)
   Tech-powered moving operations
   Contact: ops@teemer.com

TO REQUEST A PROPOSAL
---------------------
Visit: njayco.com/rfp
Email: hello@njayco.com
`,
      fileType: "doc",
      public: true,
    },
    {
      title: "Company Policy",
      filename: "Company_Policy.txt",
      category: "legal",
      content: `NJAYCO — COMPANY POLICY OVERVIEW
=====================================
The Najee Jeremiah Company
Last Updated: October 2024
=====================================

1. PRIVACY POLICY
-----------------
NJAYCO and its divisions are committed to protecting user privacy.
We collect only data necessary for service delivery and never sell
personal information to third parties.

Data we collect:
• Account information (email, name)
• Usage data for product improvement
• Payment information (processed securely via Stripe)

2. TERMS OF SERVICE
-------------------
By using any NJAYCO product or platform, users agree to:
• Use products for their intended lawful purposes
• Respect intellectual property rights
• Not engage in harmful, abusive, or illegal activities

3. INTELLECTUAL PROPERTY
------------------------
All content, music, software, and brand assets created by or 
for NJAYCO are the intellectual property of The Najee Jeremiah 
Company unless otherwise noted.

UV Music Group content is owned by respective artists and labels.
Licensing inquiries: legal@njayco.com

4. ARTIST POLICY (UV Music Group)
----------------------------------
All artists signed to UV Music Group retain ownership of their
master recordings unless otherwise agreed in writing.

5. CONTACT
----------
Legal inquiries: legal@njayco.com
Privacy concerns: privacy@njayco.com
General: hello@njayco.com
`,
      fileType: "txt",
      public: true,
    },
  ]).returning();

  console.log("Documents seeded");
  console.log("✅ NJAYCO OS database seeded successfully!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
