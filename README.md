# DocGenerator - Postman Collection Generator

A flexible script to automatically generate Postman collections from Express.js route files.

## Features

DocGenerator streamlines Postman collection creation for Express.js projects by:

*   Automatically detecting routes and extracting validation schemas (both traditional and Zod).
*   Generating well-organized collections with resource-based folders and intelligently named endpoints.
*   Creating smart example request bodies.
*   Offering customization through a simple configuration file to adapt to various project structures.

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

The script can be configured through a `.docdoc` configuration file in JSON format. If no configuration file is found, default values will be used. If the `.docdoc` file is not found or contains invalid JSON, the script will log a message and fall back to default settings. Default values will also be used for any options not specified in your `.docdoc` file.

**Important Notes on Configuration:**

*   **Directory Handling:** For `routesDir` and `validatorsDir`, if these directories do not exist when the script runs, they will be created automatically. However, the script expects them to be populated with relevant route or validator files for collection generation.
*   **Empty Directories or No Matching Files:** If `routesDir` or `validatorsDir` is empty, or if no files match the specified `routeFilePattern` or `validatorFilePattern`, the script will log this. This may result in an empty or incomplete Postman collection. Ensure your patterns correctly match your filenames and that the directories contain the necessary files.

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

### Configuration Options Details

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
    "auth": "Authentication endpoints for user login and token generation.",
    "user": "Endpoints for managing user accounts and profiles."
  }
}
```

### Configuration Options

| Option                | Description                                                             | Default              |
| --------------------- | ----------------------------------------------------------------------- | -------------------- |
| `apiPrefix`           | Prefix for API routes                                                   | `/api`               |
| `routesDir`           | Directory containing route files                                        | `src/routes`         |
| `validatorsDir`       | Directory containing validator files                                    | `src/validators`     |
| `outputFile`          | Path where the Postman collection will be saved                         | `postman.json`       |
| `baseUrl`             | Base URL for API requests                                               | `http://localhost:3000` |
| `collectionName`      | Name of the Postman collection                                          | `API Collection`     |
| `collectionDescription` | Description of the Postman collection                                   | Auto-generated       |
| `routeFilePattern`    | File pattern for route files                                            | `.routes.js`         |
| `validatorFilePattern` | File pattern for validator files                                        | `.validators.js`     |
| `authTokenName`       | The name of the Postman environment variable where the captured authentication token will be stored (e.g., `bearer_token`). This variable will be used in the Authorization header for other requests. | `token`              |
| `authTokenJsonPath`   | The JSON path (e.g., `data.token` or `access_token`) used to extract the token from the response body of the authentication endpoint. For example, if the login response is `{ "data": { "token": "abc123xyz" } }`, the path would be `data.token`. | `data.token`         |
| `enableTokenCapture`  | If `true`, a test script is added to authentication-related endpoints (identified by resource name 'auth' or 'authentication' for POST requests) to automatically capture a token. The token is then stored in a Postman environment variable. | `true`               |
| `zod`                 | Set to `true` to enable parsing of Zod validation schemas. If `zod` is `true` but a schema file does not appear to use Zod (i.e., no 'zod' import is detected), the script will attempt to parse it as a traditional schema. It's recommended to use one schema type consistently within a project. | `false`              |
| `exampleValues`       | Provide custom example values for request bodies, keyed by resource name. These values can be used to pre-fill request bodies for specific resources, overriding the default generic examples or schema-based examples for those fields. | `{}`                 |
| `resourceDescriptions` | Allows you to provide custom descriptions for the folders generated in Postman, which group endpoints by resource. The key is the resource name (derived from the route filename), and the value is the description string. | `{}`                 |

All other settings will be populated with sensible defaults.

**Note on `exampleValues`:** The script attempts to generate examples from schemas first. `exampleValues` can be used to override these or provide examples when schemas are not detailed enough. For nested objects or arrays, you can provide the full structure in `exampleValues` for that resource.

## Validation Schema Support

The script supports two types of validation schemas. It looks for schema definitions like `const schemaName = { ... };` for traditional schemas, or `const schemaName = z.object().shape({ ... });` for Zod schemas (when `zod: true` is enabled).
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

