"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useEffect, useRef, useState } from "react";

export function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("metro-theme") === "dark";
  });
  const langMenuRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { href: `/${locale}`, label: t("home"), id: "home" },
    {
      href: `/${locale}/journey-planner`,
      label: t("journeyPlanner"),
      id: "journey-planner",
    },
    { href: `/${locale}/route-map`, label: t("routeMap"), id: "route-map" },
    { href: `/${locale}/bus-viewer`, label: t("busViewer"), id: "bus-viewer" },
    { href: `/${locale}/live-tracking`, label: t("liveTracking"), id: "live-tracking" },
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

  useEffect(() => {
    document.documentElement.classList.toggle("theme-dark", darkMode);
    localStorage.setItem("metro-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    function closeDropdownOnOutsideClick(event: MouseEvent) {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setLangOpen(false);
      }
    }

    document.addEventListener("mousedown", closeDropdownOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeDropdownOnOutsideClick);
  }, []);

  function toggleTheme() {
    setDarkMode((prev) => !prev);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur app-header">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2 group" id="nav-logo">
            <span className="text-2xl">🚇</span>
            <span className="text-lg font-bold text-blue-700 group-hover:text-orange-500 transition-colors">
              Sri Lanka Metro
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                id={`nav-${link.id}`}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-700 hover:text-blue-700 hover:bg-slate-100"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Language Switcher + Mobile Toggle */}
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <div ref={langMenuRef} className="relative">
              <button
                id="lang-switcher"
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:text-blue-700 hover:bg-slate-100 transition-all border border-slate-200"
              >
                <span className="text-base">
                  {languages.find((l) => l.code === locale)?.flag}
                </span>
                <span className="hidden sm:inline">{locale.toUpperCase()}</span>
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
                <div className="absolute right-0 mt-2 w-44 rounded-xl border border-slate-200 bg-white shadow-xl overflow-hidden animate-fade-in">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      id={`lang-${lang.code}`}
                      onClick={() => switchLocale(lang.code)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                        locale === lang.code
                          ? "bg-blue-600 text-white"
                          : "text-slate-700 hover:bg-slate-100 hover:text-blue-700"
                      }`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span className="font-medium">{lang.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              id="theme-toggle"
              onClick={toggleTheme}
              className="rounded-md border border-slate-200 px-2.5 py-2 text-lg leading-none hover:bg-slate-100"
              aria-label="Toggle theme"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-md border border-slate-200 text-slate-700 hover:text-blue-700 hover:bg-slate-100"
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
          <div className="md:hidden py-4 border-t border-slate-200 animate-fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.href)
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-700 hover:text-blue-700 hover:bg-slate-100"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
