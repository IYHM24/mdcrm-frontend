# ÌæØ CRM System - Frontend

> Sistema CRM profesional construido con React 19, TypeScript, Vite y Tailwind CSS

[![React](https://img.shields.io/badge/React-19.2-blue.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-7.2-purple.svg)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-cyan.svg)](https://tailwindcss.com)

## Ì∫Ä Inicio R√°pido (3 pasos)

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env

# 3. Iniciar el proyecto
npm run dev
```

**¬°Listo!** El proyecto se abrir√° en [http://localhost:3000](http://localhost:3000)

## ‚ú® Caracter√≠sticas

- ‚ö° **Vite** - Build tool ultra r√°pido con HMR
- ‚öõÔ∏è **React 19** - √öltima versi√≥n de React
- ÌæØ **TypeScript** - Tipado est√°tico para mayor seguridad
- Ìæ® **Tailwind CSS** - Estilos utilitarios configurados
- Ì¥ê **Autenticaci√≥n** - Sistema completo con Context API
- Ì≥ä **Dashboard** - Panel con m√©tricas y estad√≠sticas
- Ì±• **Gesti√≥n de Clientes** - CRUD completo
- ÌæØ **Leads & Tasks** - Seguimiento y gesti√≥n
- Ì∑© **Componentes** - 9 componentes reutilizables
- Ìæ£ **Custom Hooks** - L√≥gica compartida
- Ì≥¶ **Servicios API** - Cliente HTTP modular
- Ì≥ù **TypeScript** - Tipos definidos
- Ìª†Ô∏è **Utilidades** - Format, Validation, Helpers

## Ì≥Å Estructura del Proyecto

```
src/
‚îú‚îÄ‚îÄ components/          # Componentes reutilizables
‚îÇ   ‚îú‚îÄ‚îÄ common/         # Button, Input, Card, Modal, Spinner
‚îÇ   ‚îî‚îÄ‚îÄ layout/         # Header, Sidebar, MainLayout
‚îú‚îÄ‚îÄ pages/              # Dashboard, Customers, Login
‚îú‚îÄ‚îÄ services/           # API, Auth, Customer services
‚îú‚îÄ‚îÄ hooks/              # useAuth, useFetch, useLocalStorage
‚îú‚îÄ‚îÄ context/            # AuthContext
‚îú‚îÄ‚îÄ types/              # TypeScript interfaces
‚îú‚îÄ‚îÄ utils/              # Format, Validation, Helpers
‚îî‚îÄ‚îÄ config/             # Constants, Environment
```

## Ì∑© Componentes Disponibles

### Componentes Comunes
- **Button** - 4 variantes con loading state
- **Input** - Con validaci√≥n y mensajes de error
- **Card** - Contenedor con t√≠tulo y footer
- **Modal** - Responsive con backdrop
- **Spinner** - Indicador de carga (3 tama√±os)

### Layout
- **MainLayout** - Layout completo con sidebar y header
- **Header** - Barra superior con info de usuario
- **Sidebar** - Navegaci√≥n lateral

## Ì¥ß Servicios API

```typescript
// Autenticaci√≥n
await authService.login({ email, password });
await authService.logout();

// Clientes
await customerService.getAll({ page: 1, limit: 10 });
await customerService.create(data);
await customerService.update(id, data);
await customerService.delete(id);
```

## Ìæ£ Custom Hooks

```typescript
// Hook de autenticaci√≥n
const { user, isAuthenticated, login, logout } = useAuth();

// Hook para fetch con estados
const { data, loading, error, refetch } = useFetch(fetchFn);

// Hook para localStorage reactivo
const [value, setValue] = useLocalStorage('key', initialValue);
```

## Ì≥ù Scripts Disponibles

```bash
npm run dev       # Desarrollo (puerto 3000)
npm run build     # Compilar para producci√≥n
npm run preview   # Preview del build
npm run lint      # Ejecutar ESLint
```

## Ì≥ö Documentaci√≥n

- **[INSTALL.md](INSTALL.md)** - Gu√≠a completa de instalaci√≥n
- **[QUICKSTART.md](QUICKSTART.md)** - Inicio r√°pido de 5 minutos
- **[DOCS.md](DOCS.md)** - Documentaci√≥n completa de API
- **[EXAMPLES.md](EXAMPLES.md)** - 7 ejemplos pr√°cticos con c√≥digo
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Arquitectura del sistema
- **[STRUCTURE.md](STRUCTURE.md)** - Resumen de archivos creados

## Ì¥í Variables de Entorno

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## Ìæ® Tecnolog√≠as

- **Frontend**: React 19.2, TypeScript 5.9
- **Build Tool**: Vite 7.2
- **Estilos**: Tailwind CSS 3.4
- **Estado**: Context API + Custom Hooks
- **HTTP Client**: Fetch API con servicio wrapper
- **Validaci√≥n**: Utilidades personalizadas
- **Formateo**: Intl API

## Ì≥¶ Dependencias Principales

```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "typescript": "~5.9.3",
  "vite": "^7.2.4",
  "tailwindcss": "^3.4.17"
}
```

## Ìª†Ô∏è Configuraci√≥n

### Path Aliases
El proyecto usa \`@/\` para imports absolutos:

```typescript
import { Button } from '@/components/common';
import { apiService } from '@/services';
import type { User } from '@/types';
```

## ÌæØ Caracter√≠sticas Implementadas

‚úÖ Sistema de autenticaci√≥n completo  
‚úÖ Gesti√≥n de clientes (CRUD)  
‚úÖ Dashboard con m√©tricas  
‚úÖ Componentes reutilizables  
‚úÖ Custom hooks  
‚úÖ Servicios API modulares  
‚úÖ Utilidades (format, validation, helpers)  
‚úÖ TypeScript estricto  
‚úÖ Path aliases (@/)  
‚úÖ Tailwind CSS configurado  
‚úÖ Responsive design ready  

## Ì∫Ä Pr√≥ximos Pasos

Ver **[INSTALL.md](INSTALL.md)** para dependencias opcionales recomendadas.

## Ì≥ñ Ejemplo de Uso

```tsx
import { Button, Card } from '@/components/common';
import { useAuth } from '@/hooks';

function MyComponent() {
  const { user } = useAuth();

  return (
    <Card title="Mi Componente">
      <Button>Guardar</Button>
    </Card>
  );
}
```

---

**¬øNecesitas ayuda?** Revisa la documentaci√≥n en los archivos \`.md\`

**¬°Happy Coding!** Ì∫Ä
