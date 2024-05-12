// import { ApolloServer } from '@apollo/server';
// import { startStandaloneServer } from '@apollo/server/standalone';
// import { typeDefs } from './schema.js';
// import {getClient} from "./config/database.js"


// const resolvers = {
//   Query: {
//     users: async function () {
//       const usersCollection = getClient()?.db('users_db').collection('users');
//       const users = await usersCollection.find({});
//       return users.toArray();
//     }
//   }
// }

// const server = new ApolloServer({
//     typeDefs,
//     resolvers,
//   });
  

// const { url } = await startStandaloneServer(server, {
// listen: { port: 4000 },
// });
  
// console.log(`🚀  Server ready at: ${url}`);