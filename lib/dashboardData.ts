import { Acquisition, AcquisitionStatus, Inquiry, Consultation, LogisticsShipment, SecurityRecord, CollectorProfile } from './dashboardTypes';

export const INITIAL_ACQUISITIONS: Acquisition[] = [
  {
    id: 'acq_1',
    title: 'Benin Bronze Head',
    era: '16th Century',
    culture: 'Edo Peoples',
    acquisitionDate: 'Oct 12, 2024',
    status: AcquisitionStatus.Certified,
    imageUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80',
    estimatedValueEur: 8500000,
    description: 'An ancient bronze cast head from the historical Kingdom of Benin. The masterpiece showcases highly detailed facial features gathered in heavy defensive neck collars, pristine scarification marks on the forehead, and an elaborate beaded net crown.',
    provenance: [
      'Royal Court of Benin (16th Century - 1897)',
      'Private Collection, London (1897 - 1934)',
      'Sotheby\'s Fine African Art Department, London (1934 - Sold)',
      'Von Habsburg Collection, Vienna (1934 - 2021)',
      'Aduna Gallery Private Advisory (2021 - 2024)',
      'Acquired by Julian Doe (Oct 12, 2024)'
    ]
  },
  {
    id: 'acq_2',
    title: 'Ife Terracotta Head',
    era: '12th–15th Century',
    culture: 'Yoruba Peoples',
    acquisitionDate: 'Sep 28, 2024',
    status: AcquisitionStatus.InTransit,
    imageUrl: 'https://images.unsplash.com/photo-1533250268595-f12792cdd742?auto=format&fit=crop&q=80',
    estimatedValueEur: 9200000,
    description: 'A meticulously modeled terracotta head displaying the serene, idealized naturalism characteristic of Ife art. The face bears fine parallel vertical striations representing scarification or ritual veiling.',
    provenance: [
      'Sacred Shrine at Ilé-Ifè, Nigeria',
      'Coombs Anthropological Collection, Paris (1928 - 1970)',
      'Gaston Fine Tribal Art Gallery, Brussels (1970 - 1999)',
      'Private Collection of Dr. Joseph Alao, Lagos/London (1999 - 2024)',
      'Acquired by Julian Doe (Sep 28, 2024)'
    ]
  },
  {
    id: 'acq_3',
    title: 'Ashanti Ceremonial Stool',
    era: '19th Century',
    culture: 'Akan Peoples',
    acquisitionDate: 'Aug 14, 2024',
    status: AcquisitionStatus.Pending,
    imageUrl: 'https://images.unsplash.com/photo-1600320254374-ce2d293c324e?auto=format&fit=crop&q=80',
    estimatedValueEur: 7100000,
    description: 'A hand-carved single block mahogany ceremonial stool (Sesa Dwa), featuring complex openwork geometric columns that symbolize the structure of state power.',
    provenance: [
      'Stool House of Kumasi Nobles, Ghana',
      'MacDonald West African Collection, Edinburgh (1910 - 1968)',
      'Gallery Derisch, Zurich (1968 - 2005)',
      'Royal Gold Heritage Collection, Accra (2005 - 2024)',
      'Acquired by Julian Doe (Aug 14, 2024)'
    ]
  },
  {
    id: 'acq_4',
    title: 'Dogon Sanctuary Mask',
    era: 'Late 18th Century',
    culture: 'Dogon Peoples',
    acquisitionDate: 'May 03, 2024',
    status: AcquisitionStatus.Certified,
    imageUrl: 'https://images.unsplash.com/photo-1501472312651-726afd116ff1?auto=format&fit=crop&q=80',
    estimatedValueEur: 3200000,
    description: 'A stunning "Sirige" tall mask carved with abstract rectangular geometric divisions. Reflects the multi-tiered structure of the universe and cosmic ordering.',
    provenance: [
      'Bandiagara Cliff Shrine, Mali',
      'Professor Charles Meyer Field Collection, Basel (1954)',
      'Acquired by Julian Doe (May 03, 2024)'
    ]
  }
];

export const INITIAL_INQUIRIES: Inquiry[] = [
  {
    id: 'inq_1',
    artworkTitle: 'Contemporary Weave',
    artworkYear: '2023',
    imageUrl: 'https://images.unsplash.com/photo-1618022325802-7e5e732d97a1?auto=format&fit=crop&q=80',
    status: 'In Discussion',
    date: 'Jun 05, 2026',
    messages: [
      {
        sender: 'collector',
        text: 'I watched the preview documentation of the Contemporary Weave. Is the provenance report from the artist\'s estate available?',
        timestamp: 'Jun 05, 2026, 02:15 PM'
      },
      {
        sender: 'curator',
        text: 'Hello Julian. Yes, the Contemporary Weave has been vetted by the El Anatsui Foundation. Complete studio records, signature proofs, and custom shipping options are fully documented. I\'ve attached the draft catalog to your secure account dashboard.',
        timestamp: 'Jun 06, 2026, 10:04 AM'
      },
      {
        sender: 'collector',
        text: 'Splendid. I am extremely interested in incorporating this into my special exhibition chamber next month.',
        timestamp: 'Jun 09, 2026, 09:12 AM'
      }
    ]
  }
];

