import type { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen relative py-20 sm:py-12 bg-gradient-to-br from-sky-600 via-sky-400 to-sky-700">
      <div className="absolute inset-0 bg-[url('./assets/background.png')] bg-center opacity-30"></div>
      <div className="relative max-w-md w-full mx-auto px-4">
        {children}
      </div>
    </div>
  )
} 