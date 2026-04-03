exports.handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { password, galleryData } = JSON.parse(event.body || '{}');
    
    // Verify admin password
    const ADMIN_PASSWORD = process.env.VE_ADMIN_PASSWORD || 'VEAdmin2024!';
    if (password !== ADMIN_PASSWORD) {
      return {
        statusCode: 401,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Invalid password' })
      };
    }

    // Validate gallery data structure
    if (!galleryData || typeof galleryData !== 'object') {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Invalid gallery data' })
      };
    }

    // For now, we'll return the data as confirmation
    // In a real implementation with a Git-based CMS, you'd commit changes here
    // For this simple setup, the admin will need to manually update the JSON file
    
    console.log('Gallery data received:', JSON.stringify(galleryData, null, 2));
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        success: true, 
        message: 'Gallery data validated successfully. Please manually update data/services-gallery.json with the provided data.',
        data: galleryData,
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('Save gallery error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      })
    };
  }
};