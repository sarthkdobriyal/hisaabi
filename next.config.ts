import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['03e4-2405-201-681b-d15a-b5b8-e4b4-e337-ff1d.ngrok-free.app'],
  async headers() {
    return [
      {
        // Chat calls the user's chosen AI provider directly from the browser
        // (OpenAI/Gemini/Groq/custom/Ollama), so connect-src can't be pinned
        // to a fixed allowlist of hosts.
        source: "/app/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' https: http://localhost:*; font-src 'self' data:; object-src 'none'; base-uri 'self'; frame-ancestors 'none';",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
