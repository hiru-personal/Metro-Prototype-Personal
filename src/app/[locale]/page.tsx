import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import Link from "next/link";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HomeContent locale={locale} />;
}

function HomeContent({ locale }: { locale: string }) {
  const t = useTranslations("home");

  const features = [
    { key: "journeyPlanner", icon: "📍", href: `/${locale}/journey-planner` },
    { key: "routeMap", icon: "🗺️", href: `/${locale}/route-map` },
    { key: "busViewer", icon: "🎥", href: `/${locale}/bus-viewer` },
    { key: "liveTracking", icon: "🔴", href: `/${locale}/live-tracking` },
    { key: "fareCalc", icon: "💰", href: `/${locale}/journey-planner` },
    { key: "multiLang", icon: "🌐", href: null },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <section className="mb-10 rounded-2xl bg-gradient-to-br from-blue-700 to-blue-900 text-white px-6 py-14 sm:px-10 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">{t("title")}</h1>
        <p className="text-base sm:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">{t("description")}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={`/${locale}/journey-planner`}
            id="hero-plan-journey"
            className="rounded-lg bg-white px-6 py-3 text-blue-800 font-semibold hover:bg-slate-100"
          >
            {t("planJourney")}
          </Link>
          <Link
            href={`/${locale}/route-map`}
            id="hero-explore-routes"
            className="rounded-lg border border-blue-200/70 px-6 py-3 font-semibold hover:bg-white/10"
          >
            {t("exploreRoutes")}
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((feature) => {
          const card = (
            <div
              key={feature.key}
              className="group relative p-6 rounded-xl border-2 border-slate-200 bg-white hover:border-blue-600 hover:shadow-lg transition-all duration-300"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">{t(`features.${feature.key}`)}</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">{t(`features.${feature.key}Desc`)}</p>
              <span className="inline-flex items-center rounded-md bg-blue-700 px-3 py-1.5 text-xs font-semibold text-white">
                Open
              </span>
            </div>
          );

          return feature.href ? (
            <Link key={feature.key} href={feature.href}>
              {card}
            </Link>
          ) : (
            card
          );
        })}
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Featured Routes</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Colombo Central to Negombo</h3>
            <p className="text-slate-600 mb-3">Fast and direct route to the coastal city.</p>
            <div className="rounded-lg bg-slate-100 p-4 text-sm text-slate-700">
              <p>Distance: 25 km</p>
              <p>Stations: 12</p>
              <p>Est. Time: 35 mins</p>
              <p>Base Fare: LKR 125</p>
            </div>
            <Link href={`/${locale}/journey-planner`} className="mt-4 inline-flex rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800">
              View Details
            </Link>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Fort Station to Airport Express</h3>
            <p className="text-slate-600 mb-3">Quick access to Bandaranaike International Airport.</p>
            <div className="rounded-lg bg-slate-100 p-4 text-sm text-slate-700">
              <p>Distance: 34 km</p>
              <p>Stations: 15</p>
              <p>Est. Time: 45 mins</p>
              <p>Base Fare: LKR 175</p>
            </div>
            <Link href={`/${locale}/journey-planner`} className="mt-4 inline-flex rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800">
              View Details
            </Link>
          </article>
        </div>
      </section>
    </div>
  );
}
