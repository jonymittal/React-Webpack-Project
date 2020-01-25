import React, { Component } from 'react';
import API from './API';
import Header from './Header'
import Sidebar from './Sidebar'
import defaultUser from '../images/user.png'

class AdminProfile extends Component {

    constructor() {
        super();
        this.state = {
            user: JSON.parse(localStorage.getItem('adminProfile'))
        }
    }

    render() {
        return (
            <div>
                <Header />
                <Sidebar />
                <div className="table_content">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="detail-info">
                                <h2> Admin Profile</h2>
                            </div>

                            <div className="detail-section">
                                <div className="col-lg-2"></div>
                                <div className="col-lg-3">
                                    <div className="user_profile">
                                        {this.state.user.image == null ? <img src={defaultUser} /> :
                                            <img src={API.getBaseURL() + '/' + this.state.user.image} />
                                        }

                                    </div>
                                </div>

                                <div className="col-lg-6">
                                    <table>
                                        <tbody>
                                            <tr>
                                                <th>FirstName</th>
                                                <td>{this.state.user.firstName}</td>
                                            </tr>
                                            <tr>
                                                <th>LastName</th>
                                                <td>{this.state.user.lastName}</td>
                                            </tr>
                                            <tr>
                                                <th>Email</th>
                                                <td>{this.state.user.email}</td>
                                            </tr>
                                            <tr>
                                                <th>Phone number</th>
                                                <td>{this.state.user.countryCode}{this.state.user.phoneNo}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <button className="edit-profile-btn" onClick={() => this.props.history.push('/admin/editProfile')}>Edit Profile</button>
                                    <button className="edit-profile-btn" onClick={() => this.props.history.push('/admin/changePassword')}>Change Password</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default AdminProfile;