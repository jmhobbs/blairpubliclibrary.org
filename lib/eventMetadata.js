const AGE = '(\\d{1,2})';
const GRADE = '(k|kindergarten|\\d{1,2})';
const RANGE_SEPARATOR = '\\s*(?:-|–|to|through)\\s*';

const ALL_AGES = /\ball ages\b/;
const GRADE_RANGE = new RegExp(
  `grades?\\s*${GRADE}${RANGE_SEPARATOR}${GRADE}\\b|\\b${GRADE}${RANGE_SEPARATOR}${GRADE}\\s*grade`,
);
const AGE_RANGE = new RegExp(
  `(?:ages?:?|recommended for)\\s*${AGE}${RANGE_SEPARATOR}(\\d{1,2}|adults?)(\\s*months)?`,
);
const AGE_AND_UP = new RegExp(
  `(?:(?:ages?:?|recommended for)\\s*|^)${AGE}\\s*(?:and up|and above|and over|& over)|\\b${AGE}\\+`,
);
const AGE_AND_UNDER = new RegExp(`\\b${AGE}\\s*and under`);

function descriptionLines(html) {
  return (html || '')
    .replace(/<br ?\/?>|<\/p>|<\/li>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .toLowerCase()
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line !== '');
}

function normalizeAgeLine(line) {
  return line
    .replace(/(\d) (\d)/g, '$1$2')
    .replace(/througn/g, 'through')
    .replace(/(\d+)(st|nd|rd|th)\b/g, '$1');
}

function gradeToAge(grade) {
  return grade === 'k' || grade === 'kindergarten' ? 5 : Number(grade) + 5;
}

function parseAgeLine(line) {
  if (ALL_AGES.test(line) && !/\d/.test(line)) return { min: 0, max: null };

  let match = line.match(GRADE_RANGE);
  if (match) {
    const [lowest, highest] = match.slice(1).filter(Boolean);
    return { min: gradeToAge(lowest), max: gradeToAge(highest) + 1 };
  }

  match = line.match(AGE_RANGE);
  if (match) {
    const [, min, max, months] = match;
    if (/adult/.test(max)) return { min: Number(min), max: null };
    if (months) return { min: 0, max: Math.ceil(Number(max) / 12) };
    return { min: Number(min), max: Number(max) };
  }

  match = line.match(AGE_AND_UP);
  if (match) return { min: Number(match[1] ?? match[2]), max: null };

  match = line.match(AGE_AND_UNDER);
  if (match) return { min: 0, max: Number(match[1]) };

  return null;
}

export function parseAgeRange(description) {
  for (const line of descriptionLines(description)) {
    const range = parseAgeLine(normalizeAgeLine(line));
    if (range) return range;
  }
  return null;
}

export function parseRegistration(description) {
  const text = descriptionLines(description).join('\n');
  if (/registration\s+(is\s+)?required|\brsvps?\b/.test(text)) {
    return 'required';
  }
  if (/registration\s+(is\s+)?recommended/.test(text)) return 'recommended';
  return null;
}
