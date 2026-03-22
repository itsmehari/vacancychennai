export type CityContext = {
  cityKey: "chennai" | "coimbatore" | "bangalore";
  zoneHint?: string;
};

const subdomainMap: Record<string, CityContext> = {
  "omr.vacancychennai.in": { cityKey: "chennai", zoneHint: "omr" },
  "tambaram.vacancychennai.in": { cityKey: "chennai", zoneHint: "tambaram" },
  "vacancycovai.in": { cityKey: "coimbatore" },
  "vacancybangalore.in": { cityKey: "bangalore" },
};

export function getCityContextFromHost(host: string): CityContext {
  return subdomainMap[host.toLowerCase()] ?? { cityKey: "chennai" };
}

