export const companyData = {
  name: "Royal Haven Realty & Property Managers Ltd.",
  shortName: "Royal Haven",
  domain: "royalhaven.com.ng",
  tagline: "Excellence in Property. Royalty in Service.",
  motto: "Building Trust. Managing Excellence. Creating Value.",
  phones: ["08153785297", "08120850733"],
  formattedPhones: ["+234 815 378 5297", "+234 812 085 0733"],
  whatsapp: "2348153785297",
  email: "info@royalhaven.com.ng",
  locations: [
    { city: "Lagos", state: "Lagos State", country: "Nigeria", region: "Lagos State & Surrounding Environs" },
    { city: "Ogun", state: "Ogun State", country: "Nigeria", region: "Ogun State & Surrounding Environs" }
  ],
  socials: {
    facebook: "https://facebook.com/royalhavenrealty",
    instagram: "https://instagram.com/royalhavenrealty",
    linkedin: "https://linkedin.com/company/royalhavenrealty"
  },
  // Feature flag to keep property sales / portfolio section hidden as requested
  showPortfolio: false,

  pillars: [
    { label: "Trust", value: "Building Trust" },
    { label: "Excellence", value: "Managing Excellence" },
    { label: "Value", value: "Creating Value" },
    { label: "Service", value: "Royalty in Service" }
  ],
  about: {
    title: "ABOUT ROYAL HAVEN",
    subtitle: "Professional Property Management & Real Estate Solutions",
    description: "Royal Haven Realty & Property Managers Ltd. is a professional real estate and property management company committed to delivering reliable, transparent, and value-driven property solutions.",
    quote: "Building Trust. Managing Excellence. Creating Value.",
    vision: "To be the most trusted and preferred real estate and property management company in Nigeria, setting the standard for excellence, innovation, and value creation in the industry.",
    mission: "To deliver world-class real estate and property management solutions that maximize value, protect investments, ensure peace of mind, and build long-term relationships with our clients."
  },
  values: [
    {
      title: "INTEGRITY",
      description: "We do the right thing, always."
    },
    {
      title: "PROFESSIONALISM",
      description: "We uphold the highest standards in everything we do."
    },
    {
      title: "TRANSPARENCY",
      description: "We believe in clear communication and honest dealings."
    },
    {
      title: "ACCOUNTABILITY",
      description: "We take responsibility and deliver on our promises."
    },
    {
      title: "EXCELLENCE",
      description: "We are committed to continuous improvement and outstanding results."
    },
    {
      title: "CLIENT SATISFACTION",
      description: "We put our clients' needs first and exceed expectations."
    }
  ],
  services: [
    {
      id: "property-management",
      title: "PROPERTY MANAGEMENT",
      icon: "Building2",
      description: "We manage your property with professionalism, transparency, and maximum care to ensure value and peace of mind.",
      features: ["Professional upkeep & care", "Day-to-day oversight", "Regular property reporting", "Peace of mind for owners"]
    },
    {
      id: "property-sales",
      title: "PROPERTY SALES",
      icon: "Home",
      description: "We help you buy or sell properties quickly and at the best value through effective marketing and industry expertise.",
      features: ["Targeted property marketing", "Buyer & seller connections", "Best value negotiation", "Industry expertise"]
    },
    {
      id: "lettings-leasing",
      title: "LETTINGS & LEASING",
      icon: "Key",
      description: "We connect landlords with quality tenants and handle all leasing processes professionally and efficiently.",
      features: ["Landlord & tenant matching", "Leasing documentation", "Efficient lease execution", "Professional tenant relations"]
    },
    {
      id: "surveying-valuation",
      title: "ESTATE SURVEYING & VALUATION",
      icon: "Compass",
      description: "We provide accurate survey and valuation reports to support informed decisions and secure property investments.",
      features: ["Accurate survey reports", "Valuation assessments", "Investment decision support", "Asset verification"]
    },
    {
      id: "tenant-screening",
      title: "TENANT SCREENING",
      icon: "UserCheck",
      description: "We conduct thorough background checks to ensure reliable tenants and protect your investments.",
      features: ["Thorough background checks", "Document verification", "Reliable tenant selection", "Investment protection"]
    },
    {
      id: "property-documentation",
      title: "PROPERTY DOCUMENTATION",
      icon: "FileText",
      description: "We handle documentation and verification with accuracy, ensuring your property is legally protected.",
      features: ["Legal verification", "Document handling", "Accuracy & compliance", "Legal property protection"]
    },
    {
      id: "property-inspection",
      title: "PROPERTY INSPECTION",
      icon: "ClipboardCheck",
      description: "We carry out regular property inspections and provide reports to maintain standards and prevent issues.",
      features: ["Regular physical inspections", "Detailed condition reports", "Preventative maintenance", "Standard enforcement"]
    },
    {
      id: "real-estate-advisory",
      title: "REAL ESTATE ADVISORY",
      icon: "TrendingUp",
      description: "We provide expert advice on real estate investments, market trends, and strategies to grow your portfolio.",
      features: ["Expert investment advice", "Market trend analysis", "Portfolio growth strategies", "Tailored guidance"]
    }
  ],
  leadership: [
    {
      name: "Managing Director / CEO",
      title: "Chief Executive Officer",
      role: "Strategic Vision & Executive Leadership",
      images: ["/images/team/ceo-1.jpg", "/images/team/ceo-2.jpg"],
      bio: "Leading Royal Haven Realty & Property Managers Ltd. with dedication to excellence, transparency, and client satisfaction across Nigeria.",
      quote: "Every property under our care is managed with the same level of commitment as if it were our own."
    },
    {
      name: "Associate Partner",
      title: "Associate Partner",
      role: "Operations & Client Relations",
      images: ["/images/team/partner.jpg"],
      bio: "Overseeing management operations, client relations, and ensuring professional service delivery on all client properties.",
      quote: "Your Property. Our Responsibility. Your Peace of Mind."
    }
  ],
  process: [
    {
      step: "01",
      title: "Initial Consultation",
      description: "We understand your goals, evaluate your property needs, and provide expert guidance on the best management strategy."
    },
    {
      step: "02",
      title: "Property Inspection",
      description: "We conduct a thorough inspection and evaluation to determine the property's condition, value, and management requirements."
    },
    {
      step: "03",
      title: "Agreement & Onboarding",
      description: "We agree on terms, sign the management agreement, and onboard your property into our management system."
    },
    {
      step: "04",
      title: "Tenant Selection",
      description: "We market your property, screen tenants thoroughly, verify documents, and select reliable tenants that protect your investment."
    },
    {
      step: "05",
      title: "Property Management",
      description: "We handle rent collection, maintenance, repairs, inspections, compliance, and all day-to-day management activities."
    },
    {
      step: "06",
      title: "Reporting & Rent Remittance",
      description: "We provide regular reports and financial statements, and remit rent to you promptly and transparently."
    }
  ],
  testimonials: [
    {
      name: "Mrs. B. Adebayo",
      role: "Property Owner",
      location: "Lekki, Lagos",
      comment: "Royal Haven has been exceptional in managing my properties. Their team is professional, transparent, and always responsive.",
      rating: 5
    },
    {
      name: "Mr. T. Okonkwo",
      role: "Property Owner",
      location: "Victoria Island, Lagos",
      comment: "Since partnering with Royal Haven, my rental income has improved and I no longer worry about day-to-day management.",
      rating: 5
    },
    {
      name: "Engr. K. Salami",
      role: "Property Owner",
      location: "Ikeja, Lagos",
      comment: "Their attention to detail, regular reporting, and tenant management service is second to none.",
      rating: 5
    }
  ]
};
