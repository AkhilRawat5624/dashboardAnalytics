/**
 * Role-based permissions system
 */

export type UserRole = 'admin' | 'analyst' | 'viewer';

export interface Permission {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  export: boolean;
}

export const PERMISSIONS: Record<UserRole, Record<string, Permission>> = {
  viewer: {
    dashboard: { view: true, create: false, edit: false, delete: false, export: false },
    reports: { view: true, create: false, edit: false, delete: false, export: false },
    settings: { view: true, create: false, edit: false, delete: false, export: false },
    users: { view: false, create: false, edit: false, delete: false, export: false },
    auditLogs: { view: false, create: false, edit: false, delete: false, export: false },
  },
  analyst: {
    dashboard: { view: true, create: false, edit: false, delete: false, export: true },
    reports: { view: true, create: true, edit: true, delete: false, export: true },
    settings: { view: true, create: false, edit: true, delete: false, export: false },
    users: { view: false, create: false, edit: false, delete: false, export: false },
    auditLogs: { view: false, create: false, edit: false, delete: false, export: false },
  },
  admin: {
    dashboard: { view: true, create: true, edit: true, delete: true, export: true },
    reports: { view: true, create: true, edit: true, delete: true, export: true },
    settings: { view: true, create: true, edit: true, delete: true, export: true },
    users: { view: true, create: true, edit: true, delete: true, export: true },
    auditLogs: { view: true, create: false, edit: false, delete: false, export: true },
  },
};

export function hasPermission(
  role: UserRole,
  resource: string,
  action: keyof Permission
): boolean {
  return PERMISSIONS[role]?.[resource]?.[action] ?? false;
}

export function canExport(role: UserRole): boolean {
  return role === 'admin' || role === 'analyst';
}

export function canManageUsers(role: UserRole): boolean {
  return role === 'admin';
}

export function canAccessAuditLogs(role: UserRole): boolean {
  return role === 'admin';
}

export function canModifySystemSettings(role: UserRole): boolean {
  return role === 'admin';
}

export function canCreateReports(role: UserRole): boolean {
  return role === 'admin' || role === 'analyst';
}

export function canDeleteData(role: UserRole): boolean {
  return role === 'admin';
}

// Feature flags based on role
export const FEATURES: Record<UserRole, string[]> = {
  viewer: [
    'view_dashboards',
    'view_reports',
    'apply_filters',
    'view_notifications',
    'edit_own_profile',
  ],
  analyst: [
    'view_dashboards',
    'view_reports',
    'apply_filters',
    'view_notifications',
    'edit_own_profile',
    'export_data',
    'create_reports',
    'save_filters',
    'schedule_reports',
    'advanced_filters',
  ],
  admin: [
    'view_dashboards',
    'view_reports',
    'apply_filters',
    'view_notifications',
    'edit_own_profile',
    'export_data',
    'create_reports',
    'save_filters',
    'schedule_reports',
    'advanced_filters',
    'manage_users',
    'system_settings',
    'audit_logs',
    'api_keys',
    'integrations',
    'delete_data',
  ],
};

export function hasFeature(role: UserRole, feature: string): boolean {
  return FEATURES[role]?.includes(feature) ?? false;
}
