import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseAgeRange, parseRegistration } from '../lib/eventMetadata.js';

const ageCases = [
  ['<p>All Ages</p><p>Join your friends for an afternoon</p>', 0, null],
  ['All ages.', 0, null],
  ['Ages 16 and up', 16, null],
  ['Recommended for ages 3 and above.', 3, null],
  ['Ages 13+', 13, null],
  ['18+, Registration Required', 18, null],
  ['Ages: 13 and up, 4:30 PM', 13, null],
  ['18 and up\nEvery third Tuesday @ 6:30 PM', 18, null],
  ['Ages 13 through 18', 13, 18],
  ['Recommended ages 8 to 12', 8, 12],
  ['Recommended Ages 4 - 12', 4, 12],
  ['Ages 13 through adult', 13, null],
  ['Recommended ages 0 to 18 months', 0, 2],
  ['Ages 5 and Under.', 0, 5],
  ['This story time is geared for those 3 and under.', 0, 3],
  ['Tuesdays @ 3:30-4:30 PM. Join our friends 5+ as an afternoon', 5, null],
  ['Registration Required<br><br>Ages 1 6 through adult', 16, null],
  ['Ages 1 8 and Up', 18, null],
  ['Ages 16 througn adult', 16, null],
  ['Recommended Ages 8 through 1 5', 8, 15],
  ['Grades 2nd-8th', 7, 14],
  ['Kindergarten-12th Grade', 5, 18],
  ['6th - 12th Grade', 11, 18],
  ['4th - 8th Graders\nEvery 4th Friday @ 4:00 - 5:00 PM', 9, 14],
  ['Registration Required\nGrades 6th through 12th', 11, 18],
  ['Grades 2nd-6th. Join us for grade-specific activities and fun!', 7, 12],
  ['Recommended ages 0 to 5 (All ages of children welcome)', 0, 5],
  [
    'Registration Required<br><br>Ages 7 and Up<br><p>Discover the science for ages 8 and up!</p>',
    7,
    null,
  ],
];

for (const [description, min, max] of ageCases) {
  test(`parseAgeRange reads ${JSON.stringify(description)}`, () => {
    assert.deepEqual(parseAgeRange(description), { min, max });
  });
}

test('parseAgeRange returns null without an age', () => {
  assert.equal(parseAgeRange(''), null);
  assert.equal(parseAgeRange(undefined), null);
  assert.equal(
    parseAgeRange('Do you have burning questions about your technology?'),
    null,
  );
  assert.equal(
    parseAgeRange(
      'One craft kit is designed for kids under 12 years old, and the other is designed for those 12 &amp; over',
    ),
    null,
  );
});

test('parseRegistration detects required and recommended', () => {
  assert.equal(parseRegistration('Registration Required!Join us'), 'required');
  assert.equal(
    parseRegistration('All Ages<br>Registration required. Register in person'),
    'required',
  );
  assert.equal(parseRegistration('RSVP to the front desk'), 'required');
  assert.equal(
    parseRegistration('Recommended ages 7 to 12\nRegistration recommended!'),
    'recommended',
  );
  assert.equal(
    parseRegistration('Registration is recommended for this one'),
    'recommended',
  );
});

test('parseRegistration ignores other mentions of registering', () => {
  assert.equal(
    parseRegistration('registered kids of all ages can pick up a car kit'),
    null,
  );
  assert.equal(parseRegistration('Registration begins on June 30.'), null);
  assert.equal(parseRegistration(undefined), null);
});
