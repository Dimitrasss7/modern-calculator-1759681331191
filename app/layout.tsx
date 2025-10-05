import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Modern Calculator',
  description: 'A sleek, modern web calculator with dark/light theme support',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        {children}
      </body>
    </html>
  )
}