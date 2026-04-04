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
    const { password, galleryData, action } = JSON.parse(event.body || '{}');
    
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

    if (action === 'save-gallery') {
      // Save gallery data using GitHub API
      const githubToken = process.env.GITHUB_TOKEN;
      const repoOwner = 'DHRUVASAI';
      const repoName = 'VE';
      const filePath = 'data/services-gallery.json';

      if (!githubToken) {
        return {
          statusCode: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({ 
            error: 'GitHub token not configured. Please set GITHUB_TOKEN environment variable.' 
          })
        };
      }

      // Get current file SHA
      const getCurrentFileResponse = await fetch(
        `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`,
        {
          headers: {
            'Authorization': `token ${githubToken}`,
            'User-Agent': 'VE-Admin-Panel'
          }
        }
      );

      let sha;
      if (getCurrentFileResponse.ok) {
        const currentFile = await getCurrentFileResponse.json();
        sha = currentFile.sha;
      }

      // Update file content
      const content = Buffer.from(JSON.stringify(galleryData, null, 2)).toString('base64');
      
      const updateResponse = await fetch(
        `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `token ${githubToken}`,
            'Content-Type': 'application/json',
            'User-Agent': 'VE-Admin-Panel'
          },
          body: JSON.stringify({
            message: `Update gallery data via admin panel - ${new Date().toISOString()}`,
            content: content,
            sha: sha
          })
        }
      );

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(`GitHub API error: ${errorData.message}`);
      }

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ 
          success: true, 
          message: 'Gallery data updated successfully! Your website will update in a few minutes.',
          timestamp: new Date().toISOString()
        })
      };
    }

    if (action === 'upload-file') {
      // Handle file upload to GitHub
      const { fileName, fileContent, fileType } = JSON.parse(event.body);
      
      const githubToken = process.env.GITHUB_TOKEN;
      const repoOwner = 'DHRUVASAI';
      const repoName = 'VE';
      const filePath = `assets/uploads/${fileName}`;

      if (!githubToken) {
        return {
          statusCode: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({ 
            error: 'GitHub token not configured' 
          })
        };
      }

      // Upload file to GitHub
      const uploadResponse = await fetch(
        `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `token ${githubToken}`,
            'Content-Type': 'application/json',
            'User-Agent': 'VE-Admin-Panel'
          },
          body: JSON.stringify({
            message: `Upload ${fileName} via admin panel`,
            content: fileContent // Base64 encoded content
          })
        }
      );

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(`File upload failed: ${errorData.message}`);
      }

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ 
          success: true, 
          message: 'File uploaded successfully!',
          filePath: filePath
        })
      };
    }

    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Invalid action' })
    };

  } catch (error) {
    console.error('API error:', error);
    
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