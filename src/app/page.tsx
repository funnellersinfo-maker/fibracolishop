'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  Star, Shield, Truck, Clock, CheckCircle2, ChevronDown, ChevronUp,
  MessageCircle, Heart, Leaf, Droplets, Zap, RefreshCw, Package,
  Phone, Lock, Gift, Award, Users, ThumbsUp, ArrowRight, X,
  AlertCircle, Info, Sparkles, Timer, ShieldCheck, Ban, CircleDot,
  Beaker, FlaskConical, Droplet, Sun, Apple, Flower2, LeafyGreen, Grape,
  BadgeCheck, CircleCheck, HandMetal, Scale, Eye, FlameKindling, Pill
} from 'lucide-react'

/* ─── DATA ──────────────────────────────────────────────────────── */

const TESTIMONIALS = [
  { name: 'Carolina M.', city: 'Barranquilla', text: 'Nunca creí que algo tan natural funcionara tan bien. Mi digestión es rápida y mi abdomen, plano. ¡Lo recomiendo totalmente!', tag: 'Cambió mi Vida' },
  { name: 'Andrea L.', city: 'Bogotá', text: 'ColiPlus cambió mi vida: mi estómago está cómodo y sin inflamación. ¡Y sin ningún efecto secundario!', tag: 'Cambió mi Vida' },
  { name: 'Natalia S.', city: 'Medellín', text: 'Después de probar muchos productos, ColiPlus venció mi estreñimiento en solo una semana. ¡Adiós pesadez y malestar!', tag: 'Superó mis Expectativas' },
  { name: 'María José', city: 'Medellín', text: 'Llevaba años lidiando con el estreñimiento y nada parecía funcionar, hasta que probé este producto. Desde la primera semana noté cambios. Mi digestión es más rápida, la inflamación desapareció y me siento mucho más cómoda. ¡No lo cambio por nada!', tag: 'Cambió mi Vida' },
  { name: 'Sandra P.', city: 'Montería', text: 'Honestamente, no esperaba tanto, pero superó mis expectativas. He notado una gran mejora en mi salud digestiva y ya no tengo esa sensación de pesadez después de las comidas.', tag: 'Superó mis Expectativas' },
  { name: 'Luz Dary', city: 'Barranquilla', text: 'Increíble! Me siento mucho más ligera y con energía todos los días. Antes solía sufrir de hinchazón e incomodidad constante, pero ahora mi digestión es mucho más regular y sin molestias. 100% recomendado, si funciona!', tag: '100% Recomendado' },
  { name: 'Claudia R.', city: 'Cali', text: 'Mi abdomen se inflamaba tanto que parecía embarazada. Tenía pena hasta salir de casa. Después de 2 semanas con ColiPlus, mi barriga se desinflamó notablemente. Me siento liviana otra vez.', tag: 'Cambió mi Vida' },
  { name: 'Yolanda P.', city: 'Barranquilla', text: 'Tenía miedo de comprar por internet, pero el pago contra entrega me dio confianza. Cuando vi el paquete, supe que era real. Llevo 1 mes y mi digestión cambió por completo.', tag: 'Superó mis Expectativas' },
  { name: 'Ana B.', city: 'Bucaramanga', text: 'Soy enfermera y paso turnos largos sin ir al baño. Eso me arruinó el tránsito intestinal. ColiPlus me ayudó a regularizarme de forma natural, sin laxantes agresivos.', tag: '100% Recomendado' },
  { name: 'Patricia G.', city: 'Pereira', text: 'Después de la menopausia, mi digestión se volvió un desastre. Pesadez, gases, estreñimiento... ColiPlus fue la mejor opción. Me siento 10 años más joven.', tag: 'Cambió mi Vida' },
  { name: 'Lucía R.', city: 'Manizales', text: 'Pensé que era normal sentirse pesada después de comer. NO LO ES. Desde ColiPlus, como tranquila y termino el día sin esa molestia horrible. Debería haberlo tomado antes.', tag: 'Superó mis Expectativas' },
  { name: 'Rosa I.', city: 'Cartagena', text: 'Me gasté una fortuna en médicos y exámenes. Todo salía "normal". Pero yo me sentía mal. ColiPlus fue lo único que realmente me dio alivio.', tag: 'Cambió mi Vida' },
  { name: 'Gloria S.', city: 'Ibagué', text: 'Probé otras fibras y me daban más gases o sabían horrible. ColiPlus es diferente: sabor agradable, sin efectos secundarios y realmente funciona. Ya voy por mi tercer frasco.', tag: '100% Recomendado' },
  { name: 'Marta C.', city: 'Villavicencio', text: 'Vivo en el campo y pensé que no me llegaría. ¡Me llegó en 3 días! El envío fue rapidísimo. Ahora mi vecina también lo pidió.', tag: 'Superó mis Expectativas' },
  { name: 'Diana M.', city: 'Pasto', text: 'Tenía 5 días sin ir al baño. Era desesperante. Empecé ColiPlus y al tercer día ya sentí alivio. No sé qué tiene este producto pero es un bendito. Lo recomiendo con los ojos cerrados.', tag: 'Cambió mi Vida' },
  { name: 'Carmen A.', city: 'Montería', text: 'Mi mamá de 72 años no podía ir al baño bien. Le compré ColiPlus y en una semana ya estaba regularizada. Ella dice que es el mejor regalo que le he dado.', tag: '100% Recomendado' },
  { name: 'Natalia A.', city: 'Cúcuta', text: 'La pesadez después de comer me quitaba las ganas de hacer cualquier cosa. Era como si tuviera una piedra en el estómago. Con ColiPlus, la comida ya no me pesa.', tag: 'Superó mis Expectativas' },
  { name: 'Juliana V.', city: 'Armenia', text: 'No quería depender de pastillas. Buscaba algo natural. ColiPlus tiene ingredientes que reconozco y confío. Es fibra de verdad, no químicos raros.', tag: '100% Recomendado' },
  { name: 'Beatriz A.', city: 'Popayán', text: 'Compré solo 1 frasco para probar. Gran error. A las 2 semanas ya quería más. Ahora compro de 3 en 3. No me quedo sin mi ColiPlus ni un día.', tag: 'Cambió mi Vida' },
  { name: 'Ángela R.', city: 'Sincelejo', text: 'Mi colon se saturó por años de mala alimentación. El médico me dijo que necesitaba fibra urgente. Encontré ColiPlus y ha sido mi salvación. Ya no tengo esas crisis de dolor.', tag: 'Superó mis Expectativas' },
]

const INGREDIENTS = [
  { name: 'Linaza', desc: 'Rica en fibra soluble y omega-3. Ayuda a suavizar el tránsito intestinal y reduce la inflamación del colon de forma natural.', icon: '🌿' },
  { name: 'Pitaya', desc: 'Superfruta con alto contenido de fibra y antioxidantes. Combate el estreñimiento y promueve una piel saludable y radiante.', icon: '🐉' },
  { name: 'Flor de Jamaica', desc: 'Diurético natural que ayuda a desinflamar el sistema digestivo. Rica en vitamina C y antioxidantes que protegen tu colon.', icon: '🌺' },
  { name: 'Fibra Prebiótica', desc: 'Alimenta las bacterias beneficiosas de tu intestino. Mejora la flora intestinal y potencia tu digestión desde la raíz.', icon: '🌱' },
  { name: 'Alcachofa', desc: 'Estimula la producción de bilis y mejora la digestión de las grasas. Desintoxica el hígado y protege tu sistema digestivo.', icon: '🥬' },
  { name: 'Semillas de Chía', desc: 'Expanden en el estómago formando un gel que facilita el tránsito intestinal. Rica en omega-3 y fibra soluble.', icon: '⚫' },
  { name: 'Espirulina', desc: 'Superalimento rico en proteínas y clorofila que desintoxica el organismo y fortalece el sistema inmunológico.', icon: '🦠' },
  { name: 'Noni', desc: 'Fruta tropical con propiedades antiinflamatorias y antioxidantes. Mejora la digestión y fortalece las defensas naturales.', icon: '🍈' },
  { name: 'Té Verde', desc: 'Potente antioxidante que acelera el metabolismo y mejora la digestión. Ayuda a reducir la inflamación abdominal.', icon: '🍵' },
  { name: 'Manzana', desc: 'Fuente natural de pectina y fibra soluble. Regula el tránsito intestinal y aporta saciedad sin pesadez.', icon: '🍎' },
]

