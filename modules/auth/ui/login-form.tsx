'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error ?? 'Falha no login.')
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch {
      setError('Erro inesperado ao tentar entrar.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex min-h-screen w-full items-center flex-col justify-center flex-nowrap'>
        <form onSubmit={onSubmit} className="max-w-sm mx-auto flex flex-col gap-6 font-sans">
        <div className="group relative">
            <label htmlFor="email" className="block mb-1 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"> E-mail
            </label>
            <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none" >
                <svg className="w-5 h-5 text-zinc-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" ></path>
                </svg>
            </div>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" id="email" className="block w-full pl-10 p-3.5 bg-white text-zinc-900 font-medium text-sm border-2 border-zinc-900 focus:outline-none focus:ring-0 focus:border-blue-600 dark:bg-zinc-900 dark:text-white dark:border-zinc-100 dark:focus:border-yellow-400 transition-colors duration-200 ease-in-out" placeholder="name@example.com"
            />
            <div
                className="absolute top-0 left-0 w-full h-full bg-zinc-200 -z-10 translate-x-1.5 translate-y-1.5 border-2 border-transparent dark:bg-zinc-700 transition-transform group-focus-within:translate-x-2.5 group-focus-within:translate-y-2.5"
            ></div>
            </div>
        </div>

        <div className="group relative">
            <label htmlFor="password" className="block mb-1 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400" >Senha</label>
            <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-5 h-5 text-zinc-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
            </div>
            <input type="password" id="password" className="block w-full pl-10 p-3.5 bg-white text-zinc-900 font-medium text-sm border-2 border-zinc-900 focus:outline-none focus:ring-0 focus:border-blue-600 dark:bg-zinc-900 dark:text-white dark:border-zinc-100 dark:focus:border-yellow-400 transition-colors duration-200 ease-in-out"
                placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)}
            />
            <div className="absolute top-0 left-0 w-full h-full bg-zinc-200 -z-10 translate-x-1.5 translate-y-1.5 border-2 border-transparent dark:bg-zinc-700 transition-transform group-focus-within:translate-x-2.5 group-focus-within:translate-y-2.5" ></div>
            </div>
        </div>
        {error ? (
            <p style={{ color: 'crimson' }}>{error}</p>
        ) : null}
        <button type="submit" disabled={loading} className="relative inline-block w-full group mt-2">
            <span className="absolute top-0 left-0 w-full h-full transition-all duration-200 ease-out transform translate-x-1.5 translate-y-1.5 bg-blue-600 dark:bg-yellow-400 border-2 border-zinc-900 dark:border-white group-hover:translate-x-0 group-hover:translate-y-0" ></span>
            <span className="relative block w-full px-5 py-3.5 text-sm font-bold tracking-widest uppercase border-2 border-zinc-900 bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white dark:border-white" >{loading ? 'Entrando...' : 'Entrar'} </span>
        </button>
    </form>
    </div>

  )
}