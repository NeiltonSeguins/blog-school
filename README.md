# Blog School App
Este é um aplicativo mobile em React Native para um blog educacional, com perfis para Professores e Alunos.

## 🚀 Tecnologias

- **React Native (Expo)**
- **React Navigation** (Stack & Tabs)
- **Context API** (Gerenciamento de Estado)
- **AsyncStorage** (Persistência local)
- **Axios** (Cliente HTTP)
- **JSON Server** (API Fake)

## 📦 Instalação e Execução

### 1. Configurar Backend (API Fake)

A API fake simula um servidor REST localmente.

```bash
# Terminal 1
npm install
npm run server
# O servidor rodará em http://localhost:3000
```

> **Nota:** Para rodar no Android Emulator, o app está configurado para acessar `10.0.2.2:3000`. No iOS ou Web é `localhost:3000`. Se for testar em dispositivo físico, altere o IP em `src/services/api.js`.

### 2. Rodar o App

```bash
# Terminal 2
npx expo start
```

## 🔐 Autenticação

Para testar, use as credenciais abaixo:

| Perfil | Email | Senha | Acesso |
|--------|-------|-------|--------|
| **Professor** | `admin@blog.com` | `123` | Posts (Criar/Edit/Del), Gestão de Prof/Alunos |
| **Aluno** | `student@blog.com` | `123` | Apenas visualizar Posts |

## 📂 Estrutura de Pastas

```
src/
├── api/          # Dados e script do json-server
├── components/   # Componentes reutilizáveis (Ex: PostCard)
├── contexts/     # Context API (AuthContext)
├── navigation/   # Configuração de rotas (Stack/Tabs)
├── screens/      # Telas do aplicativo
│   ├── Admin/    # Gestão de Professores/Alunos
│   ├── Auth/     # Login
│   ├── Posts/    # Listagem, Detalhe e Edição de Posts
│   └── Shared/   # Telas compartilhadas (Ex: UserForm)
├── services/     # Configuração do Axios (api.js) (Suporte a Android/iOS/Web)
└── theme.js      # Constantes de estilo
```

## ✨ Atualizações Recentes (Design Refresh)

O aplicativo passou por uma reformulação visual para alinhar com o design **Stitch**:

-   **Ícones**: Migração para `@react-native-vector-icons/fontawesome6` para um visual mais moderno.
-   **Home**:
    -   Novo Header com logo e busca.
    -   Filtros de categoria em estilo "Pill" com sombra.
    -   Cards de post com imagem de capa e avatar do autor.
    -   **Pull to Refresh**: Atualize a lista de posts puxando para baixo.
-   **Login**:
    -   Layout limpo e minimalista.
    -   Campos com ícones visuais (`envelope`, `lock`).
    -   Remoção de login social (Google/Apple).
-   **Detalhes do Post**:
    -   Imagem de destaque imersiva.
    -   Informações do autor e categoria em destaque.
    -   Tipografia otimizada para leitura.

## 🛠️ Scripts Úteis

-   `npm run server`: Inicia o JSON Server (Backend Fake).
-   `npx expo start`: Inicia o bundler do Metro (App).
-   `npx tsc --noEmit`: Verifica erros de tipagem TypeScript.
