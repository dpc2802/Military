import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Tratamiento de Datos — SGB Military",
};

export default function PoliticaDatosPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
      <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-widest text-foreground mb-8">
        Política de Tratamiento de Datos (Ley 1581 de 2012)
      </h1>
      <div className="prose prose-invert prose-p:font-body prose-h2:font-heading prose-h2:tracking-widest prose-h2:uppercase max-w-none text-muted-foreground">
        <h2>1. Marco Legal</h2>
        <p>
          En cumplimiento de lo dispuesto por la Ley Estatutaria 1581 de 2012 y el Decreto Reglamentario 1377 de 2013 de la República de Colombia, SGB Military Shop garantiza el adecuado manejo de los datos personales de sus clientes.
        </p>

        <h2>2. Datos Recolectados</h2>
        <p>
          Para procesar tus pedidos, solicitamos: Nombre completo, número de teléfono (WhatsApp), ciudad y dirección de envío. Esta plataforma <strong>no almacena datos financieros ni números de tarjeta de crédito</strong>, ya que las transacciones se realizan por fuera del sitio (vía transferencia coordinada por WhatsApp).
        </p>

        <h2>3. Finalidad del Tratamiento</h2>
        <p>
          Tus datos personales son utilizados exclusivamente para:
        </p>
        <ul>
          <li>Procesar, despachar y entregar los pedidos realizados.</li>
          <li>Contactarte vía WhatsApp para confirmar tu pago y estado de envío.</li>
          <li>Cumplir con obligaciones legales y tributarias si aplica.</li>
        </ul>

        <h2>4. Derechos de los Titulares</h2>
        <p>
          Como titular de la información, tienes derecho a conocer, actualizar y rectificar tus datos personales. Podrás solicitar la eliminación de tu información de nuestra base de datos en cualquier momento comunicándote a nuestro canal oficial de WhatsApp.
        </p>
      </div>
    </div>
  );
}
