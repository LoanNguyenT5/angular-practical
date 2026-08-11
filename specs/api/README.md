# API Specifications

This directory contains specifications for API contracts, endpoints, and data models used in the application.

## Purpose

API specifications serve as the contract between frontend and backend (or frontend and external services). They document:

- **Endpoints**: URL patterns, HTTP methods, and versioning
- **Request schemas**: Required and optional parameters, headers, body structure
- **Response schemas**: Success and error response formats, status codes
- **Validation rules**: Data type constraints, field requirements, business rules
- **Error handling**: Error codes, messages, and recovery strategies
- **Authentication**: Security requirements and token handling
- **Rate limiting**: Request quotas and throttling policies

## When to Create API Specifications

Create an API specification when:

- Integrating with a new external API or service
- Designing a new backend endpoint
- Documenting an existing API that lacks documentation
- Defining contracts before implementation (contract-first development)
- Troubleshooting integration issues

## Specification Structure

Each API specification should include:

### 1. Overview
Brief description of the API purpose and use cases.

### 2. Base URL
```
Production: https://api.example.com/v1
Staging: https://staging-api.example.com/v1
Local: http://localhost:3000/api/v1
```

### 3. Authentication
```
Type: Bearer Token
Header: Authorization: Bearer <token>
```

### 4. Endpoints

For each endpoint, document:

#### **GET /endpoint**
**Description**: Brief description of what the endpoint does

**Request**:
- **Headers**: Required headers (e.g., `Authorization`, `Content-Type`)
- **Query Parameters**:
  - `param1` (string, optional): Description
  - `param2` (number, required): Description
- **Path Parameters**:
  - `id` (string, required): Resource identifier

**Response**:
- **200 OK**: Success response
  ```json
  {
    "data": [...],
    "meta": {
      "total": 100,
      "page": 1
    }
  }
  ```
- **400 Bad Request**: Validation error
  ```json
  {
    "error": "Invalid parameter",
    "details": [...],
    "code": "VALIDATION_ERROR"
  }
  ```
- **401 Unauthorized**: Authentication failure
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

**Example**:
```bash
curl -X GET "https://api.example.com/v1/users?page=1" \
  -H "Authorization: Bearer <token>"
```

### 5. Data Models

Define reusable data structures:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string; // ISO 8601 date
}
```

### 6. Validation Rules

- `email`: Must be valid email format
- `id`: Positive integer
- `name`: String, 1-100 characters, required

### 7. Error Handling

Standard error response format:
```json
{
  "error": "Human-readable error message",
  "code": "ERROR_CODE",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

Common error codes:
- `VALIDATION_ERROR`: Input validation failed
- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource does not exist
- `RATE_LIMITED`: Too many requests

### 8. Rate Limiting
```
Rate Limit: 100 requests per minute per user
Headers:
  X-RateLimit-Limit: 100
  X-RateLimit-Remaining: 87
  X-RateLimit-Reset: 1640000000
```

### 9. Versioning
APIs should be versioned in the URL path (e.g., `/v1/`, `/v2/`) or via headers.

## Example API Specification

See the current project's usage:

**Todo API** (External - JSONPlaceholder):
- Base URL: `https://jsonplaceholder.typicode.com`
- Endpoint: `GET /todos`
- No authentication required
- Returns array of Todo objects
- See `src/app/services/todo.service.ts` for implementation

## Best Practices

1. **Keep specifications up-to-date**: Update specs when APIs change
2. **Use examples liberally**: Include request/response examples for clarity
3. **Document edge cases**: Explain behavior for empty results, errors, etc.
4. **Version your APIs**: Use semantic versioning for breaking changes
5. **Be consistent**: Follow the same structure across all API specs
6. **Validate early**: Define validation rules upfront to prevent bugs
7. **Design for errors**: Document all possible error scenarios
8. **Think about pagination**: Specify limits, offsets, or cursor-based pagination
9. **Consider caching**: Document cache headers and strategies
10. **Security first**: Always document authentication and authorization

## Tools and Formats

Consider using:
- **OpenAPI/Swagger**: For formal API definitions
- **Postman Collections**: For interactive API testing
- **GraphQL Schema**: For GraphQL APIs
- **Markdown**: For lightweight, readable documentation (like this file)

## Current Project Status

This is currently a **frontend-only** project that consumes the external JSONPlaceholder API. As the project evolves to include:
- Custom backend APIs
- Additional third-party integrations
- Microservices

...add detailed specifications to this directory.

## Related Documentation

- `/specs/architecture/frontend-architecture.md`: System architecture overview
- `/specs/features/`: Feature specifications that use these APIs
