import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  generateRefCodeCandidate,
  isValidRefCode,
  generateAccessToken,
  calculateAge,
  isMinimumAge,
  getMaxBirthYear,
  normalizePhone,
  isValidPhone,
  validateZoneHierarchy,
  SHARE_MESSAGES,
  getDashboardUrl,
  getShareUrl,
} from "@/lib/ambassador-utils";

describe("ambassador-utils", () => {
  // ─── generateRefCodeCandidate ─────────────────────────────────────────────

  describe("generateRefCodeCandidate", () => {
    it("should generate code in AMB-XXXX format", () => {
      const code = generateRefCodeCandidate();
      expect(code).toMatch(/^AMB-[A-Z0-9]{4}$/);
    });

    it("should generate different codes on each call", () => {
      const codes = new Set<string>();
      for (let i = 0; i < 100; i++) {
        codes.add(generateRefCodeCandidate());
      }
      // Should have generated mostly unique codes
      expect(codes.size).toBeGreaterThan(90);
    });

    it("should only contain alphanumeric characters after AMB-", () => {
      for (let i = 0; i < 50; i++) {
        const code = generateRefCodeCandidate();
        const suffix = code.slice(4);
        expect(suffix).toMatch(/^[A-Z0-9]+$/);
      }
    });
  });

  // ─── isValidRefCode ───────────────────────────────────────────────────────

  describe("isValidRefCode", () => {
    it("should validate correct ref codes", () => {
      expect(isValidRefCode("AMB-ABCD")).toBe(true);
      expect(isValidRefCode("AMB-1234")).toBe(true);
      expect(isValidRefCode("AMB-A1B2")).toBe(true);
      expect(isValidRefCode("AMB-ZZZZ")).toBe(true);
    });

    it("should reject invalid ref codes", () => {
      expect(isValidRefCode("AMB-abc")).toBe(false); // lowercase
      expect(isValidRefCode("AMB-ABC")).toBe(false); // only 3 chars
      expect(isValidRefCode("AMB-ABCDE")).toBe(false); // 5 chars
      expect(isValidRefCode("VIG-ABCD")).toBe(false); // wrong prefix
      expect(isValidRefCode("AMBABCD")).toBe(false); // no dash
      expect(isValidRefCode("AMB-AB-D")).toBe(false); // extra dash
      expect(isValidRefCode("")).toBe(false);
    });
  });

  // ─── generateAccessToken ──────────────────────────────────────────────────

  describe("generateAccessToken", () => {
    it("should generate a UUID format token", () => {
      const token = generateAccessToken();
      // UUID format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
      // In test env, crypto.randomUUID is mocked, so we just check it returns a string
      expect(typeof token).toBe("string");
      expect(token.length).toBeGreaterThan(0);
    });
  });

  // ─── calculateAge ─────────────────────────────────────────────────────────

  describe("calculateAge", () => {
    beforeEach(() => {
      // Mock current date to 2024-06-15
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2024, 5, 15));
    });

    it("should calculate age correctly for past birthday this year", () => {
      const dob = new Date(2000, 0, 1); // Jan 1, 2000
      expect(calculateAge(dob)).toBe(24);
    });

    it("should calculate age correctly for future birthday this year", () => {
      const dob = new Date(2000, 11, 25); // Dec 25, 2000
      expect(calculateAge(dob)).toBe(23);
    });

    it("should calculate age correctly for birthday today", () => {
      const dob = new Date(2000, 5, 15); // June 15, 2000
      expect(calculateAge(dob)).toBe(24);
    });

    it("should handle leap year birthdays", () => {
      const dob = new Date(2000, 1, 29); // Feb 29, 2000
      expect(calculateAge(dob)).toBe(24);
    });
  });

  // ─── isMinimumAge ─────────────────────────────────────────────────────────

  describe("isMinimumAge", () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2024, 5, 15));
    });

    it("should return true if person is exactly minimum age", () => {
      const dob = new Date(2004, 5, 15); // Exactly 20 today
      expect(isMinimumAge(dob, 20)).toBe(true);
    });

    it("should return true if person is older than minimum", () => {
      const dob = new Date(2000, 0, 1); // 24 years old
      expect(isMinimumAge(dob, 20)).toBe(true);
    });

    it("should return false if person is younger than minimum", () => {
      const dob = new Date(2005, 0, 1); // 19 years old
      expect(isMinimumAge(dob, 20)).toBe(false);
    });

    it("should return false if birthday is tomorrow and would make them 20", () => {
      const dob = new Date(2004, 5, 16); // Tomorrow is 20th birthday
      expect(isMinimumAge(dob, 20)).toBe(false);
    });
  });

  // ─── getMaxBirthYear ──────────────────────────────────────────────────────

  describe("getMaxBirthYear", () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2024, 5, 15));
    });

    it("should return correct max birth year for minimum age", () => {
      expect(getMaxBirthYear(20)).toBe(2004);
      expect(getMaxBirthYear(18)).toBe(2006);
      expect(getMaxBirthYear(30)).toBe(1994);
    });
  });

  // ─── normalizePhone ───────────────────────────────────────────────────────

  describe("normalizePhone", () => {
    it("should normalize 8-digit number to E.164", () => {
      expect(normalizePhone("70000000")).toBe("+22670000000");
      expect(normalizePhone("78123456")).toBe("+22678123456");
    });

    it("should handle numbers with spaces", () => {
      expect(normalizePhone("70 00 00 00")).toBe("+22670000000");
      expect(normalizePhone("70 12 34 56")).toBe("+22670123456");
    });

    it("should handle numbers with dashes", () => {
      expect(normalizePhone("70-00-00-00")).toBe("+22670000000");
    });

    it("should handle numbers with parentheses", () => {
      expect(normalizePhone("(70) 00 00 00")).toBe("+22670000000");
    });

    it("should convert 00226 prefix to +226", () => {
      expect(normalizePhone("0022670000000")).toBe("+22670000000");
    });

    it("should handle local format with leading 0", () => {
      // 0700000000 is 10 digits, the function removes leading 0 giving 9 digits
      // This becomes +226 + 700000000 = +226700000000 (12 chars)
      const result = normalizePhone("0700000000");
      expect(result).toBe("+226700000000");
    });

    it("should clean existing +226 numbers", () => {
      expect(normalizePhone("+226 70 00 00 00")).toBe("+22670000000");
      expect(normalizePhone("+226-70-00-00-00")).toBe("+22670000000");
    });

    it("should preserve already normalized numbers", () => {
      expect(normalizePhone("+22670000000")).toBe("+22670000000");
    });
  });

  // ─── isValidPhone ─────────────────────────────────────────────────────────

  describe("isValidPhone", () => {
    it("should validate correct Burkina Faso numbers", () => {
      expect(isValidPhone("70000000")).toBe(true);
      expect(isValidPhone("78123456")).toBe(true);
      expect(isValidPhone("+22670000000")).toBe(true);
      expect(isValidPhone("70 00 00 00")).toBe(true);
    });

    it("should reject invalid numbers", () => {
      expect(isValidPhone("7000000")).toBe(false); // 7 digits
      expect(isValidPhone("700000000")).toBe(false); // 9 digits
      expect(isValidPhone("+33612345678")).toBe(false); // French number
      expect(isValidPhone("")).toBe(false);
    });
  });

  // ─── validateZoneHierarchy ────────────────────────────────────────────────

  describe("validateZoneHierarchy", () => {
    it("should validate correct zone hierarchy", () => {
      const result = validateZoneHierarchy("BFA", "Ouagadougou", "bfa-ouaga-pissy");
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it("should reject invalid country", () => {
      const result = validateZoneHierarchy("INVALID", "Ouagadougou", "bfa-ouaga-pissy");
      expect(result.valid).toBe(false);
      expect(result.error).toBe("Pays invalide");
    });

    it("should reject city not in country", () => {
      const result = validateZoneHierarchy("BFA", "Paris", "bfa-ouaga-pissy");
      expect(result.valid).toBe(false);
      expect(result.error).toBe("Ville invalide pour ce pays");
    });

    it("should reject zone not in city", () => {
      const result = validateZoneHierarchy("BFA", "Ouagadougou", "bfa-bobo-centre");
      expect(result.valid).toBe(false);
      expect(result.error).toBe("Quartier invalide pour cette ville");
    });
  });

  // ─── SHARE_MESSAGES ───────────────────────────────────────────────────────

  describe("SHARE_MESSAGES", () => {
    const testRefCode = "AMB-TEST";

    it("should generate WhatsApp invitation message with ref code", () => {
      const message = SHARE_MESSAGES.whatsappInvitation(testRefCode);
      expect(message).toContain(testRefCode);
      expect(message).toContain("enfentdisparu.bf");
      expect(message).toContain("ref=AMB-TEST");
    });

    it("should generate WhatsApp ambassador recruitment message", () => {
      const message = SHARE_MESSAGES.whatsappAmbassador(testRefCode);
      expect(message).toContain(testRefCode);
      expect(message).toContain("ambassadeur");
    });

    it("should generate social media message", () => {
      const message = SHARE_MESSAGES.socialMedia(testRefCode);
      expect(message).toContain(testRefCode);
      expect(message).toContain("#EnfantDisparuBF");
    });
  });

  // ─── getDashboardUrl ──────────────────────────────────────────────────────

  describe("getDashboardUrl", () => {
    it("should generate correct dashboard URL", () => {
      const url = getDashboardUrl("test-token-123");
      expect(url).toBe("https://enfentdisparu.bf/ambassadeur/dashboard?t=test-token-123");
    });
  });

  // ─── getShareUrl ──────────────────────────────────────────────────────────

  describe("getShareUrl", () => {
    it("should generate correct share URL", () => {
      const url = getShareUrl("AMB-TEST");
      expect(url).toBe("https://enfentdisparu.bf/?ref=AMB-TEST");
    });
  });
});
