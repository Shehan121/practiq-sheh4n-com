import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { JOBS } from "@/lib/practiq-store";

export default defineTool({
  name: "list_jobs",
  title: "List internship jobs",
  description:
    "List all available internship opportunities in the Practiq catalog, with optional filters by city, language level, or visa sponsorship.",
  inputSchema: {
    city: z.string().optional().describe("Filter by city (e.g. Berlin, Munich)."),
    minMatch: z.number().min(0).max(100).optional().describe("Minimum match score 0-100."),
    visaOk: z.boolean().optional().describe("Only jobs offering visa sponsorship."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ city, minMatch, visaOk }) => {
    let results = JOBS.slice();
    if (city) results = results.filter((j) => j.city.toLowerCase() === city.toLowerCase());
    if (typeof minMatch === "number") results = results.filter((j) => j.match >= minMatch);
    if (typeof visaOk === "boolean") results = results.filter((j) => j.visaOk === visaOk);
    return {
      content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
      structuredContent: { jobs: results },
    };
  },
});