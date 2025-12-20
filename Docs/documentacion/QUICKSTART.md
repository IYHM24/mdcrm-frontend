````markdown
# 🎯 GUÍA RÁPIDA DE INICIO - CRM SYSTEM

## ⚡ Instalación Rápida

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env

# 3. Iniciar el proyecto
npm run dev
```

## 📂 Estructura Organizada

```
src/
├── components/
│   ├── common/          # Button, Input, Card, Modal, Spinner
│   └── layout/          # Header, Sidebar, MainLayout
├── pages/               # Dashboard, Customers, Login
├── services/            # API, Auth, Customer services
├── hooks/               # useAuth, useFetch, useLocalStorage
├── context/             # AuthContext
├── types/               # TypeScript interfaces
├── utils/               # Format, Validation, Helpers
└── config/              # Constants, Environment
```

## 🚀 Características Principales

✅ **React 19** + **TypeScript** + **Vite**
✅ **Tailwind CSS** integrado
✅ **Sistema de autenticación** completo
✅ **Componentes reutilizables** profesionales
✅ **Servicios API** modulares
✅ **Custom Hooks** para lógica compartida
✅ **Path aliases** (`@/`) configurados
✅ **TypeScript estricto** con tipos definidos
✅ **Estructura escalable** y mantenible

## 🎨 Componentes Disponibles

### Básicos
- **Button** - 4 variantes (primary, secondary, danger, success)
- **Input** - Con validación y mensajes de error
- **Card** - Contenedor con título y footer
- **Modal** - Modal responsive con backdrop
- **Spinner** - Indicador de carga

### Layout
- **MainLayout** - Layout principal con sidebar
- **Header** - Barra superior
- **Sidebar** - Menú lateral

## 🔧 Servicios API

```typescript
// Auth
await authService.login({ email, password });
await authService.logout();

// Customers
await customerService.getAll({ page: 1, limit: 10 });
await customerService.getById(id);
await customerService.create(data);
await customerService.update(id, data);
await customerService.delete(id);

// API genérica
await apiService.get('/endpoint');
await apiService.post('/endpoint', data);
```

## 🎣 Hooks Personalizados

```typescript
// Autenticación
const { user, isAuthenticated, login, logout } = useAuth();

// Fetch con estados
const { data, loading, error, refetch } = useFetch(fetchFn);

// LocalStorage reactivo
const [value, setValue] = useLocalStorage('key', initial);
```

## 🛠️ Utilidades

```typescript
// Formateo
formatCurrency(1000);              // "$1,000.00"
formatDate(new Date());            // "05/12/2025"
formatPhoneNumber("1234567890");   // "(123) 456-7890"
```

## 📝 Tipos TypeScript

```typescript
User, Customer, Lead, Task
ApiResponse<T>, PaginatedResponse<T>
```

## 🎯 Ejemplo de Uso

```tsx
import { useState } from 'react';
import { Button, Input, Card } from '@/components/common';
import { useAuth } from '@/hooks';
import { customerService } from '@/services';

function MyComponent() {
  const { user } = useAuth();
  const [name, setName] = useState('');

  const handleSave = async () => {
    await customerService.create({ name });
  };

  return (
    <Card title="Nuevo Cliente">
      <Input 
        label="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button onClick={handleSave}>Guardar</Button>
    </Card>
  );
}
```

## 📦 Scripts Disponibles

```bash
npm run dev      # Desarrollo (puerto 3000)
npm run build    # Compilar producción
npm run preview  # Preview producción
npm run lint     # Ejecutar linter
```

## 🔒 Variables de Entorno

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## 📚 Documentación Completa

Ver **DOCS.md** para documentación detallada de cada componente, servicio y utilidad.

## 🎓 Patrones Implementados

- ✅ **Arquitectura limpia** con separación de capas
- ✅ **Component Pattern** para reutilización
- ✅ **Custom Hooks** para lógica compartida
- ✅ **Service Layer** para comunicación API
- ✅ **Context API** para estado global
- ✅ **Type Safety** con TypeScript estricto

## 🚀 Próximos Pasos

1. **Instala React Router** para navegación
2. **Agrega más páginas** (Leads, Tasks, Reports)
3. **Implementa formularios** con react-hook-form
4. **Añade notificaciones** con react-hot-toast
5. **Integra iconos** con lucide-react

## 💡 Tips Profesionales

- Usa `@/` para imports absolutos
- Todos los componentes están tipados
- Los servicios manejan errores automáticamente
- Los hooks incluyen loading y error states
- Tailwind CSS está listo para usar

---

**¡Listo para desarrollar!** 🎉

````