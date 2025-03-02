"use client"

import { ThemeProvider } from "@/lib/theme-provider";
import "./globals.css";


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        >
        {children}

        </ThemeProvider>
      </body>
    </html>
  )
}
