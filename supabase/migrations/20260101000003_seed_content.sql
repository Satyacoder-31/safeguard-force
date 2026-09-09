-- ============================================================================
-- Seed data — extracted verbatim from the existing hard-coded website.
-- This preserves the current content and imagery so the site looks identical
-- after migration. All image references point at existing /public/images
-- assets (they can later be re-pointed to Supabase Storage via Admin > Media).
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Site settings
-- ---------------------------------------------------------------------------
insert into public.site_settings (
  site_name, brand_name, tagline, logo_url, favicon_url,
  primary_phone, secondary_phone, email, whatsapp_number, whatsapp_message,
  address_line_1, address_line_2, city, state, pincode, country,
  google_maps_url, support_text, top_bar_text,
  footer_description, copyright_text
) values (
  'SAFE Guard FORCE',
  'Your Security. Our Priority.',
  'Your Security. Our Priority.',
  '/images/safelogo.png',
  '/images/safelogo.png',
  '9323581437',
  '9136645289',
  'info@safeguardforce.in',
  '919323581437',
  'Hello SAFE Guard FORCE, I would like to discuss your security/facility management services.',
  'C 517, Kailash Esplanade',
  'Opp. Shreyash Cinema, LBS Marg',
  'Ghatkopar West, Mumbai',
  'Maharashtra',
  '400086',
  'India',
  'https://maps.google.com/?q=C+517+Kailash+Esplanade+Ghatkopar+West+Mumbai',
  '24/7 Professional Assistance',
  'Mumbai • Nationwide Service Capability',
  'Integrated security, facility management, technical and investigation solutions. Professional, disciplined and reliable services for safer, cleaner and efficiently managed premises.',
  'SAFE Guard FORCE. All Rights Reserved.'
);

-- ---------------------------------------------------------------------------
-- Navigation: top-level items + Services dropdown children
-- ---------------------------------------------------------------------------
insert into public.navigation_items (label, href, parent_id, sort_order, is_active)
values
  ('Home', '/', null, 0, true),
  ('About', '/about', null, 1, true),
  ('Services', '/security-services', null, 2, true),
  ('Industries', '/industries', null, 3, true),
  ('Investigations', '/detective-services', null, 4, true),
  ('Contact', '/contact', null, 5, true);

insert into public.navigation_items (label, href, parent_id, sort_order, is_active)
values
  ('Security Services', '/security-services', (select id from public.navigation_items where label = 'Services' and parent_id is null), 0, true),
  ('Facility Management', '/facility-management', (select id from public.navigation_items where label = 'Services' and parent_id is null), 1, true),
  ('Housekeeping & Gardening', '/housekeeping', (select id from public.navigation_items where label = 'Services' and parent_id is null), 2, true),
  ('Fire, Safety & Dog Squad', '/fire-safety', (select id from public.navigation_items where label = 'Services' and parent_id is null), 3, true),
  ('Technical & STP Operations', '/technical-maintenance', (select id from public.navigation_items where label = 'Services' and parent_id is null), 4, true),
  ('Detective & Investigation', '/detective-services', (select id from public.navigation_items where label = 'Services' and parent_id is null), 5, true);

-- ---------------------------------------------------------------------------
-- Homepage sections (section_key drives rendering)
-- ---------------------------------------------------------------------------
insert into public.homepage_sections (section_key, eyebrow, title, subtitle, description, image_url, button_text, button_url, items, is_visible, sort_order, background_type) values
('trust_intro', 'Trusted Integrated Partner',
 'A Safer, Smarter
& Better Managed
Tomorrow.',
 'SAFE Guard FORCE combines security, facility management, housekeeping, technical services, STP operations and investigation capabilities under one professional organization — delivering disciplined execution, accountable supervision and customized solutions for every premises.',
 'From residential societies and corporate towers to hospitals, hotels, factories and large events — we protect people, manage properties, maintain operations and ensure cleaner, healthier environments.',
 '/images/hero-mumbai-security.png', 'Discover Our Approach', '/about',
 '[{"a":"24/7","b":"Support"},{"a":"Pan-Mumbai","b":"Presence"},{"a":"One-Roof","b":"Solutions"}]'::jsonb,
 true, 10, 'light'),

('services', '12 Integrated Capabilities', 'Core Services',
 'One accountable partner for security, facility, hygiene, technical and investigation needs — customized to your environment.',
 '', '', 'View All Services', '/security-services', '[]'::jsonb, true, 20, 'light'),

('why_choose_us', 'Why Organizations Trust Us',
 'Why Organizations Trust
SAFE Guard FORCE', '',
 'Structured supervision, verified manpower and continuous improvement — the reasons organizations rely on SAFE Guard FORCE.',
 '', '', '', '[]'::jsonb, true, 30, 'dark'),

