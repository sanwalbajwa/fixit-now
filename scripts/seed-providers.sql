begin;

-- Demo marketplace seed for verified providers across Pakistan.
-- Reviews below are realistic sample/demo reviews, not production customer claims.

with provider_seed as (
  select * from (
    values
      ('Aamir Khan',        'Karachi',          '+923001111101', 'aamir.karachi@example.com',          'Plumbing',        'Leak repair, bathroom fitting, water line replacement, and urgent plumbing support across Karachi.',          4500,  8),
      ('Bilal Ahmed',       'Lahore',           '+923001111102', 'bilal.lahore@example.com',           'Electrical',      'Residential wiring, breaker repair, inverter setup, and electrical safety checks in Lahore.',                   5200,  9),
      ('Camila Shah',       'Islamabad',        '+923001111103', 'camila.islamabad@example.com',        'Cleaning',        'Deep cleaning, move-in cleaning, kitchen degreasing, and office cleaning packages in Islamabad.',                3800,  7),
      ('Danish Ali',        'Rawalpindi',       '+923001111104', 'danish.rawalpindi@example.com',       'Painting',        'Interior repainting, exterior weather coating, wall preparation, and touch-up jobs in Rawalpindi.',              6100,  8),
      ('Ehsan Riaz',        'Faisalabad',       '+923001111105', 'ehsan.faisalabad@example.com',        'Carpentry',       'Custom shelves, door repair, cabinet fitting, and furniture fixing in Faisalabad.',                              7200,  7),
      ('Farah Noor',        'Multan',           '+923001111106', 'farah.multan@example.com',            'AC Repair',       'Split AC servicing, gas refill, installation, and cooling diagnostics in Multan.',                               6800, 10),
      ('Gulzar Khan',       'Peshawar',         '+923001111107', 'gulzar.peshawar@example.com',         'Appliance Repair','Washer, fridge, microwave, and small appliance diagnostics for homes across Peshawar.',                         5400,  7),
      ('Hassan Malik',      'Quetta',           '+923001111108', 'hassan.quetta@example.com',           'Furniture',       'Furniture assembly, repair, polishing, and relocation support in Quetta.',                                      4700,  6),
      ('Iqra Javed',        'Sialkot',          '+923001111109', 'iqra.sialkot@example.com',            'Plumbing',        'Tap repair, bathroom accessories, drain cleaning, and water pressure fixes across Sialkot.',                     4100,  9),
      ('Javed Iqbal',       'Gujranwala',       '+923001111110', 'javed.gujranwala@example.com',        'Electrical',      'Fan repair, switchboard upgrades, wiring checks, and light fixture installation in Gujranwala.',                 5300,  8),
      ('Khalid Raza',       'Hyderabad',        '+923001111111', 'khalid.hyderabad@example.com',        'Cleaning',        'Regular housekeeping, post-renovation cleaning, and bathroom sanitization in Hyderabad.',                       3600,  6),
      ('Lubna Tariq',       'Sukkur',           '+923001111112', 'lubna.sukkur@example.com',            'Painting',        'Room repainting, color consultation, exterior coating, and wall texture work in Sukkur.',                        5900,  7),
      ('Mariam Siddiqui',   'Bahawalpur',       '+923001111113', 'mariam.bahawalpur@example.com',       'Carpentry',       'Kitchen cabinets, wooden partitions, shelf fitting, and door repair in Bahawalpur.',                            7600,  8),
      ('Naveed Akhtar',     'Sargodha',         '+923001111114', 'naveed.sargodha@example.com',         'AC Repair',       'Compressor diagnostics, seasonal servicing, gas refill, and AC installation in Sargodha.',                       6900,  7),
      ('Omer Farooq',       'Abbottabad',       '+923001111115', 'omer.abbottabad@example.com',         'Appliance Repair','Kitchen and laundry appliance diagnostics, repair, and maintenance in Abbottabad.',                            5000,  6),
      ('Parveen Bano',      'Sheikhupura',      '+923001111116', 'parveen.sheikhupura@example.com',     'Furniture',       'Bed, chair, table, and wardrobe repair plus assembly support in Sheikhupura.',                                  4300,  5),
      ('Qasim Zafar',       'Larkana',          '+923001111117', 'qasim.larkana@example.com',           'Plumbing',        'Leak detection, line replacement, fixture installation, and drain cleaning in Larkana.',                         4500,  7),
      ('Rana Shah',         'Dera Ghazi Khan',  '+923001111118', 'rana.dgkhan@example.com',             'Electrical',      'Fault finding, socket repair, breaker replacement, and home electrical maintenance in Dera Ghazi Khan.',         5600,  7),
      ('Sadia Khan',        'Rahim Yar Khan',   '+923001111119', 'sadia.rykhan@example.com',            'Cleaning',        'Maid services, full home cleaning, kitchen cleaning, and sanitation packages in Rahim Yar Khan.',                3400,  6),
      ('Tariq Mehmood',     'Gojra',            '+923001111120', 'tariq.gojra@example.com',             'Painting',        'Affordable repainting, texture work, wall repair, and weatherproof coating in Gojra.',                          6200,  6),
      ('Usman Qureshi',     'Gujrat',           '+923001111121', 'usman.gujrat@example.com',            'Carpentry',       'Door locks, wooden frames, shelves, and furniture fixes for homes in Gujrat.',                                  6400,  7),
      ('Varda Saleem',      'Mardan',           '+923001111122', 'varda.mardan@example.com',            'Cleaning',        'Apartment cleaning, sofa cleaning coordination, and regular housekeeping support in Mardan.',                    3700,  5),
      ('Waqas Niazi',       'Mianwali',         '+923001111123', 'waqas.mianwali@example.com',          'Electrical',      'Ceiling fan repair, wiring inspection, UPS connection, and switchboard work in Mianwali.',                       5100,  6),
      ('Yasmeen Akram',     'Okara',            '+923001111124', 'yasmeen.okara@example.com',           'AC Repair',       'AC cleaning, gas top-up, installation, and seasonal service packages in Okara.',                                6500,  6),
      ('Zeeshan Butt',      'Jhelum',           '+923001111125', 'zeeshan.jhelum@example.com',          'Appliance Repair','Fridge, washing machine, microwave, and kitchen appliance repair in Jhelum.',                              5300,  7),
      ('Arif Solangi',      'Nawabshah',        '+923001111126', 'arif.nawabshah@example.com',          'Plumbing',        'Kitchen sink repair, bathroom leaks, pipe fitting, and water motor support in Nawabshah.',                       4300,  5),
      ('Bushra Gill',       'Kasur',            '+923001111127', 'bushra.kasur@example.com',            'Painting',        'Neat wall painting, boundary wall coating, and small renovation paint jobs in Kasur.',                           5800,  6),
      ('Chaudhry Imran',    'Sahiwal',          '+923001111128', 'imran.sahiwal@example.com',           'Furniture',       'Furniture polishing, bed repair, cabinet alignment, and table assembly in Sahiwal.',                            4600,  6),
      ('Daud Afridi',       'Swat',             '+923001111129', 'daud.swat@example.com',               'Electrical',      'Light installation, home fault tracing, fan repair, and safe wiring support in Swat.',                           5500,  5),
      ('Erum Fatima',       'Muzaffarabad',     '+923001111130', 'erum.muzaffarabad@example.com',       'Cleaning',        'Deep home cleaning, bathroom care, and move-out cleaning service in Muzaffarabad.',                             4000,  5),
      ('Fawad Baloch',      'Gwadar',           '+923001111131', 'fawad.gwadar@example.com',            'AC Repair',       'Coastal AC maintenance, filter cleaning, gas refill, and cooling issue diagnosis in Gwadar.',                    7200,  6),
      ('Ghazala Mir',       'Mirpur',           '+923001111132', 'ghazala.mirpur@example.com',          'Carpentry',       'Wardrobe repair, shelves, wooden fittings, and door work in Mirpur.',                                           7000,  5),
      ('Hamza Latif',       'Taxila',           '+923001111133', 'hamza.taxila@example.com',            'Appliance Repair','Appliance inspection, washer repair, fridge cooling fixes, and spare-part guidance in Taxila.',                   5200,  6),
      ('Inam Ullah',        'Kohat',            '+923001111134', 'inam.kohat@example.com',              'Plumbing',        'Bathroom fitting, water tank line support, drain opening, and pipe replacement in Kohat.',                       4400,  5),
      ('Javeria Aslam',     'Chiniot',          '+923001111135', 'javeria.chiniot@example.com',         'Furniture',       'Chiniot-style furniture repair, polishing, assembly, and wood touch-ups.',                                      7800,  8),
      ('Kamran Haider',     'Vehari',           '+923001111136', 'kamran.vehari@example.com',           'Electrical',      'Home wiring, breaker troubleshooting, lighting, and outlet repair in Vehari.',                                  5000,  5),
      ('Laila Noorani',     'Thatta',           '+923001111137', 'laila.thatta@example.com',            'Cleaning',        'Regular cleaning, kitchen detailing, and home sanitation for families in Thatta.',                              3500,  5),
      ('Muneeb Shah',       'Skardu',           '+923001111138', 'muneeb.skardu@example.com',           'Painting',        'Interior painting, surface repair, and weather-resistant coating for homes in Skardu.',                         6800,  6),
      ('Nadia Hassan',      'Gilgit',           '+923001111139', 'nadia.gilgit@example.com',            'AC Repair',       'AC and ventilation servicing, diagnostics, and installation guidance in Gilgit.',                                7000,  5),
      ('Sohail Abbasi',     'Murree',           '+923001111140', 'sohail.murree@example.com',           'Appliance Repair','Heater, fridge, washer, and household appliance repair support in Murree.',                                5600,  6)
  ) as t(name, city, phone, email, specialty, description, price, review_count)
),
customer_seed as (
  select * from (
    values
      ('Seed Customer Lahore',      'seed.customer.lahore@example.com',      '+923009990001', 'Lahore'),
      ('Seed Customer Karachi',     'seed.customer.karachi@example.com',     '+923009990002', 'Karachi'),
      ('Seed Customer Islamabad',   'seed.customer.islamabad@example.com',   '+923009990003', 'Islamabad'),
      ('Seed Customer Peshawar',    'seed.customer.peshawar@example.com',    '+923009990004', 'Peshawar'),
      ('Seed Customer Quetta',      'seed.customer.quetta@example.com',      '+923009990005', 'Quetta'),
      ('Seed Customer Multan',      'seed.customer.multan@example.com',      '+923009990006', 'Multan'),
      ('Seed Customer Hyderabad',   'seed.customer.hyderabad@example.com',   '+923009990007', 'Hyderabad'),
      ('Seed Customer Faisalabad',  'seed.customer.faisalabad@example.com',  '+923009990008', 'Faisalabad'),
      ('Seed Customer Sukkur',      'seed.customer.sukkur@example.com',      '+923009990009', 'Sukkur'),
      ('Seed Customer Abbottabad',  'seed.customer.abbottabad@example.com',  '+923009990010', 'Abbottabad'),
      ('Seed Customer Mirpur',      'seed.customer.mirpur@example.com',      '+923009990011', 'Mirpur'),
      ('Seed Customer Gilgit',      'seed.customer.gilgit@example.com',      '+923009990012', 'Gilgit')
  ) as t(name, email, phone, city)
),
review_seed as (
  select * from (
    values
      (1, 5, 'Arrived on time, explained the issue clearly, and finished the work neatly.'),
      (2, 5, 'Very professional attitude and the final result was exactly what we needed.'),
      (3, 4, 'Good communication, fair price, and no mess left after the job.'),
      (4, 5, 'Quick response and reliable work. I would book again for future repairs.'),
      (5, 4, 'Solved the problem properly and gave useful maintenance advice.'),
      (6, 5, 'Respectful, punctual, and careful with the home. Highly recommended.'),
      (7, 5, 'The work quality was better than expected and the pricing was transparent.'),
      (8, 4, 'Came prepared with the right tools and completed the job without delay.'),
      (9, 5, 'Clean finish, polite behavior, and strong attention to detail.'),
      (10, 4, 'Handled the repair well and followed up to make sure everything was working.'),
      (11, 5, 'Excellent service. The provider was patient and answered all questions.'),
      (12, 5, 'Booking was smooth, service was dependable, and the work held up well.')
  ) as t(review_index, rating, review)
),
provider_users as (
  select
    row_number() over (order by ps.email) as rn,
    coalesce(existing.id, gen_random_uuid()) as user_id,
    ps.*
  from provider_seed ps
  left join auth.users existing on lower(existing.email) = lower(ps.email)
),
customer_users as (
  select
    row_number() over (order by cs.email) as rn,
    coalesce(existing.id, gen_random_uuid()) as user_id,
    cs.*
  from customer_seed cs
  left join auth.users existing on lower(existing.email) = lower(cs.email)
),
insert_auth_providers as (
  insert into auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
  )
  select
    pu.user_id,
    coalesce((select id from auth.instances limit 1), gen_random_uuid()),
    'authenticated',
    'authenticated',
    pu.email,
    crypt('Password123!', gen_salt('bf')),
    now(),
    jsonb_build_object('provider', 'email', 'providers', jsonb_build_array('email')),
    jsonb_build_object(
      'name', pu.name,
      'role', 'provider',
      'phone', pu.phone,
      'city', pu.city,
      'address', pu.city || ', Pakistan'
    ),
    now(),
    now()
  from provider_users pu
  where not exists (select 1 from auth.users au where lower(au.email) = lower(pu.email))
  returning id
),
insert_auth_customers as (
  insert into auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
  )
  select
    cu.user_id,
    coalesce((select id from auth.instances limit 1), gen_random_uuid()),
    'authenticated',
    'authenticated',
    cu.email,
    crypt('Password123!', gen_salt('bf')),
    now(),
    jsonb_build_object('provider', 'email', 'providers', jsonb_build_array('email')),
    jsonb_build_object(
      'name', cu.name,
      'role', 'customer',
      'phone', cu.phone,
      'city', cu.city,
      'address', cu.city || ', Pakistan'
    ),
    now(),
    now()
  from customer_users cu
  where not exists (select 1 from auth.users au where lower(au.email) = lower(cu.email))
  returning id
),
update_auth_provider_metadata as (
  update auth.users au
  set
    raw_user_meta_data = coalesce(au.raw_user_meta_data, '{}'::jsonb) || jsonb_build_object(
      'name', pu.name,
      'role', 'provider',
      'phone', pu.phone,
      'city', pu.city,
      'address', pu.city || ', Pakistan'
    ),
    updated_at = now()
  from provider_users pu
  where lower(au.email) = lower(pu.email)
  returning au.id
),
update_auth_customer_metadata as (
  update auth.users au
  set
    raw_user_meta_data = coalesce(au.raw_user_meta_data, '{}'::jsonb) || jsonb_build_object(
      'name', cu.name,
      'role', 'customer',
      'phone', cu.phone,
      'city', cu.city,
      'address', cu.city || ', Pakistan'
    ),
    updated_at = now()
  from customer_users cu
  where lower(au.email) = lower(cu.email)
  returning au.id
),
upsert_public_provider_users as (
  insert into public.users (
    user_id,
    email,
    name,
    phone,
    role,
    profile_image_url
  )
  select
    pu.user_id,
    pu.email,
    pu.name,
    pu.phone,
    'provider',
    null
  from provider_users pu
  on conflict (user_id) do update
    set email = excluded.email,
        name = excluded.name,
        phone = excluded.phone,
        role = excluded.role
  returning user_id
),
upsert_public_customer_users as (
  insert into public.users (
    user_id,
    email,
    name,
    phone,
    role,
    profile_image_url
  )
  select
    cu.user_id,
    cu.email,
    cu.name,
    cu.phone,
    'customer',
    null
  from customer_users cu
  on conflict (user_id) do update
    set email = excluded.email,
        name = excluded.name,
        phone = excluded.phone,
        role = excluded.role
  returning user_id
),
insert_customers as (
  insert into public.customers (user_id)
  select cu.user_id
  from customer_users cu
  where not exists (select 1 from public.customers c where c.user_id = cu.user_id)
  returning customer_id, user_id
),
all_customers as (
  select c.customer_id, c.user_id, cu.rn
  from public.customers c
  join customer_users cu on cu.user_id = c.user_id
),
insert_providers as (
  insert into public.service_providers (
    user_id,
    skills,
    is_verified,
    availability,
    rating,
    total_reviews
  )
  select
    pu.user_id,
    pu.description,
    true,
    case when pu.rn % 5 = 0 then 'busy' else 'available' end,
    0,
    0
  from provider_users pu
  where not exists (select 1 from public.service_providers sp where sp.user_id = pu.user_id)
  returning provider_id, user_id
),
all_providers as (
  select sp.provider_id, sp.user_id, pu.rn, pu.specialty, pu.description, pu.price, pu.review_count
  from public.service_providers sp
  join provider_users pu on pu.user_id = sp.user_id
),
insert_listings as (
  insert into public.service_listings (
    provider_id,
    category_id,
    title,
    description,
    price
  )
  select
    ap.provider_id,
    (
      select sc.category_id
      from public.service_categories sc
      where lower(sc.category_name) like '%' || lower(split_part(ap.specialty, ' ', 1)) || '%'
      order by sc.category_name
      limit 1
    ),
    ap.specialty || ' Service',
    ap.description,
    ap.price
  from all_providers ap
  where not exists (
    select 1
    from public.service_listings sl
    where sl.provider_id = ap.provider_id
      and sl.title = ap.specialty || ' Service'
  )
  returning listing_id
),
insert_ratings as (
  insert into public.ratings (
    customer_id,
    provider_id,
    rating,
    review,
    created_at
  )
  select
    ac.customer_id,
    ap.provider_id,
    rs.rating,
    rs.review,
    now() - ((gs + ap.rn) || ' days')::interval
  from all_providers ap
  join lateral generate_series(1, ap.review_count) as gs on true
  join all_customers ac on ac.rn = ((gs + ap.rn - 2) % (select count(*) from all_customers)) + 1
  join review_seed rs on rs.review_index = ((gs + ap.rn - 2) % 12) + 1
  where not exists (
    select 1
    from public.ratings r
    where r.provider_id = ap.provider_id
      and r.customer_id = ac.customer_id
      and r.review = rs.review
  )
  returning rating_id
),
update_provider_aggregates as (
  update public.service_providers sp
  set
    rating = agg.avg_rating,
    total_reviews = agg.total_reviews
  from (
    select
      provider_id,
      round(avg(rating)::numeric, 2) as avg_rating,
      count(*)::int as total_reviews
    from public.ratings
    group by provider_id
  ) agg
  where sp.provider_id = agg.provider_id
  returning sp.provider_id
)
select
  (select count(*) from provider_users) as providers_in_seed,
  (select count(*) from update_auth_provider_metadata) as provider_auth_profiles_updated,
  (select count(*) from update_auth_customer_metadata) as customer_auth_profiles_updated,
  (select count(*) from insert_providers) as new_providers_created,
  (select count(*) from insert_listings) as new_listings_created,
  (select count(*) from insert_ratings) as new_reviews_created,
  (select count(*) from update_provider_aggregates) as providers_with_updated_ratings;

commit;
