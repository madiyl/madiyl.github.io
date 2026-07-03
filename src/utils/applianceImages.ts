type ApplianceImageManifest = {
  images?: string[];
};

export function normalizeImageDir(path: string) {
  return path.trim().replace(/\/+$/, "");
}

export function getManifestUrl(dir: string) {
  const normalized = normalizeImageDir(dir);
  return normalized ? `${normalized}/manifest.json` : "";
}

export async function loadApplianceImages(dir: string) {
  const normalized = normalizeImageDir(dir);
  if (!normalized) return [];

  const manifestUrl = getManifestUrl(normalized);
  const response = await fetch(manifestUrl, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`图片清单读取失败：${response.status}`);
  }

  const manifest = (await response.json()) as ApplianceImageManifest;
  const images = Array.isArray(manifest.images) ? manifest.images : [];

  return images.map((image) => `${normalized}/${image}`);
}
