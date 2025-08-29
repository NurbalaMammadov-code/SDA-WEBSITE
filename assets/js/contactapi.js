import { api } from "./api.js";

function splitFullName(fullName) {
  const parts = (fullName || "").trim().split(/\s+/);
  if (parts.length <= 1) return { first_name: parts[0] || "", last_name: "-" };
  return { first_name: parts[0], last_name: parts.slice(1).join(" ") };
}

// POST /api/v1/contact-messages  (multipart)
export function submitContact({ fullName, phone, email, message="", cvFile=null }) {
  const { first_name, last_name } = splitFullName(fullName);
  const fd = new FormData();
  fd.append("first_name", first_name);
  fd.append("last_name",  last_name);
  fd.append("phone_number", phone);
  fd.append("email", email);
  if (message) fd.append("message", message);
  if (cvFile)  fd.append("cv", cvFile);
  return api.post("/api/v1/contact-messages", fd);
}
