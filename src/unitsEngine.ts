import { UNIT_CATEGORIES } from "./unitsData";
import { Unit, UnitCategory, ConversionResult, SearchIntent } from "./types";

// Synonym lookup table to cleanly identify user input
const SYNONYMS: { [key: string]: { categoryId: string; unitId: string } } = {
  // Length
  "m": { categoryId: "length", unitId: "m" },
  "meter": { categoryId: "length", unitId: "m" },
  "meters": { categoryId: "length", unitId: "m" },
  "cm": { categoryId: "length", unitId: "cm" },
  "centimeter": { categoryId: "length", unitId: "cm" },
  "centimeters": { categoryId: "length", unitId: "cm" },
  "mm": { categoryId: "length", unitId: "mm" },
  "millimeter": { categoryId: "length", unitId: "mm" },
  "millimeters": { categoryId: "length", unitId: "mm" },
  "km": { categoryId: "length", unitId: "km" },
  "kilometer": { categoryId: "length", unitId: "km" },
  "kilometers": { categoryId: "length", unitId: "km" },
  "dm": { categoryId: "length", unitId: "dm" },
  "decimeter": { categoryId: "length", unitId: "dm" },
  "decimeters": { categoryId: "length", unitId: "dm" },
  "micrometer": { categoryId: "length", unitId: "micrometer" },
  "micrometers": { categoryId: "length", unitId: "micrometer" },
  "inch": { categoryId: "length", unitId: "inch" },
  "inches": { categoryId: "length", unitId: "inch" },
  "in": { categoryId: "length", unitId: "inch" },
  "\"": { categoryId: "length", unitId: "inch" },
  "foot": { categoryId: "length", unitId: "foot" },
  "feet": { categoryId: "length", unitId: "foot" },
  "ft": { categoryId: "length", unitId: "foot" },
  "'": { categoryId: "length", unitId: "foot" },
  "yard": { categoryId: "length", unitId: "yard" },
  "yards": { categoryId: "length", unitId: "yard" },
  "yd": { categoryId: "length", unitId: "yard" },
  "mile": { categoryId: "length", unitId: "mile" },
  "miles": { categoryId: "length", unitId: "mile" },
  "mi": { categoryId: "length", unitId: "mile" },
  "nmi": { categoryId: "length", unitId: "mile_nautical" },
  "nautical mile": { categoryId: "length", unitId: "mile_nautical" },
  "nautical miles": { categoryId: "length", unitId: "mile_nautical" },
  "ly": { categoryId: "length", unitId: "light_year" },
  "light year": { categoryId: "length", unitId: "light_year" },
  "light years": { categoryId: "length", unitId: "light_year" },

  // Weight
  "kg": { categoryId: "weight", unitId: "kg" },
  "kilogram": { categoryId: "weight", unitId: "kg" },
  "kilograms": { categoryId: "weight", unitId: "kg" },
  "kilo": { categoryId: "weight", unitId: "kg" },
  "kilos": { categoryId: "weight", unitId: "kg" },
  "g": { categoryId: "weight", unitId: "g" },
  "gram": { categoryId: "weight", unitId: "g" },
  "grams": { categoryId: "weight", unitId: "g" },
  "mg": { categoryId: "weight", unitId: "mg" },
  "milligram": { categoryId: "weight", unitId: "mg" },
  "milligrams": { categoryId: "weight", unitId: "mg" },
  "mcg": { categoryId: "weight", unitId: "mcg" },
  "microgram": { categoryId: "weight", unitId: "mcg" },
  "micrograms": { categoryId: "weight", unitId: "mcg" },
  "ton": { categoryId: "weight", unitId: "ton" },
  "tons": { categoryId: "weight", unitId: "ton" },
  "metric ton": { categoryId: "weight", unitId: "ton" },
  "metric tons": { categoryId: "weight", unitId: "ton" },
  "t": { categoryId: "weight", unitId: "ton" },
  "lb": { categoryId: "weight", unitId: "pound" },
  "lbs": { categoryId: "weight", unitId: "pound" },
  "pound": { categoryId: "weight", unitId: "pound" },
  "pounds": { categoryId: "weight", unitId: "pound" },
  "oz": { categoryId: "weight", unitId: "ounce" },
  "ounce": { categoryId: "weight", unitId: "ounce" },
  "ounces": { categoryId: "weight", unitId: "ounce" },
  "stone": { categoryId: "weight", unitId: "stone" },
  "stones": { categoryId: "weight", unitId: "stone" },
  "st": { categoryId: "weight", unitId: "stone" },
  "carat": { categoryId: "weight", unitId: "carat" },
  "carats": { categoryId: "weight", unitId: "carat" },
  "ct": { categoryId: "weight", unitId: "carat" },

  // Temperature
  "c": { categoryId: "temperature", unitId: "C" },
  "celsius": { categoryId: "temperature", unitId: "C" },
  "centigrade": { categoryId: "temperature", unitId: "C" },
  "f": { categoryId: "temperature", unitId: "F" },
  "fahrenheit": { categoryId: "temperature", unitId: "F" },
  "k": { categoryId: "temperature", unitId: "K" },
  "kelvin": { categoryId: "temperature", unitId: "K" },
  "kelvins": { categoryId: "temperature", unitId: "K" },
  "r": { categoryId: "temperature", unitId: "R" },
  "rankine": { categoryId: "temperature", unitId: "R" },

  // Volume
  "l": { categoryId: "volume", unitId: "L" },
  "liter": { categoryId: "volume", unitId: "L" },
  "liters": { categoryId: "volume", unitId: "L" },
  "ml": { categoryId: "volume", unitId: "ml" },
  "milliliter": { categoryId: "volume", unitId: "ml" },
  "milliliters": { categoryId: "volume", unitId: "ml" },
  "gallon": { categoryId: "volume", unitId: "gallon" },
  "gallons": { categoryId: "volume", unitId: "gallon" },
  "gal": { categoryId: "volume", unitId: "gallon" },
  "quart": { categoryId: "volume", unitId: "quart" },
  "quarts": { categoryId: "volume", unitId: "quart" },
  "qt": { categoryId: "volume", unitId: "quart" },
  "pint": { categoryId: "volume", unitId: "pint" },
  "pints": { categoryId: "volume", unitId: "pint" },
  "pt": { categoryId: "volume", unitId: "pint" },
  "cup": { categoryId: "volume", unitId: "cup" },
  "cups": { categoryId: "volume", unitId: "cup" },
  "fl oz": { categoryId: "volume", unitId: "fl_oz" },
  "fluid ounce": { categoryId: "volume", unitId: "fl_oz" },
  "fluid ounces": { categoryId: "volume", unitId: "fl_oz" },
  "tbsp": { categoryId: "volume", unitId: "tbsp" },
  "tablespoon": { categoryId: "volume", unitId: "tbsp" },
  "tablespoons": { categoryId: "volume", unitId: "tbsp" },
  "tsp": { categoryId: "volume", unitId: "tsp" },
  "teaspoon": { categoryId: "volume", unitId: "tsp" },
  "teaspoons": { categoryId: "volume", unitId: "tsp" },

  // Area
  "m2": { categoryId: "area", unitId: "m2" },
  "square meter": { categoryId: "area", unitId: "m2" },
  "square meters": { categoryId: "area", unitId: "m2" },
  "cm2": { categoryId: "area", unitId: "cm2" },
  "square centimeter": { categoryId: "area", unitId: "cm2" },
  "square centimeters": { categoryId: "area", unitId: "cm2" },
  "km2": { categoryId: "area", unitId: "km2" },
  "square kilometer": { categoryId: "area", unitId: "km2" },
  "square kilometers": { categoryId: "area", unitId: "km2" },
  "hectare": { categoryId: "area", unitId: "hectare" },
  "hectares": { categoryId: "area", unitId: "hectare" },
  "ha": { categoryId: "area", unitId: "hectare" },
  "acre": { categoryId: "area", unitId: "acre" },
  "acres": { categoryId: "area", unitId: "acre" },
  "ac": { categoryId: "area", unitId: "acre" },
  "sq ft": { categoryId: "area", unitId: "sq_foot" },
  "square foot": { categoryId: "area", unitId: "sq_foot" },
  "square feet": { categoryId: "area", unitId: "sq_foot" },
  "sq in": { categoryId: "area", unitId: "sq_inch" },
  "square inch": { categoryId: "area", unitId: "sq_inch" },
  "square inches": { categoryId: "area", unitId: "sq_inch" },

  // Speed
  "mph": { categoryId: "speed", unitId: "mph" },
  "mile per hour": { categoryId: "speed", unitId: "mph" },
  "miles per hour": { categoryId: "speed", unitId: "mph" },
  "kmh": { categoryId: "speed", unitId: "km_h" },
  "km/h": { categoryId: "speed", unitId: "km_h" },
  "kilometer per hour": { categoryId: "speed", unitId: "km_h" },
  "kilometers per hour": { categoryId: "speed", unitId: "km_h" },
  "mps": { categoryId: "speed", unitId: "m_s" },
  "m/s": { categoryId: "speed", unitId: "m_s" },
  "knot": { categoryId: "speed", unitId: "knot" },
  "knots": { categoryId: "speed", unitId: "knot" },
  "kt": { categoryId: "speed", unitId: "knot" },
  "mach": { categoryId: "speed", unitId: "mach" },

  // Pressure
  "pa": { categoryId: "pressure", unitId: "Pa" },
  "pascal": { categoryId: "pressure", unitId: "Pa" },
  "pascals": { categoryId: "pressure", unitId: "Pa" },
  "kpa": { categoryId: "pressure", unitId: "kPa" },
  "kilopascal": { categoryId: "pressure", unitId: "kPa" },
  "kilopascals": { categoryId: "pressure", unitId: "kPa" },
  "bar": { categoryId: "pressure", unitId: "bar" },
  "bars": { categoryId: "pressure", unitId: "bar" },
  "psi": { categoryId: "pressure", unitId: "psi" },
  "atm": { categoryId: "pressure", unitId: "atm" },
  "atmosphere": { categoryId: "pressure", unitId: "atm" },
  "atmospheres": { categoryId: "pressure", unitId: "atm" },
  "torr": { categoryId: "pressure", unitId: "torr" },

  // Energy
  "j": { categoryId: "energy", unitId: "J" },
  "joule": { categoryId: "energy", unitId: "J" },
  "joules": { categoryId: "energy", unitId: "J" },
  "kj": { categoryId: "energy", unitId: "kJ" },
  "kilojoule": { categoryId: "energy", unitId: "kJ" },
  "kilojoules": { categoryId: "energy", unitId: "kJ" },
  "cal": { categoryId: "energy", unitId: "cal" },
  "calorie": { categoryId: "energy", unitId: "cal" },
  "calories": { categoryId: "energy", unitId: "cal" },
  "kcal": { categoryId: "energy", unitId: "kcal" },
  "wh": { categoryId: "energy", unitId: "Wh" },
  "watt-hour": { categoryId: "energy", unitId: "Wh" },
  "watt-hours": { categoryId: "energy", unitId: "Wh" },
  "kwh": { categoryId: "energy", unitId: "kWh" },
  "kilowatt-hour": { categoryId: "energy", unitId: "kWh" },
  "kilowatt-hours": { categoryId: "energy", unitId: "kWh" },
  "btu": { categoryId: "energy", unitId: "btu" },

  // Power
  "w": { categoryId: "power", unitId: "W" },
  "watt": { categoryId: "power", unitId: "W" },
  "watts": { categoryId: "power", unitId: "W" },
  "kw": { categoryId: "power", unitId: "kW" },
  "kilowatt": { categoryId: "power", unitId: "kW" },
  "kilowatts": { categoryId: "power", unitId: "kW" },
  "mw": { categoryId: "power", unitId: "MW" },
  "megawatt": { categoryId: "power", unitId: "MW" },
  "megawatts": { categoryId: "power", unitId: "MW" },
  "hp": { categoryId: "power", unitId: "hp" },
  "horsepower": { categoryId: "power", unitId: "hp" },

  // Digital
  "bit": { categoryId: "digital", unitId: "bit" },
  "bits": { categoryId: "digital", unitId: "bit" },
  "b": { categoryId: "digital", unitId: "B" },
  "byte": { categoryId: "digital", unitId: "B" },
  "bytes": { categoryId: "digital", unitId: "B" },
  "kb": { categoryId: "digital", unitId: "KB" },
  "kilobyte": { categoryId: "digital", unitId: "KB" },
  "kilobytes": { categoryId: "digital", unitId: "KB" },
  "mb": { categoryId: "digital", unitId: "MB" },
  "megabyte": { categoryId: "digital", unitId: "MB" },
  "megabytes": { categoryId: "digital", unitId: "MB" },
  "gb": { categoryId: "digital", unitId: "GB" },
  "gigabyte": { categoryId: "digital", unitId: "GB" },
  "gigabytes": { categoryId: "digital", unitId: "GB" },
  "tb": { categoryId: "digital", unitId: "TB" },
  "terabyte": { categoryId: "digital", unitId: "TB" },
  "terabytes": { categoryId: "digital", unitId: "TB" }
};

