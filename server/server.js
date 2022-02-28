const express = require('express');
const mysql = require('mysql2/promise');
const bluebird = require('bluebird');

require('dotenv').config({path: __dirname + '/../../.env-spruce'});

const { ApolloServer, gql } = require('apollo-server-express');
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core');
const http = require('http');

const { typeDefs, resolvers } = require('./schemas');

async function connect() {
    return await mysql.createConnection({
        host: process.env.MYSQL_HOST, || 'localhost',
        port: process.env.MYSQL_PORT, || 33066,
        user: process.env.MYSQL_USER, || 'apollo', 
        password: process.env.MYSQL_PASSWORD,
        database: 'spruce',
        Promise: bluebird
    });
}

async function startApolloServer(typeDefs, resolvers) {
    const app = express();

    if (process.env.NODE_ENV === 'production')
        app.use('/', express.static('client/dist'));

    const httpServer = http.createServer(app);

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: async () => ({ db: await connect() }),
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
    });

    await server.start();
    server.applyMiddleware({ app, path: '/graphql' });

    httpServer.listen({ port: process.env.SERVER_PORT }, () => {
        console.log(`GraphQL API at ${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`);
    });
}

startApolloServer(typeDefs, resolvers);
