import { UnitCategory } from "./types";

export const UNIT_CATEGORIES: UnitCategory[] = [
  {
    id: "length",
    name: "Length",
    icon: "Ruler",
    baseUnitId: "m",
    units: [
      { id: "m", name: "Meter", pluralName: "meters", symbol: "m", factor: 1 },
      { id: "cm", name: "Centimeter", pluralName: "centimeters", symbol: "cm", factor: 0.01 },
      { id: "mm", name: "Millimeter", pluralName: "millimeters", symbol: "mm", factor: 0.001 },
      { id: "km", name: "Kilometer", pluralName: "kilometers", symbol: "km", factor: 1000 },
      { id: "dm", name: "Decimeter", pluralName: "decimeters", symbol: "dm", factor: 0.1 },
      { id: "micrometer", name: "Micrometer", pluralName: "micrometers", symbol: "µm", factor: 0.000001 },
      { id: "nanometer", name: "Nanometer", pluralName: "nanometers", symbol: "nm", factor: 0.000000001 },
      { id: "inch", name: "Inch", pluralName: "inches", symbol: "in", factor: 0.0254 },
      { id: "foot", name: "Foot", pluralName: "feet", symbol: "ft", factor: 0.3048 },
      { id: "yard", name: "Yard", pluralName: "yards", symbol: "yd", factor: 0.9144 },
      { id: "mile", name: "Mile", pluralName: "miles", symbol: "mi", factor: 1609.344 },
      { id: "mile_nautical", name: "Nautical Mile", pluralName: "nautical miles", symbol: "nmi", factor: 1852 },
      { id: "light_year", name: "Light Year", pluralName: "light years", symbol: "ly", factor: 9460730472580800 }
    ],
    realWorldContexts: [
      { threshold: 0.001, label: "Thickness of a credit card" },
      { threshold: 0.0254, label: "Length of a small paperclip" },
      { threshold: 0.15, label: "Length of an average smartphone" },
      { threshold: 0.3048, label: "Length of a standard school ruler" },
      { threshold: 1.75, label: "Height of an average adult human" },
      { threshold: 2.5, label: "Standard ceiling height" },
      { threshold: 10, label: "Length of a standard school bus" },
      { threshold: 100, label: "Length of a soccer field" },
      { threshold: 324, label: "Height of the Eiffel Tower" },
      { threshold: 1000, label: "A 10-12 minute standard walk" },
      { threshold: 8848, label: "Height of Mount Everest" }
    ]
  },
  {
    id: "weight",
    name: "Weight & Mass",
    icon: "Weight",
    baseUnitId: "kg",
    units: [
      { id: "kg", name: "Kilogram", pluralName: "kilograms", symbol: "kg", factor: 1 },
      { id: "g", name: "Gram", pluralName: "grams", symbol: "g", factor: 0.001 },
      { id: "mg", name: "Milligram", pluralName: "millimeters", symbol: "mg", factor: 0.000001 },
      { id: "mcg", name: "Microgram", pluralName: "micrograms", symbol: "µg", factor: 0.000000001 },
      { id: "ton", name: "Metric Ton", pluralName: "metric tons", symbol: "t", factor: 1000 },
      { id: "pound", name: "Pound", pluralName: "pounds", symbol: "lb", factor: 0.45359237 },
      { id: "ounce", name: "Ounce", pluralName: "ounces", symbol: "oz", factor: 0.028349523125 },
      { id: "stone", name: "Stone", pluralName: "stones", symbol: "st", factor: 6.35029318 },
      { id: "grain", name: "Grain", pluralName: "grains", symbol: "gr", factor: 0.00006479891 },
      { id: "carat", name: "Carat", pluralName: "carats", symbol: "ct", factor: 0.0002 }
    ],
    realWorldContexts: [
      { threshold: 0.001, label: "Weight of a standard paperclip" },
      { threshold: 0.005, label: "Weight of a nickel coin" },
      { threshold: 0.15, label: "Weight of a pool billiard ball" },
      { threshold: 1.0, label: "Weight of a large pineapple or a liter of water" },
      { threshold: 5.0, label: "Weight of an average domestic house cat" },
      { threshold: 7.2, label: "Weight of a heavy bowling ball" },
      { threshold: 70, label: "Weight of an average adult human" },
      { threshold: 1200, label: "Weight of a compact subcompact car" },
      { threshold: 5000, label: "Weight of an adult male African elephant" }
    ]
  },
  {
    id: "temperature",
    name: "Temperature",
    icon: "Thermometer",
    baseUnitId: "C",
    units: [
      { id: "C", name: "Celsius", pluralName: "degrees Celsius", symbol: "°C", factor: 1, offset: 0 },
      { id: "F", name: "Fahrenheit", pluralName: "degrees Fahrenheit", symbol: "°F", factor: 1, offset: 0 }, // Custom calculated
      { id: "K", name: "Kelvin", pluralName: "Kelvins", symbol: "K", factor: 1, offset: 0 }, // Custom calculated
      { id: "R", name: "Rankine", pluralName: "degrees Rankine", symbol: "°R", factor: 1, offset: 0 } // Custom calculated
    ],
    realWorldContexts: [
      { threshold: -273.15, label: "Absolute zero (coldest possible temperature)" },
      { threshold: 0, label: "Freezing point of pure water" },
      { threshold: 21, label: "Comfortable indoor room temperature" },
      { threshold: 37, label: "Average internal temperature of a healthy human body" },
      { threshold: 100, label: "Boiling point of pure water at sea level" }
    ]
  },
  {
    id: "volume",
    name: "Volume",
    icon: "GlassWater",
    baseUnitId: "L",
    units: [
      { id: "L", name: "Liter", pluralName: "liters", symbol: "L", factor: 1 },
      { id: "ml", name: "Milliliter", pluralName: "milliliters", symbol: "ml", factor: 0.001 },
      { id: "m3", name: "Cubic Meter", pluralName: "cubic meters", symbol: "m³", factor: 1000 },
      { id: "gallon", name: "US Gallon", pluralName: "gallons", symbol: "gal", factor: 3.785411784 },
      { id: "quart", name: "US Quart", pluralName: "quarts", symbol: "qt", factor: 0.946352946 },
      { id: "pint", name: "US Pint", pluralName: "pints", symbol: "pt", factor: 0.473176473 },
      { id: "cup", name: "US Cup", pluralName: "cups", symbol: "c", factor: 0.2365882365 },
      { id: "fl_oz", name: "US Fluid Ounce", pluralName: "fluid ounces", symbol: "fl oz", factor: 0.02957352956 },
      { id: "tbsp", name: "US Tablespoon", pluralName: "tablespoons", symbol: "tbsp", factor: 0.01478676478 },
      { id: "tsp", name: "US Teaspoon", pluralName: "teaspoons", symbol: "tsp", factor: 0.00492892159 }
    ],
    realWorldContexts: [
      { threshold: 0.001, label: "About 20 drops of water" },
      { threshold: 0.015, label: "Capacity of a soup spoon" },
      { threshold: 0.24, label: "Standard glass of juice or water" },
      { threshold: 0.355, label: "Standard American aluminum beverage can" },
      { threshold: 1.0, label: "Standard carton of milk" },
      { threshold: 3.78, label: "Standard plastic jug of milk" },
      { threshold: 150, label: "Standard residential bathtub filled" },
      { threshold: 2500000, label: "Size of an Olympic swimming pool" }
    ]
  },
  {
    id: "area",
    name: "Area",
    icon: "Square",
    baseUnitId: "m2",
    units: [
      { id: "m2", name: "Square Meter", pluralName: "square meters", symbol: "m²", factor: 1 },
      { id: "cm2", name: "Square Centimeter", pluralName: "square centimeters", symbol: "cm²", factor: 0.0001 },
      { id: "mm2", name: "Square Millimeter", pluralName: "square millimeters", symbol: "mm²", factor: 0.000001 },
      { id: "km2", name: "Square Kilometer", pluralName: "square kilometers", symbol: "km²", factor: 1000000 },
      { id: "hectare", name: "Hectare", pluralName: "hectares", symbol: "ha", factor: 10000 },
      { id: "acre", name: "Acre", pluralName: "acres", symbol: "ac", factor: 4046.8564224 },
      { id: "sq_foot", name: "Square Foot", pluralName: "square feet", symbol: "sq ft", factor: 0.09290304 },
      { id: "sq_inch", name: "Square Inch", pluralName: "square inches", symbol: "sq in", factor: 0.00064516 },
      { id: "sq_yard", name: "Square Yard", pluralName: "square yards", symbol: "sq yd", factor: 0.83612736 },
      { id: "sq_mile", name: "Square Mile", pluralName: "square miles", symbol: "sq mi", factor: 2589988.11 }
    ],
    realWorldContexts: [
      { threshold: 0.0005, label: "Area of a postage stamp" },
      { threshold: 0.062, label: "Area of a standard sheet of Letter paper" },
      { threshold: 1.5, label: "Area of a standard double bed mattress" },
      { threshold: 12.5, label: "Area of a typical parking space" },
      { threshold: 4046, label: "About size of 1 US Football Field (including end zones)" },
      { threshold: 10000, label: "About two professional football fields next to each other" }
    ]
  },
  {
    id: "cooking",
    name: "Cooking",
    icon: "Soup",
    baseUnitId: "ml",
    units: [
      { id: "ml", name: "Milliliter", pluralName: "milliliters", symbol: "ml", factor: 1 },
      { id: "cup", name: "Cup", pluralName: "cups", symbol: "c", factor: 236.59 },
      { id: "tbsp", name: "Tablespoon", pluralName: "tablespoons", symbol: "tbsp", factor: 14.79 },
      { id: "tsp", name: "Teaspoon", pluralName: "teaspoons", symbol: "tsp", factor: 4.93 },
      { id: "fl_oz", name: "Fluid Ounce", pluralName: "fluid ounces", symbol: "fl oz", factor: 29.57 },
      { id: "pint", name: "Pint", pluralName: "pints", symbol: "pt", factor: 473.18 },
      { id: "quart", name: "Quart", pluralName: "quarts", symbol: "qt", factor: 946.35 },
      { id: "pinch", name: "Pinch", pluralName: "pinches", symbol: "pinch", factor: 0.31 },
      { id: "dash", name: "Dash", pluralName: "dashes", symbol: "dash", factor: 0.62 }
    ]
  },
  {
    id: "time",
    name: "Time",
    icon: "Clock",
    baseUnitId: "s",
    units: [
      { id: "s", name: "Second", pluralName: "seconds", symbol: "s", factor: 1 },
      { id: "ms", name: "Millisecond", pluralName: "milliseconds", symbol: "ms", factor: 0.001 },
      { id: "us", name: "Microsecond", pluralName: "microseconds", symbol: "µs", factor: 0.000001 },
      { id: "m", name: "Minute", pluralName: "minutes", symbol: "min", factor: 60 },
      { id: "h", name: "Hour", pluralName: "hours", symbol: "h", factor: 3600 },
      { id: "d", name: "Day", pluralName: "days", symbol: "d", factor: 86400 },
      { id: "w", name: "Week", pluralName: "weeks", symbol: "wk", factor: 604800 },
      { id: "mo", name: "Month (average)", pluralName: "months", symbol: "mo", factor: 2629746 }, // 365.2425 days / 12
      { id: "yr", name: "Year", pluralName: "years", symbol: "yr", factor: 31556952 }, // 365.2425 days
      { id: "decade", name: "Decade", pluralName: "decades", symbol: "decade", factor: 315569520 },
      { id: "century", name: "Century", pluralName: "centuries", symbol: "century", factor: 3155695200 }
    ],
    realWorldContexts: [
      { threshold: 0.1, label: "Duration of a single camera flash" },
      { threshold: 0.3, label: "Duration of a human eye blink" },
      { threshold: 1, label: "Duration of an average human heartbeat at rest" },
      { threshold: 60, label: "Time taken to read a short paragraph" },
      { threshold: 3600, label: "Standard lunch hour duration" },
      { threshold: 86400, label: "One full rotation of the Earth on its axis" }
    ]
  },
  {
    id: "speed",
    name: "Speed",
    icon: "Gauge",
    baseUnitId: "m_s",
    units: [
      { id: "m_s", name: "Meter per second", pluralName: "meters per second", symbol: "m/s", factor: 1 },
      { id: "km_h", name: "Kilometer per hour", pluralName: "kilometers per hour", symbol: "km/h", factor: 0.27777778 },
      { id: "mph", name: "Mile per hour", pluralName: "miles per hour", symbol: "mph", factor: 0.44704 },
      { id: "knot", name: "Knot", pluralName: "knots", symbol: "kt", factor: 0.5144444 },
      { id: "mach", name: "Mach", pluralName: "Mach numbers", symbol: "M", factor: 343 } // at sea level, 20°C
    ],
    realWorldContexts: [
      { threshold: 0.01, label: "Speed of a garden snail moving" },
      { threshold: 1.4, label: "Average human walking speed" },
      { threshold: 12.5, label: "Maximum sprinting speed of Usain Bolt" },
      { threshold: 28, label: "Average highway driving speed (60 mph)" },
      { threshold: 343, label: "The speed of sound in dry air" }
    ]
  },
  {
    id: "pressure",
    name: "Pressure",
    icon: "Compass",
    baseUnitId: "Pa",
    units: [
      { id: "Pa", name: "Pascal", pluralName: "pascals", symbol: "Pa", factor: 1 },
      { id: "kPa", name: "Kilopascal", pluralName: "kilopascals", symbol: "kPa", factor: 1000 },
      { id: "bar", name: "Bar", pluralName: "bars", symbol: "bar", factor: 100000 },
      { id: "psi", name: "Pound per sq inch", pluralName: "pounds per square inch", symbol: "psi", factor: 6894.75729 },
      { id: "atm", name: "Atmosphere", pluralName: "atmospheres", symbol: "atm", factor: 101325 },
      { id: "torr", name: "Torr", pluralName: "torrs", symbol: "Torr", factor: 133.3224 }
    ],
    realWorldContexts: [
      { threshold: 10, label: "Pressure of an apple resting on a table" },
      { threshold: 200000, label: "Typical bicycle tire pressure (30 psi)" },
      { threshold: 101325, label: "Standard atmospheric pressure at sea level" }
    ]
  },
  {
    id: "energy",
    name: "Energy",
    icon: "Zap",
    baseUnitId: "J",
    units: [
      { id: "J", name: "Joule", pluralName: "joules", symbol: "J", factor: 1 },
      { id: "kJ", name: "Kilojoule", pluralName: "kilojoules", symbol: "kJ", factor: 1000 },
      { id: "cal", name: "Calorie", pluralName: "calories", symbol: "cal", factor: 4.184 },
      { id: "kcal", name: "Kilocalorie / Food Calorie", pluralName: "kilocalories", symbol: "kcal", factor: 4184 },
      { id: "Wh", name: "Watt-hour", pluralName: "watt-hours", symbol: "Wh", factor: 3600 },
      { id: "kWh", name: "Kilowatt-hour", pluralName: "kilowatt-hours", symbol: "kWh", factor: 3600000 },
      { id: "btu", name: "British Thermal Unit", pluralName: "BTUs", symbol: "BTU", factor: 1055.056 }
    ],
    realWorldContexts: [
      { threshold: 1, label: "Energy required to lift an apple one meter" },
      { threshold: 4184, label: "Energy of a standard match burning completely" },
      { threshold: 1000000, label: "Energy stored in a typical smartphone battery" },
      { threshold: 8400000, label: "Standard daily human food calorie intake recommendation (2000 kcal)" }
    ]
  },
  {
    id: "power",
    name: "Power",
    icon: "Flame",
    baseUnitId: "W",
    units: [
      { id: "W", name: "Watt", pluralName: "watts", symbol: "W", factor: 1 },
      { id: "kW", name: "Kilowatt", pluralName: "kilowatts", symbol: "kW", factor: 1000 },
      { id: "MW", name: "Megawatt", pluralName: "megawatts", symbol: "MW", factor: 1000000 },
      { id: "hp", name: "Mechanical Horsepower", pluralName: "horsepower", symbol: "hp", factor: 745.699872 }
    ],
    realWorldContexts: [
      { threshold: 0.1, label: "Power consumed by a resting smartphone" },
      { threshold: 10, label: "Power of an energy-saving LED light bulb" },
      { threshold: 1000, label: "Power drawn by a standard domestic microwave oven" },
      { threshold: 110000, label: "Engine power of a typical compact sedan car (150 hp)" }
    ]
  },
  {
    id: "digital",
    name: "Digital Storage",
    icon: "Database",
    baseUnitId: "B",
    units: [
      { id: "bit", name: "Bit", pluralName: "bits", symbol: "b", factor: 0.125 },
      { id: "B", name: "Byte", pluralName: "bytes", symbol: "B", factor: 1 },
      { id: "KB", name: "Kilobyte (binary)", pluralName: "kilobytes", symbol: "KB", factor: 1024 },
      { id: "MB", name: "Megabyte (binary)", pluralName: "megabytes", symbol: "MB", factor: 1048576 },
      { id: "GB", name: "Gigabyte (binary)", pluralName: "gigabytes", symbol: "GB", factor: 1073741824 },
      { id: "TB", name: "Terabyte (binary)", pluralName: "terabytes", symbol: "TB", factor: 1099511627776 },
      { id: "PB", name: "Petabyte (binary)", pluralName: "petabytes", symbol: "PB", factor: 1125899906842624 }
    ],
    realWorldContexts: [
      { threshold: 1, label: "Holds a single letter of text" },
      { threshold: 102400, label: "Size of a standard medium-resolution web image" },
      { threshold: 5242880, label: "Size of a high-quality 4-minute MP3 music song" },
      { threshold: 1610612736, label: "Standard high definition (HD) video movie stream" }
    ]
  },
  {
    id: "fuel",
    name: "Fuel Economy",
    icon: "Activity",
    baseUnitId: "mpg",
    units: [
      { id: "mpg", name: "Miles per gallon (US)", pluralName: "miles per gallon", symbol: "mpg", factor: 1 },
      { id: "km_l", name: "Kilometers per liter", pluralName: "kilometers per liter", symbol: "km/L", factor: 0.425143707 },
      { id: "l_100km", name: "Liters per 100km", pluralName: "liters per 100km", symbol: "L/100km", factor: 235.214583 } // Custom reciprocal calculation
    ]
  },
  {
    id: "datatransfer",
    name: "Data Transfer",
    icon: "Network",
    baseUnitId: "bps",
    units: [
      { id: "bps", name: "Bit per second", pluralName: "bits per second", symbol: "bps", factor: 1 },
      { id: "kbps", name: "Kilobit per second", pluralName: "kilobits per second", symbol: "kbps", factor: 1000 },
      { id: "mbps", name: "Megabit per second", pluralName: "megabits per second", symbol: "Mbps", factor: 1000000 },
      { id: "gbps", name: "Gigabit per second", pluralName: "gigabits per second", symbol: "Gbps", factor: 1000000000 },
      { id: "Bps", name: "Byte per second", pluralName: "bytes per second", symbol: "B/s", factor: 8 },
      { id: "KBps", name: "Kilobyte per second", pluralName: "kilobytes per second", symbol: "KB/s", factor: 8192 },
      { id: "MBps", name: "Megabyte per second", pluralName: "megabytes per second", symbol: "MB/s", factor: 8388608 }
    ],
    realWorldContexts: [
      { threshold: 56000, label: "Speed of dial-up internet modems from the late 1990s" },
      { threshold: 15000000, label: "Required speed to stream 4K Ultra HD video without buffering" },
      { threshold: 300000000, label: "Average 5G cellular network download speeds" }
    ]
  },
  {
    id: "force",
    name: "Force",
    icon: "Workflow",
    baseUnitId: "N",
    units: [
      { id: "N", name: "Newton", pluralName: "newtons", symbol: "N", factor: 1 },
      { id: "kN", name: "Kilonewton", pluralName: "kilonewtons", symbol: "kN", factor: 1000 },
      { id: "lbf", name: "Pound-force", pluralName: "pounds-force", symbol: "lbf", factor: 4.448221615 },
      { id: "dyne", name: "Dyne", pluralName: "dynes", symbol: "dyn", factor: 0.00001 }
    ]
  },
  {
    id: "angle",
    name: "Angle",
    icon: "RotateCw",
    baseUnitId: "deg",
    units: [
      { id: "deg", name: "Degree", pluralName: "degrees", symbol: "°", factor: 1 },
      { id: "rad", name: "Radian", pluralName: "radians", symbol: "rad", factor: 57.2957795 },
      { id: "grad", name: "Gradian", pluralName: "gradians", symbol: "grad", factor: 0.9 },
      { id: "arcmin", name: "Arcminute", pluralName: "arcminutes", symbol: "′", factor: 0.016666667 },
      { id: "arcsec", name: "Arcsecond", pluralName: "arcseconds", symbol: "″", factor: 0.000277778 }
    ]
  },
  {
    id: "typography",
    name: "Typography",
    icon: "TypeIcon",
    baseUnitId: "pt",
    units: [
      { id: "pt", name: "Point", pluralName: "points", symbol: "pt", factor: 1 },
      { id: "pica", name: "Pica", pluralName: "picas", symbol: "pica", factor: 12 },
      { id: "px", name: "Pixel (standard 96dpi)", pluralName: "pixels", symbol: "px", factor: 0.75 },
      { id: "em", name: "Em", pluralName: "ems", symbol: "em", factor: 12 } // assumes 12pt base
    ]
  },
  {
    id: "frequency",
    name: "Frequency",
    icon: "ActivityIcon",
    baseUnitId: "Hz",
    units: [
      { id: "Hz", name: "Hertz", pluralName: "Hertz", symbol: "Hz", factor: 1 },
      { id: "kHz", name: "Kilohertz", pluralName: "kilohertz", symbol: "kHz", factor: 1000 },
      { id: "MHz", name: "Megahertz", pluralName: "megahertz", symbol: "MHz", factor: 1000000 },
      { id: "GHz", name: "Gigahertz", pluralName: "gigahertz", symbol: "GHz", factor: 1000000000 },
      { id: "rpm", name: "Rotations per min", pluralName: "rotations per minute", symbol: "RPM", factor: 0.016666667 },
      { id: "rad_s", name: "Radian per second", pluralName: "radians per second", symbol: "rad/s", factor: 0.15915494 }
    ]
  },
  {
    id: "electricity",
    name: "Electricity",
    icon: "Cable",
    baseUnitId: "A",
    units: [
      { id: "A", name: "Ampere", pluralName: "amperes", symbol: "A", factor: 1 },
      { id: "mA", name: "Milliampere", pluralName: "milliamperes", symbol: "mA", factor: 0.001 },
      { id: "uA", name: "Microampere", pluralName: "microamperes", symbol: "µA", factor: 0.000001 }
    ]
  },
  {
    id: "magnetism",
    name: "Magnetism",
    icon: "Magnet",
    baseUnitId: "T",
    units: [
      { id: "T", name: "Tesla", pluralName: "teslas", symbol: "T", factor: 1 },
      { id: "G", name: "Gauss", pluralName: "gauss", symbol: "G", factor: 0.0001 },
      { id: "uT", name: "Microtesla", pluralName: "microteslas", symbol: "µT", factor: 0.000001 }
    ]
  },
  {
    id: "density",
    name: "Density",
    icon: "Layers",
    baseUnitId: "kg_m3",
    units: [
      { id: "kg_m3", name: "Kilogram per cubic meter", pluralName: "kilograms per cubic meter", symbol: "kg/m³", factor: 1 },
      { id: "g_cm3", name: "Gram per cubic centimeter", pluralName: "grams per cubic centimeter", symbol: "g/cm³", factor: 1000 },
      { id: "lb_ft3", name: "Pound per cubic foot", pluralName: "pounds per cubic foot", symbol: "lb/ft³", factor: 16.018463 }
    ]
  },
  {
    id: "massflow",
    name: "Mass Flow",
    icon: "Wind",
    baseUnitId: "kg_s",
    units: [
      { id: "kg_s", name: "Kilogram per second", pluralName: "kilograms per second", symbol: "kg/s", factor: 1 },
      { id: "kg_hr", name: "Kilogram per hour", pluralName: "kilograms per hour", symbol: "kg/h", factor: 0.000277778 },
      { id: "lb_s", name: "Pound per second", pluralName: "pounds per second", symbol: "lb/s", factor: 0.45359237 },
      { id: "lb_hr", name: "Pound per hour", pluralName: "pounds per hour", symbol: "lb/h", factor: 0.000125998 }
    ]
  },
  {
    id: "torque",
    name: "Torque",
    icon: "Wrench",
    baseUnitId: "Nm",
    units: [
      { id: "Nm", name: "Newton-meter", pluralName: "newton-meters", symbol: "N·m", factor: 1 },
      { id: "lb_ft", name: "Pound-foot", pluralName: "pound-feet", symbol: "lb·ft", factor: 1.355817948 },
      { id: "kg_m", name: "Kilogram-meter", pluralName: "kilogram-meters", symbol: "kg·m", factor: 9.80665 }
    ]
  },
  {
    id: "acceleration",
    name: "Acceleration",
    icon: "TrendingUp",
    baseUnitId: "m_s2",
    units: [
      { id: "m_s2", name: "Meter per sq second", pluralName: "meters per square second", symbol: "m/s²", factor: 1 },
      { id: "g_force", name: "G-Force", pluralName: "g-force multipliers", symbol: "g", factor: 9.80665 },
      { id: "ft_s2", name: "Foot per sq second", pluralName: "feet per square second", symbol: "ft/s²", factor: 0.3048 }
    ]
  },
  {
    id: "light",
    name: "Light / Illuminance",
    icon: "Sun",
    baseUnitId: "lux",
    units: [
      { id: "lux", name: "Lux", pluralName: "lux", symbol: "lx", factor: 1 },
      { id: "foot_candle", name: "Foot-candle", pluralName: "foot-candles", symbol: "fc", factor: 10.76391 }
    ]
  },
  {
    id: "sound",
    name: "Sound Level",
    icon: "Volume2",
    baseUnitId: "dB",
    units: [
      { id: "dB", name: "Decibel", pluralName: "decibels", symbol: "dB", factor: 1 },
      { id: "bel", name: "Bel", pluralName: "bels", symbol: "Bel", factor: 10 } // logarithmic handling done differently or relative
    ]
  },
  {
    id: "radiation",
    name: "Radiation",
    icon: "Radio",
    baseUnitId: "Sv",
    units: [
      { id: "Sv", name: "Sievert", pluralName: "sieverts", symbol: "Sv", factor: 1 },
      { id: "mSv", name: "Millisievert", pluralName: "millisieverts", symbol: "mSv", factor: 0.001 },
      { id: "Gy", name: "Gray", pluralName: "grays", symbol: "Gy", factor: 1 },
      { id: "rad", name: "Rad", pluralName: "rads", symbol: "rad", factor: 0.01 }
    ]
  },
  {
    id: "viscosity",
    name: "Viscosity",
    icon: "Droplets",
    baseUnitId: "Pa_s",
    units: [
      { id: "Pa_s", name: "Pascal-second", pluralName: "pascal-seconds", symbol: "Pa·s", factor: 1 },
      { id: "Poise", name: "Poise", pluralName: "poise", symbol: "P", factor: 0.1 },
      { id: "centiPoise", name: "Centipoise", pluralName: "centipoise", symbol: "cP", factor: 0.001 }
    ]
  },
];
