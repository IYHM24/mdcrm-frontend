````markdown
# 🚀 INSTALACIÓN Y PRIMER USO

## ⚡ Instalación Rápida (3 pasos)

### 1️⃣ Instalar Dependencias

```bash
npm install
```

Esto instalará:
- React 19.2.0
- TypeScript 5.9.3
- Vite 7.2.4
- Tailwind CSS 3.4.17
- Y todas las dependencias de desarrollo

### 2️⃣ Configurar Variables de Entorno

```bash
# Copia el archivo de ejemplo
cp .env.example .env

# Edita .env con tu configuración
# VITE_API_BASE_URL=http://localhost:3000/api
```

O en Windows:
```cmd
copy .env.example .env
```

### 3️⃣ Iniciar el Proyecto

```bash
npm run dev
```

El proyecto se abrirá automáticamente en: **http://localhost:3000**

---

## 🎯 Primera Ejecución

### Ver el Dashboard
1. Abre **http://localhost:3000**
2. Verás el layout con Header, Sidebar y Dashboard
3. El Dashboard muestra métricas de ejemplo

### Probar Componentes
Los componentes están listos para usar:

```tsx
import { Button, Input, Card, Modal } from '@/components/common';
```

---

## 📦 Verificar Instalación

### Verificar TypeScript
```bash
npx tsc --noEmit
```
✅ Debe completar sin errores

### Verificar ESLint
```bash
npm run lint
```
✅ Debe completar sin errores

### Verificar Build
```bash
npm run build
```
✅ Debe generar la carpeta `dist/`

---

## 🔧 Configuración Adicional (Opcional)

### Instalar React Router (Recomendado)

```bash
npm install react-router-dom
```

Luego actualiza `src/App.tsx`:

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { Dashboard } from '@/pages/Dashboard';
import { Customers } from '@/pages/Customers';
import { Login } from '@/pages/Login';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <MainLayout>
              <Routes>
                <Route index element={<Dashboard />} />
                <Route path="/customers" element={<Customers />} />
              </Routes>
            </MainLayout>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
```

### Instalar React Hook Form + Zod (Recomendado)

```bash
npm install react-hook-form zod @hookform/resolvers
```

### Instalar Notificaciones

```bash
npm install react-hot-toast
```

Luego en `src/main.tsx`:

```tsx
import { Toaster } from 'react-hot-toast';

// En el render:
<Toaster position="top-right" />
```

### Instalar Iconos

```bash
npm install lucide-react
```

Uso:
```tsx
import { User, Settings, LogOut } from 'lucide-react';

<User className="w-5 h-5" />
```

---

## 🎨 Personalizar Estilos

### Modificar Colores de Tailwind

Edita `tailwind.config.js`:

```js
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          // ... más colores
          900: '#1e3a8a',
        },
        brand: '#YOUR_COLOR',
      },
    },
  },
}
```

### Agregar Fuentes Personalizadas

En `src/index.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

body {
  font-family: 'Inter', sans-serif;
}
```

---

## 🌐 Conectar con Backend

### 1. Configura tu API URL

En `.env`:
```env
VITE_API_BASE_URL=https://tu-api.com/api
```

### 2. Los servicios están listos

```typescript
// Ya funcionan automáticamente con tu API:
await authService.login({ email, password });
await customerService.getAll();
await customerService.create(data);
```

### 3. Formato esperado del backend

```json
// Login Response
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "1",
      "name": "Usuario",
      "email": "user@example.com",
      "role": "admin"
    }
  }
}

// List Response
{
  "success": true,
  "data": [...],
  "total": 100,
  "page": 1,
  "totalPages": 10
}

// Single Item Response
{
  "success": true,
  "data": { ... }
}

// Error Response
{
  "success": false,
  "message": "Error description"
}
```

---

## 🐛 Solución de Problemas

### Error: Cannot find module '@/...'

**Solución**: Reinicia el servidor de Vite
```bash
# Ctrl+C para detener
npm run dev
```

### Error: Tailwind classes not working

**Solución**: Verifica que `index.css` tenga las directivas:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Error de TypeScript en imports

**Solución**: Verifica que el path alias esté en `tsconfig.app.json`:
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

### Puerto 3000 ya en uso

**Solución**: Cambia el puerto en `vite.config.ts`:
```typescript
export default defineConfig({
  server: {
    port: 3001, // Cambia aquí
  },
})
```

---

## 📱 Comandos Útiles

```bash
# Desarrollo
npm run dev              # Inicia servidor de desarrollo

# Build
npm run build           # Compila para producción
npm run preview         # Preview producción

# Calidad de código
npm run lint            # Ejecuta ESLint
npm run lint -- --fix   # Auto-fix de ESLint

# TypeScript
npx tsc --noEmit        # Verifica tipos sin compilar

# Limpieza
rm -rf node_modules     # Elimina dependencias
rm -rf dist             # Elimina build
npm install             # Reinstala dependencias
```

---

## 🎓 Aprender Más

### Estructura del Proyecto
📖 Lee `STRUCTURE.md` - Resumen completo de archivos

### Documentación Completa
📖 Lee `DOCS.md` - API completa de componentes, servicios y hooks

### Ejemplos Prácticos
📖 Lee `EXAMPLES.md` - 7 ejemplos completos con código

### Arquitectura
📖 Lee `ARCHITECTURE.md` - Diseño y patrones del sistema

### Inicio Rápido
📖 Lee `QUICKSTART.md` - Guía de 5 minutos

---

## ✅ Checklist Post-Instalación

- [ ] `npm install` ejecutado sin errores
- [ ] `.env` configurado con tu API URL
- [ ] `npm run dev` inicia correctamente
- [ ] Navegador abre en http://localhost:3000
- [ ] Dashboard se muestra correctamente
- [ ] No hay errores en la consola del navegador
- [ ] TypeScript no muestra errores
- [ ] ESLint pasa sin problemas

---

## 🎉 ¡Listo para Desarrollar!

Tu proyecto CRM está completamente configurado y listo para empezar a desarrollar.

**Próximos pasos:**
1. ✅ Lee la documentación en `DOCS.md`
2. ✅ Revisa los ejemplos en `EXAMPLES.md`
3. ✅ Empieza a crear tus propias páginas y componentes
4. ✅ Conecta con tu backend
5. ✅ ¡Desarrolla tu CRM!

---

**¿Necesitas ayuda?** 
- Revisa la documentación en los archivos .md
- Todos los ejemplos están listos para copiar y pegar
- La estructura es clara y escalable

**¡Happy Coding!** 🚀

````
