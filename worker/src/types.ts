export interface Env {
  DB: D1Database;
}

export interface Device {
  machine_id: string;
  machine_name: string;
  bark_key: string | null;
  notify_token: string;
  is_active: number;
  created_at: string;
  updated_at: string;
  last_notified_at: string | null;
}

export interface RegisterRequest {
  machine_id: string;
  notify_token: string;
  machine_name: string;
}

export interface BindRequest {
  machine_id: string;
  bark_key: string;
}

export interface NotifyRequest {
  machine_id: string;
  notify_token: string;
  cwd: string;
  session_name?: string;
}

export interface ToggleRequest {
  machine_id: string;
  notify_token: string;
  active: boolean;
}
