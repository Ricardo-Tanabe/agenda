'use client';

export function ErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
      <h2 className="text-2xl font-bold mb-4">Erro inesperado</h2>
      <p className="text-gray-500 mb-4">{error.message}</p>
      <button className="btn-primary" onClick={() => reset()}>
        Tentar novamente
      </button>
    </div>
  );
}