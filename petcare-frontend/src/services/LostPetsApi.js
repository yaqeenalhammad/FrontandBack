import { API_ORIGIN } from "../config/api";

async function readError(res) {
  const ct = res.headers.get("content-type") || "";
  try {
    if (ct.includes("application/json")) {
      const data = await res.json();

      
      if (data?.errors && typeof data.errors === "object") {
        const k = Object.keys(data.errors)[0];
        const msg = data.errors?.[k]?.[0];
        return msg || data?.message || data?.title || "Request failed";
      }

      return data?.message || data?.title || "Request failed";
    }

    const text = await res.text();
    return text || "Request failed";
  } catch {
    return "Request failed";
  }
}

export async function getLostPets() {
  const res = await fetch(`${API_ORIGIN}/api/lost-pets`);
  if (!res.ok) throw new Error(await readError(res));
  return res.json();
}

export async function getLostPetByTagId(tagId) {
  const res = await fetch(`${API_ORIGIN}/api/lost-pets/${encodeURIComponent(tagId)}`);
  if (!res.ok) throw new Error(await readError(res));
  return res.json();
}

export async function createLostPet(form) {
  const fd = new FormData();

  
  fd.append("PostType", form.postType ?? "Lost");
  fd.append("TagId", form.tagId ?? "");
  fd.append("PetType", form.petType ?? "");
  fd.append("PetName", form.petName ?? "");
  fd.append("Gender", form.gender ?? "");
  fd.append("Color", form.color ?? "");
  fd.append("City", form.city ?? "");
  fd.append("Area", form.area ?? "");
  fd.append("Description", form.description ?? "");
  fd.append("ContactPhone", form.contactPhone ?? "");
  fd.append("Reward", form.reward ?? "");
  fd.append("LostDate", form.lostDate ?? "");

  
  fd.append("AgeMonths", String(form.ageMonths ?? 0));

  
  fd.append("LastSeen", form.lastSeenAt ?? "");

  
  const files = Array.isArray(form.images) ? form.images : [];
  for (const f of files) fd.append("Images", f);

  const res = await fetch(`${API_ORIGIN}/api/lost-pets`, {
    method: "POST",
    body: fd,
  });

  if (!res.ok) throw new Error(await readError(res));
  return res.json();
}
