# 🍎 Calculadora Nutrium - Clean Architecture

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748)
![Supabase](https://img.shields.io/badge/Supabase-Postgres-3ECF8E)

**Nutritional Calculator with Clean Architecture** 🚀

</div>

---

## 🏗️ Arquitectura Clean Architecture

```
lib/
├── domain/                      # CAPA 1: Entities (0 dependencias externas)
│   ├── entities/Persona.ts     # Entidades de negocio
│   ├── value-objects/         # Value Objects puros
│   └── use-cases/            # Casos de uso
│
├── application/                 # CAPA 2: Servicios
│   └── services/              # Orquestación de casos de uso
│
└── infrastructure/              # CAPA 3: Adaptadores
    ├── database/              # Prisma Client
    ├── auth/                 # Supabase Auth
    └── repositories/         # Implementaciones concretas

app/                           # CAPA 4: Presentación (Next.js App Router)
├── api/                      # Entry points HTTP
├── (auth)/login/             # SSR Login
├── (web)/calculator/         # Client Calculator
└── actions.ts                # Server Actions type-safe
```

---

## 🚀 Instalación

```bash
npm install
cp .env.example .env
npx prisma migrate dev
npm run test:db
npm run dev
```

---

## 🧪 Tests

| Command | Description |
|---------|-------------|
| `npm test` | All tests |
| `npm test:db` | Supabase connections (P1001 detect) |

---

## 📁 Estructura del Proyecto

```
calculadora-nutrium/
├── lib/                          # ✨ CLEAN ARCHITECTURE
│   ├── domain/                   # Entidades puras
│   ├── application/              # Casos de uso
│   └── infrastructure/           # DB + Auth
│
├── app/                          # Presentación Next.js
│   ├── api/                    # API Routes
│   ├── (auth)/login/          # SSR Login
│   ├── (web)/calculator/       # Client Calculator
│   └── actions.ts              # Server Actions
│
├── prisma/schema.prisma
├── tests/integration/database/  # Tests conexiones
├── .env.example
└── package.json
```

---

## 🔧 Environment Variables

```bash
# Supabase Postgres
DIRECT_URL="postgresql://..."
DATABASE_URL="postgresql://..."

# Supabase Auth
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="xxx"

JWT_SECRET="your-secret-key"
```

---

## 📦 Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "npm run test:db && npm run test:unit && next build",
    "test": "jest",
    "test:db": "jest tests/integration/database",
    "test:unit": "jest tests/unit",
    "lint": "eslint . --fix",
    "type-check": "tsc --noEmit"
  }
}
```

---

## 🛠️ Tech Stack

- **Next.js 16** - App Router
- **TypeScript 5**
- **Prisma 7** + Supabase Postgres
- **Supabase Auth**
- **Zod** - Validación
- **Jest** - Testing
- **Tailwind CSS 4**

---

## 📄 Licencia

MIT © 2024
