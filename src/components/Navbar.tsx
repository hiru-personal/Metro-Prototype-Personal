"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useState } from "react";

export function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const navLinks = [
    { href: `/${locale}`, label: t("home"), id: "home" },
    { href: `/${locale}/route-map`, label: t("routeMap"), id: "route-map" },
    {
      href: `/${locale}/journey-planner`,
      label: t("journeyPlanner"),
      id: "journey-planner",
    },
    { href: `/${locale}/bus-viewer`, label: t("busViewer"), id: "bus-viewer" },
  ];

  const languages = [
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "si", label: "සිංහල", flag: "🇱🇰" },
    { code: "ta", label: "தமிழ்", flag: "🇱🇰" },
  ];

  function isActive(href: string) {
    if (href === `/${locale}`) return pathname === `/${locale}`;
    return pathname.startsWith(href);
  }

  function switchLocale(newLocale: string) {
    const pathWithoutLocale = pathname.replace(`/${locale}`, "") || "/";
    router.push(`/${newLocale}${pathWithoutLocale}`);
    setLangOpen(false);
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2 group" id="nav-logo">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 group-hover:shadow-cyan-500/40 transition-shadow">
              SL
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Metro
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                id={`nav-${link.id}`}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? "bg-cyan-500/15 text-cyan-400 shadow-inner"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Language Switcher + Mobile Toggle */}
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <div className="relative">
              <button
                id="lang-switcher"
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all border border-white/10"
              >
                <span className="text-base">
                  {languages.find((l) => l.code === locale)?.flag}
                </span>
                <span className="hidden sm:inline">
                  {languages.find((l) => l.code === locale)?.label}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform ${langOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {langOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-xl border border-white/10 bg-slate-900/95 backdrop-blur-xl shadow-2xl overflow-hidden animate-fade-in">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      id={`lang-${lang.code}`}
                      onClick={() => switchLocale(lang.code)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                        locale === lang.code
                          ? "bg-cyan-500/15 text-cyan-400"
                          : "text-slate-300 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span className="font-medium">{lang.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-white/10 animate-fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.href)
                    ? "bg-cyan-500/15 text-cyan-400"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
