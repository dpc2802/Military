import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Envíos y Devoluciones — SGB Military",
};

export default function EnviosPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
      <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-widest text-foreground mb-8">
        Envíos y Devoluciones
      </h1>
      <div className="prose prose-invert prose-p:font-body prose-h2:font-heading prose-h2:tracking-widest prose-h2:uppercase max-w-none text-muted-foreground">
        <h2>Políticas de Envío</h2>
        <p>
          Realizamos envíos a todo el territorio colombiano a través de las principales transportadoras nacionales (Inter Rapidísimo, Servientrega, Coordinadora, etc.).
        </p>
        <ul>
          <li><strong>Tiempos de despacho:</strong> Los pedidos confirmados (con pago verificado) antes de las 2:00 PM se despachan el mismo día hábil.</li>
          <li><strong>Tiempos de tránsito:</strong> Dependiendo de la ciudad destino, el envío suele tardar entre 1 a 4 días hábiles.</li>
          <li><strong>Costo:</strong> El valor del envío será liquidado y acordado con el cliente por WhatsApp. Por lo general, se realiza en modalidad "Flete al Cobro" (paga el envío al recibir) si la transportadora lo permite en la ciudad de destino.</li>
        </ul>

        <h2>Cambios y Devoluciones</h2>
        <p>
          De acuerdo con el Estatuto del Consumidor (Ley 1480 de 2011), ofrecemos garantía por defectos de fábrica y aplicamos el derecho de retracto en compras no presenciales:
        </p>
        <ul>
          <li><strong>Garantía:</strong> 30 días calendario por defectos de fabricación en costuras, cierres o materiales defectuosos. No cubre daños por mal uso, desgaste natural o lavado incorrecto.</li>
          <li><strong>Cambios por talla:</strong> Se aceptan dentro de los primeros 5 días tras recibir el producto. El producto debe estar nuevo, sin uso, sin olores y con sus etiquetas originales. Los costos de envío de ida y vuelta para cambios por talla corren por cuenta del cliente.</li>
          <li><strong>Derecho de retracto:</strong> Tienes 5 días hábiles a partir de la entrega para solicitar la devolución del dinero si el producto no cumple tus expectativas. El producto debe regresar en las mismas condiciones en que fue entregado. Los costos de transporte para la devolución son asumidos por el cliente.</li>
        </ul>
      </div>
    </div>
  );
}
