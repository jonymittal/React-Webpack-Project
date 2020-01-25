import React, { Component } from 'react';
import API from './API';
import Header from './Header'
import Sidebar from './Sidebar'
import defaultUser from '../images/user.png'
import Loader from 'react-loader-spinner';

class userProfile extends Component {

    constructor() {
        super();

        this.state = {
            userId: localStorage.getItem("userId"),
            user: {},
            isLoading: true
        }
        this.updateStatus = this.updateStatus.bind(this)
    }

    componentDidMount() {

        API.getUserProfile(localStorage.getItem('access_token'), this.state.userId).then(response => {
            if (response.status === 200) {
                response.json()
                    .then(
                        (result) => {
                            this.setState({
                                user: result.data.user,
                                isLoading: false,
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

    updateStatus() {

        let confrm = false;
        if (this.state.user.status) {
            confrm = window.confirm("Do you want to suspend user account ?");
        }
        else {
            confrm = window.confirm("Do you want to activate user account ?");
        }
        if (confrm) {
            API.updateAccountStatus(localStorage.getItem('access_token'), this.state.userId).then(response => {
                if (response.status === 200) {
                    response.json()
                        .then(
                            (result) => {
                                this.setState({
                                    user: result.data.user
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
                                            <a onClick={() => this.props.history.push('/admin/users')}><i class="fa fa-arrow-left" aria-hidden="true"></i></a>
                                        </div>
                                        <h2 className="text-center">User Profile</h2>
                                    </div>

                                    <div className="clear"></div>
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
                                                <tr>
                                                    <th>Address</th>
                                                    <td>{this.state.user.residence}</td>
                                                </tr>
                                                <tr>
                                                    <th>Status</th>
                                                    <td>
                                                        {this.state.user.status == true ?

                                                            <button className="active-btn" onClick={() => this.updateStatus()}>Active</button>
                                                            :
                                                            <button className="suspend-btn" onClick={() => this.updateStatus()}>Suspended</button>
                                                        }
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        );
    }

}
export default userProfile;