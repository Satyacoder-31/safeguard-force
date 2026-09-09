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

async function seed() {
  console.log("Checking if services exist...");
  const check = await query("SELECT count(*) as count FROM public.services;");
  if (parseInt(check[0].count, 10) > 0) {
    console.log("Services already exist, count:", check[0].count);
    return;
  }

  console.log("Seeding services, items, industries, and settings...");
  const seedSql = `
    -- Services
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

    -- Service items for Security Services
    insert into public.service_items (service_id, title, description, image_url, sort_order) values
    ((select id from public.services where slug='security-services'), 'Security Guard Services', 'Trained, verified and uniformed guards for access control, perimeter protection and asset safety.', '/images/service-security-guard.png', 0),
    ((select id from public.services where slug='security-services'), 'Security Supervisors', 'On-site supervision, shift management, reporting and discipline enforcement.', '/images/service-facility-manager.png', 1),
    ((select id from public.services where slug='security-services'), 'Security Officers', 'Experienced officers for large premises, escalation handling and client liaison.', '/images/service-investigation.png', 2),
    ((select id from public.services where slug='security-services'), 'Access Control', 'Gate management, biometric/RFID coordination and authorized-entry protocols.', '/images/service-helpdesk.png', 3),
    ((select id from public.services where slug='security-services'), 'Visitor Management', 'Verification, visitor passes, logs and escort protocols.', '/images/guard-visitor-control.png', 4),
    ((select id from public.services where slug='security-services'), 'Vehicle Verification', 'Entry/exit logging, parking discipline and anti-tailgating vigilance.', '/images/mumbai-business-district.png', 5),
    ((select id from public.services where slug='security-services'), 'Patrolling', 'Foot and perimeter patrols with scheduled and random checks.', '/images/service-dog-squad.png', 6),
    ((select id from public.services where slug='security-services'), 'CCTV Monitoring', 'Control-room vigilance, incident flagging and evidence preservation.', '/images/team-inspection.png', 7);

    -- Service items for Facility Management
    insert into public.service_items (service_id, title, description, image_url, sort_order) values
    ((select id from public.services where slug='facility-management'), 'Facility Managers', 'Day-to-day operations, budgeting support and stakeholder reporting.', '/images/service-facility-manager.png', 0),
    ((select id from public.services where slug='facility-management'), 'Society Managers', 'Resident liaison, AGM support, compliance and documentation.', '/images/team-inspection.png', 1),
    ((select id from public.services where slug='facility-management'), 'Supervisors', 'Shift supervision, checklist enforcement and on-site discipline.', '/images/hero-mumbai-security.png', 2),
    ((select id from public.services where slug='facility-management'), 'Daily Operations', 'Opening/closing, utilities, common-area upkeep.', '/images/service-helpdesk.png', 3);

    -- Industries
    insert into public.industries (name, slug, short_description, description, image_url, icon_name, points, sort_order, is_featured) values
    ('Residential Societies', 'residential-societies', 'High-rise towers, gated communities and housing societies — resident safety, visitor management and common amenities.', 'Gate control, visitor screening, night patrols and parking vigilance.', '/images/hero-mumbai-security.png', 'building', '{"Gate access control","Visitor log & verification","Night perimeter patrols","Parking discipline"}'::text[], 0, true),
    ('Corporate Offices', 'corporate-offices', 'Commercial towers and corporate headquarters — professional reception, access control and asset safety.', 'Reception liaison, floor patrols, executive protection and data-room safety.', '/images/team-inspection.png', 'building', '{"Biometric & RFID access","Executive protection","Fire & safety readiness","Vendor management"}'::text[], 1, true),
    ('Commercial Complexes', 'commercial-complexes', 'Mixed-use commercial properties, retail arcades and business parks.', 'Multi-tenant coordination, loading docks, visitor tracking and common utilities.', '/images/mumbai-business-district.png', 'building', '{"Loading dock supervision","Multi-entry management","24/7 CCTV vigilance","Emergency response"}'::text[], 2, true),
    ('Hospitals & Healthcare', 'hospitals', 'Patient safety, emergency entry coordination, crowd management and sensitive-area protection.', '24/7 vigilance, emergency ward protection and pharmacy access control.', '/images/hospital-security.png', 'building', '{"Emergency access clearways","Visitor control","Pharmacy asset safety","Staff assistance"}'::text[], 3, true),
    ('Hotels & Hospitality', 'hotels', 'Guest-centric security with unobtrusive vigilance, lobby presence and banquet management.', 'Lobby bearing, baggage screening, valet coordination and event crowd control.', '/images/hero-mumbai-security.png', 'building', '{"Baggage screening","VIP escort protocols","Banquet crowd control","Parking management"}'::text[], 4, true),
    ('Schools & Institutions', 'schools-institutions', 'Child safety, parent verification, school-bus coordination and visitor management.', 'Child-safety protocols, bus embarkation oversight and zero-tolerance access control.', '/images/hospital-security.png', 'building', '{"Verified perimeter control","Bus embarkation oversight","Parent badge verification","Emergency drill training"}'::text[], 5, true);

    -- About content
    insert into public.about_content (page_title, eyebrow, hero_subtitle, hero_image_url, who_we_are_heading, who_we_are_description, who_we_are_secondary, who_we_are_image_url, mission_title, mission_description, vision_title, vision_description, commitment_title, commitment_description, management_heading, management_checklist, cta_text, cta_url, is_published) values
    ('Built Around Safety.
Driven by Professionalism.', 'About SAFE Guard FORCE',
     'An integrated security, facility, technical and investigation organization delivering safer, cleaner and efficiently managed premises across Mumbai.',
     '/images/team-inspection.png',
     'Integrated Services. One Accountable Partner.',
     'SAFE Guard FORCE provides integrated security, facility management, housekeeping, gardening, technical maintenance, STP operations, fire & safety and confidential investigation services.',
     'Headquartered at C 517, Kailash Esplanade, Ghatkopar West, Mumbai, we serve residential societies, corporate offices, commercial complexes, hospitals, hotels, schools, factories, warehouses and event venues.',
     '/images/hero-mumbai-security.png',
     'Our Mission', 'To provide reliable, disciplined and professional services that help organizations maintain safer, cleaner and efficiently managed premises.',
     'Our Vision', 'To become a trusted integrated security and facility-management partner for organizations across India.',
     'Our Commitment', 'Professional conduct, verified personnel, regular supervision and customized solutions — every site, every day.',
     'Structured Operations. Measurable Quality.',
     '{"Regular site inspections & audits","Personnel supervision & attendance control","Quality checks & SLA reporting","Complaint resolution & escalation matrix","Vendor coordination & AMC oversight","Preventive maintenance scheduling"}'::text[],
     'Discuss Your Requirements', '/contact', true);

    -- Statistics
    insert into public.statistics (value, label, description, context, sort_order) values
    ('24/7', 'Professional Assistance', 'Always available for prompt assistance', 'hero_bar', 0),
    ('Trained', 'Verified Personnel', 'Screened and groomed for security excellence', 'hero_bar', 1),
    ('Integrated', 'Service Solutions', 'Security, facility and technical under one roof', 'hero_bar', 2),
    ('Professional', 'Management System', 'SOPs, inspections and audit discipline', 'hero_bar', 3);

    -- Update site settings with brochure defaults
    UPDATE public.site_settings
    SET brochure_url = COALESCE(brochure_url, '/brochure.pdf'),
        brochure_title = COALESCE(NULLIF(brochure_title, ''), 'SAFE Guard FORCE Corporate Brochure'),
        brochure_enabled = true
    WHERE site_name ILIKE '%SAFE%';
  `;

  await query(seedSql);
  console.log("Database seeded successfully!");
}

seed().catch(console.error);
