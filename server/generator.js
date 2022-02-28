var mysql = require('mysql2/promise');
const bluebird = require('bluebird');
const { faker } = require('@faker-js/faker');
const moment = require('moment');

require('dotenv').config({ path: __dirname + '/../../.env-spruce' });

async function connect() {
    const client = await mysql.createConnection({
        host: process.env.MYSQL_HOST,// || 'localhost',
        port: process.env.MYSQL_PORT,// || 33066,
        user: process.env.MYSQL_USER,// || 'root',
        password: process.env.MYSQL_PASSWORD,// || 'password',
        database: 'spruce',
        Promise: bluebird
    });

    const ENTRIES = process.env.ENTRIES || 100;

    for (let i=0; i<ENTRIES; i++) {
        let name = faker.name.findName();
        let email = faker.internet.email(...name.split(' '));
        let query = `INSERT INTO SPRUCE(name, email, address, city, state, zipcode, booking_type, booking_date, booking_time)
            VALUES (
                '${name}',
                '${email}',
                '${faker.address.streetAddress()}',
                '${faker.address.city()}',
                '${faker.address.stateAbbr()}',
                ${faker.address.zipCode()},
                '${faker.random.arrayElement(['HOUSEKEEPING', 'DOG_WALK'])}',
                '${moment(faker.date.future()).format('YYYY-MM-DD')}',
                '${moment(faker.date.future()).format('HH:mm:ss')}'
            )`;
        client.query(query);
    }
}

connect();