### Schema Features Supported
*   **Default Values:** The script attempts to identify and use default values specified in your schemas (e.g., `default: 'someValue'` in traditional or `.default()` in Zod) when generating example request bodies.
*   **Enums:** Enumerated values (e.g., `enum: ['A', 'B']` in traditional or `z.enum()` in Zod) are also recognized and the first enum value is typically used in example request bodies.

## How It Works

### Intelligent Endpoint Naming
Endpoints in the generated Postman collection are intelligently named based on the HTTP method and the route path. For example, a `GET` request to `/users/:id` might be named 'Get User By Id', and a `POST` request to `/products` could be 'Create Product'. This helps in quickly identifying requests in Postman.

### Script Workflow
The `generate-postman.js` script follows this general workflow:
1.  Loads configuration from `.docdoc` or uses default settings.
2.  Scans the `validatorsDir` to load and parse all validation schemas (traditional or Zod).
3.  Scans the `routesDir` to find route files and parse endpoint definitions (method, path, associated schema).
4.  Generates the Postman collection structure, organizing endpoints into folders by resource name.
5.  Creates request details for each endpoint, including URL, headers, and example request bodies based on schemas or `exampleValues`.
6.  Adds token capture scripts if `enableTokenCapture` is true for relevant auth endpoints.
7.  Saves the complete collection to the specified `outputFile`.

## Project Structure Compatibility

The script is designed to work with Express projects that follow these conventions:

- Routes are defined in files ending with the pattern specified in `routeFilePattern` (default: `.routes.js`)
- Routes use Express Router with standard HTTP methods (get, post, put, delete, patch)
- Validators are defined in files ending with the pattern specified in `validatorFilePattern` (default: `.validators.js`)

**Note on Nested Routers:** The current version of the script is optimized for route files directly defining routes using `express.Router()`. It primarily expects route paths to be relative to the resource file (e.g., `router.get('/:id', ...)` in `user.routes.js` becomes `/user/:id`). If your project uses deeply nested Express routers or very complex path constructions that are not directly defined in the route files within `routesDir`, the script might not be able to discover or correctly interpret all routes. For such scenarios, you may need to simplify your routing structure or adapt the script.

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

## Use Cases and Examples

For a practical guide on how to configure and use DocGenerator, refer to the `examples/sample-project` directory. It provides a working example of a project setup and configuration, demonstrating how to integrate the script effectively.

## Troubleshooting

*   **Empty or Incomplete Collection:** If the generated collection is empty or missing expected endpoints, first check the 'Important Notes on Configuration' regarding `routesDir`, `validatorsDir`, and file patterns. Ensure these are correct and that the script has appropriate read permissions. Also, verify that your route files actually define Express routes using standard methods (e.g., `router.get()`, `router.post()`).
*   **Schema Not Parsed Correctly:** If example request bodies are not what you expect, ensure your schemas follow the supported formats (traditional or Zod as described under 'Validation Schema Support'). Check for syntax errors in your schema definitions. If using Zod, ensure `zod: true` is in your config and Zod is imported in your schema files. The script logs errors during schema parsing, so check the console output for clues.
*   **Token Capture Not Working:** If `enableTokenCapture` is true but tokens aren't being captured:
    *   Ensure the login/auth endpoint's route file is named to correctly identify it as an 'auth' or 'authentication' resource (e.g., `auth.routes.js`).
    *   Double-check the `authTokenJsonPath` in your config to ensure it accurately points to the token in the JSON response of your login endpoint.
    *   Verify the login request is successful (HTTP 200) in Postman, as the capture script only runs on successful responses.
*   **Check Console Output:** The script logs various messages during its execution, including errors or warnings. Always check the console output when troubleshooting issues, as it often provides specific information about what went wrong.

## Contributing

Contributions are welcome! If you'd like to improve DocGenerator, please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes, ensuring adherence to the project's coding style.
4.  If applicable, add or update tests for your changes.
5.  Open a Pull Request with a clear description of your contributions.

## License

MIT 