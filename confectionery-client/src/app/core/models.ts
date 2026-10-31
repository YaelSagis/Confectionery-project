// Shapes mirror the DTOs in Clean.Core/DTOs (System.Text.Json serializes them camelCase).

export type Difficulty = 'easy' | 'middle' | 'hard';

export interface Recipe {
  id: number;
  name: string;
  prepTime?: number | null;
  difficulty?: string | null;
  price?: number | null;
  /** Short line shown to customers in the menu. */
  description?: string | null;
  /** Photo: a link or a data URL uploaded from the editor. */
  imageUrl?: string | null;
  /** Staff only: one ingredient per line. */
  ingredients?: string | null;
  /** Staff only: one step per line. */
  instructions?: string | null;
}

/** Public menu item (api/Recipe/catalog): no prep time, difficulty or the recipe itself. */
export interface CatalogItem {
  id: number;
  name: string;
  price?: number | null;
  description?: string | null;
  imageUrl?: string | null;
}

export type RecipeInput = Omit<Recipe, 'id'> & { id?: number };

export interface Client {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
}

export type ClientInput = Omit<Client, 'id'> & { id?: number };

export type OrderStatus = 'new' | 'inProgress' | 'ready' | 'delivered';

export interface Order {
  id: number;
  client?: Client | null;
  deliveryDate?: string | null;
  notes?: string | null;
  status?: OrderStatus | null;
}

export interface OrderInput {
  id?: number;
  client: ClientInput;
  deliveryDate?: string | null;
  notes?: string | null;
  status?: OrderStatus | null;
}

export interface LoginRequest {
  userName: string;
  password: string;
}

export interface JwtToken {
  token: string;
}
