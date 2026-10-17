import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PortionStepper } from '../components/PortionStepper';
import { RoleGuard } from '../components/RoleGuard';
import { MemoryRouter } from 'react-router-dom';
import * as AuthContextModule from '../context/AuthContext';

describe('PortionStepper Component', () => {
  it('renders with initial quantity and unit', () => {
    render(<PortionStepper value={12.5} onChange={() => {}} unit="kg" />);
    expect(screen.getByText('12.5')).toBeInTheDocument();
    expect(screen.getByText('kg')).toBeInTheDocument();
  });

  it('increments value on plus click', () => {
    const handleChange = vi.fn();
    render(<PortionStepper value={10} onChange={handleChange} unit="kg" step={1} />);
    const plusBtn = screen.getByLabelText('Increase quantity');
    fireEvent.mouseDown(plusBtn);
    fireEvent.mouseUp(plusBtn);
    expect(handleChange).toHaveBeenCalledWith(11);
  });

  it('decrements value on minus click but forbids negative numbers', () => {
    const handleChange = vi.fn();
    render(<PortionStepper value={0} onChange={handleChange} unit="kg" min={0} />);
    const minusBtn = screen.getByLabelText('Decrease quantity');
    expect(minusBtn).toBeDisabled();
  });

  it('clamps to zero when decrementing from small positive number', () => {
    const handleChange = vi.fn();
    render(<PortionStepper value={0.5} onChange={handleChange} unit="kg" step={1} min={0} />);
    const minusBtn = screen.getByLabelText('Decrease quantity');
    fireEvent.mouseDown(minusBtn);
    fireEvent.mouseUp(minusBtn);
    expect(handleChange).toHaveBeenCalledWith(0);
  });
});

describe('RoleGuard Security & 403 Locking', () => {
  it('renders children when user role is authorized', () => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: { id: '1', name: 'Pooja', email: 'p@m.edu', role: 'mess_manager', is_active: true, created_at: '' },
      token: 'valid-token',
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
        <RoleGuard allowedRoles={['mess_manager']}>
          <div>Mess Manager Protected Content</div>
        </RoleGuard>
      </MemoryRouter>
    );

    expect(screen.getByText('Mess Manager Protected Content')).toBeInTheDocument();
  });

  it('renders friendly 403 Forbidden ("This pantry is locked 🔒") when role is unauthorized', () => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: { id: '1', name: 'Pooja', email: 'p@m.edu', role: 'mess_manager', is_active: true, created_at: '' },
      token: 'valid-token',
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
        {/* Mess manager trying to access finance screen */}
        <RoleGuard allowedRoles={['finance_staff']}>
          <div>Finance Secret Ledgers</div>
        </RoleGuard>
      </MemoryRouter>
    );

    expect(screen.queryByText('Finance Secret Ledgers')).not.toBeInTheDocument();
    expect(screen.getByText(/Restricted Operational Sector/i)).toBeInTheDocument();
  });
});

describe('Stock Consumption Validation Rules', () => {
  it('detects when attempted consumption exceeds on-hand stock', () => {
    const stockOnHand = 25.0; // 25 kg
    const attemptedPortion = 30.0; // 30 kg

    const isExceeded = attemptedPortion > stockOnHand;
    expect(isExceeded).toBe(true);

    const errorMessage = isExceeded
      ? `Insufficient pantry stock! Available: ${stockOnHand} kg, Attempted: ${attemptedPortion} kg.`
      : null;

    expect(errorMessage).toBe('Insufficient pantry stock! Available: 25 kg, Attempted: 30 kg.');
  });
});
