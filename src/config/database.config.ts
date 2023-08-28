import dotenv from 'dotenv';

dotenv.config();

const USERNAME = process.env.DATABASE_USERNAME || '';
const PASSWORD = process.env.DATABASE_PASSWORD || '';
const MONGO_URL = process.env.DATABASE_URL;

const SERVER_PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 1234;

export const config = {
    mongo: {
        url: MONGO_URL
    },
    server: {
        port: SERVER_PORT,
    },
};

// import express from'express';
// import { ApolloServer } from 'apollo-server-express';
// import { typeDefs, resolvers } from '../schema';

// const app = express();

// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
// });

// server.applyMiddleware({ app });

// app.listen({ port: 4000 }, () =>
//   console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
// );