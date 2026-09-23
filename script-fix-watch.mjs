import fs from "fs";
const path = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/(store)/checkout/page.tsx";
let content = fs.readFileSync(path, "utf-8");

content = content.replace(
  "    handleSubmit,\n    formState: { errors },\n  } = useForm<CheckoutForm>({",
  "    handleSubmit,\n    watch,\n    formState: { errors },\n  } = useForm<CheckoutForm>({"
);

fs.writeFileSync(path, content, "utf-8");
console.log("Fixed reference error");
