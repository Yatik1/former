import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/utils/theme-provider";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";
import DesignerContextProvider from "@/context/DesignerContext";
import NextTopLoader from "nextjs-toploader"


export const metadata: Metadata = {
  title: "Former",
  description: "Form builder application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <NextTopLoader />
        <DesignerContextProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ClerkProvider dynamic>
              {/* <Navbar /> */}
              {children}
              <Toaster />
            </ClerkProvider>

          </ThemeProvider>
        </DesignerContextProvider>
      </body>
    </html>
  );
}