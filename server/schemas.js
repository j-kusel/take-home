const { gql } = require('apollo-server-express');
const moment = require('moment');

const typeDefs = gql`
    type Query {
        getBookings(offset: Int, limit: Int): BookingPage
    }

    type Booking {
        ID: ID!
        name: String!
        email: String!
        address: String!
        city: String!
        state: String!
        zipcode: Int!
        booking_type: BookingType!
        booking_date: String!
        booking_time: String!
    }

    type BookingPage {
        cursor: Int
        bookings: [Booking]!
    }

    enum BookingType {
        HOUSEKEEPING
        DOG_WALK
    }

    type Mutation {
        createBooking(name: String!, email: String!, address: String!, city: String!, state: String!, zipcode: Int!, booking_type: BookingType!, booking_date: String!, booking_time: String!): Booking
    }
`;

const resolvers = {
    Query: {
        getBookings(_, { offset, limit }, context) {
            let query = 'SELECT * FROM SPRUCE ORDER BY booking_date ASC, booking_time ASC';
            if (limit)
                query += ` LIMIT ${offset}, ${limit}`;

            return context.db.query(query)
                .then(data => {
                    let cursor = limit ?
                        offset + limit :
                        data[0].length;
                    return { cursor, bookings: data[0] };
                });
        },
        
    },

    Mutation: {
        createBooking(_, { name, email, address, city, state, zipcode, booking_type, booking_date, booking_time }, context) {
            let query = `INSERT INTO SPRUCE(name, email, address, city, state, zipcode, booking_type, booking_date, booking_time)
            VALUES (
                '${name}',
                '${email}',
                '${address}',
                '${city}',
                '${state}',
                ${zipcode},
                '${booking_type}',
                '${moment(booking_date).format('YYYY-MM-DD')}',
                '${moment(booking_time).format('HH:mm:ss')}'
            )`;

            let response = context.db.query(query)
                .then(() => context.db.query("SELECT LAST_INSERT_ID();"))
                .then(result =>
                    context.db.query(`SELECT * FROM SPRUCE WHERE ID=${result[0][0]['LAST_INSERT_ID()']} LIMIT 1;`)
                )
                .then(result => result[0][0]);
            return response;
        },
    }
};


module.exports = { typeDefs, resolvers };
