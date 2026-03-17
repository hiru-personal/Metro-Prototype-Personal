export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-900 text-slate-100 app-footer">
      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">

        {/* Left section */}
        <div>
          <h2 className="text-xl font-bold mb-3">Sri Lanka Metro</h2>
          <p className="text-sm text-slate-300">
            Modernizing public transportation in Sri Lanka.
            Plan your journey, track trains in real-time,
            and travel with ease across the island.
          </p>

          <div className="flex gap-3 mt-4">
            <span className="border border-slate-600 rounded-full px-3 py-1">FB</span>
            <span className="border border-slate-600 rounded-full px-3 py-1">TW</span>
            <span className="border border-slate-600 rounded-full px-3 py-1">IG</span>
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>Home</li>
            <li>Route Map</li>
            <li>Journey Planner</li>
            <li>Live Tracking</li>
            <li>Virtual 360 Tour</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold mb-3">Contact Us</h3>
          <p className="text-sm">
            No. 1, D.R. Wijewardena Mawatha,
            Colombo 10, Sri Lanka
          </p>
          <p className="mt-2 text-sm">+94 11 234 5678</p>
          <p className="text-sm">info@slmetro.gov.lk</p>
        </div>

      </div>

      <div className="border-t border-slate-700 text-center text-sm py-4 text-slate-300">
        © 2026 Sri Lanka Metro. All rights reserved.
      </div>
    </footer>
  );
}