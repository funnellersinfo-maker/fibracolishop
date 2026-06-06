/* ═══════════════════════════════════════════════════════════════════
   META TRACKING UTILITY — Pixel + CAPI con deduplicación
   
   Este módulo centraliza TODOS los eventos de Meta.
   Usa el mismo event_id para Pixel (client) y CAPI (server)
   para que Meta los deduplique correctamente.
   
   ─── CONFIGURACIÓN ───
   ▸ PIXEL_ID: 1289231602942427 (configurado en layout.tsx)
   ▸ CAPI endpoint: /api/meta-conversions
   
   ─── EVENTOS ACTIVOS ───
   ▸ PageView      — Se dispara al cargar la página
   ▸ ViewContent   — Se dispara al cargar la página (contenido de producto)
   ▸ Lead          — Se dispara al hacer clic en cualquier CTA
   
   ─── EVENTOS FUTUROS (preparados) ───
   ▸ InitiateCheckout — Inicio de proceso de pago
   ▸ AddToCart        — Agregar producto al carrito
   ▸ Purchase         — Compra completada
   
   ─── CÓMO AGREGAR UN NUEVO EVENTO ───
   1. Agrega la función en la sección de eventos activos
   2. Sigue el patrón: generar event_id → fbq() → sendCAPI()
   3. El event_id es el mismo para ambos para deduplicación
   ═══════════════════════════════════════════════════════════════════ */

// ─── PIXEL ID (debe coincidir con layout.tsx) ───
const PIXEL_ID = '1289231602942427' // ← CAMBIAR AQUÍ si modificas el Pixel

// ─── Generar Event ID único para deduplicación ───
function generateEventId(): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 10)
  return `evt_${PIXEL_ID}_${timestamp}_${random}`
}

// ─── Obtener fbp (Facebook Browser ID) de cookies ───
function getFbp(): string {
  if (typeof document === 'undefined') return ''
  const match = document.cookie.match(/_fbp=([^;]+)/)
  return match ? match[1] : ''
}

// ─── Obtener fbc (Facebook Click ID) de cookies o URL ───
function getFbc(): string {
  if (typeof document === 'undefined') return ''
  // Primero buscar en URL (fbclid parameter)
  const urlParams = new URLSearchParams(window.location.search)
  const fbclid = urlParams.get('fbclid')
  if (fbclid) return `fb.1.${Date.now()}.${fbclid}`
  // Luego buscar en cookie
  const match = document.cookie.match(/_fbc=([^;]+)/)
  return match ? match[1] : ''
}

// ─── Enviar evento a CAPI (server-side) ───
async function sendCAPI(eventName: string, eventId: string, customData?: Record<string, unknown>) {
  try {
    const payload = {
      event_name: eventName,
      event_id: eventId,
      event_source_url: typeof window !== 'undefined' ? window.location.href : '',
      user_data: {
        fbp: getFbp(),
        fbc: getFbc(),
      },
      custom_data: customData || {},
    }

    // Usar Beacon API para no bloquear la navegación
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' })
      navigator.sendBeacon('/api/meta-conversions', blob)
    } else {
      // Fallback a fetch con keepalive
      fetch('/api/meta-conversions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {
        // Silenciar errores para no afectar UX
      })
    }
  } catch {
    // Silenciar errores — el tracking nunca debe romper la UX
  }
}

// ─── Disparar Pixel (client-side) con verificación ───
function firePixel(eventName: string, customData?: Record<string, unknown>, eventId?: string) {
  try {
    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
      if (eventId) {
        window.fbq('track', eventName, customData || {}, { eventID: eventId })
      } else {
        window.fbq('track', eventName, customData || {})
      }
    }
  } catch {
    // Silenciar errores
  }
}

// ─── Disparar Pixel Custom Event ───
function firePixelCustom(eventName: string, customData?: Record<string, unknown>, eventId?: string) {
  try {
    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
      if (eventId) {
        window.fbq('trackCustom', eventName, customData || {}, { eventID: eventId })
      } else {
        window.fbq('trackCustom', eventName, customData || {})
      }
    }
  } catch {
    // Silenciar errores
  }
}

