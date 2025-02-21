export type ItemStatus = "pending" | "done";

const encode = (itemStatus: ItemStatus): string => {
  return itemStatus;
};

const decode = (itemStatus: unknown): ItemStatus | null => {
  if (typeof itemStatus !== "string") {
    return null;
  }
  const cleaned = itemStatus.trim().toLowerCase();
  if (cleaned.includes("pending")) {
    return "pending";
  }
  if (cleaned.includes("done")) {
    return "done";
  }
  return null;
};

export const ItemStatus = {
  encode,
  decode,
};
