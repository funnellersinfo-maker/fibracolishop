'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  Star, Shield, Truck, Clock, CheckCircle2, ChevronDown, ChevronUp,
  MessageCircle, Heart, Leaf, Droplets, Zap, RefreshCw, Package,
  Phone, Lock, Gift, Award, Users, ThumbsUp, ArrowRight, X,
  AlertCircle, Info, Sparkles, Timer, ShieldCheck, Ban
} from 'lucide-react'

/* ─── DATA ──────────────────────────────────────────────────────── */

const TESTIMONIALS = [
  { name: 'María Fernanda', city: 'Bogotá', initials: 'MF', color: '#059669', text: 'Llevaba 3 años sufriendo de estreñimiento crónico. Probé de todo y nada me funcionaba. Desde que tomé Fibra Coli, voy al baño todos los días sin esfuerzo. ¡No puedo creer el cambio!', objection: 'Escepticismo' },
  { name: 'Claudia Elena', city: 'Medellín', initials: 'CE', color: '#d97706', text: 'Mi abdomen se inflamaba tanto que parecía embarazada de 5 meses. Tenía pena hasta salir de la casa. Después de 2 semanas con Fibra Coli, mi barriga se desinflamó notablemente. Me siento liviana otra vez.', objection: 'Funciona' },
  { name: 'Sandra Milena', city: 'Cali', initials: 'SM', color: '#7c3aed', text: 'Los gases me daban pena en las reuniones. Era un suplicio. Ahora mi digestión es súper tranquila. Hasta mi esposo nota la diferencia porque ya no me quejo.', objection: 'Vergüenza' },
  { name: 'Yolanda Pérez', city: 'Barranquilla', initials: 'YP', color: '#dc2626', text: 'Tenía miedo de comprar por internet, pero el pago contra entrega me dio confianza. Cuando vi el paquete, supe que era real. Llevo 1 mes y mi digestión cambió por completo.', objection: 'Desconfianza online' },
  { name: 'Ana Beatriz', city: 'Bucaramanga', initials: 'AB', color: '#0891b2', text: 'Soy enfermera y paso turnos largos sin ir al baño. Eso me arruinó el tránsito intestinal. Fibra Coli me ayudó a regularizarme de forma natural, sin laxantes agresivos.', objection: 'Estilo de vida ocupado' },
  { name: 'Patricia Gómez', city: 'Pereira', initials: 'PG', color: '#059669', text: 'Después de la menopausia, mi digestión se volvió un desastre. Pesadez, gases, estreñimiento... Mi ginecóloga me recomendó fibra y Fibra Coli fue la mejor opción. Me siento 10 años más joven.', objection: 'Cambios hormonales' },
  { name: 'Lucía Restrepo', city: 'Manizales', initials: 'LR', color: '#d97706', text: 'Pensé que era normal sentirse pesada después de comer. NO LO ES. Desde Fibra Coli, como tranquila y termino el día sin esa molestia horrible en el estómago. Debería haberlo tomado antes.', objection: 'Normalizar el dolor' },
  { name: 'Rosa Inés', city: 'Cartagena', initials: 'RI', color: '#7c3aed', text: 'Me gasté una fortuna en médicos y exámenes. Todo salía "normal". Pero yo me sentía mal. Fibra Coli fue lo único que realmente me dio alivio. A veces la solución es más sencilla de lo que creemos.', objection: 'Frustración médica' },
  { name: 'Gloria Stella', city: 'Ibagué', initials: 'GS', color: '#dc2626', text: 'Probé otras fibras y me daban más gases o sabían horrible. Fibra Coli es diferente: sabor agradable, sin efectos secundarios y realmente funciona. Ya voy por mi tercer frasco.', objection: 'Malas experiencias previas' },
  { name: 'Marta Cecilia', city: 'Villavicencio', initials: 'MC', color: '#0891b2', text: 'Vivo en el campo y pensé que no me llegaría. ¡Me llegó en 3 días! El envío fue rapidísimo. Ahora mi vecina también lo pidió. Ambas estamos felices con los resultados.', objection: 'Ubicación remota' },
  { name: 'Diana Marcela', city: 'Pasto', initials: 'DM', color: '#059669', text: 'Tenía 5 días sin ir al baño. Era desesperante. Empecé Fibra Coli y al tercer día ya sentí alivio. No sé qué tiene este producto pero es un bendito. Lo recomiendo con los ojos cerrados.', objection: 'Estreñimiento severo' },
  { name: 'Carmen Alicia', city: 'Montería', initials: 'CA', color: '#d97706', text: 'Mi mamá de 72 años no podía ir al baño bien. Le compré Fibra Coli y en una semana ya estaba regularizada. Ella dice que es el mejor regalo que le he dado. Gracias por este producto.', objection: 'Edad avanzada' },
  { name: 'Natalia Andrea', city: 'Cúcuta', initials: 'NA', color: '#7c3aed', text: 'La pesadez después de comer me quitaba las ganas de hacer cualquier cosa. Era como si tuviera una piedra en el estómago. Con Fibra Coli, la comida ya no me pesa. Vuelvo a disfrutar comer.', objection: 'Pesadez post-comida' },
  { name: 'Juliana Vargas', city: 'Armenia', initials: 'JV', color: '#dc2626', text: 'No quería depender de pastillas. Buscaba algo natural. Fibra Coli tiene ingredientes que reconozco y confío. Es fibra de verdad, no químicos raros. Eso me dio tranquilidad.', objection: 'Preferencia natural' },
  { name: 'Beatriz Adriana', city: 'Popayán', initials: 'BA', color: '#0891b2', text: 'Compré solo 1 frasco para probar. Gran error. A las 2 semanas ya quería más y tuve que esperar el reenvío. Ahora compro de 3 en 3. No me quedo sin mi Fibra Coli ni un día.', objection: 'Comprar poco' },
  { name: 'Ángela Rocío', city: 'Sincelejo', initials: 'AR', color: '#059669', text: 'Mi colon se saturó por años de mala alimentación. El médico me dijo que necesitaba fibra urgente. Encontré Fibra Coli y ha sido mi salvación. Ya no tengo esas crisis de dolor.', objection: 'Diagnóstico médico' },
  { name: 'Silvia Lorena', city: 'Valledupar', initials: 'SL', color: '#d97706', text: 'Les mentiría si dijera que funcionó en 1 día. Me tomó como 5 días sentir el cambio. Pero una vez que empezó, fue progresivo y cada día mejor. Paciencia y constancia, vale la pena.', objection: 'Expectativas inmediatas' },
  { name: 'Fabiola Torres', city: 'Neiva', initials: 'FT', color: '#7c3aed', text: 'El sabor es rico, no como otras fibras que saben a cartón. Lo tomo con jugo de naranja en la mañana y se siente como un ritual de cuidado personal. Me encanta empezar el día así.', objection: 'Sabor desagradable' },
  { name: 'Leidy Johana', city: 'Tunja', initials: 'LJ', color: '#dc2626', text: 'Trabajo sentada todo el día y eso mató mi digestión. Desde que tomo Fibra Coli y camino 20 minutos, mi cuerpo funciona como reloj. La combinación es perfecta.', objection: 'Vida sedentaria' },
  { name: 'Adriana Pardo', city: 'Florencia', initials: 'AP', color: '#0891b2', text: 'La atención por WhatsApp fue espectacular. Me resolvieron todas las dudas antes de comprar. Eso me dio mucha confianza. Y el producto cumplió todo lo que prometen. 100% recomendado.', objection: 'Dudas pre-compra' },
]

