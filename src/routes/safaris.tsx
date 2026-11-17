import { createFileRoute } from "@tanstack/react-router";
import { TourListing, ToursMessage } from "../components/tour-listing";
import { toursQuery } from "../lib/queries";

export const Route = createFileRoute("/safaris")({
  loader: ({ context }) => context.queryClient.ensureQueryData(toursQuery),
  head: () => ({
    meta: [
      { title: "Safaris — Kenya, Cross-Border & Adventure Safaris" },
      { name: "description", content: "Kenya safari packages, Kenya–Tanzania–Zanzibar journeys and adventures from gorilla trekking to Kilimanjaro and Mount Kenya." },
      { property: "og:title", content: "Safaris — Kenya, Cross-Border & Adventure Safaris" },
      { property: "og:description", content: "Kenya safari packages, Kenya–Tanzania–Zanzibar journeys and adventures from gorilla trekking to Kilimanjaro and Mount Kenya." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  errorComponent: () => <ToursMessage title="Tours unavailable" />,
  component: () => (
    <TourListing
      kind="safari"
      heading="Safaris"
      intro="Discover the untamed beauty of Africa through our meticulously crafted itineraries. From the vast plains of the Masai Mara to Zanzibar's shores and the summit of Kilimanjaro, every journey is an invitation to explore."
    />
  ),
});
