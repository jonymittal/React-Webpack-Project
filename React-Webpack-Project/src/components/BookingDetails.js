import React, { Component } from 'react';
import API from './API';
import Header from './Header'
import Sidebar from './Sidebar'
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import Loader from 'react-loader-spinner';
import moment from 'moment-timezone';

class BookingDetails extends Component {

    constructor() {
        super();

        this.state = {
            bookingId: localStorage.getItem('bookingId'),
            booking: {
                category: {},
                user: {},
                location: { locationImages: {}, user: {} },
                bookingStatus: {}
            },
            bookingStartDate: '',
            bookingEndDate: '',
            isLoading: true
        }
    }

    componentDidMount() {

        API.getBookingDetails(localStorage.getItem('access_token'), this.state.bookingId).then(response => {
            if (response.status === 200) {
                response.json()
                    .then(
                        (result) => {
                            console.log("locationBooking", result.data.locationBooking)
                            var startDate = moment.utc(result.data.locationBooking.startDate).local().format('MMM DD,YYYY HH:mm a');
                            var endDate = moment.utc(result.data.locationBooking.endDate).local().format('MMM DD,YYYY HH:mm a');
                            this.setState({
                                booking: result.data.locationBooking,
                                bookingStartDate: startDate,
                                bookingEndDate: endDate,
                                isLoading: false
                            })
                        });
            }
            else {
                response.json()
                    .then(
                        (result) => {
                            alert(result.message)
                        }
                    );
            }
        });
    }


    render() {
        return (
            <div className="main-page">
                <Header />
                <Sidebar />
                <div className="table_content">
                    {this.state.isLoading ? <div style={{ position: 'fixed', top: '35%', left: '45%' }}>
                        <Loader type="Oval" color="#1aa79e" height={100} width={100}></Loader></div> :

                        <div className="row">
                            <div className="col-lg-12">
                                <div className="user-list_main">
                                    <div className="detail-info">
                                        <div className="back-icons">
                                            <a onClick={() => this.props.history.push('/admin/bookings')}><i class="fa fa-arrow-left" aria-hidden="true"></i></a>
                                        </div>
                                        <h2 className="text-center">Booking Details</h2>
                                    </div>

                                    <div className="clear"></div>
                                </div>

                                <Carousel className="carousel_boxx"
                                    showArrows={true}
                                    showThumbs={true}
                                    width={'900px'}
                                    infiniteLoop={true}
                                    dynamicHeight={true}
                                >
                                    {this.state.booking.location.locationImages.map((images, index) => (
                                        <div key={index} className="propertyimg">
                                            <img src={API.getBaseURL() + '/' + images.image} />

                                        </div>
                                    ))}
                                </Carousel>


                                <div className="col-sm-2"></div>
                                <div className="col-lg-8">
                                    <table className="bookingtable">
                                        <tbody>
                                            <tr>
                                                <th>Category</th>
                                                <td>{this.state.booking.category.name}</td>
                                            </tr>
                                            <tr>
                                                <th>Location</th>
                                                <td>{this.state.booking.location.name}</td>
                                            </tr>
                                            <tr>
                                                <th>Owner Name</th>
                                                <td>{this.state.booking.location.user.firstName} {this.state.booking.location.user.lastName}</td>
                                            </tr>
                                            <tr>
                                                <th>Booked By</th>
                                                <td>{this.state.booking.user.firstName} {this.state.booking.user.lastName}</td>
                                            </tr>
                                            <tr>
                                                <th>Booking Status</th>
                                                <td>{this.state.booking.bookingStatus.status}</td>
                                            </tr>
                                            <tr>
                                                <th>Min People</th>
                                                <td>{this.state.booking.minPeople}</td>
                                            </tr>
                                            <tr>
                                                <th>Max People</th>
                                                <td>{this.state.booking.maxPeople}</td>
                                            </tr>
                                            <tr>
                                                <th>Start Date</th>
                                                <td>{this.state.bookingStartDate}</td>
                                            </tr>
                                            <tr>
                                                <th>End Date</th>
                                                <td>{this.state.bookingEndDate}</td>
                                            </tr>
                                            <tr>
                                                <th>Final Amount</th>
                                                <td>{this.state.booking.finalAmount}</td>
                                            </tr>
                                            <tr>
                                                <th>Currency</th>
                                                <td>{this.state.booking.currency}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        );
    }

}
export default BookingDetails;