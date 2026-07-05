import { defineMcp } from "@lovable.dev/mcp-js";
import listJobsTool from "./tools/list-jobs";
import getJobTool from "./tools/get-job";

export default defineMcp({
  name: "practiq-mcp",
  title: "Practiq MCP",
  version: "0.1.0",
  instructions:
    "Tools for Practiq, an internship matching app for international students in Germany. Use `list_jobs` to browse available internships (optionally filtered by city, minimum match score, or visa sponsorship) and `get_job` to fetch details for a specific opportunity.",
  tools: [listJobsTool, getJobTool],
});