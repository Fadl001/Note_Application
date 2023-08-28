"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = exports.typeDefs = void 0;
// schema.ts
const apollo_server_express_1 = require("apollo-server-express");
exports.typeDefs = (0, apollo_server_express_1.gql) `
  type Query {
    hello: String
  }
`;
exports.resolvers = {
    Query: {
        hello: () => 'Hello world!',
    },
};
// export default  { typeDefs, resolvers };
// import { ApolloServer, gql } from 'apollo-server-express';
// export const typeDefs = gql`
//   type Query {
//     hello: String
//   }
// `;
// export const resolvers = {
//   Query: {
//     hello: () => 'Hello world!',
//   },
// };
