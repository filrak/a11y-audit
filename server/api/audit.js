import pa11y from 'pa11y';
import captureWebsite from "capture-website";
import { promises as fs } from 'fs';
import path from 'path';


const takeScreenshot = async (url, filename, config) => {
  try {
      await captureWebsite.file(url, filename, config);
  } catch (error) {
      console.error("Failed to take screenshot:", error);
      return null;
  }
  return true;
}

export default defineEventHandler(async (event) => {
  try {



    const body = await readBody(event);
    const url = body.url;

    if (!url) {
      throw createError({
        statusCode: 400,
        message: 'URL is required'
      });
    }

    const results = await pa11y(url, {
      runners: [
        'axe',    
      ]
    });

    await fs.rm('public/screenshots/', { recursive: true, force: true });
    await fs.mkdir('public/screenshots/', { recursive: true });

    const screenshotPromises = results.issues.map(async (issue, index) => {
      if (issue.selector) {
        await takeScreenshot(url, `public/screenshots/issue_${index + 1}.png`, {
          fullPage: true,
          hideElements: `.overlaycookieyes`,
          element: issue.selector
        });
      }
    });

    await Promise.all(screenshotPromises);
  

    return {
      success: true,
      results
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to run accessibility audit'
    });
  }
});