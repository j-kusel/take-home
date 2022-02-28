import React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import BookingModal from './Components/BookingModal';
import SpruceButton from './Components/Styled/SpruceButton';
import { useQuery, useMutation, gql } from '@apollo/client';
import { useState } from 'react';
import { BOOKING_QUERY, CREATE_BOOKING_MUTATION } from './util/schemas';

import Logo from './logo.svg';

const StyledLogo = styled(Logo)`
    padding: 6px 10px;
    padding-bottom: 0px;
`;

const StyledMain = styled.div`    
    background-color: #ddd;
    padding: 0px 10px;
`;

const Header = styled.div`
    padding: 6px 0px;
    p {
        margin: 0px;
        padding-top: 6px;
        font-size: 1.25em;
    }
`;

const Table = styled.table`
    border-collapse: collapse;
    td {
        vertical-align: top;
    }
    tr {
        background-color: #eee;
        td {
            border-bottom: 2px solid #ddd;
            padding: 6px 10px;
            font-size: 0.8em;
        }
    }
    th {
        text-align: left;
        background-color: #ddd;
        padding: 6px 10px;
        font-weight: normal;
    }
    th:last-of-type {
        text-align: right;
    }
    
`;

const Blocker = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: black;
    opacity: 0.1;
`;

export default (props) => {

    const { loading, error, data, fetchMore } = useQuery(BOOKING_QUERY, { variables: { offset: 0, limit: 20 }});
    const [ modalActive, setModalActive ] = useState(false);
    const [ typeSorted, setTypeSorted ] = useState(0);
    const [ bookings, setBookings ] = useState([]);

    const mapData = (booking, i) => (
        <tr key={booking.ID}>
            <td>{booking.name}</td>
            <td>{booking.email}</td>
            <td>{booking.address}<br/>{booking.city}, {booking.state}, {booking.zipcode}</td>
            <td>{booking.booking_type === 'DOG_WALK' ? 'Dog Walk' : 'Housekeeping'}</td>
            <td>{moment(booking.booking_date, 'x').format('MMMM D, YYYY')} at {moment(booking.booking_time, 'HH:mm:ss').format('h:mm a')}</td>
        </tr>
    );

    var fetching = () => null;
        

    var content = <></>;
    var status = <></>;

    if (loading) status = <div><p>loading</p></div>;
    if (error) status = <div><p>error</p></div>;
    if (data) {
        fetching = () => fetchMore({
            variables: {
                offset: data.getBookings.bookings.length,
                limit: 20
            }
        }).then(a => console.log(a)).catch(e => console.log(e));

        content = typeSorted ? 
            data.getBookings.bookings
                .filter(b => b.booking_type === ['DOG_WALK', 'HOUSEKEEPING'][typeSorted-1])
                .map(mapData) :
            data.getBookings.bookings.map(mapData);
    }

    return (<>
        {modalActive ? (<>
            <Blocker onClick={() => setModalActive(false)}/>
            <BookingModal closeModal={() => setModalActive(false)}/>
        </>) : null}
        <div>
            <StyledLogo width={80} height={30}/>
        </div>
        <StyledMain>
            <div>
                <Header>
                    <p style={{float: 'left'}}>Bookings</p>
                    <SpruceButton style={{float: 'right'}} onClick={() => setModalActive(true)}>Create booking</SpruceButton>
                </Header>
                <br/>
                <Table>
                    <thead>
                        <tr>
                            <th>Customer</th>
                            <th>Email</th>
                            <th>Address</th>
                            <th>Booking Type <button onClick={() => setTypeSorted(prev => (prev+1) % 3)}>{typeSorted ? ((typeSorted===1) ? '🐕' : '🏠') : '▼'}</button></th>
                            <th>Booking Date/Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {content}
                    </tbody>
                </Table>
                <SpruceButton onClick={fetching}>More...</SpruceButton>
                {status}
            </div>
        </StyledMain>
    </>)
}
