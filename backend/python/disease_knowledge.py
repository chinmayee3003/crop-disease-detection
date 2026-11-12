"""
Disease Knowledge Base & Pathological Profiles
Contains comprehensive botanical and pathological profiles for major crop diseases,
including symptoms, etiology, organic management, and chemical controls.
"""

DISEASE_PROFILES = {
    # TOMATO
    "tomato_early_blight": {
        "id": "tomato_early_blight",
        "crop": "Tomato",
        "disease_name": "Tomato Early Blight",
        "pathogen": "Alternaria solani (Fungus)",
        "status": "Infected",
        "type": "leaf",
        "color_signature": {"h_min": 10, "h_max": 25, "s_min": 60, "v_min": 30, "v_max": 160},
        "texture_profile": {"contrast": 1.4, "homogeneity": 0.45, "entropy": 4.8},
        "symptoms": [
            "Concentric dark brown rings forming characteristic 'target-board' lesions on older leaves.",
            "Yellow chlorotic halos surrounding necrotic spots.",
            "Premature leaf drop and sunscald on exposed fruits.",
            "Stem cankers near the soil line in younger seedlings."
        ],
        "causes": [
            "Prolonged warm, humid weather (24-29°C) combined with leaf wetness from dew or overhead irrigation.",
            "Spore survival in infected plant debris and solanaceous weeds.",
            "Spatter from rainfall spreading soil-borne conidia."
        ],
        "preventive_measures": [
            "Practice minimum 3-year crop rotation with non-solanaceous crops.",
            "Install drip irrigation to keep foliage dry.",
            "Stake and prune tomato vines to promote adequate air circulation.",
            "Apply thick organic straw mulch around plant base to prevent soil splash."
        ],
        "organic_treatments": [
            "Copper octanoate (copper soap) spray at first sight of lower leaf spotting.",
            "Bacillus subtilis bio-fungicide soil drench and foliar mist.",
            "Neem oil (0.5% concentration) combined with potassium bicarbonate (baking soda) spray."
        ],
        "chemical_controls": [
            "Chlorothalonil 75 WP @ 2g/L water at 7-10 day intervals.",
            "Mancozeb 75 WP @ 2.5g/L preventive spray.",
            "Azoxystrobin or Difenoconazole for systemic curative intervention in advanced outbreaks."
        ]
    },
    "tomato_late_blight": {
        "id": "tomato_late_blight",
        "crop": "Tomato",
        "disease_name": "Tomato Late Blight",
        "pathogen": "Phytophthora infestans (Oomycete)",
        "status": "Infected",
        "type": "leaf",
        "color_signature": {"h_min": 18, "h_max": 35, "s_min": 40, "v_min": 25, "v_max": 140},
        "texture_profile": {"contrast": 1.7, "homogeneity": 0.38, "entropy": 5.2},
        "symptoms": [
            "Irregular water-soaked pale green or dark brown lesions rapidly expanding on leaf margins.",
            "Delicate white fuzzy fungal sporulation on leaf undersides in humid conditions.",
            "Petiole and stem girdling turning dark brown to greasy black.",
            "Rapid collapse of entire plant foliage within days under cool wet conditions."
        ],
        "causes": [
            "Cool, moist weather (15-22°C) with relative humidity exceeding 90%.",
            "Airborne sporangia travelling miles on wind currents from infected potato or tomato fields."
        ],
        "preventive_measures": [
            "Select resistant or tolerant cultivars (e.g., Mountain Magic, Defiant PHR).",
            "Eliminate volunteer potato and tomato plants before planting season.",
            "Avoid overhead evening irrigation; maintain wide row spacing.",
            "Destroy and bury severely infected crop residue immediately (do not compost)."
        ],
        "organic_treatments": [
            "Fixed copper hydroxide (Bordeaux mixture 1%) sprayed preventively.",
            "Liquid copper sulfate spray before extended rainfall events.",
            "Compost tea enriched with Trichoderma harzianum as microbial competitor."
        ],
        "chemical_controls": [
            "Metalaxyl-M + Mancozeb (Ridomil Gold) @ 2.5g/L water.",
            "Cymoxanil + Mancozeb (Curzate) @ 3g/L.",
            "Dimethomorph 50 WP @ 1g/L for strong antisporulant activity."
        ]
    },
    "tomato_healthy": {
        "id": "tomato_healthy",
        "crop": "Tomato",
        "disease_name": "Tomato - Healthy Foliage",
        "pathogen": "None (Healthy)",
        "status": "Healthy",
        "type": "leaf",
        "color_signature": {"h_min": 35, "h_max": 85, "s_min": 80, "v_min": 60, "v_max": 240},
        "texture_profile": {"contrast": 0.4, "homogeneity": 0.85, "entropy": 2.6},
        "symptoms": [
            "Vibrant, uniform green coloration across entire leaf surface.",
            "Well-defined venation without chlorosis, necrosis, or mottling.",
            "Turgid leaf lamina free of necrotic lesions, pustules, or powdery films."
        ],
        "causes": [
            "Optimal agronomic conditions: balanced nutrition, adequate moisture, and disease-free environment."
        ],
        "preventive_measures": [
            "Maintain balanced N-P-K fertilization and adequate calcium to prevent blossom end rot.",
            "Continue periodic scouting and maintain good sanitation in the field.",
            "Ensure regular irrigation schedule without waterlogging."
        ],
        "organic_treatments": [
            "Foliar seaweed extract or vermiwash spray to boost plant immunity.",
            "Beneficial mycorrhizal fungi inoculation at root zone."
        ],
        "chemical_controls": [
            "No chemical intervention needed. Maintain preventive cultural hygiene."
        ]
    },

    # POTATO
    "potato_early_blight": {
        "id": "potato_early_blight",
        "crop": "Potato",
        "disease_name": "Potato Early Blight",
        "pathogen": "Alternaria solani",
        "status": "Infected",
        "type": "leaf",
        "color_signature": {"h_min": 12, "h_max": 28, "s_min": 55, "v_min": 35, "v_max": 150},
        "texture_profile": {"contrast": 1.35, "homogeneity": 0.48, "entropy": 4.6},
        "symptoms": [
            "Dark brown to black angular necrotic spots with concentric ring markings.",
            "Spots initially appear on lower senescing leaves and coalesce.",
            "Surrounding leaf tissue turns chlorotic yellow, leading to defoliation."
        ],
        "causes": [
            "Alternating wet and dry weather cycles with temperature 24-30°C.",
            "Stressed plants due to nitrogen deficiency or nematode infestation."
        ],
        "preventive_measures": [
            "Plant certified disease-free seed tubers.",
            "Maintain optimal soil nitrogen and potassium levels throughout tuber bulking.",
            "Practice 3-year crop rotation with non-host crops (cereals, legumes)."
        ],
        "organic_treatments": [
            "Copper oxychloride 50 WP spray.",
            "Bacillus amyloliquefaciens foliar formulation.",
            "Wood ash dust application on dry mornings."
        ],
        "chemical_controls": [
            "Mancozeb 75% WP @ 2.5 kg/ha in 750 L water.",
            "Propineb 70% WP @ 2g/L.",
            "Difenoconazole 25% EC @ 0.5 mL/L."
        ]
    },
    "potato_late_blight": {
        "id": "potato_late_blight",
        "crop": "Potato",
        "disease_name": "Potato Late Blight",
        "pathogen": "Phytophthora infestans",
        "status": "Infected",
        "type": "leaf",
        "color_signature": {"h_min": 16, "h_max": 32, "s_min": 45, "v_min": 20, "v_max": 130},
        "texture_profile": {"contrast": 1.8, "homogeneity": 0.35, "entropy": 5.3},
        "symptoms": [
            "Water-soaked blackish-brown blotches at leaf tips and margins.",
            "White mildew ring around lesions on the underside during humid mornings.",
            "Foul odor in heavily infected potato fields as foliage decomposes.",
            "Brown granular dry rot extending into harvested tubers."
        ],
        "causes": [
            "High relative humidity (>90%) with cool temperatures (12-20°C).",
            "Infected seed tubers providing primary inocula."
        ],
        "preventive_measures": [
            "High ridge hilling to create a physical barrier preventing spores washing down to tubers.",
            "Destroy cull piles and self-sown volunteer plants before emergence.",
            "Desiccate or mow haulms 10-14 days before harvest."
        ],
        "organic_treatments": [
            "Copper hydroxide spray applied prior to forecasted rain events.",
            "Equisetum arvense (Horsetail) decoction rich in natural silica.",
            "Garlic and ginger fermented extract."
        ],
        "chemical_controls": [
            "Cymoxanil 8% + Mancozeb 64% WP @ 2g/L.",
            "Mandipropamid 23.4% SC @ 0.8 mL/L.",
            "Fluopicolide + Propamocarb hydrochloride for severe pressure."
        ]
    },
    "potato_healthy": {
        "id": "potato_healthy",
        "crop": "Potato",
        "disease_name": "Potato - Healthy Leaf",
        "pathogen": "None (Healthy)",
        "status": "Healthy",
        "type": "leaf",
        "color_signature": {"h_min": 36, "h_max": 82, "s_min": 75, "v_min": 70, "v_max": 230},
        "texture_profile": {"contrast": 0.38, "homogeneity": 0.88, "entropy": 2.5},
        "symptoms": [
            "Lush, deep emerald green foliage with smooth, well-defined leaf margins.",
            "No blight spots, necrosis, or edge rolling."
        ],
        "causes": ["Healthy balanced plant physiology and good management."],
        "preventive_measures": [
            "Monitor weekly for early blight or late blight signs.",
            "Maintain soil moisture at 70-80% field capacity."
        ],
        "organic_treatments": ["Apply microbial biostimulant or humic acid foliar spray."],
        "chemical_controls": ["None required."]
    },

    # CORN (MAIZE)
    "corn_common_rust": {
        "id": "corn_common_rust",
        "crop": "Corn (Maize)",
        "disease_name": "Corn Common Rust",
        "pathogen": "Puccinia sorghi (Fungus)",
        "status": "Infected",
        "type": "leaf",
        "color_signature": {"h_min": 8, "h_max": 24, "s_min": 70, "v_min": 50, "v_max": 180},
        "texture_profile": {"contrast": 1.5, "homogeneity": 0.42, "entropy": 4.9},
        "symptoms": [
            "Prominent oval to elongate cinnamon-brown pustules (uredinia) scattered on both leaf surfaces.",
            "Pustules rupture epidermal tissue, releasing powdery reddish-brown spores.",
            "Leaves turn chlorotic and brown as pustules aggregate.",
            "Premature drying of canopy leading to reduced ear filling."
        ],
        "causes": [
            "Moderate temperatures (16-25°C) with high relative humidity and 6+ hours of leaf wetness.",
            "Windblown urediniospores carried northward from tropical or subtropical corn zones."
        ],
        "preventive_measures": [
            "Plant rust-resistant or tolerant corn hybrid cultivars (Rp gene resistance).",
            "Plant early in the season to evade late-season peak spore flights.",
            "Ensure balanced fertilization; avoid excessive nitrogen."
        ],
        "organic_treatments": [
            "Sulfur 80% WDG @ 3g/L spray applied at early vegetative stages.",
            "Neem oil 1% foliar spray to inhibit spore germination.",
            "Potassium silicate spray to strengthen corn leaf epidermal cell walls."
        ],
        "chemical_controls": [
            "Azoxystrobin + Propiconazole (Quilt Xcel) @ 1 mL/L.",
            "Pyraclostrobin (Headline AMP) applied at tasseling (VT stage).",
            "Tebuconazole 25.9% EC @ 1 mL/L."
        ]
    },
    "corn_northern_leaf_blight": {
        "id": "corn_northern_leaf_blight",
        "crop": "Corn (Maize)",
        "disease_name": "Corn Northern Leaf Blight (NCLB)",
        "pathogen": "Exserohilum turcicum (Fungus)",
        "status": "Infected",
        "type": "leaf",
        "color_signature": {"h_min": 14, "h_max": 30, "s_min": 40, "v_min": 40, "v_max": 160},
        "texture_profile": {"contrast": 1.6, "homogeneity": 0.40, "entropy": 5.1},
        "symptoms": [
            "Large, elongated, cigar-shaped grayish-green to tan lesions (2.5 to 15 cm long).",
            "Lesions develop dark olive fungal fuzz on the underside during humid weather.",
            "Lesions coalesce, resulting in complete blighting of corn leaves."
        ],
        "causes": [
            "Extended dew periods and moderate temperatures (18-27°C).",
            "Infected corn stubble left on soil surface from monoculture tillage."
        ],
        "preventive_measures": [
            "Select resistant hybrids with Ht genes.",
            "Deep plow crop debris after harvest to bury overwintering chlamydospores.",
            "Rotate corn with soybeans, sorghum, or small grains."
        ],
        "organic_treatments": [
            "Bio-fungicides containing Bacillus amyloliquefaciens.",
            "Copper oxychloride preventive application before silking."
        ],
        "chemical_controls": [
            "Pyraclostrobin + Fluxapyroxad (Priaxor) @ 0.5 mL/L.",
            "Trifloxystrobin + Tebuconazole (Nativo 75 WG) @ 0.7 g/L."
        ]
    },
    "corn_healthy": {
        "id": "corn_healthy",
        "crop": "Corn (Maize)",
        "disease_name": "Corn - Healthy Leaf",
        "pathogen": "None (Healthy)",
        "status": "Healthy",
        "type": "leaf",
        "color_signature": {"h_min": 38, "h_max": 84, "s_min": 85, "v_min": 80, "v_max": 245},
        "texture_profile": {"contrast": 0.35, "homogeneity": 0.90, "entropy": 2.3},
        "symptoms": [
            "Uniform bright green parallel-veined leaf blade without streaks or pustules.",
            "Robust midrib and sturdy leaf sheath."
        ],
        "causes": ["Optimal soil nutrients and moisture balance."],
        "preventive_measures": [
            "Soil testing to ensure balanced N-P-K and zinc.",
            "Monitor canopy during tasseling and silking."
        ],
        "organic_treatments": ["Foliar zinc and boron micro-nutrient spray during knee-high stage."],
        "chemical_controls": ["No chemical treatment needed."]
    },

    # APPLE
    "apple_scab": {
        "id": "apple_scab",
        "crop": "Apple",
        "disease_name": "Apple Scab",
        "pathogen": "Venturia inaequalis (Fungus)",
        "status": "Infected",
        "type": "leaf",
        "color_signature": {"h_min": 15, "h_max": 34, "s_min": 50, "v_min": 25, "v_max": 120},
        "texture_profile": {"contrast": 1.65, "homogeneity": 0.39, "entropy": 5.0},
        "symptoms": [
            "Olive-green to velvety brown-black circular spots on leaves.",
            "Lesions develop a raised, scabby, or corky texture as they mature.",
            "Affected leaves distort, curl, turn yellow, and drop prematurely.",
            "Dark, rough, cracked scab lesions on developing fruits."
        ],
        "causes": [
            "Prolonged leaf wetness periods in spring (9+ hours wetness at 10-20°C).",
            "Ascospores released from fallen leaves on orchard floor."
        ],
        "preventive_measures": [
            "Plant scab-immune or resistant varieties (e.g., Liberty, Prima, Enterprise).",
            "Shred fallen autumn leaves with a flail mower or apply urea (5%) to speed decomposition.",
            "Prune orchard canopy annually to accelerate leaf drying."
        ],
        "organic_treatments": [
            "Lime sulfur spray during green tip through pink bud stage.",
            "Potassium bicarbonate foliar spray as a mild eradicant.",
            "Liquid sulfur applied immediately before anticipated rainfall."
        ],
        "chemical_controls": [
            "Captan 50 WP @ 2.5g/L or Mancozeb 75 WP @ 2g/L (protectant).",
            "Difenoconazole 25% EC (Score) @ 0.3 mL/L (kickback curative).",
            "Kresoxim-methyl 44.3% SC @ 0.5 mL/L."
        ]
    },
    "apple_black_rot": {
        "id": "apple_black_rot",
        "crop": "Apple",
        "disease_name": "Apple Black Rot (Frogeye Leaf Spot)",
        "pathogen": "Botryosphaeria obtusa",
        "status": "Infected",
        "type": "leaf",
        "color_signature": {"h_min": 10, "h_max": 26, "s_min": 65, "v_min": 20, "v_max": 130},
        "texture_profile": {"contrast": 1.55, "homogeneity": 0.43, "entropy": 4.9},
        "symptoms": [
            "Small purple flecks on leaves expanding into circular tan lesions with purple margins ('frogeye' appearance).",
            "Dead bark cankers on limbs with pycnidia pustules.",
            "Black rotting mummified fruit remaining shriveled on branches."
        ],
        "causes": [
            "Overwintering cankers, mummified fruits, and fire blight struck wood.",
            "Warm temperatures (20-27°C) accompanied by spring rains."
        ],
        "preventive_measures": [
            "Prune out dead wood, cankers, and remove all mummified apples in winter.",
            "Maintain overall tree vigor to resist wood-boring beetle attacks."
        ],
        "organic_treatments": [
            "Copper sulfate dormant spray.",
            "Sulfur protectant sprays during petal fall."
        ],
        "chemical_controls": [
            "Thiophanate-methyl 70 WP @ 1g/L.",
            "Captan 80 WDG @ 1.8g/L.",
            "Flint (Trifloxystrobin 50 WG) @ 0.3g/L."
        ]
    },
    "apple_healthy": {
        "id": "apple_healthy",
        "crop": "Apple",
        "disease_name": "Apple - Healthy Foliage",
        "pathogen": "None (Healthy)",
        "status": "Healthy",
        "type": "leaf",
        "color_signature": {"h_min": 37, "h_max": 80, "s_min": 70, "v_min": 65, "v_max": 220},
        "texture_profile": {"contrast": 0.36, "homogeneity": 0.89, "entropy": 2.4},
        "symptoms": ["Lustrous dark green leaves with serrated borders free from blemishes."],
        "causes": ["Good orchard sanitation and balanced tree nutrition."],
        "preventive_measures": ["Continue dormant pruning and routine orchard inspection."],
        "organic_treatments": ["Apply foliar seaweed extract or fish emulsion during vegetative flushes."],
        "chemical_controls": ["No chemical treatment required."]
    },

    # GRAPE
    "grape_black_rot": {
        "id": "grape_black_rot",
        "crop": "Grape",
        "disease_name": "Grape Black Rot",
        "pathogen": "Guignardia bidwellii (Fungus)",
        "status": "Infected",
        "type": "leaf",
        "color_signature": {"h_min": 12, "h_max": 28, "s_min": 58, "v_min": 25, "v_max": 135},
        "texture_profile": {"contrast": 1.48, "homogeneity": 0.44, "entropy": 4.7},
        "symptoms": [
            "Small circular reddish-brown spots with dark brown margins on leaves.",
            "Tiny black pimple-like pycnidia fruiting bodies visible inside lesions.",
            "Grape berries shrivel into hard, black, wrinkled mummies."
        ],
        "causes": [
            "Warm and rainy weather (20-27°C) with prolonged berry/leaf wetness.",
            "Overwintering mummies left on the vine trellis or vineyard floor."
        ],
        "preventive_measures": [
            "Flail mow or disc vineyard middles to bury infected mummified berries.",
            "Open canopy canopy management through shoot positioning and leaf pulling."
        ],
        "organic_treatments": [
            "Copper octanoate applied from early bloom to veraison.",
            "Lime sulfur dormant spray."
        ],
        "chemical_controls": [
            "Myclobutanil 40 WP (Rally) @ 0.5g/L.",
            "Kresoxim-methyl 500 WG (Sovran) @ 0.4g/L.",
            "Mancozeb 75 WP prior to bloom."
        ]
    },
    "grape_leaf_blight": {
        "id": "grape_leaf_blight",
        "crop": "Grape",
        "disease_name": "Grape Leaf Blight (Isariopsis Spot)",
        "pathogen": "Pseudocercospora clavispora (Fungus)",
        "status": "Infected",
        "type": "leaf",
        "color_signature": {"h_min": 14, "h_max": 32, "s_min": 52, "v_min": 30, "v_max": 145},
        "texture_profile": {"contrast": 1.52, "homogeneity": 0.41, "entropy": 4.85},
        "symptoms": [
            "Angular to irregular dark brown necrotic lesions bound by leaf veins.",
            "Foliage becomes brittle, dries out, and drops prematurely in late summer."
        ],
        "causes": ["High humidity, poor trellis airflow, and late season foliage density."],
        "preventive_measures": ["Canopy thinning to ensure sunlight penetration and rapid drying."],
        "organic_treatments": ["Bordeaux mixture 1% spray post-harvest."],
        "chemical_controls": ["Azoxystrobin 23% SC @ 1 mL/L or Carbendazim 50 WP @ 1g/L."]
    },
    "grape_healthy": {
        "id": "grape_healthy",
        "crop": "Grape",
        "disease_name": "Grape - Healthy Foliage",
        "pathogen": "None (Healthy)",
        "status": "Healthy",
        "type": "leaf",
        "color_signature": {"h_min": 36, "h_max": 82, "s_min": 75, "v_min": 75, "v_max": 235},
        "texture_profile": {"contrast": 0.35, "homogeneity": 0.89, "entropy": 2.4},
        "symptoms": ["Uniform green palmate leaves with healthy lobed margins."],
        "causes": ["Optimal vineyard microclimate and nutrition."],
        "preventive_measures": ["Monitor canopy regularly and maintain proper shoot training."],
        "organic_treatments": ["Foliar micronutrient spray (Mg, Fe, Zn)."],
        "chemical_controls": ["None."]
    },

    # RICE
    "rice_blast": {
        "id": "rice_blast",
        "crop": "Rice",
        "disease_name": "Rice Leaf Blast",
        "pathogen": "Magnaporthe oryzae (Fungus)",
        "status": "Infected",
        "type": "leaf",
        "color_signature": {"h_min": 15, "h_max": 30, "s_min": 45, "v_min": 40, "v_max": 170},
        "texture_profile": {"contrast": 1.6, "homogeneity": 0.42, "entropy": 5.0},
        "symptoms": [
            "Spindle-shaped or eye-shaped lesions with gray-white centers and brownish-red borders.",
            "Lesions enlarge rapidly, coalesce, and cause total blighting of rice seedling leaves.",
            "Neck rot causing unfilled panicles ('whiteheads')."
        ],
        "causes": [
            "Excessive nitrogen fertilizer application.",
            "High relative humidity (>90%) with night temperatures around 20°C."
        ],
        "preventive_measures": [
            "Avoid excessive or late split nitrogen applications; use split doses with silicon.",
            "Maintain continuous shallow flooding in paddy fields.",
            "Use certified blast-resistant varieties."
        ],
        "organic_treatments": [
            "Pseudomonas fluorescens 10g/kg seed treatment and 2.5kg/ha soil application.",
            "Silicon fertilizers (calcium silicate) @ 200 kg/ha to strengthen rice epidermal silica layer."
        ],
        "chemical_controls": [
            "Tricyclazole 75 WP (Beam) @ 0.6g/L water.",
            "Isoprothiolane 40 EC @ 1.5 mL/L.",
            "Kasugamycin 3% SL @ 2 mL/L."
        ]
    },
    "rice_brown_spot": {
        "id": "rice_brown_spot",
        "crop": "Rice",
        "disease_name": "Rice Brown Spot",
        "pathogen": "Bipolaris oryzae (Fungus)",
        "status": "Infected",
        "type": "leaf",
        "color_signature": {"h_min": 10, "h_max": 25, "s_min": 60, "v_min": 35, "v_max": 150},
        "texture_profile": {"contrast": 1.45, "homogeneity": 0.46, "entropy": 4.7},
        "symptoms": [
            "Small, oval to circular dark brown spots resembling sesame seeds.",
            "Lesions show yellow halo surrounding dark brown necrotic centers.",
            "Severe infection leads to poor grain filling and discolored seeds."
        ],
        "causes": [
            "Nutrient-deficient soils (especially low potassium, silicon, or manganese).",
            "Drought stress or poor water management."
        ],
        "preventive_measures": [
            "Correct soil potash and micronutrient deficiencies.",
            "Avoid moisture stress during tillering and flowering stages."
        ],
        "organic_treatments": [
            "Trichoderma viride seed treatment @ 4g/kg seed.",
            "Cow urine extract (5%) spray."
        ],
        "chemical_controls": [
            "Propiconazole 25% EC (Tilt) @ 1 mL/L.",
            "Edifenphos 50% EC @ 1 mL/L."
        ]
    },
    "rice_healthy": {
        "id": "rice_healthy",
        "crop": "Rice",
        "disease_name": "Rice - Healthy Leaf",
        "pathogen": "None (Healthy)",
        "status": "Healthy",
        "type": "leaf",
        "color_signature": {"h_min": 38, "h_max": 82, "s_min": 80, "v_min": 80, "v_max": 240},
        "texture_profile": {"contrast": 0.32, "homogeneity": 0.91, "entropy": 2.2},
        "symptoms": ["Slender upright deep green leaf blades with pristine margins."],
        "causes": ["Balanced nutrition and optimal paddy water level."],
        "preventive_measures": ["Regular monitoring and integrated nutrient management."],
        "organic_treatments": ["Azospirillum and Phosphobacteria biofertilizers."],
        "chemical_controls": ["None."]
    },

    # BELL PEPPER
    "pepper_bacterial_spot": {
        "id": "pepper_bacterial_spot",
        "crop": "Bell Pepper",
        "disease_name": "Bell Pepper Bacterial Spot",
        "pathogen": "Xanthomonas campestris pv. vesicatoria",
        "status": "Infected",
        "type": "leaf",
        "color_signature": {"h_min": 12, "h_max": 28, "s_min": 62, "v_min": 30, "v_max": 155},
        "texture_profile": {"contrast": 1.58, "homogeneity": 0.41, "entropy": 4.95},
        "symptoms": [
            "Small, water-soaked, circular or angular dark brown lesions on foliage.",
            "Lesions often have prominent translucent yellow halos.",
            "Severely spotted leaves turn yellow, scorch, and drop, exposing peppers to sunscald.",
            "Blister-like rough brown warts on pepper pods."
        ],
        "causes": [
            "Warm temperatures (24-30°C) with driving rains or sprinkler irrigation.",
            "Contaminated seed or infected plant debris in the soil."
        ],
        "preventive_measures": [
            "Hot-water seed treatment (50°C for 25 minutes) before sowing.",
            "Use certified disease-resistant pepper varieties (race 1-5 resistant).",
            "Avoid overhead irrigation; use drip tapes under plastic mulch."
        ],
        "organic_treatments": [
            "Copper bactericide combined with Bacillus subtilis.",
            "Agricultural streptomyces or bacteriophage spray."
        ],
        "chemical_controls": [
            "Copper hydroxide + Mancozeb tank mix @ 2g + 2g/L.",
            "Streptomycin sulfate + Tetracycline formulation (where permitted)."
        ]
    },
    "pepper_healthy": {
        "id": "pepper_healthy",
        "crop": "Bell Pepper",
        "disease_name": "Bell Pepper - Healthy Foliage",
        "pathogen": "None (Healthy)",
        "status": "Healthy",
        "type": "leaf",
        "color_signature": {"h_min": 36, "h_max": 82, "s_min": 80, "v_min": 75, "v_max": 235},
        "texture_profile": {"contrast": 0.35, "homogeneity": 0.89, "entropy": 2.35},
        "symptoms": ["Glossy, deep green oval leaves without spots, puckering, or necrotic edges."],
        "causes": ["Good greenhouse/field hygiene and balanced irrigation."],
        "preventive_measures": ["Scout weekly and maintain sanitised pruning shears."],
        "organic_treatments": ["Foliar magnesium sulfate (Epsom salt) 1% spray for chlorophyll synthesis."],
        "chemical_controls": ["None."]
    },

    # ROOT DISEASES (FOR ROOT IMAGES)
    "crop_root_rot": {
        "id": "crop_root_rot",
        "crop": "General Crops (Root System)",
        "disease_name": "Root Rot & Vascular Necrosis",
        "pathogen": "Pythium / Rhizoctonia / Fusarium solani Complex",
        "status": "Infected",
        "type": "root",
        "color_signature": {"h_min": 8, "h_max": 24, "s_min": 50, "v_min": 15, "v_max": 110},
        "texture_profile": {"contrast": 1.75, "homogeneity": 0.36, "entropy": 5.4},
        "symptoms": [
            "Dark brown, slimy, water-soaked rot on primary taproot and feeder roots.",
            "Sloughing off of root cortex leaving bare vascular thread (root stripping).",
            "Stunted root biomass, lack of healthy white root tips.",
            "Above-ground wilting despite wet soil, leaf chlorosis, and sudden collapse."
        ],
        "causes": [
            "Poor soil drainage, persistent waterlogging, and soil compaction.",
            "Soil-borne fungal oomycete pathogens surviving in stagnant wet soil."
        ],
        "preventive_measures": [
            "Improve soil drainage with raised beds or subsoiling to break hardpan.",
            "Incorporate organic compost to foster aerobic beneficial microflora.",
            "Ensure proper irrigation interval, letting root zone aerate between waterings."
        ],
        "organic_treatments": [
            "Trichoderma harzianum or Trichoderma viride biological root dip @ 10g/L.",
            "Hydrogen peroxide (3% dilute 1:10) soil flush for minor root hypoxia.",
            "Bacillus subtilis root inoculation at transplanting."
        ],
        "chemical_controls": [
            "Metalaxyl 35% WS seed / root drench @ 2g/L.",
            "Carbendazim + Mancozeb (Saaf) root drench @ 2.5g/L.",
            "Fosetyl-Al (Aliette) @ 2.5g/L systemic drench."
        ]
    },
    "crop_root_healthy": {
        "id": "crop_root_healthy",
        "crop": "General Crops (Root System)",
        "disease_name": "Healthy Root System",
        "pathogen": "None (Healthy)",
        "status": "Healthy",
        "type": "root",
        "color_signature": {"h_min": 18, "h_max": 38, "s_min": 25, "v_min": 120, "v_max": 245},
        "texture_profile": {"contrast": 0.45, "homogeneity": 0.82, "entropy": 2.8},
        "symptoms": [
            "Crisp, firm, creamy-white to light-tan root branches.",
            "Prolific fine root hairs and healthy root cap elongation zones.",
            "Clean earthy aroma with no foul decay odor or slimy sloughing."
        ],
        "causes": ["Well-aerated soil structure, balanced moisture, and beneficial rhizosphere biology."],
        "preventive_measures": [
            "Avoid over-watering; ensure free drainage holes in nursery containers.",
            "Maintain loose, crumbly soil structure with adequate aeration."
        ],
        "organic_treatments": ["Apply mycorrhizal bio-inoculants to maximize root surface uptake."],
        "chemical_controls": ["No treatment required."]
    }
}
