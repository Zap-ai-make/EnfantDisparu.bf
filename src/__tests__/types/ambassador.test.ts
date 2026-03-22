import { describe, it, expect } from "vitest";
import type {
  Ambassador,
  AmbassadorStats,
  SubmitApplicationInput,
  SubmitApplicationResult,
  ApproveAmbassadorResult,
  CatAnswer,
  AmbassadorStatus,
} from "@/types/ambassador";

/**
 * Tests de types TypeScript pour Ambassador
 * Ces tests vérifient que les types sont bien définis et utilisables
 */

describe("Ambassador Types", () => {
  describe("Ambassador interface", () => {
    it("should create valid Ambassador object", () => {
      const ambassador: Ambassador = {
        id: "test-id",
        refCode: "AMB-ABCD",
        firstName: "Jean",
        lastName: "Dupont",
        phone: "+22670000000",
        zones: ["bfa-ouaga-pissy"],
        dateOfBirth: { toDate: () => new Date(1990, 0, 1) } as any,
        catAnswer: "yes",
        status: "approved",
        createdAt: { toDate: () => new Date() } as any,
        approvedAt: { toDate: () => new Date() } as any,
        stats: {
          notificationsActivated: 5,
          alertsShared: 10,
          ambassadorsRecruited: 2,
          viewsGenerated: 100,
        },
      };

      expect(ambassador.refCode).toMatch(/^AMB-[A-Z0-9]{4}$/);
      expect(ambassador.status).toBe("approved");
      expect(ambassador.stats.notificationsActivated).toBe(5);
    });

    it("should allow pending status", () => {
      const status: AmbassadorStatus = "pending";
      expect(["pending", "approved", "rejected"]).toContain(status);
    });

    it("should allow all cat answer options", () => {
      const answers: CatAnswer[] = ["yes", "no", "maybe"];
      answers.forEach((answer) => {
        expect(["yes", "no", "maybe"]).toContain(answer);
      });
    });
  });

  describe("AmbassadorStats interface", () => {
    it("should create valid stats object", () => {
      const stats: AmbassadorStats = {
        notificationsActivated: 0,
        alertsShared: 0,
        ambassadorsRecruited: 0,
        viewsGenerated: 0,
      };

      expect(stats.notificationsActivated).toBe(0);
      expect(stats.alertsShared).toBe(0);
      expect(stats.ambassadorsRecruited).toBe(0);
      expect(stats.viewsGenerated).toBe(0);
    });
  });

  describe("SubmitApplicationInput interface", () => {
    it("should create valid application input", () => {
      const input: SubmitApplicationInput = {
        firstName: "Jean",
        lastName: "Dupont",
        phone: "70000000",
        countryCode: "BFA",
        city: "Ouagadougou",
        zoneId: "bfa-ouaga-pissy",
        dateOfBirth: {
          day: 15,
          month: 6,
          year: 1990,
        },
        catAnswer: "yes",
        honeypot: "",
      };

      expect(input.firstName).toBe("Jean");
      expect(input.dateOfBirth.year).toBe(1990);
      expect(input.catAnswer).toBe("yes");
    });

    it("should allow optional honeypot", () => {
      const input: SubmitApplicationInput = {
        firstName: "Jean",
        lastName: "Dupont",
        phone: "70000000",
        countryCode: "BFA",
        city: "Ouagadougou",
        zoneId: "bfa-ouaga-pissy",
        dateOfBirth: { day: 1, month: 1, year: 1990 },
        catAnswer: "no",
      };

      expect(input.honeypot).toBeUndefined();
    });
  });

  describe("SubmitApplicationResult interface", () => {
    it("should create successful result", () => {
      const result: SubmitApplicationResult = {
        success: true,
        refCode: "AMB-ABCD",
      };

      expect(result.success).toBe(true);
      expect(result.refCode).toBe("AMB-ABCD");
    });

    it("should create error result with all error types", () => {
      const errorTypes = [
        "rate_limited",
        "too_young",
        "duplicate_pending",
        "duplicate_approved",
        "duplicate_rejected",
        "invalid_zone",
      ] as const;

      errorTypes.forEach((errorType) => {
        const result: SubmitApplicationResult = {
          success: false,
          error: errorType,
        };

        expect(result.success).toBe(false);
        expect(result.error).toBe(errorType);
      });
    });
  });

  describe("ApproveAmbassadorResult interface", () => {
    it("should create successful approval result", () => {
      const result: ApproveAmbassadorResult = {
        success: true,
        accessToken: "test-token",
        dashboardUrl: "https://enfentdisparu.bf/ambassadeur?t=test-token",
      };

      expect(result.success).toBe(true);
      expect(result.accessToken).toBe("test-token");
      expect(result.dashboardUrl).toContain("test-token");
    });

    it("should create error result", () => {
      const result: ApproveAmbassadorResult = {
        success: false,
        error: "Ambassador not found",
      };

      expect(result.success).toBe(false);
      expect(result.error).toBe("Ambassador not found");
    });
  });

  describe("Type guards and validation", () => {
    it("should validate refCode format at runtime", () => {
      const isValidRefCode = (code: string): boolean => {
        return /^AMB-[A-Z0-9]{4}$/.test(code);
      };

      expect(isValidRefCode("AMB-ABCD")).toBe(true);
      expect(isValidRefCode("AMB-1234")).toBe(true);
      expect(isValidRefCode("INVALID")).toBe(false);
    });

    it("should validate phone format at runtime", () => {
      const isValidPhone = (phone: string): boolean => {
        return /^\+226\d{8}$/.test(phone);
      };

      expect(isValidPhone("+22670000000")).toBe(true);
      expect(isValidPhone("+22678123456")).toBe(true);
      expect(isValidPhone("70000000")).toBe(false);
      expect(isValidPhone("+33612345678")).toBe(false);
    });

    it("should validate zone hierarchy", () => {
      const isValidZoneId = (zoneId: string): boolean => {
        return /^[a-z]{3}-[a-z]+-[a-z]+$/.test(zoneId);
      };

      expect(isValidZoneId("bfa-ouaga-pissy")).toBe(true);
      expect(isValidZoneId("bfa-bobo-centre")).toBe(true);
      expect(isValidZoneId("invalid")).toBe(false);
    });
  });
});
