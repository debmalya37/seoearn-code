// src/utils/getCountryFromPhone.ts
export const countryCodeMap: Record<string, string> = {
    "91": "IN",
    "1": "US",
    "44": "GB",
    "81": "JP",
    "61": "AU",
    "49": "DE",
    "33": "FR",
    "86": "CN",
    "7": "RU",
    "880": "BD",
    "92": "PK",
    "971": "AE",
    "966": "SA",
    // Add more as needed
  };
  
  export function getCountryFromPhone(phone?: string): string | null {
    if (!phone) return null;
  
    const digits = phone.replace(/\D/g, '');
  
    // Try match longest prefix
    const sortedCodes = Object.keys(countryCodeMap).sort((a, b) => b.length - a.length);
    for (const code of sortedCodes) {
      if (digits.startsWith(code)) {
        return countryCodeMap[code];
      }
    }
  
    return null;
  }
  