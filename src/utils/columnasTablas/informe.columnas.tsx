import type { ColumnDef } from "@/components/common"
import type { InformeModel } from "@/types"
import { User } from "lucide-react";

// Definición de columnas

/**
 * Columnas para la tabla de informes
 */
export const columnsInforme: ColumnDef<InformeModel>[] = [
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
