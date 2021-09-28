// config for swagger access at http://localhost:3000/api-docs/
module.exports.options = {
    swaggerDefinition: {
        openapi: "3.0.1",
        info: {
            title: "NodeJS User CRUD Demo",
            version: "0.0.1",
            description:
                "This is a simple User CRUD API application made with Express, Passport and documented with Swagger",
            contact: {
                name: "Sovongsa Ly",
                email: "Sovongsa.ly@gmail.com",
            },
        },
        basePath: '/',
        components: {   //define security components to use for JWT authentication
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: 'ForgeRock Demo',

            },
        ],
    },
    apis: ["./routes/*.js"],
};

