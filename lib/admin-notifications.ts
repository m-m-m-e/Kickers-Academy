import type { HomeContentState } from "@/lib/home-content";

export type AdminNotificationItem = {
  id: string;
  source: "Join" | "Contact" | "Feedback" | "Engage" | "Support" | "Connection" | "Store";
  title: string;
  description: string;
  submittedAt: string;
  status: string;
  href: string;
};

export function getAdminNotifications(content: HomeContentState): AdminNotificationItem[] {
  const notifications: AdminNotificationItem[] = [
    ...content.joinRegistrations
      .filter((item) => item.status === "pending")
      .map((item) => ({
        id: item.id,
        source: "Join" as const,
        title: item.playerName,
        description: `Registration from ${item.guardianName}`,
        submittedAt: item.submittedAt,
        status: item.status,
        href: "/admin/join"
      })),
    ...content.contactSubmissions
      .filter((item) => item.status === "new")
      .map((item) => ({
        id: item.id,
        source: "Contact" as const,
        title: item.subject,
        description: `Message from ${item.name}`,
        submittedAt: item.submittedAt,
        status: item.status,
        href: "/admin/contact"
      })),
    ...content.feedbackSubmissions
      .filter((item) => item.status === "pending")
      .map((item) => ({
        id: item.id,
        source: "Feedback" as const,
        title: `${item.rating} star feedback`,
        description: `Review from ${item.name.trim() || "Anonymous"}`,
        submittedAt: item.submittedAt,
        status: item.status,
        href: "/admin/contact"
      })),
    ...content.engageSubmissions
      .filter((item) => item.status === "new")
      .map((item) => ({
        id: item.id,
        source: "Engage" as const,
        title: item.engagementType,
        description: `Engagement message from ${item.name}`,
        submittedAt: item.submittedAt,
        status: item.status,
        href: "/admin/engage"
      })),
    ...content.supportSubmissions
      .filter((item) => item.status === "new")
      .map((item) => ({
        id: item.id,
        source: "Support" as const,
        title: item.supportType,
        description: `Support request from ${item.name}`,
        submittedAt: item.submittedAt,
        status: item.status,
        href: "/admin/engage"
      })),
    ...content.engageConnectionRequests
      .filter((item) => item.status === "new")
      .map((item) => ({
        id: item.id,
        source: "Connection" as const,
        title: item.targetOccupation || item.targetEngagementType,
        description: `Connection request from ${item.requesterName}`,
        submittedAt: item.submittedAt,
        status: item.status,
        href: "/admin/engage"
      })),
    ...content.storeOrders
      .filter((item) => item.status === "new")
      .map((item) => ({
        id: item.id,
        source: "Store" as const,
        title: `Store request from ${item.buyerName}`,
        description: `${item.items.length} item${item.items.length === 1 ? "" : "s"} requested`,
        submittedAt: item.submittedAt,
        status: item.status,
        href: "/admin/store"
      }))
  ];

  return notifications.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
}
