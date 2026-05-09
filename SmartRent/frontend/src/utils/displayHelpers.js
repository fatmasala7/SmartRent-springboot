export const PROPERTY_PLACEHOLDER =
  "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&auto=format&fit=crop&q=70";

export function getPropertyId(property) {
  if (!property) return null;
  const value = property.propertyID ?? property.propertyId ?? property.id;
  const numberValue = Number(value);
  return Number.isFinite(numberValue) && numberValue > 0 ? numberValue : null;
}

export function getImageUrlFromProperty(property, fallback = PROPERTY_PLACEHOLDER) {
  if (!property) return fallback;
  if (property.mainImageUrl) return property.mainImageUrl;
  if (property.imageUrl) return property.imageUrl;
  if (property.propertyImageUrl) return property.propertyImageUrl;
  if (property.propertyImage) return property.propertyImage;
  if (property.image && typeof property.image === "string") return property.image;
  if (Array.isArray(property.images) && property.images.length > 0) {
    const main = property.images.find((img) => img?.isMain || img?.main);
    const selected = main || property.images[0];
    if (typeof selected === "string") return selected;
    if (selected?.imageUrl) return selected.imageUrl;
    if (selected?.url) return selected.url;
  }
  return fallback;
}

export function formatCurrency(value, suffix = "EGP / month") {
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue)) return "-";
  return `${numberValue.toLocaleString()} ${suffix}`;
}

export function formatDate(value, options = { year: "numeric", month: "long", day: "numeric" }) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-US", options);
}

export function normalizePropertySummary(property, fallbackId) {
  const id = getPropertyId(property) ?? fallbackId ?? null;
  return {
    id,
    title: property?.title || (id ? `Property #${id}` : "Property information unavailable"),
    location: property?.location || "-",
    price: property?.price ?? null,
    image: getImageUrlFromProperty(property),
  };
}
