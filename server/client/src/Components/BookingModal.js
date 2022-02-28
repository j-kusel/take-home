import React from 'react';
import styled from 'styled-components';
import moment from 'moment';

import { useMutation, gql } from '@apollo/client';
import { BOOKING_QUERY, CREATE_BOOKING_MUTATION } from '../util/schemas';
import { useState } from 'react';
import validation from '../util/validation';

import SpruceButton from './Styled/SpruceButton';

const ConfirmButton = styled(SpruceButton)`
    float: right;
`;

const halfClass = `
    .half {
        .first {
            float: left;
            width: 45%;
            input {
                width: 90%;
            }
        }
        .last {
            float: right;
            width: 45%;
            input {
                width: 90%;
            }
        }
    }
`;

const StyledModal = styled.div`
    position: absolute;
    width: 600px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    padding: 20px;
    padding: 20px;
    background-color: white;
    border-color: gray;
    border-radius: 8px;
    box-shadow: 0px 0px 5px black;
    z-index: 100;
    h1 {
        margin: 0px 0px;
        margin-bottom: 10px;
        font-weight: normal;
    }
    
    td {
        padding: 4px 0px;
    }

    td:first-child {
        padding-right: 25px;
    }
    td:last-child {
        padding-left: 25px;
    }

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    input[type=number] {
        -moz-appearance: textfield;
    }

    input {
        font-size: 1.125em;
        padding: 4px;
    }

    select {
        font-size: 1.125em;
        width: 100%;
        background-color: white;
        border: 1px solid gray;
        border-radius: 2px;
        padding: 4px;
    }

    label {
        font-size: 0.8em;
    }

    ${halfClass}
`;

export default ({ closeModal }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [type, setType] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    const [createBooking, {error}] = useMutation(CREATE_BOOKING_MUTATION, {
        update(cache, { data: { createBooking } }) {
            cache.modify({
                fields: {
                    getBookings(cachedBookingPage) {
                        const cachedBookings = cachedBookingPage.bookings;
                        const newBooking = cache.writeQuery({
                            query: BOOKING_QUERY,
                            data: {
                                getBookings: Object.assign({ __typename: 'Booking' }, {
                                    cursor: cachedBookingPage.cursor, bookings: [createBooking]
                                })
                            }
                        });
                        let date = moment(parseInt(createBooking.booking_date, 10));
                        let time = moment(createBooking.booking_time, "HH:mm");
                        date.set('hour', time.get('hour'));
                        date.set('minute', time.get('minute'));

                        let pointer = 0;
                        while (pointer < cachedBookings.length) {
                            let oldDate = moment(parseInt(cachedBookings[pointer].booking_date, 10));
                            let oldTime = moment(cachedBookings[pointer].booking_time, "HH:mm");
                            oldDate.set('hour', oldTime.get('hour'));
                            oldDate.set('minute', oldTime.get('minute'));
                            if (!date.isAfter(oldDate))
                                break;
                            pointer++;
                        };

                        let newData = cachedBookings.slice();
                        newData.splice(pointer, 0, createBooking);
                        return { cursor: cachedBookingPage.cursor, bookings: newData };
                    }
                }
            });
        },
        onCompleted(data) {
            closeModal();
        }
    });

    const handleBooking = () => {
        if (!(
            validation(name, 255) &&
            validation(email, 255, 'email') &&
            validation(address, 255) &&
            validation(city, 255) &&
            validation(state, 2, 'state') &&
            validation(zipcode, 5, 'zipcode') &&
            type &&
            moment(date, 'MM/DD/YY').isValid() &&
            moment(time, 'HH:mm').isValid()
        )) return false;

        const variables = {
            name,
            email,
            address,
            city,
            state: state.toUpperCase(),
            zipcode: parseInt(zipcode, 10),
            booking_type: type,
            booking_date: moment(date, 'MM/DD/YY').toISOString(),
            booking_time: moment(time, 'HH:mm').toISOString() // '2022-02-25T23:15:00Z'
        };

        createBooking({ variables });
    }

    

    const form = (
        <table>
            <tbody>
                <tr>
                    <td>
                        <label>Name</label>
                        <br/>
                        <input type="text" value={name} onChange={e => setName(e.target.value)}></input>
                    </td>
                    <td>
                        <label>Booking Type</label>
                        <br/>
                        <select value={type} onChange={e => setType(e.target.value)}>
                            <option value=""></option>
                            <option value="DOG_WALK">Dog Walk</option>
                            <option value="HOUSEKEEPING">Housekeeping</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>
                        <label>Email</label>
                        <br/>
                        <input type="text" value={email} onChange={e => setEmail(e.target.value)}></input>
                    </td>
                    <td>
                        <label>Booking Date</label>
                        <br/>
                        <input type="text" placeholder={moment().format('MM/DD/YY')} value={date} onChange={e => setDate(e.target.value)}></input>
                    </td>
                </tr>
                <tr>
                    <td>
                        <label>Street Address</label>
                        <br/>
                        <input type="text" value={address} onChange={e => setAddress(e.target.value)}></input>
                    </td>
                    <td>
                        <label>Booking Time</label>
                        <br/>
                        <input type="text" placeholder={moment().format('HH:mm')} value={time} onChange={e => setTime(e.target.value)}></input>
                    </td>
                </tr>
                <tr>
                    <td>
                        <label>City</label>
                        <br/>
                        <input type="text" value={city} onChange={e => setCity(e.target.value)}></input>
                    </td>
                    <td></td>
                </tr>
                <tr style={{padding: '0px'}}>
                    <td className="half">
                        <div className="first">
                            <div>
                                <label>State</label>
                                <br/>
                                <input type="text" value={state} onChange={e => setState(e.target.value)}></input>
                            </div>
                        </div>
                        <div className="last">
                            <div>
                                <label>Zip code</label>
                                <br/>
                                <input type="number" value={zipcode} onChange={e => setZipcode(e.target.value)}></input>
                            </div>
                        </div>
                    </td>
                    <td></td>
                </tr>
            </tbody>
        </table>
    );

    return (<StyledModal>
        <h1>Create booking</h1>
        {form}
        <ConfirmButton onClick={handleBooking}>Create booking</ConfirmButton> 
    </StyledModal>);
}
