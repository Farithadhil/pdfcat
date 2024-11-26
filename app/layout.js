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


// export const viewport = {
//   themeColor: 'your-color',
//   viewport: 'your-viewport-settings'
// }

export const metadata = {
  title: "PDF Watermark Creator - Add Watermarks to PDFs Online - PDF CAT",
  description: "Easily add watermarks to your PDF files online. Customize text or image watermarks for your documents. No installation required – secure and free.",
  keywords: "PDF watermark creator, add watermark to PDF, watermark PDF online, free PDF watermark tool, pdf watermark adder, customize watermark PDF, online PDF watermark service",
  author: "PDF CAT",
  robots: "index, follow",
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