/* ═══════════════════════════════════════════════════════════════════
   EVENTOS ACTIVOS — Implementación
   ═══════════════════════════════════════════════════════════════════ */

/**
 * PageView + ViewContent
 * Se dispara automáticamente cuando la página carga completamente.
 * PageView ya lo dispara el script del Pixel en layout.tsx,
 * pero aquí lo reforzamos con CAPI y event_id para deduplicación.
 */
export function trackPageViewAndViewContent() {
  // ─── PageView (CAPI only — Pixel ya lo dispara en layout.tsx) ───
  const pageViewEventId = generateEventId()
  sendCAPI('PageView', pageViewEventId)

  // ─── ViewContent ───
  const viewContentEventId = generateEventId()
  firePixel('ViewContent', {
    content_name: 'Fibra Coli - Landing Page',
    content_category: 'Suplemento Alimenticio',
    content_ids: ['coliplus-fibra-prebiotica'],
    currency: 'COP',
    value: 79900,
  }, viewContentEventId)
  sendCAPI('ViewContent', viewContentEventId, {
    content_name: 'Fibra Coli - Landing Page',
    content_category: 'Suplemento Alimenticio',
    content_ids: ['coliplus-fibra-prebiotica'],
    currency: 'COP',
    value: 79900,
  })
}

/**
 * Lead — Se dispara cuando el usuario hace clic en CUALQUIER CTA
 * @param ctaLabel - Identificador del botón CTA clickeado
 * @param ctaType  - Tipo de CTA: 'whatsapp' | 'buy' | 'offer' | 'sticky' | 'gift'
 */
export function trackLead(ctaLabel: string, ctaType: 'whatsapp' | 'buy' | 'offer' | 'sticky' | 'gift' = 'whatsapp') {
  const eventId = generateEventId()
  const customData = {
    content_name: `CTA: ${ctaLabel}`,
    content_category: `Lead - ${ctaType}`,
    content_ids: ['coliplus-fibra-prebiotica'],
    currency: 'COP',
    value: 79900,
    cta_type: ctaType,
    cta_label: ctaLabel,
  }

  // 1. Disparar Pixel (client-side)
  firePixel('Lead', customData, eventId)

  // 2. Disparar CAPI (server-side) — mismo event_id para deduplicación
  sendCAPI('Lead', eventId, customData)
}

/* ═══════════════════════════════════════════════════════════════════
   EVENTOS FUTUROS — Preparados para implementar
   
   Para activar estos eventos, simplemente llama las funciones
   desde los componentes correspondientes cuando los implementes.
   ═══════════════════════════════════════════════════════════════════ */

/**
 * InitiateCheckout — (FUTURO) Cuando el usuario inicia proceso de compra
 * @param value    - Valor total del checkout
 * @param items    - Productos en el checkout
 */
export function trackInitiateCheckout(value: number, items: Array<{ id: string; quantity: number; price: number }>) {
  const eventId = generateEventId()
  const customData = {
    content_name: 'ColiPlus Checkout',
    content_category: 'Checkout',
    currency: 'COP',
    value,
    contents: items.map(item => ({ id: item.id, quantity: item.quantity, item_price: item.price })),
    num_items: items.reduce((sum, item) => sum + item.quantity, 0),
  }

  firePixel('InitiateCheckout', customData, eventId)
  sendCAPI('InitiateCheckout', eventId, customData)
}

/**
 * AddToCart — (FUTURO) Cuando el usuario agrega un producto al carrito
 * @param productId - ID del producto
 * @param quantity  - Cantidad agregada
 * @param price     - Precio unitario
 */
export function trackAddToCart(productId: string, quantity: number, price: number) {
  const eventId = generateEventId()
  const customData = {
    content_name: 'ColiPlus Fibra Prebiótica',
    content_category: 'Suplemento Alimenticio',
    content_ids: [productId],
    currency: 'COP',
    value: price * quantity,
    contents: [{ id: productId, quantity, item_price: price }],
  }

  firePixel('AddToCart', customData, eventId)
  sendCAPI('AddToCart', eventId, customData)
}

/**
 * Purchase — (FUTURO) Cuando se completa una compra
 * @param value    - Valor total de la compra
 * @param orderId  - ID del pedido
 * @param items    - Productos comprados
 */