('process', 'Our Process', 'How We Work',
 'Disciplined, transparent and operationally accountable — from assessment to continuous improvement.',
 '', '', '', '',
 '[{"n":"01","t":"Understand","d":"Understand property, risks and operational requirements."},{"n":"02","t":"Assess","d":"Conduct site assessment and identify service requirements."},{"n":"03","t":"Plan","d":"Develop customized manpower and operational plan."},{"n":"04","t":"Deploy","d":"Deploy trained personnel, supervisors and technical teams."},{"n":"05","t":"Monitor","d":"Inspections, reporting, quality checks and continuous improvement."}]'::jsonb,
 true, 40, 'light'),

('industries', 'Where We Serve', 'Industries We Serve', '', '', '', 'Explore All Industries →', '/industries', '[]'::jsonb, true, 50, 'light'),

('personnel', 'Our Personnel',
 'Disciplined Personnel.
Professional Appearance.',
 'Every SAFE Guard FORCE guard is screened, trained and kitted for the premises they protect — from ceremonial bearing to operational vigilance. White gloves, beret with insignia, SAFE-branded belt and disciplined posture reflect the standards we enforce daily.',
 '', '/images/hero-mumbai-security.png', 'View Security Services', '/security-services',
 '["Uniform discipline & grooming checks","Verified antecedents & supervised deployment","Ceremonial and operational readiness","Client-facing courtesy with firm access control"]'::jsonb,
 true, 60, 'light'),

('stats_band', '', '', '', '', '', '', '', '[]'::jsonb, true, 70, 'dark'),

('final_cta', '', 'Your Property Deserves
More Than Basic Security.',
 'Partner with SAFE Guard FORCE for professional security, facility management, technical maintenance, STP operations and confidential investigation solutions.',
 '', '/images/mumbai-business-district.png', 'Request a Consultation →', '/contact', '[]'::jsonb, true, 80, 'image');

-- ---------------------------------------------------------------------------
-- Hero slides (from HeroSlideshow + current hero copy)
-- ---------------------------------------------------------------------------
insert into public.hero_slides (title, highlighted_title, description, image_url, alt_text, button_text, button_url, phone_button_text, phone_number, sort_order, is_active, duration_ms) values
('SECURITY', 'THAT PROTECTS.',
 'Professional security, facility management, technical maintenance, STP operations and confidential investigation solutions designed for safer, cleaner and efficiently managed premises.',
 '/images/hero-mumbai-security.png', 'SAFE Guard FORCE trained security personnel',
 'Get a Free Consultation', '/contact', 'Call 9323581437', '9323581437', 0, true, 5000),
('SERVICES', 'THAT PERFORM.',
 'Professional security, facility management, technical maintenance, STP operations and confidential investigation solutions designed for safer, cleaner and efficiently managed premises.',
 '/images/mumbai-business-district.png', 'Premium corporate building entrance with security',
 'Get a Free Consultation', '/contact', 'Call 9323581437', '9323581437', 1, true, 5000),
('SECURITY', 'THAT PROTECTS.',
 'Professional security, facility management, technical maintenance, STP operations and confidential investigation solutions designed for safer, cleaner and efficiently managed premises.',
 '/images/team-inspection.png', 'Security personnel monitoring CCTV',
 'Get a Free Consultation', '/contact', 'Call 9323581437', '9323581437', 2, true, 5000),
('SERVICES', 'THAT PERFORM.',
 'Professional security, facility management, technical maintenance, STP operations and confidential investigation solutions designed for safer, cleaner and efficiently managed premises.',
 '/images/team-inspection.png', 'Facility management team inspection',
 'Get a Free Consultation', '/contact', 'Call 9323581437', '9323581437', 3, true, 5000),
('SECURITY', 'THAT PROTECTS.',
 'Professional security, facility management, technical maintenance, STP operations and confidential investigation solutions designed for safer, cleaner and efficiently managed premises.',
 '/images/housekeeping-landscaping.png', 'Professional housekeeping team',
 'Get a Free Consultation', '/contact', 'Call 9323581437', '9323581437', 4, true, 5000);

-- ---------------------------------------------------------------------------
-- Services (12, slugs map to existing public routes)
-- ---------------------------------------------------------------------------
insert into public.services (name, slug, short_description, full_description, eyebrow, hero_title, hero_subtitle, hero_image_url, card_image_url, icon_name, meta_title, meta_description, sort_order, is_featured, is_active) values
('Security Services', 'security-services',
 'Trained & verified guards, supervisors, officers, bouncers, access control and patrolling.',
 'Comprehensive manned guarding, supervision and technology-supported security for residential, corporate, industrial and institutional premises.',
 'Security Services', 'Professional Security.
Proactive Protection.',
 'Comprehensive manned guarding, supervision and technology-supported security for residential, corporate, industrial and institutional premises.',
 '/images/hero-mumbai-security.png', '/images/service-security-guard.png', 'shield',
 'Security Services — SAFE Guard FORCE',
 'Trained, verified security guards, supervisors, officers, access control, patrolling and CCTV monitoring in Mumbai.', 0, true, true),

