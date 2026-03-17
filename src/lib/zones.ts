import type { Zone } from "@/types/announcement";

type ZoneDef = Omit<Zone, "activeAnnouncements">;

/** Helper — génère automatiquement le oneSignalTag depuis l'id */
function z(
  id: string,
  name: string,
  city: string,
  countryCode: string,
  countryName: string
): ZoneDef {
  return {
    id,
    name,
    city,
    countryCode,
    countryName,
    oneSignalTag: `zone_${id.replace(/-/g, "_")}`,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// PAYS  (BFA en premier, puis alphabétique)
// ─────────────────────────────────────────────────────────────────────────────

export const COUNTRIES: { code: string; name: string; flag: string }[] = [
  { code: "BFA", name: "Burkina Faso", flag: "🇧🇫" },
  { code: "BEN", name: "Bénin", flag: "🇧🇯" },
  { code: "CIV", name: "Côte d'Ivoire", flag: "🇨🇮" },
  { code: "MLI", name: "Mali", flag: "🇲🇱" },
  { code: "NER", name: "Niger", flag: "🇳🇪" },
  { code: "SEN", name: "Sénégal", flag: "🇸🇳" },
  { code: "TGO", name: "Togo", flag: "🇹🇬" },
];

// Villes par pays (ordre de priorité / taille)
export const CITIES_BY_COUNTRY: Record<string, string[]> = {
  BFA: [
    "Ouagadougou",
    "Bobo-Dioulasso",
    "Koudougou",
    "Banfora",
    "Ouahigouya",
    "Fada N'Gourma",
    "Kaya",
    "Dédougou",
    "Ziniaré",
    "Tenkodogo",
    "Gaoua",
    "Dori",
  ],
  BEN: [
    "Cotonou",
    "Porto-Novo",
    "Abomey-Calavi",
    "Parakou",
    "Bohicon",
    "Natitingou",
  ],
  CIV: [
    "Abidjan",
    "Bouaké",
    "Yamoussoukro",
    "Daloa",
    "Korhogo",
    "Man",
    "San-Pédro",
    "Gagnoa",
  ],
  MLI: ["Bamako", "Sikasso", "Ségou", "Mopti", "Kayes", "Koutiala"],
  NER: ["Niamey", "Zinder", "Maradi", "Agadez", "Tahoua", "Dosso"],
  SEN: [
    "Dakar",
    "Thiès",
    "Saint-Louis",
    "Ziguinchor",
    "Kaolack",
    "Mbour",
    "Tambacounda",
  ],
  TGO: ["Lomé", "Sokodé", "Kara", "Kpalimé", "Atakpamé", "Tsévié"],
};

// ─────────────────────────────────────────────────────────────────────────────
// ZONES
// ─────────────────────────────────────────────────────────────────────────────

export const ZONES: ZoneDef[] = [
  // ── BURKINA FASO ── Ouagadougou ──────────────────────────────────────────
  z("bfa-ouaga-pissy",       "Pissy",             "Ouagadougou", "BFA", "Burkina Faso"),
  z("bfa-ouaga-gounghin",    "Gounghin",          "Ouagadougou", "BFA", "Burkina Faso"),
  z("bfa-ouaga-karpala",     "Karpala",           "Ouagadougou", "BFA", "Burkina Faso"),
  z("bfa-ouaga-samandin",    "Samandin",          "Ouagadougou", "BFA", "Burkina Faso"),
  z("bfa-ouaga-tanghin",     "Tanghin-Dassouri",  "Ouagadougou", "BFA", "Burkina Faso"),
  z("bfa-ouaga-zogona",      "Zogona",            "Ouagadougou", "BFA", "Burkina Faso"),
  z("bfa-ouaga-ouaga2000",   "Ouaga 2000",        "Ouagadougou", "BFA", "Burkina Faso"),
  z("bfa-ouaga-patte-doie",  "Patte d'Oie",       "Ouagadougou", "BFA", "Burkina Faso"),
  z("bfa-ouaga-dassasgo",    "Dassasgo",          "Ouagadougou", "BFA", "Burkina Faso"),
  z("bfa-ouaga-nongr-massom","Nongr-Massom",      "Ouagadougou", "BFA", "Burkina Faso"),
  z("bfa-ouaga-wemtenga",    "Wemtenga",          "Ouagadougou", "BFA", "Burkina Faso"),
  z("bfa-ouaga-cissin",      "Cissin",            "Ouagadougou", "BFA", "Burkina Faso"),
  z("bfa-ouaga-hamdalaye",   "Hamdalaye",         "Ouagadougou", "BFA", "Burkina Faso"),
  z("bfa-ouaga-bogodogo",    "Bogodogo",          "Ouagadougou", "BFA", "Burkina Faso"),
  z("bfa-ouaga-larle",       "Larlé",             "Ouagadougou", "BFA", "Burkina Faso"),
  z("bfa-ouaga-tampouy",     "Tampouy",           "Ouagadougou", "BFA", "Burkina Faso"),
  z("bfa-ouaga-nioko",       "Nioko 2",           "Ouagadougou", "BFA", "Burkina Faso"),
  z("bfa-ouaga-sig-nonghin", "Sig-Nonghin",       "Ouagadougou", "BFA", "Burkina Faso"),
  z("bfa-ouaga-boulmiougou", "Boulmiougou",       "Ouagadougou", "BFA", "Burkina Faso"),
  z("bfa-ouaga-dapoya",      "Dapoya",            "Ouagadougou", "BFA", "Burkina Faso"),
  z("bfa-ouaga-wayalghin",   "Wayalghin",         "Ouagadougou", "BFA", "Burkina Faso"),
  z("bfa-ouaga-peuloghin",   "Peuloghin",         "Ouagadougou", "BFA", "Burkina Faso"),
  z("bfa-ouaga-bendogo",     "Bendogo",           "Ouagadougou", "BFA", "Burkina Faso"),
  z("bfa-ouaga-goughin-naba","Gounghin-Naba",     "Ouagadougou", "BFA", "Burkina Faso"),
  z("bfa-ouaga-kossodo",     "Kossodo",           "Ouagadougou", "BFA", "Burkina Faso"),
  z("bfa-ouaga-bassinko",    "Bassinko",          "Ouagadougou", "BFA", "Burkina Faso"),

  // ── BURKINA FASO ── Bobo-Dioulasso ───────────────────────────────────────
  z("bfa-bobo-centre",       "Centre (Dô/Konsa)", "Bobo-Dioulasso", "BFA", "Burkina Faso"),
  z("bfa-bobo-koko",         "Kôkô",              "Bobo-Dioulasso", "BFA", "Burkina Faso"),
  z("bfa-bobo-guimbi",       "Guimbi",            "Bobo-Dioulasso", "BFA", "Burkina Faso"),
  z("bfa-bobo-accart-ville", "Accart-Ville",      "Bobo-Dioulasso", "BFA", "Burkina Faso"),
  z("bfa-bobo-sarfalao",     "Sarfalao",          "Bobo-Dioulasso", "BFA", "Burkina Faso"),
  z("bfa-bobo-dogona",       "Dogona",            "Bobo-Dioulasso", "BFA", "Burkina Faso"),
  z("bfa-bobo-colsama",      "Colsama",           "Bobo-Dioulasso", "BFA", "Burkina Faso"),
  z("bfa-bobo-tounouma",     "Tounouma",          "Bobo-Dioulasso", "BFA", "Burkina Faso"),
  z("bfa-bobo-ouezzinville", "Ouezzinville",      "Bobo-Dioulasso", "BFA", "Burkina Faso"),
  z("bfa-bobo-sect25",       "Secteur 25",        "Bobo-Dioulasso", "BFA", "Burkina Faso"),

  // ── BURKINA FASO ── Autres villes ────────────────────────────────────────
  z("bfa-koudougou-centre",  "Centre",   "Koudougou",    "BFA", "Burkina Faso"),
  z("bfa-koudougou-sect1",   "Secteur 1","Koudougou",    "BFA", "Burkina Faso"),
  z("bfa-koudougou-sect5",   "Secteur 5","Koudougou",    "BFA", "Burkina Faso"),
  z("bfa-koudougou-lalle",   "Lallé",    "Koudougou",    "BFA", "Burkina Faso"),

  z("bfa-banfora-centre",    "Centre",   "Banfora",      "BFA", "Burkina Faso"),
  z("bfa-banfora-sect1",     "Secteur 1","Banfora",      "BFA", "Burkina Faso"),

  z("bfa-ouahigouya-centre", "Centre",   "Ouahigouya",   "BFA", "Burkina Faso"),
  z("bfa-ouahigouya-sect2",  "Secteur 2","Ouahigouya",   "BFA", "Burkina Faso"),
  z("bfa-ouahigouya-sect6",  "Secteur 6","Ouahigouya",   "BFA", "Burkina Faso"),

  z("bfa-fada-centre",       "Centre",   "Fada N'Gourma","BFA", "Burkina Faso"),
  z("bfa-fada-sect1",        "Secteur 1","Fada N'Gourma","BFA", "Burkina Faso"),

  z("bfa-kaya-centre",       "Centre",   "Kaya",         "BFA", "Burkina Faso"),
  z("bfa-kaya-sect2",        "Secteur 2","Kaya",         "BFA", "Burkina Faso"),

  z("bfa-dedougou-centre",   "Centre",   "Dédougou",     "BFA", "Burkina Faso"),
  z("bfa-ziniare-centre",    "Centre",   "Ziniaré",      "BFA", "Burkina Faso"),
  z("bfa-tenkodogo-centre",  "Centre",   "Tenkodogo",    "BFA", "Burkina Faso"),
  z("bfa-gaoua-centre",      "Centre",   "Gaoua",        "BFA", "Burkina Faso"),
  z("bfa-dori-centre",       "Centre",   "Dori",         "BFA", "Burkina Faso"),

  // ── BÉNIN ── Cotonou ─────────────────────────────────────────────────────
  z("ben-cotonou-cadjehoun", "Cadjehoun",   "Cotonou", "BEN", "Bénin"),
  z("ben-cotonou-akpakpa",   "Akpakpa",     "Cotonou", "BEN", "Bénin"),
  z("ben-cotonou-menontin",  "Menontin",    "Cotonou", "BEN", "Bénin"),
  z("ben-cotonou-fidjrosse", "Fidjrossè",   "Cotonou", "BEN", "Bénin"),
  z("ben-cotonou-godomey",   "Godomey",     "Cotonou", "BEN", "Bénin"),
  z("ben-cotonou-agla",      "Agla",        "Cotonou", "BEN", "Bénin"),
  z("ben-cotonou-zogbo",     "Zogbo",       "Cotonou", "BEN", "Bénin"),
  z("ben-cotonou-ganhi",     "Ganhi",       "Cotonou", "BEN", "Bénin"),
  z("ben-cotonou-missebo",   "Missèbo",     "Cotonou", "BEN", "Bénin"),
  z("ben-cotonou-jericho",   "Jéricho",     "Cotonou", "BEN", "Bénin"),
  z("ben-cotonou-avotrou",   "Avotrou",     "Cotonou", "BEN", "Bénin"),
  z("ben-cotonou-stjean",    "Saint-Jean",  "Cotonou", "BEN", "Bénin"),

  // ── BÉNIN ── Autres villes ────────────────────────────────────────────────
  z("ben-porto-novo-centre", "Centre",   "Porto-Novo",     "BEN", "Bénin"),
  z("ben-porto-novo-ouando", "Ouando",   "Porto-Novo",     "BEN", "Bénin"),
  z("ben-porto-novo-tokpota","Tokpota",  "Porto-Novo",     "BEN", "Bénin"),
  z("ben-porto-novo-dowa",   "Dowa",     "Porto-Novo",     "BEN", "Bénin"),

  z("ben-abomey-centre",     "Centre",   "Abomey-Calavi",  "BEN", "Bénin"),
  z("ben-abomey-togba",      "Togba",    "Abomey-Calavi",  "BEN", "Bénin"),
  z("ben-abomey-kpanroun",   "Kpanroun", "Abomey-Calavi",  "BEN", "Bénin"),

  z("ben-parakou-centre",    "Centre",          "Parakou", "BEN", "Bénin"),
  z("ben-parakou-zone-ind",  "Zone Industrielle","Parakou", "BEN", "Bénin"),
  z("ben-parakou-madecali",  "Madécali",        "Parakou", "BEN", "Bénin"),

  z("ben-bohicon-centre",    "Centre",      "Bohicon",     "BEN", "Bénin"),
  z("ben-bohicon-agongointo","Agongointo",  "Bohicon",     "BEN", "Bénin"),

  z("ben-natitingou-centre", "Centre",      "Natitingou",  "BEN", "Bénin"),
  z("ben-natitingou-kossou", "Kossou",      "Natitingou",  "BEN", "Bénin"),

  // ── CÔTE D'IVOIRE ── Abidjan ─────────────────────────────────────────────
  z("civ-abidjan-cocody",      "Cocody",      "Abidjan", "CIV", "Côte d'Ivoire"),
  z("civ-abidjan-plateau",     "Plateau",     "Abidjan", "CIV", "Côte d'Ivoire"),
  z("civ-abidjan-yopougon",    "Yopougon",    "Abidjan", "CIV", "Côte d'Ivoire"),
  z("civ-abidjan-abobo",       "Abobo",       "Abidjan", "CIV", "Côte d'Ivoire"),
  z("civ-abidjan-adjame",      "Adjamé",      "Abidjan", "CIV", "Côte d'Ivoire"),
  z("civ-abidjan-marcory",     "Marcory",     "Abidjan", "CIV", "Côte d'Ivoire"),
  z("civ-abidjan-treichville", "Treichville", "Abidjan", "CIV", "Côte d'Ivoire"),
  z("civ-abidjan-koumassi",    "Koumassi",    "Abidjan", "CIV", "Côte d'Ivoire"),
  z("civ-abidjan-port-bouet",  "Port-Bouët",  "Abidjan", "CIV", "Côte d'Ivoire"),
  z("civ-abidjan-attecoubeé",  "Attécoubé",   "Abidjan", "CIV", "Côte d'Ivoire"),
  z("civ-abidjan-bingerville", "Bingerville", "Abidjan", "CIV", "Côte d'Ivoire"),
  z("civ-abidjan-songon",      "Songon",      "Abidjan", "CIV", "Côte d'Ivoire"),
  z("civ-abidjan-anyama",      "Anyama",      "Abidjan", "CIV", "Côte d'Ivoire"),

  // ── CÔTE D'IVOIRE ── Autres villes ───────────────────────────────────────
  z("civ-bouake-centre",       "Centre",         "Bouaké",       "CIV", "Côte d'Ivoire"),
  z("civ-bouake-koko",         "Kôkô",           "Bouaké",       "CIV", "Côte d'Ivoire"),
  z("civ-bouake-gonfreville",  "Gonfreville",    "Bouaké",       "CIV", "Côte d'Ivoire"),
  z("civ-bouake-nimbo",        "Nimbo",          "Bouaké",       "CIV", "Côte d'Ivoire"),
  z("civ-bouake-air-france",   "Air France",     "Bouaké",       "CIV", "Côte d'Ivoire"),

  z("civ-yamousso-centre",     "Centre",         "Yamoussoukro", "CIV", "Côte d'Ivoire"),
  z("civ-yamousso-dioulakro",  "Dioulakro",      "Yamoussoukro", "CIV", "Côte d'Ivoire"),
  z("civ-yamousso-habitat",    "Habitat",        "Yamoussoukro", "CIV", "Côte d'Ivoire"),

  z("civ-daloa-centre",        "Centre",         "Daloa",        "CIV", "Côte d'Ivoire"),
  z("civ-daloa-lobia",         "Lobia",          "Daloa",        "CIV", "Côte d'Ivoire"),

  z("civ-korhogo-centre",      "Centre",         "Korhogo",      "CIV", "Côte d'Ivoire"),
  z("civ-korhogo-koko",        "Kôkô",           "Korhogo",      "CIV", "Côte d'Ivoire"),
  z("civ-korhogo-soba",        "Soba",           "Korhogo",      "CIV", "Côte d'Ivoire"),

  z("civ-man-centre",          "Centre",         "Man",          "CIV", "Côte d'Ivoire"),
  z("civ-man-libreville",      "Libreville",     "Man",          "CIV", "Côte d'Ivoire"),

  z("civ-san-pedro-centre",    "Centre",         "San-Pédro",    "CIV", "Côte d'Ivoire"),
  z("civ-san-pedro-bardo",     "Bardo",          "San-Pédro",    "CIV", "Côte d'Ivoire"),

  z("civ-gagnoa-centre",       "Centre",         "Gagnoa",       "CIV", "Côte d'Ivoire"),
  z("civ-gagnoa-dioulakro",    "Dioulakro",      "Gagnoa",       "CIV", "Côte d'Ivoire"),

  // ── MALI ── Bamako ────────────────────────────────────────────────────────
  z("mli-bamako-c1",           "Commune I — Banconi",      "Bamako", "MLI", "Mali"),
  z("mli-bamako-c2",           "Commune II — Niarela",     "Bamako", "MLI", "Mali"),
  z("mli-bamako-c3",           "Commune III — Bamako-Coura","Bamako","MLI", "Mali"),
  z("mli-bamako-c4",           "Commune IV — Hamdallaye",  "Bamako", "MLI", "Mali"),
  z("mli-bamako-c5",           "Commune V — Bougouba",     "Bamako", "MLI", "Mali"),
  z("mli-bamako-c6",           "Commune VI — Sogoniko",    "Bamako", "MLI", "Mali"),
  z("mli-bamako-kalaban",      "Kalaban-Coura",            "Bamako", "MLI", "Mali"),
  z("mli-bamako-falade",       "Faladié",                  "Bamako", "MLI", "Mali"),
  z("mli-bamako-magnambougou", "Magnambougou",             "Bamako", "MLI", "Mali"),

  // ── MALI ── Autres villes ─────────────────────────────────────────────────
  z("mli-sikasso-centre",      "Centre",      "Sikasso",  "MLI", "Mali"),
  z("mli-sikasso-lafiabougou", "Lafiabougou", "Sikasso",  "MLI", "Mali"),
  z("mli-sikasso-wayerema",    "Wayérema",    "Sikasso",  "MLI", "Mali"),

  z("mli-segou-centre",        "Centre",      "Ségou",    "MLI", "Mali"),
  z("mli-segou-medina",        "Médina",      "Ségou",    "MLI", "Mali"),

  z("mli-mopti-centre",        "Centre",      "Mopti",    "MLI", "Mali"),
  z("mli-mopti-sevare",        "Sévaré",      "Mopti",    "MLI", "Mali"),

  z("mli-kayes-centre",        "Centre",      "Kayes",    "MLI", "Mali"),
  z("mli-kayes-plateau",       "Plateau",     "Kayes",    "MLI", "Mali"),

  z("mli-koutiala-centre",     "Centre",      "Koutiala", "MLI", "Mali"),

  // ── NIGER ── Niamey ───────────────────────────────────────────────────────
  z("ner-niamey-plateau",      "Plateau",    "Niamey", "NER", "Niger"),
  z("ner-niamey-kalley",       "Kalley",     "Niamey", "NER", "Niger"),
  z("ner-niamey-madina",       "Madina",     "Niamey", "NER", "Niger"),
  z("ner-niamey-recasement",   "Recasement", "Niamey", "NER", "Niger"),
  z("ner-niamey-yantala",      "Yantala",    "Niamey", "NER", "Niger"),
  z("ner-niamey-boukoki",      "Boukoki",    "Niamey", "NER", "Niger"),
  z("ner-niamey-lazaret",      "Lazaret",    "Niamey", "NER", "Niger"),
  z("ner-niamey-rive-droite",  "Rive Droite","Niamey", "NER", "Niger"),
  z("ner-niamey-saga",         "Saga",       "Niamey", "NER", "Niger"),
  z("ner-niamey-talladje",     "Talladié",   "Niamey", "NER", "Niger"),

  // ── NIGER ── Autres villes ────────────────────────────────────────────────
  z("ner-zinder-centre",       "Centre", "Zinder", "NER", "Niger"),
  z("ner-zinder-birni",        "Birni",  "Zinder", "NER", "Niger"),
  z("ner-zinder-zengou",       "Zengou", "Zinder", "NER", "Niger"),

  z("ner-maradi-centre",       "Centre",     "Maradi", "NER", "Niger"),
  z("ner-maradi-zaria",        "Zaria",      "Maradi", "NER", "Niger"),
  z("ner-maradi-dan-goulbi",   "Dan Goulbi", "Maradi", "NER", "Niger"),

  z("ner-agadez-centre",       "Centre", "Agadez", "NER", "Niger"),
  z("ner-agadez-azel",         "Azel",   "Agadez", "NER", "Niger"),

  z("ner-tahoua-centre",       "Centre", "Tahoua", "NER", "Niger"),
  z("ner-tahoua-konni",        "Konni",  "Tahoua", "NER", "Niger"),

  z("ner-dosso-centre",        "Centre", "Dosso",  "NER", "Niger"),

  // ── SÉNÉGAL ── Dakar ──────────────────────────────────────────────────────
  z("sen-dakar-plateau",       "Plateau",             "Dakar", "SEN", "Sénégal"),
  z("sen-dakar-medina",        "Médina",              "Dakar", "SEN", "Sénégal"),
  z("sen-dakar-gueule-tapee",  "Gueule-Tapée",        "Dakar", "SEN", "Sénégal"),
  z("sen-dakar-fann",          "Fann",                "Dakar", "SEN", "Sénégal"),
  z("sen-dakar-almadies",      "Almadies",            "Dakar", "SEN", "Sénégal"),
  z("sen-dakar-parcelles",     "Parcelles Assainies", "Dakar", "SEN", "Sénégal"),
  z("sen-dakar-grand-dakar",   "Grand-Dakar",         "Dakar", "SEN", "Sénégal"),
  z("sen-dakar-guediawaye",    "Guédiawaye",          "Dakar", "SEN", "Sénégal"),
  z("sen-dakar-pikine",        "Pikine",              "Dakar", "SEN", "Sénégal"),
  z("sen-dakar-rufisque",      "Rufisque",            "Dakar", "SEN", "Sénégal"),
  z("sen-dakar-yoff",          "Yoff",                "Dakar", "SEN", "Sénégal"),
  z("sen-dakar-ngor",          "Ngor",                "Dakar", "SEN", "Sénégal"),
  z("sen-dakar-ouakam",        "Ouakam",              "Dakar", "SEN", "Sénégal"),
  z("sen-dakar-liberte",       "Liberté",             "Dakar", "SEN", "Sénégal"),

  // ── SÉNÉGAL ── Autres villes ──────────────────────────────────────────────
  z("sen-thies-centre",        "Centre",      "Thiès",         "SEN", "Sénégal"),
  z("sen-thies-cite",          "Cité Lamy",   "Thiès",         "SEN", "Sénégal"),
  z("sen-thies-randoulene",    "Randoulène",  "Thiès",         "SEN", "Sénégal"),

  z("sen-saint-louis-centre",  "Centre",      "Saint-Louis",   "SEN", "Sénégal"),
  z("sen-saint-louis-sor",     "Sor",         "Saint-Louis",   "SEN", "Sénégal"),
  z("sen-saint-louis-guet-ndar","Guet Ndar",  "Saint-Louis",   "SEN", "Sénégal"),

  z("sen-ziguinchor-centre",   "Centre",      "Ziguinchor",    "SEN", "Sénégal"),
  z("sen-ziguinchor-boucotte", "Boucotte",    "Ziguinchor",    "SEN", "Sénégal"),
  z("sen-ziguinchor-lyndiane", "Lyndiane",    "Ziguinchor",    "SEN", "Sénégal"),

  z("sen-kaolack-centre",      "Centre",      "Kaolack",       "SEN", "Sénégal"),
  z("sen-kaolack-medina-baye", "Médina Baye", "Kaolack",       "SEN", "Sénégal"),

  z("sen-mbour-centre",        "Centre",      "Mbour",         "SEN", "Sénégal"),
  z("sen-tambacounda-centre",  "Centre",      "Tambacounda",   "SEN", "Sénégal"),

  // ── TOGO ── Lomé ──────────────────────────────────────────────────────────
  z("tgo-lome-tokoin",         "Tokoin",        "Lomé", "TGO", "Togo"),
  z("tgo-lome-be",             "Bè",            "Lomé", "TGO", "Togo"),
  z("tgo-lome-agbalepedogan",  "Agbalépédogan", "Lomé", "TGO", "Togo"),
  z("tgo-lome-adidogome",      "Adidogomé",     "Lomé", "TGO", "Togo"),
  z("tgo-lome-agoe",           "Agoè",          "Lomé", "TGO", "Togo"),
  z("tgo-lome-amoutive",       "Amoutivé",      "Lomé", "TGO", "Togo"),
  z("tgo-lome-nyekonakpoe",    "Nyékonakpoè",   "Lomé", "TGO", "Togo"),
  z("tgo-lome-baguida",        "Baguida",       "Lomé", "TGO", "Togo"),
  z("tgo-lome-plateau",        "Lomé-Plateau",  "Lomé", "TGO", "Togo"),
  z("tgo-lome-kodjoviakope",   "Kodjoviakopé",  "Lomé", "TGO", "Togo"),
  z("tgo-lome-anfame",         "Anfamé",        "Lomé", "TGO", "Togo"),
  z("tgo-lome-devego",         "Dévégo",        "Lomé", "TGO", "Togo"),

  // ── TOGO ── Autres villes ─────────────────────────────────────────────────
  z("tgo-sokode-centre",       "Centre",     "Sokodé",   "TGO", "Togo"),
  z("tgo-sokode-karouna",      "Karouna",    "Sokodé",   "TGO", "Togo"),
  z("tgo-sokode-kassena",      "Kasséna",    "Sokodé",   "TGO", "Togo"),

  z("tgo-kara-centre",         "Centre",     "Kara",     "TGO", "Togo"),
  z("tgo-kara-kpelou",         "Kpèlou",     "Kara",     "TGO", "Togo"),

  z("tgo-kpalime-centre",      "Centre",     "Kpalimé",  "TGO", "Togo"),
  z("tgo-kpalime-agou",        "Agou Nyogbo","Kpalimé",  "TGO", "Togo"),

  z("tgo-atakpame-centre",     "Centre",     "Atakpamé", "TGO", "Togo"),
  z("tgo-atakpame-adeta",      "Adéta",      "Atakpamé", "TGO", "Togo"),

  z("tgo-tsevie-centre",       "Centre",     "Tsévié",   "TGO", "Togo"),
];

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTS UTILITAIRES
// ─────────────────────────────────────────────────────────────────────────────

/** Lookup par ID */
export function getZoneById(id: string): ZoneDef | undefined {
  return ZONES.find((z) => z.id === id);
}

/** Zones groupées par ville — utilisé dans les pages existantes */
export const ZONES_BY_CITY: Record<string, ZoneDef[]> = ZONES.reduce(
  (acc, zone) => {
    if (!acc[zone.city]) acc[zone.city] = [];
    acc[zone.city].push(zone);
    return acc;
  },
  {} as Record<string, ZoneDef[]>
);

/** Zones groupées par pays → ville — utilisé dans la page /zones */
export const ZONES_BY_COUNTRY: Record<
  string,
  { name: string; flag: string; cities: Record<string, ZoneDef[]> }
> = ZONES.reduce(
  (acc, zone) => {
    if (!acc[zone.countryCode]) {
      const country = COUNTRIES.find((c) => c.code === zone.countryCode);
      acc[zone.countryCode] = {
        name: zone.countryName,
        flag: country?.flag ?? "",
        cities: {},
      };
    }
    if (!acc[zone.countryCode].cities[zone.city]) {
      acc[zone.countryCode].cities[zone.city] = [];
    }
    acc[zone.countryCode].cities[zone.city].push(zone);
    return acc;
  },
  {} as Record<string, { name: string; flag: string; cities: Record<string, ZoneDef[]> }>
);
