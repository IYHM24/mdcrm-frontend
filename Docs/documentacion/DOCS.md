````markdown
# PROYECTO CRM - DOCUMENTACIÓN COMPLETA

## 📋 Estructura del Proyecto

```
crm/
├── public/                      # Archivos estáticos
├── src/
│   ├── assets/                 # Recursos (imágenes, iconos, etc.)
│   ├── components/             # Componentes React
│   │   ├── common/            # Componentes reutilizables
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Spinner.tsx
│   │   │   └── index.ts
│   │   └── layout/            # Componentes de layout
│   │       ├── Header.tsx
│   │       ├── Sidebar.tsx
│   │       ├── MainLayout.tsx
│   │       └── index.ts
│   ├── context/               # Context API
│   │   └── AuthContext.tsx
│   ├── hooks/                 # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useFetch.ts
│   │   ├── useLocalStorage.ts
│   │   └── index.ts
│   ├── pages/                 # Páginas
│   │   ├── Dashboard.tsx
│   │   ├── Customers.tsx
│   │   └── Login.tsx
│   ├── services/              # Servicios API
│   │   ├── api.service.ts
│   │   ├── auth.service.ts
│   │   ├── customer.service.ts
│   │   └── index.ts
│   ├── types/                 # TypeScript types
│   │   └── index.ts
│   ├── utils/                 # Utilidades
│   │   ├── format.ts
│   │   ├── validation.ts
│   │   ├── helpers.ts
│   │   └── index.ts
│   ├── config/                # Configuración
│   │   ├── constants.ts
│   │   └── env.ts
│   ├── App.tsx               # Componente principal
│   ├── App.css
│   ├── main.tsx              # Entry point
│   └── index.css             # Estilos globales
├── .env.example              # Ejemplo de variables de entorno
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md
```

## 🚀 Instalación y Configuración

### 1. Instalar dependencias

```bash
npm install
```

### 2. Instalar Tailwind CSS y dependencias

```bash
npm install -D tailwindcss postcss autoprefixer
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita `.env`:
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### 4. Ejecutar el proyecto

```bash
# Modo desarrollo
npm run dev

# Compilar para producción
npm run build

# Preview de producción
npm run preview

# Ejecutar linter
npm run lint
```

## 📦 Componentes

### Common Components

#### Button
```tsx
import { Button } from '@/components/common';

<Button variant="primary" size="md" onClick={handleClick}>
  Guardar
</Button>

<Button variant="danger" isLoading={loading}>
  Eliminar
</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'danger' | 'success'
- `size`: 'sm' | 'md' | 'lg'
- `isLoading`: boolean
- Todas las props de HTMLButtonElement

#### Input
```tsx
import { Input } from '@/components/common';

<Input
  label="Email"
  type="email"
  placeholder="tu@email.com"
  error={errors.email}
  required
/>
```

**Props:**
- `label`: string
- `error`: string
- `helperText`: string
- Todas las props de HTMLInputElement

#### Card
```tsx
import { Card } from '@/components/common';

<Card 
  title="Título del Card"
  footer={<Button>Acción</Button>}
>
  Contenido del card
</Card>
```

#### Modal
```tsx
import { Modal } from '@/components/common';

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Título Modal"
  size="lg"
  footer={<Button onClick={handleSave}>Guardar</Button>}
>
  Contenido del modal
</Modal>
```

#### Spinner
```tsx
import { Spinner } from '@/components/common';

<Spinner size="md" />
```

## 🔧 Servicios

### API Service
```typescript
import { apiService } from '@/services';

// GET
const data = await apiService.get<Response>('/endpoint');

// POST
const result = await apiService.post<Response>('/endpoint', { data });

// PUT
await apiService.put('/endpoint', { data });

// DELETE
await apiService.delete('/endpoint');
```

### Auth Service
```typescript
import { authService } from '@/services';

// Login
await authService.login({ email, password });

// Logout
await authService.logout();

// Check authentication
const isAuth = authService.isAuthenticated();

// Get current user
const user = await authService.getCurrentUser();
```

