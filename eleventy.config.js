import { transform, browserslistToTargets } from 'lightningcss';
import * as sass from 'sass';
import browserslist from 'browserslist';

const targets = browserslistToTargets(browserslist('> 0.2% and not dead'));

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy('favicon.ico');
  eleventyConfig.addPassthroughCopy('robots.txt');
  eleventyConfig.addPassthroughCopy('script.js');

  // not trying to catch everything, just what tends to sneak into Google Calendar
  eleventyConfig.addFilter('stripHTML', function (value) {
    return (value || '').
      replaceAll('<p>', '').
      replaceAll('</p>', '\n').
      replaceAll(/<br ?\/?>/g, '\n').
      replaceAll('<b>', '').
      replaceAll('</b>', '').
      replaceAll('<strong>', '').
      replaceAll('</strong>', '').
      replaceAll('<em>', '').
      replaceAll('</em>', '').
      replaceAll('<i>', '').
      replaceAll('</i>', '');
  });

  eleventyConfig.addFilter('splitParagraphs', function (value) {
    return (value || '').split('\n').filter((p) => p.trim() !== '');
  });

  eleventyConfig.addFilter('sassmin', function (code) {
    return transform({
      code: Buffer.from(sass.compileString(code, { sourceMap: false }).css),
      minify: true,
      sourceMap: false,
      targets,
    }).code;
  });
}
