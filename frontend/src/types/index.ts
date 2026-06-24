export interface User {
  id: number;
  username?: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'moderator' | 'admin';
  school?: string;
  university_id?: number;
  university?: any;
  major?: string;
  bio?: string;
  affiliation?: string;
  country?: string;
  academic_title?: string;
  research_interests?: string[];
  social_links?: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    website?: string;
  };
  documents_count?: number;
  created_at: string;
}

export interface Document {
  id: number;
  title: string;
  description: string;
  file_path: string;
  file_type: string;
  category_id: number;
  user_id: number;
  views_count: number;
  downloads_count: number;
  download_count?: number;
  likes_count?: number;
  is_liked?: boolean;
  is_favorited?: boolean;
  comments_count?: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  user?: User;
  category?: Category;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  documents_count?: number;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  isbn?: string;
  cover_image?: string;
  book_category_id: number;
}

export interface HomeStats {
  top_universities: { university: string; documents_count: number }[];
  total_docs: number;
}