### Customer Service
```typescript
import { customerService } from '@/services';

// Get all customers
const customers = await customerService.getAll({ page: 1, limit: 10 });

// Get by ID
const customer = await customerService.getById('id');

// Create
await customerService.create(customerData);

// Update
await customerService.update('id', customerData);

// Delete
await customerService.delete('id');

// Search
const results = await customerService.search('query');
```

## 🎣 Hooks Personalizados

### useAuth
```typescript
import { useAuth } from '@/hooks';

const { user, loading, isAuthenticated, login, logout } = useAuth();
```

### useFetch
```typescript
import { useFetch } from '@/hooks';

const { data, loading, error, refetch } = useFetch(
  () => customerService.getAll(),
  { skip: false }
);
```

### useLocalStorage
```typescript
import { useLocalStorage } from '@/hooks';

const [value, setValue] = useLocalStorage('key', initialValue);
```

## 🌐 Context

### AuthContext
```typescript
import { useAuthContext } from '@/context/AuthContext';

const { user, isAuthenticated, login, logout } = useAuthContext();
```

## 🛠️ Utilidades

### Format
```typescript
import { formatCurrency, formatDate, formatDateTime, formatPhoneNumber } from '@/utils';

formatCurrency(1000); // "$1,000.00"
formatDate(new Date()); // "05/12/2025"
formatDateTime(new Date()); // "05/12/2025 14:30"
formatPhoneNumber("1234567890"); // "(123) 456-7890"
```

### Validation
```typescript
import { isValidEmail, isValidPhone, validateRequired } from '@/utils';

isValidEmail("test@test.com"); // true
isValidPhone("1234567890"); // true
validateRequired("value"); // true
```

### Helpers
```typescript
import { debounce, throttle, groupBy, sleep } from '@/utils';

const debouncedFn = debounce(fn, 300);
const throttledFn = throttle(fn, 1000);
const grouped = groupBy(array, 'key');
await sleep(1000);
```

## 📝 Types

Todos los tipos están definidos en `src/types/index.ts`:

- `User`
- `Customer`
- `Lead`
- `Task`
- `ApiResponse<T>`
- `PaginatedResponse<T>`
- `PaginationParams`

## 🎨 Tailwind CSS

El proyecto está configurado con Tailwind CSS. Puedes usar todas las clases de utilidad:

```tsx
<div className="bg-blue-600 text-white p-4 rounded-lg shadow-md">
  Contenido
</div>
```

## 📁 Configuración de Path Aliases

El proyecto usa `@/` como alias para la carpeta `src/`:

```typescript
import { Button } from '@/components/common';
import { apiService } from '@/services';
import type { User } from '@/types';
```

## 🔒 Variables de Entorno

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

Accede a ellas con:
```typescript
import.meta.env.VITE_API_BASE_URL
```

## 🌟 Características Principales

✅ TypeScript estricto
✅ Path aliases configurados (@/)
✅ Tailwind CSS integrado
✅ Sistema de autenticación completo
✅ Servicios API modulares
✅ Custom hooks reutilizables
✅ Componentes comunes
✅ Validaciones y formateo
✅ Context API para estado global
✅ Manejo de errores
✅ Loading states
✅ Responsive design ready

## 🚀 Próximos Pasos Recomendados

1. **Instalar React Router**
   ```bash
   npm install react-router-dom
   ```

2. **Agregar más páginas**
   - Leads
   - Tasks
   - Reports
   - Settings

3. **Implementar más servicios**
   - Lead Service
   - Task Service
   - Report Service

4. **Agregar validación de formularios**
   ```bash
   npm install react-hook-form zod
   ```

5. **Implementar notificaciones**
   ```bash
   npm install react-hot-toast
   ```

6. **Agregar iconos**
   ```bash
   npm install lucide-react
   ```

7. **Tests**
```
