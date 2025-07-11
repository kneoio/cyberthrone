import { Achievement, Dictator } from '../types/dictator';

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatYearsInPower = (years: string): string => {
  return years.replace('-', ' - ');
};

export const getTotalAchievements = (dictator: Dictator): number => {
  return dictator.achievements?.length || 0;
};

export const getAchievementsByYear = (achievements: Achievement[]): Achievement[] => {
  return achievements.sort((a, b) => b.year - a.year);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const searchDictators = (dictators: Dictator[], query: string): Dictator[] => {
  const lowerQuery = query.toLowerCase();
  return dictators.filter(
    (dictator) =>
      dictator.name.toLowerCase().includes(lowerQuery) ||
      dictator.country.toLowerCase().includes(lowerQuery) ||
      dictator.username.toLowerCase().includes(lowerQuery) ||
      dictator.description.toLowerCase().includes(lowerQuery)
  );
};

export const filterDictatorsByCountry = (dictators: Dictator[], country: string): Dictator[] => {
  if (!country) return dictators;
  return dictators.filter(
    (dictator) => dictator.country.toLowerCase() === country.toLowerCase()
  );
};

export const getUniqueCountries = (dictators: Dictator[]): string[] => {
  const countries = dictators.map((dictator) => dictator.country);
  return Array.from(new Set(countries)).sort();
};

export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validateUsername = (username: string): boolean => {
  // Username should be 3-20 characters, alphanumeric and underscores only
  const re = /^[a-zA-Z0-9_]{3,20}$/;
  return re.test(username);
};

export const validateYearsInPower = (years: string): boolean => {
  // Format: YYYY-YYYY or YYYY-present
  const re = /^\d{4}-(\d{4}|present)$/;
  return re.test(years);
};
