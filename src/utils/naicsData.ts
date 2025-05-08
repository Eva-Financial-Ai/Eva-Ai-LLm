// NAICS (North American Industry Classification System) Codes
// Top level industry sectors (2-digit codes) and sub-industry categories

export interface NAICSSubcode {
  code: string;
  title: string;
}

export interface NAICSIndustry {
  code: string;
  title: string;
  subcodes: NAICSSubcode[];
}

// A selection of major NAICS industry categories with subcodes
export const naicsIndustries: NAICSIndustry[] = [
  {
    code: "11",
    title: "Agriculture, Forestry, Fishing and Hunting",
    subcodes: [
      { code: "111", title: "Crop Production" },
      { code: "112", title: "Animal Production and Aquaculture" },
      { code: "113", title: "Forestry and Logging" },
      { code: "114", title: "Fishing, Hunting and Trapping" },
      { code: "115", title: "Support Activities for Agriculture and Forestry" }
    ]
  },
  {
    code: "21",
    title: "Mining, Quarrying, and Oil and Gas Extraction",
    subcodes: [
      { code: "211", title: "Oil and Gas Extraction" },
      { code: "212", title: "Mining (except Oil and Gas)" },
      { code: "213", title: "Support Activities for Mining" }
    ]
  },
  {
    code: "22",
    title: "Utilities",
    subcodes: [
      { code: "221", title: "Utilities" }
    ]
  },
  {
    code: "23",
    title: "Construction",
    subcodes: [
      { code: "236", title: "Construction of Buildings" },
      { code: "237", title: "Heavy and Civil Engineering Construction" },
      { code: "238", title: "Specialty Trade Contractors" }
    ]
  },
  {
    code: "31-33",
    title: "Manufacturing",
    subcodes: [
      { code: "311", title: "Food Manufacturing" },
      { code: "312", title: "Beverage and Tobacco Product Manufacturing" },
      { code: "313", title: "Textile Mills" },
      { code: "314", title: "Textile Product Mills" },
      { code: "315", title: "Apparel Manufacturing" },
      { code: "316", title: "Leather and Allied Product Manufacturing" },
      { code: "321", title: "Wood Product Manufacturing" },
      { code: "322", title: "Paper Manufacturing" },
      { code: "323", title: "Printing and Related Support Activities" },
      { code: "324", title: "Petroleum and Coal Products Manufacturing" },
      { code: "325", title: "Chemical Manufacturing" },
      { code: "326", title: "Plastics and Rubber Products Manufacturing" },
      { code: "327", title: "Nonmetallic Mineral Product Manufacturing" },
      { code: "331", title: "Primary Metal Manufacturing" },
      { code: "332", title: "Fabricated Metal Product Manufacturing" },
      { code: "333", title: "Machinery Manufacturing" },
      { code: "334", title: "Computer and Electronic Product Manufacturing" },
      { code: "335", title: "Electrical Equipment, Appliance, and Component Manufacturing" },
      { code: "336", title: "Transportation Equipment Manufacturing" },
      { code: "337", title: "Furniture and Related Product Manufacturing" },
      { code: "339", title: "Miscellaneous Manufacturing" }
    ]
  },
  {
    code: "42",
    title: "Wholesale Trade",
    subcodes: [
      { code: "423", title: "Merchant Wholesalers, Durable Goods" },
      { code: "424", title: "Merchant Wholesalers, Nondurable Goods" },
      { code: "425", title: "Wholesale Electronic Markets and Agents and Brokers" }
    ]
  },
  {
    code: "44-45",
    title: "Retail Trade",
    subcodes: [
      { code: "441", title: "Motor Vehicle and Parts Dealers" },
      { code: "442", title: "Furniture and Home Furnishings Stores" },
      { code: "443", title: "Electronics and Appliance Stores" },
      { code: "444", title: "Building Material and Garden Equipment and Supplies Dealers" },
      { code: "445", title: "Food and Beverage Stores" },
      { code: "446", title: "Health and Personal Care Stores" },
      { code: "447", title: "Gasoline Stations" },
      { code: "448", title: "Clothing and Clothing Accessories Stores" },
      { code: "451", title: "Sporting Goods, Hobby, Musical Instrument, and Book Stores" },
      { code: "452", title: "General Merchandise Stores" },
      { code: "453", title: "Miscellaneous Store Retailers" },
      { code: "454", title: "Nonstore Retailers" }
    ]
  },
  {
    code: "48-49",
    title: "Transportation and Warehousing",
    subcodes: [
      { code: "481", title: "Air Transportation" },
      { code: "482", title: "Rail Transportation" },
      { code: "483", title: "Water Transportation" },
      { code: "484", title: "Truck Transportation" },
      { code: "485", title: "Transit and Ground Passenger Transportation" },
      { code: "486", title: "Pipeline Transportation" },
      { code: "487", title: "Scenic and Sightseeing Transportation" },
      { code: "488", title: "Support Activities for Transportation" },
      { code: "491", title: "Postal Service" },
      { code: "492", title: "Couriers and Messengers" },
      { code: "493", title: "Warehousing and Storage" }
    ]
  },
  {
    code: "51",
    title: "Information",
    subcodes: [
      { code: "511", title: "Publishing Industries (except Internet)" },
      { code: "512", title: "Motion Picture and Sound Recording Industries" },
      { code: "515", title: "Broadcasting (except Internet)" },
      { code: "517", title: "Telecommunications" },
      { code: "518", title: "Data Processing, Hosting, and Related Services" },
      { code: "519", title: "Other Information Services" }
    ]
  },
  {
    code: "52",
    title: "Finance and Insurance",
    subcodes: [
      { code: "521", title: "Monetary Authorities-Central Bank" },
      { code: "522", title: "Credit Intermediation and Related Activities" },
      { code: "523", title: "Securities, Commodity Contracts, and Other Financial Investments" },
      { code: "524", title: "Insurance Carriers and Related Activities" },
      { code: "525", title: "Funds, Trusts, and Other Financial Vehicles" }
    ]
  },
  {
    code: "53",
    title: "Real Estate and Rental and Leasing",
    subcodes: [
      { code: "531", title: "Real Estate" },
      { code: "532", title: "Rental and Leasing Services" },
      { code: "533", title: "Lessors of Nonfinancial Intangible Assets" }
    ]
  },
  {
    code: "54",
    title: "Professional, Scientific, and Technical Services",
    subcodes: [
      { code: "541", title: "Professional, Scientific, and Technical Services" }
    ]
  },
  {
    code: "55",
    title: "Management of Companies and Enterprises",
    subcodes: [
      { code: "551", title: "Management of Companies and Enterprises" }
    ]
  },
  {
    code: "56",
    title: "Administrative and Support and Waste Management and Remediation Services",
    subcodes: [
      { code: "561", title: "Administrative and Support Services" },
      { code: "562", title: "Waste Management and Remediation Services" }
    ]
  },
  {
    code: "61",
    title: "Educational Services",
    subcodes: [
      { code: "611", title: "Educational Services" }
    ]
  },
  {
    code: "62",
    title: "Health Care and Social Assistance",
    subcodes: [
      { code: "621", title: "Ambulatory Health Care Services" },
      { code: "622", title: "Hospitals" },
      { code: "623", title: "Nursing and Residential Care Facilities" },
      { code: "624", title: "Social Assistance" }
    ]
  },
  {
    code: "71",
    title: "Arts, Entertainment, and Recreation",
    subcodes: [
      { code: "711", title: "Performing Arts, Spectator Sports, and Related Industries" },
      { code: "712", title: "Museums, Historical Sites, and Similar Institutions" },
      { code: "713", title: "Amusement, Gambling, and Recreation Industries" }
    ]
  },
  {
    code: "72",
    title: "Accommodation and Food Services",
    subcodes: [
      { code: "721", title: "Accommodation" },
      { code: "722", title: "Food Services and Drinking Places" }
    ]
  },
  {
    code: "81",
    title: "Other Services (except Public Administration)",
    subcodes: [
      { code: "811", title: "Repair and Maintenance" },
      { code: "812", title: "Personal and Laundry Services" },
      { code: "813", title: "Religious, Grantmaking, Civic, Professional Organizations" },
      { code: "814", title: "Private Households" }
    ]
  },
  {
    code: "92",
    title: "Public Administration",
    subcodes: [
      { code: "921", title: "Executive, Legislative, and General Government" },
      { code: "922", title: "Justice, Public Order, and Safety Activities" },
      { code: "923", title: "Administration of Human Resource Programs" },
      { code: "924", title: "Administration of Environmental Quality Programs" },
      { code: "925", title: "Administration of Housing Programs, Urban Planning" },
      { code: "926", title: "Administration of Economic Programs" },
      { code: "927", title: "Space Research and Technology" },
      { code: "928", title: "National Security and International Affairs" }
    ]
  }
]; 