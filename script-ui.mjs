import fs from "fs";
const path = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/(store)/checkout/page.tsx";
let content = fs.readFileSync(path, "utf-8");

// Add paymentMethod to schema
content = content.replace(
  "customerNotes: z.string().optional(),",
  "customerNotes: z.string().optional(),\n  paymentMethod: z.enum(['whatsapp', 'wompi']).default('wompi'),"
);

// Add radio buttons in the form
const paymentUI = `
                <div className="pt-6 border-t border-border">
                  <h3 className="font-heading text-md tracking-widest text-foreground uppercase mb-4">Método de Pago</h3>
                  
                  <div className="space-y-3">
                    <label className="flex items-start gap-3 p-4 border border-border bg-background cursor-pointer hover:border-primary transition-colors">
                      <input 
                        type="radio" 
                        value="wompi" 
                        {...register("paymentMethod")}
                        className="mt-1"
                      />
                      <div>
                        <p className="text-sm font-heading tracking-widest uppercase text-foreground">Tarjetas / PSE / Bancolombia</p>
                        <p className="text-xs text-muted-foreground font-body mt-1">Pago 100% seguro procesado por Wompi.</p>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-4 border border-border bg-background cursor-pointer hover:border-primary transition-colors">
                      <input 
                        type="radio" 
                        value="whatsapp" 
                        {...register("paymentMethod")}
                        className="mt-1"
                      />
                      <div>
                        <p className="text-sm font-heading tracking-widest uppercase text-foreground">Transferencia Manual (WhatsApp)</p>
                        <p className="text-xs text-muted-foreground font-body mt-1">Acuerda el pago por transferencia bancaria directa (Nequi, Daviplata, Bancolombia).</p>
                      </div>
                    </label>
                  </div>
                </div>
`;

content = content.replace(
  "</form>",
  paymentUI + "\n              </form>"
);

// Update button text and redirect logic
content = content.replace(
  `router.push(\`/checkout/success?order=\${result.orderNumber}\`);`,
  `if (result.wompiCheckoutUrl) {
          window.location.href = result.wompiCheckoutUrl;
        } else {
          router.push(\`/checkout/success?order=\${result.orderNumber}\`);
        }`
);

// We need to watch the payment method to update the button text dynamically
content = content.replace(
  "const [isSubmitting, setIsSubmitting] = useState(false);",
  "const [isSubmitting, setIsSubmitting] = useState(false);\n  const { watch } = useForm<CheckoutForm>({ resolver: zodResolver(checkoutFormSchema), defaultValues: { paymentMethod: 'wompi' } });"
);

// But wait, the form was already initialized:
content = content.replace(
  "const {\n      register,\n      handleSubmit,\n      formState: { errors },\n    } = useForm<CheckoutForm>({\n      resolver: zodResolver(checkoutFormSchema),\n    });",
  "const {\n      register,\n      handleSubmit,\n      watch,\n      formState: { errors },\n    } = useForm<CheckoutForm>({\n      resolver: zodResolver(checkoutFormSchema),\n      defaultValues: { paymentMethod: 'wompi' }\n    });"
);

// Clean up the duplicate watch if my previous replace failed or something... actually I should just write a clean script
content = content.replace(
  /const \[isSubmitting, setIsSubmitting\] = useState\(false\);\s*const \{ watch \} = useForm<CheckoutForm>\(\{ resolver: zodResolver\(checkoutFormSchema\), defaultValues: \{ paymentMethod: 'wompi' \} \}\);/,
  "const [isSubmitting, setIsSubmitting] = useState(false);"
);

// Replace the button text
content = content.replace(
  `"Confirmar y Pagar vía WhatsApp"`,
  `watch("paymentMethod") === "wompi" ? "Ir a Pagar Seguro" : "Confirmar y Pagar vía WhatsApp"`
);
content = content.replace(
  `"Confirmar y Pagar vÃ­a WhatsApp"`,
  `watch("paymentMethod") === "wompi" ? "Ir a Pagar Seguro" : "Confirmar y Pagar vía WhatsApp"`
);

// Fix disclaimer
content = content.replace(
  `Al confirmar, se reservarÃ¡ el stock y te redirigiremos a WhatsApp para enviar el comprobante de \npago y coordinar el envÃo.`,
  `Al confirmar, se reservará el stock de tus productos temporalmente.`
);

fs.writeFileSync(path, content, "utf-8");
console.log("Updated checkout UI");
