const options = {
  definition:{
    openapi: "3.0.3", // present supported openapi version
  info: {
    title: "Swagger Document", // short title.
    description: "Swagger documentation of APIs", //  desc.
    version: "1.0.0", // version number
    contact: {
      name: "Shema Aimé Bayijahe", // your name
      email: "shemsonex@gmail.com", // your email
      url: "web.com", // your website
    },
  },
  servers: [
    {
      url: 'http://localhost:8000/',
      description: "Local server", //  desc.
    }
  ],
},
apis: ['backend/routes/*.js'],
}

export default options