import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import {
  adminListEnquiries,
  adminListGallery,
  adminListPosts,
  adminListTours,
} from "../../lib/admin.functions";
import { Card, PageHeading } from "../../components/admin/ui";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminOverview,
});

function AdminOverview() {
  const gallery = useServerFn(adminListGallery);
  const posts = useServerFn(adminListPosts);
  const tours = useServerFn(adminListTours);
  const enquiries = useServerFn(adminListEnquiries);

  const galleryQ = useQuery({ queryKey: ["admin", "gallery"], queryFn: () => gallery() });
  const postsQ = useQuery({ queryKey: ["admin", "posts"], queryFn: () => posts() });
  const toursQ = useQuery({ queryKey: ["admin", "tours"], queryFn: () => tours() });
  const enquiriesQ = useQuery({ queryKey: ["admin", "enquiries"], queryFn: () => enquiries() });

  const photoCount = (galleryQ.data ?? []).reduce((total, l) => total + l.photos.length, 0);
  const unhandled = (enquiriesQ.data ?? []).filter((e) => !e.handled).length;

  const cards = [
    {
      to: "/admin/gallery" as const,
      label: "Gallery",
      value: `${photoCount} photos`,
      note: `${(galleryQ.data ?? []).length} locations`,
    },
    {
      to: "/admin/blog" as const,
      label: "Journal",
      value: `${(postsQ.data ?? []).length} articles`,
      note: `${(postsQ.data ?? []).filter((p) => p.published).length} published`,
    },
    {
      to: "/admin/tours" as const,
      label: "Tours",
      value: `${(toursQ.data ?? []).length} packages`,
      note: `${(toursQ.data ?? []).filter((t) => t.published).length} published`,
    },
    {
      to: "/admin/enquiries" as const,
      label: "Enquiries",
      value: `${(enquiriesQ.data ?? []).length} total`,
      note: `${unhandled} awaiting reply`,
    },
  ];

  return (
    <div>
      <PageHeading
        title="Welcome back"
        description="Manage the gallery, journal, tour packages and enquiries from here."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.to} to={card.to} className="group">
            <Card>
              <span className="label text-savannah-gold">{card.label}</span>
              <p className="mt-3 text-headline-md text-deep-forest group-hover:text-savannah-gold">
                {card.value}
              </p>
              <p className="mt-1 text-body-md text-on-surface-variant">{card.note}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
