import * as sass from 'sass';
import path from 'node:path';
import browserslist from 'browserslist'
import { transform, browserslistToTargets } from 'lightningcss'

const targets = browserslistToTargets(browserslist("> 0.2% and not dead"));

export default function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("favicon.ico");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("static/script.js");

  eleventyConfig.addFilter("splitParagraphs", function(value) {
    return (value || '').split("\n").filter((p) => p.trim() !== '');
  });

  eleventyConfig.addFilter("cssmin", function (code) {
    return transform({
      code: Buffer.from(code),
      minify: true,
      sourceMap: false,
      targets,
    }).code;
  });

  eleventyConfig.addTemplateFormats("scss");

  // From https://11ty.rocks/posts/process-css-with-lightningcss/
  eleventyConfig.addExtension("scss", {
    outputFileExtension: "css",
    compile: async function (inputContent, inputPath) {
      // Skip files like _fileName.scss
      let parsed = path.parse(inputPath);
      if (parsed.name.startsWith("_")) {
        return;
      }

      // Run file content through Sass
      let result = sass.compileString(inputContent, {
        loadPaths: [parsed.dir || "."],
        sourceMap: false, // or true, your choice!
      });

      // Allow included files from @use or @import to
      // trigger rebuilds when using --incremental
      this.addDependencies(inputPath, result.loadedUrls);


      return async () => {
        return transform({
          code: Buffer.from(result.css),
          minify: true,
          sourceMap: false,
          targets,
        }).code;
      };
    },
  });
};