const INGREDIENT_DEEP = [
  { name: 'Linaza', benefit: 'Forma un gel suave que lubrica el intestino, facilitando la evacuación sin irritar. Combate el estreñimiento crónico de forma natural.', detail: 'Estudios clínicos demuestran que la linaza aumenta la frecuencia de deposiciones en un 30% en solo 2 semanas.' },
  { name: 'Pitaya', benefit: 'Su alta concentración de fibra y prebióticos alimentan las bacterias buenas del intestino, mejorando la flora intestinal y la piel.', detail: 'La pitaya contiene oligosacáridos que estimulan el crecimiento de bifidobacterias, esenciales para una digestión saludable.' },
  { name: 'Alcachofa', benefit: 'Estimula la producción de bilis, mejorando la digestión de grasas y eliminando toxinas del hígado y el colon.', detail: 'La cinarina de la alcachofa aumenta la producción biliar hasta un 40%, acelerando la desintoxicación natural del cuerpo.' },
  { name: 'Fibra Prebiótica', benefit: 'Actúa como alimento para las bacterias beneficiosas, multiplicándolas y creando un ambiente intestinal óptimo.', detail: 'Los prebióticos aumentan la absorción de calcio y magnesio, fortaleciendo no solo tu digestión sino tu salud ósea.' },
  { name: 'Semillas de Chía', benefit: 'Absorben hasta 12 veces su peso en agua, formando un gel que limpia las paredes intestinales y facilita el tránsito.', detail: 'Las semillas de chía proporcionan saciedad prolongada y regulan los niveles de azúcar en sangre.' },
  { name: 'Espirulina', benefit: 'Su clorofila desintoxica el colon y el hígado, mientras sus proteínas reparan la mucosa intestinal dañada.', detail: 'La espirulina contiene ficocianina, un pigmento con propiedades antiinflamatorias comprobadas para el sistema digestivo.' },
]

const FAQS = [
  { q: '¿Qué es ColiPlus?', a: 'ColiPlus es una fibra prebiótica natural formulada específicamente para el bienestar digestivo. Contiene 10 ingredientes naturales como Linaza, Pitaya, Alcachofa y más, que trabajan en conjunto para limpiar tu colon, combatir el estreñimiento y reducir la inflamación. No es un laxante agresivo, es un suplemento alimenticio registrado ante el INVIMA con registro NSA-0012423-2022.' },
  { q: '¿Cuánto tiempo tarda en hacer efecto?', a: 'La mayoría de nuestros usuarios notan los primeros cambios entre el día 3 y el día 7 de uso constante. Los resultados más significativos se ven a partir de la segunda semana. Cada organismo es diferente, por eso recomendamos tomarlo mínimo 30 días para sentir el cambio completo.' },
  { q: '¿Cómo se consume?', a: 'Muy fácil: disuelve 1 cucharada dosificadora en un vaso de agua. No necesita endulzar porque tiene un sabor agradable natural. Tómalo 1-2 veces al día: en la mañana en ayunas o en la noche antes de dormir. Es así de simple.' },
  { q: '¿Quiénes pueden tomarlo?', a: 'Personas desde 14 años en adelante. Es seguro para diabéticos e hipertensos ya que NO contiene azúcar NI edulcorantes artificiales. Ideal para quienes sufren de estreñimiento, inflamación, pesadez o digestión lenta.' },
  { q: '¿Quiénes NO pueden tomarlo?', a: 'Mujeres embarazadas y menores de 14 años. Si tienes alguna condición médica específica, consulta con tu médico antes de iniciar cualquier suplemento.' },
  { q: '¿Pueden tomarlo diabéticos e hipertensos?', a: '¡Sí! ColiPlus NO contiene azúcar ni edulcorantes artificiales. Es completamente seguro para personas con diabetes o hipertensión. Sus ingredientes son 100% naturales.' },
  { q: '¿Tiene efectos secundarios?', a: 'ColiPlus está hecho con ingredientes naturales registrados ante el INVIMA. En los primeros días, algunas personas pueden experimentar un leve aumento de gases, lo cual es normal cuando el intestino se está regulando y limpiando. Esto desaparece en pocos días.' },
  { q: '¿Está registrado ante el INVIMA?', a: 'Sí, ColiPlus cuenta con registro INVIMA NSA-0012423-2022. Esto garantiza que el producto cumple con todos los requisitos de seguridad y calidad exigidos por las autoridades sanitarias colombianas.' },
  { q: '¿El pago contra entrega es real?', a: '¡Sí, 100% real! Solo pagas cuando recibes tu pedido en la puerta de tu casa. No te pedimos pagos por adelantado ni datos de tarjeta. Es la forma más segura de comprar en Colombia.' },
  { q: '¿Hacen envíos a toda Colombia?', a: 'Sí, hacemos envíos a todas las ciudades y municipios de Colombia. El tiempo promedio de entrega es de 2 a 5 días hábiles, dependiendo de tu ubicación.' },
  { q: '¿Por qué es mejor que otras fibras?', a: 'ColiPlus combina 10 ingredientes naturales en una sola fórmula: Linaza, Pitaya, Flor de Jamaica, Fibra Prebiótica, Alcachofa, Chía, Espirulina, Noni, Té Verde y Manzana. Otras fibras solo tienen 1-2 ingredientes. Nosotros atacamos el problema desde todos los ángulos con una fórmula registrada ante el INVIMA.' },
  { q: '¿Cuánto dura un frasco?', a: 'Cada frasco de ColiPlus rinde para aproximadamente 30 días de uso continuo (1 toma diaria). Por eso recomendamos comprar 2 o 3 frascos para asegurar al menos 2-3 meses de tratamiento completo.' },
]

const COMPARISON_ITEMS = [
  { feature: 'Ingredientes naturales', coliplus: true, others: false },
  { feature: 'Registro INVIMA', coliplus: true, others: false },
  { feature: '10 ingredientes en 1', coliplus: true, others: false },
  { feature: 'Sin azúcar ni edulcorantes', coliplus: true, others: false },
  { feature: 'Sabor agradable', coliplus: true, others: false },
  { feature: 'Sin efectos secundarios', coliplus: true, others: false },
  { feature: 'Seguro para diabéticos', coliplus: true, others: false },
  { feature: 'Prebiótico natural', coliplus: true, others: false },
  { feature: 'Limpia el colon', coliplus: true, others: false },
  { feature: 'Promueve piel saludable', coliplus: true, others: false },
]

const DISEASE_FACTS = [
  'El 80% de las enfermedades comienzan en un colon sucio',
  'El estreñimiento crónico afecta al 20% de la población colombiana',
  'Un colon saturado puede acumular hasta 5 kg de residuos tóxicos',
  'La inflamación abdominal es la queja digestiva #1 en consultas médicas',
  'Los problemas digestivos reducen la calidad de vida en un 40%',
  'Un colon limpio mejora la absorción de nutrientes hasta en un 60%',
]

/* ─── HELPER: Scroll reveal wrapper ─── */