const INGREDIENTS = [
  { name: 'Psyllium (Plantago ovata)', desc: 'Fibra soluble que forma un gel suave en el intestino, facilitando el tránsito sin irritar. Es la fibra más recomendada por gastroenterólogos.', icon: '🌿' },
  { name: 'Inulina de Agave', desc: 'Prebiótico natural que alimenta las bacterias buenas de tu intestino. Mejora la flora intestinal y potencia tu digestión desde la raíz.', icon: '🌱' },
  { name: 'Fibra de Avena', desc: 'Regula el azúcar en sangre y ayuda a reducir el colesterol. Una fibra suave que protege tu intestino mientras nutre tu cuerpo.', icon: '🌾' },
  { name: 'Extracto de Sen', desc: 'Planta natural usada por siglos para aliviar el estreñimiento ocasional. Actúa suavemente estimulando el movimiento intestinal.', icon: '🍃' },
  { name: 'Papaya enzimática', desc: 'Contiene papaína, una enzima que descompuye los alimentos y reduce la hinchazón. Ideal para la pesadez después de comer.', icon: '🧡' },
  { name: 'Probióticos (Lactobacillus)', desc: 'Bacterias beneficiosas que restauran el equilibrio de tu microbioma intestinal. Refuerzan tus defensas y mejoran la digestión.', icon: '🦠' },
]

const FAQS = [
  { q: '¿Qué es Fibra Coli exactamente?', a: 'Fibra Coli es un suplemento alimenticio formulado con fibra natural, prebióticos y probióticos diseñado específicamente para mejorar tu tránsito intestinal, reducir la inflamación abdominal y recuperar el bienestar digestivo. No es un medicamento, es un complemento alimenticio.' },
  { q: '¿Cuánto tiempo tarda en hacer efecto?', a: 'La mayoría de nuestras clientas notan los primeros cambios entre el día 3 y el día 7 de uso constante. Los resultados más significativos se ven a partir de la segunda semana. Cada organismo es diferente, por eso recomendamos tomarlo mínimo 30 días.' },
  { q: '¿Tiene efectos secundarios?', a: 'Fibra Coli está hecho con ingredientes naturales. En los primeros días, algunas personas pueden experimentar un leve aumento de gases, lo cual es normal cuando el intestino se está regulando. Esto desaparece en pocos días.' },
  { q: '¿Puedo tomarlo si tomo otros medicamentos?', a: 'Si estás bajo tratamiento médico, te recomendamos consultar con tu médico antes de iniciar cualquier suplemento. En general, Fibra Coli es compatible con la mayoría de medicamentos, pero siempre es mejor consultar.' },
  { q: '¿Cómo se toma?', a: 'Muy fácil: 1 cucharada disuelta en un vaso de agua, jugo o bebida de tu preferencia, preferiblemente en ayunas o antes de la primera comida del día. Sabor agradable y fácil de mezclar.' },
  { q: '¿Es seguro para personas mayores?', a: 'Sí, Fibra Coli es seguro para adultos de todas las edades. Muchas de nuestras clientas tienen más de 60 años y lo toman con excelentes resultados. Si tienes condiciones médicas específicas, consulta con tu médico.' },
  { q: '¿Puedo tomarlo durante el embarazo o lactancia?', a: 'Si estás embarazada o en período de lactancia, es fundamental que consultes con tu médico antes de tomar cualquier suplemento alimenticio, incluyendo Fibra Coli.' },
  { q: '¿El pago contra entrega es real?', a: '¡Sí, 100% real! Solo pagas cuando recibes tu pedido en la puerta de tu casa. No te pedimos pagos por adelantado ni datos de tarjeta. Es la forma más segura de comprar.' },
  { q: '¿Hacen envíos a toda Colombia?', a: 'Sí, hacemos envíos a todas las ciudades y municipios de Colombia. El tiempo promedio de entrega es de 2 a 5 días hábiles, dependiendo de tu ubicación.' },
  { q: '¿Qué pasa si no me funciona?', a: 'Fibra Coli tiene una alta tasa de satisfacción. Sin embargo, si no ves resultados después de 30 días de uso constante, contáctanos por WhatsApp y te ayudamos. Tu satisfacción es nuestra prioridad.' },
  { q: '¿Cuánto dura un frasco?', a: 'Cada frasco de Fibra Coli rinde para aproximadamente 30 días de uso continuo (1 toma diaria). Por eso recomendamos comprar 2 o 3 frascos para asegurar al menos 2-3 meses de tratamiento.' },
  { q: '¿Puedo tomar más de una vez al día?', a: 'La dosis recomendada es 1 toma al día. Si sientes que necesitas más, puedes consultar con tu médico o escribirnos por WhatsApp para asesorarte personalmente.' },
  { q: '¿El producto es original?', a: 'Sí, garantizamos que cada frasco de Fibra Coli es 100% original. Compras directo del fabricante autorizado. No vendemos imitaciones ni productos de dudosa procedencia.' },
  { q: '¿Por qué es mejor que otras fibras?', a: 'Fibra Coli combina 6 ingredientes clave en una sola fórmula: fibra soluble, prebióticos, probióticos, enzimas digestivas y extractos naturales. Otras fibras solo tienen un ingrediente. Nosotros atacamos el problema desde todos los ángulos.' },
  { q: '¿Cómo sé que no es una estafa?', a: 'Entendemos la preocupación. Por eso ofrecemos pago contra entrega: solo pagas cuando tienes el producto en tus manos. Además, puedes verificar nuestro número de WhatsApp, leer los testimonios reales de clientas colombianas, y contactarnos para cualquier duda antes de comprar.' },
]

/* ─── HELPER: Scroll reveal wrapper ─── */

