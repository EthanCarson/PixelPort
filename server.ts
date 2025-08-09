import { serve } from "https://deno.land/std@0.140.0/http/server.ts";
import { serveDir } from "https://deno.land/std@0.140.0/http/file_server.ts";

const port = parseInt(Deno.env.get("PORT") || "3000");

console.log(`HTTP webserver running. Access it at: http://localhost:${port}/`);

serve(async (req) => {
  const url = new URL(req.url);
  if (url.pathname.startsWith("/api")) {
    // Handle API routes here
    return new Response("API endpoint not implemented", { status: 501 });
  }
  return serveDir(req, {
    fsRoot: "dist",
    urlRoot: "",
    showDirListing: true,
    enableCors: true,
  });
}, { port });
