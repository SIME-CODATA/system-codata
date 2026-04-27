import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { SESSION_COOKIE } from '@/core/security/cookie'
import { readSessionToken } from '@/core/security/session'
import { Sidebar } from '@/src/components/layout/sidebar'

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const sessionValue = cookieStore.get(SESSION_COOKIE)?.value
  const session = readSessionToken(sessionValue)
  if (!session) {
    redirect('/login')
  }

  return (
    <div className="flex h-screen w-screen bg-background font-sans overflow-hidden">
      <Sidebar userRole={session.role} />
      <main className="flex-1 h-full overflow-y-auto bg-background p-6 md:p-10">
        <div className="max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>

    </div>
  )
}