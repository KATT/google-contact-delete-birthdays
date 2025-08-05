import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const withMDX = createMDX({
  // Optionally provide remark and rehype plugins
  options: {
    // If you use remark-gfm, you'll need to use next.config.mjs
    // as the package is ESM only
    // https://github.com/remarkjs/remark-gfm#install
    remarkPlugins: [],
    rehypePlugins: [],
  },
  extension: /\.(md|mdx)$/,
});

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  reactStrictMode: true,

  experimental: {
    mdxRs: true,
  },
  /* config options here */
};

export default withMDX(nextConfig);
