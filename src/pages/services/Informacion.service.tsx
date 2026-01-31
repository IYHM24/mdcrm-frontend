import type { PaginationInfo, TableAction } from "@/components/common/TableComponent";
import type { InformeModel } from "@/types";
import { Plus, Trash2, Edit, Download, Eye, Copy } from "lucide-react";
import informeService from "@/services/informe.service";
import type { useRefDefinition, useStateDefinition } from '@/types/Definitions';
import type TableService from "./table.service";


type InformacionEventsProps = {
    loading: boolean;
    pagination: PaginationInfo;
    tableService: useRefDefinition<TableService<InformeModel> | null>;
    setLoading: useStateDefinition<boolean>;
    setPagination: useStateDefinition<PaginationInfo>;
}

/**
 * Servicio de eventos para la página de Información de Eventos
 */
class InformacionEvents {

    loading: boolean;
    pagination: PaginationInfo;
    tableService: useRefDefinition<TableService<InformeModel> | null>;
    setLoading: useStateDefinition<boolean>;
    setPagination: useStateDefinition<PaginationInfo>;

    constructor(props: InformacionEventsProps) {
        this.loading = props.loading;
        this.setLoading = props.setLoading;
        this.tableService = props.tableService;
        this.pagination = props.pagination;
        this.setPagination = props.setPagination;
    }

    // Acciones en lote
    public actions: TableAction<InformeModel>[] = [
        {
            label: 'Nuevo Informe',
            icon: <Plus className="h-4 w-4" />,
            variant: 'default',
            onClick: () => {
                console.log('Crear nuevo informe');
                // TODO: Implementar modal de creación
            },
        }, // Nuevo Informe
        /*  {
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
         }, // Editar
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
         }, // Eliminar
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
         }, // Exportar */
    ];

    /**
     * Convertir datos a formato CSV
     * @param data 
     * @returns 
     */
    public convertToCSV = (data: InformeModel[]): string => {
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
    public downloadCSV = (csv: string, filename: string) => {
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
    public rowActions = (row: InformeModel): TableAction<InformeModel>[] => [
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
                    if (this.tableService.current && this.tableService.current.duplicateRow !== undefined) {
                        await this.tableService.current.duplicateRow(row, (payload: any) => informeService.create(payload));
                        alert('Informe duplicado exitosamente');
                        return;
                    }

                    this.setLoading(true);
                    // Crear una copia del informe sin id, createdAt, updatedAt
                    const { id, createdAt, updatedAt, createdByUser, createdByUserId, ...informeCopy } = row;
                    await informeService.create(informeCopy as Omit<InformeModel, 'id' | 'createdAt' | 'updatedAt'>);
                    await this.tableService.current?.loadData(this.pagination.page, this.pagination.limit);
                    alert('Informe duplicado exitosamente');
                } catch (err) {
                    alert('Error al duplicar informe');
                    console.error(err);
                } finally {
                    this.setLoading(false);
                }
            },
        },
        {
            label: 'Eliminar',
            icon: <Trash2 className="h-4 w-4" />,
            onClick: async () => {
                if (confirm(`¿Estás seguro de eliminar el informe #${row.id}?`)) {
                    try {
                        this.setLoading(true);
                        await informeService.delete(row.id);
                        await this.tableService.current?.loadData(this.pagination.page, this.pagination.limit);
                        alert('Informe eliminado exitosamente');
                    } catch (err) {
                        alert('Error al eliminar informe');
                        console.error(err);
                    } finally {
                        this.setLoading(false);
                    }
                }
            },
            className: 'text-destructive focus:text-destructive',
        },
    ];

}

export default InformacionEvents;