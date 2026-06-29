import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { getAllTools } from "./src/toolRegistry";

dotenv.config();

// Shared Gemini client setup
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

const app = express();
app.use(express.json());

const PORT = 3000;

// Programmatic SEO Sitemap Endpoint
app.get("/sitemap.xml", (req, res) => {
  const host = req.get("host") || "localhost:3000";
  const protocol = req.protocol || "https";
  const baseUrl = `${protocol}://${host}`;
  
  const tools = getAllTools().filter(t => t.sitemapInclusion);
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  
  // Add home
  xml += `  <url>\n    <loc>${baseUrl}/</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;
  
  // Add tools
  tools.forEach(tool => {
    xml += `  <url>\n    <loc>${baseUrl}/${tool.slug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
  });
  
  xml += `</urlset>`;
  res.header("Content-Type", "application/xml");
  res.send(xml);
});

// Programmatic SEO Robots.txt Endpoint
app.get("/robots.txt", (req, res) => {
  const host = req.get("host") || "localhost:3000";
  const protocol = req.protocol || "https";
  const baseUrl = `${protocol}://${host}`;
  
  const content = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`;
  res.header("Content-Type", "text/plain");
  res.send(content);
});

// Programmatic SEO RSS Feed Endpoint
app.get("/rss.xml", (req, res) => {
  const host = req.get("host") || "localhost:3000";
  const protocol = req.protocol || "https";
  const baseUrl = `${protocol}://${host}`;
  
  const tools = getAllTools().slice(0, 15); // Top tools for RSS feed
  
  let rss = `<?xml version="1.0" encoding="UTF-8" ?>\n<rss version="2.0">\n<channel>\n`;
  rss += `  <title>Universal Tools Platform RSS Feed</title>\n`;
  rss += `  <link>${baseUrl}</link>\n`;
  rss += `  <description>The latest secure, offline-first calculation, conversion, and developer productivity tools.</description>\n`;
  
  tools.forEach(tool => {
    rss += `  <item>\n`;
    rss += `    <title>${tool.title}</title>\n`;
    rss += `    <link>${baseUrl}/${tool.slug}</link>\n`;
    rss += `    <description>${tool.description}</description>\n`;
    rss += `    <guid>${baseUrl}/${tool.slug}</guid>\n`;
    rss += `  </item>\n`;
  });
  
  rss += `</channel>\n</rss>`;
  res.header("Content-Type", "application/xml");
  res.send(rss);
});

// Programmatic SEO LLM context map
app.get("/llms.txt", (req, res) => {
  const host = req.get("host") || "localhost:3000";
  const protocol = req.protocol || "https";
  const baseUrl = `${protocol}://${host}`;
  
  const tools = getAllTools();
  
  let content = `# Universal Tools Platform\n\n`;
  content += `An enterprise-quality, privacy-first hub for mathematical, engineering, financial, and developer utilities.\n\n`;
  content += `## Base URL: ${baseUrl}\n\n`;
  content += `## Available Tools\n\n`;
  
  tools.forEach(t => {
    content += `- **[${t.title}](${baseUrl}/${t.slug})**: ${t.description} (Category: ${t.categoryLabel})\n`;
  });
  
  res.header("Content-Type", "text/plain");
  res.send(content);
});

// Intelligent AI Natural Language Parsing powered by Gemini 3.5 Flash
app.post("/api/parse", async (req, res) => {
  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  if (!ai) {
    return res.json({
      error: "Gemini API key is not configured inside server environments.",
      isAiParsed: false
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Parse this natural language unit conversion query: "${query}"`,
      config: {
        systemInstruction: `You are an intelligent natural language parsing agent for the World's Best Unit Converter.
Analyze the user's conversion intent and extract:
1. The numeric value to convert (default to 1 if not specified).
2. The exact matching source categoryId, fromUnitId, and toUnitId based on standard metric or imperial structures.

Valid categoryIds: [length, weight, temperature, volume, area, cooking, time, speed, pressure, energy, power, digital, fuel, datatransfer, force, angle, typography, frequency, electricity, magnetism, density, massflow, torque, acceleration, light, sound, radiation, viscosity].

Supported typical Unit IDs to map to:
- length: [m, cm, mm, km, dm, micrometer, nanometer, inch, foot, yard, mile, mile_nautical, light_year]
- weight: [kg, g, mg, mcg, ton, pound, ounce, stone, grain, carat]
- temperature: [C, F, K, R]
- volume: [L, ml, m3, gallon, quart, pint, cup, fl_oz, tbsp, tsp]
- area: [m2, cm2, mm2, hectare, acre, sq_foot, sq_inch, sq_yard, sq_mile]
- speed: [m_s, km_h, mph, knot, mach]
- pressure: [Pa, kPa, bar, psi, atm, torr]
- energy: [J, kJ, cal, kcal, Wh, kWh, btu]
- power: [W, kW, MW, hp]
- digital: [bit, B, KB, MB, GB, TB, PB]

Return ONLY a flat JSON object with exact keys: "value", "categoryId", "fromUnitId", "toUnitId". No markdown formatting, code block markers, or trailing text.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            value: { type: Type.NUMBER, description: "The numeric input value to convert" },
            categoryId: { type: Type.STRING, description: "The matching category ID" },
            fromUnitId: { type: Type.STRING, description: "The normalized starting unit ID" },
            toUnitId: { type: Type.STRING, description: "The target destination unit ID" }
          },
          required: ["value", "categoryId", "fromUnitId", "toUnitId"]
        }
      }
    });

    const text = response.text?.trim() || "{}";
    const result = JSON.parse(text);
    return res.json({ ...result, isAiParsed: true });
  } catch (err: any) {
    console.error("Gemini query parsing failed:", err.message);
    return res.json({ error: "AI parser failed", isAiParsed: false });
  }
});

// Setup Vite Dev server or Serve static files
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

setupVite();
