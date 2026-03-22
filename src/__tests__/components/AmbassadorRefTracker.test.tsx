import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import Cookies from "js-cookie";
import { AmbassadorRefTracker, getStoredAmbassadorRef } from "@/components/AmbassadorRefTracker";

// Mock useSearchParams
const mockGet = vi.fn();
vi.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: mockGet,
  }),
}));

describe("AmbassadorRefTracker", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    (Cookies.set as ReturnType<typeof vi.fn>).mockClear();
  });

  describe("AmbassadorRefTracker component", () => {
    it("should render nothing (null)", () => {
      mockGet.mockReturnValue(null);
      const { container } = render(<AmbassadorRefTracker />);
      expect(container.firstChild).toBeNull();
    });

    it("should store valid ref code in localStorage", () => {
      mockGet.mockReturnValue("AMB-ABCD");
      render(<AmbassadorRefTracker />);

      expect(localStorage.setItem).toHaveBeenCalledWith("ambassador_ref", "AMB-ABCD");
    });

    it("should store valid ref code in cookie", () => {
      mockGet.mockReturnValue("AMB-1234");
      render(<AmbassadorRefTracker />);

      expect(Cookies.set).toHaveBeenCalledWith(
        "ambassador_ref",
        "AMB-1234",
        expect.objectContaining({ expires: 30 })
      );
    });

    it("should not store invalid ref code", () => {
      mockGet.mockReturnValue("INVALID");
      render(<AmbassadorRefTracker />);

      expect(localStorage.setItem).not.toHaveBeenCalled();
      expect(Cookies.set).not.toHaveBeenCalled();
    });

    it("should not store ref code with wrong format", () => {
      mockGet.mockReturnValue("AMB-abc"); // lowercase
      render(<AmbassadorRefTracker />);

      expect(localStorage.setItem).not.toHaveBeenCalled();
    });

    it("should not store ref code with wrong length", () => {
      mockGet.mockReturnValue("AMB-ABCDE"); // 5 chars
      render(<AmbassadorRefTracker />);

      expect(localStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe("getStoredAmbassadorRef", () => {
    it("should return ref from localStorage first", () => {
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue("AMB-LOCAL");
      (Cookies.get as ReturnType<typeof vi.fn>).mockReturnValue("AMB-COOKIE");

      const result = getStoredAmbassadorRef();

      expect(result).toBe("AMB-LOCAL");
      expect(localStorage.getItem).toHaveBeenCalledWith("ambassador_ref");
    });

    it("should fall back to cookie if localStorage is empty", () => {
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);
      (Cookies.get as ReturnType<typeof vi.fn>).mockReturnValue("AMB-COOKIE");

      const result = getStoredAmbassadorRef();

      expect(result).toBe("AMB-COOKIE");
    });

    it("should return null if no ref is stored", () => {
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);
      (Cookies.get as ReturnType<typeof vi.fn>).mockReturnValue(undefined);

      const result = getStoredAmbassadorRef();

      expect(result).toBeNull();
    });

    it("should handle localStorage errors gracefully", () => {
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockImplementation(() => {
        throw new Error("localStorage unavailable");
      });
      (Cookies.get as ReturnType<typeof vi.fn>).mockReturnValue("AMB-FALLBACK");

      const result = getStoredAmbassadorRef();

      expect(result).toBe("AMB-FALLBACK");
    });
  });
});
