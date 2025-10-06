import type { UnitCategory, CustomCategory } from "../types";

const u = (id: string, label: string, symbol: string | undefined, factorToBase: number) => ({
  id,
  label,
  symbol,
  toBase: (x: number) => x * factorToBase,
  fromBase: (x: number) => x / factorToBase,
});

export const fitnessCategories: UnitCategory[] = [
  {
    id: "body-weight",
    group: "Other",
    name: "Body Weight & Composition",
    description: "Weight units, body fat percentage, and body composition metrics",
    icon: "Scale",
    baseUnit: "kg",
    units: [
      // Weight units
      u("kg", "Kilograms", "kg", 1),
      u("g", "Grams", "g", 0.001),
      u("lb", "Pounds", "lb", 0.453592),
      u("oz", "Ounces", "oz", 0.0283495),
      u("stone", "Stone", "st", 6.35029),
      u("ton-metric", "Metric Ton", "t", 1000),
      u("ton-us", "US Ton", "ton", 907.185),
      
      // Body fat measurements (percentage-based)
      u("bf-percent", "Body Fat %", "BF%", 1), // Base reference
      u("lean-mass-kg", "Lean Body Mass (kg)", "LBM kg", 1),
      u("lean-mass-lb", "Lean Body Mass (lb)", "LBM lb", 0.453592),
    ],
    popularPairs: [["kg","lb"],["lb","kg"],["stone","kg"],["g","oz"],["bf-percent","lean-mass-kg"],["ton-metric","kg"]],
  },
  {
    id: "calories-nutrition",
    group: "Other", 
    name: "Calories & Nutrition",
    description: "Calorie calculations, macronutrients, and nutritional energy units",
    icon: "Apple",
    baseUnit: "cal",
    units: [
      // Energy/Calorie units
      u("cal", "Calories (kcal)", "cal", 1),
      u("kcal", "Kilocalories", "kcal", 1), // Same as cal
      u("cal-small", "Small calories", "cal", 0.001), // gram calorie
      u("kJ", "Kilojoules", "kJ", 0.239006), // 1 kJ = 0.239 kcal
      u("J", "Joules", "J", 0.000239006),
      u("BTU", "British Thermal Units", "BTU", 0.252164),
      
      // Macronutrient energy
      u("protein-g", "Protein (4 cal/g)", "Protein g", 4), // 4 calories per gram
      u("carbs-g", "Carbohydrates (4 cal/g)", "Carbs g", 4), // 4 calories per gram  
      u("fat-g", "Fat (9 cal/g)", "Fat g", 9), // 9 calories per gram
      u("alcohol-g", "Alcohol (7 cal/g)", "Alcohol g", 7), // 7 calories per gram
      u("fiber-g", "Fiber (2 cal/g)", "Fiber g", 2), // ~2 calories per gram
      
      // Daily calorie needs estimates
      u("bmr-male", "BMR Adult Male (~1800)", "BMR♂", 1800),
      u("bmr-female", "BMR Adult Female (~1500)", "BMR♀", 1500),
      u("active-male", "Active Male (~2500)", "Active♂", 2500),
      u("active-female", "Active Female (~2000)", "Active♀", 2000),
      u("athlete-male", "Athlete Male (~3500)", "Athlete♂", 3500),
      u("athlete-female", "Athlete Female (~2800)", "Athlete♀", 2800),
      
      // Food portions
      u("serving-100g", "Per 100g serving", "100g", 1), // Reference serving
      u("serving-cup", "Per cup (~240ml)", "cup", 1),
      u("serving-tbsp", "Per tablespoon (~15ml)", "tbsp", 0.0625), // 1/16 cup
      u("serving-tsp", "Per teaspoon (~5ml)", "tsp", 0.0208), // 1/48 cup
    ],
    popularPairs: [["cal","kJ"],["protein-g","cal"],["carbs-g","cal"],["fat-g","cal"],["bmr-male","cal"],["serving-100g","cal"]],
  },
  {
    id: "heart-rate-fitness",
    group: "Other",
    name: "Heart Rate & Fitness Zones", 
    description: "Heart rate zones, fitness metrics, and cardiovascular measurements",
    icon: "Heart",
    baseUnit: "bpm",
    units: [
      // Heart rate zones (BPM - beats per minute)
      u("bpm", "Beats Per Minute", "BPM", 1),
      u("resting-hr", "Resting HR (60-80)", "Rest HR", 70), // Average resting
      u("fat-burn-zone", "Fat Burn Zone (60-70% max)", "Fat Burn", 130), // ~130 BPM for 30yr old
      u("cardio-zone", "Cardio Zone (70-80% max)", "Cardio", 145), // ~145 BPM
      u("peak-zone", "Peak Zone (80-90% max)", "Peak", 160), // ~160 BPM
      u("max-hr-30yr", "Max HR Age 30 (~190)", "MaxHR 30", 190),
      u("max-hr-40yr", "Max HR Age 40 (~180)", "MaxHR 40", 180),
      u("max-hr-50yr", "Max HR Age 50 (~170)", "MaxHR 50", 170),
      
      // VO2 Max measurements (ml/kg/min)
      u("vo2max", "VO2 Max (ml/kg/min)", "VO2 Max", 1),
      u("vo2max-excellent-m", "VO2 Excellent Male (>52)", "Excellent♂", 55),
      u("vo2max-excellent-f", "VO2 Excellent Female (>42)", "Excellent♀", 45),
      u("vo2max-good-m", "VO2 Good Male (42-52)", "Good♂", 47),
      u("vo2max-good-f", "VO2 Good Female (33-42)", "Good♀", 37.5),
      u("vo2max-average-m", "VO2 Average Male (35-42)", "Average♂", 38.5),
      u("vo2max-average-f", "VO2 Average Female (27-33)", "Average♀", 30),
      
      // Exercise intensity
      u("mets", "METs (Metabolic Equivalent)", "METs", 1), // 1 MET = resting metabolic rate
      u("mets-light", "Light Activity (2-3 METs)", "Light", 2.5),
      u("mets-moderate", "Moderate Activity (3-6 METs)", "Moderate", 4.5), 
      u("mets-vigorous", "Vigorous Activity (6+ METs)", "Vigorous", 7.5),
    ],
    popularPairs: [["bpm","max-hr-30yr"],["resting-hr","fat-burn-zone"],["cardio-zone","peak-zone"],["vo2max","mets"],["mets-moderate","cal"],["max-hr-40yr","cardio-zone"]],
  },

  {
    id: "body-measurements",
    group: "Other",
    name: "Body Measurements",
    description: "Height, body measurements, and anthropometric conversions",
    icon: "Ruler",
    baseUnit: "cm",
    units: [
      // Height/length measurements
      u("cm", "Centimeters", "cm", 1),
      u("m", "Meters", "m", 100),
      u("mm", "Millimeters", "mm", 0.1),
      u("in", "Inches", "in", 2.54),
      u("ft", "Feet", "ft", 30.48),
      u("ft-in", "Feet and Inches", "ft'in\"", 30.48), // For height like 5'10"
      
      // Body circumference measurements
      u("chest-cm", "Chest (cm)", "Chest", 1),
      u("chest-in", "Chest (inches)", "Chest\"", 2.54),
      u("waist-cm", "Waist (cm)", "Waist", 1),
      u("waist-in", "Waist (inches)", "Waist\"", 2.54),
      u("hip-cm", "Hip (cm)", "Hip", 1),
      u("hip-in", "Hip (inches)", "Hip\"", 2.54),
      u("thigh-cm", "Thigh (cm)", "Thigh", 1),
      u("thigh-in", "Thigh (inches)", "Thigh\"", 2.54),
      u("bicep-cm", "Bicep (cm)", "Bicep", 1),
      u("bicep-in", "Bicep (inches)", "Bicep\"", 2.54),
      u("neck-cm", "Neck (cm)", "Neck", 1),
      u("neck-in", "Neck (inches)", "Neck\"", 2.54),
      
      // Body fat measurement locations
      u("skinfold-mm", "Skinfold (mm)", "Skinfold", 0.1),
      u("body-fat-percent", "Body Fat Percentage", "BF%", 1),
      
      // Reach and span
      u("arm-span-cm", "Arm Span (cm)", "Span", 1),
      u("arm-span-in", "Arm Span (inches)", "Span\"", 2.54),
      u("reach-cm", "Reach (cm)", "Reach", 1),
      u("reach-in", "Reach (inches)", "Reach\"", 2.54),
    ],
    popularPairs: [["cm","in"],["ft","cm"],["chest-cm","chest-in"],["waist-cm","waist-in"],["m","ft"],["mm","in"]],
  },
  {
    id: "running-cycling",
    group: "Other", 
    name: "Running & Cycling",
    description: "Pace, speed, distance, and endurance sports measurements",
    icon: "Bike",
    baseUnit: "min-per-km",
    units: [
      // Pace measurements (time per distance)
      u("min-per-km", "Minutes per Kilometer", "min/km", 1),
      u("min-per-mile", "Minutes per Mile", "min/mi", 0.621371), // 1 km = 0.621 miles
      u("sec-per-100m", "Seconds per 100m", "s/100m", 0.006), // 100m pace
      u("sec-per-400m", "Seconds per 400m", "s/400m", 0.024), // Track 400m
      
      // Speed measurements
      u("kmh", "Kilometers per Hour", "km/h", 1),
      u("mph", "Miles per Hour", "mph", 1.60934),
      u("ms", "Meters per Second", "m/s", 3.6), // 1 m/s = 3.6 km/h
      
      // Common running paces
      u("easy-pace", "Easy Pace (~6:00/km)", "Easy", 6.0),
      u("tempo-pace", "Tempo Pace (~4:30/km)", "Tempo", 4.5),
      u("5k-pace", "5K Race Pace (~4:00/km)", "5K", 4.0),
      u("10k-pace", "10K Race Pace (~4:15/km)", "10K", 4.25),
      u("half-marathon-pace", "Half Marathon Pace (~4:45/km)", "Half", 4.75),
      u("marathon-pace", "Marathon Pace (~5:00/km)", "Marathon", 5.0),
      
      // Cycling power zones
      u("watts-cycling", "Watts (Cycling)", "W", 1),
      u("zone1-recovery", "Zone 1 Recovery (<150W)", "Z1", 125),
      u("zone2-endurance", "Zone 2 Endurance (150-210W)", "Z2", 180),
      u("zone3-tempo", "Zone 3 Tempo (210-270W)", "Z3", 240),
      u("zone4-threshold", "Zone 4 Threshold (270-330W)", "Z4", 300),
      u("zone5-vo2max", "Zone 5 VO2Max (330-400W)", "Z5", 365),
      u("zone6-anaerobic", "Zone 6 Anaerobic (400W+)", "Z6", 450),
      
      // Distance measurements
      u("km", "Kilometers", "km", 1),
      u("mile", "Miles", "mi", 1.60934),
      u("m-distance", "Meters", "m", 0.001),
      u("marathon-distance", "Marathon (42.195km)", "Marathon", 42.195),
      u("half-marathon-distance", "Half Marathon (21.1km)", "Half", 21.0975),
      u("10k-distance", "10K (10km)", "10K", 10),
      u("5k-distance", "5K (5km)", "5K", 5),
    ],
    popularPairs: [["min-per-km","min-per-mile"],["kmh","mph"],["5k-pace","10k-pace"],["easy-pace","tempo-pace"],["zone2-endurance","zone4-threshold"],["km","mile"]],
  },
];

export const fitnessCustomCategories: CustomCategory[] = [
  { 
    id: "bmi-calculator", 
    group: "Other", 
    name: "BMI Calculator", 
    description: "Calculate Body Mass Index from height and weight with health categories", 
    icon: "Calculator", 
    custom: true 
  },
];