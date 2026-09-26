import { Metadata } from "next";
import { ShieldCheck, Lock, FileText, Database, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Política de Tratamiento de Datos | SGB Military",
};

export default function PoliticaDatosPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
      <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
        <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center border border-accent/20">
          <ShieldCheck className="w-6 h-6 text-accent" />
        </div>
        <div>
          <h1 className="font-heading text-2xl md:text-4xl uppercase tracking-widest text-foreground">
            Tratamiento de Datos
          </h1>
          <p className="text-xs text-muted-foreground mt-2 font-body uppercase tracking-wider">
            Última actualización: Septiembre 2026
          </p>
        </div>
      </div>

      <div className="space-y-8 font-body text-sm text-muted-foreground leading-relaxed">
        
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 hover:border-accent/30 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-heading tracking-widest uppercase text-foreground">1. Marco Legal</h2>
          </div>
          <p>
            En estricto cumplimiento de lo dispuesto por la Ley Estatutaria 1581 de 2012 y el Decreto Reglamentario 1377 de 2013 de la República de Colombia, <strong>SGB MILITARY SHOP (NIT 1000412101)</strong> (en adelante "SGB Military Shop"), garantiza el adecuado tratamiento, privacidad y seguridad de los datos personales de sus clientes.
          </p>
        </section>

        <section className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 hover:border-accent/30 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-heading tracking-widest uppercase text-foreground">2. Información Recolectada</h2>
          </div>
          <p className="mb-4">
            Para procesar tus pedidos de manera exitosa, recolectamos: Nombre completo, número de cédula/NIT, número de teléfono (WhatsApp), correo electrónico, ciudad y dirección de envío.
          </p>
          <div className="bg-black/50 border border-accent/20 rounded-xl p-4 flex gap-3 items-start">
            <Lock className="w-5 h-5 text-accent shrink-0 mt-0.5" />
            <p className="text-xs text-[#9A9A94]">
              <strong className="text-white">Importante sobre pagos:</strong> SGB Military Shop <strong>NO almacena datos financieros, tarjetas de crédito ni contraseñas bancarias</strong>. Todos los pagos en línea son procesados a través de la pasarela segura <strong>Wompi (Grupo Bancolombia)</strong>, la cual cuenta con sus propios estándares de encriptación y certificación PCI-DSS.
            </p>
          </div>
        </section>

        <section className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 hover:border-accent/30 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-heading tracking-widest uppercase text-foreground">3. Finalidad del Tratamiento</h2>
          </div>
          <p className="mb-3">Los datos personales suministrados son utilizados exclusivamente para:</p>
          <ul className="list-none space-y-2 pl-2">
            {[
              "Procesar, facturar, despachar y entregar los pedidos realizados en la tienda.",
              "Enviar correos electrónicos transaccionales (confirmación de pago y guía de rastreo).",
              "Contactarte vía WhatsApp en caso de presentarse novedades con el envío.",
              "Cumplir con obligaciones tributarias, legales y contables.",
              "Manejo de garantías, devoluciones y servicio al cliente."
            ].map((item, i) => (
              <li key={i} className="flex gap-2 items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 hover:border-accent/30 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <Phone className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-heading tracking-widest uppercase text-foreground">4. Derechos y Canales de Atención</h2>
          </div>
          <p className="mb-4">
            Como titular, tienes derecho a conocer, actualizar, rectificar tus datos o revocar la autorización. Para ejercer tus derechos de Habeas Data, comunícate a través de nuestros canales oficiales:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-black/30 border border-white/5 p-4 rounded-xl flex flex-col items-center justify-center text-center">
              <span className="text-xs uppercase tracking-widest text-[#9A9A94] mb-1">WhatsApp Oficial</span>
              <strong className="text-white">322 613 3232</strong>
            </div>
            <div className="bg-black/30 border border-white/5 p-4 rounded-xl flex flex-col items-center justify-center text-center">
              <span className="text-xs uppercase tracking-widest text-[#9A9A94] mb-1">Correo Electrónico</span>
              <strong className="text-white">Sgbmilitaryshop@gmail.com</strong>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