function RevealOnScroll({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ─── TOP BAR: COUNTDOWN + VIEWERS + PURCHASE NOTIFICATIONS ─── */

const COLOMBIAN_CITIES = [
  { city: 'Bogotá', region: 'Cundinamarca' },
  { city: 'Medellín', region: 'Antioquia' },
  { city: 'Cali', region: 'Valle del Cauca' },
  { city: 'Barranquilla', region: 'Atlántico' },
  { city: 'Cartagena', region: 'Bolívar' },
  { city: 'Bucaramanga', region: 'Santander' },
  { city: 'Pereira', region: 'Risaralda' },
  { city: 'Montería', region: 'Córdoba' },
  { city: 'Manizales', region: 'Caldas' },
  { city: 'Ibagué', region: 'Tolima' },
  { city: 'Villavicencio', region: 'Meta' },
  { city: 'Pasto', region: 'Nariño' },
  { city: 'Cúcuta', region: 'Norte de Santander' },
  { city: 'Armenia', region: 'Quindío' },
  { city: 'Popayán', region: 'Cauca' },
  { city: 'Sincelejo', region: 'Sucre' },
  { city: 'Neiva', region: 'Huila' },
  { city: 'Santa Marta', region: 'Magdalena' },
  { city: 'Valledupar', region: 'Cesar' },
  { city: 'Tunja', region: 'Boyacá' },
  { city: 'Florencia', region: 'Caquetá' },
  { city: 'Riohacha', region: 'La Guajira' },
  { city: 'Yopal', region: 'Casanare' },
  { city: 'Mocoa', region: 'Putumayo' },
  { city: 'Quibdó', region: 'Chocó' },
]

const PURCHASE_NAMES = [
  'Carolina', 'Andrea', 'Natalia', 'María', 'Sandra', 'Luz', 'Claudia',
  'Yolanda', 'Ana', 'Patricia', 'Lucía', 'Rosa', 'Gloria', 'Marta',
  'Diana', 'Carmen', 'Juliana', 'Beatriz', 'Ángela', 'Paola',
  'Viviana', 'Liliana', 'Adriana', 'Catalina', 'Jimena', 'Valentina',
]

function TopBar() {
  // ─── 15-minute countdown ───
  const [timeLeft, setTimeLeft] = useState(15 * 60) // 15 min in seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 15 * 60))
    }, 1000)
    return () => clearInterval(timer)
  }, [])
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  // ─── Live viewers ───
  const [viewers, setViewers] = useState(() => Math.floor(Math.random() * 24) + 24)
  useEffect(() => {
    const timer = setInterval(() => {
      setViewers((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2 // -2 to +2
        return Math.max(18, Math.min(60, prev + delta))
      })
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  // ─── Purchase notifications ───
  const [purchase, setPurchase] = useState<{ name: string; city: string; time: string } | null>(null)
  const [purchaseVisible, setPurchaseVisible] = useState(false)

  useEffect(() => {
    const showNotification = () => {
      const name = PURCHASE_NAMES[Math.floor(Math.random() * PURCHASE_NAMES.length)]
      const loc = COLOMBIAN_CITIES[Math.floor(Math.random() * COLOMBIAN_CITIES.length)]
      const mins = Math.floor(Math.random() * 12) + 1
      setPurchase({ name, city: loc.city, time: `hace ${mins} min` })
      setPurchaseVisible(true)
      setTimeout(() => setPurchaseVisible(false), 4000)
    }
    // First one after 5s, then every 10-15s
    const initial = setTimeout(() => {
      showNotification()
      const loop = setInterval(showNotification, 10000 + Math.random() * 5000)
      return () => clearInterval(loop)
    }, 5000)
    return () => clearTimeout(initial)
  }, [])

  return (
    <>
      {/* Fixed top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-emerald-900/95 backdrop-blur-sm border-b border-emerald-700/50 shadow-lg">
        <div className="max-w-lg mx-auto px-3 py-1.5 flex items-center justify-between gap-2">
          {/* Countdown */}
          <div className="flex items-center gap-1.5">
            <Timer className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span className="text-[10px] text-emerald-200 font-medium hidden sm:inline">Oferta</span>
            <span className="text-amber-300 font-extrabold text-sm tabular-nums tracking-wide">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
          </div>

          {/* Viewers */}
          <div className="flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-emerald-300 flex-shrink-0" />
            <span className="text-white font-bold text-xs tabular-nums">{viewers}</span>
            <span className="text-emerald-200 text-[10px]">viendo</span>
          </div>

          {/* Mini CTA */}
          <a
            href="https://wa.me/573214487903?text=Hola%2C%20quiero%20aprovechar%20la%20oferta%20de%20ColiPlus%20antes%20que%20termin%C3%A9"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-amber-400 hover:bg-amber-500 text-emerald-900 text-[10px] font-extrabold px-2.5 py-1 rounded-lg transition-colors flex-shrink-0"
          >
            🛒 OFERTA
          </a>
        </div>
      </div>

      {/* Purchase notification popup */}
      <AnimatePresence>
        {purchaseVisible && purchase && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 0 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="fixed top-12 left-3 right-3 z-40 sm:left-auto sm:right-3 sm:w-72"
          >
            <div className="bg-white rounded-xl shadow-2xl border border-emerald-100 p-2.5 flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-gray-900 truncate">
                  {purchase.name} de {purchase.city}
                </p>
                <p className="text-[10px] text-gray-500">
                  Compró ColiPlus · {purchase.time}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/* ─── GIFT REMINDER STRIP ─── */

function GiftReminder() {
  return (
    <div className="bg-gradient-to-r from-amber-500 to-amber-400 text-center py-2.5 px-4">
      <p className="text-white text-sm font-bold flex items-center justify-center gap-2">
        <Gift className="w-4 h-4" />
        ¡OBSEQUIO GRATIS! Loción Termoactiva con cada pedido
        <Gift className="w-4 h-4" />
      </p>
    </div>
  )
}

/* ─── TESTIMONIAL PHOTOS STRIP ─── */

const TESTIMONIAL_PHOTOS = [
  { src: '/images/testimonial-1.jpg', alt: 'Resultado real de clienta ColiPlus' },
  { src: '/images/testimonial-2.jpg', alt: 'Testimonio verificado de ColiPlus' },
  { src: '/images/testimonial-3.jpg', alt: 'Cliente satisfecha con ColiPlus' },
  { src: '/images/testimonial-4.jpg', alt: 'Opinión real ColiPlus Colombia' },
  { src: '/images/testimonial-5.jpg', alt: 'WhatsApp testimonio ColiPlus' },
  { src: '/images/testimonial-6.jpg', alt: 'Reseña ColiPlus antes y después' },
  { src: '/images/testimonial-7.jpg', alt: 'Cliente feliz con resultados ColiPlus' },
]

function TestimonialPhotos({ indices }: { indices: number[] }) {
  return (
    <div className="bg-gradient-to-b from-emerald-50 to-white py-6 px-4">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-center gap-1.5 mb-3">
          <span className="text-emerald-700 font-extrabold text-xs uppercase tracking-wider">Resultados reales</span>
          <span className="bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">100% VERIFICADO</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {indices.map((idx, i) => (
            <RevealOnScroll key={i} delay={i * 0.08}>
              <div className="relative rounded-xl overflow-hidden shadow-md border-2 border-white aspect-[4/3]">
                <img
                  src={TESTIMONIAL_PHOTOS[idx % TESTIMONIAL_PHOTOS.length].src}
                  alt={TESTIMONIAL_PHOTOS[idx % TESTIMONIAL_PHOTOS.length].alt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-1.5">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, s) => (
                      <Star key={s} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── SOCIAL PROOF IMAGE BLOCK ─── */

function SocialProofBlock({ src, alt, label }: { src: string; alt: string; label: string }) {
  return (
    <div className="bg-white py-5 px-4">
      <div className="max-w-lg mx-auto">
        <RevealOnScroll>
          <div className="text-center mb-2">
            <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold px-3 py-1 rounded-full">
              <BadgeCheck className="w-3 h-3" />
              {label}
            </span>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100">
            <img
              src={src}
              alt={alt}
              className="w-full h-auto object-contain"
              loading="lazy"
            />
          </div>
        </RevealOnScroll>
      </div>
    </div>
  )
}

/* ─── PAYMENT STRIP ─── */

function PaymentStrip() {
  return (
    <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 text-center py-3 px-4 mt-3 rounded-xl">
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <span className="flex items-center gap-1.5 text-white text-xs font-bold">
          <Truck className="w-4 h-4 text-amber-300" />
          Pago contra entrega
        </span>
        <span className="text-emerald-300/50">|</span>
        <span className="flex items-center gap-1.5 text-amber-300 text-xs font-extrabold">
          <Zap className="w-4 h-4" />
          5% OFF en pago anticipado
        </span>
        <span className="text-emerald-300/50">|</span>
        <span className="flex items-center gap-1.5 text-white text-xs font-bold">
          <Clock className="w-4 h-4 text-amber-300" />
          Prioridad en despacho
        </span>
      </div>
    </div>
  )
}

/* ─── SECTION 1: HERO ─── */

const HERO_IMAGES = [
  { src: '/images/coliplus-hero.jpg', alt: 'ColiPlus - Fibra Prebiótica Natural para Bienestar Digestivo' },
  { src: '/images/coliplus-hero-2.png', alt: 'ColiPlus - Beneficios y resultados reales' },
]

function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  const minSwipeDistance = 50

  // Auto-rotate every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_IMAGES.length)
    }, 8000)
    return () => clearInterval(timer)
  }, [])

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX
  }
  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX
  }
  const onTouchEnd = () => {
    const distance = touchStartX.current - touchEndX.current
    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0) {
        // Swiped left → next
        setActiveSlide((prev) => (prev + 1) % HERO_IMAGES.length)
      } else {
        // Swiped right → prev
        setActiveSlide((prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length)
      }
    }
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-900">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-emerald-400 blur-3xl" />
        <div className="absolute bottom-20 right-5 w-32 h-32 rounded-full bg-amber-400 blur-3xl" />
      </div>

      <div className="relative max-w-lg mx-auto px-4 pt-20 pb-8">
        {/* Users badge - positioned lower to avoid top bar overlap */}
        <div className="flex justify-center mb-4 mt-2">
          <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-bold px-4 py-2 rounded-full">
            <Users className="w-3.5 h-3.5 text-amber-300" />
            +8,700 Usuarios Confían en ColiPlus
          </span>
        </div>

        {/* Product image carousel */}
        <div
          className="relative flex justify-center mb-3 select-none"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeSlide}
                src={HERO_IMAGES[activeSlide].src}
                alt={HERO_IMAGES[activeSlide].alt}
                className="w-full h-full object-contain product-glow"
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                draggable={false}
              />
            </AnimatePresence>
          </div>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2.5 mb-5">
          {HERO_IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveSlide(i)}
              className={`transition-all duration-300 rounded-full ${
                i === activeSlide
                  ? 'w-7 h-3 bg-amber-400 shadow-md shadow-amber-400/40'
                  : 'w-3 h-3 bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Ver imagen ${i + 1}`}
            />
          ))}
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center leading-tight text-white mb-3">
          Fibra Prebiótica Natural para{' '}
          <span className="text-amber-300">Bienestar Digestivo</span>
        </h1>

        <p className="text-center text-emerald-100 text-base sm:text-lg mb-5 leading-relaxed">
          Limpia tu colon, combate el estreñimiento y elimina la inflamación con ingredientes 100% naturales.
        </p>

        {/* Key benefits with emoji */}
        <div className="space-y-2 mb-5">
          {[
            { emoji: '🫧', text: 'Desinflama tu abdomen y elimina la hinchazón' },
            { emoji: '✨', text: 'Combate el estreñimiento de forma natural' },
            { emoji: '💚', text: 'Equilibra tu digestión sin efectos secundarios' },
            { emoji: '🌸', text: 'Promueve una piel saludable desde adentro' },
          ].map((b, i) => (
            <div key={i} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-white/10">
              <span className="text-xl">{b.emoji}</span>
              <span className="text-white text-sm font-medium">{b.text}</span>
            </div>
          ))}
        </div>

        {/* INVIMA badge */}
        <div className="flex justify-center mb-4">
          <span className="inline-flex items-center gap-1.5 bg-emerald-700/50 border border-emerald-500/30 text-emerald-100 text-xs font-semibold px-3 py-1.5 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            Registro INVIMA: NSA-0012423-2022
          </span>
        </div>

        {/* Rating */}
        <div className="flex items-center justify-center gap-2 mb-5">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className="text-sm font-bold text-white">4.9/5</span>
          <span className="text-xs text-emerald-200">(8,700+ opiniones)</span>
        </div>

        {/* CTA */}
        <a
          href="https://wa.me/573214487903?text=Hola%2C%20quiero%20ordenar%20ColiPlus%20ahora%20mismo%20%F0%9F%8C%BF"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-emerald-900 text-center font-extrabold text-lg py-4 px-6 rounded-2xl shadow-lg shadow-amber-500/30 transition-all duration-200 pulse-cta"
        >
          ¡QUIERO MI COLIPLUS AHORA! 🌿
        </a>
        <PaymentStrip />
        <p className="text-center text-xs text-emerald-200 mt-2">
          <span className="text-amber-300 font-semibold">🎁 Loción GRATIS</span> con tu pedido
        </p>
      </div>
    </section>
  )
}

