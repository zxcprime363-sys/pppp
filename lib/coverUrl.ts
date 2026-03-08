export function coverUrl(cover?: string, size = 640) {
  if (!cover) return "/fallback-cover.jpg"; // default cover if missing
  return `https://resources.tidal.com/images/${cover.replace(/-/g, "/")}/${size}x${size}.jpg`;
}
