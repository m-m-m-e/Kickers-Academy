"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  defaultHomeContent,
  normalizeHomeContent,
  type HomeContentState,
  type GalleryCategory,
  type GalleryMediaItem,
  type StoreCategory,
  type StoreOrder,
  type StoreOrderStatus,
  type StoreProduct,
  type FooterContent,
  type FooterBrandItem,
  type FooterIconItem,
  type FooterLinkItem,
  type JoinPageContent,
  type JoinRegistration,
  type JoinRegistrationStatus,
  type ContactSubmission,
  type ContactSubmissionStatus,
  type ContactPageContent,
  type DonatePageContent,
  type FeedbackSubmission,
  type FeedbackSubmissionStatus,
  type NotificationSettings,
  type EngageConnectionRequest,
  type EngageConnectionRequestStatus,
  type EngageSubmission,
  type EngageSubmissionStatus,
  type SupportSubmission,
  type SupportSubmissionStatus,
  type AboutCoach,
  type ProgramsProgressionPathContent,
  type ProgressionPathStage,
  type ProgramGroup,
  type ProgramMediaItem,
  type ProgramSubSection,
  type HomeSectionKey,
  type ImageContentItem
} from "@/lib/home-content";

type HomeContentContextValue = {
  content: HomeContentState;
  hasUnsavedChanges: boolean;
  saveStatus: "idle" | "saving" | "saved" | "error";
  saveContent: () => Promise<void>;
  replaceSectionItems: (section: HomeSectionKey, items: ImageContentItem[]) => void;
  addSectionItem: (section: HomeSectionKey, item?: ImageContentItem) => string;
  updateSectionItem: (section: HomeSectionKey, item: ImageContentItem) => void;
  deleteSectionItem: (section: HomeSectionKey, id: string) => void;
  updateAboutHero: (item: ImageContentItem) => void;
  addAboutSection: (item?: ImageContentItem) => string;
  updateAboutSection: (item: ImageContentItem) => void;
  deleteAboutSection: (id: string) => void;
  addAboutCoach: (coach?: AboutCoach) => string;
  updateAboutCoach: (coach: AboutCoach) => void;
  deleteAboutCoach: (id: string) => void;
  updateProgramsHero: (item: ImageContentItem) => void;
  updateProgramsProgressionPath: (content: ProgramsProgressionPathContent) => void;
  addProgressionPathStage: (stage?: ProgressionPathStage) => string;
  updateProgressionPathStage: (stage: ProgressionPathStage) => void;
  deleteProgressionPathStage: (id: string) => void;
  updateNewsEventsHero: (item: ImageContentItem) => void;
  updateGalleryHero: (item: ImageContentItem) => void;
  updateStoreHero: (item: ImageContentItem) => void;
  updateJoinPage: (content: JoinPageContent) => void;
  updateJoinRegistration: (registration: JoinRegistration) => void;
  deleteJoinRegistration: (id: string) => void;
  updateJoinRegistrationStatus: (id: string, status: JoinRegistrationStatus, adminNote?: string) => void;
  updateContactPage: (content: ContactPageContent) => void;
  updateContactSubmission: (submission: ContactSubmission) => void;
  updateContactSubmissionStatus: (id: string, status: ContactSubmissionStatus, adminNote?: string) => void;
  deleteContactSubmission: (id: string) => void;
  updateFeedbackSubmission: (submission: FeedbackSubmission) => void;
  updateFeedbackSubmissionStatus: (id: string, status: FeedbackSubmissionStatus, adminNote?: string) => void;
  updateDonatePage: (content: DonatePageContent) => void;
  updateNotificationSettings: (settings: NotificationSettings) => void;
  updateEngageConnectionRequest: (request: EngageConnectionRequest) => void;
  updateEngageConnectionRequestStatus: (id: string, status: EngageConnectionRequestStatus, adminNote?: string) => void;
  deleteEngageConnectionRequest: (id: string) => void;
  updateEngageSubmission: (submission: EngageSubmission) => void;
  updateEngageSubmissionStatus: (id: string, status: EngageSubmissionStatus, adminNote?: string) => void;
  deleteEngageSubmission: (id: string) => void;
  updateSupportSubmission: (submission: SupportSubmission) => void;
  updateSupportSubmissionStatus: (id: string, status: SupportSubmissionStatus, adminNote?: string) => void;
  deleteSupportSubmission: (id: string) => void;
  updateFooterContent: (content: FooterContent) => void;
  updateActionCard: (item: ImageContentItem) => void;
  updateActionCardImage: (id: string, image: string) => void;
  addFooterLink: (item?: FooterLinkItem) => string;
  updateFooterLink: (item: FooterLinkItem) => void;
  deleteFooterLink: (id: string) => void;
  addFooterSocial: (item?: FooterIconItem) => string;
  updateFooterSocial: (item: FooterIconItem) => void;
  deleteFooterSocial: (id: string) => void;
  addFooterBrand: (item?: FooterBrandItem) => string;
  updateFooterBrand: (item: FooterBrandItem) => void;
  updateFooterBrandBadgeImage: (id: string, badgeImage: string) => void;
  deleteFooterBrand: (id: string) => void;
  addProgramGroup: (group?: ProgramGroup) => string;
  updateProgramGroup: (group: ProgramGroup) => void;
  deleteProgramGroup: (id: string) => void;
  addProgramSubSection: (groupId: string, subSection?: ProgramSubSection) => string;
  updateProgramSubSection: (groupId: string, subSection: ProgramSubSection) => void;
  deleteProgramSubSection: (groupId: string, subSectionId: string) => void;
  addProgramMediaItem: (groupId: string, item?: ProgramMediaItem) => string;
  updateProgramMediaItem: (groupId: string, item: ProgramMediaItem) => void;
  deleteProgramMediaItem: (groupId: string, itemId: string) => void;
  setFeaturedProgramGroup: (groupId: string) => void;
  addGalleryCategory: (category?: GalleryCategory) => string;
  updateGalleryCategory: (category: GalleryCategory) => void;
  deleteGalleryCategory: (id: string) => void;
  addGalleryMediaItem: (categoryId: string, item?: GalleryMediaItem) => string;
  updateGalleryMediaItem: (categoryId: string, item: GalleryMediaItem) => void;
  deleteGalleryMediaItem: (categoryId: string, itemId: string) => void;
  addStoreCategory: (category?: StoreCategory) => string;
  updateStoreCategory: (category: StoreCategory) => void;
  deleteStoreCategory: (id: string) => void;
  addStoreProduct: (categoryId: string, product?: StoreProduct) => string;
  updateStoreProduct: (categoryId: string, product: StoreProduct) => void;
  deleteStoreProduct: (categoryId: string, productId: string) => void;
  updateStoreOrder: (order: StoreOrder) => void;
  updateStoreOrderStatus: (id: string, status: StoreOrderStatus, adminNote?: string) => void;
  deleteStoreOrder: (id: string) => void;
};

