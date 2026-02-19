export interface User {
  id: number;
  name: string;
  email: string;
  role: 'student' | 'teacher';
  password?: string; // Opcional se não carregarmos sempre
  bio?: string;     // Opcional se não estiver na resposta da API, mas mantido por compatibilidade se necessário
  subject?: string; // Opcional se não estiver na resposta da API, mas mantido por compatibilidade se necessário
}

export interface Post {
  id: number;
  title: string;
  content: string;
  summary?: string;
  author: string;
  categoryId: number;
  createdAt?: string;

  category?: string;
  description?: string;
}

export interface AuthContextData {
  signed: boolean;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string, role: 'student' | 'teacher') => Promise<string | null>;
  signOut: () => void;
}
