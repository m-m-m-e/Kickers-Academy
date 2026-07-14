-- AlterTable
ALTER TABLE "public"."AboutSection" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."FooterBrand" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."FooterContent" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."FooterLink" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."FooterSocial" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."GalleryCategory" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."GalleryMedia" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."HeroSlide" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."NewsEvent" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."ProgramGroup" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."ProgramSubSection" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."SiteContent" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."StoreCategory" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."StoreProduct" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateTable
CREATE TABLE "public"."JoinRegistration" (
    "id" TEXT NOT NULL,
    "playerName" TEXT NOT NULL,
    "dateOfBirth" TEXT NOT NULL,
    "guardianName" TEXT NOT NULL,
    "guardianEmail" TEXT NOT NULL,
    "guardianPhone" TEXT NOT NULL,
    "emergencyContact" TEXT NOT NULL,
    "address" TEXT NOT NULL DEFAULT '',
    "residence" TEXT NOT NULL DEFAULT '',
    "medicalInformation" TEXT NOT NULL DEFAULT '',
    "consent" BOOLEAN NOT NULL DEFAULT false,
    "photoPublicationConsent" TEXT NOT NULL DEFAULT 'denied',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "adminNote" TEXT NOT NULL DEFAULT '',
    "whatsappConfirmedAt" TIMESTAMP(3),
    "emailConfirmedAt" TIMESTAMP(3),

    CONSTRAINT "JoinRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ContactSubmission" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL DEFAULT '',
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'new',
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "adminNote" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "ContactSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FeedbackSubmission" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "adminNote" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "FeedbackSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EngageSubmission" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL DEFAULT '',
    "engagementType" TEXT NOT NULL,
    "occupation" TEXT NOT NULL DEFAULT '',
    "skills" TEXT NOT NULL DEFAULT '',
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'new',
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "adminNote" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "EngageSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EngageConnectionRequest" (
    "id" TEXT NOT NULL,
    "targetSubmissionId" TEXT NOT NULL DEFAULT '',
    "targetOccupation" TEXT NOT NULL DEFAULT '',
    "targetEngagementType" TEXT NOT NULL DEFAULT '',
    "requesterName" TEXT NOT NULL,
    "requesterEmail" TEXT NOT NULL,
    "requesterPhone" TEXT NOT NULL DEFAULT '',
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'new',
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "adminNote" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "EngageConnectionRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SupportSubmission" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL DEFAULT '',
    "supportType" TEXT NOT NULL,
    "supportDetails" TEXT NOT NULL DEFAULT '',
    "preferredPaymentStream" TEXT NOT NULL DEFAULT '',
    "amount" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'new',
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "adminNote" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "SupportSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StoreOrder" (
    "id" TEXT NOT NULL,
    "buyerName" TEXT NOT NULL,
    "buyerEmail" TEXT NOT NULL,
    "buyerPhone" TEXT NOT NULL DEFAULT '',
    "deliveryPreference" TEXT NOT NULL DEFAULT '',
    "notes" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'new',
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "adminNote" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "StoreOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StoreOrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "productTitle" TEXT NOT NULL,
    "productImage" TEXT NOT NULL DEFAULT '',
    "basePrice" TEXT NOT NULL DEFAULT '',
    "customizationPrice" TEXT NOT NULL DEFAULT '',
    "unitPrice" TEXT NOT NULL DEFAULT '',
    "lineTotal" TEXT NOT NULL DEFAULT '',
    "color" TEXT NOT NULL DEFAULT '',
    "size" TEXT NOT NULL DEFAULT '',
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "name" TEXT NOT NULL DEFAULT '',
    "number" TEXT NOT NULL DEFAULT '',
    "customMade" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "StoreOrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "JoinRegistration_status_idx" ON "public"."JoinRegistration"("status");

-- CreateIndex
CREATE INDEX "JoinRegistration_submittedAt_idx" ON "public"."JoinRegistration"("submittedAt");

-- CreateIndex
CREATE INDEX "ContactSubmission_status_idx" ON "public"."ContactSubmission"("status");

-- CreateIndex
CREATE INDEX "ContactSubmission_submittedAt_idx" ON "public"."ContactSubmission"("submittedAt");

-- CreateIndex
CREATE INDEX "FeedbackSubmission_status_idx" ON "public"."FeedbackSubmission"("status");

-- CreateIndex
CREATE INDEX "FeedbackSubmission_submittedAt_idx" ON "public"."FeedbackSubmission"("submittedAt");

-- CreateIndex
CREATE INDEX "EngageSubmission_status_idx" ON "public"."EngageSubmission"("status");

-- CreateIndex
CREATE INDEX "EngageSubmission_submittedAt_idx" ON "public"."EngageSubmission"("submittedAt");

-- CreateIndex
CREATE INDEX "EngageConnectionRequest_status_idx" ON "public"."EngageConnectionRequest"("status");

-- CreateIndex
CREATE INDEX "EngageConnectionRequest_submittedAt_idx" ON "public"."EngageConnectionRequest"("submittedAt");

-- CreateIndex
CREATE INDEX "SupportSubmission_status_idx" ON "public"."SupportSubmission"("status");

-- CreateIndex
CREATE INDEX "SupportSubmission_submittedAt_idx" ON "public"."SupportSubmission"("submittedAt");

-- CreateIndex
CREATE INDEX "StoreOrder_status_idx" ON "public"."StoreOrder"("status");

-- CreateIndex
CREATE INDEX "StoreOrder_submittedAt_idx" ON "public"."StoreOrder"("submittedAt");

-- CreateIndex
CREATE INDEX "StoreOrderItem_orderId_idx" ON "public"."StoreOrderItem"("orderId");

-- AddForeignKey
ALTER TABLE "public"."StoreOrderItem" ADD CONSTRAINT "StoreOrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."StoreOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
