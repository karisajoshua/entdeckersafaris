import { createFileRoute } from "@tanstack/react-router";
import { TourListing, ToursMessage } from "../components/tour-listing";
import { toursQuery } from "../lib/queries";

export const Route = createFileRoute("/day-tours")({
  loader: ({ context }) => context.queryClient.ensureQueryData(toursQuery),
  head: () => ({
    meta: [
      { title: "Day Tours & Excursions — Nairobi, Mombasa & Beyond" },
      { name: "description", content: "Day tours and excursions: Nairobi city tour, the ancient city of Mombasa, Lake Naivasha, Sagana River and Loita experiences." },
      { property: "og:title", content: "Day Tours & Excursions — Nairobi, Mombasa & Beyond" },
      { property: "og:description", content: "Day tours and excursions: Nairobi city tour, the ancient city of Mombasa, Lake Naivasha, Sagana River and Loita experiences." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  errorComponent: () => <ToursMessage title="Tours unavailable" />,
  component: () => (
    <TourListing
      kind="day"
      heading="Day Tours & Excursions"
      intro="Short, unforgettable experiences — from Nairobi's wildlife sanctuaries and Mombasa's ancient streets to lakes, rivers and Maasai culture."
    />
  ),
});
