require('file-loader?name=[name].[ext]!./index.html');

import React from 'react';
import ReactDOM from 'react-dom';
import {
    ApolloClient,
    ApolloProvider,
    InMemoryCache
} from '@apollo/client';

import App from './App';

const client = new ApolloClient({
    uri: `${window.location.origin}/graphql`, //'http://localhost:4000/graphql',
    cache: new InMemoryCache({
        typePolicies: {
            Query: {
                fields: {
                    getBookings: {
                        keyArgs: false,
                        merge(existing={ cursor: 0, bookings: [] }, incoming) {
                            let newCache = Object.assign({}, existing);
                            newCache.cursor = incoming.cursor;
                            newCache.bookings = newCache.bookings.concat(incoming.bookings);
                            return newCache;
                        }
                    }
                }
            }
        }
    })
});

const appElement = document.getElementById('app');
ReactDOM.render(<ApolloProvider client={client}><App /></ApolloProvider>, appElement);
