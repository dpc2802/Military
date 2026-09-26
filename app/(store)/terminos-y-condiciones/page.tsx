import { Metadata } from "next";

export const metadata: Metadata = {
  title: "TÃ©rminos y Condiciones | SGB Military",
};

export default function TerminosPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
      <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-widest text-foreground mb-8">
        TÃ©rminos y Condiciones
      </h1>
      <div className="prose prose-invert prose-p:font-body prose-h2:font-heading prose-h2:tracking-widest prose-h2:uppercase max-w-none text-muted-foreground">
        
        <h2>1. AceptaciÃ³n de TÃ©rminos</h2>
        <p>
          Al ingresar y utilizar la tienda virtual de SGB Military Shop (en adelante "el Sitio Web"), el usuario acepta estar sujeto a los presentes TÃ©rminos y Condiciones. Si no estÃ¡ de acuerdo con alguna parte de estos tÃ©rminos, le solicitamos abstenerse de utilizar nuestros servicios.
        </p>

        <h2>2. Uso Civil de los Productos</h2>
        <p>
          <strong>Nuestros productos son estrictamente para uso civil, deportivo (Airsoft/Paintball) y outdoor.</strong> SGB Military Shop no comercializa armas de fuego reales, municiÃ³n letal, ni artÃ­culos de uso privativo de las Fuerzas Armadas de Colombia. El comprador asume total responsabilidad legal por el uso adecuado que le dÃ© al equipamiento adquirido.
        </p>

        <h2>3. Precios y Pagos</h2>
        <p>
          Todos los precios mostrados en el Sitio Web estÃ¡n en Pesos Colombianos (COP) y estÃ¡n sujetos a cambios sin previo aviso. SGB Military Shop utiliza la pasarela de pagos <strong>Wompi</strong> para procesar tarjetas de crÃ©dito, dÃ©bito (PSE) y pagos en efectivo. La aprobaciÃ³n de la transacciÃ³n depende enteramente de la entidad bancaria del usuario.
        </p>

        <h2>4. PolÃ­tica de GarantÃ­as</h2>
        <p>
          Ofrecemos una garantÃ­a estÃ¡ndar de <strong>[NÃšMERO DE DÃAS/MESES, ej: 30 dÃ­as]</strong> sobre nuestros productos, Ãºnica y exclusivamente por defectos de fÃ¡brica (costuras, cremalleras, defectos de material). 
        </p>
        <p>
          <strong>La garantÃ­a NO cubre:</strong>
        </p>
        <ul>
          <li>Desgaste natural por uso.</li>
          <li>DaÃ±os causados por mal uso, negligencia o alteraciones al producto original.</li>
          <li>DaÃ±os por mal lavado o secado.</li>
        </ul>

        <h2>5. Cambios y Devoluciones (Derecho de Retracto)</h2>
        <p>
          De acuerdo con el Estatuto del Consumidor de Colombia (Ley 1480 de 2011), el usuario tiene derecho a retractarse de la compra dentro de los primeros cinco (5) dÃ­as hÃ¡biles siguientes a la entrega del producto. El producto debe devolverse en perfecto estado, sin signos de uso y con sus etiquetas originales. Si existe alguna novedad o defecto real de fábrica en el producto, el vendedor (SGB Military Shop) asume los gastos de envío.
        </p>

        <h2>6. Modificaciones</h2>
        <p>
          Nos reservamos el derecho de modificar estos TÃ©rminos y Condiciones en cualquier momento. Los cambios entrarÃ¡n en vigencia inmediatamente despuÃ©s de su publicaciÃ³n en el Sitio Web.
        </p>
      </div>
    </div>
  );
}
