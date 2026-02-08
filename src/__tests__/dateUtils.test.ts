import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { getCurrentYear, add, isWithinRange, getHolidays, isHoliday, isDateBefore, isSameDay as isSameDayUtil } from '../dateUtils';
import { DATE_UNIT_TYPES } from '../constants';

describe("Date Utils", () => {
  describe("Get current year", () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-02-08")); 
    }); 

    afterEach(() => {
      vi.useRealTimers();
    });
    it("getcurrentYear returns the correct year", () => {
      const year = getCurrentYear();
      expect(year).toBe(2026);
    })
  })

  describe("Add time to dates", () => {
    it("should throw error for invalid date", () => {
      expect(() => add("juss a lil date", 5)).toThrow("Invalid date provided");
      expect(() => add(null, 5)).toThrow("Invalid date provided");
      expect(() => add(new Date("invalid"), 5)).toThrow("Invalid date provided");
    });

    it("should throw error for invalid amount", () => {
      const date = new Date("2026-02-08");
      expect(() => add(date, "two whole weeks baby")).toThrow("Invalid amount provided");
      expect(() => add(date, NaN)).toThrow("Invalid amount provided");
    });

    it("should add days to a date by default", () => {
      const date = new Date("2026-02-08");
      const result = add(date, 5);
      const expected = new Date("2026-02-13");
      expect(result).toEqual(expected);
    });

    it("should add weeks to a date", () => {
      const date = new Date("2026-02-08");
      const result = add(date, 2, DATE_UNIT_TYPES.WEEKS);
      const expected = new Date("2026-02-22");
      expect(result).toEqual(expected);
    });

    it("should handle negative numbers (subtract time)", () => {
      const date = new Date("2026-02-08");
      const result = add(date, -5, DATE_UNIT_TYPES.DAYS);
      const expected = new Date("2026-02-03");
      expect(result).toEqual(expected);
    });

    it("should handle adding zero", () => {
      const date = new Date("2026-02-08");
      const result = add(date, 0, DATE_UNIT_TYPES.DAYS);
      expect(result).toEqual(date);
    });

    it("should handle different unit types (months)", () => {
      const date = new Date("2026-02-08");
      const result = add(date, 3, DATE_UNIT_TYPES.MONTHS);
      const expected = new Date("2026-05-08");
      expect(result).toEqual(expected);
    });

    it("should handle different unit types (years)", () => {
      const date = new Date("2026-02-08");
      const result = add(date, 1, DATE_UNIT_TYPES.YEARS);
      const expected = new Date("2027-02-08");
      expect(result).toEqual(expected);
    });

    it("should handle boundary dates (year transition)", () => {
      const date = new Date("2026-12-30");
      const result = add(date, 5, DATE_UNIT_TYPES.DAYS);
      const expected = new Date("2027-01-04");
      expect(result).toEqual(expected);
    });
  }); 

  describe("isWithinRange", () => {
    it("Should throw an error for invalid range", () => {
      const date = "2026-03-26";
      const from = "2022-02-08"; 
      const to = "2001-12-12";
      expect(() => isWithinRange(date, from, to)).toThrow("Invalid range: from date must be before to date");
    });

    it("Should return false if it is not within range", () => {
      const date = "2026-03-26";
      const from = "2001-02-08"; 
      const to = "2007-12-12";
      expect(isWithinRange(date, from, to)).toBe(false);
    });

    it("Should return true if it is within range", () => {
      const date = "2026-03-26";
      const from = "2001-02-08"; 
      const to = "2037-12-12";
      expect(isWithinRange(date, from, to)).toBe(true);
    });

    it("Should handle boundary dates (date equals from or to)", () => {
      const date = "2026-02-08";
      const from = "2026-02-08";
      const to = "2026-02-08";
      expect(isWithinRange(date, from, to)).toBe(false);
    });
  });
  describe("isSameDay", () => {
    it("Should return true if it is the same day", () => {
      const date = "2026-02-08";
      const compareDate = "2026-02-08";
      expect(isSameDayUtil(date, compareDate)).toBe(true);
    });

    it("Should return false if it is a different day", () => {
      const date = "2026-02-08";
      const compareDate = "2026-02-14";
      expect(isSameDayUtil(date, compareDate)).toBe(false);
    });

    it("Should return true for same day with different times", () => {
      const date = new Date("2026-02-08T08:00:00");
      const compareDate = new Date("2026-02-08T23:59:59");
      expect(isSameDayUtil(date, compareDate)).toBe(true);
    });
  });

  describe("isDateBefore", () => {
    it("Should return true if date is before compareDate", () => {
      const date = new Date("2026-01-01");
      const compareDate = new Date("2026-12-31");
      expect(isDateBefore(date, compareDate)).toBe(true);
    });

    it("Should return false if date is after compareDate", () => {
      const date = new Date("2026-12-31");
      const compareDate = new Date("2026-01-01");
      expect(isDateBefore(date, compareDate)).toBe(false);
    });

    it("Should return false if dates are the same", () => {
      const date = new Date("2026-02-08");
      const compareDate = new Date("2026-02-08");
      expect(isDateBefore(date, compareDate)).toBe(false);
    });

    it("Should handle very close dates", () => {
      const date = new Date("2026-02-08T12:00:00.000");
      const compareDate = new Date("2026-02-08T12:00:00.001");
      expect(isDateBefore(date, compareDate)).toBe(true);
    });
  });
  describe("getHolidays", () => {
    it("Should return holiday dates for the year", async () => {
      const year = 2026;
      const holidays = await getHolidays(year);
      
      expect(holidays).toHaveLength(3);
      expect(holidays[0]).toEqual(new Date(2026, 0, 1));   // New Year's Day
      expect(holidays[1]).toEqual(new Date(2026, 11, 25)); // Christmas
      expect(holidays[2]).toEqual(new Date(2026, 11, 31)); // New Year's Eve
    });

    it("Should return holidays for different years", async () => {
      const year = 2025;
      const holidays = await getHolidays(year);
      
      expect(holidays).toHaveLength(3);
      expect(holidays[0]).toEqual(new Date(2025, 0, 1));
    });
  }); 
  describe("isHoliday", () => {
    it("should return true if it is a holiday", async () => {
      const day = new Date("2026-01-01"); 
      const result = await isHoliday(day);
      expect(result).toBe(true);
    });
    
    it("should return false if it is not a holiday", async () => {
      const day = new Date("2026-02-15"); 
      const result = await isHoliday(day);
      expect(result).toBe(false);
    });
  })
});

// functions to test
// getCurrentYear() --> returns curr year
//add(date, amount, type) --> adds time to a date
// isWithinRange(date, from, to) --> checks if date is between two dates
// isDateBefore(date, compareDate) --> checks if date is before another 
// isSameDay(date, compareDate) --> checks if two dates are on the same day
// getHolidays(year) --> Async; returns holiday dates for a year
// isHoliday(date) --> Async; checks if date is a holiday