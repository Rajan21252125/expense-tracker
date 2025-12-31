// lib/utils.js
export const INR_LOCALE = 'en-IN';
export const INR_CURRENCY = 'INR';



export function formatDate(dateString) {
  // format date nicely
  // example: from this 👉 2025-05-20 to this 👉 May 20, 2025
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}



export function formatCurrencyINR(value) {
  return new Intl.NumberFormat(INR_LOCALE, {
    style: 'currency',
    currency: INR_CURRENCY,
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(value);
}