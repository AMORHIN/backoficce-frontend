// import { ClerkProvider } from "@clerk/nextjs";
import { Noto_Sans_Display } from 'next/font/google';
import { type Metadata } from 'next';
import { AuthProvider } from "@/components/AuthContext";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import './globals.css';
const noto = Noto_Sans_Display({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Dashboard companies',
  description: 'back office sharf',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={noto.className + " h-screen"}>
          <AuthProvider>
            <ThemeProvider attribute="class" enableSystem disableTransitionOnChange>
              {children}
              <Toaster />
            </ThemeProvider>
          </AuthProvider>
        </body>
      </html>
    // </ClerkProvider>
  );
}