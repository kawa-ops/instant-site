'use client'
import Script from 'next/script'
import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { FB_PIXEL_ID, captureUtms } from '@/lib/tracking'

// Meta pixel bootstrap + SPA PageView tracking.
// The site is an App Router SPA: without the pathname effect, only the
// first page of a session would be counted.

export default function MetaPixel() {
  const pathname = usePathname()
  const loaded = useRef(false)

  // First mount: persist UTM/fbclid so the lead keeps its ad provenance
  useEffect(() => {
    captureUtms()
  }, [])

  // PageView on every route change (initial PageView fires in the snippet)
  useEffect(() => {
    if (!loaded.current) { loaded.current = true; return }
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'PageView')
    }
  }, [pathname])

  if (!FB_PIXEL_ID) return null

  return (
    <>
      <Script id="fb-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${FB_PIXEL_ID}');
          fbq('track', 'PageView');
        `}
      </Script>
      {/* dangerouslySetInnerHTML keeps the fallback inert when JS is enabled —
          React-rendered <noscript> children would otherwise load anyway and
          double-count every PageView */}
      <noscript
        dangerouslySetInnerHTML={{
          __html: `<img height="1" width="1" style="display:none" alt="" src="https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1" />`,
        }}
      />
    </>
  )
}
