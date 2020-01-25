import React, { Component } from 'react';
import Header from './Header'
import Sidebar from './Sidebar'
import API from './API';
import ReactPaginate from 'react-paginate';
import Loader from 'react-loader-spinner';

class Booking extends Component {
    constructor() {
        super();

        this.state = {
            bookings: [],
            count: '',
            pageCount: 0,
            isLoading: true,
            currentPage: 0,
            text: '',
        }
        this.handlePageChange = this.handlePageChange.bind(this);
        this.handleSearchBar = this.handleSearchBar.bind(this);
        this.viewDetails = this.viewDetails.bind(this);
    }

    componentDidMount() {

        API.getAllBookings(localStorage.getItem('access_token'), this.state.text, 0).then(response => {
            if (response.status === 200) {
                response.json()
                    .then(
                        (result) => {
                            this.setState({
                                bookings: result.data.locationBookings,
                                count: result.data.count,
                                pageCount: (result.data.count / 20),
                                isLoading: false
                            })
                        });
            }
            else {
                response.json()
                    .then(
                        (result) => {
                            this.setState({ isLoading: false });
                            alert(result.message)
                        }
                    );
            }
        });
    }


    handlePageChange(data) {
        let selected = data.selected;

        API.getAllBookings(localStorage.getItem('access_token'), this.state.text, selected).then(response => {
            if (response.status === 200) {
                response.json()
                    .then(
                        (result) => {
                            this.setState({
                                bookings: result.data.locationBookings,
                                count: result.data.count,
                                pageCount: (result.data.count / 20),
                                currentPage: selected
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

    handleSearchBar(e) {

        if (e.target.id == "searchText") {
            this.setState({ text: e.target.value })

            API.getAllBookings(localStorage.getItem('access_token'), e.target.value, 0).then(response => {
                if (response.status === 200) {
                    response.json()
                        .then(
                            (result) => {
                                this.setState({
                                    bookings: result.data.locationBookings,
                                    count: result.data.count,
                                    pageCount: (result.data.count / 20)
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

    }

    viewDetails(bookingId) {
        localStorage.setItem('bookingId', bookingId)
        this.props.history.push('/admin/bookingdetails')
    }

    render() {
        var serialNumber = (this.state.currentPage * 20);
        return (
            <div className="main-page">
                <Header />
                <Sidebar />
                <div className="content_area container-fluid">
                    {this.state.isLoading ? <div style={{ position: 'fixed', top: '35%', left: '45%' }}>
                        <Loader type="Oval" color="#1aa79e" height={100} width={100}></Loader></div> :
                        <div className="table_area">
                            <div className="row">
                                <div className="user-list_main">
                                    <div className="detail-info">
                                        <h2 className="pull-left">Booking Management</h2>
                                        <div className="input-icons">
                                            <i className="fa fa-search icon"></i>
                                            <input type="text" placeholder="Property Name" id="searchText" value={this.state.text} onChange={this.handleSearchBar} />
                                        </div>
                                    </div>

                                    <div className="clear"></div>
                                </div>
                            </div>
                            <div className="row">
                                {this.state.bookings.length <= 0 ?
                                    <div className="notFound">
                                        <h3>No Bookings Found</h3>
                                    </div>
                                    :
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Booking ID</th>
                                                <th>Property Name</th>
                                                <th>Category</th>
                                                <th>Host</th>
                                                <th>Booked By</th>
                                                <th>Booking Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.bookings.map((booking, key) => (
                                                <tr key={key}>
                                                    <td>{serialNumber = serialNumber + 1}</td>
                                                    <td>{booking.location.name}</td>
                                                    <td>{booking.category.name}</td>
                                                    <td>{booking.location.user.firstName} {booking.location.user.lastName}</td>
                                                    <td>{booking.user.firstName} {booking.user.lastName}</td>
                                                    <td>{booking.bookingStatus.status}</td>
                                                    <td>
                                                        <button className="view-details" onClick={() => this.viewDetails(booking.id)} >View Details</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                }

                                {this.state.bookings.length < 20 ? null :
                                    <ReactPaginate previousLabel={"<<"}
                                        nextLabel={">>"}
                                        breakLabel={<a href="">...</a>}
                                        breakClassName={"break-me"}
                                        pageCount={this.state.pageCount}
                                        marginPagesDisplayed={2}
                                        pageRangeDisplayed={5}
                                        onPageChange={this.handlePageChange}
                                        containerClassName={"pagination"}
                                        subContainerClassName={"pages pagination"}
                                        activeClassName={"active"}
                                    />
                                }

                            </div>
                        </div>
                    }
                </div>
            </div>
        );
    }

}

export default Booking;



