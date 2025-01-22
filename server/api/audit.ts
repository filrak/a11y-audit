import pa11y from 'pa11y';

// POST endpoint to run accessibility audit on provided URL
export default defineEventHandler(async (event) => {
  try {
    // Get URL from request body
    const body = await readBody(event);
    const url = body.url;

    if (!url) {
      throw createError({
        statusCode: 400,
        message: 'URL is required'
      });
    }

    // Run pa11y audit
    const results = await pa11y(url);
    
    return {
      success: true,
      results
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to run accessibility audit'
    });
  }
});