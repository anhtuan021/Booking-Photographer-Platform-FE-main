import "./globals.css";
import Header from "../src/components/Header";
import Footer from "../src/components/Footer";
import Script from "next/script";

import { AuthProvider } from "../src/contexts/AuthContext";

export const metadata = {
  title: "Photographer Booking",
  description: "Find and book photographers",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="shortcut icon"
          href="/theme/admin/assets/img/favicon.png"
          type="image/x-icon"
        />
        {/* Theme CSS (served from public/theme) */}
        <link rel="stylesheet" href="/theme/assets/css/bootstrap.min.css" />
        <link
          rel="stylesheet"
          href="/theme/assets/plugins/select2/css/select2.min.css"
        />
        <link rel="stylesheet" href="/theme/assets/css/iconsax.css" />
        <link rel="stylesheet" href="/theme/assets/css/custom.css" />
        <link
          rel="stylesheet"
          href="/theme/admin/assets/plugins/fontawesome/css/all.min.css"
        />
      </head>
      <body>
        <AuthProvider>
          <Header />
          <main className="main-wrapper">{children}</main>
          <Footer />
        </AuthProvider>

        {/* Theme scripts (some depend on jQuery) */}
        <Script
          src="/theme/assets/js/jquery-3.7.1.min.js"
          strategy="beforeInteractive"
        />
        {/* Select2 depends on jQuery and must load before theme scripts that call it */}
        <Script
          src="/theme/assets/plugins/select2/js/select2.min.js"
          strategy="beforeInteractive"
        />
        {/* Moment.js is required by bootstrap-datetimepicker */}
        <Script
          src="/theme/assets/js/moment.min.js"
          strategy="beforeInteractive"
        />
        {/* Datetimepicker plugin (depends on jQuery + moment) */}
        <Script
          src="/theme/assets/js/bootstrap-datetimepicker.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="/theme/assets/js/bootstrap.bundle.min.js"
          strategy="beforeInteractive"
        />
        <Script src="/theme/assets/js/aos.js" strategy="afterInteractive" />
        <Script src="/theme/assets/js/script.js" strategy="afterInteractive" />
        <Script
          src="/theme/assets/js/theme-script.js"
          strategy="afterInteractive"
        />
        <Script src="/theme/assets/js/script.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
