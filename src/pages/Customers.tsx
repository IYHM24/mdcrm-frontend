import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search, UserPlus, User, Phone, Mail, Clock, MoreVertical, ChevronRight, IdCard, FileText } from 'lucide-react';

// Interface basada en el modelo ClienteModel de .NET
interface Customer {
  id: number;
  nombre: string;
  apellido: string;
  identificacion: string;
  tipo_Identificacion: 'CC' | 'TI' | 'CE' | 'NIT' | 'PEP';
  celular: string;
  correo?: string;
  celular_Alterno?: string;
  observacion?: string;
  createdAt?: string;
  updatedAt?: string;
  // Campos calculados para la UI
  nombreCompleto?: string;
  status?: 'Activo' | 'Inactivo' | 'Pendiente';
}

// Datos de ejemplo - En producción vendrían de una API
const sampleCustomers: Customer[] = [
  {
    id: 1,
    nombre: "Juan",
    apellido: "Pérez Gómez",
    identificacion: "12345678",
    tipo_Identificacion: "CC",
    celular: "3001234567",
    correo: "juan.perez@email.com",
    celular_Alterno: "3101234567",
    observacion: "Cliente premium",
    status: "Activo",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
    nombreCompleto: "Juan Pérez Gómez"
  },
  {
    id: 2,
    nombre: "María",
    apellido: "García López",
    identificacion: "87654321",
    tipo_Identificacion: "CC",
    celular: "3019876543",
    correo: "maria.garcia@email.com",
    observacion: "Requiere seguimiento",
    status: "Inactivo",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-18",
    nombreCompleto: "María García López"
  },
  {
    id: 3,
    nombre: "Carlos",
    apellido: "Rodríguez Silva",
    identificacion: "45678912",
    tipo_Identificacion: "CE",
    celular: "3024567890",
    correo: "carlos.rodriguez@email.com",
    celular_Alterno: "3124567890",
    status: "Activo",
    createdAt: "2024-02-01",
    updatedAt: "2024-02-01",
    nombreCompleto: "Carlos Rodríguez Silva"
  },
  {
    id: 4,
    nombre: "Ana",
    apellido: "Martínez Cruz",
    identificacion: "32165498",
    tipo_Identificacion: "TI",
    celular: "3031112222",
    correo: "ana.martinez@email.com",
    observacion: "Cliente joven",
    status: "Activo",
    createdAt: "2024-01-20",
    updatedAt: "2024-01-25",
    nombreCompleto: "Ana Martínez Cruz"
  },
  {
    id: 5,
    nombre: "Luis",
    apellido: "Fernández Torres",
    identificacion: "78945612",
    tipo_Identificacion: "CC",
    celular: "3043334444",
    correo: "luis.fernandez@email.com",
    status: "Pendiente",
    createdAt: "2024-02-05",
    updatedAt: "2024-02-05",
    nombreCompleto: "Luis Fernández Torres"
  },
  {
    id: 6,
    nombre: "Carmen",
    apellido: "López Vargas",
    identificacion: "91028374",
    tipo_Identificacion: "CC",
    celular: "3055556666",
    correo: "carmen.lopez@email.com",
    celular_Alterno: "3155556666",
    observacion: "Excelente historial",
    status: "Activo",
    createdAt: "2024-01-25",
    updatedAt: "2024-01-30",
    nombreCompleto: "Carmen López Vargas"
  },
  {
    id: 7,
    nombre: "Roberto",
    apellido: "Silva Mendoza",
    identificacion: "56473829",
    tipo_Identificacion: "CC",
    celular: "3067778888",
    correo: "roberto.silva@email.com",
    status: "Inactivo",
    createdAt: "2024-01-12",
    updatedAt: "2024-01-20",
    nombreCompleto: "Roberto Silva Mendoza"
  },
  {
    id: 8,
    nombre: "Patricia",
    apellido: "Herrera Morales",
    identificacion: "37495821",
    tipo_Identificacion: "CC",
    celular: "3079990000",
    correo: "patricia.herrera@email.com",
    celular_Alterno: "3179990000",
    observacion: "VIP",
    status: "Activo",
    createdAt: "2024-02-03",
    updatedAt: "2024-02-03",
    nombreCompleto: "Patricia Herrera Morales"
  }
];

