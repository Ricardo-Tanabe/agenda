export default function Home() {
  return (
    <main className="p-6 max-w-3xl mx-auto rounded-xl shadow-sm
    bg-[#fdfaf6] text-[#222] dark:bg-[#1a1a1a] dark:text-[#f2f2f2] font-serif">
      <h1 className="text-3xl font-bold mb-4">
        Bem-vindo à sua Agenda Digital
      </h1>

      <p className="mb-4 text-lg">
        Este aplicativo foi projetado para ajudá-lo a organizar suas tarefas diárias com facilidade, rapidez e visual intuitivo.
      </p>

      <ul className="list-disc pl-5 space-y-2">
        <li><strong>Responsivo:</strong> Funciona bem em celulares, tablets e desktops.</li>
        <li><strong>Criação rápida de tarefas:</strong> Interface simplificada para novos cadastros.</li>
        <li><strong>Histórico e filtro:</strong> Visualize tarefas concluídas e filtre por datas.</li>
        <li><strong>Notas rápidas:</strong> Adicione e edite anotações diretamente na tarefa.</li>
        <li><strong>Foco em produtividade:</strong> Design baseado em agendas reais.</li>
      </ul>
      <p className="mt-6 text-sm text-gray-600 dark:text-gray-400 italic">
        Esta é uma versão inicial. Futuras melhorias incluirão visual estilo planner, drag-and-drop, temas e integrações.
      </p>
    </main>
  );
}
