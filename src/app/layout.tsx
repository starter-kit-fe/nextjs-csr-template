import BuildInfo from '@/components/build-info';
import Providers from '@/components/providers';
import Seo from '@/components/seo';
import { Metadata } from 'next';
import localFont from 'next/font/local';
import Script from 'next/script';

import pkg from '../../package.json';
import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});
export const metadata: Metadata = {
  title: pkg.seo.title,
  description: pkg.seo.description,
  keywords: pkg.seo.keywords,
  openGraph: {
    title: pkg.seo.og.title,
    description: pkg.seo.og.description,
    url: pkg.seo.og.url,
    type: pkg.seo.og.type as 'website',
    images: pkg.seo.og.image,
  },
  twitter: {
    card: pkg.seo.twitter.card as 'summary_large_image',
    title: pkg.seo.twitter.title,
    description: pkg.seo.twitter.description,
    images: pkg.seo.twitter.image,
  },
  // 建议与 og.url 同步，利于生成绝对 URL
  metadataBase: new URL(pkg.seo.og.url),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link
          rel="icon"
          href="/favicon-32x32.png"
          type="image/png"
          sizes="32x32"
        />
        <link
          rel="icon"
          href="/favicon-16x16.png"
          type="image/png"
          sizes="16x16"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta
          name="theme-color"
          content="#FFFFFF"
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="#000000"
          media="(prefers-color-scheme: dark)"
        />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <meta name="renderer" content="webkit" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        {/* <!--[if lt IE 11]><script>window.location.href='/ie.html';</script><![endif]--> */}
        <title>{pkg.name}</title>
        <meta name="description" content={pkg.description} />
        {pkg.seo.jsonLd && (
          <Script
            id="onefile-jsonld"
            type="application/ld+json"
            // 保持纯字符串注入，符合 Google / Next.js 推荐
            dangerouslySetInnerHTML={{ __html: JSON.stringify(pkg.seo.jsonLd) }}
            strategy="beforeInteractive"
          />
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Seo />
        <Providers> {children}</Providers>
        <BuildInfo />
      </body>
    </html>
  );
}
