import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { JOBS } from "@/lib/practiq-store";

export default defineTool({
  name: "get_job",
  title: "Get job details",
  description: "Fetch details for a single internship by its ID.",
  inputSchema: {
    id: z.string().min(1).describe("Job ID (e.g. n26, dh, cel, tr)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ id }) => {
    const job = JOBS.find((j) => j.id === id);
    if (!job) {
      return { content: [{ type: "text", text: `No job found with id "${id}".` }], isError: true };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(job, null, 2) }],
      structuredContent: { job },
    };
  },
});