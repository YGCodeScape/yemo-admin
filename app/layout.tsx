import type { Metadata } from 'next'
import './globals.css'


export const metadata: Metadata = {
  title: 'Yemo Admin · Café Management',
  description: 'Run your café effortlessly with Yemo Admin.',
  icons: { icon: '/icons/yemo-logo-bg.png' },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icons/yemo-logo-bg.png" type="image/png" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lily+Script+One&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" 
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
