import localFont from "next/font/local";
import { Jost } from "next/font/google";
import "./globals.css";

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"], // Specify weights as needed
});

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "PDF Compressor - Reduce PDF File Size Online for Free - PDF CAT",
  description: "Compress PDF files easily and quickly. Reduce file size by up to 90% while maintaining quality. No installation required – compress your PDFs securely online.",
  
  // Meta Tags for Search Engines
  keywords: "PDF compressor, reduce PDF size, compress PDF online, free PDF compression, online PDF tool, without store online",
  author: "PDF CAT",
  robots: "index, follow",

 

  // Favicons and Theme Color
  icons: {
    icon: "/favicon.ico", // Replace with the path to your favicon
    apple: "/apple-touch-icon.png", // Optional for Apple devices
  },
  themeColor: "#0078D7", // Replace with your app's theme color

  // Additional Metadata
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  charset: "utf-8",
  canonical: "https://yourwebsite.com", // Canonical URL for the app
};

// app/layout.js
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={jost.variable}>
      <body suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}