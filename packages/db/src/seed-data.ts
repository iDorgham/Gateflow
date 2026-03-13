import * as faker from 'faker';

// Fixed list of high-value resort locations
export const RED_SEA_LOCATIONS = [
  'Hurghada',
  'Sahl Hasheesh',
  'El Gouna',
  'Soma Bay',
  'Makadi',
  'Safaga',
  'Marsa Alam',
  'Ein El Sokhna',
  'Sharm El Sheikh',
];

// Diverse Nationality Dictionaries for High-End Resort Residents
const NAMES_BY_ORIGIN = {
  Russian: {
    firstNames: ['Alexander', 'Dmitry', 'Ivan', 'Mikhail', 'Andrey', 'Elena', 'Anna', 'Maria', 'Natalia', 'Ekaterina', 'Sergey', 'Vladimir', 'Yuri', 'Oleg', 'Tatiana', 'Olga', 'Svetlana', 'Irina'],
    lastNames: ['Ivanov', 'Smirnov', 'Kuznetsov', 'Popov', 'Sokolov', 'Lebedev', 'Kozlov', 'Novikov', 'Morozov', 'Petrov', 'Volkov', 'Solovyov', 'Vasilyev', 'Zaitsev', 'Pavlov', 'Semenov', 'Golubev', 'Vinogradov'],
  },
  German: {
    firstNames: ['Lukas', 'Maximilian', 'Leon', 'Paul', 'Jonas', 'Noah', 'Elias', 'Felix', 'Anton', 'Mia', 'Emma', 'Hannah', 'Sophia', 'Emilia', 'Anna', 'Lina', 'Mila', 'Lea'],
    lastNames: ['Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker', 'Schulz', 'Hoffmann', 'Schäfer', 'Koch', 'Bauer', 'Richter', 'Klein', 'Wolf', 'Schröder', 'Neumann'],
  },
  Italian: {
    firstNames: ['Leonardo', 'Francesco', 'Alessandro', 'Lorenzo', 'Mattia', 'Andrea', 'Gabriele', 'Riccardo', 'Tommaso', 'Sofia', 'Giulia', 'Aurora', 'Alice', 'Ginevra', 'Emma', 'Giorgia', 'Greta', 'Beatrice'],
    lastNames: ['Rossi', 'Russo', 'Ferrari', 'Esposito', 'Bianchi', 'Romano', 'Colombo', 'Ricci', 'Marino', 'Greco', 'Bruno', 'Gallo', 'Conti', 'De Luca', 'Mancini', 'Costa', 'Giordano', 'Rizzo'],
  },
  Spanish: {
    firstNames: ['Hugo', 'Mateo', 'Martín', 'Lucas', 'Leo', 'Daniel', 'Alejandro', 'Manuel', 'Pablo', 'Lucía', 'Martina', 'Sofía', 'María', 'Julia', 'Valeria', 'Paula', 'Emma', 'Daniela'],
    lastNames: ['García', 'Rodríguez', 'González', 'Fernández', 'López', 'Martínez', 'Sánchez', 'Pérez', 'Gómez', 'Martín', 'Jiménez', 'Ruiz', 'Hernández', 'Díaz', 'Moreno', 'Muñoz', 'Álvarez', 'Romero'],
  },
  Egyptian: {
    firstNames: ['Ahmed', 'Mohamed', 'Mahmoud', 'Omar', 'Ali', 'Amr', 'Tarek', 'Yousef', 'Kareem', 'Fatma', 'Nour', 'Salma', 'Habiba', 'Mariam', 'Yasmin', 'Aya', 'Heba', 'Farida'],
    lastNames: ['Abdelrahman', 'El-Sayed', 'Hassan', 'Ibrahim', 'Mahmoud', 'Aly', 'Tawfik', 'Farouk', 'Osman', 'Moustafa', 'Sami', 'Fawzy', 'Saad', 'Khalil', 'Mansour', 'Salem', 'Amin', 'Fouad'],
  },
};

export const UTM_SOURCES = ['facebook', 'instagram', 'google', 'whatsapp', 'linkedin', 'email_campaign', 'referral', 'organic'];
export const UTM_CAMPAIGNS = ['summer_launch_2026', 'beach_club_promo', 'early_bird_discount', 'vip_referral', 'event_spike', 'winter_season_2026'];

export const INCIDENT_REASONS = [
  'Tailgating: unauthorized vehicle followed resident',
  'Invalid QR: pass expired 2 days ago',
  'Identity mismatch: guest name does not match ID',
  'Watchlist trigger: person flagged for previous disruption',
  'Access denied: wrong gate for this unit type',
  'Suspicious activity: multiple failed scans at different gates',
  'Blocked vehicle: license plate on blacklist',
  'Unauthorized pickup: parent not authorized for student',
];

export const WATCHLIST_CATEGORIES = ['SECURITY', 'BLOCKED', 'PREVIOUS_INCIDENT', 'UNAUTHORIZED_RESIDENT', 'STAFF_DISMISSED'];

/**
 * Returns a randomly selected resort location from the Red Sea portfolio.
 */
export function getRandomResortLocation(): string {
  return faker.helpers.randomize(RED_SEA_LOCATIONS);
}

/**
 * Returns a random UTM source.
 */
export function getRandomUtmSource(): string {
  return faker.helpers.randomize(UTM_SOURCES);
}

/**
 * Returns a random UTM campaign.
 */
export function getRandomUtmCampaign(): string {
  return faker.helpers.randomize(UTM_CAMPAIGNS);
}

/**
 * Returns a random incident reason.
 */
export function getRandomIncidentReason(): string {
  return faker.helpers.randomize(INCIDENT_REASONS);
}

/**
 * Returns a random watchlist category.
 */
export function getRandomWatchlistCategory(): string {
  return faker.helpers.randomize(WATCHLIST_CATEGORIES);
}

/**
 * Generates a realistic contact name using diverse European and Egyptian dictionaries,
 * weighting international origins heavily for resort locations.
 */
export function getRandomInternationalName(): { firstName: string; lastName: string; origin: string } {
  // Weight the probability of nationalities (e.g., higher chance of European for these specific projects)
  const origins = [
    ...Array(3).fill('Russian'),
    ...Array(3).fill('German'),
    ...Array(2).fill('Italian'),
    ...Array(1).fill('Spanish'),
    ...Array(4).fill('Egyptian'), // Local elite + expats
  ];

  const origin = faker.helpers.randomize(origins) as keyof typeof NAMES_BY_ORIGIN;
  const lexicon = NAMES_BY_ORIGIN[origin];

  const firstName = faker.helpers.randomize(lexicon.firstNames);
  const lastName = faker.helpers.randomize(lexicon.lastNames);

  return { firstName, lastName, origin };
}
