import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Source_Serif_4 } from "next/font/google";
import about from "@/content/about.json";
import { BOOTED_KEY } from "@/lib/boot";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hassandawy.com"),
  title: { default: about.name, template: `%s · ${about.name}` },
  description: about.tagline,
  openGraph: { type: "website", siteName: about.name, title: about.name, description: about.tagline, url: "/" },
  twitter: { card: "summary_large_image" },
};

const BOOT_SCRIPT = `try{if(localStorage.getItem("${BOOTED_KEY}"))document.documentElement.dataset.booted=""}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${sourceSerif.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Runs before the first paint so a repeat visitor never sees the boot screen flash. */}
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
      </head>
      <body className="h-full">{children}</body>
    </html>
  );
}
