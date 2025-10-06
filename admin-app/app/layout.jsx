import "./globals.css";
import Script from "next/script";
import ReduxProvider from "../components/ReduxProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
        <link
          rel="stylesheet"
          href="https://cdn.datatables.net/1.13.6/css/jquery.dataTables.min.css"
        />
        {/* Load theme CSS from the copied template under Photographer/... */}
        <link
          rel="stylesheet"
          href="/theme/admin/assets/css/bootstrap.min.css"
        />
        <link
          rel="stylesheet"
          href="/theme/admin/assets/plugins/fontawesome/css/all.min.css"
        />
        <link
          rel="stylesheet"
          href="/theme/admin/assets/css/feathericon.min.css"
        />
        <link
          rel="stylesheet"
          href="/theme/admin/assets/plugins/morris/morris.css"
        />
        <link rel="stylesheet" href="/theme/admin/assets/css/custom.css" />

        <link
          rel="shortcut icon"
          href="/theme/admin/assets/img/favicon.png"
          type="image/x-icon"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/theme/admin/assets/img/apple-touch-icon.png"
        />

        <link
          rel="stylesheet"
          href="/theme/admin/assets/css/bootstrap.min.css"
        />
        <link
          rel="stylesheet"
          href="/theme/admin/assets/plugins/fontawesome/css/fontawesome.min.css"
        />
        <link
          rel="stylesheet"
          href="/theme/admin/assets/plugins/fontawesome/css/all.min.css"
        />
        <link
          rel="stylesheet"
          href="/theme/admin/assets/plugins/datatables/datatables.min.css"
        />

        {/* <link rel="stylesheet" href="/theme/admin/assets/css/iconsax.css" />
        <link
          rel="stylesheet"
          href="/theme/admin/assets/plugins/daterangepicker/daterangepicker.css"
        /> */}
        {/* <link
          rel="stylesheet"
          href="/theme/admin/assets/plugins/select2/css/select2.min.css"
        />
        <link rel="stylesheet" href="/theme/admin/assets/css/feather.css" /> */}
        <link rel="stylesheet" href="/theme/admin/assets/css/custom.css" />
      </head>
      <body>
        <ReduxProvider>{children}</ReduxProvider>

        {/* Template scripts (jQuery, Bootstrap, plugins, script.js) */}
        <Script
          src="/theme/assets/js/jquery-3.7.1.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="/theme/assets/js/theme-script.js"
          strategy="beforeInteractive"
        />

        <Script
          src="/theme/admin/assets/js/bootstrap.bundle.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="/theme/admin/assets/plugins/slimscroll/jquery.slimscroll.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js"
          strategy="beforeInteractive"
        />
        {/* <Script
          src="/theme/admin/assets/plugins/datatables/datatables.min.js"
          strategy="beforeInteractive"
        /> */}

        <Script
          src="/theme/admin/assets/plugins/raphael/raphael.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="/theme/admin/assets/plugins/morris/morris.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="/theme/admin/assets/js/chart.morris.js"
          strategy="beforeInteractive"
        />
        <Script
          src="/theme/admin/assets/js/script.js"
          strategy="beforeInteractive"
        />
        <Script
          src="/theme/admin/assets/js/moment.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="/theme/admin/assets/js/script.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
