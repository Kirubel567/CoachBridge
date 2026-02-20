import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CoachBridge API",
      version: "1.0.0",
      description: "API documentation for the CoachBridge project",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "CoachBridge API Server",
      },
    ],
    components: {
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid", example: "123e4567-e89b-12d3-a456-426614174000" },
            fullName: { type: "string", example: "Abel Tesfa" },
            email: { type: "string", format: "email", example: "abel@example.com" },
            role: { type: "string", example: "trainer" },
            createdAt: { type: "string", format: "date-time", example: "2026-02-20T15:12:00Z" },
            updatedAt: { type: "string", format: "date-time", example: "2026-02-20T15:12:00Z" },

            // Trainer optional fields
            bio: { type: "string", example: "I love helping clients reach their fitness goals." },
            yearsOfExperience: { type: "integer", example: 5 },
            certifications: { type: "array", items: { type: "string" }, example: ["CPT", "Nutrition Specialist"] },
            specialties: { type: "array", items: { type: "string" }, example: ["Strength Training", "Yoga"] },
            hourlyRate: { type: "number", example: 50.0 },
            contactInstagram: { type: "string", example: "@abeltrainer" },
            contactWebsite: { type: "string", example: "https://abelfitness.com" },
            contactTelegram: { type: "string", example: "@abel_telegram" },

            // Client optional fields
            dateOfBirth: { type: "string", format: "date", example: "1995-06-15" },
            heightCm: { type: "number", example: 175 },
            weightKg: { type: "number", example: 70 },
            fitnessGoals: { type: "array", items: { type: "string" }, example: ["Lose weight", "Build muscle"] },
            membershipActive: { type: "boolean", example: true }
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