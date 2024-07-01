const { ApolloServer, gql } = require('apollo-server');
const _ = require('lodash');

// Define types
const typeDefs = gql`
  type User {
    username: String!
    balance: Float!
  }

  type Query {
    getBalance(username: String!, password: String!): Float
  }

  type Mutation {
    createUser(username: String!, password: String!): User
    deposit(username: String!, amount: Float!): User
    withdraw(username: String!, password: String!, amount: Float!): User
    send(fromUsername: String!, fromPassword: String!, toUsername: String!, amount: Float!): User
  }
`;

// Empty database of users
const users = [];

// Define resolvers
const resolvers = {
  Query: {
    getBalance: (_, { username, password }) => {
      const user = users.find(u => u.username === username && u.password === password);
      if (!user) throw new Error('User and password combination do not match');
      return user.balance;
    },
  },
  Mutation: {
    createUser: (_, { username, password }) => {
      if (users.some(u => u.username === username)) {
        throw new Error('Username is already in use. Please choose another');
      }
      const newUser = { username, password, balance: 0 };
      users.push(newUser);
      return newUser;
    },
    deposit: (_, { username, amount }) => {
      if (amount <= 0) {
        throw new Error('Deposit amount must be a positive number');
      }
      const user = users.find(u => u.username === username);
      if (!user) throw new Error('User not found');
      user.balance += amount;
      return user;
    },
    withdraw: (_, { username, password, amount }) => {
        const user = users.find(u => u.username === username && u.password === password);
        if (!user) throw new Error('User not found or password incorrect');
        if (user.balance < amount) {
          throw new Error('Insufficient funds');
        }
        user.balance -= amount;
        return user;
      },
    send: (_, { fromUsername, fromPassword, toUsername, amount }) => {
        const fromUser = users.find(u => u.username === fromUsername && u.password === fromPassword);
        const toUser = users.find(u => u.username === toUsername);
        if (!fromUser) throw new Error('Sender not found or password incorrect');
        if (!toUser) throw new Error('Recipient not found');
        if (fromUser.balance < amount) {
          throw new Error('Insufficient funds');
        }
        fromUser.balance -= amount;
        toUser.balance += amount;
        return fromUser;
    },
  },
};

// Create the local Apollo Server
const server = new ApolloServer({ typeDefs, resolvers });

// Start the server
server.listen().then(({ url }) => {
  console.log(`Apollo server ready at ${url}`);
});