('Facility Management', 'facility-management',
 'Society & facility managers, supervisors, inspections and vendor coordination.',
 'End-to-end operations for societies, corporate offices, commercial complexes and institutions — people, property, operations, quality and reporting.',
 'Facility Management', 'Complete Facility
Management. One
Responsible Partner.',
 'End-to-end operations for societies, corporate offices, commercial complexes and institutions — people, property, operations, quality and reporting.',
 '/images/team-inspection.png', '/images/service-facility-manager.png', 'building',
 'Facility Management — SAFE Guard FORCE',
 'Facility and society managers, supervisors, quality control, vendor coordination and site inspections in Mumbai.', 1, true, true),

('Housekeeping', 'housekeeping',
 'Cleaning, sanitization, waste management and hygiene maintenance.',
 'Professional cleaning, gardening and pest-control services that elevate hygiene, appearance and occupant experience across residential, commercial and institutional premises.',
 'Housekeeping, Gardening & Hygiene', 'Cleaner Spaces.
Healthier Environments.',
 'Professional cleaning, gardening and pest-control services that elevate hygiene, appearance and occupant experience across residential, commercial and institutional premises.',
 '/images/housekeeping-landscaping.png', '/images/service-housekeeping.png', 'sparkles',
 'Housekeeping, Gardening & Hygiene — SAFE Guard FORCE',
 'Housekeeping, deep cleaning, gardening, landscaping and pest control services in Mumbai.', 2, true, true),

('Gardening & Landscaping', 'gardening-landscaping',
 'Lawn, garden, irrigation, pruning and landscape maintenance.',
 'Gardeners and landscaping support for lawns, planters, terraces, podium gardens and common-area greenery — irrigation, health and aesthetics managed.',
 'Gardening & Landscaping', 'Green Spaces,
Beautifully Maintained.',
 'Lawn, garden, irrigation, pruning and landscape maintenance for societies, offices and institutions.',
 '/images/housekeeping-landscaping.png', '/images/service-gardening.png', 'leaf',
 'Gardening & Landscaping — SAFE Guard FORCE',
 'Gardening and landscaping services: lawns, planters, irrigation, pruning and seasonal maintenance in Mumbai.', 3, true, true),

('Fire & Safety', 'fire-safety',
 'Fire marshals, inspections, evacuation planning and safety training.',
 'Specialized safety, canine and event-security capabilities for proactive risk mitigation and large-gathering management.',
 'Fire • Safety • Dog Squad • Events', 'Prepared for
Every Situation.',
 'Specialized safety, canine and event-security capabilities for proactive risk mitigation and large-gathering management.',
 '/images/fire-event-safety.png', '/images/service-fire-safety.png', 'flame',
 'Fire, Safety, Dog Squad & Event Security — SAFE Guard FORCE',
 'Fire marshals, equipment inspections, evacuation planning, dog squad and event security services in Mumbai.', 4, true, true),

('Dog Squad', 'dog-squad',
 'Trained sniffer dogs & handlers for patrol and detection.',
 'Trained canine teams with certified handlers for entrance monitoring, perimeter patrols and detection support.',
 'Dog Squad Services', 'Trained Canine
Security.',
 'Trained sniffer dogs with certified handlers for entrance monitoring, perimeter patrols and event augmentation.',
 '/images/canine-handler.png', '/images/service-dog-squad.png', 'paw',
 'Dog Squad Services — SAFE Guard FORCE',
 'Trained sniffer dogs and certified handlers for patrol, detection and event security in Mumbai.', 5, true, true),

('Event Security', 'event-security',
 'Crowd control, VIP protection and venue entry management.',
 'Coverage for weddings, corporate events, exhibitions, clubs and private functions — from guest screening to stage and green-room protection.',
 'Bouncer & Event Security', 'Disciplined Crowd
& Venue Control.',
 'Bouncers, crowd control, entry management and discreet VIP protection for events of every scale.',
 '/images/fire-event-safety.png', '/images/service-event-security.png', 'users',
 'Event Security & Bouncers — SAFE Guard FORCE',
 'Bouncers, crowd control, VIP protection and venue security for events, weddings and exhibitions in Mumbai.', 6, true, true),

('Technical Maintenance', 'technical-maintenance',
 'Electrical, plumbing, HVAC, civil and infrastructure support.',
 'Electrical, plumbing, HVAC, civil and STP operations for uninterrupted, compliant and cost-efficient property performance.',
 'Technical Maintenance & STP', 'Technical Expertise
Behind Efficient
Operations.',
 'Electrical, plumbing, HVAC, civil and STP operations for uninterrupted, compliant and cost-efficient property performance.',
 '/images/technical-maintenance.png', '/images/service-technical.png', 'wrench',
 'Technical Maintenance & STP Operations — SAFE Guard FORCE',
 'Electrical, plumbing, HVAC, civil maintenance and STP operations in Mumbai.', 7, true, true),

