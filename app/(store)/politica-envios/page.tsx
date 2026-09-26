import { Metadata } from "next";
import { Truck, MapPin, Clock, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Política de Envíos | SGB Military",
};

export default function PoliticaEnviosPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
      <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
        <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center border border-accent/20">
          <Truck className="w-6 h-6 text-accent" />
        </div>
        <div>
          <h1 className="font-heading text-2xl md:text-4xl uppercase tracking-widest text-foreground">
            Envíos y Entregas
          </h1>
          <p className="text-xs text-muted-foreground mt-2 font-body uppercase tracking-wider">
            Última actualización: Septiembre 2026
          </p>
        </div>
      </div>

      <div className="space-y-8 font-body text-sm text-muted-foreground leading-relaxed">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-accent/30 transition-colors">
            <MapPin className="w-8 h-8 text-accent mb-4" />
            <h3 className="text-lg font-heading tracking-widest uppercase text-foreground mb-2">Cobertura Nacional</h3>
            <p>
              Realizamos despachos desde <strong>Medellín</strong> a nivel nacional a través de transportadoras aliadas reconocidas (Servientrega, Inter Rapidísimo).
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-accent/30 transition-colors">
            <Clock className="w-8 h-8 text-accent mb-4" />
            <h3 className="text-lg font-heading tracking-widest uppercase text-foreground mb-2">Tiempos de Entrega</h3>
            <p>
              El tiempo estimado de llegada del envío es de <strong>6 días hábiles</strong> aproximadamente. En trayectos especiales, el tiempo puede extenderse dependiendo de la logística de la transportadora.
            </p>
          </div>
        </div>

        <section className="bg-accent/10 border border-accent/20 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-heading tracking-widest uppercase text-accent mb-4">Costos de Envío</h2>
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1 space-y-4">
              <p className="text-white">
                Manejamos una tarifa estándar de envío a nivel nacional:
              </p>
              <div className="text-3xl font-heading tracking-widest text-white">
                $25.000 <span className="text-sm text-accent">COP</span>
              </div>
            </div>
            <div className="hidden md:block w-px h-16 bg-white/20"></div>
            <div className="flex-1 bg-black/30 p-5 rounded-xl border border-white/10">
              <span className="inline-block bg-accent text-black text-[10px] font-heading px-2 py-1 uppercase tracking-widest mb-2">¡Promoción!</span>
              <p className="text-white font-bold">Envío GRATIS</p>
              <p className="text-xs mt-1 text-[#9A9A94]">Por compras iguales o superiores a $300.000 COP en artículos.</p>
            </div>
          </div>
        </section>

        <section className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 hover:border-accent/30 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-heading tracking-widest uppercase text-foreground">Novedades y Entregas Fallidas</h2>
          </div>
          <p className="mb-3">
            SGB Military Shop no se hace responsable por retrasos causados por eventos de fuerza mayor ajenos a nuestro control (cierres viales, paros, clima). Sin embargo, te ayudaremos a gestionar cualquier novedad.
          </p>
          <p>
            Si el paquete es devuelto a nuestras bodegas por errores en la dirección suministrada o por ausencia reiterada, el cliente deberá asumir el costo del nuevo envío.
          </p>
        </section>

      </div>
    </div>
  );
}
