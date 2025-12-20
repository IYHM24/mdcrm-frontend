````markdown
# 🏗️ ARQUITECTURA DEL PROYECTO CRM

## 📊 Diagrama de Capas

```
┌─────────────────────────────────────────────────────────────┐
│                        PRESENTACIÓN                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Pages      │  │  Components  │  │   Layout     │      │
│  │ Dashboard    │  │    Button    │  │   Header     │      │
│  │ Customers    │  │    Input     │  │   Sidebar    │      │
│  │ Login        │  │    Card      │  │  MainLayout  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                             ↕
┌─────────────────────────────────────────────────────────────┐
│                    LÓGICA DE NEGOCIO                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Hooks      │  │   Context    │  │    Utils     │      │
│  │  useAuth     │  │ AuthContext  │  │   format     │      │
│  │  useFetch    │  │              │  │  validation  │      │
│  │useLocalStore │  │              │  │   helpers    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                             ↕
┌─────────────────────────────────────────────────────────────┐
│                    CAPA DE SERVICIOS                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ API Service  │  │ Auth Service │  │Customer Serv │      │
│  │   - GET      │  │   - login    │  │  - getAll    │      │
│  │   - POST     │  │   - logout   │  │  - create    │      │
│  │   - PUT      │  │   - refresh  │  │  - update    │      │
│  │   - DELETE   │  │              │  │  - delete    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                             ↕
┌─────────────────────────────────────────────────────────────┐
│                        API BACKEND                           │
│                   http://localhost:3000/api                  │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Flujo de Datos

```
User Interaction
       ↓
   Component
       ↓
   Hook/Context  →  Utils (format, validate)
       ↓
    Service
       ↓
   API Call
       ↓
    Backend
       ↓
   Response
       ↓
    Service
       ↓
   Hook/Context
       ↓
   Component
       ↓
   UI Update
```

## 📁 Estructura Detallada

```
crm/
│
├── 📄 Configuración
│   ├── .env.example
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── tsconfig.app.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
│
├── 📚 Documentación
│   ├── README.md
│   ├── DOCS.md
│   └── QUICKSTART.md
│
├── 🔧 VS Code
│   └── .vscode/
│       ├── extensions.json
│       └── settings.json
│
├── 📦 Public
│   └── public/
│
└── 💻 Source Code
    └── src/
        │
        ├── 🎨 Assets
        │   └── assets/
        │
        ├── 🧩 Components
        │   ├── common/
        │   │   ├── Button.tsx
        │   │   ├── Card.tsx
        │   │   ├── Input.tsx
        │   │   ├── Modal.tsx
        │   │   ├── Spinner.tsx
        │   │   └── index.ts
        │   └── layout/
        │       ├── Header.tsx
        │       ├── MainLayout.tsx
        │       ├── Sidebar.tsx
        │       └── index.ts
        │
        ├── 📄 Pages
        │   ├── Customers.tsx
        │   ├── Dashboard.tsx
        │   └── Login.tsx
        │
        ├── 🔌 Services
        │   ├── api.service.ts
        │   ├── auth.service.ts
        │   ├── customer.service.ts
        │   └── index.ts
        │
        ├── 🎣 Hooks
        │   ├── useAuth.ts
        │   ├── useFetch.ts
        │   ├── useLocalStorage.ts
        │   └── index.ts
        │
        ├── 🌐 Context
        │   └── AuthContext.tsx
        │
        ├── 📝 Types
        │   └── index.ts
        │
        ├── 🛠️ Utils
        │   ├── format.ts
        │   ├── helpers.ts
        │   ├── validation.ts
        │   └── index.ts
        │
        ├── ⚙️ Config
        │   ├── constants.ts
        │   └── env.ts
        │
        ├── 🎯 Entry Points
        │   ├── App.tsx
        │   ├── App.css
        │   ├── main.tsx
        │   └── index.css
        │
        └── index.html
```

## 🎯 Principios de Diseño

### 1. **Separación de Responsabilidades**
- Components: Solo presentación
- Hooks: Lógica reutilizable
- Services: Comunicación API
- Utils: Funciones auxiliares

### 2. **Escalabilidad**
```
Fácil agregar:
├── Nuevas páginas → src/pages/
├── Nuevos componentes → src/components/
├── Nuevos servicios → src/services/
└── Nueva lógica → src/hooks/
```

### 3. **Reutilización**
```
Componentes → Usados en múltiples páginas
Hooks → Compartidos entre componentes
Services → Centralizados para toda la app
Utils → Funciones puras reutilizables
```

### 4. **Type Safety**
```
Types centralizados en src/types/
TypeScript estricto habilitado
Interfaces bien definidas
Props tipadas en componentes
```

## 🔐 Flujo de Autenticación

```
1. Usuario → Login Page
2. Login Page → authService.login()
3. authService → API Backend
4. Backend → Token + User Data
5. authService → localStorage
6. AuthContext → Update State
7. App → Redirect to Dashboard
```

## 📊 Gestión de Estado

```
┌─────────────────────────────────────┐
│         Estado Local (useState)      │
│  - Formularios                       │
│  - UI temporal                       │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│         Context API (AuthContext)    │
│  - Usuario actual                    │
│  - Estado de autenticación           │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│    LocalStorage (useLocalStorage)    │
│  - Token                             │
│  - Preferencias                      │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│         Server State (useFetch)      │
│  - Datos del servidor                │
│  - Caché de API                      │
└─────────────────────────────────────┘
```

## 🚀 Performance Optimizations

✅ **Lazy Loading** ready para rutas
✅ **Code Splitting** automático con Vite
✅ **Tree Shaking** habilitado
✅ **Memoization** con useMemo/useCallback (cuando necesario)
✅ **Debounce/Throttle** en utils

## 🧪 Testing Strategy (Futuro)

```
Unit Tests
├── Utils (format, validation, helpers)
├── Hooks (useAuth, useFetch)
└── Services (API calls mocked)
```

Integration Tests
├── Components + Hooks
└── Pages + Context

E2E Tests
└── Flujos completos de usuario

## 📦 Build & Deploy

```bash
# Development
npm run dev → Vite Dev Server (HMR)

# Production
npm run build → TypeScript Check + Vite Build
npm run preview → Test production build

# Output
dist/ → Static files ready for deploy
```

## 🎨 Styling Strategy

```
Tailwind CSS (Utility-first)
├── Componentes con clases utilitarias
├── Configuración en tailwind.config.js
├── PostCSS para procesamiento
└── PurgeCSS automático en build
```

## 🔧 Development Workflow

```
1. Crear feature branch
2. Desarrollar en src/
3. Usar path aliases (@/)
4. Tipar con TypeScript
5. Usar componentes existentes
6. Crear hooks para lógica
7. Agregar servicios si necesario
8. Lint y build
9. Pull request
```

---

**Arquitectura lista para escalar** 🚀

````
