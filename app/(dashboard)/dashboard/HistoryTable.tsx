'use client';

type OperacionData = {
  id: string;
  usuarioId: string;
  tipo: string;
  resultado: number;
  parametros: unknown | null;
  createdAt: string;
};

export function HistoryTable({ operaciones }: { operaciones: OperacionData[] }) {
  if (operaciones.length === 0) {
    return (
      <div className="text-center py-8 text-white/60">
        No hay operaciones en el historial
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/10">
            <th className="py-3 px-4 text-white/60">Fecha</th>
            <th className="py-3 px-4 text-white/60">Tipo</th>
            <th className="py-3 px-4 text-white/60">Resultado</th>
            <th className="py-3 px-4 text-white/60">Parámetros</th>
          </tr>
        </thead>
        <tbody>
          {operaciones.map((op: OperacionData) => (
            <tr key={op.id} className="border-b border-white/5 hover:bg-white/5">
              <td className="py-3 px-4 text-white/80">
                {new Date(op.createdAt).toLocaleDateString('es-CO', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </td>
              <td className="py-3 px-4">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    op.tipo === 'bmr'
                      ? 'bg-blue-900/50 text-blue-300'
                      : op.tipo === 'tdee'
                      ? 'bg-purple-900/50 text-purple-300'
                      : op.tipo === 'imc'
                      ? 'bg-green-900/50 text-green-300'
                      : 'bg-orange-900/50 text-orange-300'
                  }`}
                >
                  {op.tipo.toUpperCase()}
                </span>
              </td>
              <td className="py-3 px-4 text-white font-mono">
                {op.resultado.toLocaleString('es-CO', { maximumFractionDigits: 2 })}
              </td>
              <td className="py-3 px-4 text-white/60 text-sm font-mono">
                {op.parametros ? JSON.stringify(op.parametros) : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
