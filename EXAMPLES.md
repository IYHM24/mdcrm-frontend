# 💡 EJEMPLOS PRÁCTICOS - CRM SYSTEM

## 🎯 Casos de Uso Completos

### 1. Crear una Nueva Página

```tsx
// src/pages/Leads.tsx
import { useState } from 'react';
import { Card, Button, Input, Modal } from '@/components/common';
import { MainLayout } from '@/components/layout';
import type { Lead } from '@/types';

export const Leads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Leads</h1>
          <Button onClick={() => setIsModalOpen(true)}>
            Nuevo Lead
          </Button>
        </div>

        <Card title="Lista de Leads">
          {leads.length === 0 ? (
            <p className="text-gray-500">No hay leads</p>
          ) : (
            <div className="space-y-2">
              {leads.map(lead => (
                <div key={lead.id} className="p-4 border rounded">
                  {lead.status}
                </div>
              ))}
            </div>
          )}
        </Card>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Nuevo Lead"
        >
          {/* Formulario aquí */}
        </Modal>
      </div>
    </MainLayout>
  );
};
```

### 2. Crear un Nuevo Servicio

```typescript
// src/services/lead.service.ts
import { apiService } from './api.service';
import type { Lead, ApiResponse, PaginatedResponse } from '@/types';

export class LeadService {
  private endpoint = '/leads';

  async getAll(status?: string): Promise<PaginatedResponse<Lead>> {
    const params = status ? { status } : undefined;
    return apiService.get<PaginatedResponse<Lead>>(this.endpoint, params);
  }

  async getById(id: string): Promise<ApiResponse<Lead>> {
    return apiService.get<ApiResponse<Lead>>(`${this.endpoint}/${id}`);
  }

  async create(lead: Omit<Lead, 'id' | 'createdAt'>): Promise<ApiResponse<Lead>> {
    return apiService.post<ApiResponse<Lead>>(this.endpoint, lead);
  }

  async updateStatus(id: string, status: Lead['status']): Promise<ApiResponse<Lead>> {
    return apiService.patch<ApiResponse<Lead>>(`${this.endpoint}/${id}/status`, { status });
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    return apiService.delete<ApiResponse<void>>(`${this.endpoint}/${id}`);
  }
}

export const leadService = new LeadService();
```

### 3. Crear un Custom Hook

```typescript
// src/hooks/useLeads.ts
import { useState, useEffect } from 'react';
import { leadService } from '@/services/lead.service';
import type { Lead } from '@/types';

export const useLeads = (status?: string) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await leadService.getAll(status);
      setLeads(response.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error fetching leads'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [status]);

  const createLead = async (lead: Omit<Lead, 'id' | 'createdAt'>) => {
    const response = await leadService.create(lead);
    if (response.success) {
      setLeads(prev => [...prev, response.data]);
    }
    return response;
  };

  const deleteLead = async (id: string) => {
    await leadService.delete(id);
    setLeads(prev => prev.filter(lead => lead.id !== id));
  };

  return {
    leads,
    loading,
    error,
    fetchLeads,
    createLead,
    deleteLead,
  };
};
```

### 4. Formulario con Validación

```tsx
// src/components/forms/CustomerForm.tsx
import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { Input, Button } from '@/components/common';
import { isValidEmail, isValidPhone, validateRequired } from '@/utils';
import type { Customer } from '@/types';

interface CustomerFormProps {
  onSubmit: (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  initialData?: Partial<Customer>;
}

export const CustomerForm = ({ onSubmit, initialData }: CustomerFormProps) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    company: initialData?.company || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpiar error al escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!validateRequired(formData.name)) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!validateRequired(formData.email)) {
      newErrors.email = 'El email es requerido';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!validateRequired(formData.phone)) {
      newErrors.phone = 'El teléfono es requerido';
    } else if (!isValidPhone(formData.phone)) {
      newErrors.phone = 'Teléfono inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        status: 'active',
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nombre"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        required
      />

      <Input
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        required
      />

      <Input
        label="Teléfono"
        name="phone"
        type="tel"
        value={formData.phone}
        onChange={handleChange}
        error={errors.phone}
        required
      />

      <Input
        label="Empresa"
        name="company"
        value={formData.company}
        onChange={handleChange}
      />

      <div className="flex justify-end space-x-2">
        <Button type="submit" isLoading={isSubmitting}>
          {initialData ? 'Actualizar' : 'Crear'}
        </Button>
      </div>
    </form>
  );
};
```

