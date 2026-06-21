export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  role: 'student' | 'moderator' | 'admin';
  school?: string;
  university?: string;
  major?: string;
  bio?: string;
  documents_count?: number;
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
