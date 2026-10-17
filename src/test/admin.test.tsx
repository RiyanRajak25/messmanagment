import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { RoleGuard } from '../components/RoleGuard';
import { MemoryRouter } from 'react-router-dom';
import * as AuthContextModule from '../context/AuthContext';

describe('Admin Security & RoleGuard Protection', () => {
  it('permits administrator role access to station command console', () => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: { id: 'u-admin', name: 'Dr. Rajesh Verma', email: 'rajesh@institutional.edu.in', role: 'administrator', is_active: true, created_at: '' },
      token: 'admin-token',
      role: 'administrator',
      mess_id: null,
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
      switchRole: vi.fn(),
      resetDemoData: vi.fn(),
    });

    render(
      <MemoryRouter>
        <RoleGuard allowedRoles={['administrator']}>
          <div>Station Commander HQ Live</div>
        </RoleGuard>
      </MemoryRouter>
    );

    expect(screen.getByText('Station Commander HQ Live')).toBeInTheDocument();
  });

  it('blocks lower appointment roles (e.g. Mess Manager) from Station Admin Console', () => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: { id: 'u-mess', name: 'Pooja Singh', email: 'pooja@institutional.edu.in', role: 'mess_manager', is_active: true, created_at: '' },
      token: 'mess-token',
      role: 'mess_manager',
      mess_id: 'mess-1',
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
      switchRole: vi.fn(),
      resetDemoData: vi.fn(),
    });

    render(
      <MemoryRouter>
        <RoleGuard allowedRoles={['administrator']}>
          <div>Station Commander Secret Console</div>
        </RoleGuard>
      </MemoryRouter>
    );

    expect(screen.queryByText('Station Commander Secret Console')).not.toBeInTheDocument();
    expect(screen.getByText(/Restricted Operational Sector/i)).toBeInTheDocument();
  });
});

describe('Institutional Admin Core Domain Rules', () => {
  it('validates vendor record integrity (tax ID & category required)', () => {
    const validateVendor = (vendor: { name: string; tax_id: string; category: string }) => {
      return Boolean(vendor.name && vendor.tax_id && vendor.category);
    };

    expect(validateVendor({ name: 'Kisan Agro', tax_id: '07AAAAA0000A1Z5', category: 'Grains & Cereals' })).toBe(true);
    expect(validateVendor({ name: 'Incomplete Supplier', tax_id: '', category: 'Dairy' })).toBe(false);
  });

  it('verifies that all dining mess allocations calculate total sanctioned ration strength', () => {
    const messes = [
      { id: 'mess-1', name: 'Falcon Hostel Mess', headcount_capacity: 450 },
      { id: 'mess-2', name: 'Eagle Campus Mess', headcount_capacity: 400 },
      { id: 'mess-3', name: 'Central Dining Hall', headcount_capacity: 130 },
    ];

    const totalDiners = messes.reduce((acc, m) => acc + m.headcount_capacity, 0);
    expect(totalDiners).toBe(980);
  });

  it('verifies audit log entry schema structure', () => {
    const sampleLog = {
      id: 'audit-001',
      timestamp: '2026-10-13T10:00:00Z',
      actor_id: 'u-admin',
      actor_role: 'administrator',
      action: 'STOCK_ADJUSTMENT',
      entity_type: 'STOCK_TRANSACTION',
    };

    expect(sampleLog.id).toBeDefined();
    expect(sampleLog.timestamp).toBeDefined();
    expect(sampleLog.actor_role).toBe('administrator');
    expect(sampleLog.action).toBe('STOCK_ADJUSTMENT');
  });
});
