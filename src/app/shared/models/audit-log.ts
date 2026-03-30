export interface AuditLog {
  id: number;
  actorUsername: string;
  action: string;
  targetEntity: string;
  targetId: number;
  details: string;
  status: string;
  createdAt: string;
}

export interface AuditLogPage {
  content: AuditLog[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}