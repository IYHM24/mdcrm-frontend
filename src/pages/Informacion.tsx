import { useState, useEffect, useRef } from 'react';
import { TableComponent, type PaginationInfo } from '@/components/common';
import informeService from '@/services/informe.service';
import type { InformeModel } from '@/types';
import { FileText } from 'lucide-react';
import { columnsInforme } from '@/utils/columnasTablas/informe.columnas';

import TableService from './services/table.service';
import InformacionEvents from './services/Informacion.service.tsx';

const InformacionPage = () => {

  //Instancias
  const tableService = useRef<TableService<InformeModel> | null>(null);
  const informacionEvents = useRef<InformacionEvents | null>(null);

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

  /**
   * Carga inicial de datos
   */
  useEffect(() => {
    // Inicializar TableService
    tableService.current = new TableService<InformeModel>({
      loading,
      error,
      pagination,
      data,
      setLoading,
      setError,
      setPagination: setPagination,
      setData,
      request_data: informeService.getAll.bind(informeService),
    });
    // Inicializar InformacionEvents
    informacionEvents.current = new InformacionEvents({
      loading,
      pagination,
      tableService,
      setLoading,
      setPagination,
    });
    // Cargar datos iniciales
    tableService.current.loadData(
      pagination.page,
      pagination.limit
    );
    //Cleaners
    return () => {
      tableService.current = null;
    };
  }, []);

  /**
   *  Render 
   */
  return (
    <div className="space-y-6">
      <TableComponent
        data={data}
        columns={columnsInforme}
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
        actions={informacionEvents.current?.actions}
        rowActions={informacionEvents.current?.rowActions}
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
