const token = process.env.SUPABASE_ACCESS_TOKEN;
const projectRef = "lyxqlmmzjzkcjzcnbusp";

async function query(sql) {
  const res = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ query: sql })
  });
  const data = await res.json();
  if (res.status >= 400 || (Array.isArray(data) && data[0]?.error)) {
    console.error("SQL Error:", data);
    throw new Error(JSON.stringify(data));
  }
  return data;
}

async function run() {
  console.log("Beginning complete data update for Safe Guard Force...");

  // 1. Clean out stray UnitedAthletes sections from homepage_sections
  console.log("Cleaning and updating homepage_sections...");
  await query(`
    ALTER TABLE public.homepage_sections ADD COLUMN IF NOT EXISTS background_type text DEFAULT 'light';

    DELETE FROM public.homepage_sections 
    WHERE section_key IN ('hero', 'mission', 'about', 'what_we_do', 'events', 'sports', 'news', 'cta');

    -- Insert Safe Guard Force homepage sections if not already existing
    INSERT INTO public.homepage_sections (section_key, eyebrow, title, subtitle, description, image_url, button_text, button_url, items, is_visible, sort_order, background_type)
    VALUES
    ('trust_intro', 'Trusted Integrated Partner',
     'A Safer, Smarter\n& Better Managed\nTomorrow.',
     'SAFE Guard FORCE combines security, facility management, housekeeping, technical services, STP operations and investigation capabilities under one professional organization — delivering disciplined execution, accountable supervision and customized solutions for every premises.',
     'From residential societies and corporate towers to hospitals, hotels, factories and large events — we protect people, manage properties, maintain operations and ensure cleaner, healthier environments.',
     '/images/hero-mumbai-security.png', 'Discover Our Approach', '/about',
     '[{"a":"24/7","b":"Support"},{"a":"Pan-Mumbai","b":"Presence"},{"a":"One-Roof","b":"Solutions"}]'::jsonb,
     true, 10, 'light'),

    ('services', '12 Integrated Capabilities', 'Core Services',
     'One accountable partner for security, facility, hygiene, technical and investigation needs — customized to your environment.',
     '', '', 'View All Services', '/security-services', '[]'::jsonb, true, 20, 'light'),

    ('why_choose_us', 'Why Organizations Trust Us',
     'Why Organizations Trust\nSAFE Guard FORCE', '',
     'Structured supervision, verified manpower and continuous improvement — the reasons organizations rely on SAFE Guard FORCE.',
     '', '', '', '[]'::jsonb, true, 30, 'dark'),

    ('process', 'Our Process', 'How We Work',
     'Disciplined, transparent and operationally accountable — from assessment to continuous improvement.',
     '', '', '', '',
     '[{"n":"01","t":"Understand","d":"Understand property, risks and operational requirements."},{"n":"02","t":"Assess","d":"Conduct site assessment and identify service requirements."},{"n":"03","t":"Plan","d":"Develop customized manpower and operational plan."},{"n":"04","t":"Deploy","d":"Deploy trained personnel, supervisors and technical teams."},{"n":"05","t":"Monitor","d":"Inspections, reporting, quality checks and continuous improvement."}]'::jsonb,
     true, 40, 'light'),

    ('industries', 'Where We Serve', 'Industries We Serve', '', '', '/images/mumbai-business-district.png', 'Explore All Industries →', '/industries', '[]'::jsonb, true, 50, 'light'),

    ('personnel', 'Our Personnel',
     'Disciplined Personnel.\nProfessional Appearance.',
     'Every SAFE Guard FORCE guard is screened, trained and kitted for the premises they protect — from ceremonial bearing to operational vigilance. White gloves, beret with insignia, SAFE-branded belt and disciplined posture reflect the standards we enforce daily.',
     '', '/images/hero-mumbai-security.png', 'View Security Services', '/security-services',
     '["Uniform discipline & grooming checks","Verified antecedents & supervised deployment","Ceremonial and operational readiness","Client-facing courtesy with firm access control"]'::jsonb,
     true, 60, 'light'),

    ('stats_band', '', '', '', '', '', '', '', '[]'::jsonb, true, 70, 'dark'),

    ('final_cta', '', 'Your Property Deserves\nMore Than Basic Security.',
     'Partner with SAFE Guard FORCE for professional security, facility management, technical maintenance, STP operations and confidential investigation solutions.',
     '', '/images/mumbai-business-district.png', 'Request a Consultation →', '/contact', '[]'::jsonb, true, 80, 'image')
    ON CONFLICT (section_key) DO UPDATE SET
      eyebrow = EXCLUDED.eyebrow,
      title = EXCLUDED.title,
      subtitle = EXCLUDED.subtitle,
      description = EXCLUDED.description,
      image_url = CASE WHEN public.homepage_sections.image_url = '' OR public.homepage_sections.image_url IS NULL THEN EXCLUDED.image_url ELSE public.homepage_sections.image_url END,
      button_text = EXCLUDED.button_text,
      button_url = EXCLUDED.button_url,
      items = EXCLUDED.items,
      is_visible = true,
      sort_order = EXCLUDED.sort_order;
  `);

  // 2. Ensure contact_settings row exists
  console.log("Ensuring contact_settings exists...");
  await query(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM public.contact_settings LIMIT 1) THEN
        INSERT INTO public.contact_settings (
          contact_heading, contact_subtitle, form_heading, form_subtitle,
          hero_image_url, map_image_url,
          assistance_hours, assistance_note,
          phone_numbers, whatsapp_number, whatsapp_message, email,
          address, map_url, map_note,
          property_types, cta_text
        ) VALUES (
          'Let''s Make Your\nPremises Safer,\nCleaner & Better Managed.',
          'Reach our team for a free consultation, site assessment or confidential discussion. Mumbai-based, nationwide capability.',
          'Request a Consultation',
          'Tell us about your premises and service needs — we''ll respond promptly.',
          '/images/team-inspection.png',
          '/images/mumbai-business-district.png',
          '24/7 Professional Assistance',
          'Prompt response for enquiries and operational support.',
          ARRAY['9323581437', '9136645289'],
          '919323581437',
          'Hello SAFE Guard FORCE, I would like to discuss your services.',
          'info@safeguardforce.in',
          '{"line1":"C 517, Kailash Esplanade","line2":"Opp. Shreyash Cinema, LBS Marg","city":"Ghatkopar West, Mumbai","pincode":"400086"}'::jsonb,
          'https://maps.google.com/?q=C+517+Kailash+Esplanade+Ghatkopar+West+Mumbai',
          'Located opposite Shreyash Cinema on LBS Marg — accessible from Ghatkopar Metro and Eastern Express Highway.',
          ARRAY['Residential Society','Corporate Office','Commercial Complex / Mall','Hospital / Clinic','Hotel / Restaurant','School / Institution','Factory / Warehouse','Construction Site','Event / Venue','Other'],
          'Request a Consultation →'
        );
      END IF;
    END $$;
  `);

  // 3. Seed detail items for all remaining services so every service page has cards and admin can edit photos!
  console.log("Seeding service items for all services...");
  await query(`
    -- Housekeeping
    DELETE FROM public.service_items WHERE service_id = (SELECT id FROM public.services WHERE slug='housekeeping');
    INSERT INTO public.service_items (service_id, title, description, image_url, sort_order) VALUES
    ((SELECT id FROM public.services WHERE slug='housekeeping'), 'Daily Office & Society Cleaning', 'Comprehensive dusting, mopping, trash removal and common-area cleanliness routines.', '/images/service-housekeeping.png', 0),
    ((SELECT id FROM public.services WHERE slug='housekeeping'), 'Deep Floor Scrubbing & Polishing', 'Mechanical scrubbing, buffing and stain removal for lobbies, corridors and podiums.', '/images/housekeeping-landscaping.png', 1),
    ((SELECT id FROM public.services WHERE slug='housekeeping'), 'Washroom Hygiene & Sanitization', 'Continuous replenishment of consumables, odor control and sanitization cycles.', '/images/service-gardening.png', 2),
    ((SELECT id FROM public.services WHERE slug='housekeeping'), 'Waste Management & Segregation', 'Door-to-door collection, wet/dry segregation and BMC-compliant bin movement.', '/images/team-inspection.png', 3),
    ((SELECT id FROM public.services WHERE slug='housekeeping'), 'Glass & Facade Cleaning', 'Internal and accessible external glass cleaning with safety harnesses and gear.', '/images/mumbai-business-district.png', 4);

    -- Gardening & Landscaping
    DELETE FROM public.service_items WHERE service_id = (SELECT id FROM public.services WHERE slug='gardening-landscaping');
    INSERT INTO public.service_items (service_id, title, description, image_url, sort_order) VALUES
    ((SELECT id FROM public.services WHERE slug='gardening-landscaping'), 'Lawn Mowing & Edging', 'Regular cutting, boundary edging and weed control for lush green carpets.', '/images/service-gardening.png', 0),
    ((SELECT id FROM public.services WHERE slug='gardening-landscaping'), 'Planter & Podium Care', 'Soil aeration, organic manure application and watering for decorative planters.', '/images/housekeeping-landscaping.png', 1),
    ((SELECT id FROM public.services WHERE slug='gardening-landscaping'), 'Tree Pruning & Shrub Trimming', 'Aesthetic and safety pruning to remove hazardous overhangs and promote bush growth.', '/images/team-inspection.png', 2),
    ((SELECT id FROM public.services WHERE slug='gardening-landscaping'), 'Irrigation & Sprinkler Maintenance', 'Automated timer checks, sprinkler head adjustments and water conservation.', '/images/service-stp.png', 3);

    -- Fire & Safety
    DELETE FROM public.service_items WHERE service_id = (SELECT id FROM public.services WHERE slug='fire-safety');
    INSERT INTO public.service_items (service_id, title, description, image_url, sort_order) VALUES
    ((SELECT id FROM public.services WHERE slug='fire-safety'), 'Fire Marshals & Safety Officers', 'Certified personnel stationed on-site for immediate hazard vigilance and first response.', '/images/fire-event-safety.png', 0),
    ((SELECT id FROM public.services WHERE slug='fire-safety'), 'Fire Equipment Audits & Pressure Checks', 'Monthly pressure gauge audits, hose reel test runs and expiry tracking of extinguishers.', '/images/service-fire-safety.png', 1),
    ((SELECT id FROM public.services WHERE slug='fire-safety'), 'Evacuation Drills & Resident Training', 'Structured mock fire drills, exit clearway audits and emergency staircase awareness.', '/images/team-inspection.png', 2),
    ((SELECT id FROM public.services WHERE slug='fire-safety'), 'Hydrant & Smoke Detector Upkeep', 'Panel testing, detector clearing and coordination with specialized AMC agencies.', '/images/service-technical.png', 3);

    -- Dog Squad
    DELETE FROM public.service_items WHERE service_id = (SELECT id FROM public.services WHERE slug='dog-squad');
    INSERT INTO public.service_items (service_id, title, description, image_url, sort_order) VALUES
    ((SELECT id FROM public.services WHERE slug='dog-squad'), 'Trained Sniffer Canines', 'Certified German Shepherds and Labradors trained for scent tracking and alert cues.', '/images/canine-handler.png', 0),
    ((SELECT id FROM public.services WHERE slug='dog-squad'), 'Perimeter & Fence Patrols', 'Active boundary deterrence along dark corridors, basements and perimeter fences.', '/images/service-dog-squad.png', 1),
    ((SELECT id FROM public.services WHERE slug='dog-squad'), 'Gate & Entrance Screening', 'High-deterrence vehicle and baggage scent screening during sensitive events.', '/images/hero-mumbai-security.png', 2),
    ((SELECT id FROM public.services WHERE slug='dog-squad'), 'Certified Canine Handlers', 'Strictly trained handlers with humane handling discipline and crowd composure.', '/images/fire-event-safety.png', 3);

    -- Event Security
    DELETE FROM public.service_items WHERE service_id = (SELECT id FROM public.services WHERE slug='event-security');
    INSERT INTO public.service_items (service_id, title, description, image_url, sort_order) VALUES
    ((SELECT id FROM public.services WHERE slug='event-security'), 'Crowd Control & Queuing', 'Stanchion setup, ticket gate pacing and gentle yet firm crowd management.', '/images/service-event-security.png', 0),
    ((SELECT id FROM public.services WHERE slug='event-security'), 'Trained Bouncer Squads', 'Imposing, physically fit bouncers trained in verbal de-escalation and calm intervention.', '/images/fire-event-safety.png', 1),
    ((SELECT id FROM public.services WHERE slug='event-security'), 'VIP & Celebrity Protection', 'Discreet close-protection officers, green-room clearways and stage perimeter security.', '/images/hero-mumbai-security.png', 2),
    ((SELECT id FROM public.services WHERE slug='event-security'), 'Bag Screening & Metal Detectors', 'Door-frame metal detectors (DFMD), handheld scanners and frisking booths.', '/images/service-investigation.png', 3);

    -- Technical Maintenance
    DELETE FROM public.service_items WHERE service_id = (SELECT id FROM public.services WHERE slug='technical-maintenance');
    INSERT INTO public.service_items (service_id, title, description, image_url, sort_order) VALUES
    ((SELECT id FROM public.services WHERE slug='technical-maintenance'), 'Electrical Maintenance & DG Sets', 'Panel inspections, circuit load balancing, diesel generator switchover tests.', '/images/service-technical.png', 0),
    ((SELECT id FROM public.services WHERE slug='technical-maintenance'), 'Plumbing & Hydro-Pneumatic Pumps', 'Water pressure balancing, valve overhauls, leak detection and overhead tank cleaning.', '/images/service-stp.png', 1),
    ((SELECT id FROM public.services WHERE slug='technical-maintenance'), 'HVAC & Air Conditioning Plants', 'Filter wash, chiller upkeep, airflow balancing and cooling tower water chemical treatment.', '/images/technical-maintenance.png', 2),
    ((SELECT id FROM public.services WHERE slug='technical-maintenance'), 'Civil & Waterproofing Repairs', 'Masonry touch-ups, expansion joint sealing, compound wall and tile maintenance.', '/images/mumbai-business-district.png', 3),
    ((SELECT id FROM public.services WHERE slug='technical-maintenance'), 'Preventive Maintenance Schedules', 'Strict monthly and quarterly asset checklists logged into digital maintenance registers.', '/images/team-inspection.png', 4);

    -- Pest Control
    DELETE FROM public.service_items WHERE service_id = (SELECT id FROM public.services WHERE slug='pest-control');
    INSERT INTO public.service_items (service_id, title, description, image_url, sort_order) VALUES
    ((SELECT id FROM public.services WHERE slug='pest-control'), 'Mosquito & Fogging Treatments', 'Thermal smoke fogging of drains, basement sump areas and landscaped foliage.', '/images/service-pest-control.png', 0),
    ((SELECT id FROM public.services WHERE slug='pest-control'), 'Cockroach Herbal Gel Baits', 'Odorless food-grade gel baiting inside pantries, ducts and electrical junction boxes.', '/images/service-housekeeping.png', 1),
    ((SELECT id FROM public.services WHERE slug='pest-control'), 'Termite Treatment & Drilling', 'Subterranean chemical barriers, woodwork drilling and preventive perimeter protection.', '/images/housekeeping-landscaping.png', 2),
    ((SELECT id FROM public.services WHERE slug='pest-control'), 'Rodent Glue Traps & Bait Stations', 'Tamper-resistant bait stations along garbage rooms, basements and perimeter drains.', '/images/team-inspection.png', 3);

    -- Reception & Helpdesk
    DELETE FROM public.service_items WHERE service_id = (SELECT id FROM public.services WHERE slug='reception-helpdesk');
    INSERT INTO public.service_items (service_id, title, description, image_url, sort_order) VALUES
    ((SELECT id FROM public.services WHERE slug='reception-helpdesk'), 'Corporate Front-Office Receptionists', 'Courteous, bilingual front-desk executives with visitor entry management skills.', '/images/service-helpdesk.png', 0),
    ((SELECT id FROM public.services WHERE slug='reception-helpdesk'), 'Society Helpdesk & Ticket Coordinators', 'Centralized desk for recording resident complaints, dispatching technicians and tracking closures.', '/images/service-facility-manager.png', 1),
    ((SELECT id FROM public.services WHERE slug='reception-helpdesk'), 'Pantry & Cafeteria Support', 'Trained hospitality staff for conference room tea/coffee service and pantry sanitization.', '/images/service-housekeeping.png', 2),
    ((SELECT id FROM public.services WHERE slug='reception-helpdesk'), 'Mailroom & Courier Logistics', 'Accurate parcel logging, resident dispatch, OTP verification and inward register maintenance.', '/images/guard-visitor-control.png', 3);

    -- Detective Services
    DELETE FROM public.service_items WHERE service_id = (SELECT id FROM public.services WHERE slug='detective-services');
    INSERT INTO public.service_items (service_id, title, description, image_url, sort_order) VALUES
    ((SELECT id FROM public.services WHERE slug='detective-services'), 'Background & Antecedent Verification', 'Authentic identity, address, criminal record and educational verification through lawful channels.', '/images/investigation-consultation.png', 0),
    ((SELECT id FROM public.services WHERE slug='detective-services'), 'Employee Pre & Post Screening', 'Integrity verification for high-risk corporate hires, drivers and domestic support staff.', '/images/service-investigation.png', 1),
    ((SELECT id FROM public.services WHERE slug='detective-services'), 'Corporate Asset & Due Diligence', 'Discreet research on business partners, disputed property titles and vendor authenticity.', '/images/mumbai-business-district.png', 2),
    ((SELECT id FROM public.services WHERE slug='detective-services'), 'Lawful Surveillance & Tracking', 'Professional video and observational monitoring conducted within strict legal boundaries.', '/images/hero-mumbai-security.png', 3);

    -- STP Operations
    DELETE FROM public.service_items WHERE service_id = (SELECT id FROM public.services WHERE slug='stp-operations');
    INSERT INTO public.service_items (service_id, title, description, image_url, sort_order) VALUES
    ((SELECT id FROM public.services WHERE slug='stp-operations'), 'Biological & Chemical Process Monitoring', 'Continuous aeration check, MLSS monitoring and dissolved oxygen optimization.', '/images/stp-operations.png', 0),
    ((SELECT id FROM public.services WHERE slug='stp-operations'), 'Electromechanical Pumps & Blowers Upkeep', 'Bearing greasing, impeller clearing and standby pump rotation routines.', '/images/service-stp.png', 1),
    ((SELECT id FROM public.services WHERE slug='stp-operations'), 'Sludge Dewatering & Filter Press', 'Sludge pressing, polymer dosing and responsible disposal handling.', '/images/technical-maintenance.png', 2),
    ((SELECT id FROM public.services WHERE slug='stp-operations'), 'Treated Water Testing & MPCB Compliance', 'BOD, COD, pH and TSS testing logs maintained for society audits and pollution control boards.', '/images/team-inspection.png', 3);
  `);

  console.log("Seeding complete! All service items, homepage sections, and contact settings are active.");
}

run().catch(console.error);
