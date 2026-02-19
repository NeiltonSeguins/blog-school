# Blog School App

Aplicativo mobile educacional desenvolvido em React Native (Expo) com funcionalidades diferenciadas para Professores e Alunos.

## 📋 Índice

- [Tecnologias](#-tecnologias)
- [Setup Inicial](#-setup-inicial)
- [Arquitetura da Aplicação](#-arquitetura-da-aplicação)
- [Funcionalidades](#-funcionalidades)
- [Guia de Uso](#-guia-de-uso)
- [Scripts Disponíveis](#-scripts-disponíveis)

## 🚀 Tecnologias

### Core
- **React Native** 0.81.5
- **Expo** ~54.0.33
- **TypeScript** ~5.9.2

### Navegação
- **@react-navigation/native** ^7.1.28
- **@react-navigation/stack** ^7.6.16
- **@react-navigation/bottom-tabs** ^7.10.1

### Estado e Persistência
- **Context API** (Gerenciamento de estado global)
- **AsyncStorage** 2.2.0 (Persistência de autenticação)

### UI/UX
- **@react-native-vector-icons/fontawesome6** ^12.3.0
- **react-native-safe-area-context** ~5.6.0

### HTTP e Backend
- **Axios** ^1.13.4 (Cliente HTTP)
- **JSON Server** ^0.17.4 (API Mock)

## 🛠️ Setup Inicial

### Pré-requisitos
- Node.js (versão 18+)
- npm ou yarn
- Expo CLI
- Emulador Android/iOS ou Expo Go no dispositivo físico

### Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd blog-school
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o Backend (JSON Server)**

O projeto utiliza JSON Server para simular uma API REST.

```bash
# Terminal 1 - Inicie o servidor
npm run server
# Servidor rodará em http://localhost:3000
```

> **⚠️ Importante:** 
> - **Android Emulator**: O app está configurado para `10.0.2.2:3000`
> - **iOS Simulator/Web**: Usa `localhost:3000`
> - **Dispositivo Físico**: A aplicação tenta obter o IP do dispositivo onde o expo Go está rodando, caso não funcione, altere o IP em `src/services/api.ts` para o IP da sua máquina na rede local.

4. **Inicie o aplicativo**
```bash
# Terminal 2
npm start
```

Escolha a plataforma:
- Pressione `a` para Android
- Pressione `i` para iOS
- Pressione `w` para Web
- Escaneie o QR Code com Expo Go (dispositivo físico)

## 🏗️ Arquitetura da Aplicação

### Estrutura de Diretórios

```
blog-school/
├── api/
│   ├── db.json              # Banco de dados JSON Server
│   └── server.js            # Configuração do servidor com middlewares
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   └── PostCard.tsx     # Card de post para listagem
│   ├── contexts/            # Context API
│   │   └── AuthContext.tsx  # Gerenciamento de autenticação
│   ├── navigation/          # Configuração de rotas
│   │   └── AppNavigator.tsx # Stack e Tab Navigation
│   ├── screens/             # Telas da aplicação
│   │   ├── Admin/           # Telas administrativas
│   │   │   └── UsersListScreen.tsx
│   │   ├── Auth/            # Autenticação
│   │   │   ├── LoginScreen.tsx
│   │   │   └── RegisterScreen.tsx
│   │   ├── Posts/           # Gerenciamento de posts
│   │   │   ├── PostsListScreen.tsx
│   │   │   ├── PostDetailScreen.tsx
│   │   │   └── PostFormScreen.tsx
│   │   └── Shared/          # Telas compartilhadas
│   │       ├── ProfileScreen.tsx
│   │       ├── UserFormScreen.tsx
│   │       └── UserProfileScreen.tsx
│   ├── services/
│   │   └── api.ts           # Configuração Axios
│   ├── types/
│   │   └── index.ts         # Definições TypeScript
│   └── theme.ts             # Constantes de design (cores, espaçamentos)
├── package.json
└── tsconfig.json
```

### Padrões Arquiteturais

#### 1. **Context API para Estado Global**
- `AuthContext`: Gerencia autenticação, usuário logado e persistência de sessão
- Provê funções: `signIn`, `signUp`, `signOut`

#### 2. **Navegação Híbrida**
- **Stack Navigator**: Navegação entre telas (Login, Detalhes, Formulários)
- **Tab Navigator**: Navegação principal (Home, Perfil, Admin)
- Navegação condicional baseada em role (professor/aluno)

#### 3. **Tipagem TypeScript**
- Interfaces para `User`, `Post`, `AuthContextData`
- Tipos de navegação para type-safety

#### 4. **Componentização**
- Componentes reutilizáveis (`PostCard`)
- Separação de responsabilidades (Screens vs Components)

## ✨ Funcionalidades

### 🔐 Autenticação
- **Login** com email e senha
- Persistência de sessão com AsyncStorage
- Logout

### 📝 Gerenciamento de Posts

#### Para Professores (Admin)
- ✅ Criar novos posts
- ✅ Editar posts existentes (Apenas se ele for o autor)
- ✅ Excluir posts
- ✅ Visualizar todos os posts
- ✅ Visualizar lista de posts
- ✅ Filtrar posts por categoria
- ✅ Buscar posts por título/descrição

#### Para Alunos
- ✅ Visualizar lista de posts
- ✅ Filtrar posts por categoria
- ✅ Buscar posts por título/descrição
- ✅ Visualizar detalhes completos do post

### 👥 Gerenciamento de Usuários

#### Para Professores (Admin)
- ✅ Visualizar lista de **Professores**
- ✅ Visualizar lista de **Alunos**
- ✅ Criar novos usuários (Professor/Aluno)
- ✅ Editar informações de usuários
- ✅ Excluir usuários

### 🧑‍💼 Perfil de Usuário

#### Funcionalidades Gerais
- ✅ Editar perfil (Apenas Admin):
  - Nome
  - Email
  - Senha

### 🎨 UI/UX
- Design moderno
- Ícones FontAwesome 6
- Pull-to-refresh nas listas
- Busca em tempo real
- Filtros por categoria (Pills)
- KeyboardAvoidingView para melhor usabilidade em formulários
- Safe Area Context para compatibilidade com notch/bordas

## 📖 Guia de Uso

### Credenciais de Teste

| Perfil | Email | Senha | Permissões |
|--------|-------|-------|------------|
| **Professor (Admin)** | `professor@educapost.dev` | `senha123` | - Criar/Editar/Excluir Posts<br>- Gerenciar Professores e Alunos<br>- Ver perfis de todos os usuários |
| **Aluno** | `aluno@educapost.dev` | `senha123` | - Visualizar Posts<br>
### Fluxo de Uso

#### 1. **Login/Registro**
1. Abra o app
2. Faça login com as credenciais acima

#### 2. **Navegação Principal (Tabs)**
- **Home**: Lista de posts com busca e filtros
- **Perfil**: Visualizar e editar seu perfil
- **Lista de professores** (apenas Professores): Gerenciar usuários
- **Lista de alunos** (apenas Professores): Gerenciar usuários

#### 3. **Posts**
- **Visualizar**: Clique em qualquer card de post
- **Criar** (Professor): Botão "+" no canto superior direito da Home
- **Editar** (Professor): Abra o post → Botão "Editar"
- **Excluir** (Professor): Abra o post → Botão "Excluir"
- **Buscar**: Use a barra de busca no topo
- **Filtrar**: Clique nas categorias (Pills)

#### 4. **Perfil**
- **Ver seu perfil**: Tab "Perfil"
- **Editar**: Botão "Editar Informações" (Admin)
- **Campos editáveis**:
  - Nome, Email, Senha (todos)

#### 5. **Gerenciamento de Usuários (Admin)**
- **Ver Professores**: Clique em "Professores"
- **Ver Alunos**: Clique em "Alunos"
- **Criar**: Botão "+ Novo Professor/Aluno"
- **Editar**: Botão "Editar" no card do usuário
- **Excluir**: Botão "Excluir" no card do usuário

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
npm start              # Inicia Expo Dev Server
npm run android        # Abre no Android Emulator
npm run ios            # Abre no iOS Simulator
npm run web            # Abre no navegador

# Backend
npm run server         # Inicia JSON Server (porta 3000)

# Verificação
npx tsc --noEmit       # Verifica erros TypeScript
```

## 🔧 Configurações Importantes

### API Configuration (`src/services/api.ts`)
```typescript
const baseURL = Platform.select({
  android: 'http://10.0.2.2:3000',  // Android Emulator
  ios: 'http://localhost:3000',     // iOS Simulator
  default: 'http://localhost:3000', // Web/outros
});
```

### TypeScript Paths (`tsconfig.json`)
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## 📝 Notas Técnicas

### Autenticação
- Persistência via AsyncStorage
- Middleware de permissões no JSON Server

### Ordenação de Posts
- Posts ordenados por `createdAt` (mais recente primeiro)
- Implementado no `PostsListScreen.tsx`

### Roles e Permissões
- `professor`: Acesso total (CRUD posts, gerenciar usuários)
- `aluno`: Apenas leitura de posts e visualização de professores

### Formulários
- Validação de campos obrigatórios
- KeyboardAvoidingView para evitar sobreposição do teclado
- Feedback visual com ActivityIndicator durante salvamento