/* ─── SECTION 2: TESTIMONIAL CAROUSEL ─── */

function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const current = TESTIMONIALS[currentIndex]

  return (
    <section className="bg-gradient-to-b from-emerald-900 to-emerald-800 py-8 px-4">
      <div className="max-w-lg mx-auto">
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5">
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-white text-sm leading-relaxed mb-3 italic">"{current.text}"</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-300 text-sm font-bold">{current.name}</p>
                  <p className="text-emerald-200 text-xs">{current.city}</p>
                </div>
                <span className="bg-amber-400/20 text-amber-300 text-[10px] font-bold px-2 py-1 rounded-full border border-amber-400/30">
                  {current.tag}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
          {/* Dots */}
          <div className="flex justify-center gap-1 mt-4">
            {TESTIMONIALS.slice(0, 8).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === currentIndex % 8 ? 'bg-amber-400 w-5' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── SECTION 3: ¿POR QUÉ ELEGIRLO? ─── */

function WhyChooseSection() {
  return (
    <section className="bg-white py-12 px-4">
      <div className="max-w-lg mx-auto">
        <RevealOnScroll>
          <div className="text-center mb-8">
            <span className="text-emerald-600 font-bold text-sm uppercase tracking-wider">La decisión inteligente</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
              ¿POR QUÉ <span className="text-emerald-700">ELEGIRLO</span>?
            </h2>
          </div>
        </RevealOnScroll>

        {/* INVIMA prominently displayed */}
        <RevealOnScroll>
          <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 border-2 border-emerald-200 rounded-2xl p-5 text-center mb-6">
            <ShieldCheck className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
            <h3 className="font-extrabold text-emerald-800 text-lg">Producto Registrado ante el INVIMA</h3>
            <p className="text-emerald-700 text-sm mt-1">Registro: <span className="font-bold text-lg">NSA-0012423-2022</span></p>
            <p className="text-emerald-600 text-xs mt-1">Garantizamos seguridad, calidad y cumplimiento normativo</p>
          </div>
        </RevealOnScroll>

        {/* 3 benefit cards */}
        <div className="space-y-4">
          {[
            {
              icon: <Leaf className="w-8 h-8" />,
              title: '100% Natural',
              desc: '10 ingredientes naturales cuidadosamente seleccionados: Linaza, Pitaya, Flor de Jamaica, Alcachofa, Chía y más. Sin químicos, sin azúcar, sin edulcorantes artificiales.',
              color: 'emerald',
            },
            {
              icon: <ShieldCheck className="w-8 h-8" />,
              title: 'Seguro y Efectivo',
              desc: 'Registro INVIMA que respalda su seguridad. Sin efectos secundarios. Seguro para diabéticos e hipertensos. No es un laxante agresivo, es fibra que cuida tu intestino.',
              color: 'amber',
            },
            {
              icon: <Zap className="w-8 h-8" />,
              title: 'Resultados Reales',
              desc: 'Más de 8,700 usuarios ya recuperaron su bienestar digestivo. Desde el primer semana notarás: menos inflamación, mejor tránsito y más energía.',
              color: 'emerald',
            },
          ].map((card, i) => (
            <RevealOnScroll key={i} delay={i * 0.12}>
              <div className={`bg-gradient-to-br ${card.color === 'emerald' ? 'from-emerald-50 to-white border-emerald-100' : 'from-amber-50 to-white border-amber-100'} border rounded-2xl p-5`}>
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-xl ${card.color === 'emerald' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'} flex items-center justify-center flex-shrink-0`}>
                    {card.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{card.title}</h3>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">{card.desc}</p>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── SECTION 4: INGREDIENTES ─── */

function IngredientsSection() {
  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-lg mx-auto">
        <RevealOnScroll>
          <div className="text-center mb-8">
            <span className="text-emerald-600 font-bold text-sm uppercase tracking-wider">Fórmula poderosa</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
              INGREDIENTES
            </h2>
            <p className="text-gray-600 mt-2">10 ingredientes naturales que trabajan en conjunto por tu bienestar digestivo</p>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-2 gap-3">
          {INGREDIENTS.map((ing, i) => (
            <RevealOnScroll key={i} delay={i * 0.06}>
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all h-full">
                <span className="text-3xl mb-2 block">{ing.icon}</span>
                <h3 className="font-bold text-sm text-gray-900 mb-1">{ing.name}</h3>
                <p className="text-[11px] text-gray-500 leading-relaxed">{ing.desc}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll>
          <div className="mt-5 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center">
            <p className="text-emerald-700 text-sm font-medium">
              🌿 Sin azúcar · Sin edulcorantes · Sin conservantes · Sin lactosa
            </p>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}

/* ─── SECTION: INFORMACIÓN NUTRICIONAL ─── */

function NutritionalInfoSection() {
  return (
    <section className="bg-gradient-to-b from-white to-emerald-50 py-10 px-4">
      <div className="max-w-lg mx-auto">
        <RevealOnScroll>
          <div className="text-center mb-6">
            <span className="text-emerald-600 font-bold text-sm uppercase tracking-wider">Transparencia total</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
              INFORMACIÓN <span className="text-emerald-700">NUTRICIONAL</span>
            </h2>
            <p className="text-gray-600 mt-2 text-sm">Conoce exactamente lo que le das a tu cuerpo. Sin secretos, sin ingredientes ocultos.</p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll>
          <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 overflow-hidden">
            {/* Header badge */}
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pill className="w-5 h-5 text-white" />
                <span className="text-white font-bold text-sm">COLI Plus</span>
              </div>
              <span className="bg-white/20 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">REGISTRO INVIMA NSA-0012423-2022</span>
            </div>
            {/* Nutritional table image */}
            <div className="p-3">
              <img
                src="/images/tabla-nutricional.png"
                alt="Tabla de Información Nutricional ColiPlus - Registro INVIMA NSA-0012423-2022"
                className="w-full h-auto rounded-xl"
                loading="lazy"
              />
            </div>
            {/* Key highlights below the image */}
            <div className="px-5 pb-4 grid grid-cols-3 gap-2">
              <div className="bg-emerald-50 rounded-xl p-3 text-center">
                <p className="text-emerald-700 font-extrabold text-lg">0g</p>
                <p className="text-emerald-600 text-[10px] font-medium">Azúcar</p>
              </div>
              <div className="bg-emerald-50 rounded-xl p-3 text-center">
                <p className="text-emerald-700 font-extrabold text-lg">3g</p>
                <p className="text-emerald-600 text-[10px] font-medium">Fibra/porción</p>
              </div>
              <div className="bg-emerald-50 rounded-xl p-3 text-center">
                <p className="text-emerald-700 font-extrabold text-lg">34</p>
                <p className="text-emerald-600 text-[10px] font-medium">Calorías</p>
              </div>
            </div>
          </div>
        </RevealOnScroll>

        <RevealOnScroll>
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center">
            <p className="text-amber-800 text-sm font-bold flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              Producto registrado y verificado ante INVIMA
            </p>
            <p className="text-amber-600 text-xs mt-1">Sin azúcar · Sin edulcorantes · Sin conservantes</p>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}

/* ─── SECTION 5: ¿CÓMO CONSUMIRLO? ─── */

function HowToConsumeSection() {
  return (
    <section className="bg-white py-12 px-4">
      <div className="max-w-lg mx-auto">
        <RevealOnScroll>
          <div className="text-center mb-8">
            <span className="text-amber-600 font-bold text-sm uppercase tracking-wider">Súper fácil</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
              ¿CÓMO <span className="text-emerald-700">CONSUMIRLO</span>?
            </h2>
          </div>
        </RevealOnScroll>

        <div className="space-y-4">
          {[
            {
              num: '1',
              emoji: '🥄',
              title: 'Disuelve 1 cucharada dosificadora',
              desc: 'En un vaso de agua tibia o a temperatura ambiente. Se mezcla fácilmente.',
            },
            {
              num: '2',
              emoji: '🍯',
              title: 'No necesita endulzar',
              desc: 'Tiene un sabor agradable natural. Sin azúcar ni edulcorantes añadidos.',
            },
            {
              num: '3',
              emoji: '🕐',
              title: '1-2 veces al día',
              desc: 'En la mañana en ayunas o en la noche antes de dormir. Elige el momento que mejor se adapte a tu rutina.',
            },
          ].map((step, i) => (
            <RevealOnScroll key={i} delay={i * 0.12}>
              <div className="flex items-start gap-4 bg-gradient-to-r from-emerald-50 to-white rounded-2xl p-5 border border-emerald-100">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-emerald-200">
                  <span className="text-2xl">{step.emoji}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">Paso {step.num}</span>
                  </div>
                  <h3 className="font-bold text-gray-900">{step.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{step.desc}</p>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        {/* Who can / Who can't */}
        <RevealOnScroll>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h4 className="font-bold text-emerald-800 text-sm">SÍ PUEDEN</h4>
              </div>
              <ul className="space-y-1.5">
                {['Personas desde 14 años', 'Diabéticos', 'Hipertensos', 'Personas con estreñimiento'].map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-emerald-700">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Ban className="w-5 h-5 text-rose-600" />
                <h4 className="font-bold text-rose-800 text-sm">NO PUEDEN</h4>
              </div>
              <ul className="space-y-1.5">
                {['Mujeres embarazadas', 'Menores de 14 años'].map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-rose-700">
                    <X className="w-3 h-3 text-rose-500 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-[10px] text-rose-500 mt-2 leading-relaxed">*Sin azúcar NI edulcorantes</p>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}

/* ─── SECTION 6: PRICING / OFERTA ─── */

const PRICING_PLANS = [
  {
    id: 1,
    qty: 1,
    label: '1 Unidad',
    price: 75900,
    priceDisplay: '$75.900',
    priceEarly: 72105,
    priceEarlyDisplay: '$72.105',
    perUnit: '$75.900 c/u',
    perUnitEarly: '$72.105 c/u',
    badge: null,
    border: 'border-gray-200 hover:border-emerald-300',
    waContra: 'Hola, quiero ordenar 1 unidad de ColiPlus por $75.900. Modalidad: Pago contra entrega.',
    waAnticipado: 'Hola, quiero ordenar 1 unidad de ColiPlus por $72.105 con 5% OFF. Modalidad: Pago anticipado con prioridad en despacho.',
  },
  {
    id: 2,
    qty: 2,
    label: '2 Unidades',
    price: 113850,
    priceDisplay: '$113.850',
    priceEarly: 108158,
    priceEarlyDisplay: '$108.158',
    perUnit: '$56.925 c/u',
    perUnitEarly: '$54.079 c/u',
    badge: '🔥 MÁS POPULAR',
    border: 'border-amber-300 hover:border-amber-400',
    waContra: 'Hola, quiero ordenar 2 unidades de ColiPlus por $113.850. Modalidad: Pago contra entrega.',
    waAnticipado: 'Hola, quiero ordenar 2 unidades de ColiPlus por $108.158 con 5% OFF. Modalidad: Pago anticipado con prioridad en despacho.',
  },
  {
    id: 3,
    qty: 3,
    label: 'Paga 2 Lleva 3',
    price: 151800,
    priceDisplay: '$151.800',
    priceEarly: 144210,
    priceEarlyDisplay: '$144.210',
    perUnit: '$50.600 c/u',
    perUnitEarly: '$48.070 c/u',
    badge: '🏆 MÁXIMO AHORRO',
    border: 'border-emerald-400 hover:border-emerald-500',
    waContra: 'Hola, quiero la promo Paga 2 Lleva 3 de ColiPlus por $151.800. Modalidad: Pago contra entrega.',
    waAnticipado: 'Hola, quiero la promo Paga 2 Lleva 3 de ColiPlus por $144.210 con 5% OFF. Modalidad: Pago anticipado con prioridad en despacho.',
  },
  {
    id: 4,
    qty: 5,
    label: 'Paquete Familiar',
    price: 227700,
    priceDisplay: '$227.700',
    priceEarly: 216315,
    priceEarlyDisplay: '$216.315',
    perUnit: '$45.540 c/u',
    perUnitEarly: '$43.263 c/u',
    badge: '👨‍👩‍👧‍👦 PAGA 3 LLEVA 5',
    border: 'border-rose-400 hover:border-rose-500',
    waContra: 'Hola, quiero el Paquete Familiar Paga 3 Lleva 5 de ColiPlus por $227.700. Modalidad: Pago contra entrega.',
    waAnticipado: 'Hola, quiero el Paquete Familiar Paga 3 Lleva 5 de ColiPlus por $216.315 con 5% OFF. Modalidad: Pago anticipado con prioridad en despacho.',
  },
]

function PricingSection() {
  return (
    <section id="oferta" className="bg-gradient-to-b from-emerald-50 to-white py-12 px-4">
      <div className="max-w-lg mx-auto">
        <RevealOnScroll>
          <div className="text-center mb-8">
            <span className="text-amber-600 font-bold text-sm uppercase tracking-wider">Oferta especial</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
              ELIGE TU <span className="text-emerald-700">PLAN</span>
            </h2>
            <p className="text-gray-600 mt-2 text-sm">Elige cómo quieres pagar · Envío a toda Colombia</p>
          </div>
        </RevealOnScroll>

        <div className="space-y-4">
          {PRICING_PLANS.map((plan, i) => (
            <RevealOnScroll key={plan.id} delay={i * 0.08}>
              <div className={`bg-white rounded-2xl border-2 ${plan.border} overflow-hidden relative transition-colors`}>
                {plan.badge && (
                  <div className="absolute top-3 right-3 bg-amber-400 text-amber-900 text-xs font-extrabold px-3 py-1 rounded-full z-10 shadow-md">
                    {plan.badge}
                  </div>
                )}
                <div className="p-5">
                  {/* Product bottles */}
                  <div className="flex items-end justify-center gap-1.5 mb-3" style={{ minHeight: '80px' }}>
                    {[...Array(plan.qty)].map((_, j) => (
                      <img
                        key={j}
                        src="/images/coliplus-bottle.png"
                        alt={`ColiPlus frasco ${j + 1}`}
                        className="object-contain"
                        style={{
                          width: plan.qty === 1 ? '70px' : plan.qty === 2 ? '55px' : plan.qty === 3 ? '48px' : '40px',
                          height: plan.qty === 1 ? '80px' : plan.qty === 2 ? '65px' : plan.qty === 3 ? '58px' : '50px',
                        }}
                      />
                    ))}
                  </div>

                  {/* Plan name */}
                  <h3 className="font-extrabold text-gray-900 text-xl text-center">{plan.label}</h3>

                  {/* Price */}
                  <div className="text-center mt-2">
                    <p className="text-3xl font-extrabold text-emerald-700">{plan.priceDisplay}</p>
                    <p className="text-sm text-gray-500">{plan.perUnit}</p>
                  </div>

                  {/* Savings badge */}
                  {plan.qty > 1 && (
                    <div className="mt-2 text-center">
                      <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full">
                        Ahorra {Math.round((1 - plan.price / (plan.qty * 75900)) * 100)}% vs unidad
                      </span>
                    </div>
                  )}

                  {/* Gift reminder */}
                  <div className="mt-3 text-center">
                    <span className="text-amber-600 text-xs font-bold">🎁 + Loción Termoactiva GRATIS</span>
                  </div>

                  {/* ─── TWO CTA BUTTONS ─── */}
                  <div className="mt-4 space-y-2.5">

                    {/* BUTTON 1: PAGO ANTICIPADO — highlighted, dopaminergic */}
                    <a
                      href={`https://wa.me/573214487903?text=${encodeURIComponent(plan.waAnticipado)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center relative overflow-hidden rounded-2xl shadow-lg transition-all duration-200 pulse-cta group"
                    >
                      {/* Auto-animated shimmer effect */}
                      <div className="absolute inset-0 shimmer pointer-events-none" />
                      <div className="relative bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 py-4 px-6">
                        <div className="flex items-center justify-center gap-2">
                          <Zap className="w-5 h-5 text-amber-900" />
                          <div>
                            <p className="text-amber-900 font-extrabold text-base leading-tight">PAGO ANTICIPADO</p>
                            <p className="text-amber-800/80 text-xs font-bold">5% OFF · Prioridad despacho</p>
                          </div>
                        </div>
                        <p className="text-amber-900 font-extrabold text-xl mt-1">{plan.priceEarlyDisplay}</p>
                        <p className="text-amber-800/70 text-[10px] font-semibold">{plan.perUnitEarly}</p>
                      </div>
                    </a>

                    {/* BUTTON 2: PAGO CONTRA ENTREGA */}
                    <a
                      href={`https://wa.me/573214487903?text=${encodeURIComponent(plan.waContra)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-extrabold text-base py-3.5 px-6 rounded-2xl shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Truck className="w-4 h-4" />
                        <span>PAGO CONTRA ENTREGA</span>
                      </div>
                      <p className="text-emerald-100 text-xs font-semibold mt-0.5">Pagas solo cuando lo recibes</p>
                    </a>

                  </div>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll>
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              <Lock className="w-3 h-3 inline mr-1" />
              Compra segura · <span className="text-amber-600 font-semibold">🎁 Loción GRATIS incluida</span>
            </p>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}

/* ─── SECTION 7: ¿SABÍAS QUE...? (PROBLEM) ─── */

function DidYouKnowSection() {
  return (
    <section className="bg-gradient-to-b from-rose-50 to-rose-100/50 py-12 px-4">
      <div className="max-w-lg mx-auto">
        <RevealOnScroll>
          <div className="text-center mb-6">
            <span className="text-rose-500 font-bold text-sm uppercase tracking-wider">¡Alerta!</span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-1 leading-tight px-2">
              ¿Sabías que las enfermedades más comunes son a causa de un <span className="text-rose-500">colon sucio</span>?
            </h2>
          </div>
        </RevealOnScroll>

        <div className="space-y-3">
          {DISEASE_FACTS.map((fact, i) => (
            <RevealOnScroll key={i} delay={i * 0.08}>
              <div className="flex items-start gap-3 bg-white rounded-xl p-3.5 border border-rose-100 shadow-sm">
                <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700 leading-relaxed">{fact}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll>
          <div className="mt-6 bg-rose-600 text-white rounded-2xl p-5 text-center">
            <p className="font-bold text-base mb-2">¡No esperes a que sea demasiado tarde!</p>
            <p className="text-rose-100 text-sm mb-4">Tu cuerpo necesita fibra prebiótica para mantener el colon limpio y funcionando correctamente.</p>
            <a
              href="https://wa.me/573214487903?text=Hola%2C%20quiero%20limpiar%20mi%20colon%20con%20ColiPlus%20YA"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-rose-600 font-extrabold text-base py-3 px-8 rounded-2xl shadow-lg transition-all hover:bg-rose-50"
            >
              Quiero limpiar mi colon YA →
            </a>
            <PaymentStrip />
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}

/* ─── SECTION 8: BENEFITS CHECKLIST ─── */

function BenefitsChecklist() {
  const benefits = [
    'Mejora la salud del colon naturalmente',
    'Limpia el sistema digestivo de toxinas',
    'Combate el estreñimiento sin irritar',
    'Elimina la inflamación y la hinchazón',
    'Alivia la pesadez después de comer',
    'Equilibra la digestión de forma natural',
    'Promueve una piel saludable y radiante',
    'Regula el tránsito intestinal',
    'Reduce los gases y la molestia abdominal',
    'Seguro para diabéticos e hipertensos',
    'Sin azúcar ni edulcorantes artificiales',
    'Sabor agradable, fácil de consumir',
  ]

  return (
    <section className="bg-white py-12 px-4">
      <div className="max-w-lg mx-auto">
        <RevealOnScroll>
          <div className="text-center mb-8">
            <span className="text-emerald-600 font-bold text-sm uppercase tracking-wider">Todo lo que hace por ti</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
              Beneficios de <span className="text-emerald-700">ColiPlus</span>
            </h2>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {benefits.map((b, i) => (
            <RevealOnScroll key={i} delay={i * 0.05}>
              <div className="flex items-start gap-2.5 bg-emerald-50/50 rounded-xl p-3 border border-emerald-100">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700 font-medium">{b}</span>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll>
          <div className="mt-6 text-center">
            <a
              href="https://wa.me/573214487903?text=Hola%2C%20quiero%20todos%20los%20beneficios%20de%20ColiPlus%20para%20mi%20digesti%C3%B3n"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold text-base py-3.5 px-8 rounded-2xl shadow-lg shadow-emerald-200"
            >
              ¡Quiero todos estos beneficios! →
            </a>
            <PaymentStrip />
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}

/* ─── SECTION 9: INVIMA REGISTRATION ─── */

function InvimaSection() {
  return (
    <section className="bg-gradient-to-b from-emerald-800 to-emerald-900 py-10 px-4">
      <div className="max-w-lg mx-auto">
        <RevealOnScroll>
          <div className="text-center">
            <ShieldCheck className="w-16 h-16 text-amber-300 mx-auto mb-3" />
            <h2 className="text-2xl font-extrabold text-white mb-2">Producto Registrado ante el INVIMA</h2>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 max-w-sm mx-auto">
              <p className="text-amber-300 text-lg font-bold mb-1">Registro INVIMA</p>
              <p className="text-white text-3xl font-extrabold tracking-wide mb-3">NSA-0012423-2022</p>
              <div className="w-16 h-0.5 bg-amber-400 mx-auto mb-3" />
              <p className="text-emerald-100 text-sm leading-relaxed">
                Este registro garantiza que ColiPlus cumple con todos los requisitos de seguridad, calidad y eficacia exigidos por las autoridades sanitarias colombianas.
              </p>
            </div>
            <div className="mt-4 flex items-center justify-center gap-4">
              <img src="/images/sellos-adara.png" alt="Certificaciones y sellos" className="h-12 object-contain opacity-90" />
            </div>
            <p className="text-emerald-200 text-xs mt-3">Compra con confianza. Producto 100% original y certificado.</p>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}

/* ─── SECTION 10: ¿POR QUÉ ES TAN EFECTIVO? ─── */

function WhyEffectiveSection() {
  return (
    <section className="bg-white py-12 px-4">
      <div className="max-w-lg mx-auto">
        <RevealOnScroll>
          <div className="text-center mb-8">
            <span className="text-amber-600 font-bold text-sm uppercase tracking-wider">La ciencia detrás</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
              ¿Por qué es tan <span className="text-emerald-700">efectivo</span>?
            </h2>
            <p className="text-gray-600 mt-2 text-sm">Cada ingrediente fue seleccionado por su efecto comprobado en la salud digestiva</p>
          </div>
        </RevealOnScroll>

        <div className="space-y-4">
          {INGREDIENT_DEEP.map((ing, i) => (
            <RevealOnScroll key={i} delay={i * 0.1}>
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <Leaf className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">{ing.name}</h3>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mb-2">{ing.benefit}</p>
                <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100">
                  <p className="text-xs text-emerald-700 leading-relaxed">
                    <strong>💡 Dato clave:</strong> {ing.detail}
                  </p>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll>
          <div className="mt-6 text-center">
            <a
              href="https://wa.me/573214487903?text=Hola%2C%20quiero%20experimentar%20la%20diferencia%20con%20ColiPlus"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold text-base py-3.5 px-8 rounded-2xl shadow-lg shadow-emerald-200"
            >
              Experimenta la diferencia →
            </a>
            <PaymentStrip />
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}

/* ─── SECTION 11: ¿POR QUÉ ES TU MEJOR OPCIÓN? ─── */

function BestOptionSection() {
  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-lg mx-auto">
        <RevealOnScroll>
          <div className="text-center mb-8">
            <span className="text-amber-600 font-bold text-sm uppercase tracking-wider">Sin comparación</span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-1 leading-tight">
              ¿Por qué es Tu <span className="text-emerald-700">Mejor Opción</span>?
            </h2>
            <p className="text-gray-600 mt-2 text-sm">Compara y decide tú misma</p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            {/* Header */}
            <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-200">
              <div className="p-3 text-xs font-bold text-gray-500">CARACTERÍSTICA</div>
              <div className="p-3 text-center text-xs font-extrabold text-emerald-700 bg-emerald-50">COLIPLUS</div>
              <div className="p-3 text-center text-xs font-bold text-gray-400">OTRAS FIBRAS</div>
            </div>
            {/* Rows */}
            {COMPARISON_ITEMS.map((item, i) => (
              <div key={i} className={`grid grid-cols-3 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} ${i < COMPARISON_ITEMS.length - 1 ? 'border-b border-gray-100' : ''}`}>
                <div className="p-3 text-xs text-gray-600 font-medium">{item.feature}</div>
                <div className="p-3 text-center bg-emerald-50/30">
                  {item.coliplus ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />
                  ) : (
                    <X className="w-5 h-5 text-gray-300 mx-auto" />
                  )}
                </div>
                <div className="p-3 text-center">
                  {item.others ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />
                  ) : (
                    <X className="w-5 h-5 text-red-400 mx-auto" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </RevealOnScroll>

        <RevealOnScroll>
          <div className="mt-5 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center">
            <p className="text-emerald-700 text-sm font-bold">
              ✅ ColiPlus es la única fibra con 10 ingredientes naturales, registro INVIMA y segura para diabéticos
            </p>
          </div>
          <div className="mt-4 text-center">
            <a
              href="https://wa.me/573214487903?text=Hola%2C%20quiero%20elegir%20la%20mejor%20opci%C3%B3n%20de%20ColiPlus%20para%20m%C3%AD"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold text-base py-3.5 px-8 rounded-2xl shadow-lg shadow-emerald-200"
            >
              Elige la mejor opción →
            </a>
            <PaymentStrip />
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}

/* ─── SECTION 12: MORE TESTIMONIALS ─── */

function MoreTestimonialsSection() {
  const [showAll, setShowAll] = useState(false)
  const displayed = showAll ? TESTIMONIALS : TESTIMONIALS.slice(0, 6)

  return (
    <section className="bg-white py-12 px-4">
      <div className="max-w-lg mx-auto">
        <RevealOnScroll>
          <div className="text-center mb-8">
            <span className="text-emerald-600 font-bold text-sm uppercase tracking-wider">Historias reales</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
              Lo que dicen nuestros <span className="text-emerald-700">usuarios</span>
            </h2>
            <div className="flex items-center justify-center gap-2 mt-2">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-sm text-gray-600 font-bold">4.9/5</span>
              <span className="text-xs text-gray-500">(8,700+ opiniones)</span>
            </div>
          </div>
        </RevealOnScroll>

        <div className="space-y-4 max-h-[700px] overflow-y-auto custom-scrollbar pr-1">
          {displayed.map((t, i) => (
            <RevealOnScroll key={i} delay={i * 0.05}>
              <div className="testimonial-card bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-bold text-sm text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.city} · <span className="text-emerald-600">Compra verificada ✓</span></p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                    t.tag === 'Cambió mi Vida' ? 'bg-emerald-100 text-emerald-700' :
                    t.tag === 'Superó mis Expectativas' ? 'bg-amber-100 text-amber-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>
                    {t.tag}
                  </span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed italic">"{t.text}"</p>
                <div className="flex gap-0.5 mt-2">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        {!showAll && (
          <RevealOnScroll>
            <button
              onClick={() => setShowAll(true)}
              className="mt-4 w-full text-center text-sm font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 py-3 rounded-xl transition-colors"
            >
              Ver más testimonios ({TESTIMONIALS.length - 6} más) ↓
            </button>
          </RevealOnScroll>
        )}
      </div>
    </section>
  )
}

/* ─── SECTION 13: FAQ ─── */

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-lg mx-auto">
        <RevealOnScroll>
          <div className="text-center mb-8">
            <span className="text-emerald-600 font-bold text-sm uppercase tracking-wider">Resolvemos tus dudas</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
              PREGUNTAS <span className="text-emerald-700">FRECUENTES</span>
            </h2>
          </div>
        </RevealOnScroll>

        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <RevealOnScroll key={i} delay={i * 0.04}>
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-bold text-gray-900 pr-4">{faq.q}</span>
                  {openIndex === i ? (
                    <ChevronUp className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-0">
                        <div className="bg-emerald-50/50 rounded-xl p-3">
                          <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── SECTION 14: GIFT / OBSEQUIO ─── */

function GiftSection() {
  return (
    <section className="bg-gradient-to-b from-amber-50 to-amber-100/50 py-12 px-4">
      <div className="max-w-lg mx-auto">
        <RevealOnScroll>
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-amber-400 text-amber-900 text-sm font-extrabold px-4 py-2 rounded-full mb-3 shadow-md">
              <Gift className="w-5 h-5" />
              OBSEQUIO ESPECIAL
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              ¡Loción Termoactiva <span className="text-amber-600">GRATIS</span>!
            </h2>
            <p className="text-gray-600 mt-2 text-sm">Con cada pedido de ColiPlus, te llevas GRATIS una Loción Termoactiva Allpa Natural</p>
          </div>
        </RevealOnScroll>

        {/* Gift product photo on yellow background */}
        <RevealOnScroll>
          <div className="bg-gradient-to-br from-amber-400 to-amber-300 rounded-2xl overflow-hidden shadow-lg shadow-amber-200/50 mb-6 p-6">
            <img
              src="/images/locion-termoactiva.jpg"
              alt="Loción Termoactiva Allpa Natural - Obsequio GRATIS con tu pedido"
              className="w-full object-contain max-h-72 mx-auto"
            />
          </div>
        </RevealOnScroll>

        {/* Gift details */}
        <RevealOnScroll>
          <div className="bg-white rounded-2xl p-5 border border-amber-200 shadow-sm mb-6">
            <h3 className="font-extrabold text-gray-900 text-lg mb-2 text-center">Loción Termoactiva Allpa Natural</h3>
            <div className="space-y-2">
              {[
                'Activación térmica que potencia la reducción de medidas',
                'Fórmula natural con extractos botánicos',
                'Ideal para complementar tu bienestar digestivo',
                'Aplica en abdomen y zonas deseadas',
              ].map((b, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">{b}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center bg-amber-50 rounded-xl p-3 border border-amber-200">
              <p className="text-amber-700 font-bold text-sm">🎁 Valor: GRATIS con tu pedido de ColiPlus</p>
              <p className="text-amber-600 text-xs mt-1">¡No te quedes sin la tuya! Stock limitado</p>
            </div>
          </div>
        </RevealOnScroll>

        <RevealOnScroll>
          <div className="mt-6 text-center">
            <a
              href="https://wa.me/573214487903?text=Hola%20quiero%20mi%20obsequio%20GRATIS%20de%20Loci%C3%B3n%20Termoactiva%20con%20mi%20pedido%20de%20ColiPlus"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-amber-900 text-center font-extrabold text-lg py-4 px-6 rounded-2xl shadow-lg shadow-amber-200 transition-all duration-200 pulse-cta"
            >
              🎁 ¡QUIERO MI OBSEQUIO GRATIS!
            </a>
            <PaymentStrip />
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}

/* ─── SECTION: FINAL CTA ─── */

function FinalCTA() {
  return (
    <section className="bg-gradient-to-b from-emerald-800 to-emerald-900 py-12 px-4">
      <div className="max-w-lg mx-auto text-center">
        <RevealOnScroll>
          <Sparkles className="w-12 h-12 text-amber-300 mx-auto mb-3" />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
            Tu bienestar digestivo está a un clic
          </h2>
          <p className="text-emerald-100 mb-2">Más de 8,700 personas ya recuperaron su salud intestinal con ColiPlus</p>
          <p className="text-amber-300 font-bold text-sm mb-6">🎁 + Loción Termoactiva GRATIS con tu pedido</p>
          <a
            href="https://wa.me/573214487903?text=Hola%2C%20quiero%20ordenar%20ColiPlus%20AHORA%20con%20la%20promo%20del%20obsequio%20GRATIS"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-emerald-900 text-center font-extrabold text-xl py-5 px-6 rounded-2xl shadow-lg shadow-amber-500/30 transition-all duration-200 pulse-cta"
          >
            ¡ORDENAR COLIPLUS AHORA! 🌿
          </a>
          <PaymentStrip />
          <div className="mt-2 flex items-center justify-center gap-4 text-emerald-200 text-xs">
            <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5" /> Envío nacional</span>
            <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> INVIMA</span>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}

/* ─── STICKY CTA BAR ─── */

function StickyCTA() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 600)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="sticky-cta-bar bg-white/95 border-t border-emerald-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]"
        >
          <div className="max-w-lg mx-auto flex items-center gap-3">
            <div className="flex-1">
              <p className="text-xs font-bold text-gray-900">ColiPlus + Loción GRATIS</p>
              <p className="text-[10px] text-gray-500">Pago contra entrega · <span className="text-amber-600 font-bold">5% OFF anticipado</span></p>
            </div>
            <a
              href="https://wa.me/573214487903?text=Hola%2C%20quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20ColiPlus%20y%20la%20promoci%C3%B3n%20del%20obsequio%20GRATIS"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-extrabold text-sm py-3 px-5 rounded-xl shadow-md shadow-emerald-200 flex-shrink-0 transition-all"
            >
              MÁS INFO 📱
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ─── FOOTER ─── */

function Footer() {
  return (
    <footer className="bg-emerald-900 py-6 px-4">
      <div className="max-w-lg mx-auto text-center">
        <p className="text-emerald-200 text-xs">
          ColiPlus · Fibra Prebiótica Natural para Bienestar Digestivo
        </p>
        <p className="text-emerald-300/60 text-[10px] mt-1">
          Registro INVIMA: NSA-0012423-2022
        </p>
        <p className="text-emerald-300/40 text-[10px] mt-1">
          Este producto no reemplaza el tratamiento médico. Consulta a tu médico si tienes condiciones específicas.
        </p>
        <div className="mt-3 flex items-center justify-center gap-2">
          <Lock className="w-3 h-3 text-emerald-400" />
          <span className="text-[10px] text-emerald-300/50">Compra 100% segura</span>
        </div>
      </div>
    </footer>
  )
}

/* ─── MAIN PAGE ─── */

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col bg-white">
      <TopBar />
      <HeroSection />
      <PricingSection />
      <TestimonialPhotos indices={[0, 1, 2]} />
      <GiftReminder />
      <TestimonialCarousel />
      <SocialProofBlock
        src="/images/social-proof-whatsapp.png"
        alt="Conversaciones reales de clientes de ColiPlus por WhatsApp"
        label="COMPRAS REALES VERIFICADAS POR WHATSAPP"
      />
      <WhyChooseSection />
      <GiftReminder />
      <IngredientsSection />
      <NutritionalInfoSection />
      <HowToConsumeSection />
      <TestimonialPhotos indices={[3, 4, 5]} />
      <SocialProofBlock
        src="/images/social-proof-testimonials.png"
        alt="Testimonios verificados de clientes ColiPlus con resultados reales"
        label="TESTIMONIOS VERIFICADOS · 5 ESTRELLAS ⭐⭐⭐⭐⭐"
      />
      <PricingSection />
      <DidYouKnowSection />
      <GiftReminder />
      <BenefitsChecklist />
      <TestimonialPhotos indices={[6, 0, 1]} />
      <InvimaSection />
      <WhyEffectiveSection />
      <BestOptionSection />
      <TestimonialPhotos indices={[2, 3, 4]} />
      <MoreTestimonialsSection />
      <SocialProofBlock
        src="/images/social-proof-reviews.png"
        alt="Reseñas verificadas de compradores reales de ColiPlus"
        label="RESEÑAS DE COMPRADORES VERIFICADOS"
      />
      <FAQSection />
      <TestimonialPhotos indices={[5, 6, 0]} />
      <PricingSection />
      <GiftSection />
      <FinalCTA />
      <Footer />
      <StickyCTA />
    </main>
  )
}
