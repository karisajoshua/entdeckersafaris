import nairobiImg from "../assets/tour-nairobi.jpg";
import mombasaImg from "../assets/tour-mombasa.jpg";
import amboseliImg from "../assets/tour-amboseli.jpg";
import riftValleyImg from "../assets/tour-rift-valley.jpg";
import honeymoonImg from "../assets/tour-honeymoon.jpg";
import lionImg from "../assets/tour-lion.jpg";

export type ItineraryStep = {
  marker: string;
  heading: string;
  body: string;
};

export type Tour = {
  slug: string;
  title: string;
  tagline: string;
  duration: string;
  image: string;
  alt: string;
  intro: string[];
  itinerary: ItineraryStep[];
};

export const tours: Tour[] = [
  {
    slug: "nairobi-city-tour",
    title: "Nairobi City Tour",
    tagline: "Skyscrapers meet the savannah.",
    duration: "1 Day",
    image: nairobiImg,
    alt: "Aerial view of Nairobi city at dusk with the national park in the foreground",
    intro: [
      "The skyscrapers of the nation's capital stand over what was 100 years ago just a remote, uninhabited waterhole in the highlands. Its Maasai name meaning \u201cthe place of cool waters\u201d and that was good enough for the British to choose it as base camp for their 1000km (620 miles) railway from Mombasa to Lake Victoria.",
      "Today at an altitude of 1,657m (5437ft) the town's generally pleasant and temperate climate makes it an ideal starting point for exploring the game parks of the country's interior or as a place to relax after a safari. Lions roar a mere 8km (5 miles) from the city centre.",
      "Nairobi National Game Park is a unique ecosystem, being the only protected area in the world this close to a capital city. Located just 7km from Nairobi's city centre, it is the perfect place for a half-day or full-day excursion. One of the only places on earth where you can be on safari with skyscrapers as part of your backdrop, it is an ideal layover escape or add-on to your existing safari.",
    ],
    itinerary: [
      {
        marker: "0700 HRS",
        heading: "Pick up from Hotel / Airport",
        body: "Pick up early in the morning from your hotel and drive to Nairobi National Park. Depending on your hotel location or congestion of cars to the park, this journey can take approximately 30 – 45 minutes.",
      },
      {
        marker: "0745 – 1200 HRS",
        heading: "Arrival for game drive",
        body: "Once we arrive at the park, we check in and start the morning game drive. Nairobi National Park is the only park in a city in the world. A glorious stretch of savannah set against the backdrop of Nairobi's glittering skyline; its relatively small size makes it all the easier to see all it has to offer in one day. Lunch at Carnivore restaurant, afternoon game drive and later transfer to your hotel or the airport.",
      },
      {
        marker: "1245 – 1345 HRS",
        heading: "Safari Walk",
        body: "After the game drive we spend some time at the Safari Walk, a showcase for Kenya's parks and reserves. Visitors see a sample of the country's rich animal life including the rare bongo, white rhino and albino zebra as well as big cats, antelopes and primates. It is also home to some 150 species of local trees.",
      },
      {
        marker: "1400 HRS",
        heading: "City sightseeing tour",
        body: "Immediately after the short walk we head into Nairobi where we finish the rest of the day. The tour guide will drop you at a location of your choice within the city and start the tour, which can take up to 3 hours visiting different places and attraction sites. Later we head back to your hotel.",
      },
    ],
  },
  {
    slug: "mombasa-city-tour",
    title: "Mombasa City Tour",
    tagline: "History and Swahili culture.",
    duration: "1 Day",
    image: mombasaImg,
    alt: "Winding streets of Mombasa Old Town with carved wooden doors and Swahili architecture",
    intro: [
      "Mombasa Island is the central business hub of the coastal region of Kenya, nowadays known as Mombasa County. The city is famous for its attractiveness, world-class hotels, rich history and Swahili culture. It connects travellers to Diani in the south and Malindi, Watamu and Lamu to the north.",
      "The full Mombasa Island tour is a historical and cultural journey within the island. It includes a visit to the famous Fort Jesus and other old structures along Old Town, as well as the Akamba handcraft industry, a Hindu temple and the famous Tusks.",
    ],
    itinerary: [
      {
        marker: "0800 HRS",
        heading: "Pickup from hotel for Mombasa",
        body: "You will be picked up at 8:00 am for Mombasa Island, passing through the Mombasa–Malindi highway with about two hours of crossover. This early tour includes a visit to the Akamba handcraft industry, where you see the craft behind our tourism.",
      },
      {
        marker: "1100 HRS",
        heading: "Visit to the Hindu Temple",
        body: "This section of the tour gives you the chance to visit the Hindu temple and learn the Hindu culture, their beliefs and their community in detail. You get the opportunity to associate and interact with this community and experience how it feels.",
      },
      {
        marker: "1230 – 1400 HRS",
        heading: "Cultural lunch within the island",
        body: "Here we have an excellent buffet lunch in Mombasa town — a cultural lunch full of local foods and seafood. This is when you experience the real Swahili culture; the taste and the feel cannot be experienced without the food.",
      },
      {
        marker: "1400 – 1500 HRS",
        heading: "Walk through Old Town",
        body: "This part takes you through the narrow alleys of the Old Town to see the carved doors and overhanging balconies. You also visit the old dhow harbour, where Arab dhows can be seen as they come in, and the spice market.",
      },
      {
        marker: "1500 HRS",
        heading: "Visit to historical Fort Jesus",
        body: "We end the tour by visiting the famous Fort Jesus, built by the Portuguese in 1593. You get to see how they built the structure and the position of the arsenals to fight enemies coming to the island. Come and learn more. \u201cKaribu Kenya\u201d.",
      },
    ],
  },
  {
    slug: "8-days-kenya-experience",
    title: "8 Days Kenya Experience Safari",
    tagline: "From Amboseli to Masai Mara.",
    duration: "8 Days",
    image: amboseliImg,
    alt: "Elephants in Amboseli grasslands with Mount Kilimanjaro rising behind them",
    intro: [
      "Our itineraries are flexible, so each of our suggested tours and travels can always be adapted and customized according to your budget and preferences. We can plan a tour or a trip with our knowledge and experience, but we will always do everything to fulfill all your requests.",
    ],
    itinerary: [
      {
        marker: "Day 1",
        heading: "Nairobi to Amboseli",
        body: "Pick up from the railway station and proceed to Amboseli National Park, arriving at Kibo Safari Camp for lunch. Afternoon game drive till sunset.",
      },
      {
        marker: "Day 2",
        heading: "Ol Pejeta Conservancy",
        body: "Check out from the camp after breakfast and proceed north to Ol Pejeta Conservancy in Nanyuki. Arrive at Sweetwaters Tented Camp for lunch. Afternoon game drive after visiting the chimpanzee orphanage.",
      },
      {
        marker: "Day 3",
        heading: "On to Samburu",
        body: "After breakfast proceed further north to Samburu and arrive at Samburu Simba Lodge for lunch. Afternoon game drive.",
      },
      {
        marker: "Day 4",
        heading: "Samburu exploration",
        body: "Depart from the lodge for a half-day game drive to explore the park and drive back for lunch. Afternoon game drive until sunset.",
      },
      {
        marker: "Day 5",
        heading: "Lake Nakuru",
        body: "Check out from the lodge after breakfast and proceed to Nakuru, arriving at Flamingo Camp for lunch. Afternoon exploration of Lake Nakuru park to experience birdlife and wildlife.",
      },
      {
        marker: "Day 6",
        heading: "Masai Mara",
        body: "Depart from the camp after breakfast and drive to Masai Mara, arriving at Oleshaiki Camp for lunch. Afternoon game drive till late evening, then back to camp for dinner and overnight.",
      },
      {
        marker: "Day 7",
        heading: "Full day in the Mara",
        body: "Depart the camp after breakfast with picnic lunches for a full-day exploration of Masai Mara to experience the wildlife on the savanna. Return to camp for evening leisure, dinner and overnight.",
      },
      {
        marker: "Day 8",
        heading: "Return to Nairobi",
        body: "Check out from the camp after breakfast and drive to Nairobi for your flight home, with a great experience of the Kenyan wilderness.",
      },
    ],
  },
  {
    slug: "7-days-out-of-africa",
    title: "7 Days Out of Africa Safari",
    tagline: "The Rift Valley and iconic landscapes.",
    duration: "7 Days",
    image: riftValleyImg,
    alt: "Dramatic landscape of the Great Rift Valley escarpment with acacia trees",
    intro: [
      "Our itineraries are flexible, so each of our suggested tours and travels can always be adapted and customized according to your budget and preferences. We can plan a tour or a trip with our knowledge and experience, but we will always do everything to fulfill all your requests.",
    ],
    itinerary: [
      {
        marker: "Day 1",
        heading: "Great Rift Valley to Maasai Mara",
        body: "Pick up from Nairobi and proceed to the Great Rift Valley, stopping at the viewpoint for a brief introduction to the area. Proceed to Maasai Mara and arrive at Simba Oryx Camp for lunch, afternoon game drive till late evening, then back to the lodge for evening leisure and overnight.",
      },
      {
        marker: "Day 2",
        heading: "Full day Maasai Mara",
        body: "Depart the camp after breakfast with picnic lunches for a full-day Maasai Mara exploration to experience the wildlife on the savanna. Later return to the camp for evening leisure, dinner and overnight.",
      },
      {
        marker: "Day 3",
        heading: "Lake Naivasha",
        body: "Check out from the camp after breakfast and drive to Lake Naivasha Crescent Camp for lunch. In the afternoon, an optional nature walk and boat safari for a sundowner along Crescent Island with information about Out of Africa when it was filmed.",
      },
      {
        marker: "Day 4",
        heading: "Nairobi and Karen Blixen",
        body: "After breakfast drive to Nairobi and arrive at the David Sheldrick elephant orphanage. Proceed to the Giraffe Centre and later drive for lunch. After lunch visit the Karen Blixen Museum for more of the Out of Africa story. Drop off at Wildebeest Camp for evening leisure and overnight.",
      },
      {
        marker: "Day 5",
        heading: "Amboseli National Park",
        body: "Check out from the camp, then drive to Amboseli National Park and arrive at Kibo Safari Camp. Afternoon game drive till late evening.",
      },
      {
        marker: "Day 6",
        heading: "Full day Amboseli",
        body: "After breakfast depart with lunch boxes for a full-day Amboseli exploration, experiencing the wildlife on the swamps with huge elephant herds, then an afternoon game drive till late evening.",
      },
      {
        marker: "Day 7",
        heading: "Back to Nairobi",
        body: "Check out from the camp after breakfast and drive back to Nairobi for your flight home with memories and the experience of the Out of Africa story.",
      },
    ],
  },
  {
    slug: "6-days-honeymoon",
    title: "6 Days Honeymoon Safari",
    tagline: "Romantic escapes.",
    duration: "6 Days",
    image: honeymoonImg,
    alt: "Luxury open-air safari tent with a candlelit dining table for two at sunset",
    intro: [
      "Our itineraries are flexible, so each of our suggested tours and travels can always be adapted and customized according to your budget and preferences. We can plan a tour or a trip with our knowledge and experience, but we will always do everything to fulfill all your requests.",
    ],
    itinerary: [
      {
        marker: "Day 1",
        heading: "Nairobi city excursion",
        body: "Picked up from the hotel for a Nairobi city excursion visiting the elephant orphanage, Giraffe Centre and Karen Blixen Museum, and later dinner at Carnivore restaurant.",
      },
      {
        marker: "Day 2",
        heading: "Lake Nakuru National Park",
        body: "Pick up from the hotel and drive to the Great Rift Valley with a stopover at the viewpoint for a brief introduction to the area. Drive to Lake Nakuru National Park and arrive at Flamingo Camp for lunch. Afternoon game drive, then back to camp for dinner and overnight.",
      },
      {
        marker: "Day 3",
        heading: "Maasai Mara",
        body: "Check out from the camp and proceed to Maasai Mara, arriving at Zebra Plains Camp for lunch. Afternoon game drive to experience the wildlife distribution in Maasai Mara, then back to the camp for dinner and overnight.",
      },
      {
        marker: "Day 4",
        heading: "Mara exploration and leisure",
        body: "Depart from the camp after breakfast for Maasai Mara exploration and return for lunch. Afternoon leisure with an optional cultural village visit.",
      },
      {
        marker: "Day 5",
        heading: "Lake Naivasha",
        body: "Depart from the camp after breakfast and drive to Lake Naivasha. Arrive at Sawela Lodge for lunch. Afternoon boat ride for a sundowner.",
      },
      {
        marker: "Day 6",
        heading: "Kongoni Ranch",
        body: "After breakfast drive to Kongoni Ranch and arrive at Acacia Camp for lunch. Afternoon leisure with an optional nature walk and sundowner.",
      },
      {
        marker: "Day 7",
        heading: "Onward to the beach",
        body: "Check out from the camp and drive to the airport to catch a flight to a beach holiday destination for relaxation.",
      },
    ],
  },
  {
    slug: "6-days-animal-kingdom",
    title: "6 Days Animal Kingdom Safari",
    tagline: "The heart of the wild.",
    duration: "6 Days",
    image: lionImg,
    alt: "Close-up portrait of a male lion resting in tall savannah grass",
    intro: [
      "Our itineraries are flexible, so each of our suggested tours and travels can always be adapted. We can plan a tour or a trip with our knowledge and experience, tailored to how you want to travel.",
    ],
    itinerary: [
      {
        marker: "Day 1",
        heading: "Northern Kenya to Samburu",
        body: "Pick up from Nairobi, proceed to the northern side of Kenya and arrive at Samburu Ashnil for lunch. Afternoon game drive till late evening.",
      },
      {
        marker: "Day 2",
        heading: "Ewaso Nyiro river",
        body: "After breakfast depart for a long game drive to explore the park along the Ewaso Nyiro river and back to the camp for lunch. Afternoon game drive till late evening.",
      },
      {
        marker: "Day 3",
        heading: "Great Rift Valley and Lake Nakuru",
        body: "Check out from the camp after breakfast and drive to the Great Rift Valley with a stopover at Subukia viewpoint for a brief introduction to the area. Proceed to Lake Nakuru park and arrive at Flamingo Lion Hill Camp for lunch. Afternoon game drive to experience the birdlife and wildlife distribution, then return to camp for evening leisure, dinner and overnight.",
      },
      {
        marker: "Day 4",
        heading: "On to Maasai Mara",
        body: "After breakfast depart with game viewing en route heading for Maasai Mara and arrive at Simba Oryx Camp for lunch. Afternoon game drive till late evening.",
      },
      {
        marker: "Day 5",
        heading: "Full day Masai Mara",
        body: "Depart the camp with picnic lunch for a full-day Masai Mara exploration to experience the wildlife on the savanna.",
      },
      {
        marker: "Day 6",
        heading: "Return to Nairobi",
        body: "After breakfast check out from the lodge and drive back to Nairobi with a great memory of the wildlife experience in Kenya.",
      },
    ],
  },
];

export function getTour(slug: string): Tour | undefined {
  return tours.find((t) => t.slug === slug);
}
