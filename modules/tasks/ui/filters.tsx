type Option = {
  id: string
  name: string
}

type Props = {
  projects: Option[]
  users: Option[]
  currentStatus?: string
  currentPriority?: string
  currentProjectId?: string
  currentAssigneeId?: string
}

export function TaskFilters({
  projects,
  users,
  currentStatus,
  currentPriority,
  currentProjectId,
  currentAssigneeId,
}: Props) {
  return (
    <form method="GET" style={{ marginBottom: 20, display: 'grid', gap: 12 }}>
      <div>
        <label>Status</label>
        <select
          name="status"
          defaultValue={currentStatus ?? ''}
          style={{ width: '100%' }}
        >
          <option value="">Todos</option>
          <option value="pendente">Pendente</option>
          <option value="emAndamento">Em andamento</option>
          <option value="concluida">Concluída</option>
          <option value="bloqueada">Bloqueada</option>
          <option value="cancelada">Cancelada</option>
        </select>
      </div>

      <div>
        <label>Prioridade</label>
        <select
          name="priority"
          defaultValue={currentPriority ?? ''}
          style={{ width: '100%' }}
        >
          <option value="">Todas</option>
          <option value="baixa">Baixa</option>
          <option value="media">Média</option>
          <option value="alta">Alta</option>
          <option value="urgente">Urgente</option>
        </select>
      </div>

      <div>
        <label>Projeto</label>
        <select
          name="projectId"
          defaultValue={currentProjectId ?? ''}
          style={{ width: '100%' }}
        >
          <option value="">Todos</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Responsável</label>
        <select
          name="assigneeId"
          defaultValue={currentAssigneeId ?? ''}
          style={{ width: '100%' }}
        >
          <option value="">Todos</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit">Filtrar</button>
        <button formAction="/tarefas">
          Limpar
        </button>
      </div>
    </form>
  )
}