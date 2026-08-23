import Script from "next/script";

// Meta Pixel — solo se inyecta si NEXT_PUBLIC_META_PIXEL_ID está definido.
// Sin ID configurado, este componente no renderiza nada (queda preparado y
// documentado, sin inventar ningún ID).
//
// El evento estándar "Lead" NO se dispara acá: se emite desde LeadForm
// únicamente después de que Google Sheets confirma que el registro se guardó
// (ver components/LeadForm.jsx). Acá solo cargamos la base + PageView.
export default function MetaPixel() {
  const id = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  if (!id) return null;

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${id}');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${id}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
