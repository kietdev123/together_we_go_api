module.exports = {
    servers: [
      {
          url: "{protocol}://{environment}",
          variables: {
              protocol: {
                  enum: [
                      "http",
                      "https"
                  ],
                  default: "http"
              },
              environment: {
                enum : [
                    "localhost:5000/api",
                    "together-we-go-api",
                ],
                default: "localhost:5000/api"
              }
          }
      }
  ]
};