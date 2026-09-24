/**
 * Página de detalle de producto.
 * Ruta: /productos/[slug]
 * 
 * SSR con metadata dinámica, JSON-LD tipo Product para SEO, galería con
 * selector de imagen principal, selector de talla/color, y disclaimer
 * condicional para productos que lo requieran.
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { products, productVariants, categories, reviews } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { formatCOP, parsePrice } from "@/lib/format";
import { SITE_URL } from "@/lib/constants";
import ProductDetailClient from "@/components/store/ProductDetailClient";
import type { ProductImage } from "@/db/schema";

interface ProductPageProps {
  params: { slug: string };
}

// Generar metadata dinámica por producto
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) return { title: "Producto no encontrado" };

  const images = product.images as ProductImage[];
  const mainImage = images[0];

  return {
    title: product.metaTitle ?? product.name,
    description:
      product.metaDescription ??
      `${product.name} — ${formatCOP(parsePrice(product.price))}. Comprá por WhatsApp en SGB Military Shop.`,
    openGraph: {
      title: product.name,
      description: product.metaDescription ?? product.name,
      images: mainImage ? [{ url: mainImage.url, alt: mainImage.altText }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      images: mainImage ? [mainImage.url] : [],
    },
  };
}

async function getProduct(slug: string) {
  return await db.query.products.findFirst({
    where: and(eq(products.slug, slug), eq(products.isActive, true)),
    with: {
      category: true,
      variants: {
        where: eq(productVariants.isActive, true),
      },
      reviews: {
        where: eq(reviews.isApproved, true),
        orderBy: desc(reviews.createdAt),
        limit: 10,
      },
    },
  });
}

async function getRelatedProducts(categoryId: number, excludeSlug: string) {
  return await db.query.products.findMany({
    where: and(
      eq(products.categoryId, categoryId),
      eq(products.isActive, true)
    ),
    with: {
      category: true,
      variants: { where: eq(productVariants.isActive, true) },
    },
    limit: 4,
  }).then((ps) => ps.filter((p) => p.slug !== excludeSlug));
}

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  const relatedProducts = await getRelatedProducts(product.categoryId, params.slug);

  const images = product.images as ProductImage[];
  const price = parsePrice(product.price);

  // JSON-LD tipo Product para Google
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description ?? product.name,
    image: images.map((img) => img.url),
    brand: { "@type": "Brand", name: "SGB Military Shop" },
    offers: {
      "@type": "Offer",
      priceCurrency: "COP",
      price: price,
      availability:
        product.variants.some((v) => v.stock - v.reservedStock > 0)
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: "SGB Military Shop" },
      url: `${SITE_URL}/productos/${product.slug}`,
    },
    aggregateRating:
      product.reviews.length > 0
        ? {
            "@type": "AggregateRating",
            ratingValue:
              product.reviews.reduce((s, r) => s + r.rating, 0) /
              product.reviews.length,
            reviewCount: product.reviews.length,
          }
        : undefined,
  };

  return (
    <>
      {/* JSON-LD SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ProductDetailClient
        product={product as Parameters<typeof ProductDetailClient>[0]["product"]}
        relatedProducts={relatedProducts as Parameters<typeof ProductDetailClient>[0]["relatedProducts"]}
      />
    </>
  );
}
