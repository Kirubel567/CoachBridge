import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Gulit API",
      version: "1.0.0",
      description: "API documentation for the Gulit project",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Gulit API Server",
      },
    ],
    components: {
      schemas: {
        User: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              example: "123e4567-e89b-12d3-a456-426614174000",
            },
            first_name: { type: "string", example: "Alice" },
            last_name: { type: "string", example: "Smith" },
            business_name: { type: "string", example: "LTD Trading" },
            email: {
              type: "string",
              format: "email",
              example: "alice@example.com",
            },
            phone_number: { type: "string", example: "+1234567890" },
            avatar_url: {
              type: "string",
              format: "uri",
              example: "https://example.com/avatar.jpg",
            },
            bio: { type: "string", example: "Loves hiking and cooking." },
            role: { type: "string", example: "buyer" },
            is_active: { type: "boolean", example: true },
            email_verified: { type: "boolean", example: true },
            phone_verified: { type: "boolean", example: true },
            business_id: { type: "string", example: "BL-12345" },
            TIN_number: { type: "string", example: "TIN-67890" },
            business_description: {
              type: "string",
              example: "We sell quality products.",
            },
            contact_email: {
              type: "string",
              format: "email",
              example: "alice@example.com",
            },
            contact_telegram: { type: "string", example: "@alice" },
            contact_whatsapp: { type: "string", example: "+1234567890" },
            contact_facebook: { type: "string", example: "alice.fb" },
            contact_instagram: { type: "string", example: "alice_insta" },
            contact_website: {
              type: "string",
              format: "uri",
              example: "https://alice.com",
            },
            contact_address: { type: "string", example: "123 Forest Lane" },
            created_at: {
              type: "string",
              format: "date-time",
              example: "2023-07-14T15:20:00Z",
            },
            updated_at: {
              type: "string",
              format: "date-time",
              example: "2023-07-15T10:10:00Z",
            },
          },
        },
      },
      securitySchemes: {},
    },
  },
  apis: ["./src/routes/*.routes.ts"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;