export interface User {
  id: number;
  name: string;
  email: string;
  role: 'student' | 'teacher';
  password?: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  summary?: string;
  author: string;
  teacherId?: number;        // ID referencing the Teacher who authored the post
  categoryId: number;
  createdAt?: string;
  updatedAt?: string;

  category?: string;
  description?: string;
}

export interface AuthContextData {
  signed: boolean;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string, role: 'student' | 'teacher') => Promise<string | null>;
  signOut: () => void;
  refreshUser: () => Promise<void>;
}
