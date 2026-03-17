import { NextIntlClientProvider } from "next-intl";
import { Inter } from "next/font/google";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";



const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <html lang={locale}>
      <body className={`${inter.variable} font-sans antialiased`}>
        <NextIntlClientProvider locale={locale}>
          <div className="app-shell min-h-screen flex flex-col bg-slate-50 text-slate-900 transition-colors duration-300">

            {/* Navbar */}
            <Navbar />

            {/* Page Content */}
            <main className="flex-1">
              {children}
            </main>

            {/* Footer */}
            <Footer />

          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}