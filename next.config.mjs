/** @type {import('next').NextConfig} */
const repo = "BumbleFlowCMU";
const isGithubPagesBuild = process.env.GITHUB_ACTIONS === "true";

const nextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: isGithubPagesBuild ? `/${repo}` : "",
  assetPrefix: isGithubPagesBuild ? `/${repo}/` : "",
};

export default nextConfig;
