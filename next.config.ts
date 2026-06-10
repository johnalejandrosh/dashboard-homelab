import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingIncludes: {
    "/*": [
      "./app/generated/prisma/**/*",
      "./node_modules/@prisma/client/**/*",
      "./node_modules/.prisma/**/*",
    ],
  },
};

export default nextConfig;
