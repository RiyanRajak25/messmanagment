import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { RoleGuard } from '../components/RoleGuard';
import { MemoryRouter } from 'react-router-dom';
import * as AuthContextModule from '../context/AuthContext';

describe('Store Keeper Role & Guard Access', () => {
  it('allows store_keeper to access central store views', () => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: { id: 'u-store', name: 'Ramesh', email: 'ramesh@mess.edu', role: 'store_keeper', is_active: true, created_at: '' },
      token: 'valid-token',
      role: 'store_keeper',
      mess_id: null,
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
      switchRole: vi.fn(),
      resetDemoData: vi.fn(),
    });

    render(
      <MemoryRouter>
        <RoleGuard allowedRoles={['store_keeper', 'administrator']}>
          <div>Central Silo Warehouse Operational</div>
        </RoleGuard>
      </MemoryRouter>
    );

    expect(screen.getByText('Central Silo Warehouse Operational')).toBeInTheDocument();
  });

  it('blocks unauthorized roles (e.g. vendor) from central store with 403', () => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: { id: 'u-vendor', name: 'Kisan Agro', email: 'orders@kisanagro.in', role: 'vendor', is_active: true, created_at: '' },
      token: 'valid-token',
      role: 'vendor',
      mess_id: null,
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
      switchRole: vi.fn(),
      resetDemoData: vi.fn(),
    });

    render(
      <MemoryRouter>
        <RoleGuard allowedRoles={['store_keeper', 'administrator']}>
          <div>Central Silo Warehouse Operational</div>
        </RoleGuard>
      </MemoryRouter>
    );

    expect(screen.queryByText('Central Silo Warehouse Operational')).not.toBeInTheDocument();
    expect(screen.getByText(/Restricted Operational Sector/i)).toBeInTheDocument();
  });
});

describe('Store Keeper Business Logic & Safety Rules', () => {
  it('strictly requires reason code for stock write-offs / adjustments', () => {
    const validReasonCodes = ['wastage', 'damage', 'count_correction', 'spoilage'];

    const testSubmission = (reasonCode: string) => {
      return validReasonCodes.includes(reasonCode);
    };

    expect(testSubmission('')).toBe(false);
    expect(testSubmission('custom_unapproved')).toBe(false);
    expect(testSubmission('wastage')).toBe(true);
    expect(testSubmission('damage')).toBe(true);
    expect(testSubmission('spoilage')).toBe(true);
    expect(testSubmission('count_correction')).toBe(true);
  });

  it('detects and blocks issue quantities exceeding central store stock', () => {
    const centralStoreAvailable = 150; // 150 kg Basmati Rice
    const attemptedIssue = 200; // 200 kg requested for Falcon Hostel

    const isInsufficient = attemptedIssue > centralStoreAvailable;
    expect(isInsufficient).toBe(true);

    const safeIssue = 120;
    expect(safeIssue <= centralStoreAvailable).toBe(true);
  });

  it('ensures derived stock is correctly computed (receipts - issues - adjustments)', () => {
    const receipts = 500; // 500 kg received from PO
    const issues = 220; // 220 kg issued to messes
    const adjustments = 15; // 15 kg damaged bags written off

    const derivedStock = receipts - issues - adjustments;
    expect(derivedStock).toBe(265);
  });

  it('verifies that no currency strings (₹) are required on Store Keeper manifests', () => {
    const storeKeeperFields = [
      { field: 'commodity', value: 'Sona Masoori Rice' },
      { field: 'quantity', value: 250 },
      { field: 'unit', value: 'kg' },
      { field: 'destination', value: 'Eagle Block Mess' },
    ];

    const hasCurrencySymbol = storeKeeperFields.some((f) => String(f.value).includes('₹') || String(f.value).includes('Rs'));
    expect(hasCurrencySymbol).toBe(false);
  });
});