const HomeContentContext = createContext<HomeContentContextValue | null>(null);

const sectionToKey: Record<HomeSectionKey, keyof HomeContentState> = {
  hero: "heroSlides",
  about: "aboutItems",
  programs: "programItems",
  newsEvents: "newsItems",
  merchandise: "merchandiseItems",
  gallery: "galleryItems",
  // Store is managed separately from the older summary cards.
  actions: "actionCards"
};

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

export function HomeContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<HomeContentState>(defaultHomeContent);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isAdminArea, setIsAdminArea] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  useEffect(() => {
    setIsAdminArea(window.location.pathname.startsWith("/admin"));

    const loadContent = async () => {
      try {
        const response = await fetch("/api/content", { cache: "no-store" });
        if (!response.ok) return;
        const data = (await response.json()) as HomeContentState;
        setContent(normalizeHomeContent(data));
        setHasUnsavedChanges(false);
        setSaveStatus("idle");
      } catch {
        // Fall back to the built-in defaults if the backend is unavailable.
      } finally {
        setIsHydrated(true);
      }
    };

    void loadContent();
  }, []);

  useEffect(() => {
    if (!isHydrated || !isAdminArea) return;

    const interval = window.setInterval(() => {
      if (hasUnsavedChanges || saveStatus === "saving") return;

      void fetch("/api/content", { cache: "no-store" })
        .then((response) => (response.ok ? response.json() : null))
        .then((data: HomeContentState | null) => {
          if (!data) return;
          setContent(normalizeHomeContent(data));
        })
        .catch(() => {
          // Keep the current admin state if polling fails.
        });
    }, 8000);

    return () => window.clearInterval(interval);
  }, [hasUnsavedChanges, isAdminArea, isHydrated, saveStatus]);

  const updateContent = (updater: (current: HomeContentState) => HomeContentState) => {
    setContent((current) => normalizeHomeContent(updater(current)));
    if (isAdminArea && isHydrated) {
      setHasUnsavedChanges(true);
      setSaveStatus("idle");
    }
  };

  const saveContent = async () => {
    if (!isHydrated || !isAdminArea) return;

    setSaveStatus("saving");

    try {
      const response = await fetch("/api/content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(normalizeHomeContent(content))
      });

      if (!response.ok) {
        throw new Error("Failed to save content");
      }

      setHasUnsavedChanges(false);
      setSaveStatus("saved");
    } catch {
      setSaveStatus("error");
    }
  };

  const value = useMemo<HomeContentContextValue>(
    () => ({
      content,
      hasUnsavedChanges,
      saveStatus,
      saveContent,
      replaceSectionItems: (section, items) => {
        const key = sectionToKey[section];
        updateContent((current) => ({ ...current, [key]: clone(items) }));
      },
      addSectionItem: (section, item) => {
        const key = sectionToKey[section];
        const nextItem = item ?? { id: `${section}-${Date.now()}`, title: "", description: "", image: "" };
        updateContent((current) => ({
          ...current,
          [key]: [...((current[key] as ImageContentItem[]) ?? []), nextItem]
        }));
        return nextItem.id;
      },
      updateSectionItem: (section, item) => {
        const key = sectionToKey[section];
        updateContent((current) => ({
          ...current,
          [key]: (current[key] as ImageContentItem[]).map((existing) => (existing.id === item.id ? { ...item } : existing))
        }));
      },
      deleteSectionItem: (section, id) => {
        const key = sectionToKey[section];
        updateContent((current) => ({
          ...current,
          [key]: (current[key] as ImageContentItem[]).filter((item) => item.id !== id)
        }));
      },
      updateAboutHero: (item) => {
        updateContent((current) => ({
          ...current,
          aboutItems: [{ ...item }]
        }));
      },
      addAboutSection: (item) => {
        const nextItem =
          item ??
          {
            id: `about-${Date.now()}`,
            title: "New About Section",
            description: "Write the section content here.",
            image: ""
          };
        updateContent((current) => ({
          ...current,
          aboutSections: [...current.aboutSections, nextItem]
        }));
        return nextItem.id;
      },
      updateAboutSection: (item) => {
        updateContent((current) => ({
          ...current,
          aboutSections: current.aboutSections.map((existing) => (existing.id === item.id ? { ...item } : existing))
        }));
      },
      deleteAboutSection: (id) => {
        updateContent((current) => ({
          ...current,
          aboutSections: current.aboutSections.filter((item) => item.id !== id)
        }));
      },
      addAboutCoach: (coach) => {
        const nextCoach =
          coach ??
          ({
            id: `coach-${Date.now()}`,
            name: "New Coach",
            program: "Program or team responsibility",
            philosophy: "Write the coach philosophy here.",
            image: ""
          } satisfies AboutCoach);
        updateContent((current) => ({
          ...current,
          aboutCoaches: [...current.aboutCoaches, nextCoach]
        }));
        return nextCoach.id;
      },
      updateAboutCoach: (coach) => {
        updateContent((current) => ({
          ...current,
          aboutCoaches: current.aboutCoaches.map((existing) => (existing.id === coach.id ? { ...coach } : existing))
        }));
      },
      deleteAboutCoach: (id) => {
        updateContent((current) => ({
          ...current,
          aboutCoaches: current.aboutCoaches.filter((coach) => coach.id !== id)
        }));
      },
      updateProgramsHero: (item) => {
        updateContent((current) => ({
          ...current,
          programsHero: { ...item }
        }));
      },
      updateProgramsProgressionPath: (programsProgressionPath) => {
        updateContent((current) => ({
          ...current,
          programsProgressionPath: { ...programsProgressionPath }
        }));
      },
      addProgressionPathStage: (stage) => {
        const nextStage =
          stage ??
          ({
            id: `progression-stage-${Date.now()}`,
            title: "New Checkpoint",
            description: "Describe this stage of football growth."
          } satisfies ProgressionPathStage);
        updateContent((current) => ({
          ...current,
          programsProgressionPath: {
            ...current.programsProgressionPath,
            stages: [...current.programsProgressionPath.stages, nextStage]
          }
        }));
        return nextStage.id;
      },
      updateProgressionPathStage: (stage) => {
        updateContent((current) => ({
          ...current,
          programsProgressionPath: {
            ...current.programsProgressionPath,
            stages: current.programsProgressionPath.stages.map((existing) => (existing.id === stage.id ? { ...stage } : existing))
          }
        }));
      },
      deleteProgressionPathStage: (id) => {
        updateContent((current) => ({
          ...current,
          programsProgressionPath: {
            ...current.programsProgressionPath,
            stages: current.programsProgressionPath.stages.filter((stage) => stage.id !== id)
          }
        }));
      },
      updateNewsEventsHero: (item) => {
        updateContent((current) => ({
          ...current,
          newsEventsHero: { ...item }
        }));
      },
      updateGalleryHero: (item) => {
        updateContent((current) => ({
          ...current,
          galleryHero: { ...item }
        }));
      },
      updateStoreHero: (item) => {
        updateContent((current) => ({
          ...current,
          storeHero: { ...item }
        }));
      },
      updateJoinPage: (joinPage) => {
        updateContent((current) => ({
          ...current,
          joinPage: { ...joinPage }
        }));
      },
      updateJoinRegistration: (registration) => {
        updateContent((current) => ({
          ...current,
          joinRegistrations: current.joinRegistrations.map((existing) =>
            existing.id === registration.id ? { ...registration } : existing
          )
        }));
      },
      deleteJoinRegistration: (id) => {
        updateContent((current) => ({
          ...current,
          joinRegistrations: current.joinRegistrations.map((registration) =>
            registration.id === id
              ? {
                  ...registration,
                  status: "deleted",
                  reviewedAt: new Date().toISOString()
                }
              : registration
          )
        }));
      },
      updateJoinRegistrationStatus: (id, status, adminNote) => {
        updateContent((current) => ({
          ...current,
          joinRegistrations: current.joinRegistrations.map((registration) =>
            registration.id === id
              ? {
                  ...registration,
                  status,
                  reviewedAt: new Date().toISOString(),
                  adminNote: adminNote ?? registration.adminNote ?? ""
                }
              : registration
          )
        }));
      },
      updateContactPage: (contactPage) => {
        updateContent((current) => ({
          ...current,
          contactPage: { ...contactPage }
        }));
      },
      updateContactSubmission: (submission) => {
        updateContent((current) => ({
          ...current,
          contactSubmissions: current.contactSubmissions.map((existing) =>
            existing.id === submission.id ? { ...submission } : existing
          )
        }));
      },
      updateContactSubmissionStatus: (id, status, adminNote) => {
        updateContent((current) => ({
          ...current,
          contactSubmissions: current.contactSubmissions.map((submission) =>
            submission.id === id
              ? {
                  ...submission,
                  status,
                  adminNote: adminNote ?? submission.adminNote ?? ""
                }
              : submission
          )
        }));
      },
      deleteContactSubmission: (id) => {
        updateContent((current) => ({
          ...current,
          contactSubmissions: current.contactSubmissions.map((submission) =>
            submission.id === id ? { ...submission, status: "archived" } : submission
          )
        }));
      },
      updateFeedbackSubmission: (submission) => {
        updateContent((current) => ({
          ...current,
          feedbackSubmissions: current.feedbackSubmissions.map((existing) =>
            existing.id === submission.id ? { ...submission } : existing
          )
        }));
      },
      updateFeedbackSubmissionStatus: (id, status, adminNote) => {
        updateContent((current) => ({
          ...current,
          feedbackSubmissions: current.feedbackSubmissions.map((submission) =>
            submission.id === id
              ? {
                  ...submission,
                  status,
                  reviewedAt: new Date().toISOString(),
                  adminNote: adminNote ?? submission.adminNote ?? ""
                }
              : submission
          )
        }));
      },
      updateDonatePage: (donatePage) => {
        updateContent((current) => ({
          ...current,
          donatePage: { ...donatePage }
        }));
      },
      updateNotificationSettings: (notificationSettings) => {
        updateContent((current) => ({
          ...current,
          notificationSettings: { ...notificationSettings }
        }));
      },
      updateEngageConnectionRequest: (request) => {
        updateContent((current) => ({
          ...current,
          engageConnectionRequests: current.engageConnectionRequests.map((existing) =>
            existing.id === request.id ? { ...request } : existing
          )
        }));
      },
      updateEngageConnectionRequestStatus: (id, status, adminNote) => {
        updateContent((current) => ({
          ...current,
          engageConnectionRequests: current.engageConnectionRequests.map((request) =>
            request.id === id
              ? {
                  ...request,
                  status,
                  adminNote: adminNote ?? request.adminNote ?? ""
                }
              : request
          )
        }));
      },
      deleteEngageConnectionRequest: (id) => {
        updateContent((current) => ({
          ...current,
          engageConnectionRequests: current.engageConnectionRequests.filter((request) => request.id !== id)
        }));
      },
      updateEngageSubmission: (submission) => {
        updateContent((current) => ({
          ...current,
          engageSubmissions: current.engageSubmissions.map((existing) =>
            existing.id === submission.id ? { ...submission } : existing
          )
        }));
      },
      updateEngageSubmissionStatus: (id, status, adminNote) => {
        updateContent((current) => ({
          ...current,
          engageSubmissions: current.engageSubmissions.map((submission) =>
            submission.id === id
              ? {
                  ...submission,
                  status,
                  adminNote: adminNote ?? submission.adminNote ?? ""
                }
              : submission
          )
        }));
      },
      deleteEngageSubmission: (id) => {
        updateContent((current) => ({
          ...current,
          engageSubmissions: current.engageSubmissions.filter((submission) => submission.id !== id)
        }));
      },
      updateSupportSubmission: (submission) => {
        updateContent((current) => ({
          ...current,
          supportSubmissions: current.supportSubmissions.map((existing) =>
            existing.id === submission.id ? { ...submission } : existing
          )
        }));
      },
      updateSupportSubmissionStatus: (id, status, adminNote) => {
        updateContent((current) => ({
          ...current,
          supportSubmissions: current.supportSubmissions.map((submission) =>
            submission.id === id
              ? {
                  ...submission,
                  status,
                  adminNote: adminNote ?? submission.adminNote ?? ""
                }
              : submission
          )
        }));
      },
      deleteSupportSubmission: (id) => {
        updateContent((current) => ({
          ...current,
          supportSubmissions: current.supportSubmissions.filter((submission) => submission.id !== id)
        }));
      },
      updateFooterContent: (footerContent) => {
        updateContent((current) => ({
          ...current,
          footerContent: { ...footerContent }
        }));
      },
      updateActionCard: (item) => {
        updateContent((current) => ({
          ...current,
          actionCards: current.actionCards.map((existing) => (existing.id === item.id ? { ...item } : existing))
        }));
      },
      updateActionCardImage: (id, image) => {
        updateContent((current) => ({
          ...current,
          actionCards: current.actionCards.map((existing) => (existing.id === id ? { ...existing, image } : existing))
        }));
      },
      addFooterLink: (item) => {
        const nextItem = item ?? { id: `footer-link-${Date.now()}`, label: "New Link", href: "#" };
        updateContent((current) => ({
          ...current,
          footerContent: {
            ...current.footerContent,
            links: [...current.footerContent.links, nextItem]
          }
        }));
        return nextItem.id;
      },
      updateFooterLink: (item) => {
        updateContent((current) => ({
          ...current,
          footerContent: {
            ...current.footerContent,
            links: current.footerContent.links.map((existing) => (existing.id === item.id ? { ...item } : existing))
          }
        }));
      },
      deleteFooterLink: (id) => {
        updateContent((current) => ({
          ...current,
          footerContent: {
            ...current.footerContent,
            links: current.footerContent.links.filter((item) => item.id !== id)
          }
        }));
      },
      addFooterSocial: (item) => {
        const nextItem = item ?? { id: `footer-social-${Date.now()}`, label: "New Social", href: "#", icon: "facebook" };
        updateContent((current) => ({
          ...current,
          footerContent: {
            ...current.footerContent,
            socials: [...current.footerContent.socials, nextItem]
          }
        }));
        return nextItem.id;
      },
      updateFooterSocial: (item) => {
        updateContent((current) => ({
          ...current,
          footerContent: {
            ...current.footerContent,
            socials: current.footerContent.socials.map((existing) => (existing.id === item.id ? { ...item } : existing))
          }
        }));
      },
      deleteFooterSocial: (id) => {
        updateContent((current) => ({
          ...current,
          footerContent: {
            ...current.footerContent,
            socials: current.footerContent.socials.filter((item) => item.id !== id)
          }
        }));
      },
      addFooterBrand: (item) => {
        const nextItem =
          item ??
          ({
            id: `footer-brand-${Date.now()}`,
            label: "New Brand",
            href: "#",
            kind: "sponsor",
            badgeImage: "",
            description: "Describe this sponsor or partner.",
            location: "",
            contactEmail: "",
            contactPhone: "",
            services: [],
            galleryImages: [],
            socials: []
          } satisfies FooterBrandItem);
        updateContent((current) => ({
          ...current,
          footerContent: {
            ...current.footerContent,
            footerBrands: [...current.footerContent.footerBrands, nextItem]
          }
        }));
        return nextItem.id;
      },
      updateFooterBrand: (item) => {
        updateContent((current) => ({
          ...current,
          footerContent: {
            ...current.footerContent,
            footerBrands: current.footerContent.footerBrands.map((existing) => (existing.id === item.id ? { ...item } : existing))
          }
        }));
      },
      updateFooterBrandBadgeImage: (id, badgeImage) => {
        updateContent((current) => ({
          ...current,
          footerContent: {
            ...current.footerContent,
            footerBrands: current.footerContent.footerBrands.map((existing) =>
              existing.id === id ? { ...existing, badgeImage } : existing
            )
          }
        }));
      },
      deleteFooterBrand: (id) => {
        updateContent((current) => ({
          ...current,
          footerContent: {
            ...current.footerContent,
            footerBrands: current.footerContent.footerBrands.filter((item) => item.id !== id)
          }
        }));
      },
      addProgramGroup: (group) => {
        const nextGroup =
          group ??
          ({
            id: `program-${Date.now()}`,
            slug: `program-${Date.now()}`,
            ageGroup: "New Age Group",
            title: "New Age Group",
            description: "Describe this age group here.",
            image: "",
            featured: false,
            subSections: [],
            mediaItems: []
          } satisfies ProgramGroup);
        updateContent((current) => ({
          ...current,
          programGroups: [...current.programGroups, nextGroup]
        }));
        return nextGroup.id;
      },
      updateProgramGroup: (group) => {
        const normalizedGroup = {
          ...group,
          featured: Boolean(group.featured)
        };
        updateContent((current) => ({
          ...current,
          programGroups: current.programGroups.map((existing) => (existing.id === normalizedGroup.id ? { ...normalizedGroup } : existing))
        }));
      },
      deleteProgramGroup: (id) => {
        updateContent((current) => ({
          ...current,
          programGroups: current.programGroups.filter((group) => group.id !== id)
        }));
      },
      addProgramSubSection: (groupId, subSection) => {
        const nextSub =
          subSection ??
          ({
            id: `sub-${Date.now()}`,
            title: "New Sub Section",
            description: "Write the details here."
          } satisfies ProgramSubSection);
        updateContent((current) => ({
          ...current,
          programGroups: current.programGroups.map((group) =>
            group.id === groupId ? { ...group, subSections: [...group.subSections, nextSub] } : group
          )
        }));
        return nextSub.id;
      },
      updateProgramSubSection: (groupId, subSection) => {
        updateContent((current) => ({
          ...current,
          programGroups: current.programGroups.map((group) =>
            group.id === groupId
              ? {
                  ...group,
                  subSections: group.subSections.map((item) => (item.id === subSection.id ? { ...subSection } : item))
                }
              : group
          )
        }));
      },
      deleteProgramSubSection: (groupId, subSectionId) => {
        updateContent((current) => ({
          ...current,
          programGroups: current.programGroups.map((group) =>
            group.id === groupId
              ? { ...group, subSections: group.subSections.filter((item) => item.id !== subSectionId) }
              : group
          )
        }));
      },
      addProgramMediaItem: (groupId, item) => {
        const nextItem =
          item ??
          ({
            id: `program-media-${Date.now()}`,
            title: "New Program Media",
            description: "Describe this program media item.",
            mediaType: "image",
            src: "",
            thumbnail: ""
          } satisfies ProgramMediaItem);
        updateContent((current) => ({
          ...current,
          programGroups: current.programGroups.map((group) =>
            group.id === groupId ? { ...group, mediaItems: [...group.mediaItems, nextItem] } : group
          )
        }));
        return nextItem.id;
      },
      updateProgramMediaItem: (groupId, item) => {
        updateContent((current) => ({
          ...current,
          programGroups: current.programGroups.map((group) =>
            group.id === groupId
              ? { ...group, mediaItems: group.mediaItems.map((existing) => (existing.id === item.id ? { ...item } : existing)) }
              : group
          )
        }));
      },
      deleteProgramMediaItem: (groupId, itemId) => {
        updateContent((current) => ({
          ...current,
          programGroups: current.programGroups.map((group) =>
            group.id === groupId ? { ...group, mediaItems: group.mediaItems.filter((item) => item.id !== itemId) } : group
          )
        }));
      },
      setFeaturedProgramGroup: (groupId) => {
        updateContent((current) => ({
          ...current,
          programGroups: current.programGroups.map((group) => ({
            ...group,
            featured: group.id === groupId
          }))
        }));
      },
      addGalleryCategory: (category) => {
        const nextCategory =
          category ??
          ({
            id: `gallery-${Date.now()}`,
            slug: `gallery-${Date.now()}`,
            title: "New Category",
            description: "Describe this category here.",
            image: "",
            featured: false,
            items: []
          } satisfies GalleryCategory);
        updateContent((current) => ({
          ...current,
          galleryCategories: [...current.galleryCategories, nextCategory]
        }));
        return nextCategory.id;
      },
      updateGalleryCategory: (category) => {
        updateContent((current) => ({
          ...current,
          galleryCategories: current.galleryCategories.map((existing) => (existing.id === category.id ? { ...category } : existing))
        }));
      },
      deleteGalleryCategory: (id) => {
        updateContent((current) => ({
          ...current,
          galleryCategories: current.galleryCategories.filter((category) => category.id !== id)
        }));
      },
      addGalleryMediaItem: (categoryId, item) => {
        const nextItem =
          item ??
          ({
            id: `media-${Date.now()}`,
            title: "New Media",
            description: "Write the media description here.",
            mediaType: "image",
            src: "",
            thumbnail: ""
          } satisfies GalleryMediaItem);
        updateContent((current) => ({
          ...current,
          galleryCategories: current.galleryCategories.map((category) =>
            category.id === categoryId ? { ...category, items: [...category.items, nextItem] } : category
          )
        }));
        return nextItem.id;
      },
      updateGalleryMediaItem: (categoryId, item) => {
        updateContent((current) => ({
          ...current,
          galleryCategories: current.galleryCategories.map((category) =>
            category.id === categoryId
              ? { ...category, items: category.items.map((existing) => (existing.id === item.id ? { ...item } : existing)) }
              : category
          )
        }));
      },
      deleteGalleryMediaItem: (categoryId, itemId) => {
        updateContent((current) => ({
          ...current,
          galleryCategories: current.galleryCategories.map((category) =>
            category.id === categoryId ? { ...category, items: category.items.filter((item) => item.id !== itemId) } : category
          )
        }));
      },
      addStoreCategory: (category) => {
        const nextCategory =
          category ??
          ({
            id: `store-${Date.now()}`,
            slug: `store-${Date.now()}`,
            title: "New Category",
            description: "Describe this merchandise category here.",
            image: "",
            featured: false,
            products: []
          } satisfies StoreCategory);
        updateContent((current) => ({
          ...current,
          storeCategories: [...current.storeCategories, nextCategory]
        }));
        return nextCategory.id;
      },
      updateStoreCategory: (category) => {
        updateContent((current) => ({
          ...current,
          storeCategories: current.storeCategories.map((existing) => (existing.id === category.id ? { ...category } : existing))
        }));
      },
      deleteStoreCategory: (id) => {
        updateContent((current) => ({
          ...current,
          storeCategories: current.storeCategories.filter((category) => category.id !== id)
        }));
      },
      addStoreProduct: (categoryId, product) => {
        const nextProduct =
          product ??
          ({
            id: `product-${Date.now()}`,
            title: "New Product",
            description: "Write the product description here.",
            image: "",
            price: "$0",
            customizationPrice: "$0",
            nameOnlyPrice: "$0",
            numberOnlyPrice: "$0",
            nameAndNumberPrice: "$0",
            featured: false,
            colorOptions: ["Black"],
            sizeOptions: ["S", "M", "L"],
            supportsNumber: false,
            supportsName: false,
            supportsCustomMade: false
          } satisfies StoreProduct);
        updateContent((current) => ({
          ...current,
          storeCategories: current.storeCategories.map((category) =>
            category.id === categoryId ? { ...category, products: [...category.products, nextProduct] } : category
          )
        }));
        return nextProduct.id;
      },
      updateStoreProduct: (categoryId, product) => {
        updateContent((current) => ({
          ...current,
          storeCategories: current.storeCategories.map((category) =>
            category.id === categoryId
              ? {
                  ...category,
                  products: category.products.map((existing) => (existing.id === product.id ? { ...product } : existing))
                }
              : category
          )
        }));
      },
      deleteStoreProduct: (categoryId, productId) => {
        updateContent((current) => ({
          ...current,
          storeCategories: current.storeCategories.map((category) =>
            category.id === categoryId ? { ...category, products: category.products.filter((item) => item.id !== productId) } : category
          )
        }));
      },
      updateStoreOrder: (order) => {
        updateContent((current) => ({
          ...current,
          storeOrders: current.storeOrders.map((existing) => (existing.id === order.id ? { ...order } : existing))
        }));
      },
      updateStoreOrderStatus: (id, status, adminNote) => {
        updateContent((current) => ({
          ...current,
          storeOrders: current.storeOrders.map((order) =>
            order.id === id ? { ...order, status, adminNote: adminNote ?? order.adminNote ?? "" } : order
          )
        }));
      },
      deleteStoreOrder: (id) => {
        updateContent((current) => ({
          ...current,
          storeOrders: current.storeOrders.map((order) => (order.id === id ? { ...order, status: "cancelled" } : order))
        }));
      }
    }),
    [content, hasUnsavedChanges, isAdminArea, isHydrated, saveStatus]
  );

  return <HomeContentContext.Provider value={value}>{children}</HomeContentContext.Provider>;
}

export function useHomeContent() {
  const context = useContext(HomeContentContext);
  if (!context) {
    throw new Error("useHomeContent must be used within HomeContentProvider");
  }
  return context;
}