('Pest Control', 'pest-control',
 'Mosquito, termite, cockroach and rodent management.',
 'Scheduled and on-call pest-control services with safe, approved methods and preventive hygiene practices.',
 'Pest Control & Hygiene', 'Preventive Hygiene
& Pest Management.',
 'Scheduled and on-call pest-control services with safe, approved methods and preventive hygiene practices.',
 '/images/housekeeping-landscaping.png', '/images/service-pest-control.png', 'bug',
 'Pest Control — SAFE Guard FORCE',
 'Mosquito, termite, cockroach and rodent control with preventive hygiene audits in Mumbai.', 8, true, true),

('Reception & Helpdesk', 'reception-helpdesk',
 'Receptionists, helpdesk, pantry and office support staff.',
 'Front-office receptionists, helpdesk staff, pantry and office support for corporate environments.',
 'Reception & Helpdesk', 'Front-Office
Excellence.',
 'Receptionists, helpdesk, pantry and office support staff for productive workplaces.',
 '/images/service-helpdesk.png', '/images/service-helpdesk.png', 'headset',
 'Reception & Helpdesk Staffing — SAFE Guard FORCE',
 'Receptionists, helpdesk, pantry and office support staff in Mumbai.', 9, true, true),

('Detective Services', 'detective-services',
 'Confidential investigations, verification and surveillance.',
 'Discreet, lawful and professionally conducted verification, surveillance and corporate investigations — with strict confidentiality.',
 'Confidential Investigation', 'Confidential
Information.
Professional
Investigation.',
 'Discreet, lawful and professionally conducted verification, surveillance and corporate investigations — with strict confidentiality.',
 '/images/investigation-consultation.png', '/images/service-investigation.png', 'search',
 'Detective & Investigation Services — SAFE Guard FORCE',
 'Confidential background verification, surveillance and corporate investigations conducted lawfully in Mumbai.', 10, true, true),

('STP Operations', 'stp-operations',
 'Sewage treatment plant operation, maintenance & compliance.',
 'Compliant, well-documented STP operations covering treatment monitoring, electromechanical upkeep, sludge handling and water-quality discipline — aligned to MPCB / environmental norms and society requirements.',
 'STP Operation & Maintenance', 'Professional Sewage
Treatment Operations.',
 'Compliant, well-documented STP operations covering treatment monitoring, electromechanical upkeep, sludge handling and water-quality discipline.',
 '/images/stp-operations.png', '/images/service-stp.png', 'droplet',
 'STP Operation & Maintenance — SAFE Guard FORCE',
 'Sewage treatment plant operation, maintenance and MPCB compliance support in Mumbai.', 11, true, true);

-- ---------------------------------------------------------------------------
-- Service items (per-service detail cards)
-- ---------------------------------------------------------------------------
-- Security Services
insert into public.service_items (service_id, title, description, image_url, sort_order) values
((select id from public.services where slug='security-services'), 'Security Guard Services', 'Trained, verified and uniformed guards for access control, perimeter protection and asset safety.', '/images/service-security-guard.png', 0),
((select id from public.services where slug='security-services'), 'Security Supervisors', 'On-site supervision, shift management, reporting and discipline enforcement.', '/images/service-facility-manager.png', 1),
((select id from public.services where slug='security-services'), 'Security Officers', 'Experienced officers for large premises, escalation handling and client liaison.', '/images/service-investigation.png', 2),
((select id from public.services where slug='security-services'), 'Access Control', 'Gate management, biometric/RFID coordination and authorized-entry protocols.', '/images/service-helpdesk.png', 3),
((select id from public.services where slug='security-services'), 'Visitor Management', 'Verification, visitor passes, logs and escort protocols.', '/images/guard-visitor-control.png', 4),
((select id from public.services where slug='security-services'), 'Vehicle Verification', 'Entry/exit logging, parking discipline and anti-tailgating vigilance.', '/images/mumbai-business-district.png', 5),
((select id from public.services where slug='security-services'), 'Patrolling', 'Foot and perimeter patrols with scheduled and random checks.', '/images/service-dog-squad.png', 6),
((select id from public.services where slug='security-services'), 'CCTV Monitoring', 'Control-room vigilance, incident flagging and evidence preservation.', '/images/team-inspection.png', 7);

-- Facility Management
insert into public.service_items (service_id, title, description, image_url, sort_order) values
((select id from public.services where slug='facility-management'), 'Facility Managers', 'Day-to-day operations, budgeting support and stakeholder reporting.', '', 0),
((select id from public.services where slug='facility-management'), 'Society Managers', 'Resident liaison, AGM support, compliance and documentation.', '', 1),
((select id from public.services where slug='facility-management'), 'Supervisors', 'Shift supervision, checklist enforcement and on-site discipline.', '', 2),
((select id from public.services where slug='facility-management'), 'Daily Operations', 'Opening/closing, utilities, common-area upkeep.', '', 3),
((select id from public.services where slug='facility-management'), 'Staff Administration', 'Attendance, deployment, training and grooming.', '', 4),
((select id from public.services where slug='facility-management'), 'Quality Control', 'SLA checks, audits and corrective actions.', '', 5),
((select id from public.services where slug='facility-management'), 'Complaint Resolution', 'Ticketing, escalation matrix and closure reporting.', '', 6),
((select id from public.services where slug='facility-management'), 'Vendor Coordination', 'AMC, procurement and service follow-ups.', '', 7),
((select id from public.services where slug='facility-management'), 'Resident Support', 'Helpdesk, move-in/out and facility bookings.', '', 8),
((select id from public.services where slug='facility-management'), 'Site Inspections', 'Scheduled inspections with photo and written reports.', '', 9);

