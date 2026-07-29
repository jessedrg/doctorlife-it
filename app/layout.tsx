import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import type { Metadata, Viewport } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Geist_Mono, Hanken_Grotesk, Instrument_Serif, Sora } from 'next/font/google'
import { PublicWhatsAppBubble } from '@/components/public-whatsapp-bubble'
import { JsonLd } from '@/components/seo/json-ld'
import { organizationSchema, websiteSchema } from '@/lib/seo'
import { LOCALE, HTML_LANG } from '@/i18n/config'
import './globals.css'

const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-hanken',
  display: 'swap',
})

const sora = Sora({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-sora',
  display: 'swap',
})

const instrument = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument',
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://doctorlife.io'),
  title: 'DoctorLife — Il tuo corpo, finalmente compreso',
  description:
    'Cura del peso e ormonale guidata da medici, progettata intorno al tuo corpo — non a un protocollo unico.',
  generator: 'v0.app',
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const messages = await getMessages()
  return (
    <html
      lang={HTML_LANG[LOCALE]}
      className={`${hanken.variable} ${sora.variable} ${instrument.variable} ${geistMono.variable} bg-paper`}
    >
      <body className="bg-paper text-ink font-sans antialiased">
        <NextIntlClientProvider messages={messages} locale={LOCALE}>
        {/* Preconexión a orígenes de terceros: acelera el arranque de
            scripts diferidos y mejora LCP/INP. React 19 los eleva al <head>. */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://widget.trustpilot.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://invitejs.trustpilot.com" />
        {/* Entidad de marca + buscador de sitelinks (global) */}
        <JsonLd data={[organizationSchema, websiteSchema]} />
        {/* Google Ads (gtag.js) — conversiones */}
        <Script
          id="gtag-src"
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=AW-18265536787"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-18265536787');
          `}
        </Script>
        {/* Trustpilot — invitación / registro de reseñas (global) */}
        <Script id="trustpilot-invite" strategy="afterInteractive">
          {`
            (function(w,d,s,r,n){w.TrustpilotObject=n;w[n]=w[n]||function(){(w[n].q=w[n].q||[]).push(arguments)};
              a=d.createElement(s);a.async=1;a.src=r;a.type='text/java'+s;f=d.getElementsByTagName(s)[0];
              f.parentNode.insertBefore(a,f)})(window,document,'script','https://invitejs.trustpilot.com/tp.min.js','tp');
            tp('register', 'wUdA9FYxfifhoMPy');
          `}
        </Script>
        {/* Trustpilot TrustBox — motor de widgets (global: hero, blogs, footer, etc.) */}
        <Script
          id="trustpilot-widget-bootstrap"
          strategy="afterInteractive"
          src="https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"
        />
        {children}
        <PublicWhatsAppBubble />
        {process.env.NODE_ENV === 'production' && <Analytics />}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
