import type { Metadata } from "next";
import { Header, Footer } from "@/components/chrome";
import { site } from "@/lib/content";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | AI-Era Local Visibility for Home Services`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: site.name,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.name,
    url: site.url,
    email: site.email,
    description: site.description,
    areaServed: "US",
    slogan: site.tagline,
  };

  return (
    <html lang="en">
      <body className="min-h-screen">
        <a href="#content" className="sr-only focus:not-sr-only">
          Skip to content
        </a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Header />
        <main id="content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
