import React, { Component } from 'react';
import Header from './Header'
import Sidebar from './Sidebar'
import API from './API';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import Loader from 'react-loader-spinner';

class PropertyDetails extends Component {

    constructor() {
        super();

        this.state = {
            locationId: localStorage.getItem("locationId"),
            location: { locationImages: [] },
            isLoading: true
        }
    }

    componentDidMount() {

        API.getLocationDetails(localStorage.getItem('access_token'), this.state.locationId).then(response => {
            if (response.status === 200) {
                response.json()
                    .then(
                        (result) => {
                            this.setState({
                                location: result.data.location,
                                isLoading: false
                            })
                        });
            }
            else {
                response.json()
                    .then(
                        (result) => {
                            this.setState({ isLoading: false })
                            alert(result.message)
                        }
                    );
            }
        });
    }


    render() {
        return (
            <div>
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
                                            <a onClick={() => this.props.history.push('/admin/property')}><i class="fa fa-arrow-left" aria-hidden="true"></i></a>
                                        </div>
                                        <h2 className="text-center">Property Details</h2>
                                    </div>

                                    <div className="clear"></div>
                                </div>
                                <div>
                                    <Carousel className="carousel_boxx"
                                        showArrows={true}
                                        showThumbs={true}
                                        width={'900px'}
                                        infiniteLoop={true}
                                        dynamicHeight={true}
                                    >
                                        {this.state.location.locationImages.map((images, index) =>
                                            <div className="propertyimg">
                                                <img src={API.getBaseURL() + '/' + images.image} />
                                            </div>
                                        )}
                                    </Carousel>
                                </div>

                                <div className="locationinfo">
                                    <table className="bookingtable">
                                        <tbody>
                                            <tr>
                                                <th>Property Name</th>
                                                <td>{this.state.location.name}</td>
                                            </tr>
                                            <tr>
                                                <th>Address</th>
                                                <td>{this.state.location.streetAddress}</td>
                                            </tr>
                                            <tr>
                                                <th>Country</th>
                                                <td>{this.state.location.country}</td>
                                            </tr>
                                            <tr>
                                                <th>Owner Name</th>
                                                <td>{this.state.location.user.firstName} {this.state.location.user.lastName}</td>
                                            </tr>
                                            <tr>
                                                <th>Contact No.</th>
                                                <td>{this.state.location.user.phoneNo}</td>
                                            </tr>
                                            <tr>
                                                <th>Description</th>
                                                <td>{this.state.location.description}</td>
                                            </tr>
                                            <tr>
                                                <th>Type of location</th>
                                                <td>{this.state.location.typeOfLocation}</td>
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
export default PropertyDetails;