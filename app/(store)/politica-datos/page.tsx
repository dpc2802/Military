import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PolÃ­tica de Tratamiento de Datos | SGB Military",
};

export default function PoliticaDatosPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
      <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-widest text-foreground mb-8">
        PolÃ­tica de Tratamiento de Datos
      </h1>
      <div className="prose prose-invert prose-p:font-body prose-h2:font-heading prose-h2:tracking-widest prose-h2:uppercase max-w-none text-muted-foreground">
        <p className="text-sm italic mb-8">Ãšltima actualizaciÃ³n: Septiembre 2026</p>
        
        <h2>1. Marco Legal</h2>
        <p>
          En estricto cumplimiento de lo dispuesto por la Ley Estatutaria 1581 de 2012 y el Decreto Reglamentario 1377 de 2013 de la RepÃºblica de Colombia, <strong>SGB MILITARY SHOP (NIT 1000412101)</strong> (en adelante "SGB Military Shop"), garantiza el adecuado tratamiento, privacidad y seguridad de los datos personales de sus clientes.
        </p>

        <h2>2. InformaciÃ³n Recolectada</h2>
        <p>
          Para procesar tus pedidos de manera exitosa, recolectamos: Nombre completo, nÃºmero de cÃ©dula/NIT, nÃºmero de telÃ©fono (WhatsApp), correo electrÃ³nico, ciudad y direcciÃ³n de envÃ­o.
        </p>
        <p>
          <strong>Importante sobre pagos:</strong> SGB Military Shop <strong>NO almacena datos financieros, tarjetas de crÃ©dito ni contraseÃ±as bancarias</strong>. Todos los pagos en lÃ­nea son procesados a travÃ©s de la pasarela segura <strong>Wompi (Grupo Bancolombia)</strong>, la cual cuenta con sus propios estÃ¡ndares de encriptaciÃ³n y certificaciÃ³n PCI-DSS.
        </p>

        <h2>3. Finalidad del Tratamiento</h2>
        <p>
          Los datos personales suministrados son utilizados exclusivamente para:
        </p>
        <ul>
          <li>Procesar, facturar, despachar y entregar los pedidos realizados en la tienda.</li>
          <li>Enviar correos electrÃ³nicos transaccionales (confirmaciÃ³n de pago y guÃ­a de rastreo).</li>
          <li>Contactarte vÃ­a WhatsApp en caso de presentarse novedades con el envÃ­o.</li>
          <li>Cumplir con obligaciones tributarias, legales y contables.</li>
          <li>Manejo de garantÃ­as, devoluciones y servicio al cliente.</li>
        </ul>

        <h2>4. Derechos de los Titulares</h2>
        <p>
          Como titular de los datos personales, tienes derecho a:
        </p>
        <ul>
          <li>Conocer, actualizar y rectificar tus datos personales.</li>
          <li>Solicitar prueba de la autorizaciÃ³n otorgada.</li>
          <li>Revocar la autorizaciÃ³n y/o solicitar la supresiÃ³n del dato cuando en el tratamiento no se respeten los principios, derechos y garantÃ­as constitucionales y legales.</li>
        </ul>

        <h2>5. Canales de AtenciÃ³n</h2>
        <p>
          Para ejercer tus derechos de Habeas Data, puedes comunicarte a travÃ©s de nuestros canales oficiales:
        </p>
        <ul>
          <li><strong>WhatsApp:</strong> 3226133232</li>
          <li><strong>Correo ElectrÃ³nico:</strong> Sgbmilitaryshop@gmail.com</li>
        </ul>
      </div>
    </div>
  );
}
