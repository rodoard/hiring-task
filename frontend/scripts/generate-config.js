const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Function to parse .env file
function parseEnvFile() {
  const envPath = path.resolve(__dirname, '../.env');
  
  try {
    // Read .env file contents
    const envContents = fs.readFileSync(envPath, 'utf8');
    
    // Parse .env contents into an object
    const parsedEnv = dotenv.parse(envContents);
    
    return {
      api: {
        baseUrl: parsedEnv.HIRING_TASK_APP_API_URL || 'http://localhost:8000/api/v1',
      }
    };
  } catch (error) {
    console.error('Error parsing .env file:', error);
    return {
      api: {
        baseUrl: 'http://localhost:8000/api/v1',
      }
    };
  }
}

// Function to generate config
function generateConfig() {
  // Parse .env file
  const config = parseEnvFile();

  // Ensure the config directory exists
  const configDir = path.resolve(__dirname, '../src/config');
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  // Write the config file
  const configPath = path.resolve(configDir, 'index.ts');
  const configContent = `// Dynamically generated configuration
const config = ${JSON.stringify(config, null, 2)};

export default config;
`;

  fs.writeFileSync(configPath, configContent);
  console.log('✅ Configuration generated successfully at src/config/index.ts');
}

// Run the generation
generateConfig();
