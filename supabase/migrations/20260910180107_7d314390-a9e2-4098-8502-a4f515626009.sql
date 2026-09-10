ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'Safari Packages';

UPDATE public.tours SET category = 'Day Tours & Excursions' WHERE slug IN ('nairobi-city-tour','mombasa-city-tour');

UPDATE public.tours t
SET itinerary = sub.new_it
FROM (
  SELECT x.id, jsonb_agg(
           jsonb_build_object('marker', 'Stop ' || s.idx, 'heading', s.step->>'heading', 'body', s.step->>'body')
           ORDER BY s.idx
         ) AS new_it
  FROM public.tours x
  CROSS JOIN LATERAL jsonb_array_elements(x.itinerary) WITH ORDINALITY AS s(step, idx)
  WHERE x.itinerary::text LIKE '%HRS%'
  GROUP BY x.id
) sub
WHERE t.id = sub.id;

UPDATE public.tours SET
  tagline = 'A full day through the ancient city of Mombasa — forts, spice-scented streets and a sunset dhow cruise.',
  intro = '["Mombasa is East Africa''s oldest port city, and this excursion walks you through its layers: Portuguese forts, Swahili doorways, Indian temples and a coastline that has welcomed traders for a thousand years.", "We travel at a gentle pace with a licensed local guide, ending on the water as the sun goes down over the Old Harbour."]'::jsonb,
  itinerary = '[
    {"marker":"Stop 1","heading":"Mama Ngina City Park","body":"We begin on the cliff-top promenade overlooking the entrance to the old harbour, with views across to Fort Jesus and the dhows coming in."},
    {"marker":"Stop 2","heading":"Fort Jesus","body":"A guided walk through the 16th-century Portuguese fortress, a UNESCO World Heritage site and the anchor of the ancient city of Mombasa."},
    {"marker":"Stop 3","heading":"Old Town","body":"Narrow lanes, carved Swahili doors, coral-stone houses and balconies that have watched over the port for generations."},
    {"marker":"Stop 4","heading":"Mackinnon Market","body":"The city''s busiest market — spices, tropical fruit, kikoi cloth and the everyday rhythm of coastal Mombasa."},
    {"marker":"Stop 5","heading":"Elephant Tusks","body":"The famous aluminium tusks arching over Moi Avenue, Mombasa''s best-known landmark and photo stop."},
    {"marker":"Stop 6","heading":"Hindu Temple","body":"A visit to one of Mombasa''s ornate Hindu temples, a reminder of the Indian Ocean trade that shaped the city."},
    {"marker":"Stop 7","heading":"Tamarind Dhow Sunset Cruise","body":"We close the day aboard a traditional dhow, drifting past the old harbour with dinner and live music as the sun sets."}
  ]'::jsonb
WHERE slug = 'mombasa-city-tour';

UPDATE public.tours SET
  intro = '["Nairobi is the only capital in the world with a national park on its doorstep. This day tour begins with a game drive at sunrise and ends with the city itself.", "Pick-up from your hotel or the airport, a licensed guide throughout, and plenty of time at each stop."]'::jsonb,
  itinerary = '[
    {"marker":"Stop 1","heading":"Pick-up and Nairobi National Park","body":"We collect you from your hotel or the airport and head straight into the park for a game drive — lion, buffalo, giraffe, zebra and rhino against the city skyline."},
    {"marker":"Stop 2","heading":"David Sheldrick Wildlife Trust","body":"Meet the orphaned elephant calves at the world''s most successful elephant rescue and rehabilitation project during the daily feeding hour."},
    {"marker":"Stop 3","heading":"Giraffe Centre","body":"Come eye to eye with endangered Rothschild giraffe from the raised feeding platform — a favourite with families."},
    {"marker":"Stop 4","heading":"Break for lunch","body":"A relaxed lunch at a Nairobi restaurant of your choice, from Kenyan classics to a nyama choma grill."},
    {"marker":"Stop 5","heading":"City tour","body":"An afternoon drive through the city — the central business district, the Kenyatta International Convention Centre, museums and markets before your drop-off."}
  ]'::jsonb
WHERE slug = 'nairobi-city-tour';

