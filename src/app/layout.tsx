import AuthProvider from '@src/context/AuthProvider';
import './globals.css'
import { SessionProvider } from 'next-auth/react';
import { Toaster } from '@src/components/ui/toaster';
import Nav from '@src/components/Nav';
import Footer from '@src/components/Footer';
import Topbar from '@src/components/Topbar';
export const metadata = {
  title: 'My App',
  description: 'Generated by create next app',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
        <AuthProvider>
        <body className="h-screen flex">
        {/* 1) Topbar always on top */}
         <header className="fixed top-0 left-0 right-0 h-16 z-50">
           <Topbar />
         </header>

         {/* 2) Below that, sidebar + content */}
         <div className="flex flex-1 overflow-hidden">
           {/* 3) Nav sits under the Topbar */}
           <nav className="pt-16"> 
             <Nav />
           </nav>

           {/* 4) Main scrollable content also shifted down */}
           <main className="flex-1 overflow-auto pt-16">
             {children}
           </main>
         </div>


          {/* Toaster for notifications */}
          <Toaster />
        </body>
          <Footer />
        </AuthProvider>        
    </html>
  )
}