import { gunzipSync } from "node:zlib";
import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/admin-auth";
import { defaultHomeContent, normalizeHomeContent, type HomeContentState } from "@/lib/home-content";
import { loadSiteContentRow, saveSiteContentRow } from "@/lib/site-content-store";

const CONTENT_KEY = "site";

async function loadLegacyContent(): Promise<HomeContentState> {
  const [
    heroSlides,
    aboutSections,
    programGroups,
    newsEvents,
    galleryCategories,
    storeCategories,
    footerContent,
    footerLinks,
    footerSocials,
    footerBrands,
    joinRegistrations,
    contactSubmissions,
    feedbackSubmissions,
    engageSubmissions,
    supportSubmissions
  ] = await Promise.all([
    prisma.heroSlide.findMany({ orderBy: { order: "asc" } }),
    prisma.aboutSection.findMany({ orderBy: { order: "asc" } }),
    prisma.programGroup.findMany({
      include: { subSections: { orderBy: { order: "asc" } } },
      orderBy: { order: "asc" }
    }),
    prisma.newsEvent.findMany({ orderBy: { order: "asc" } }),
    prisma.galleryCategory.findMany({
      include: { items: { orderBy: { order: "asc" } } },
      orderBy: { order: "asc" }
    }),
    prisma.storeCategory.findMany({
      include: { products: { orderBy: { order: "asc" } } },
      orderBy: { order: "asc" }
    }),
    prisma.footerContent.findFirst(),
    prisma.footerLink.findMany({ orderBy: { order: "asc" } }),
    prisma.footerSocial.findMany({ orderBy: { order: "asc" } }),
    prisma.footerBrand.findMany({ orderBy: { order: "asc" } }),
    prisma.joinRegistration.findMany({ orderBy: { submittedAt: "desc" } }),
    prisma.contactSubmission.findMany({ orderBy: { submittedAt: "desc" } }),
    prisma.feedbackSubmission.findMany({ orderBy: { submittedAt: "desc" } }),
    prisma.engageSubmission.findMany({ orderBy: { submittedAt: "desc" } }),
    prisma.supportSubmission.findMany({ orderBy: { submittedAt: "desc" } })
  ]);

  return normalizeHomeContent({
    ...defaultHomeContent,
    heroSlides: heroSlides.map((slide) => ({
      id: slide.id,
      title: slide.title,
      description: slide.description,
      image: slide.image
    })),
    aboutSections: aboutSections.map((section) => ({
      id: section.id,
      title: section.title,
      description: section.description,
      image: section.image,
      slug: section.slug
    })),
    programGroups: programGroups.map((group) => ({
      id: group.id,
      slug: group.slug,
      ageGroup: group.ageGroup,
      title: group.title,
      description: group.description,
      image: group.image,
      featured: group.featured,
      subSections: group.subSections.map((subSection) => ({
        id: subSection.id,
        title: subSection.title,
        description: subSection.description
      })),
      mediaItems: []
    })),
    newsItems: newsEvents.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      image: item.image,
      slug: item.slug,
      kind: item.kind as "news" | "event",
      article: item.content ?? item.description,
      occurrenceDate: item.publishedAt.toISOString(),
      pinned: item.featured
    })),
    galleryCategories: galleryCategories.map((category) => ({
      id: category.id,
      slug: category.slug,
      title: category.title,
      description: category.description,
      image: category.image,
      featured: category.featured,
      items: category.items.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        mediaType: item.mediaType as "image" | "video",
        src: item.src,
        thumbnail: item.thumbnail
      }))
    })),
    storeCategories: storeCategories.map((category) => ({
      id: category.id,
      slug: category.slug,
      title: category.title,
      description: category.description,
      image: category.image,
      featured: category.featured,
      products: category.products.map((product) => ({
        id: product.id,
        title: product.title,
        description: product.description,
        image: product.image,
        price: product.price,
        customizationPrice: "$0",
        nameOnlyPrice: product.price,
        numberOnlyPrice: product.price,
        nameAndNumberPrice: product.price,
        featured: product.featured,
        colorOptions: product.colorOptions.split(",").filter(Boolean),
        sizeOptions: product.sizeOptions.split(",").filter(Boolean),
        supportsNumber: product.supportsNumber,
        supportsName: product.supportsName,
        supportsCustomMade: product.supportsCustomMade
      }))
    })),
    footerContent: footerContent
      ? {
        brandName: footerContent.brandName,
        badgeLabel: footerContent.badgeLabel,
        badgeImage: (footerContent as { badgeImage?: string }).badgeImage ?? "",
        description: footerContent.description,
        location: footerContent.location,
        email: footerContent.email,
          whatsapp: footerContent.whatsapp,
          phone: footerContent.phone,
          links: footerLinks.map((link) => ({ id: link.id, label: link.label, href: link.href })),
          socials: footerSocials.map((social) => ({
            id: social.id,
            label: social.label,
            href: social.href,
            icon: social.icon as "tiktok" | "facebook" | "instagram" | "youtube" | "whatsapp" | "email"
          })),
          footerBrands: footerBrands.map((brand) => ({
            id: brand.id,
            label: brand.label,
            href: brand.href,
            kind: brand.kind as "sponsor" | "partner",
            badgeImage: (brand as { badgeImage?: string }).badgeImage ?? "",
            description: "",
            location: "",
            contactEmail: "",
            contactPhone: "",
            services: [],
            galleryImages: [],
            socials: []
          }))
        }
      : defaultHomeContent.footerContent,
    joinRegistrations: joinRegistrations.map((item) => ({
      id: item.id,
      playerName: item.playerName,
      dateOfBirth: item.dateOfBirth,
      guardianName: item.guardianName,
      guardianEmail: item.guardianEmail,
      guardianPhone: item.guardianPhone,
      emergencyContact: item.emergencyContact,
      address: item.address,
      residence: item.residence,
      medicalInformation: item.medicalInformation,
      consent: item.consent,
      photoPublicationConsent: item.photoPublicationConsent as "accepted" | "denied",
      status: item.status as "pending" | "approved" | "rejected" | "deleted",
      submittedAt: item.submittedAt.toISOString(),
      reviewedAt: item.reviewedAt?.toISOString(),
      adminNote: item.adminNote ?? "",
      whatsappConfirmedAt: item.whatsappConfirmedAt?.toISOString(),
      emailConfirmedAt: item.emailConfirmedAt?.toISOString()
    })),
    contactSubmissions: contactSubmissions.map((item) => ({
      id: item.id,
      name: item.name,
      email: item.email,
      phone: item.phone,
      subject: item.subject,
      message: item.message,
      status: item.status as "new" | "read" | "archived",
      submittedAt: item.submittedAt.toISOString(),
      adminNote: item.adminNote ?? ""
    })),
    feedbackSubmissions: feedbackSubmissions.map((item) => ({
      id: item.id,
      name: item.name,
      message: item.message,
      rating: item.rating,
      status: item.status as "pending" | "approved" | "rejected",
      submittedAt: item.submittedAt.toISOString(),
      reviewedAt: item.reviewedAt?.toISOString(),
      adminNote: item.adminNote ?? ""
    })),
    engageSubmissions: engageSubmissions.map((item) => ({
      id: item.id,
      name: item.name,
      email: item.email,
      phone: item.phone,
      engagementType: item.engagementType,
      occupation: item.occupation,
      skills: item.skills,
      message: item.message,
      status: item.status as "new" | "contacted" | "approved" | "archived",
      submittedAt: item.submittedAt.toISOString(),
      adminNote: item.adminNote ?? ""
    })),
    supportSubmissions: supportSubmissions.map((item) => ({
      id: item.id,
      name: item.name,
      email: item.email,
      phone: item.phone,
      supportType: item.supportType,
      supportDetails: item.supportDetails,
      preferredPaymentStream: item.preferredPaymentStream,
      amount: item.amount,
      status: item.status as "new" | "contacted" | "fulfilled" | "archived",
      submittedAt: item.submittedAt.toISOString(),
      adminNote: item.adminNote ?? ""
    }))
  });
}

