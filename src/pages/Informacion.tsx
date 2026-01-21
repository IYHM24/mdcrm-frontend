import { useState, useEffect, useRef } from 'react';
import { TableComponent, type ColumnDef, type TableAction, type PaginationInfo } from '@/components/common';
import informeService from '@/services/informe.service';
import type { InformeModel } from '@/types';
import { FileText, Plus, Trash2, Edit, Download, User, Eye, Copy } from 'lucide-react';
import TableService from './services/table.service';

const InformacionPage = () => {

  //Instancias
  const tableService = useRef<TableService<InformeModel> | null>(null);

  //Datos
  const [data, setData] = useState<InformeModel[]>([]);

  //Estado de carga y errores
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //Paginación
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Definición de columnas
  const columns: ColumnDef<InformeModel>[] = [
    {
      key: 'id',
      label: 'ID',
      sortable: true,
      className: 'font-mono text-xs w-16',
    },
    {
      key: 'poliza',
      label: 'Póliza',
      sortable: true,
      render: (value) => value || '-',
      className: 'font-medium',
    },
    {
      key: 'asegurado',
      label: 'Asegurado',
      sortable: true,
      filterable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center">
            <User className="h-4 w-4 text-muted-foreground" />
          </div>
          <span className="font-medium">{value || '-'}</span>
        </div>
      ),
    },
    {
      key: 'cc',
      label: 'CC',
      sortable: true,
      filterable: true,
      className: 'font-mono',
    },
    {
      key: 'prima',
      label: 'Prima',
      sortable: true,
      render: (value) => {
        if (!value) return '-';
        return (
          <span className="font-semibold text-green-600 dark:text-green-400">
            ${Number(value).toLocaleString('es-CO')}
          </span>
        );
      },
      className: 'text-right',
    },
    {
      key: 'datacredito',
      label: 'Datacrédito',
      render: (value) => value || '-',
      className: 'text-sm',
    },
    {
      key: 'cifin',
      label: 'Cifin',
      render: (value) => value || '-',
      className: 'text-sm',
    },
    {
      key: 'createdAt',
      label: 'Fecha Creación',
      sortable: true,
      render: (value) => {
        if (!value) return '-';
        const date = new Date(value);
        return (
          <div className="text-sm">
            <div className="font-medium">
              {date.toLocaleDateString('es-CO', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </div>
            <div className="text-xs text-muted-foreground">
              {date.toLocaleTimeString('es-CO', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
        );
      },
    },
    {
      key: 'createdByUser',
      label: 'Creado Por',
      render: (value) => {
        if (!value) return '-';
        const fullName = `${value.firstName || ''} ${value.lastName || ''}`.trim();
        return (
          <div className="text-sm">
            <div className="font-medium">{fullName || '-'}</div>
            {value.email && (
              <div className="text-xs text-muted-foreground">{value.email}</div>
            )}
          </div>
        );
      },
    },
  ];

  // Acciones en lote
  const actions: TableAction<InformeModel>[] = [
    {
      label: 'Nuevo Informe',
      icon: <Plus className="h-4 w-4" />,
      variant: 'default',
      onClick: () => {
        console.log('Crear nuevo informe');
        // TODO: Implementar modal de creación
      },
    },
    {
      label: 'Editar',
      icon: <Edit className="h-4 w-4" />,
      variant: 'outline',
      requiresSelection: true,
      onClick: (selectedRows) => {
        if (selectedRows.length === 1) {
          console.log('Editar informe:', selectedRows[0]);
          // TODO: Implementar modal de edición
        } else {
          alert('Por favor selecciona solo un informe para editar');
        }
      },
    },
    {
      label: 'Eliminar',
      icon: <Trash2 className="h-4 w-4" />,
      variant: 'destructive',
      requiresSelection: true,
      onClick: async (selectedRows) => {
        if (confirm(`¿Estás seguro de eliminar ${selectedRows.length} informe(s)?`)) {
          try {
            // Si TableService (extiende TableEvents) tiene helper, delegar
            if (tableService.current && tableService.current.deleteSelected) {
              await tableService.current.deleteSelected(selectedRows, informeService.delete.bind(informeService));
              alert('Informes eliminados exitosamente');
              return;
            }

            setLoading(true);
            await Promise.all(selectedRows.map((row) => informeService.delete(row.id)));
            await tableService.current?.loadData(pagination.page, pagination.limit);
            alert('Informes eliminados exitosamente');
          } catch (err) {
            alert('Error al eliminar informes');
            console.error(err);
          } finally {
            setLoading(false);
          }
        }
      },
    },
    {
      label: 'Exportar',
      icon: <Download className="h-4 w-4" />,
      variant: 'outline',
      onClick: (selectedRows) => {
        const dataToExport = selectedRows.length > 0 ? selectedRows : data;
        // Si TableService tiene exportCSV, usarlo
        if (tableService.current && tableService.current.exportCSV) {
          const csv = tableService.current.exportCSV(dataToExport as InformeModel[], ['ID', 'Póliza', 'Asegurado', 'CC', 'Prima', 'Datacrédito', 'Cifin', 'Fecha Creación']);
          downloadCSV(csv, 'informes.csv');
          return;
        }

        const csv = convertToCSV(dataToExport);
        downloadCSV(csv, 'informes.csv');
      },
    },
  ];

  /**
   * Convertir datos a formato CSV
   * @param data 
   * @returns 
   */
  const convertToCSV = (data: InformeModel[]): string => {
    const escape = (v: any) => {
      const s = String(v ?? '');
      // doble comilla por RFC4180
      return `"${s.replace(/"/g, '""').replace(/\n/g, ' ')}"`;
    };

    const headers = ['ID', 'Póliza', 'Asegurado', 'CC', 'Prima', 'Datacrédito', 'Cifin', 'Fecha Creación'];
    const rows = data.map((item) => [
      escape(item.id),
      escape(item.poliza),
      escape(item.asegurado),
      escape(item.cc),
      escape(item.prima),
      escape(item.datacredito),
      escape(item.cifin),
      escape(item.createdAt),
    ]);

    const csvContent = [headers.map(escape).join(','), ...rows.map((row) => row.join(','))].join('\n');
    return csvContent;
  };

  /**
   * Descargar datos a CSV
   * @param csv Contenido CSV
   * @param filename Nombre del archivo
   */
  const downloadCSV = (csv: string, filename: string) => {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /**
   * Acciones disponibles para cada fila de informe
   * @param row 
   * @returns 
   */
  const rowActions = (row: InformeModel): TableAction<InformeModel>[] => [
    {
      label: 'Ver Detalles',
      icon: <Eye className="h-4 w-4" />,
      onClick: () => {
        console.log('Ver detalles:', row);
        // TODO: Abrir modal con detalles del informe
        alert(`Ver detalles del informe #${row.id}`);
      },
    },
    {
      label: 'Editar',
      icon: <Edit className="h-4 w-4" />,
      onClick: () => {
        console.log('Editar:', row);
        // TODO: Abrir modal de edición
        alert(`Editar informe #${row.id}`);
      },
    },
    {
      label: 'Duplicar',
      icon: <Copy className="h-4 w-4" />,
      onClick: async () => {
        try {
          // Delegar a TableService si está disponible
          if (tableService.current && tableService.current.duplicateRow) {
            await tableService.current.duplicateRow(row, (payload: any) => informeService.create(payload));
            alert('Informe duplicado exitosamente');
            return;
          }

          setLoading(true);
          // Crear una copia del informe sin id, createdAt, updatedAt
          const { id, createdAt, updatedAt, createdByUser, createdByUserId, ...informeCopy } = row;
          await informeService.create(informeCopy as Omit<InformeModel, 'id' | 'createdAt' | 'updatedAt'>);
          await tableService.current?.loadData(pagination.page, pagination.limit);
          alert('Informe duplicado exitosamente');
        } catch (err) {
          alert('Error al duplicar informe');
          console.error(err);
        } finally {
          setLoading(false);
        }
      },
    },
    {
      label: 'Eliminar',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: async () => {
        if (confirm(`¿Estás seguro de eliminar el informe #${row.id}?`)) {
          try {
            setLoading(true);
            await informeService.delete(row.id);
            await tableService.current?.loadData(pagination.page, pagination.limit);
            alert('Informe eliminado exitosamente');
          } catch (err) {
            alert('Error al eliminar informe');
            console.error(err);
          } finally {
            setLoading(false);
          }
        }
      },
      className: 'text-destructive focus:text-destructive',
    },
  ];

  /**
   * Carga inicial de datos
   */
  // Ejecutar una sola vez al montar — evitamos la advertencia de exhaustive-deps
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {

    tableService.current = new TableService<InformeModel>({
      loading,
      error,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: pagination.total,
        totalPages: pagination.totalPages ?? 0,
      },
      data,
      setLoading,
      setError,
      // setPagination has a slightly different signature in this file's state type,
      // coerce it to any to satisfy the TableEvents constructor
      setPagination: setPagination as any,
      setData,
      request_data: informeService.getAll.bind(informeService),
    });

    tableService.current.loadData(
      pagination.page,
      pagination.limit
    );

  }, []);

  /**
   *  Render 
   */
  return (
    <div className="space-y-6">
      <TableComponent
        data={data}
        columns={columns}
        pagination={pagination}
        onPageChange={tableService.current?.cambiarPagina.bind(tableService.current)}
        onLimitChange={tableService.current?.cambiarLimite.bind(tableService.current)}
        itemsPerPageOptions={[5, 10, 20, 50, 100]}
        searchable={true}
        searchPlaceholder="Buscar por asegurado, CC, póliza..."
        onSearch={async (e) => {
          await tableService.current?.buscar(e, informeService.search.bind(informeService));
        }}
        selectable={true}
        actions={actions}
        rowActions={rowActions}
        title="Gestión de Informes"
        subtitle="Administra y consulta todos los informes del sistema"
        loading={loading}
        error={error || undefined}
        emptyMessage="No hay informes disponibles"
        emptyIcon={<FileText className="h-12 w-12 text-muted-foreground" />}
        enableLocalSort={false}
        className="w-full"
      />
    </div>
  );

};

export default InformacionPage;
