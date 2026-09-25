import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PolÃ­tica de EnvÃ­os | SGB Military",
};

export default function PoliticaEnviosPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
      <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-widest text-foreground mb-8">
        PolÃ­tica de EnvÃ­os y Entregas
      </h1>
      <div className="prose prose-invert prose-p:font-body prose-h2:font-heading prose-h2:tracking-widest prose-h2:uppercase max-w-none text-muted-foreground">
        
        <h2>1. Cobertura</h2>
        <p>
          Realizamos envÃ­os a nivel nacional (todo el territorio colombiano) a travÃ©s de transportadoras aliadas reconocidas (Inter RapidÃ­simo, Servientrega, EnvÃ­a, Coordinadora, etc.).
        </p>

        <h2>2. Tiempos de Despacho y Entrega</h2>
        <p>
          Los pedidos son procesados y despachados en un mÃ¡ximo de <strong>24 a 48 horas hÃ¡biles</strong> una vez confirmado el pago.
        </p>
        <ul>
          <li><strong>Ciudades Principales:</strong> El tiempo estimado de entrega es de 1 a 3 dÃ­as hÃ¡biles despuÃ©s del despacho.</li>
          <li><strong>Poblaciones Lejanas o Trayectos Especiales:</strong> El tiempo estimado puede variar entre 3 a 8 dÃ­as hÃ¡biles dependiendo de la logÃ­stica de la transportadora.</li>
        </ul>
        <p><em>Nota: Los domingos y dÃ­as festivos no cuentan como dÃ­as hÃ¡biles para despachos ni trÃ¡nsito logÃ­stico.</em></p>

        <h2>3. Seguimiento y Rastreo (Tracking)</h2>
        <p>
          Una vez tu pedido sea entregado a la transportadora, te enviaremos un correo electrÃ³nico automÃ¡tico (y/o mensaje de WhatsApp) con el <strong>NÃºmero de GuÃ­a</strong> y el enlace para que puedas rastrear el estado de tu paquete en tiempo real.
        </p>

        <h2>4. Novedades y Retrasos</h2>
        <p>
          SGB Military Shop no se hace responsable por retrasos en las entregas causados por eventos de fuerza mayor ajenos a nuestro control (cierres viales, paros, condiciones climÃ¡ticas extremas o contingencias de la transportadora). Sin embargo, siempre estaremos dispuestos a ayudarte a gestionar cualquier novedad con la empresa de envÃ­os.
        </p>

        <h2>5. Entregas Fallidas</h2>
        <p>
          Si la transportadora intenta entregar el paquete y no hay quiÃ©n lo reciba en la direcciÃ³n indicada, usualmente realizarÃ¡n un segundo intento. Si el paquete es devuelto a nuestras bodegas por errores en la direcciÃ³n suministrada por el cliente o por ausencia reiterada, el cliente deberÃ¡ asumir el costo del nuevo envÃ­o.
        </p>
      </div>
    </div>
  );
}