-- Housekeeping
insert into public.service_items (service_id, title, description, image_url, sort_order) values
((select id from public.services where slug='housekeeping'), 'Daily Cleaning', 'Lobbies, corridors, restrooms, pantries, basements and open areas on disciplined checklists.', '', 0),
((select id from public.services where slug='housekeeping'), 'Deep Cleaning & Sanitization', 'Periodic deep cleaning and sanitization drives.', '', 1),
((select id from public.services where slug='housekeeping'), 'Waste Segregation & Disposal', 'Responsible waste management and disposal discipline.', '', 2),
((select id from public.services where slug='housekeeping'), 'Restroom Hygiene', 'Continuous restroom upkeep and consumables management.', '', 3),
((select id from public.services where slug='housekeeping'), 'Floor Scrubbing & Polishing', 'Machine scrubbing, polishing and maintenance.', '', 4),
((select id from public.services where slug='housekeeping'), 'Glass & Facade Coordination', 'Glass cleaning and facade upkeep coordination.', '', 5);

-- Gardening
insert into public.service_items (service_id, title, description, image_url, sort_order) values
((select id from public.services where slug='gardening-landscaping'), 'Lawn Mowing & Edging', 'Regular mowing, edging and lawn health.', '', 0),
((select id from public.services where slug='gardening-landscaping'), 'Plant & Planter Maintenance', 'Care for planters, terraces and podium gardens.', '', 1),
((select id from public.services where slug='gardening-landscaping'), 'Pruning & Trimming', 'Scheduled pruning and trimming for shape and health.', '', 2),
((select id from public.services where slug='gardening-landscaping'), 'Fertilization', 'Soil health and fertilization schedules.', '', 3),
((select id from public.services where slug='gardening-landscaping'), 'Irrigation & Watering Schedules', 'Irrigation management and watering discipline.', '', 4),
((select id from public.services where slug='gardening-landscaping'), 'Seasonal Landscaping', 'Seasonal planting and landscape refresh.', '', 5);

-- Fire & Safety
insert into public.service_items (service_id, title, description, image_url, sort_order) values
((select id from public.services where slug='fire-safety'), 'Fire Marshals & Safety Officers', 'Trained fire marshals and safety officers on site.', '', 0),
((select id from public.services where slug='fire-safety'), 'Fire Equipment Inspection', 'Fire equipment inspection and readiness checks.', '', 1),
((select id from public.services where slug='fire-safety'), 'Evacuation Planning', 'Evacuation planning and signage review.', '', 2),
((select id from public.services where slug='fire-safety'), 'Fire Drills & Staff Training', 'Regular drills and staff safety training.', '', 3),
((select id from public.services where slug='fire-safety'), 'Safety Audits & Emergency Response', 'Safety audits and emergency response coordination.', '', 4);

-- Dog Squad
insert into public.service_items (service_id, title, description, image_url, sort_order) values
((select id from public.services where slug='dog-squad'), 'Trained Sniffer Dogs', 'Certified dogs with professional handlers.', '', 0),
((select id from public.services where slug='dog-squad'), 'Entrance Monitoring', 'Entrance monitoring and deterrence presence.', '', 1),
((select id from public.services where slug='dog-squad'), 'Perimeter Patrols', 'Canine-assisted perimeter patrols.', '', 2),
((select id from public.services where slug='dog-squad'), 'Suspicious-Object Detection', 'Detection support for suspicious objects.', '', 3),
((select id from public.services where slug='dog-squad'), 'Event & VIP Augmentation', 'Event and VIP security augmentation.', '', 4);

-- Event Security
insert into public.service_items (service_id, title, description, image_url, sort_order) values
((select id from public.services where slug='event-security'), 'Crowd Control', 'Crowd flow and queue discipline management.', '', 0),
((select id from public.services where slug='event-security'), 'Entry Management', 'Guest screening and entry management.', '', 1),
((select id from public.services where slug='event-security'), 'Venue Security', 'Stage, green-room and venue protection.', '', 2),
((select id from public.services where slug='event-security'), 'VIP Protection', 'Discreet VIP and celebrity protection.', '', 3),
((select id from public.services where slug='event-security'), 'Bouncer Services', 'Disciplined bouncers with conflict de-escalation training.', '', 4);