// Normalize string helper for comparison (used as a resilience fallback in findUnitMatch
// for stray punctuation / spacing typos on single-word unit symbols)
function normalizeUnitString(str: string): string {
  return str.toLowerCase().trim().replace(/s$/, "").replace(/[^a-z0-9°"']/g, "");
}

// Character class shared by every unit-capturing group below.
// Includes 0-9 (needed for ids like m2 / cm2 / km2) and "/" (needed for km/h, m/s).
const UNIT_CHARS = "a-zA-Z0-9°\"'\\s²³µ/";

// Client-side rule-based parser that executes under a few milliseconds
export function parseClientSearch(query: string): SearchIntent {
  const clean = query.trim().toLowerCase();
  if (!clean) return {};

  // 1. Convert X [to/in] Y e.g. "Convert 15 miles to kilometers."
  const convertRegex = new RegExp(`convert\\s+(\\d+(?:\\.\\d+)?)\\s*([${UNIT_CHARS}]+)\\s+(?:to|into|in)\\s+([${UNIT_CHARS}]+)`, "i");
  const matchConvert = clean.match(convertRegex);
  if (matchConvert) {
    const value = parseFloat(matchConvert[1]);
    const fromUnit = findUnitMatch(matchConvert[2]);
    const toUnit = findUnitMatch(matchConvert[3]);
    if (fromUnit) {
      return {
        value,
        fromUnitId: fromUnit.unitId,
        toUnitId: toUnit?.unitId || getOppositeDefaultUnitId(fromUnit.categoryId, fromUnit.unitId),
        categoryId: fromUnit.categoryId
      };
    }
  }

  // 2. How many Y in X? e.g. "How many inches is 2 meters?"
  const howManyRegex = new RegExp(`how\\s+many\\s+([${UNIT_CHARS}]+)\\s+(?:is|are|in|equal)\\s+(\\d+(?:\\.\\d+)?)\\s*([${UNIT_CHARS}]+)`, "i");
  const matchHowMany = clean.match(howManyRegex);
  if (matchHowMany) {
    const toUnit = findUnitMatch(matchHowMany[1]);
    const value = parseFloat(matchHowMany[2]);
    const fromUnit = findUnitMatch(matchHowMany[3]);
    if (fromUnit) {
      return {
        value,
        fromUnitId: fromUnit.unitId,
        toUnitId: toUnit?.unitId || getOppositeDefaultUnitId(fromUnit.categoryId, fromUnit.unitId),
        categoryId: fromUnit.categoryId
      };
    }
  }

  // 3. X [to/in] Y e.g. "10kg to pounds", "100 cm inches", "32f to c"
  const standardRegex = new RegExp(`(\\d+(?:\\.\\d+)?)\\s*([${UNIT_CHARS}]+)\\s+(?:to|into|in|as)\\s+([${UNIT_CHARS}]+)`, "i");
  const matchStandard = clean.match(standardRegex);
  if (matchStandard) {
    const value = parseFloat(matchStandard[1]);
    const fromUnit = findUnitMatch(matchStandard[2]);
    const toUnit = findUnitMatch(matchStandard[3]);
    if (fromUnit) {
      return {
        value,
        fromUnitId: fromUnit.unitId,
        toUnitId: toUnit?.unitId || getOppositeDefaultUnitId(fromUnit.categoryId, fromUnit.unitId),
        categoryId: fromUnit.categoryId
      };
    }
  }

  // 4. X Y without explicit to, e.g. "100 cm inches" or "100 mph kmh" or "5 acres m2"
  const spaceRegex = new RegExp(`(\\d+(?:\\.\\d+)?)\\s*([${UNIT_CHARS}]+)\\s+([${UNIT_CHARS}]+)`, "i");
  const matchSpace = clean.match(spaceRegex);
  if (matchSpace) {
    const value = parseFloat(matchSpace[1]);
    const fromUnit = findUnitMatch(matchSpace[2]);
    const toUnit = findUnitMatch(matchSpace[3]);
    if (fromUnit) {
      return {
        value,
        fromUnitId: fromUnit.unitId,
        toUnitId: toUnit?.unitId || getOppositeDefaultUnitId(fromUnit.categoryId, fromUnit.unitId),
        categoryId: fromUnit.categoryId
      };
    }
  }

  // 5. Bare number with unit, e.g. "5 feet" or "10kg"
  const bareRegex = new RegExp(`(\\d+(?:\\.\\d+)?)\\s*([${UNIT_CHARS}]+)`, "i");
  const matchBare = clean.match(bareRegex);
  if (matchBare) {
    const value = parseFloat(matchBare[1]);
    const fromUnit = findUnitMatch(matchBare[2]);
    if (fromUnit) {
      return {
        value,
        fromUnitId: fromUnit.unitId,
        toUnitId: getOppositeDefaultUnitId(fromUnit.categoryId, fromUnit.unitId),
        categoryId: fromUnit.categoryId
      };
    }
  }

  // 6. Bare category search, e.g. "length" or "weight"
  const cat = UNIT_CATEGORIES.find(c => c.name.toLowerCase() === clean || c.id === clean);
  if (cat) {
    return {
      categoryId: cat.id,
      fromUnitId: cat.units[0].id,
      toUnitId: cat.units[1]?.id || cat.units[0].id,
      value: 1
    };
  }

  // 7. Bare unit name only, no number and no destination, e.g. "foot", "cm", "psi".
  // Jump to that unit's category with it pre-selected as the "from" unit, defaulting
  // the value to 1 so the user immediately sees a reference conversion.
  const bareUnit = findUnitMatch(clean);
  if (bareUnit) {
    return {
      categoryId: bareUnit.categoryId,
      fromUnitId: bareUnit.unitId,
      toUnitId: getOppositeDefaultUnitId(bareUnit.categoryId, bareUnit.unitId),
      value: 1
    };
  }

  return {};
}

// Synonyms searching with spelling tolerance / direct hits
function findUnitMatch(unitStr: string): { categoryId: string; unitId: string } | null {
  // Collapse any stray double-spaces/newlines captured by the regex into single spaces
  const norm = unitStr.toLowerCase().trim().replace(/\s+/g, " ");
  if (SYNONYMS[norm]) return SYNONYMS[norm];

  // Try replacing plural suffix
  const singular = norm.replace(/s$/, "");
  if (SYNONYMS[singular]) return SYNONYMS[singular];

  // Fallback: strip stray punctuation for single-word symbols (e.g. extra periods/spaces)
  const stripped = normalizeUnitString(norm);
  if (SYNONYMS[stripped]) return SYNONYMS[stripped];

  // Search directly in the unit data (ids, names, plural names, symbols)
  for (const cat of UNIT_CATEGORIES) {
    for (const unit of cat.units) {
      const candidates = [
        unit.id.toLowerCase(),
        unit.name.toLowerCase(),
        unit.pluralName.toLowerCase(),
        unit.symbol.toLowerCase()
      ];
      if (
        candidates.includes(norm) ||
        candidates.includes(singular) ||
        candidates.includes(stripped)
      ) {
        return { categoryId: cat.id, unitId: unit.id };
      }
    }
  }
  return null;
}

// Sensible fallback "to" units based on what's typically compared
function getOppositeDefaultUnitId(categoryId: string, unitId: string): string {
  const category = UNIT_CATEGORIES.find(c => c.id === categoryId);
  if (!category) return "";
  if (categoryId === "length") {
    return unitId === "m" || unitId === "cm" || unitId === "mm" ? "inch" : "m";
  }
  if (categoryId === "weight") {
    return unitId === "kg" || unitId === "g" ? "pound" : "kg";
  }
  if (categoryId === "temperature") {
    return unitId === "C" ? "F" : "C";
  }
  if (categoryId === "volume") {
    return unitId === "L" || unitId === "ml" ? "gallon" : "L";
  }
  if (categoryId === "area") {
    return unitId === "m2" || unitId === "hectare" ? "acre" : "m2";
  }
  // Default to second unit, or first if single
  return category.units.find(u => u.id !== unitId)?.id || category.units[0].id;
}

// Direct mathematical conversion engine
export function performConversion(
  categoryId: string,
  fromUnitId: string,
  toUnitId: string,
  value: number
): number {
  if (isNaN(value)) return 0;
  const category = UNIT_CATEGORIES.find(c => c.id === categoryId);
  if (!category) return 0;

  const fromUnit = category.units.find(u => u.id === fromUnitId);
  const toUnit = category.units.find(u => u.id === toUnitId);
  if (!fromUnit || !toUnit) return 0;

  if (fromUnitId === toUnitId) return value;

  // 1. TEMPERATURE (Offsets + non-linear equations)
  if (categoryId === "temperature") {
    let valueInC = value;
    // To Celsius first
    if (fromUnitId === "F") {
      valueInC = (value - 32) / 1.8;
    } else if (fromUnitId === "K") {
      valueInC = value - 273.15;
    } else if (fromUnitId === "R") {
      valueInC = (value - 491.67) * (5 / 9);
    }

    // Celsius to Target
    if (toUnitId === "C") return valueInC;
    if (toUnitId === "F") return valueInC * 1.8 + 32;
    if (toUnitId === "K") return valueInC + 273.15;
    if (toUnitId === "R") return (valueInC + 273.15) * 1.8;
  }

  // 2. FUEL ECONOMY (Inverse relationship with L/100km)
  if (categoryId === "fuel") {
    if (fromUnitId === "l_100km") {
      if (toUnitId === "mpg") return 235.214583 / value;
      if (toUnitId === "km_l") return 100 / value;
    }
    if (toUnitId === "l_100km") {
      if (fromUnitId === "mpg") return 235.214583 / value;
      if (fromUnitId === "km_l") return 100 / value;
    }
  }

  // 3. SOUND LEVEL (Decibels, logarithmic scale)
  if (categoryId === "sound") {
    if (fromUnitId === "dB" && toUnitId === "bel") return value / 10;
    if (fromUnitId === "bel" && toUnitId === "dB") return value * 10;
  }

  // 4. STANDARD SI / LINEAR MULTIPLIER
  // Convert fromUnit to base, then base to toUnit
  const baseValue = value * fromUnit.factor;
  return baseValue / toUnit.factor;
}

// Helper to format float beautifully (high precision or scientific notation)
export function formatValue(val: number): string {
  if (val === 0) return "0";
  const abs = Math.abs(val);
  if (abs >= 1e9 || abs < 1e-4) {
    return val.toExponential(4);
  }
  // Avoid long floating decimals (e.g. 0.0000001)
  const precision = abs < 1 ? 5 : 4;
  return Number(val.toPrecision(precision)).toString();
}

// Generate the complete details result object
export function getConversionResult(
  categoryId: string,
  fromUnitId: string,
  toUnitId: string,
  value: number
): ConversionResult | null {
  const category = UNIT_CATEGORIES.find(c => c.id === categoryId);
  if (!category) return null;

  const fromUnit = category.units.find(u => u.id === fromUnitId);
  const toUnit = category.units.find(u => u.id === toUnitId);
  if (!fromUnit || !toUnit) return null;

  const outputValue = performConversion(categoryId, fromUnitId, toUnitId, value);

  // Generate Also Equals (other top units in the same category)
  const alsoEquals = category.units
    .filter(u => u.id !== fromUnitId && u.id !== toUnitId)
    .slice(0, 4)
    .map(u => ({
      unit: u,
      value: performConversion(categoryId, fromUnitId, u.id, value)
    }));

  // Generate Formula & Steps Explanations
  let formula = "";
  let steps = "";
  if (categoryId === "temperature") {
    if (fromUnitId === "C" && toUnitId === "F") {
      formula = "°F = (°C × 1.8) + 32";
      steps = `Multiply temperature by 1.8, then add 32: (${value} × 1.8) + 32 = ${outputValue.toFixed(2)}°F`;
    } else if (fromUnitId === "F" && toUnitId === "C") {
      formula = "°C = (°F - 32) / 1.8";
      steps = `Subtract 32, then divide by 1.8: (${value} - 32) / 1.8 = ${outputValue.toFixed(2)}°C`;
    } else if (fromUnitId === "C" && toUnitId === "K") {
      formula = "K = °C + 273.15";
      steps = `Add 273.15 to the Celsius value: ${value} + 273.15 = ${outputValue.toFixed(2)}K`;
    } else if (fromUnitId === "K" && toUnitId === "C") {
      formula = "°C = K - 273.15";
      steps = `Subtract 273.15 from the Kelvin value: ${value} - 273.15 = ${outputValue.toFixed(2)}°C`;
    } else {
      formula = `Custom non-linear temperature equation`;
      steps = `Calculated through standardized Thermodynamic scales.`;
    }
  } else if (categoryId === "fuel" && (fromUnitId === "l_100km" || toUnitId === "l_100km")) {
    formula = `Inverse Fuel consumption reciprocal standard (235.215 / value)`;
    steps = `Due to fuel economy vs consumption standard, values have a reciprocal formula relationship.`;
  } else {
    // Standard Linear
    const ratio = fromUnit.factor / toUnit.factor;
    formula = `1 ${fromUnit.symbol} = ${formatValue(ratio)} ${toUnit.symbol}`;
    steps = `Multiply input by ${formatValue(ratio)} (Ratio of conversion factors: ${fromUnit.factor} / ${toUnit.factor})`;
  }

  // Reference Table Values (1, 2, 5, 10, 20, 50, 100, 250, 500, 1000)
  const stepsList = [1, 2, 5, 10, 20, 50, 100, 250, 500, 1000];
  const referenceTable = stepsList.map(n => ({
    input: n,
    output: performConversion(categoryId, fromUnitId, toUnitId, n)
  }));

  // Generate FAQ list
  const faqs = [
    {
      question: `How many ${toUnit.pluralName} are in a ${fromUnit.name}?`,
      answer: `There are exactly ${formatValue(performConversion(categoryId, fromUnitId, toUnitId, 1))} ${toUnit.pluralName} in 1 ${fromUnit.name} based on international standards.`
    },
    {
      question: `How do you manually convert ${fromUnit.pluralName} to ${toUnit.pluralName}?`,
      answer: `To convert manually, use the formula: ${toUnit.pluralName} = ${fromUnit.pluralName} × (${fromUnit.factor} / ${toUnit.factor}). ${formula}.`
    },
    {
      question: `Is the conversion between ${fromUnit.pluralName} and ${toUnit.pluralName} exact?`,
      answer: `Yes, standard SI definitions govern this relation exactly based on international scientific frameworks.`
    }
  ];

  // Dynamic Real-World Context analogies
  const realWorld: string[] = [];
  if (category.realWorldContexts) {
    // Find nearby contexts
    const baseValue = value * fromUnit.factor;
    const sorted = [...category.realWorldContexts].sort((a, b) => Math.abs(a.threshold - baseValue) - Math.abs(b.threshold - baseValue));
    sorted.slice(0, 3).forEach(ctx => {
      const scale = baseValue / ctx.threshold;
      if (scale > 0.05 && scale < 20) {
        if (Math.abs(scale - 1) < 0.1) {
          realWorld.push(`≈ ${ctx.label}`);
        } else {
          realWorld.push(`≈ ${scale.toFixed(1)} × ${ctx.label.replace(/^About|^Weight of|^Length of/, "").toLowerCase()}`);
        }
      }
    });
  }

  // Smart suggestions for next link click (depth indexing)
  const smartSuggestions = category.units
    .filter(u => u.id !== fromUnitId && u.id !== toUnitId)
    .slice(0, 3)
    .map(u => ({
      unit: u,
      label: `${toUnit.symbol} to ${u.symbol}`
    }));

  return {
    category: category.name,
    fromUnit,
    toUnit,
    inputValue: value,
    outputValue,
    alsoEquals,
    formula,
    steps,
    referenceTable,
    faqs,
    realWorld: realWorld.length > 0 ? realWorld : undefined,
    smartSuggestions
  };
}

// Generate nice rich simulated Articles based on category
export function getArticlesForCategory(categoryName: string) {
  const lower = categoryName.toLowerCase();
  if (lower.includes("length")) {
    return [
      {
        title: "Metric vs Imperial System: The Global Divide",
        excerpt: "Why the United States, Liberia, and Myanmar remain the only countries not fully utilizing the metric system.",
        readTime: "4 min read"
      },
      {
        title: "Why America Uses Inches and Feet",
        excerpt: "A deep dive into Thomas Jefferson's proposed decimal systems and how British commerce cemented imperial units.",
        readTime: "5 min read"
      }
    ];
  }
  if (lower.includes("cook") || lower.includes("volume")) {
    return [
      {
        title: "The Ultimate Cooking Measurement Guide",
        excerpt: "Never mess up a recipe again. Understand the difference between liquid and dry ounces, cups, and teaspoons.",
        readTime: "3 min read"
      },
      {
        title: "Imperial Cups vs Metric Cups Explained",
        excerpt: "Why baking in Australia, the US, or the UK can yield completely different cakes if you use generic measuring cups.",
        readTime: "4 min read"
      }
    ];
  }
  return [
    {
      title: "Understanding Measurement Units and Standards",
      excerpt: "How the International Bureau of Weights and Measures (BIPM) governs our physical constants exactly.",
      readTime: "4 min read"
    },
    {
      title: "How Rounding Affects Engineering Conversions",
      excerpt: "Why micro-rounding discrepancies can cause structural catastrophes or orbital flight deviations.",
      readTime: "5 min read"
    }
  ];
}
