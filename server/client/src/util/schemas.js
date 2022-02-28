import { gql } from '@apollo/client';

const BOOKING_FRAGMENT = gql`
    fragment PublicBookingFields on Booking {
        name
        email
        address
        city
        state
        zipcode
        booking_type
        booking_date
        booking_time
    }
`;

const BOOKING_QUERY = gql`
    ${BOOKING_FRAGMENT}
    query BookingPage($offset: Int, $limit: Int) {
        getBookings(offset: $offset, limit: $limit) {
            cursor
            bookings {
                ID
                ...PublicBookingFields
            }
        }
    }
`;

const CREATE_BOOKING_MUTATION = gql`
    ${BOOKING_FRAGMENT}
    mutation CreateBooking(
        $name: String!,
        $email: String!,
        $address: String!,
        $city: String!,
        $state: String!,
        $zipcode: Int!,
        $booking_type: BookingType!,
        $booking_date: String!,
        $booking_time: String!
    ) {
        createBooking(
            name: $name,
            email: $email,
            address: $address,
            city: $city,
            state: $state,
            zipcode: $zipcode,
            booking_type: $booking_type,
            booking_date: $booking_date,
            booking_time: $booking_time
        ) {
            ID
            ...PublicBookingFields
        }
    }
`;

export { BOOKING_QUERY, CREATE_BOOKING_MUTATION };
