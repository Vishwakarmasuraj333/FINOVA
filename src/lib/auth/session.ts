import { UserRole } from '@/types';

export function canApproveTransfers(role: UserRole): boolean {
  return role === 'Super Admin' || role === 'Approver' || role === 'Finance Admin';
}

export function canCreateTransfers(role: UserRole): boolean {
  return role === 'Super Admin' || role === 'Finance Admin' || role === 'Finance Operator';
}

export function canManualAdjust(role: UserRole): boolean {
  return role === 'Super Admin' || role === 'Finance Admin';
}

export function canManageUsers(role: UserRole): boolean {
  return role === 'Super Admin';
}

export function canModifySettings(role: UserRole): boolean {
  return role === 'Super Admin' || role === 'Finance Admin';
}

export function isReadOnlyRole(role: UserRole): boolean {
  return role === 'Read-only Auditor';
}

export function canProcessRefunds(role: UserRole): boolean {
  return role === 'Super Admin' || role === 'Finance Admin';
}

