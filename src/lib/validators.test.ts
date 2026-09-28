import { describe, expect, it } from 'vitest';
import { calculateTotalFromNet, calculateVatFromNet, formatCurrencyCLP, formatRut, isValidRut } from './validators';

describe('RUT validation', () => {
  it('accepts valid Chilean RUTs', () => {
    expect(isValidRut('12345678-5')).toBe(true);
    expect(isValidRut('11.111.111-1')).toBe(true);
  });

  it('rejects invalid RUTs', () => {
    expect(isValidRut('12345678-9')).toBe(false);
  });
});

describe('formatting and calculations', () => {
  it('formats RUT with dots', () => {
    expect(formatRut('12345678-5')).toBe('12.345.678-5');
  });

  it('formats CLP', () => {
    expect(formatCurrencyCLP(119000)).toContain('$119.000');
  });

  it('calculates net and VAT correctly', () => {
    expect(calculateVatFromNet(100000, 19)).toBe(19000);
    expect(calculateTotalFromNet(100000, 19)).toBe(119000);
  });
});
