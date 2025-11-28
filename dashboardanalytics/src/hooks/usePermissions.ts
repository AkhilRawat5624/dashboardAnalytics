import { useSession } from 'next-auth/react';
import { 
  hasPermission, 
  canExport, 
  canManageUsers, 
  canAccessAuditLogs,
  canModifySystemSettings,
  canCreateReports,
  canDeleteData,
  hasFeature,
  type UserRole,
  type Permission
} from '@/lib/permissions';

export function usePermissions() {
  const { data: session } = useSession();
  const role = (session?.user?.role as UserRole) || 'viewer';

  return {
    role,
    hasPermission: (resource: string, action: keyof Permission) => 
      hasPermission(role, resource, action),
    canExport: () => canExport(role),
    canManageUsers: () => canManageUsers(role),
    canAccessAuditLogs: () => canAccessAuditLogs(role),
    canModifySystemSettings: () => canModifySystemSettings(role),
    canCreateReports: () => canCreateReports(role),
    canDeleteData: () => canDeleteData(role),
    hasFeature: (feature: string) => hasFeature(role, feature),
    isAdmin: role === 'admin',
    isAnalyst: role === 'analyst',
    isViewer: role === 'viewer',
  };
}
