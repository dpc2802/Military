import { Metadata } from "next";
import { Scale, CheckCircle, AlertTriangle, ShieldAlert, RefreshCcw } from "lucide-react";

export const metadata: Metadata = {
  title: "Términos y Condiciones | SGB Military",
};

export default function TerminosPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
      <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
        <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center border border-accent/20">
          <Scale className="w-6 h-6 text-accent" />
        </div>
        <div>
          <h1 className="font-heading text-2xl md:text-4xl uppercase tracking-widest text-foreground">
            Términos y Condiciones
          </h1>
          <p className="text-xs text-muted-foreground mt-2 font-body uppercase tracking-wider">
            Última actualización: Septiembre 2026
          </p>
        </div>
      </div>

      <div className="space-y-8 font-body text-sm text-muted-foreground leading-relaxed">
        
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 hover:border-accent/30 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-heading tracking-widest uppercase text-foreground">1. Aceptación de Términos</h2>
          </div>
          <p>
            Al ingresar y utilizar la tienda virtual de SGB Military Shop (en adelante "el Sitio Web"), el usuario acepta estar sujeto a los presentes Términos y Condiciones. Si no está de acuerdo con alguna parte de estos términos, le solicitamos abstenerse de utilizar nuestros servicios.
          </p>
        </section>

        <section className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-heading tracking-widest uppercase text-red-500">2. Uso Civil de los Productos</h2>
          </div>
          <p className="text-red-200">
            <strong>Nuestros productos son estrictamente para uso civil, deportivo (Airsoft/Paintball) y outdoor.</strong> SGB Military Shop no comercializa armas de fuego reales, munición letal, ni artículos de uso privativo de las Fuerzas Armadas de Colombia. El comprador asume total responsabilidad legal por el uso adecuado que le dé al equipamiento adquirido.
          </p>
        </section>

        <section className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 hover:border-accent/30 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <ShieldAlert className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-heading tracking-widest uppercase text-foreground">3. Política de Garantías</h2>
          </div>
          <p className="mb-4">
            Ofrecemos una garantía estándar de <strong>15 días</strong> sobre nuestros productos, única y exclusivamente por defectos de fábrica (costuras, cremalleras, defectos de material).
          </p>
          <div className="bg-black/50 p-4 rounded-xl border border-white/5">
            <p className="font-bold text-white mb-2">La garantía NO cubre:</p>
            <ul className="list-none space-y-2 pl-2">
              <li className="flex gap-2 items-start">
                <span className="text-red-500 shrink-0">✕</span>
                <span>Desgaste natural por uso.</span>
              </li>
              <li className="flex gap-2 items-start">
                <span className="text-red-500 shrink-0">✕</span>
                <span>Daños causados por mal uso, negligencia o alteraciones al producto original.</span>
              </li>
              <li className="flex gap-2 items-start">
                <span className="text-red-500 shrink-0">✕</span>
                <span>Daños por mal lavado o secado.</span>
              </li>
            </ul>
          </div>
        </section>

        <section className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 hover:border-accent/30 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <RefreshCcw className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-heading tracking-widest uppercase text-foreground">4. Cambios y Devoluciones (Derecho de Retracto)</h2>
          </div>
          <p>
            De acuerdo con el Estatuto del Consumidor de Colombia (Ley 1480 de 2011), el usuario tiene derecho a retractarse de la compra dentro de los primeros cinco (5) días hábiles siguientes a la entrega del producto. El producto debe devolverse en perfecto estado, sin signos de uso y con sus etiquetas originales. <strong>Si existe alguna novedad o defecto real de fábrica en el producto, el vendedor (SGB Military Shop) asume los gastos de envío.</strong>
          </p>
        </section>

      </div>
    </div>
  );
}
