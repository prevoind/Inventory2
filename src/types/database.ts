export interface House {
  id: string;
  name: string;
  address?: string;
  description?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  is_active: boolean;
}

export interface Room {
  id: string;
  name: string;
  description?: string;
  property_id: string;  // We'll keep this as property_id in the database for now
  created_at: string;
  updated_at: string;
  floor?: string;
  is_active: boolean;
}

export interface Item {
  id: string;
  name: string;
  description?: string;
  purchase_date?: string;
  purchase_price?: number;
  current_value?: number;
  category?: string;
  condition?: string;
  serial_number?: string;
  model_number?: string;
  brand?: string;
  notes?: string;
  property_id: string;  // We'll keep this as property_id in the database for now
  room_id?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  is_active: boolean;
  image_urls: string[];
}