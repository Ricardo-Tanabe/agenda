# Agenda Pessoal

Aplicação de agenda pessoal construída com **Next.js**, **Prisma** e **SQLite**, permitindo gerenciar tarefas, anotações e acompanhar histórico de atividades de forma prática e responsiva.

## ✨ Funcionalidades

- **Autenticação de usuários** (NextAuth.js + bcrypt)
- **Criação, edição e exclusão** de tarefas
- **Acompanhamento de status**: pendente, em progresso e concluída
- **Sistema de prioridades** por cores (verde, amarelo, vermelho)
- **Visualização por calendário** (anual e mensal)
- **Histórico de tarefas**
- **Anotações** vinculadas a tarefas
- Interface **responsiva** com tema claro/escuro

## 🛠 Tecnologias Utilizadas

- [Next.js 15](https://nextjs.org/) — Framework React para SSR e SSG
- [React 19](https://react.dev/) — Biblioteca para interface
- [Prisma](https://www.prisma.io/) — ORM para acesso ao banco
- [SQLite](https://www.sqlite.org/) — Banco de dados local
- [NextAuth.js](https://next-auth.js.org/) — Autenticação
- [Tailwind CSS 4](https://tailwindcss.com/) — Estilização
- [TypeScript](https://www.typescriptlang.org/) — Tipagem estática

## Instalação

1. **Clone o repositório:**
```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure as variáveis de ambiente:**
```env
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET="uma_chave_secreta_aqui"
```

4. **Execute as migrações do banco:**
```bash
npx prisma migrate dev
```

5. **Inicie o servidor de desenvolvimento:**
```bash
npm run dev
```
A aplicação estará disponível em http://localhost:3000

## Estrutura de Pastas

```plaintext
src/
├── app/
│   ├── agenda/              # Páginas e funcionalidades da agenda
│   ├── api/                 # Rotas de API (auth, tasks, register)
│   ├── login/               # Página de login
│   ├── register/            # Página de registro
│   ├── layout.tsx           # Layout global
│   ├── globals.css          # Estilos globais
│   └── providers.tsx        # Providers globais
├── components/              # Componentes reutilizáveis
├── constants/               # Constantes e validações
├── lib/                     # Funções de backend (actions, auth, data)
├── types/                   # Tipos TypeScript
prisma/                      # Configuração e migrações do Prisma
```

## Licença
Este projeto está sob a licença MIT. Sinta-se livre para usar e modificar.