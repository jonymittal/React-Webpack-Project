import React, { Component } from 'react';
import API from './API';
import Header from './Header'
import Sidebar from './Sidebar'
import Loader from 'react-loader-spinner';

class ChangePassword extends Component {

    constructor() {
        super();
        this.state = {
            userId: JSON.parse(localStorage.getItem('adminProfile')).id,
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
            oldPasswordError: '',
            newPasswordError: '',
            confirmPasswordError: '',
            isLoading: false
        };
        this.handleField = this.handleField.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
        this.handleValidation = this.handleValidation.bind(this);
    }


    handleField(e) {
        if (e.target.id === 'oldPassword') {
            this.setState({ oldPassword: e.target.value })
        }

        if (e.target.id === 'newPassword') {
            this.setState({ newPassword: e.target.value })
        }

        if (e.target.id === 'confirmPassword') {
            this.setState({ confirmPassword: e.target.value })
        }
    }

    handleValidation() {
        let oldPasswordError = "";
        let newPasswordError = "";
        let confirmPasswordError = "";
        let formIsValid = true;

        if (this.state.oldPassword == "") {
            formIsValid = false;
            oldPasswordError = "Old password field can't be empty";
        }

        if (this.state.newPassword == "") {
            formIsValid = false;
            newPasswordError = "New password field can't be empty";
        }

        if (this.state.confirmPassword == "") {
            formIsValid = false;
            confirmPasswordError = "Confirm password field can't be empty";
        }

        this.setState({ oldPasswordError: oldPasswordError, newPasswordError: newPasswordError, confirmPasswordError: confirmPasswordError })
        return formIsValid;
    }


    handlePassword() {
        if (this.handleValidation()) {

            if (this.state.newPassword != this.state.confirmPassword) {
                alert("New Passwords do not match.");
                return false;
            }

            this.setState({ isLoading: true });

            var formData = {
                "currentPassword": this.state.oldPassword,
                "newPassword": this.state.newPassword,
            }
            console.log(formData)

            API.changeAdminPassword(localStorage.getItem('access_token'), JSON.stringify(formData), this.state.userId).then(response => {
                if (response.status === 200) {
                    response.json()
                        .then(
                            (result) => {
                                console.log(result.message)
                                this.setState({ isLoading: false });
                                alert(result.message)
                                this.props.history.push('/admin/profile')
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
                            <div className="user-list_main">
                                <div className="detail-info">
                                    <div className="back-icons">
                                        <a onClick={() => this.props.history.push('/admin/profile')}><i className="fa fa-arrow-left" aria-hidden="true"></i></a>
                                    </div>
                                    <h2 className="text-center">Change Password</h2>
                                </div>
                                <div className="clear"></div>
                            </div>
                            <div className="col-lg-3"></div>
                            <div className="col-lg-6">
                                <div className="form_box change-password">

                                    <div className="row">
                                        <div className="col-md-3 text-right">
                                            <label>Old Password</label>
                                        </div>
                                        <div className="col-md-9">
                                            <div className="form-group">
                                                <input type="text" className="form-control" id="oldPassword" placeholder="Old Password" value={this.state.oldPassword} onChange={this.handleField} />
                                                <div style={{ fontSize: 12, color: "red" }}> {this.state.oldPasswordError}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-3 text-right">
                                            <label>New Password</label>
                                        </div>
                                        <div className="col-md-9">
                                            <div className="form-group">
                                                <input type="text" className="form-control" id="newPassword" placeholder="New Password" value={this.state.newPassword} onChange={this.handleField} />
                                                <div style={{ fontSize: 12, color: "red" }}> {this.state.newPasswordError}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-3 text-right">
                                            <label>Confirm Password</label>
                                        </div>
                                        <div className="col-md-9">
                                            <div className="form-group">
                                                <input type="text" className="form-control" id="confirmPassword" placeholder="Confirm New Password" value={this.state.confirmPassword} onChange={this.handleField} />
                                                <div style={{ fontSize: 12, color: "red" }}> {this.state.confirmPasswordError}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-3"></div>
                                        <div className="col-md-9">
                                            <div className="account-btn">
                                                <button className="update-btn" onClick={() => this.handlePassword()} >Update</button>
                                            </div>
                                        </div>
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
export default ChangePassword;