export const Customers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Filtrar clientes basado en el término de búsqueda
  const filteredCustomers = useMemo(() => {
    return sampleCustomers.filter(customer => {
      const searchLower = searchTerm.toLowerCase();
      return (
        customer.nombre.toLowerCase().includes(searchLower) ||
        customer.apellido.toLowerCase().includes(searchLower) ||
        customer.identificacion.toLowerCase().includes(searchLower) ||
        customer.celular.includes(searchTerm) ||
        (customer.correo && customer.correo.toLowerCase().includes(searchLower)) ||
        (customer.celular_Alterno && customer.celular_Alterno.includes(searchTerm)) ||
        customer.tipo_Identificacion.toLowerCase().includes(searchLower)
      );
    });
  }, [searchTerm]);

  // Calcular paginación
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage);

  // Función para obtener el nombre amigable del tipo de identificación
  const getTipoIdentificacionLabel = (tipo: string) => {
    const tipos: Record<string, string> = {
      'CC': 'Cédula de Ciudadanía',
      'TI': 'Tarjeta de Identidad',
      'CE': 'Cédula de Extranjería',
      'NIT': 'NIT',
      'PEP': 'PEP'
    };
    return tipos[tipo] || tipo;
  };

  // Función para formatear el número de celular
  const formatCelular = (celular: string) => {
    if (celular.length === 10) {
      return `${celular.slice(0, 3)} ${celular.slice(3, 6)} ${celular.slice(6)}`;
    }
    return celular;
  };

  // Función para obtener el color del estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Activo':
        return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300';
      case 'Inactivo':
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400';
      case 'Pendiente':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400';
    }
  };

  // Función para obtener el tiempo relativo desde la creación
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Hoy';
    if (diffInDays === 1) return 'Hace 1 día';
    if (diffInDays < 30) return `Hace ${diffInDays} días`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-end sm:flex-row gap-4 items-start sm:items-center">
        <Button className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Nuevo Cliente
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl">Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Barra de búsqueda */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Buscar por nombre, apellido, identificación, celular o correo..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>

          {/* Lista de clientes estilo Actividades Recientes */}
          <div className="space-y-3">
            {paginatedCustomers.length > 0 ? (
              paginatedCustomers.map((customer) => (
                <div
                  key={customer.id}
                  className="bg-card group flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-card/50 transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {/* Icono de usuario */}
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center">
                      <User className="h-5 w-5 text-muted-foreground" />
                    </div>

                    {/* Información del cliente */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium text-foreground truncate">
                            {customer.nombre} {customer.apellido}
                          </h3>
                          <div className="flex items-center gap-4 mt-1">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <IdCard className="h-3 w-3" />
                              <span className="truncate">
                                {customer.tipo_Identificacion}: {customer.identificacion}
                              </span>
                            </div>
                            <div className="hidden sm:flex items-center gap-1 text-sm text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              <span>{formatCelular(customer.celular)}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 mt-1">
                            {customer.correo && (
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Mail className="h-3 w-3" />
                                <span className="truncate">{customer.correo}</span>
                              </div>
                            )}
                            {customer.observacion && (
                              <div className="hidden lg:flex items-center gap-1 text-sm text-muted-foreground">
                                <FileText className="h-3 w-3" />
                                <span className="truncate">{customer.observacion}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                            <Clock className="h-3 w-3" />
                            <span>Registrado {getTimeAgo(customer.createdAt || '')}</span>
                          </div>
                        </div>

                        {/* Estado y acciones */}
                        <div className="flex items-center gap-3 ml-4">
                          <div className="text-right hidden lg:block">
                            <p className="text-sm font-medium text-foreground">
                              {getTipoIdentificacionLabel(customer.tipo_Identificacion)}
                            </p>
                            <p className="text-xs text-muted-foreground">Tipo identificación</p>
                          </div>

                          {customer.status && (
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${getStatusColor(customer.status)}`}>
                              {customer.status}
                            </span>
                          )}

                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Más opciones</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-muted/50 flex items-center justify-center">
                    <Search className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-foreground">No se encontraron clientes</p>
                    {searchTerm ? (
                      <p className="text-sm text-muted-foreground mt-1">
                        Intenta con otros términos de búsqueda
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground mt-1">
                        Comienza agregando tu primer cliente
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
              <div className="text-sm text-muted-foreground">
                Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredCustomers.length)} de {filteredCustomers.length} clientes
              </div>

              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>

                  {/* Páginas */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          onClick={() => setCurrentPage(pageNum)}
                          isActive={currentPage === pageNum}
                          className="cursor-pointer"
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