export const INITIAL_CONSULTATIONS: Consultation[] = [
  {
    id: 'cons_1',
    expertName: 'Dr. Amara Diop',
    expertTitle: 'Director of West African Antiquities',
    expertAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150&h=150',
    date: 'Jun 15, 2026',
    timeSlot: '14:00 - 15:00 GMT',
    topic: 'Authentication Vetting for 15th-Century Yoruba Woodworks',
    status: 'Confirmed',
    notes: 'Prior to our private call, please ensure the close-up high-resolution imaging of the timber grain is forwarded to the lab portal.'
  },
  {
    id: 'cons_2',
    expertName: 'Christian Vanhoutte',
    expertTitle: 'Chief Conservator & Materials Analyst',
    expertAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150&h=150',
    date: 'Jun 22, 2026',
    timeSlot: '11:00 - 12:30 GMT',
    topic: 'Bronze Conservation Strategy (Verdigris Management)',
    status: 'Pending',
    notes: 'A standard structural ultrasound audit will be run on the Benin Bronze Head to verify core micro-fissure stability.'
  }
];

export const INITIAL_LOGISTICS: LogisticsShipment[] = [
  {
    id: 'ship_1',
    artworkTitle: 'Ife Terracotta Head',
    carrier: 'Malca-Amit Premium Art Courier',
    status: 'Customs Clearance',
    estimatedDeliveryDate: 'Jun 19, 2026',
    securityTier: 'Level 5 Armed Vault Transport',
    insuranceCoverage: '€10,000,000 Swiss Re Art Policy',
    updates: [
      {
        date: 'Jun 08, 2026',
        status: 'Customs Holding Vetted',
        location: 'Heathrow Security Terminal, London',
        description: 'Vetting of physical export license from source heritage authorities finalized. Passed radiation and thermal scan.'
      },
      {
        date: 'Jun 06, 2026',
        status: 'In Transit',
        location: 'Charles de Gaulle Cargo Safe, Paris',
        description: 'Transferred via temperature-controlled, armored transport vehicle under escort.'
      },
      {
        date: 'Jun 04, 2026',
        status: 'Departed Origin Hub',
        location: 'Secured Fine Art Logistics Hub, Paris',
        description: 'Cratered in triple-walled museum-grade moisture-seal crates with dual accelerometers attached.'
      }
    ]
  }
];

export const INITIAL_SECURITY: SecurityRecord[] = [
  {
    id: 'sec_1',
    artworkTitle: 'Benin Bronze Head',
    vaultLocation: 'Private Vault Sector B-4, Geneva FreePort',
    fingerprintId: 'FP-BENIN-0918-B',
    smartContractAddress: '0x3C9a...82Fd (Aduna Registry V2)',
    lastInspectionDate: 'May 12, 2026',
    temperatureHumidity: '20.2°C / 48.5% RH (Optimal)',
    insurancePolicyNumber: 'AXA-MUSEUM-99120-J'
  },
  {
    id: 'sec_2',
    artworkTitle: 'Dogon Sanctuary Mask',
    vaultLocation: 'Collector Private Display, Wing A',
    fingerprintId: 'FP-DOGON-4412-M',
    smartContractAddress: '0x7E12...33Ca (Aduna Registry V2)',
    lastInspectionDate: 'Jun 01, 2026',
    temperatureHumidity: '21.0°C / 45.0% RH (Stabilized)',
    insurancePolicyNumber: 'AXA-MUSEUM-99120-K'
  }
];

export const INITIAL_PROFILE: CollectorProfile = {
  name: 'Julian Doe',
  tier: 'Prestige Tier',
  currency: 'EUR (€)',
  joinedDate: 'Jan 15, 2022',
  curatorName: 'Helena Sterling',
  regionsOfInterest: ['West Africa (Edo, Yoruba, Akan)', 'Nile Valley Antiquities', 'Contemporary African Sculpture']
};

export const ARTWORK_OPTIONS = [
  {
    title: 'Nok Terracotta Figure',
    era: '500 BC - 200 AD',
    culture: 'Nok Culture',
    value: 6500000,
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80',
    description: 'A classic Nok sculpture showing large elliptical eyes and a sophisticated, hollow-fired clay body of an aristocratic seated dignitary.'
  },
  {
    title: 'Kingdom of Dahomey Silver Scepter',
    era: '18th Century',
    culture: 'Fon Peoples',
    value: 1800000,
    imageUrl: 'https://images.unsplash.com/photo-1569172119333-df9a4a4299b0?auto=format&fit=crop&q=80',
    description: 'A beautifully hammered royal scepter (Makpo) featuring an embossed lion emblem representing the royal power of King Glele.'
  },
  {
    title: 'Luba Ancestor Staff',
    era: '19th Century',
    culture: 'Luba Peoples',
    value: 2900000,
    imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80',
    description: 'A carved wooden staff of office displaying a dual-faced female ancestor with intricate geometric scarification and high-sheen black oil finish.'
  }
];