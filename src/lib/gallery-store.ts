// Simple in-memory store for gallery data (will be replaced by backend later)

export interface GalleryData {
  yourName: string;
  partnerName: string;
  loveMessage: string;
  specialDate?: string;
  photos: { id: string; url: string; file?: File }[];
  theme: "rose-red" | "soft-pink" | "candle-light" | "midnight-passion" | "ocean-romance" | "golden-sunset" | "enchanted-forest" | "lavender-dream" | "velvet-night" | "classic-love" | "cherry-blossom" | "starry-sky" | "autumn-warmth" | "mystic-aura" | "pure-elegance";
  music: "romantic" | "piano" | "love-song";
  stories: { title: string; content: string; icon: string }[];
  slug: string;
}

const galleries = new Map<string, GalleryData>();

export const generateSlug = (name1: string, name2: string) => {
  const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  const random = Math.random().toString(36).substring(2, 7);
  return `${clean(name1)}-${clean(name2)}-${random}`;
};

export const saveGallery = (data: GalleryData) => {
  galleries.set(data.slug, data);
};

export const getGallery = (slug: string) => {
  return galleries.get(slug) || null;
};