-- Technical Maintenance
insert into public.service_items (service_id, title, description, image_url, sort_order) values
((select id from public.services where slug='technical-maintenance'), 'Electrical Maintenance', 'Panels, lighting, DG sets, cabling and preventive checks.', '/images/service-technical.png', 0),
((select id from public.services where slug='technical-maintenance'), 'Plumbing', 'Water supply, drainage, pumps and leakage management.', '/images/service-stp.png', 1),
((select id from public.services where slug='technical-maintenance'), 'HVAC', 'AC plants, AHUs, ventilation and climate control upkeep.', '/images/technical-maintenance.png', 2),
((select id from public.services where slug='technical-maintenance'), 'Civil Maintenance', 'Masonry, painting, waterproofing and structural upkeep.', '/images/mumbai-business-district.png', 3),
((select id from public.services where slug='technical-maintenance'), 'Preventive Maintenance', 'Scheduled checklists to avoid breakdowns and extend life.', '/images/team-inspection.png', 4),
((select id from public.services where slug='technical-maintenance'), 'Infrastructure Support', 'Common-area systems, lifts liaison and utility rooms.', '/images/service-facility-manager.png', 5);

-- STP Operations
insert into public.service_items (service_id, title, description, image_url, sort_order) values
((select id from public.services where slug='stp-operations'), 'Treatment Process Monitoring', 'Continuous treatment process monitoring.', '', 0),
((select id from public.services where slug='stp-operations'), 'Pumps & Blowers Upkeep', 'Electromechanical upkeep of pumps and blowers.', '', 1),
((select id from public.services where slug='stp-operations'), 'Electrical Systems & Panels', 'STP electrical systems and panel maintenance.', '', 2),
((select id from public.services where slug='stp-operations'), 'Sludge Management', 'Safe and compliant sludge handling.', '', 3),
((select id from public.services where slug='stp-operations'), 'Water Quality Testing', 'Regular water quality testing and records.', '', 4),
((select id from public.services where slug='stp-operations'), 'Preventive Maintenance', 'Preventive maintenance schedules.', '', 5),
((select id from public.services where slug='stp-operations'), 'Record Keeping & Logbooks', 'Logbooks and testing records for audits.', '', 6),
((select id from public.services where slug='stp-operations'), 'Compliance Support', 'MPCB / environmental norms compliance support.', '', 7);

-- Pest Control
insert into public.service_items (service_id, title, description, image_url, sort_order) values
((select id from public.services where slug='pest-control'), 'Mosquito Control', 'Scheduled mosquito control treatments.', '', 0),
((select id from public.services where slug='pest-control'), 'Termite Control', 'Termite treatment and prevention.', '', 1),
((select id from public.services where slug='pest-control'), 'Cockroach Control', 'Cockroach gel and spray treatments.', '', 2),
((select id from public.services where slug='pest-control'), 'Rodent Control', 'Rodent management and proofing.', '', 3),
((select id from public.services where slug='pest-control'), 'Drain & Garbage Area Treatment', 'Drain and garbage area treatment.', '', 4),
((select id from public.services where slug='pest-control'), 'Preventive Hygiene Audits', 'Preventive hygiene audits and reporting.', '', 5);

-- Reception & Helpdesk
insert into public.service_items (service_id, title, description, image_url, sort_order) values
((select id from public.services where slug='reception-helpdesk'), 'Receptionists', 'Professional, guest-facing reception staff.', '', 0),
((select id from public.services where slug='reception-helpdesk'), 'Helpdesk Staff', 'Helpdesk and ticket coordination.', '', 1),
((select id from public.services where slug='reception-helpdesk'), 'Pantry Staff', 'Trained pantry and cafeteria support.', '', 2),
((select id from public.services where slug='reception-helpdesk'), 'Office Support', 'Office support and front-of-house staffing.', '', 3);

-- Detective Services
insert into public.service_items (service_id, title, description, image_url, sort_order) values
((select id from public.services where slug='detective-services'), 'Background Verification', 'Identity, address, education and reference checks through lawful sources.', '', 0),
((select id from public.services where slug='detective-services'), 'Employee Verification', 'Pre- and post-employment screening for corporate and domestic staff.', '', 1),
((select id from public.services where slug='detective-services'), 'Matrimonial Investigations', 'Discreet verification conducted with sensitivity and confidentiality.', '', 2),
((select id from public.services where slug='detective-services'), 'Surveillance', 'Lawful observation and reporting — no illegal tracking or intrusion.', '', 3),
((select id from public.services where slug='detective-services'), 'Missing-Person Investigations', 'Information gathering and coordination within legal boundaries.', '', 4),
((select id from public.services where slug='detective-services'), 'Fraud Detection', 'Document, transaction and activity review for anomalies.', '', 5),
((select id from public.services where slug='detective-services'), 'Corporate Investigations', 'Internal matters, leakage and breach inquiries — lawful methods only.', '', 6),
((select id from public.services where slug='detective-services'), 'Asset Verification', 'Ownership and asset information via lawful public and provided sources.', '', 7),
((select id from public.services where slug='detective-services'), 'Due Diligence', 'Partner, vendor and investment background research.', '', 8),
((select id from public.services where slug='detective-services'), 'Information Gathering', 'Focused, lawful collection and verification of information.', '', 9);

