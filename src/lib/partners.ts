export interface PartnerItem {
  id: string;
  name: string;
  url: string;
  icon?: string;
  description?: string;
  active: boolean;
  order: number;
  updatedAt?: string;
}

export const DEFAULT_PARTNERS: PartnerItem[] = [
  {
    id: "htx-369",
    name: "HTX GD 369",
    url: "https://369-daotao.vercel.app/",
    icon: "🏫",
    description: "Hợp tác xã Gia Đình 369 - Đối tác đào tạo & phát triển sâm",
    active: true,
    order: 1,
    updatedAt: new Date().toISOString(),
  },
];

const STORAGE_KEY = "custom_partners_list";

export function getPartners(): PartnerItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Lỗi khi đọc danh sách đối tác từ storage:", e);
  }
  // Mặc định lưu lại nếu chưa có
  savePartners(DEFAULT_PARTNERS);
  return DEFAULT_PARTNERS;
}

export function getActivePartners(): PartnerItem[] {
  const all = getPartners();
  return all
    .filter((p) => p.active)
    .sort((a, b) => (a.order || 0) - (b.order || 0));
}

export function savePartners(partners: PartnerItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(partners));
    window.dispatchEvent(new Event("partners_updated"));
  } catch (e) {
    console.error("Lỗi khi lưu danh sách đối tác:", e);
  }
}

export function addPartner(partnerData: Omit<PartnerItem, "id" | "updatedAt">): PartnerItem {
  const current = getPartners();
  const newPartner: PartnerItem = {
    ...partnerData,
    id: "partner-" + Date.now() + "-" + Math.random().toString(36).substr(2, 5),
    updatedAt: new Date().toISOString(),
  };
  const updated = [newPartner, ...current];
  savePartners(updated);
  return newPartner;
}

export function updatePartner(id: string, partnerData: Partial<PartnerItem>): PartnerItem[] {
  const current = getPartners();
  const updated = current.map((item) => {
    if (item.id === id) {
      return {
        ...item,
        ...partnerData,
        updatedAt: new Date().toISOString(),
      };
    }
    return item;
  });
  savePartners(updated);
  return updated;
}

export function deletePartner(id: string): PartnerItem[] {
  const current = getPartners();
  const updated = current.filter((item) => item.id !== id);
  savePartners(updated);
  return updated;
}
