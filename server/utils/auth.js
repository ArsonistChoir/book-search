const { ApolloServer, gql } = require('apollo-server');
const { authMiddleware } = require('./yourAuthFile');

// Define your GraphQL schema
const typeDefs = gql`
  type Query {
    protectedRoute: String
  }
`;

// Resolver for the protected route
const resolvers = {
  Query: {
    protectedRoute: (parent, args, context) => {
      // Access user data from context.user
      if (context.user) {
        return `You have access to this protected route, ${context.user.username}!`;
      } else {
        throw new Error('Unauthorized: You need to be logged in.');
      }
    },
  },
};

// Create Apollo Server instance with context function
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // Use authMiddleware to authenticate the request
    authMiddleware(req, null, () => {}); // Call with null response and a dummy next function

    // Access user data from req.user in the context
    return { user: req.user };
  },
});

// Start the server
server.listen().then(({ url }) => {
  console.log(`Server is running at ${url}`);
});
