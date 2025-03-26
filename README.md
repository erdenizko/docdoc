# DocGenerator - Postman Collection Generator

A flexible script to automatically generate Postman collections from Express.js route files.

## Features

- Automatically detects Express routes from your codebase
- Extracts validation schemas to generate example request bodies
- Creates a well-organized Postman collection with folders by resource
- Generates smart example request bodies based on resource types and endpoints
- Intelligently names endpoints based on HTTP methods and paths
- Customizable through a simple configuration file
- Works with different Express project structures
- Supports both traditional and Zod validation schemas

## Installation

1. Copy the `generate-postman.js` file to your project root
2. Install required dependencies:

```bash
npm install uuid
```

## Usage

1. Create a `.docdoc` configuration file (optional)
2. Run the generator:

```bash
node generate-postman.js
```

The script will generate a Postman collection file based on your configuration.

## Configuration

The script can be configured through a `.docdoc` configuration file in JSON format. If no configuration file is found, default values will be used.

### Minimal Configuration Example

```json
{
  "apiPrefix": "/api",
  "routesDir": "src/routes",
  "outputFile": "postman.json",
  "baseUrl": "http://localhost:3000",
  "collectionName": "My API Collection"
}
```

### Full Configuration Example

For more advanced use cases, you can set additional options:

```json
{
  "apiPrefix": "/api",
  "routesDir": "src/routes",
  "validatorsDir": "src/validators",
  "outputFile": "postman.json",
  "baseUrl": "http://localhost:3000",
  "collectionName": "My API Collection",
  "collectionDescription": "API collection for my awesome project",
  "routeFilePattern": ".routes.js",
  "validatorFilePattern": ".validators.js",
  "authTokenName": "token",
  "authTokenJsonPath": "data.token",
  "enableTokenCapture": true,
  "zod": true,
  "exampleValues": {
    "user": {
      "name": "John Doe",
      "email": "john@example.com",
      "role": "ADMIN"
    },
    "webhook": {
      "url": "https://myapp.com/webhook",
      "events": ["USER_CREATED", "TASK_COMPLETED"],
      "isActive": true
    }
  },
  "resourceDescriptions": {
    "auth": "Authentication endpoints",
    "user": "User management endpoints"
  }
}
```

### Configuration Options

| Option | Description | Default |
|--------|-------------|---------|
| `apiPrefix` | Prefix for API routes | `/api` |
| `routesDir` | Directory containing route files | `src/routes` |
| `validatorsDir` | Directory containing validator files | `src/validators` |
| `outputFile` | Path where the Postman collection will be saved | `postman.json` |
| `baseUrl` | Base URL for API requests | `http://localhost:3000` |
| `collectionName` | Name of the Postman collection | `API Collection` |
| `collectionDescription` | Description of the Postman collection | Auto-generated |
| `routeFilePattern` | File pattern for route files | `.routes.js` |
| `validatorFilePattern` | File pattern for validator files | `.validators.js` |
| `authTokenName` | Postman environment variable to store the auth token | `token` |
| `authTokenJsonPath` | JSON path to find the token in auth responses | `data.token` |
| `enableTokenCapture` | Enable automatic token capture for auth endpoints | `true` |
| `zod` | Use Zod for validation schemas instead of traditional schemas | `false` |
| `exampleValues` | Custom example values for request bodies by resource | `{}` |
| `resourceDescriptions` | Descriptions for resource folders | `{}` |

All other settings will be populated with sensible defaults.

## Validation Schema Support

The script supports two types of validation schemas:

### Traditional Validation Schemas

Example of a traditional validation schema:

```javascript
const createUserSchema = {
  name: {
    type: 'string',
    required: true,
    min: 2,
    max: 50
  },
  email: {
    type: 'string',
    required: true
  },
  password: {
    type: 'string',
    required: true,
    min: 8
  }
};
```

### Zod Validation Schemas

With the `zod: true` configuration option, the script can also parse Zod schemas:

```javascript
import { z } from 'zod';

const createUserSchema = z.object().shape({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['ADMIN', 'USER']).optional()
});
```

## Project Structure Compatibility

The script is designed to work with Express projects that follow these conventions:

- Routes are defined in files ending with the pattern specified in `routeFilePattern` (default: `.routes.js`)
- Routes use Express Router with standard HTTP methods (get, post, put, delete, patch)
- Validators are defined in files ending with the pattern specified in `validatorFilePattern` (default: `.validators.js`)

## Customizing for Different Project Structures

If your project structure differs from the defaults:

1. Update the `routesDir` and `validatorsDir` in the config to point to your route and validator directories
2. Change the `routeFilePattern` and `validatorFilePattern` to match your file naming conventions
3. If your API has a different prefix, update the `apiPrefix` value

## Example for NestJS Project

```json
{
  "apiPrefix": "/api/v1",
  "routesDir": "src/controllers",
  "validatorsDir": "src/dto",
  "routeFilePattern": ".controller.ts",
  "validatorFilePattern": ".dto.ts"
}
```

## Example for Express Project with Different Structure

```json
{
  "apiPrefix": "/api/v1",
  "routesDir": "api/controllers",
  "validatorsDir": "api/validators",
  "routeFilePattern": ".api.js",
  "validatorFilePattern": ".validator.js"
}
```

## License

MIT 