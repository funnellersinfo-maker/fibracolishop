/**
 * Cloudflare Pages Function — Meta Conversions API (CAPI)
 *
 * Este endpoint server-side envía eventos a Meta Graph API.
 * Reemplaza el Next.js API route que no funciona con output: 'export'.
 *
 * ─── CONFIGURACIÓN ───
 * ▸ PIXEL_ID:        Tu Pixel ID de Meta
 * ▸ ACCESS_TOKEN:    Token de acceso CAPI (generar en Events Manager)
 *
 * ─── RUTA ───
 * ▸ POST /api/meta-conversions
 *
 * ─── DEDUPLICACIÓN ───
 * ▸ Cada evento lleva event_id único (mismo que Pixel client-side)
 */

// ─── CONFIGURACIÓN: Cambia estos valores ───
const PIXEL_ID = '1289231602942427'
const ACCESS_TOKEN = '' // ← PONER AQUÍ EL ACCESS TOKEN DE CAPI
// O configurar como env var en Cloudflare Dashboard → Settings → Environment Variables
// ─── FIN CONFIGURACIÓN ──────────────────────

const META_CAPI_URL = `https://graph.facebook.com/v19.0/${PIXEL_ID}/events`

async function sha256(input: string): Promise<string> {
  if (!input) return ''
  const encoder = new TextEncoder()
  const data = encoder.encode(input.trim().toLowerCase())
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

export const onRequestPost: PagesFunction = async (context) => {
  try {
    const body = await context.request.json()

    const {
      event_name,
      event_id,
      event_source_url,
      user_data: clientUserData,
      custom_data,
    } = body as Record<string, unknown>

    // ─── Validación básica ───
    if (!event_name || !event_id) {
      return new Response(
        JSON.stringify({ error: 'event_name y event_id son obligatorios' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // ─── Obtener ACCESS_TOKEN: env var o hardcoded ───
    const token = (context.env as Record<string, string>)?.META_CAPI_ACCESS_TOKEN || ACCESS_TOKEN

    if (!token) {
      console.warn(`[CAPI] META_CAPI_ACCESS_TOKEN no configurado. Evento ${event_name} solo se trackeó vía Pixel.`)
      return new Response(
        JSON.stringify({
          success: false,
          warning: 'META_CAPI_ACCESS_TOKEN no configurado. Configúralo en Cloudflare Dashboard → Settings → Environment Variables o directamente en este archivo.',
          pixel_only: true,
          event_name,
          event_id,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // ─── Construir user_data con hashing SHA-256 ───
    const hashedUserData: Record<string, unknown> = {
      client_ip_address: context.request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
                         context.request.headers.get('x-real-ip') || '',
      client_user_agent: context.request.headers.get('user-agent') || '',
    }

    const ud = clientUserData as Record<string, string> | undefined
    if (ud?.email) hashedUserData.em = [await sha256(ud.email)]
    if (ud?.phone) hashedUserData.ph = [await sha256(ud.phone)]
    if (ud?.firstName) hashedUserData.fn = [await sha256(ud.firstName)]
    if (ud?.lastName) hashedUserData.ln = [await sha256(ud.lastName)]
    if (ud?.city) hashedUserData.ct = [await sha256(ud.city)]
    if (ud?.state) hashedUserData.st = [await sha256(ud.state)]
    if (ud?.zip) hashedUserData.zp = [await sha256(ud.zip)]
    if (ud?.country) hashedUserData.country = [await sha256(ud.country)]
    if (ud?.externalId) hashedUserData.external_id = [await sha256(ud.externalId)]
    if (ud?.fbc) hashedUserData.fbc = ud.fbc
    if (ud?.fbp) hashedUserData.fbp = ud.fbp

    // ─── Construir evento ───
    const event = {
      event_name,
      event_time: Math.floor(Date.now() / 1000),
      event_id,
      event_source_url: (event_source_url as string) || context.request.headers.get('referer') || '',
      action_source: 'website',
      user_data: hashedUserData,
      custom_data: custom_data || {},
    }

    // ─── Enviar a Meta CAPI ───
    const response = await fetch(META_CAPI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: [event],
        access_token: token,
      }),
    })

    const result = await response.json()

    if (response.ok && (result as Record<string, unknown>)?.messages) {
      const messages = (result as Record<string, unknown>).messages as Array<Record<string, unknown>>
      if (messages?.[0]?.code !== 'error') {
        console.log(`[CAPI] Evento ${event_name} enviado. Event ID: ${event_id}`)
        return new Response(
          JSON.stringify({ success: true, event_name, event_id, meta_response: result }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
      }
    }

    console.error(`[CAPI] Error enviando ${event_name}:`, JSON.stringify(result))
    return new Response(
      JSON.stringify({ success: false, error: result }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('[CAPI] Error interno:', error)
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

// Handle OPTIONS for CORS preflight
export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