function RevealOnScroll({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
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

/* ─── SECTION 1: HERO ─── */

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50 via-white to-white">
      {/* Decorative circles */}
      <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-emerald-100/50 blur-3xl" />
      <div className="absolute top-1/2 -left-20 w-40 h-40 rounded-full bg-amber-100/40 blur-2xl" />

      <div className="relative max-w-lg mx-auto px-4 pt-8 pb-6">
        {/* Trust badge */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1.5 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" /> Pago contra entrega
          </span>
          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1.5 rounded-full">
            <Truck className="w-3.5 h-3.5" /> Envío nacional
          </span>
          <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-full badge-pulse">
            <Gift className="w-3.5 h-3.5" /> Obsequio GRATIS
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center leading-tight text-gray-900 mb-3">
          ¿Tu abdomen parece{' '}
          <span className="gradient-text">hinchado</span>{' '}
          antes de terminar el día?
        </h1>

        <p className="text-center text-gray-600 text-base sm:text-lg mb-5 leading-relaxed">
          Esa pesadez, los gases y la inflamación <strong>no son normales</strong>. Miles de mujeres en Colombia ya recuperaron su bienestar digestivo con <strong>Fibra Coli</strong>.
        </p>

        {/* Product image */}
        <div className="relative flex justify-center mb-5">
          <div className="relative w-64 h-64 sm:w-72 sm:h-72">
            <img
              src="/images/product-main.png"
              alt="Fibra Coli - Suplemento de fibra natural para la digestión"
              className="w-full h-full object-contain product-glow float-animation"
            />
          </div>
        </div>

        {/* Quick benefits */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { icon: <Leaf className="w-4 h-4" />, text: '100% Natural' },
            { icon: <Zap className="w-4 h-4" />, text: 'Resultados rápidos' },
            { icon: <Shield className="w-4 h-4" />, text: 'Sin efectos secundarios' },
          ].map((b, i) => (
            <div key={i} className="flex flex-col items-center gap-1 bg-white rounded-xl p-2.5 shadow-sm border border-emerald-100">
              <span className="text-emerald-600">{b.icon}</span>
              <span className="text-xs font-medium text-gray-700 text-center">{b.text}</span>
            </div>
          ))}
        </div>

        {/* Rating */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className="text-sm font-semibold text-gray-700">4.9/5</span>
          <span className="text-xs text-gray-500">(2,847 opiniones)</span>
        </div>

        {/* CTA */}
        <a
          href="#oferta"
          className="block w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white text-center font-bold text-lg py-4 px-6 rounded-2xl shadow-lg shadow-emerald-200 transition-all duration-200 pulse-cta"
        >
          ¡Quiero mi Fibra Coli! 🌿
        </a>
        <p className="text-center text-xs text-gray-500 mt-2">Solo pagas cuando lo recibes · Envío a toda Colombia · <span className="text-amber-600 font-medium">🎁 Obsequio incluido</span></p>
      </div>
    </section>
  )
}

/* ─── SECTION 2: VIDEO ─── */

function VideoSection() {
  return (
    <section className="bg-white py-10 px-4">
      <div className="max-w-lg mx-auto">
        <RevealOnScroll>
          <div className="text-center mb-4">
            <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-2">
              <MessageCircle className="w-3.5 h-3.5" /> VIDEO DE UNA CLIENTA REAL
            </span>
            <h2 className="text-2xl font-bold text-gray-900">Mira lo que dice Claudia de Medellín</h2>
          </div>

          {/* Video placeholder - UGC style */}
          <div className="relative rounded-2xl overflow-hidden bg-gray-900 aspect-[9/16] max-w-xs mx-auto shadow-2xl">
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
                <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-white border-b-[12px] border-b-transparent ml-1" />
              </div>
              <p className="text-sm opacity-80">Toca para ver el video</p>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white text-xs font-bold">C</div>
                <div>
                  <p className="text-white text-xs font-semibold">Claudia E.</p>
                  <p className="text-white/70 text-[10px]">Medellín, Colombia</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 text-center">
            <a
              href="#oferta"
              className="inline-block bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold text-base py-3.5 px-8 rounded-2xl shadow-lg shadow-emerald-200 transition-all duration-200"
            >
              Yo también quiero esos resultados →
            </a>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}

/* ─── SECTION 3: PAIN POINTS ─── */

function PainPointsSection() {
  const pains = [
    { icon: '🫧', title: 'Inflamación abdominal', desc: 'Tu barriga se hincha como un globo después de comer' },
    { icon: '😫', title: 'Estreñimiento', desc: 'Días sin poder ir al baño, sintiéndote pesada y frustrada' },
    { icon: '💨', title: 'Gases frecuentes', desc: 'Esos gases que te dan pena en reuniones y reuniones sociales' },
    { icon: '🪨', title: 'Pesadez', desc: 'Como si tuvieras una piedra en el estómago todo el día' },
    { icon: '🐌', title: 'Digestión lenta', desc: 'La comida parece quedarse horas sin digerirse' },
    { icon: '😤', title: 'Malestar digestivo', desc: 'Esa sensación de colon saturado que no te deja tranquila' },
  ]

  return (
    <section className="bg-gradient-to-b from-white to-rose-50/50 py-12 px-4">
      <div className="max-w-lg mx-auto">
        <RevealOnScroll>
          <div className="text-center mb-8">
            <span className="text-rose-500 font-semibold text-sm uppercase tracking-wide">¿Te identificas?</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
              ¿Te pasa esto <span className="text-rose-500">todos los días</span>?
            </h2>
            <p className="text-gray-600 mt-2">No eres la única. Miles de mujeres en Colombia viven exactamente lo mismo.</p>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-2 gap-3">
          {pains.map((p, i) => (
            <RevealOnScroll key={i} delay={i * 0.08}>
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-rose-100 hover:shadow-md transition-shadow">
                <span className="text-2xl mb-2 block">{p.icon}</span>
                <h3 className="font-bold text-sm text-gray-900 mb-1">{p.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{p.desc}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll>
          <div className="mt-6 bg-rose-50 border border-rose-200 rounded-2xl p-4 text-center">
            <p className="text-rose-700 font-semibold text-sm">
              Si tienes 2 o más de estos síntomas, tu cuerpo te está pidiendo ayuda. <strong>Fibra Coli fue creado exactamente para ti.</strong>
            </p>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}

/* ─── SECTION 4: PRODUCT PRESENTATION ─── */

function ProductPresentation() {
  return (
    <section className="bg-white py-12 px-4">
      <div className="max-w-lg mx-auto">
        <RevealOnScroll>
          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
              <Leaf className="w-3.5 h-3.5" /> TU SOLUCIÓN NATURAL
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Conoce <span className="gradient-text">Fibra Coli</span>
            </h2>
            <p className="text-gray-600 mt-2 leading-relaxed">
              El suplemento de fibra natural que miles de mujeres en Colombia ya usan para recuperar su bienestar digestivo.
            </p>
          </div>
        </RevealOnScroll>

        {/* Product images gallery */}
        <RevealOnScroll>
          <div className="grid grid-cols-3 gap-2 mb-6">
            <div className="rounded-xl overflow-hidden aspect-square bg-emerald-50 flex items-center justify-center">
              <img src="/images/product-main.png" alt="Fibra Coli frontal" className="w-full h-full object-contain p-2" />
            </div>
            <div className="rounded-xl overflow-hidden aspect-square bg-gray-50">
              <img src="/images/product-secondary.jpg" alt="Fibra Coli producto" className="w-full h-full object-cover" />
            </div>
            <div className="rounded-xl overflow-hidden aspect-square bg-gray-50">
              <img src="/images/product-angle-1.jpg" alt="Fibra Coli detalle" className="w-full h-full object-cover" />
            </div>
          </div>
        </RevealOnScroll>

        {/* What it is */}
        <RevealOnScroll>
          <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-5 border border-emerald-100 mb-4">
            <h3 className="font-bold text-lg text-gray-900 mb-2">¿Qué es?</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Fibra Coli es una fórmula avanzada que combina <strong>fibra natural, prebióticos, probióticos y enzimas digestivas</strong> en un solo producto. Diseñado especialmente para mujeres que sufren de problemas digestivos como estreñimiento, inflamación y pesadez.
            </p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll>
          <div className="bg-gradient-to-br from-amber-50 to-white rounded-2xl p-5 border border-amber-100 mb-4">
            <h3 className="font-bold text-lg text-gray-900 mb-2">¿Para qué sirve?</h3>
            <ul className="space-y-2">
              {[
                'Regularizar tu tránsito intestinal de forma natural',
                'Reducir la inflamación y los gases abdominales',
                'Mejorar la digestión y eliminar la pesadez',
                'Alimentar las bacterias buenas de tu intestino',
                'Recuperar el bienestar digestivo que mereces',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </RevealOnScroll>

        <RevealOnScroll>
          <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-5 border border-purple-100">
            <h3 className="font-bold text-lg text-gray-900 mb-2">¿Qué lo hace diferente?</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { title: 'Fórmula 6 en 1', desc: '6 ingredientes clave en un solo producto' },
                { title: 'Sabor agradable', desc: 'No sabe a medicina, se toma fácil' },
                { title: 'Sin laxantes agresivos', desc: 'Actúa suave sin irritar tu intestino' },
                { title: 'Hecho para Colombia', desc: 'Pensado en las necesidades de la mujer colombiana' },
              ].map((d, i) => (
                <div key={i} className="bg-white rounded-xl p-3 shadow-sm">
                  <p className="font-semibold text-xs text-gray-900">{d.title}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{d.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </RevealOnScroll>

        {/* Mini social proof + CTA */}
        <RevealOnScroll>
          <div className="mt-5 flex items-center justify-center gap-2 text-sm text-gray-500">
            <Users className="w-4 h-4" />
            <span>Más de <strong className="text-gray-700">12,000+</strong> clientas en Colombia</span>
          </div>
          <div className="mt-3 text-center">
            <a
              href="#oferta"
              className="inline-block bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold text-base py-3.5 px-8 rounded-2xl shadow-lg shadow-emerald-200"
            >
              Quiero probar Fibra Coli →
            </a>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}

/* ─── SECTION 5: BENEFITS ─── */

function BenefitsSection() {
  const benefits = [
    { icon: <RefreshCw className="w-6 h-6" />, title: 'Tránsito regular', desc: 'Ve al baño sin esfuerzo todos los días, de forma natural y constante.' },
    { icon: <Droplets className="w-6 h-6" />, title: 'Cero inflamación', desc: 'Despídete de la barriga hinchada. Tu abdomen se sentirá plano y ligero.' },
    { icon: <Wind className="w-6 h-6" />, title: 'Adiós gases', desc: 'Reduce los gases y la molestia que te causan pena en público.' },
    { icon: <Heart className="w-6 h-6" />, title: 'Digestión tranquila', desc: 'Come sin miedo a sentir pesadez o malestar después de cada comida.' },
    { icon: <Zap className="w-6 h-6" />, title: 'Más energía', desc: 'Un intestino sano significa más vitalidad y mejor disposición.' },
    { icon: <Shield className="w-6 h-6" />, title: 'Flora protegida', desc: 'Prebióticos y probióticos que cuidan tu microbioma intestinal.' },
  ]

  return (
    <section className="bg-gradient-to-b from-emerald-50/50 to-white py-12 px-4">
      <div className="max-w-lg mx-auto">
        <RevealOnScroll>
          <div className="text-center mb-8">
            <span className="text-emerald-600 font-semibold text-sm uppercase tracking-wide">Resultados reales</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
              Lo que <span className="gradient-text">Fibra Coli</span> hace por ti
            </h2>
          </div>
        </RevealOnScroll>

        <div className="space-y-3">
          {benefits.map((b, i) => (
            <RevealOnScroll key={i} delay={i * 0.08}>
              <div className="flex items-start gap-4 bg-white rounded-2xl p-4 shadow-sm border border-emerald-50 hover:border-emerald-200 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                  {b.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{b.title}</h3>
                  <p className="text-sm text-gray-600 mt-0.5">{b.desc}</p>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll>
          <div className="mt-6 text-center">
            <a
              href="#oferta"
              className="inline-block bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold text-base py-3.5 px-8 rounded-2xl shadow-lg shadow-emerald-200"
            >
              ¡Quiero todos estos beneficios! →
            </a>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}

/* Wind icon fallback */
function Wind(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" />
      <path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
      <path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
    </svg>
  )
}

/* ─── SECTION 6: HOW IT WORKS ─── */

function HowItWorksSection() {
  const steps = [
    {
      num: '1',
      title: 'Toma tu Fibra Coli',
      desc: 'Disuelve 1 cucharada en agua, jugo o tu bebida favorita. Sabor agradable, fácil de preparar.',
      icon: <Droplets className="w-8 h-8" />,
    },
    {
      num: '2',
      title: 'La fibra actúa',
      desc: 'Los ingredientes naturales trabajan suavemente en tu intestino, regulando el tránsito y reduciendo la inflamación.',
      icon: <RefreshCw className="w-8 h-8" />,
    },
    {
      num: '3',
      title: 'Recupera tu bienestar',
      desc: 'En pocos días sientes la diferencia: menos gases, mejor digestión y una sensación de ligereza que no habías sentido en años.',
      icon: <Heart className="w-8 h-8" />,
    },
  ]

  return (
    <section className="bg-white py-12 px-4">
      <div className="max-w-lg mx-auto">
        <RevealOnScroll>
          <div className="text-center mb-8">
            <span className="text-amber-600 font-semibold text-sm uppercase tracking-wide">Súper fácil</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
              ¿Cómo funciona <span className="gradient-text">Fibra Coli</span>?
            </h2>
          </div>
        </RevealOnScroll>

        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-8 top-12 bottom-12 w-0.5 bg-gradient-to-b from-emerald-300 via-emerald-400 to-emerald-300" />

          <div className="space-y-6">
            {steps.map((s, i) => (
              <RevealOnScroll key={i} delay={i * 0.15}>
                <div className="relative flex items-start gap-5">
                  <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-200 flex-shrink-0">
                    {s.icon}
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">Paso {s.num}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">{s.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{s.desc}</p>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>

        <RevealOnScroll>
          <div className="mt-6 text-center">
            <a
              href="#oferta"
              className="inline-block bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold text-base py-3.5 px-8 rounded-2xl shadow-lg shadow-emerald-200"
            >
              Empezar mi transformación →
            </a>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}

/* ─── SECTION 7: INGREDIENTS ─── */

function IngredientsSection() {
  return (
    <section className="bg-gradient-to-b from-emerald-50/30 to-white py-12 px-4">
      <div className="max-w-lg mx-auto">
        <RevealOnScroll>
          <div className="text-center mb-8">
            <span className="text-emerald-600 font-semibold text-sm uppercase tracking-wide">Transparencia total</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
              Ingredientes <span className="gradient-text">naturales y efectivos</span>
            </h2>
            <p className="text-gray-600 mt-2">Cada ingrediente fue seleccionado por su efecto comprobado en la salud digestiva.</p>
          </div>
        </RevealOnScroll>

        <div className="space-y-3">
          {INGREDIENTS.map((ing, i) => (
            <RevealOnScroll key={i} delay={i * 0.08}>
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:border-emerald-200 transition-colors">
                <div className="flex items-start gap-3">
                  <span className="text-3xl flex-shrink-0">{ing.icon}</span>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900">{ing.name}</h3>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">{ing.desc}</p>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll>
          <div className="mt-5 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center">
            <p className="text-emerald-700 text-sm font-medium">
              🌿 Sin colorantes artificiales · Sin conservantes agresivos · Sin lactosa · Sin gluten
            </p>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}

/* ─── SECTION 8: BEFORE VS AFTER ─── */

function BeforeAfterSection() {
  return (
    <section className="bg-white py-12 px-4">
      <div className="max-w-lg mx-auto">
        <RevealOnScroll>
          <div className="text-center mb-8">
            <span className="text-amber-600 font-semibold text-sm uppercase tracking-wide">La transformación</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
              Antes vs. <span className="gradient-text">Después</span>
            </h2>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-2 gap-3">
          {/* Before */}
          <RevealOnScroll>
            <div className="bg-rose-50 rounded-2xl p-4 border border-rose-200 h-full">
              <div className="text-center mb-3">
                <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-600 text-xs font-bold px-3 py-1 rounded-full">
                  <X className="w-3 h-3" /> ANTES
                </span>
              </div>
              <ul className="space-y-2.5">
                {[
                  'Abdomen inflamado',
                  'Estreñimiento constante',
                  'Gases todo el día',
                  'Pesadez después de comer',
                  'Digestión lenta y pesada',
                  'Malestar general',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-rose-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </RevealOnScroll>

          {/* After */}
          <RevealOnScroll delay={0.15}>
            <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 h-full">
              <div className="text-center mb-3">
                <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-600 text-xs font-bold px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-3 h-3" /> DESPUÉS
                </span>
              </div>
              <ul className="space-y-2.5">
                {[
                  'Barriga desinflamada',
                  'Tránsito intestinal regular',
                  'Gases reducidos notablemente',
                  'Comer sin sentir pesadez',
                  'Digestión tranquila y ligera',
                  'Bienestar digestivo total',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-emerald-700">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </RevealOnScroll>
        </div>

        <RevealOnScroll>
          <p className="text-center text-xs text-gray-500 mt-4">
            *Los resultados pueden variar según cada persona. Este producto no reemplaza el tratamiento médico.
          </p>
          <div className="mt-4 text-center">
            <a
              href="#oferta"
              className="inline-block bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold text-base py-3.5 px-8 rounded-2xl shadow-lg shadow-emerald-200"
            >
              Quiero estar en el "Después" →
            </a>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}

/* ─── SECTION 9: TESTIMONIALS (WhatsApp style) ─── */

function TestimonialsSection() {
  const [showAll, setShowAll] = useState(false)
  const displayed = showAll ? TESTIMONIALS : TESTIMONIALS.slice(0, 6)

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-lg mx-auto">
        <RevealOnScroll>
          <div className="text-center mb-8">
            <span className="text-emerald-600 font-semibold text-sm uppercase tracking-wide">Historias reales</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
              Lo que dicen nuestras <span className="gradient-text">clientas</span>
            </h2>
            <div className="flex items-center justify-center gap-2 mt-2">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-sm text-gray-600 font-semibold">4.9/5</span>
              <span className="text-xs text-gray-500">basado en 2,847 opiniones</span>
            </div>
          </div>
        </RevealOnScroll>

        <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-1">
          {displayed.map((t, i) => (
            <RevealOnScroll key={i} delay={i * 0.05}>
              <div className="testimonial-card bg-white rounded-2xl p-3 shadow-sm border border-gray-100">
                {/* WhatsApp header */}
                <div className="flex items-center gap-2.5 mb-2">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                    style={{ backgroundColor: t.color }}
                  >
                    {t.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-sm text-gray-900 truncate">{t.name}</p>
                      <span className="text-[10px] text-gray-400 flex-shrink-0">Hoy</span>
                    </div>
                    <p className="text-xs text-gray-500">{t.city} · <span className="text-emerald-600">Compra verificada ✓</span></p>
                  </div>
                </div>
                {/* Chat bubble */}
                <div className="ml-12">
                  <div className="whatsapp-bubble">
                    <p className="text-gray-800 text-[13px] leading-relaxed">{t.text}</p>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <span className="text-[10px] text-gray-400">12:{String(30 + i).padStart(2, '0')} PM</span>
                      <span className="text-[10px] text-blue-500">✓✓</span>
                    </div>
                  </div>
                </div>
                {/* Objection tag */}
                <div className="ml-12 mt-1.5">
                  <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                    Superó: {t.objection}
                  </span>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        {!showAll && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setShowAll(true)}
              className="inline-flex items-center gap-2 text-emerald-600 font-semibold text-sm hover:text-emerald-700"
            >
              Ver los {TESTIMONIALS.length} testimonios <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}

        <RevealOnScroll>
          <div className="mt-5 text-center">
            <a
              href="#oferta"
              className="inline-block bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold text-base py-3.5 px-8 rounded-2xl shadow-lg shadow-emerald-200"
            >
              Yo también quiero resultados así →
            </a>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}

/* ─── SECTION 10: SOCIAL PROOF ─── */

function SocialProofSection() {
  const stats = [
    { number: '12,000+', label: 'Clientas en Colombia', icon: <Users className="w-6 h-6" /> },
    { number: '4.9/5', label: 'Calificación promedio', icon: <Star className="w-6 h-6" /> },
    { number: '2,847', label: 'Opiniones verificadas', icon: <ThumbsUp className="w-6 h-6" /> },
    { number: '97%', label: 'Recomiendan Fibra Coli', icon: <Heart className="w-6 h-6" /> },
  ]

  return (
    <section className="bg-gradient-to-r from-emerald-600 to-emerald-500 py-10 px-4">
      <div className="max-w-lg mx-auto">
        <RevealOnScroll>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white">Números que hablan por sí solos</h2>
            <p className="text-emerald-100 text-sm mt-1">Miles de mujeres ya confiaron en Fibra Coli</p>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-2 gap-3">
          {stats.map((s, i) => (
            <RevealOnScroll key={i} delay={i * 0.1}>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20">
                <div className="flex justify-center text-amber-300 mb-2">{s.icon}</div>
                <p className="text-2xl font-extrabold text-white">{s.number}</p>
                <p className="text-emerald-100 text-xs mt-0.5">{s.label}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── SECTION: GIFT (OBSEQUIO TERMOACTIVO) ─── */

function GiftSection() {
  return (
    <section id="obsequio" className="bg-gradient-to-b from-amber-50 to-white py-12 px-4 scroll-mt-20">
      <div className="max-w-lg mx-auto">
        <RevealOnScroll>
          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1.5 rounded-full badge-pulse mb-3">
              <Gift className="w-3.5 h-3.5" /> OBSEQUIO EXCLUSIVO
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              ¡Llévate un <span className="text-amber-600">obsequio GRATIS</span> con tu pedido!
            </h2>
            <p className="text-gray-600 mt-2">Con cada compra de Fibra Coli, recibes completamente gratis una <strong>Loción Termoactiva Allpa Natural</strong></p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll>
          <div className="relative bg-white rounded-3xl p-5 shadow-xl border-2 border-amber-300 overflow-hidden">
            {/* Decorative sparkles */}
            <div className="absolute top-3 right-3 text-amber-400 sparkle"><Sparkles className="w-5 h-5" /></div>
            <div className="absolute bottom-4 left-4 text-amber-400 sparkle" style={{ animationDelay: '0.5s' }}><Sparkles className="w-4 h-4" /></div>

            {/* Badge */}
            <div className="absolute top-0 right-0">
              <div className="bg-red-500 text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl rounded-tr-2xl">
                GRATIS
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-5">
              {/* Gift visual representation */}
              <div className="w-36 h-44 flex-shrink-0">
                <div className="w-full h-full bg-gradient-to-b from-amber-100 to-amber-50 rounded-2xl flex flex-col items-center justify-center border border-amber-200 p-3">
                  {/* Bottle illustration */}
                  <div className="w-14 h-24 bg-amber-800 rounded-lg relative overflow-hidden">
                    <div className="absolute inset-x-0 top-0 h-4 bg-amber-900 rounded-t-lg" />
                    <div className="absolute inset-x-1 top-4 bottom-1 bg-amber-700 rounded-sm" />
                    <div className="absolute inset-x-0 bottom-0 h-3 bg-amber-600" />
                    {/* Label */}
                    <div className="absolute inset-x-2 top-6 bottom-4 bg-white/90 rounded-sm flex flex-col items-center justify-center px-0.5">
                      <span className="text-[5px] font-bold text-amber-800 leading-none">ALLPA</span>
                      <span className="text-[3.5px] text-red-600 font-bold leading-none mt-0.5">TERMOACTIVA</span>
                      <span className="text-[3px] text-amber-700 leading-none mt-0.5">18 ml</span>
                    </div>
                  </div>
                  {/* Spray cap */}
                  <div className="w-6 h-3 bg-gray-300 rounded-t-md -mt-0.5" />
                </div>
              </div>

              <div className="text-center sm:text-left flex-1">
                <h3 className="font-bold text-lg text-gray-900 mb-1">Loción Termoactiva Allpa Natural</h3>
                <p className="text-xs text-amber-600 font-semibold mb-2">Fórmula Mejorada · 18 ml · Certificados Naturales</p>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">
                  Analgésico y antiinflamatorio natural de aplicación local. Con <strong>Árnica, Castaño de Indias, Caléndula, Hamamelis, Uña de Gato y Chuchuhuasi</strong>. Se absorbe rápido y alivia el dolor de forma inmediata.
                </p>

                {/* Uses */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {['Torceduras leves', 'Esguinces', 'Calambres', 'Tortícolis', 'Contracturas'].map((use, i) => (
                    <span key={i} className="text-[10px] bg-amber-50 text-amber-700 font-medium px-2 py-0.5 rounded-full border border-amber-200">
                      {use}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                  <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-xs font-semibold px-2 py-1 rounded-full">
                    <Gift className="w-3 h-3" /> Valor: $29,900
                  </span>
                  <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 text-xs font-semibold px-2 py-1 rounded-full">
                    <CheckCircle2 className="w-3 h-3" /> GRATIS con cada pedido
                  </span>
                </div>
              </div>
            </div>

            {/* How to use */}
            <div className="mt-4 bg-gray-50 rounded-xl p-3 border border-gray-200">
              <p className="text-xs font-bold text-gray-700 mb-2">📋 Modo de uso:</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { step: '1', text: 'Aplica el spray a 20 cm de la piel' },
                  { step: '2', text: 'Pulveriza en posición vertical unos segundos' },
                  { step: '3', text: 'Espera que se evapore sin frotar' },
                  { step: '4', text: 'Lávate las manos después de cada aplicación' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-emerald-500 text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{item.step}</span>
                    <span className="text-[11px] text-gray-600 leading-tight">{item.text}</span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-gray-500 mt-2">Para adultos y adolescentes desde 12 años. Hasta 4 aplicaciones al día. Si no mejora en 7 días, consulta a tu médico.</p>
            </div>

            {/* Timer urgency */}
            <div className="mt-4 bg-amber-50 rounded-xl p-3 text-center border border-amber-200">
              <div className="flex items-center justify-center gap-2 text-amber-700">
                <Timer className="w-4 h-4" />
                <span className="text-sm font-semibold">¡Solo por esta semana! Quedan <span className="text-red-600 font-bold countdown-pulse">23 obsequios</span> disponibles</span>
              </div>
            </div>
          </div>
        </RevealOnScroll>

        <RevealOnScroll>
          <div className="mt-5 text-center">
            <a
              href="#oferta"
              className="inline-block bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-base py-3.5 px-8 rounded-2xl shadow-lg shadow-amber-200 pulse-cta"
            >
              ¡Quiero mi obsequio GRATIS! 🎁
            </a>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}

/* ─── GIFT REMINDER STRIP (reused throughout page) ─── */

function GiftReminder() {
  return (
    <div className="bg-gradient-to-r from-amber-50 to-amber-100 border-y border-amber-200 py-2.5 px-4">
      <div className="max-w-lg mx-auto flex items-center justify-center gap-2 text-sm">
        <Gift className="w-4 h-4 text-amber-600 flex-shrink-0" />
        <span className="text-amber-800 font-medium">
          <strong>OBSEQUIO GRATIS:</strong> Loción Termoactiva con cada pedido <a href="#obsequio" className="text-amber-600 underline font-semibold">Ver más →</a>
        </span>
      </div>
    </div>
  )
}

/* ─── SECTION 11: PRICING / OFFER ─── */

function OfferSection() {
  const plans = [
    {
      qty: 1,
      label: '1 Frasco',
      price: 79, // simplified price in thousands
      priceStr: '$79.900',
      oldPrice: '$119.900',
      savings: '33% OFF',
      popular: false,
      desc: 'Para probar Fibra Coli + Obsequio GRATIS',
      perDay: '$2.663/día',
    },
    {
      qty: 2,
      label: '2 Frascos',
      price: 139,
      priceStr: '$139.900',
      oldPrice: '$239.800',
      savings: '42% OFF',
      popular: true,
      desc: 'El más elegido + Obsequio GRATIS',
      perDay: '$2.332/día',
    },
    {
      qty: 3,
      label: '3 Frascos',
      price: 189,
      priceStr: '$189.900',
      oldPrice: '$359.700',
      savings: '47% OFF',
      popular: false,
      desc: 'Tratamiento completo + Obsequio GRATIS',
      perDay: '$2.110/día',
    },
  ]

  return (
    <section id="oferta" className="bg-gradient-to-b from-white to-emerald-50/30 py-12 px-4 scroll-mt-20">
      <div className="max-w-lg mx-auto">
        <RevealOnScroll>
          <div className="text-center mb-8">
            <span className="text-emerald-600 font-semibold text-sm uppercase tracking-wide">Oferta especial</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
              Elige tu plan y <span className="gradient-text">empieza hoy</span>
            </h2>
            <p className="text-gray-600 mt-2">Pago contra entrega · Solo pagas cuando recibes tu pedido</p>
          </div>
        </RevealOnScroll>

        <div className="space-y-4">
          {plans.map((plan, i) => (
            <RevealOnScroll key={i} delay={i * 0.1}>
              <div className={`relative bg-white rounded-2xl p-5 border-2 transition-all ${
                plan.popular
                  ? 'border-emerald-500 shadow-xl shadow-emerald-100'
                  : 'border-gray-200 shadow-sm'
              }`}>
                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-emerald-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-md">
                      ⭐ MÁS ELEGIDO
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{plan.label}</h3>
                    <p className="text-xs text-gray-500">{plan.desc}</p>
                  </div>
                  <span className="bg-red-100 text-red-600 text-xs font-bold px-2.5 py-1 rounded-full">
                    {plan.savings}
                  </span>
                </div>

                <div className="flex items-end gap-2 mb-1">
                  <span className="text-3xl font-extrabold text-gray-900">{plan.priceStr}</span>
                  <span className="price-strike text-base mb-1">{plan.oldPrice}</span>
                </div>
                <p className="text-xs text-emerald-600 font-semibold mb-3">Solo {plan.perDay} · Menos que un tinto ☕</p>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 mb-3 flex items-center gap-2">
                  <Gift className="w-5 h-5 text-amber-500 flex-shrink-0" />
                  <p className="text-xs text-amber-700 font-semibold">+ Obsequio GRATIS: Loción Termoactiva Allpa</p>
                </div>

                <a
                  href="https://wa.me/573001234567?text=Hola%2C%20quiero%20ordenar%20" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block w-full text-center font-bold text-base py-3.5 rounded-xl transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-200 pulse-cta'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  {plan.popular ? '¡Lo quiero con obsequio! →' : 'Ordenar ahora →'}
                </a>

                <div className="flex items-center justify-center gap-3 mt-2.5 text-[10px] text-gray-500">
                  <span className="flex items-center gap-1"><Truck className="w-3 h-3" /> Envío gratis</span>
                  <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Contra entrega</span>
                  <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Compra segura</span>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        {/* Social proof near CTA */}
        <RevealOnScroll>
          <div className="mt-5 flex items-center justify-center gap-4 text-sm text-gray-600">
            <div className="flex -space-x-2">
              {['MF', 'CE', 'SM', 'YP', 'AB'].map((initials, i) => (
                <div key={i} className="w-7 h-7 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-[9px] font-bold">
                  {initials}
                </div>
              ))}
            </div>
            <span>12,000+ clientas satisfechas</span>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}

/* ─── SECTION 12: GUARANTEES ─── */

function GuaranteesSection() {
  const guarantees = [
    { icon: <ShieldCheck className="w-8 h-8" />, title: 'Compra segura', desc: 'Tus datos están protegidos y tu compra es 100% confidencial.' },
    { icon: <Lock className="w-8 h-8" />, title: 'Protección de datos', desc: 'No compartimos tu información personal con terceros.' },
    { icon: <Phone className="w-8 h-8" />, title: 'Atención WhatsApp', desc: 'Escríbenos antes o después de comprar. Siempre estamos para ti.' },
    { icon: <Package className="w-8 h-8" />, title: 'Pago contra entrega', desc: 'Solo pagas cuando tienes el producto en tus manos. Sin riesgo.' },
  ]

  return (
    <section className="bg-white py-12 px-4">
      <div className="max-w-lg mx-auto">
        <RevealOnScroll>
          <div className="text-center mb-8">
            <span className="text-emerald-600 font-semibold text-sm uppercase tracking-wide">Tu tranquilidad primero</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
              Compra con <span className="gradient-text">total confianza</span>
            </h2>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-2 gap-3">
          {guarantees.map((g, i) => (
            <RevealOnScroll key={i} delay={i * 0.08}>
              <div className="bg-gray-50 rounded-2xl p-4 text-center border border-gray-100">
                <div className="flex justify-center text-emerald-600 mb-2">{g.icon}</div>
                <h3 className="font-bold text-sm text-gray-900 mb-1">{g.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{g.desc}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll>
          <div className="mt-5 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center">
            <p className="text-emerald-700 text-sm font-medium">
              🇨🇴 <strong>Empresa 100% colombiana</strong> · Más de 12,000 clientas confían en nosotros
            </p>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}

/* ─── SECTION 13: FAQ ─── */

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="bg-gray-50 py-12 px-4">
      <div className="max-w-lg mx-auto">
        <RevealOnScroll>
          <div className="text-center mb-8">
            <span className="text-emerald-600 font-semibold text-sm uppercase tracking-wide">Resolvemos tus dudas</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
              Preguntas <span className="gradient-text">frecuentes</span>
            </h2>
          </div>
        </RevealOnScroll>

        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <RevealOnScroll key={i} delay={i * 0.03}>
              <div
                className={`faq-item bg-white rounded-xl border overflow-hidden ${
                  openIndex === i ? 'border-emerald-300 shadow-sm' : 'border-gray-200'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <span className="font-semibold text-sm text-gray-900 pr-3">{faq.q}</span>
                  {openIndex === i ? (
                    <ChevronUp className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-4 pb-4">
                        <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll>
          <div className="mt-5 text-center">
            <p className="text-sm text-gray-500 mb-2">¿Aún tienes dudas?</p>
            <a
              href="https://wa.me/573001234567?text=Hola%2C%20tengo%20una%20pregunta%20sobre%20Fibra%20Coli"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold text-sm py-3 px-6 rounded-xl transition-colors"
            >
              <MessageCircle className="w-4 h-4" /> Escríbenos por WhatsApp
            </a>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}

/* ─── SECTION 14: FINAL CTA ─── */

function FinalCTASection() {
  return (
    <section className="bg-gradient-to-b from-emerald-600 to-emerald-700 py-14 px-4">
      <div className="max-w-lg mx-auto text-center">
        <RevealOnScroll>
          <div className="mb-6">
            <span className="text-emerald-200 text-sm font-semibold">No dejes para mañana tu bienestar</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2 leading-tight">
              Tu digestión puede mejorar. <br />
              <span className="text-amber-300">Empieza hoy.</span>
            </h2>
            <p className="text-emerald-100 mt-3 leading-relaxed">
              Miles de mujeres en Colombia ya recuperaron su bienestar digestivo. No sigas sufriendo en silencio. Fibra Coli fue creado para ti.
            </p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll>
          <div className="flex flex-col items-center gap-3">
            <a
              href="#oferta"
              className="block w-full max-w-xs bg-white text-emerald-700 font-extrabold text-lg py-4 px-8 rounded-2xl shadow-xl hover:bg-emerald-50 transition-all pulse-cta"
            >
              ¡Quiero mi Fibra Coli! 🌿
            </a>
            <div className="flex flex-wrap items-center justify-center gap-3 text-emerald-200 text-xs">
              <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> Pago contra entrega</span>
              <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5" /> Envío nacional</span>
              <span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5" /> Compra segura</span>
            </div>
          </div>
        </RevealOnScroll>

        <RevealOnScroll>
          <div className="mt-8 flex items-center justify-center gap-2">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-300 text-amber-300" />
              ))}
            </div>
            <span className="text-white text-sm font-semibold">4.9/5</span>
            <span className="text-emerald-200 text-xs">(2,847 opiniones)</span>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}

/* ─── STICKY CTA ─── */

function StickyCTA() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
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
          className="sticky-cta-bar bg-white/90 border-t border-gray-200 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]"
        >
          <div className="max-w-lg mx-auto flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-gray-900 truncate">Fibra Coli</p>
              <p className="text-xs text-gray-500">Desde $79.900 · <span className="text-amber-600">🎁 Obsequio</span> · Contra entrega</p>
            </div>
            <a
              href="#oferta"
              className="flex-shrink-0 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold text-sm py-3 px-5 rounded-xl shadow-lg shadow-emerald-200 transition-all active:scale-95"
            >
              ¡Comprar ahora!
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
    <footer className="bg-gray-900 py-8 px-4">
      <div className="max-w-lg mx-auto text-center">
        <p className="text-gray-400 text-xs leading-relaxed">
          Este producto es un suplemento alimenticio y no reemplaza una dieta balanceada ni el tratamiento médico. 
          Los resultados pueden variar según cada persona. Consulta a tu médico si estás embarazada, en lactancia o bajo tratamiento médico.
        </p>
        <div className="mt-4 flex items-center justify-center gap-4 text-gray-500 text-xs">
          <span>© 2025 Fibra Coli Colombia</span>
          <span>·</span>
          <span>Todos los derechos reservados</span>
        </div>
        <p className="text-gray-600 text-[10px] mt-3">Producto comercializado en Colombia · Envío a todo el territorio nacional</p>
      </div>
    </footer>
  )
}

/* ─── MID-PAGE SOCIAL PROOF STRIPS ─── */

function MiniSocialProof() {
  return (
    <div className="bg-emerald-50 border-y border-emerald-100 py-3 px-4">
      <div className="max-w-lg mx-auto flex items-center justify-center gap-3 text-sm text-emerald-700">
        <div className="flex -space-x-1.5">
          {['M', 'C', 'S', 'Y'].map((l, i) => (
            <div key={i} className="w-6 h-6 rounded-full bg-emerald-500 border border-white flex items-center justify-center text-white text-[8px] font-bold">
              {l}
            </div>
          ))}
        </div>
        <span className="font-medium"><strong className="text-emerald-800">127 personas</strong> están viendo esta página ahora</span>
      </div>
    </div>
  )
}

/* ─── MAIN PAGE ─── */

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1">
        <HeroSection />
        <MiniSocialProof />
        <GiftReminder />
        <VideoSection />
        <PainPointsSection />
        <ProductPresentation />
        <MiniSocialProof />
        <GiftReminder />
        <BenefitsSection />
        <HowItWorksSection />
        <IngredientsSection />
        <BeforeAfterSection />
        <MiniSocialProof />
        <GiftReminder />
        <TestimonialsSection />
        <SocialProofSection />
        <GiftSection />
        <OfferSection />
        <GuaranteesSection />
        <FAQSection />
        <FinalCTASection />
      </main>
      <Footer />
      <StickyCTA />
    </div>
  )
}
