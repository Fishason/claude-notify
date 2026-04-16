// Orange "CC" logo as inline SVG
export const CC_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FF8C42"/>
      <stop offset="100%" style="stop-color:#E6692B"/>
    </linearGradient>
  </defs>
  <rect width="256" height="256" rx="56" fill="url(#bg)"/>
  <text x="128" y="170" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Display','Helvetica Neue',Arial,sans-serif" font-size="140" font-weight="700" fill="white" text-anchor="middle" letter-spacing="-8">CC</text>
</svg>`;

export function handleIcon(): Response {
  return new Response(CC_ICON_SVG, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
