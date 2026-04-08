type UserRow = {
  id: string
  name: string
  email: string
  role: string
  jobTitle: string
  isActive: boolean
  createdAt: Date
}

type Props = {
  users: UserRow[]
}

export function UserTable({ users }: Props) {
  return (
    <div>
      <h1>Usuários</h1>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th align="left">Nome</th>
            <th align="left">E-mail</th>
            <th align="left">Cargo</th>
            <th align="left">Perfil</th>
            <th align="left">Status</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.jobTitle}</td>
              <td>{user.role}</td>
              <td>{user.isActive ? 'Ativo' : 'Inativo'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}