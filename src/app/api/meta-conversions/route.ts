import { NextRequest, NextResponse } from 'next/server'

/* ═══════════════════════════════════════════════════════════════════
   META CONVERSIONS API (CAPI) — Server-Side Event Tracking
   
   Este endpoint envía eventos al servidor de Meta para deduplicación
   con el Pixel del lado del cliente.
   
   ─── CONFIGURACIÓN ───
   ▸ PIXEL_ID:        Tu Pixel ID de Meta (lo encuentras en Events Manager)
   ▸ ACCESS_TOKEN:    Token de acceso de la Conversions API
                      (Generar en: Events Manager → Configuración → Conversions API → Generar token)
   ▸ DATASET_ID:     Mismo que PIXEL_ID para la mayoría de casos
   
   ─── EVENTOS SOPORTADOS ───
   ▸ PageView        — Carga de página
   ▸ ViewContent     — Usuario ve contenido del producto
   ▸ Lead            — Clic en CTA (WhatsApp, Comprar, etc.)
   ▸ InitiateCheckout — (Futuro) Inicio de checkout
   ▸ AddToCart       — (Futuro) Agregar al carrito
   ▸ Purchase        — (Futuro) Compra completada
   
   ─── DEDUPLICACIÓN ───
   Cada evento lleva un event_id único que se usa tanto en el Pixel
   como en CAPI para que Meta no cuente el evento dos veces.
   ═══════════════════════════════════════════════════════════════════ */

// ─── INSTRUCCIONES: Cambia estos valores por los de tu negocio ───
const PIXEL_ID = '1289231602942427'                                    // ← TU PIXEL ID AQUÍ
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN || ''          // ← ACCESS TOKEN DE CAPI (env var recomendado)
const DATASET_ID = '1289231602942427'                                  // ← DATASET ID (normalmente = PIXEL ID)
// ─── FIN CONFIGURACIÓN ─────────────────────────────────────────────

const META_CAPI_URL = `https://graph.facebook.com/v19.0/${PIXEL_ID}/events`

interface MetaEvent {
  event_name: string
  event_time: number
  event_id: string
  event_source_url?: string
  action_source: 'website'
  user_data: {
    em?: string[]      // email hash (SHA-256)
    ph?: string[]      // phone hash (SHA-256)
    fn?: string[]      // first name hash
    ln?: string[]      // last name hash
    ct?: string[]      // city hash
    st?: string[]      // state hash
    zp?: string[]      // zip hash
    country?: string[] // country hash
    external_id?: string[]
    client_ip_address?: string
    client_user_agent?: string
    fbc?: string       // fb click ID
    fbp?: string       // fb browser ID
  }
  custom_data?: {
    currency?: string
    value?: number
    content_name?: string
    content_category?: string
    content_ids?: string[]
    contents?: Array<{ id: string; quantity: number; item_price: number }>
    num_items?: number
  }
}

async function sha256(input: string): Promise<string> {
  if (!input) return ''
  const encoder = new TextEncoder()
  const data = encoder.encode(input.trim().toLowerCase())
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      event_name,
      event_id,
      event_source_url,
      user_data: clientUserData,
      custom_data,
    } = body

    // ─── Validación básica ───
    if (!event_name || !event_id) {
      return NextResponse.json(
        { error: 'event_name y event_id son obligatorios' },
        { status: 400 }
      )
    }

    // ─── Si no hay ACCESS_TOKEN, responder con warning pero no fallar ───
    if (!ACCESS_TOKEN) {
      console.warn(`[CAPI] ⚠️ META_CAPI_ACCESS_TOKEN no configurado. Evento ${event_name} solo se trackeó vía Pixel (client-side).`)
      return NextResponse.json({
        success: false,
        warning: 'META_CAPI_ACCESS_TOKEN no configurado. Configúralo en .env para habilitar CAPI.',
        pixel_only: true,
        event_name,
        event_id,
      })
    }

    // ─── Construir user_data con hashing SHA-256 ───
    const hashedUserData: MetaEvent['user_data'] = {
      client_ip_address: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                         request.headers.get('x-real-ip') || '',
      client_user_agent: request.headers.get('user-agent') || '',
    }

    // Hashear datos del cliente si se proporcionan
    if (clientUserData?.email) hashedUserData.em = [await sha256(clientUserData.email)]
    if (clientUserData?.phone) hashedUserData.ph = [await sha256(clientUserData.phone)]
    if (clientUserData?.firstName) hashedUserData.fn = [await sha256(clientUserData.firstName)]
    if (clientUserData?.lastName) hashedUserData.ln = [await sha256(clientUserData.lastName)]
    if (clientUserData?.city) hashedUserData.ct = [await sha256(clientUserData.city)]
    if (clientUserData?.state) hashedUserData.st = [await sha256(clientUserData.state)]
    if (clientUserData?.zip) hashedUserData.zp = [await sha256(clientUserData.zip)]
    if (clientUserData?.country) hashedUserData.country = [await sha256(clientUserData.country)]
    if (clientUserData?.externalId) hashedUserData.external_id = [await sha256(clientUserData.externalId)]
    if (clientUserData?.fbc) hashedUserData.fbc = clientUserData.fbc
    if (clientUserData?.fbp) hashedUserData.fbp = clientUserData.fbp

    // ─── Construir evento ───
    const event: MetaEvent = {
      event_name,
      event_time: Math.floor(Date.now() / 1000),
      event_id,
      event_source_url: event_source_url || request.headers.get('referer') || '',
      action_source: 'website',
      user_data: hashedUserData,
      custom_data: custom_data || {},
    }

    // ─── Enviar a Meta CAPI ───
    const response = await fetch(META_CAPI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: [event],
        access_token: ACCESS_TOKEN,
        dataset_id: DATASET_ID,
      }),
    })

    const result = await response.json()

    if (response.ok && result.messages?.[0]?.code !== 'error') {
      console.log(`[CAPI] ✅ Evento ${event_name} enviado. Event ID: ${event_id}`)
      return NextResponse.json({ success: true, event_name, event_id, meta_response: result })
    } else {
      console.error(`[CAPI] ❌ Error enviando ${event_name}:`, result)
      return NextResponse.json({ success: false, error: result }, { status: 500 })
    }

  } catch (error) {
    console.error('[CAPI] ❌ Error interno:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