INSERT INTO public.tours (slug, title, tagline, duration, image_url, image_alt, intro, itinerary, published, sort_order, category) VALUES
('lake-naivasha-experience','Lake Naivasha Experience','Volcano hikes, cycling among wildlife, boat rides and flower farms in the Great Rift Valley.','3 days','https://ogomwciyaflqhdnonlfd.supabase.co/storage/v1/object/public/site-images/tours%2Ftour-naivasha.jpg','Lake Naivasha at golden hour with acacia trees, flamingos and Mount Longonot behind',
 '["Ninety minutes from Nairobi, Lake Naivasha is the Rift Valley at its most active — a freshwater lake ringed by volcanoes, gorges and flower farms.", "This is an adventure itinerary: you hike, cycle, paddle and ride, with hippos and giraffe never far away."]'::jsonb,
 '[{"marker":"Day 1","heading":"Mount Longonot hiking","body":"A climb to the rim of a dormant volcano, then a walk around the crater with the Rift Valley spread out below."},
   {"marker":"Day 2","heading":"Hell''s Gate cycling safari","body":"Cycle through the gorge among zebra, giraffe and warthog, then walk the towering sandstone canyon with a ranger."},
   {"marker":"Day 3","heading":"Boat ride and nature walk","body":"A morning boat ride to the hippo pods and fish eagles, followed by a guided walk on Crescent Island among grazing plains game."},
   {"marker":"Day 3","heading":"Horse ride safari","body":"See the lakeshore from the saddle — an easy ride suitable for beginners, with wildlife all around."},
   {"marker":"Day 3","heading":"AgriTour of a flower farm","body":"Behind the scenes at one of the farms that supplies Europe''s roses, from greenhouse to cold room."}]'::jsonb,
 true, 6, 'Day Tours & Excursions'),
('sagana-river-experience','Sagana River Experience','White water rafting, zip lining and bungee jumping on the Tana river.','2 days','https://ogomwciyaflqhdnonlfd.supabase.co/storage/v1/object/public/site-images/tours%2Ftour-sagana.jpg','Rafting team paddling through white water rapids on the Sagana river in Kenya',
 '["Sagana, on the Tana river below Mount Kenya, is the country''s adrenaline capital.", "Everything is run with certified guides and full safety briefings, so first-timers are very welcome."]'::jsonb,
 '[{"marker":"Day 1","heading":"White water rafting","body":"Grade three to five rapids through forested gorges, with calm stretches to swim and catch your breath."},
   {"marker":"Day 1","heading":"Zip lining","body":"A series of lines strung high above the river and canopy."},
   {"marker":"Day 2","heading":"Bungee jumping","body":"A free fall from the platform over the Tana — the highlight for the brave."},
   {"marker":"Day 2","heading":"Cycling","body":"Trails through farmland and villages along the riverbank."},
   {"marker":"Day 2","heading":"Nature walk","body":"A guided riverside walk for birdlife, waterfalls and the local plant life."}]'::jsonb,
 true, 7, 'Day Tours & Excursions'),
('loita-experience','Loita Experience','Time with Maasai families in the Loita hills — culture, cattle, donkey safari and hiking.','3 days','https://ogomwciyaflqhdnonlfd.supabase.co/storage/v1/object/public/site-images/tours%2Ftour-loita.jpg','Maasai herders in red shukas walking with cattle through the green Loita hills',
 '["The Loita hills are one of the last places where Maasai life continues largely as it always has, in forest the community calls the Forest of the Lost Child.", "You travel with Maasai guides, sleep close to the community and take part rather than watch from a vehicle."]'::jsonb,
 '[{"marker":"Day 1","heading":"Culture tour","body":"Arrive in the hills and spend the day with a Maasai family — homestead life, beadwork, medicinal plants and evening songs."},
   {"marker":"Day 2","heading":"Cattle grazing","body":"Out with the herders at dawn to move the cattle, learning how livestock, land and family are woven together."},
   {"marker":"Day 2","heading":"Donkey safari","body":"Travel between valleys the traditional way, with donkeys carrying the kit and time to walk at an easy pace."},
   {"marker":"Day 3","heading":"Hiking","body":"A final hike to a ridge viewpoint over the forest and the plains that run towards the Mara."}]'::jsonb,
 true, 8, 'Day Tours & Excursions'),