-- ---------------------------------------------------------------------------
-- Industries (12 with points)
-- ---------------------------------------------------------------------------
insert into public.industries (name, slug, short_description, description, image_url, points, sort_order, is_featured, is_active) values
('Residential Societies', 'residential-societies', 'Security, housekeeping, facility management, gardening, STP and support staff for harmonious living.', 'Gate & visitor control, housekeeping, gardening, facility and STP operations.', '/images/service-facility-manager.png', '["Gate & visitor control","Housekeeping & gardening","Facility & STP ops"]', 0, true, true),
('Corporate Offices', 'corporate-offices', 'Reception, security, housekeeping and technical support for productive workplaces.', 'Front-office, access and AMC coordination for corporate campuses.', '/images/service-helpdesk.png', '["Front-office & helpdesk","Access & CCTV","AMC coordination"]', 1, true, true),
('Commercial Complexes', 'commercial-complexes', 'High-footfall protocols for lobbies, parking and common areas.', 'Visitor management, parking discipline and technical upkeep for commercial centers.', '/images/service-event-security.png', '["Visitor management","Parking discipline","Technical upkeep"]', 2, true, true),
('Malls', 'malls', 'Crowd management, asset protection and hygiene at scale.', 'Crowd management, lost-and-found liaison and emergency drills for malls.', '/images/mumbai-business-district.png', '["Crowd & queue","Lost-and-found liaison","Emergency drills"]', 3, true, true),
('Hospitals', 'hospitals', 'Sensitive, hygienic and disciplined operations for healthcare.', 'Infection-control cleaning, gate and ward security, and support staff for hospitals.', '/images/service-housekeeping.png', '["Infection-control cleaning","Gate & ward security","Support staff"]', 4, true, true),
('Hotels', 'hotels', 'Guest-facing excellence in security, housekeeping and maintenance.', 'Housekeeping, luggage and gate handling, and technical rooms for hotels.', '/images/hero-mumbai-security.png', '["Housekeeping","Luggage & gate","Technical rooms"]', 5, true, true),
('Schools', 'schools', 'Child-safe, vigilant and clean campuses.', 'ID and visitor checks, patrols and CCTV, and hygiene for schools.', '/images/team-inspection.png', '["ID & visitor checks","Patrols & CCTV","Hygiene"]', 6, true, true),
('Factories', 'factories', 'Perimeter, material and workforce security with technical support.', 'Material gate, shift supervision and safety audits for factories.', '/images/service-technical.png', '["Material gate","Shift supervision","Safety audits"]', 7, true, true),
('Warehouses', 'warehouses', 'Inventory protection and dock discipline.', 'Perimeter and CCTV, inward/outward logs and night patrols for warehouses.', '/images/service-stp.png', '["Perimeter & CCTV","Inward/outward logs","Night patrols"]', 8, true, true),
('Construction Sites', 'construction-sites', 'Overnight material, equipment and labour management.', 'Material watch, labour verification and equipment logs for construction sites.', '/images/technical-maintenance.png', '["Material watch","Labour verification","Equipment logs"]', 9, true, true),
('Events', 'events', 'Bouncers, crowd control and discreet VIP protection.', 'Entry and stage management, crowd flow and green-room protection for events.', '/images/fire-event-safety.png', '["Entry & stage","Crowd flow","Green-room"]', 10, true, true),
('Institutions', 'institutions', 'Customized integrated solutions for any premises type.', 'Assessment first, custom SOPs and one accountable partner for institutions.', '/images/hospital-security.png', '["Assessment first","Custom SOPs","One partner"]', 11, true, true);

-- ---------------------------------------------------------------------------
-- About content
-- ---------------------------------------------------------------------------
insert into public.about_content (
  page_title, eyebrow, hero_subtitle, hero_image_url,
  who_we_are_heading, who_we_are_description, who_we_are_secondary, who_we_are_image_url,
  mission_title, mission_description, vision_title, vision_description,
  commitment_title, commitment_description,
  management_heading, management_checklist,
  cta_text, cta_url, meta_title, meta_description
) values (
  'Built Around Safety.
Driven by Professionalism.',
  'About SAFE Guard FORCE',
  'An integrated security, facility, technical and investigation organization delivering safer, cleaner and efficiently managed premises across Mumbai.',
  '/images/team-inspection.png',
  'Integrated Services. One Accountable Partner.',
  'SAFE Guard FORCE provides integrated security, facility management, housekeeping, gardening, technical maintenance, STP operations, fire & safety and confidential investigation services. We combine disciplined manpower, structured supervision and operational reporting so every property receives consistent, professional coverage.',
  'Headquartered at C 517, Kailash Esplanade, Ghatkopar West, Mumbai, we serve residential societies, corporate offices, commercial complexes, hospitals, hotels, schools, factories, warehouses and event venues with customized manpower and operational plans.',
  '/images/hero-mumbai-security.png',
  'Our Mission',
  'To provide reliable, disciplined and professional services that help organizations maintain safer, cleaner and efficiently managed premises.',
  'Our Vision',
  'To become a trusted integrated security and facility-management partner for organizations across India.',
  'Our Commitment',
  'Professional conduct, verified personnel, regular supervision and customized solutions — every site, every day.',
  'Structured Operations. Measurable Quality.',
  '["Regular site inspections & audits","Personnel supervision & attendance control","Quality checks & SLA reporting","Complaint resolution & escalation matrix","Vendor coordination & AMC oversight","Preventive maintenance scheduling"]'::jsonb,
  'Discuss Your Requirements', '/contact',
  'About Us — SAFE Guard FORCE',
  'Integrated security, facility, technical and investigation organization delivering safer, cleaner and efficiently managed premises across Mumbai.'
);

