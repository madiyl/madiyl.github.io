export function getLinkDisplayPrefix(url: string) {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, "") || "查看商品";
  } catch {
    return "查看商品";
  }
}