async function parseRequestBody(request: NextRequest): Promise<HomeContentState> {
  const contentEncoding = request.headers.get("content-encoding")?.toLowerCase();
  const raw = Buffer.from(await request.arrayBuffer());

  if (contentEncoding?.includes("gzip")) {
    const text = gunzipSync(raw).toString("utf8");
    return JSON.parse(text) as HomeContentState;
  }

  return JSON.parse(raw.toString("utf8")) as HomeContentState;
}

async function loadStoredContent(): Promise<HomeContentState | null> {
  const row = await loadSiteContentRow(CONTENT_KEY);

  if (!row) {
    return null;
  }

  try {
    const parsed = JSON.parse(row.payload) as HomeContentState;
    const normalized = normalizeHomeContent(parsed);

    if (JSON.stringify(normalized) !== row.payload) {
      await saveStoredContent(normalized);
    }

    return normalized;
  } catch {
    return null;
  }
}

async function saveStoredContent(content: HomeContentState) {
  const normalized = normalizeHomeContent(content);

  await saveSiteContentRow(CONTENT_KEY, JSON.stringify(normalized));

  return normalized;
}

export async function GET() {
  try {
    const stored = await loadStoredContent();

    if (stored) {
      return NextResponse.json(stored);
    }

    const legacy = await loadLegacyContent();
    await saveStoredContent(legacy);
    return NextResponse.json(legacy);
  } catch (error) {
    console.error("Failed to fetch content:", error);
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const token = request.cookies.get("bru_admin_session")?.value;
  const session = verifyAdminSession(token);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await parseRequestBody(request);
    const saved = await saveStoredContent(body);

    return NextResponse.json({ ok: true, content: saved });
  } catch (error) {
    console.error("Failed to update content:", error);
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 });
  }
}
