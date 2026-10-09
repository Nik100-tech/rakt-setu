export function isValidIndianPhone(phone) {
  return /^[6-9]\d{9}$/.test(phone);
}

export function maskPhone(phone) {
  return phone ? `${phone.slice(0, 2)}XXXXXX${phone.slice(-2)}` : "";
}
