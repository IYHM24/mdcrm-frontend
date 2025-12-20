import { Card } from '@/components/common/Card';

export const Dashboard = () => {
  const stats = [
    { title: 'Total Clientes', value: '1,234', change: '+12%' },
    { title: 'Leads Activos', value: '456', change: '+8%' },
    { title: 'Tareas Pendientes', value: '23', change: '-5%' },
    { title: 'Ventas del Mes', value: '$45,678', change: '+15%' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600 mt-1">Resumen general de tu CRM</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">{stat.title}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className={`text-sm ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change} vs mes anterior
              </p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Actividad Reciente">
          <p className="text-gray-600">Sin actividad reciente</p>
        </Card>

        <Card title="Próximas Tareas">
          <p className="text-gray-600">No hay tareas pendientes</p>
        </Card>
      </div>
    </div>
  );
};
