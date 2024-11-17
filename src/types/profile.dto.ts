export interface ISocialLinks {
  instagram?: string | null;
  twitter?: string | null;
  facebook?: string | null;
}

export interface IAccountDetails {
  account_name?: string | null;
  account_number?: string | null;
  bank_name?: string | null;
}

export interface IBrandDetails {
  brand_logo?: string | null;
  brand_name?: string | null;
}

export interface IProfileSettings {
  id?: string;
  social_links?: ISocialLinks | null;
  brand_details?: IBrandDetails | null;
  account_details?: IAccountDetails | null;
  client_link?: string | null;
  user_id?: string | null;
  created_at?: Date;
  updatedAt?: Date;
}
