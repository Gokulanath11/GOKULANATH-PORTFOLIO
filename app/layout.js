import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://gokulanath-portfolio.vercel.app"),
  title: "Gokulanath K — Software Developer",
  description:
    "Software developer specializing in computer vision and human-computer interaction — real-time face recognition, gesture control, and assistive tech.",
  keywords: [
    "Gokulanath K",
    "Software Developer",
    "Computer Vision Developer",
    "OpenCV",
    "MediaPipe",
    "Python Developer",
    "Coimbatore",
  ],
  alternates: {
    canonical: "https://gokulanath-portfolio.vercel.app",
  },
  openGraph: {
    title: "Gokulanath K — Software Developer",
    description:
      "Computer vision & assistive-tech projects — real-time face recognition, gesture control, and more.",
    url: "https://gokulanath-portfolio.vercel.app",
    siteName: "Gokulanath K Portfolio",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