('kenya-tanzania-safari','Kenya – Tanzania Safari','The Masai Mara and the Serengeti in one journey, following the great migration.','10 days','https://ogomwciyaflqhdnonlfd.supabase.co/storage/v1/object/public/site-images/tours%2Ftour-kenya-tanzania.jpg','Wildebeest herd crossing a river between Kenya and Tanzania in golden light',
 '["The two greatest wildlife ecosystems in Africa are one continuous plain divided by a border. This safari crosses it.", "We handle the border formalities, park fees and transfers so the journey feels like a single trip."]'::jsonb,
 '[{"marker":"Day 1","heading":"Arrival in Nairobi","body":"Airport pick-up, briefing and overnight in the city."},
   {"marker":"Day 2","heading":"Masai Mara","body":"Drive to the Mara with an afternoon game drive on arrival."},
   {"marker":"Day 3","heading":"Full day in the Mara","body":"Dawn to dusk in big cat country, with the river crossings in season."},
   {"marker":"Day 4","heading":"Cross to Tanzania","body":"Through the Isebania border and on towards the Serengeti."},
   {"marker":"Day 5","heading":"Central Serengeti","body":"Game drives among the kopjes where the lion prides rest."},
   {"marker":"Day 6","heading":"Northern Serengeti","body":"Following the herds and the predators that shadow them."},
   {"marker":"Day 7","heading":"Ngorongoro Crater","body":"Descend into the caldera for a full day of dense wildlife, including black rhino."},
   {"marker":"Day 8","heading":"Lake Manyara","body":"Tree-climbing lions, elephant and a lake edge pink with flamingos."},
   {"marker":"Day 9","heading":"Arusha","body":"A relaxed final day, curio shopping and a farewell dinner."},
   {"marker":"Day 10","heading":"Departure","body":"Transfer to Kilimanjaro or Nairobi airport for your flight home."}]'::jsonb,
 true, 9, 'Cross-Border Safaris'),
('kenya-zanzibar-safari','Kenya – Zanzibar Safari','Big game in the Kenyan parks, then the white sand and spice of Zanzibar.','10 days','https://ogomwciyaflqhdnonlfd.supabase.co/storage/v1/object/public/site-images/tours%2Ftour-zanzibar.jpg','Traditional wooden dhow moored on a turquoise Zanzibar beach lined with palms',
 '["Safari and sea, in the order that makes the most sense: dusty game drives first, then a week of doing very little on the Indian Ocean.", "Internal flights, transfers and park fees are arranged end to end."]'::jsonb,
 '[{"marker":"Day 1","heading":"Arrival in Nairobi","body":"Airport pick-up and overnight in the city."},
   {"marker":"Day 2","heading":"Amboseli","body":"Elephant herds beneath Kilimanjaro."},
   {"marker":"Day 3","heading":"Masai Mara","body":"Transfer to the Mara with an afternoon game drive."},
   {"marker":"Day 4","heading":"Full day in the Mara","body":"Big cats, plains game and a sundowner on the escarpment."},
   {"marker":"Day 5","heading":"Fly to Zanzibar","body":"Return to Nairobi and connect to Zanzibar, transferring to your beach hotel."},
   {"marker":"Day 6","heading":"Stone Town","body":"A guided walk through the old town, spice market and House of Wonders."},
   {"marker":"Day 7","heading":"Spice tour","body":"Clove, nutmeg and vanilla plantations, with a Swahili lunch."},
   {"marker":"Day 8","heading":"Snorkelling and sandbank","body":"A dhow out to the reef for snorkelling and a picnic on a sandbank."},
   {"marker":"Day 9","heading":"Beach day","body":"Nothing scheduled — swim, read, or take a sunset cruise."},
   {"marker":"Day 10","heading":"Departure","body":"Transfer to Zanzibar airport for your flight home."}]'::jsonb,
 true, 10, 'Cross-Border Safaris'),
('tanzania-zanzibar-safari','Tanzania – Zanzibar Safari','Serengeti, Ngorongoro and the Zanzibar coast in one unhurried route.','10 days','https://ogomwciyaflqhdnonlfd.supabase.co/storage/v1/object/public/site-images/tours%2Ftour-tanzania-zanzibar.jpg','Serengeti plains at sunrise with acacia trees and a distant elephant herd',
 '["Tanzania''s northern circuit paired with the islands — the classic combination for a first trip to East Africa.", "Comfortable lodges, a private guide and a flight to the coast rather than a long drive."]'::jsonb,
 '[{"marker":"Day 1","heading":"Arrival in Arusha","body":"Kilimanjaro airport pick-up, briefing and overnight."},
   {"marker":"Day 2","heading":"Tarangire","body":"Baobabs and some of the largest elephant herds in the country."},
   {"marker":"Day 3","heading":"Serengeti","body":"Transfer into the park with an afternoon game drive."},
   {"marker":"Day 4","heading":"Full day in the Serengeti","body":"Endless plains, kopjes and predators."},
   {"marker":"Day 5","heading":"Ngorongoro Crater","body":"A full day on the crater floor."},
   {"marker":"Day 6","heading":"Lake Manyara","body":"Forest, lake shore and flamingos."},
   {"marker":"Day 7","heading":"Fly to Zanzibar","body":"Flight to the island and transfer to your beach hotel."},
   {"marker":"Day 8","heading":"Stone Town and spices","body":"Old town walking tour and a spice farm visit."},
   {"marker":"Day 9","heading":"Reef and beach","body":"Snorkelling by dhow, then an afternoon at leisure."},
   {"marker":"Day 10","heading":"Departure","body":"Transfer to Zanzibar airport."}]'::jsonb,
 true, 11, 'Cross-Border Safaris'),