### 5. Tabla con Paginación

```tsx
// src/components/tables/CustomerTable.tsx
import { useState } from 'react';
import { Button, Card } from '@/components/common';
import { formatDate, formatPhoneNumber } from '@/utils';
import type { Customer } from '@/types';

interface CustomerTableProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (id: string) => void;
}

export const CustomerTable = ({ customers, onEdit, onDelete }: CustomerTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(customers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCustomers = customers.slice(startIndex, endIndex);

  return (
    <Card title={`Clientes (${customers.length})`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Teléfono
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Empresa
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Fecha
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentCustomers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {customer.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{customer.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {formatPhoneNumber(customer.phone)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {customer.company || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {formatDate(customer.createdAt)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onEdit(customer)}
                    className="mr-2"
                  >
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => onDelete(customer.id)}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-700">
            Mostrando {startIndex + 1} a {Math.min(endIndex, customers.length)} de{' '}
            {customers.length} resultados
          </div>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <span className="px-4 py-2 text-sm">
              Página {currentPage} de {totalPages}
            </span>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};
```

### 6. Búsqueda con Debounce

```tsx
// src/components/SearchBar.tsx
import { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import { Input } from '@/components/common';
import { debounce } from '@/utils';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  delay?: number;
}

export const SearchBar = ({ 
  onSearch, 
  placeholder = 'Buscar...', 
  delay = 300 
}: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const debouncedSearch = debounce(() => {
      onSearch(searchTerm);
    }, delay);

    debouncedSearch();
  }, [searchTerm, onSearch, delay]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Input
      type="text"
      placeholder={placeholder}
      value={searchTerm}
      onChange={handleChange}
    />
  );
};
```

### 7. Página Completa con Todo Integrado

```tsx
// src/pages/CustomersComplete.tsx
import { useState } from 'react';
import { Button, Modal } from '@/components/common';
import { MainLayout } from '@/components/layout';
import { CustomerForm } from '@/components/forms/CustomerForm';
import { CustomerTable } from '@/components/tables/CustomerTable';
import { SearchBar } from '@/components/SearchBar';
import { useFetch } from '@/hooks';
import { customerService } from '@/services';
import type { Customer } from '@/types';

export const CustomersComplete = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data, loading, error, refetch } = useFetch(
    () => customerService.getAll({ page: 1, limit: 100 })
  );

  const filteredCustomers = data?.data.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleSubmit = async (customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (editingCustomer) {
        await customerService.update(editingCustomer.id, customerData);
      } else {
        await customerService.create(customerData);
      }
      await refetch();
      setIsModalOpen(false);
      setEditingCustomer(null);
    } catch (error) {
      console.error('Error saving customer:', error);
    }
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este cliente?')) {
      try {
        await customerService.delete(id);
        await refetch();
      } catch (error) {
        console.error('Error deleting customer:', error);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCustomer(null);
  };

  if (loading) return <MainLayout>Cargando...</MainLayout>;
  if (error) return <MainLayout>Error: {error.message}</MainLayout>;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
            <p className="text-gray-600 mt-1">Gestiona tu base de clientes</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            Nuevo Cliente
          </Button>
        </div>

        <SearchBar
          onSearch={setSearchQuery}
          placeholder="Buscar por nombre o email..."
        />

        <CustomerTable
          customers={filteredCustomers}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={editingCustomer ? 'Editar Cliente' : 'Nuevo Cliente'}
          size="lg"
        >
          <CustomerForm
            onSubmit={handleSubmit}
            initialData={editingCustomer || undefined}
          />
        </Modal>
      </div>
    </MainLayout>
  );
};
```

## 🎯 Patrones de Uso

### Loading State
```tsx
if (loading) return <Spinner />;
if (error) return <div>Error: {error.message}</div>;
return <div>{data}</div>;
```

### Conditional Rendering
```tsx
{isAuthenticated ? <Dashboard /> : <Login />}
{users.length > 0 ? <UserList users={users} /> : <EmptyState />}
```

### Event Handlers
```tsx
const handleClick = () => { /* ... */ };
const handleChange = (e: ChangeEvent<HTMLInputElement>) => { /* ... */ };
const handleSubmit = async (e: FormEvent) => { e.preventDefault(); /* ... */ };
```

---

**¡Con estos ejemplos puedes crear cualquier funcionalidad!** 🚀
