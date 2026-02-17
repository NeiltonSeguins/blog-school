export interface User {
  id: number;
  name: string;
  email: string;
  role: 'professor' | 'aluno';
  password?: string; // Optional if we don't always load it
  bio?: string;
  subject?: string;
}

export interface Post {
  id: number;
  title: string;
  description: string;
  content: string;
  author: string;
  createdAt: string;

  category?: string;
}

export interface AuthContextData {
  signed: boolean;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => void;
  signUp: (name: string, email: string, password: string, role: string) => Promise<string | null>;
}