('gorilla-safari-uganda','Gorilla Safari – Uganda','Tracking mountain gorillas in Bwindi Impenetrable Forest.','5 days','https://ogomwciyaflqhdnonlfd.supabase.co/storage/v1/object/public/site-images/tours%2Ftour-gorilla.jpg','Silverback mountain gorilla sitting in misty Bwindi rainforest in Uganda',
 '["An hour with a habituated gorilla family in Bwindi is the most affecting wildlife encounter in Africa.", "Permits are limited and must be booked well ahead — talk to us early about dates."]'::jsonb,
 '[{"marker":"Day 1","heading":"Arrival in Entebbe","body":"Airport pick-up, briefing and overnight on the lake shore."},
   {"marker":"Day 2","heading":"Drive to Bwindi","body":"A scenic drive through the Ugandan highlands and tea country."},
   {"marker":"Day 3","heading":"Gorilla tracking","body":"Into the forest with rangers and trackers for your permitted hour with a gorilla family."},
   {"marker":"Day 4","heading":"Batwa community and forest walk","body":"Time with the Batwa community and a guided walk for birds and primates."},
   {"marker":"Day 5","heading":"Return and departure","body":"Drive or fly back to Entebbe for your flight home."}]'::jsonb,
 true, 12, 'Adventure Safaris'),
('mount-kilimanjaro-climbing','Mount Kilimanjaro Climbing','The roof of Africa — a guided trek to Uhuru Peak at 5,895m.','8 days','https://ogomwciyaflqhdnonlfd.supabase.co/storage/v1/object/public/site-images/tours%2Ftour-kilimanjaro.jpg','Snow capped summit of Mount Kilimanjaro at sunrise with trekkers on the ridge',
 '["Kilimanjaro asks for patience rather than technical skill. Our routes are paced for acclimatisation, which is what gets people to the top.", "Mountain crew, park fees, meals and camping equipment are all included."]'::jsonb,
 '[{"marker":"Day 1","heading":"Arrival in Moshi","body":"Airport transfer, kit check and full route briefing."},
   {"marker":"Day 2","heading":"Trek begins","body":"Through the rainforest belt to the first camp."},
   {"marker":"Day 3","heading":"Moorland","body":"Out of the trees into giant heather and open views."},
   {"marker":"Day 4","heading":"Acclimatisation day","body":"Climb high, sleep low — the day that makes the summit possible."},
   {"marker":"Day 5","heading":"Alpine desert","body":"A steady walk across lava and scree to high camp."},
   {"marker":"Day 6","heading":"Summit night","body":"A midnight start for sunrise at Uhuru Peak, then the long descent."},
   {"marker":"Day 7","heading":"Descent","body":"Down through moorland and forest to the park gate and your certificate."},
   {"marker":"Day 8","heading":"Departure","body":"Rest, then transfer to Kilimanjaro airport."}]'::jsonb,
 true, 13, 'Adventure Safaris'),
('mount-kenya-climbing','Mount Kenya Climbing','Africa''s second highest mountain, trekked to Point Lenana at 4,985m.','5 days','https://ogomwciyaflqhdnonlfd.supabase.co/storage/v1/object/public/site-images/tours%2Ftour-mount-kenya.jpg','Jagged glaciated peaks of Mount Kenya above an alpine tarn at sunrise',
 '["Mount Kenya is the more beautiful of the two great East African peaks — glacial tarns, giant lobelia and jagged summits.", "Point Lenana is a trekking summit, reachable by anyone reasonably fit with the right pacing."]'::jsonb,
 '[{"marker":"Day 1","heading":"Nairobi to Nanyuki","body":"Drive to the foot of the mountain, kit check and briefing."},
   {"marker":"Day 2","heading":"Into the forest","body":"Trek from the park gate through bamboo and forest to the first camp."},
   {"marker":"Day 3","heading":"Moorland and tarns","body":"Up into the alpine zone past giant groundsel and glacial lakes."},
   {"marker":"Day 4","heading":"Point Lenana summit","body":"A pre-dawn start for sunrise on the summit, then descent to camp."},
   {"marker":"Day 5","heading":"Descent and return","body":"Out to the gate and the drive back to Nairobi."}]'::jsonb,
 true, 14, 'Adventure Safaris');