-- ---------------------------------------------------------------------------
-- Values
-- ---------------------------------------------------------------------------
insert into public.values (title, description, icon_name, sort_order, is_active) values
('Integrity', 'Honest, ethical and transparent operations.', 'shield', 0, true),
('Discipline', 'Uniformed, punctual and procedure-driven teams.', 'check', 1, true),
('Professionalism', 'Trained manpower with clear SOPs.', 'star', 2, true),
('Accountability', 'Supervised execution with reporting.', 'clipboard', 3, true),
('Confidentiality', 'Discreet handling of sensitive matters.', 'lock', 4, true),
('Customer Satisfaction', 'Responsive support and resolution.', 'smile', 5, true),
('Safety', 'Proactive risk identification & prevention.', 'flame', 6, true),
('Environmental Responsibility', 'Hygiene, STP and sustainable ops.', 'leaf', 7, true);

-- ---------------------------------------------------------------------------
-- Contact settings
-- ---------------------------------------------------------------------------
insert into public.contact_settings (
  contact_heading, contact_subtitle, form_heading, form_subtitle,
  assistance_hours, assistance_note,
  phone_numbers, whatsapp_number, whatsapp_message, email,
  address, map_url, map_note,
  property_types, cta_text
) values (
  'Let''s Make Your
Premises Safer,
Cleaner & Better Managed.',
  'Reach our team for a free consultation, site assessment or confidential discussion. Mumbai-based, nationwide capability.',
  'Request a Consultation',
  'Tell us about your premises and service needs — we''ll respond promptly.',
  '24/7 Professional Assistance',
  'Prompt response for enquiries and operational support.',
  '["9323581437","9136645289"]'::jsonb,
  '919323581437',
  'Hello SAFE Guard FORCE, I would like to discuss your services.',
  'info@safeguardforce.in',
  '{"line1":"C 517, Kailash Esplanade","line2":"Opp. Shreyash Cinema, LBS Marg","city":"Ghatkopar West, Mumbai","pincode":"400086"}'::jsonb,
  'https://maps.google.com/?q=C+517+Kailash+Esplanade+Ghatkopar+West+Mumbai',
  'Located opposite Shreyash Cinema on LBS Marg — accessible from Ghatkopar Metro and Eastern Express Highway.',
  '["Residential Society","Corporate Office","Commercial Complex / Mall","Hospital / Clinic","Hotel / Restaurant","School / Institution","Factory / Warehouse","Construction Site","Event / Venue","Other"]'::jsonb,
  'Request a Consultation →'
);

-- ---------------------------------------------------------------------------
-- Statistics (context: hero_bar | trust | stats_band)
-- ---------------------------------------------------------------------------
insert into public.statistics (label, value, description, context, sort_order, is_active) values
('Professional Assistance', '24/7', '', 'hero_bar', 0, true),
('Verified Personnel', 'Trained', '', 'hero_bar', 1, true),
('Service Solutions', 'Integrated', '', 'hero_bar', 2, true),
('Management System', 'Professional', '', 'hero_bar', 3, true),
('Integrated Service Categories', '12+', '', 'stats_band', 4, true),
('Customized Service Approach', '100%', '', 'stats_band', 5, true),
('Security & Facility Solutions', '360°', '', 'stats_band', 6, true);

-- ---------------------------------------------------------------------------
-- why_choose_us cards (homepage section items)
-- ---------------------------------------------------------------------------
update public.homepage_sections
set items = '[
  {"title":"Trained & Verified Personnel","desc":"Screened, trained and supervised manpower aligned to your premises and risks."},
  {"title":"Experienced Management","desc":"Structured supervision with regular inspections and reporting discipline."},
  {"title":"24/7 Assistance","desc":"Prompt response and round-the-clock operational support."},
  {"title":"Regular Site Inspections","desc":"Quality checks, audits and continuous improvement cycles."},
  {"title":"Customized Packages","desc":"Solutions tailored to property type, occupancy and operational needs."},
  {"title":"Integrated Under One Roof","desc":"Security, facility, technical, STP and investigation — one accountable partner."}
]'::jsonb
where section_key = 'why_choose_us';
