'use client'

import { useRouter } from 'next/navigation'

type User = {
  id: string
  name: string
  email: string
  jobTitle: string
  role: string
  isActive: boolean
}

type Props = {
  users: User[]
}

export function UserList({ users }: Props) {
  const router = useRouter()

  async function toggleStatus(user: User) {
    const action = user.isActive ? 'DESATIVAR' : 'REATIVAR'
    if (!confirm(`Tem certeza que deseja ${action} o acesso de ${user.name}?`)) return

    await fetch(`/api/usuarios/${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !user.isActive })
    })
    router.refresh()
  }

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', border: '1px solid #e5e7eb' }}>
      <thead>
        <tr style={{ backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>
          <th align="left" style={{ padding: 12 }}>Nome & E-mail</th>
          <th align="left" style={{ padding: 12 }}>Função / Acesso</th>
          <th align="left" style={{ padding: 12 }}>Status</th>
          <th align="left" style={{ padding: 12 }}>Ações</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.id} style={{ borderBottom: '1px solid #e5e7eb', opacity: user.isActive ? 1 : 0.6 }}>
            <td style={{ padding: 12 }}>
              <strong>{user.name}</strong><br/>
              <span style={{ fontSize: 12, color: '#666' }}>{user.email}</span>
            </td>
            <td style={{ padding: 12 }}>
              {user.jobTitle}<br/>
              <span style={{ fontSize: 11, backgroundColor: '#e5e7eb', padding: '2px 6px', borderRadius: 4 }}>
                {user.role.toUpperCase()}
              </span>
            </td>
            <td style={{ padding: 12 }}>
              <span style={{ 
                fontSize: 12, fontWeight: 'bold', padding: '4px 8px', borderRadius: 12,
                backgroundColor: user.isActive ? '#d1fae5' : '#fee2e2',
                color: user.isActive ? '#065f46' : '#991b1b'
              }}>
                {user.isActive ? 'Ativo' : 'Desativado'}
              </span>
            </td>
            <td style={{ padding: 12, display: 'flex', gap: 8 }}>
              <button onClick={() => router.push(`/usuarios?edit=${user.id}`)} style={{ cursor: 'pointer', padding: '4px 8px' }}>
                Editar
              </button>
              <button onClick={() => toggleStatus(user)} style={{ cursor: 'pointer', padding: '4px 8px' }}>
                {user.isActive ? 'Desativar' : 'Reativar'}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}