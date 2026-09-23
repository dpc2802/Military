import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y Condiciones — SGB Military Shop",
};

export default function TerminosPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
      <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-widest text-foreground mb-8">
        Términos y Condiciones
      </h1>
      <div className="prose prose-invert prose-p:font-body prose-h2:font-heading prose-h2:tracking-widest prose-h2:uppercase max-w-none text-muted-foreground">
        <h2>1. Información General</h2>
        <p>
          Bienvenido a SGB Military Shop. Al acceder y realizar una compra en nuestro sitio web, aceptas estar sujeto a los siguientes términos y condiciones. Operamos desde Colombia y todos nuestros productos están sujetos a la legislación colombiana vigente.
        </p>

        <h2>2. Naturaleza de los Productos</h2>
        <p>
          <strong>SGB Military Shop NO comercializa armas de fuego reales, munición letal ni elementos de uso privativo de las fuerzas armadas.</strong> Todos los artículos (ropa, botas, mochilas, equipamiento táctico y réplicas deportivas/airsoft) son de venta libre y uso civil autorizado en el territorio colombiano.
        </p>

        <h2>3. Proceso de Compra y WhatsApp</h2>
        <p>
          Nuestra plataforma web funciona como un catálogo interactivo. Al confirmar un pedido en el carrito, los productos seleccionados se reservan por un máximo de 24 horas. La venta <strong>solo se concreta y formaliza</strong> a través de nuestro canal oficial de WhatsApp, una vez verificado el comprobante de pago.
        </p>
        <p>
          Si pasadas las 24 horas no hemos recibido confirmación de pago, el sistema liberará automáticamente el inventario reservado y el pedido será cancelado.
        </p>

        <h2>4. Precios y Pagos</h2>
        <p>
          Todos los precios están expresados en Pesos Colombianos (COP) y están sujetos a cambios sin previo aviso. Los costos de envío no están incluidos en el precio del producto y se calcularán durante la atención por WhatsApp, dependiendo de tu ubicación.
        </p>

        <h2>5. Disponibilidad de Inventario</h2>
        <p>
          Hacemos todo lo posible por mantener el inventario web sincronizado en tiempo real. Sin embargo, en casos excepcionales de discrepancia de stock simultánea, el servicio de atención al cliente se pondrá en contacto contigo para ofrecer un reembolso total o un cambio por un artículo similar.
        </p>
      </div>
    </div>
  );
}