export function trackPurchase(value: number, orderId: string, items: Array<{ id: string; quantity: number; price: number }>) {
  const eventId = generateEventId()
  const customData = {
    content_name: 'ColiPlus Purchase',
    content_category: 'Purchase',
    content_ids: items.map(item => item.id),
    currency: 'COP',
    value,
    contents: items.map(item => ({ id: item.id, quantity: item.quantity, item_price: item.price })),
    num_items: items.reduce((sum, item) => sum + item.quantity, 0),
    order_id: orderId,
  }

  firePixel('Purchase', customData, eventId)
  sendCAPI('Purchase', eventId, customData)
}

/* ═══════════════════════════════════════════════════════════════════
   SISTEMA DE PRUEBA — Verificar eventos en Meta Events Manager
   
   Abre la consola del navegador y ejecuta:
   ▸ window.__metaTest()           — Ejecutar prueba completa
   ▸ window.__metaDebug = true     — Activar modo debug (logs en consola)
   ═══════════════════════════════════════════════════════════════════ */

declare global {
  interface Window {
    fbq: (...args: unknown[]) => void
    __metaTest: () => void
    __metaDebug: boolean
  }
}

// ─── Activar sistema de prueba ───
if (typeof window !== 'undefined') {
  window.__metaTest = () => {
    console.group('🧪 META PIXEL + CAPI — PRUEBA COMPLETA')
    console.log('─')

    // Verificar Pixel
    console.log('1️⃣ Pixel instalado:', typeof window.fbq === 'function' ? '✅ SÍ' : '❌ NO')
    console.log('   Pixel ID:', PIXEL_ID)

    // Probar PageView
    console.log('2️⃣ PageView:')
    try {
      const pvId = generateEventId()
      window.fbq('track', 'PageView', {}, { eventID: pvId })
      console.log('   ✅ Pixel disparado | Event ID:', pvId)
      sendCAPI('PageView', pvId)
      console.log('   ✅ CAPI enviado')
    } catch (e) {
      console.log('   ❌ Error:', e)
    }

    // Probar ViewContent
    console.log('3️⃣ ViewContent:')
    try {
      const vcId = generateEventId()
      window.fbq('track', 'ViewContent', {
        content_name: 'Test - Fibra Coli',
        content_category: 'Test',
        currency: 'COP',
        value: 79900,
      }, { eventID: vcId })
      console.log('   ✅ Pixel disparado | Event ID:', vcId)
      sendCAPI('ViewContent', vcId, { content_name: 'Test - Fibra Coli' })
      console.log('   ✅ CAPI enviado')
    } catch (e) {
      console.log('   ❌ Error:', e)
    }

    // Probar Lead
    console.log('4️⃣ Lead:')
    try {
      const leadId = generateEventId()
      window.fbq('track', 'Lead', {
        content_name: 'Test - CTA WhatsApp',
        content_category: 'Lead - whatsapp',
        currency: 'COP',
        value: 79900,
      }, { eventID: leadId })
      console.log('   ✅ Pixel disparado | Event ID:', leadId)
      sendCAPI('Lead', leadId, { content_name: 'Test - CTA WhatsApp' })
      console.log('   ✅ CAPI enviado')
    } catch (e) {
      console.log('   ❌ Error:', e)
    }

    console.log('─')
    console.log('📋 VERIFICACIÓN: Ve a Meta Events Manager →')
    console.log('   https://business.facebook.com/events_manager')
    console.log('   → Selecciona tu Pixel → Test Events')
    console.log('   Los eventos deben aparecer en < 2 minutos')
    console.log('─')
    console.log('🔑 Deduplicación: Cada evento tiene el MISMO event_id')
    console.log('   en Pixel y CAPI → Meta los combina como 1 solo evento')
    console.groupEnd()
  }

  // ─── Debug mode — log todos los eventos en consola ───
  window.__metaDebug = false
  const originalFbq = window.fbq
  if (typeof originalFbq === 'function') {
    window.fbq = function (...args: unknown[]) {
      if (window.__metaDebug) {
        console.log('[META DEBUG 🔍]', ...args)
      }
      return originalFbq.apply(this, args)
    }
  }
}
