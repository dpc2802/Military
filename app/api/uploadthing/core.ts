import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getAdminSession } from "@/lib/auth";

const f = createUploadthing();

export const ourFileRouter = {
  productImage: f({ image: { maxFileSize: "4MB", maxFileCount: 6 } })
    .middleware(async () => {
      const admin = await getAdminSession();
      if (!admin) throw new Error("No autorizado");
      return { adminId: admin.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload completado por admin", metadata.adminId);
      console.log("URL de archivo:", file.url);
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
