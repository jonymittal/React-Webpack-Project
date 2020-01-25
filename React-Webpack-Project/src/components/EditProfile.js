import React, { Component } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import API from './API';
import Loader from 'react-loader-spinner'
import defaultUser from '../images/user.png'

class EditProfile extends Component {

    constructor() {
        super();
        this.state = {
            user: JSON.parse(localStorage.getItem('adminProfile')),
            image: '',
            imagePreview: '',
            firstNameError: '',
            lastNameError: '',
            phoneNoError: '',
            isLoading: false,
        }

        this.handleField = this.handleField.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.updateProfile = this.updateProfile.bind(this);
        this.onImageChange = this.onImageChange.bind(this);
    }

    componentWillMount() {
        $(document).ready(function () {
            $(document).on('keypress', '#firstName', function (e) {
                if (e.which === 32 && !this.value.length) {
                    e.preventDefault();
                }
            });
        });

        $(document).ready(function () {
            $(document).on('keypress', '#lastName', function (e) {
                if (e.which === 32 && !this.value.length) {
                    e.preventDefault();
                }
            });
        });

        $(document).ready(function () {
            $(document).on('keypress', '#phoneNumber', function (e) {
                if (e.which === 32 && !this.value.length) {
                    e.preventDefault();
                }
            });
        });
    }


    handleField(e) {

        var x = document.getElementById("myDIV");
        x.style.display = "block";

        let userObj = this.state.user;

        if (e.target.id == 'firstName') {
            userObj.firstName = e.target.value;
        }

        if (e.target.id == 'lastName') {
            userObj.lastName = e.target.value;
        }

        if (e.target.id == 'phoneNumber') {
            userObj.phoneNo = e.target.value;
        }

        this.setState({ user: userObj })
    }

    handleValidation() {
        let firstNameError = "";
        let lastNameError = "";
        let phoneNoError = "";
        let formIsValid = true;

        if (this.state.user.firstName == "") {
            formIsValid = false;
            firstNameError = "First Name can't be empty";
        }

        if (this.state.user.lastName == "") {
            formIsValid = false;
            lastNameError = "Last Name can't be empty";
        }

        if (this.state.user.phoneNo == "") {
            formIsValid = false;
            phoneNoError = "Phone Number can't be empty";
        }

        this.setState({ firstNameError: firstNameError, lastNameError: lastNameError, phoneNoError: phoneNoError });
        return formIsValid;
    }

    updateProfile() {
        if (this.handleValidation()) {
            this.setState({ isLoading: true });

            var formData = {
                "id": this.state.user.id,
                "firstName": this.state.user.firstName,
                "lastName": this.state.user.lastName,
                "phoneNumber": this.state.user.phoneNo

            };

            API.updateProfile(localStorage.getItem('access_token'), JSON.stringify(formData)).then(response => {
                if (response.status === 200) {
                    response.json()
                        .then(
                            (result) => {
                                localStorage.setItem('adminProfile', JSON.stringify(result.data.user));
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

    onImageChange(e) {

        if (e.target.files && e.target.files[0]) {
            console.log("Image ", e.target.files[0])

            var validFileExtensions = [".jpg", ".jpeg", ".bmp", ".gif", ".png"];
            console.log(e.target.files[0].name.substr(e.target.files[0].name.lastIndexOf(".")))
            var blnValid = false;

            for (var i = 0; i < validFileExtensions.length; i++) {
                var sCurExtension = validFileExtensions[i];
                if (e.target.files[0].name.substr(e.target.files[0].name.lastIndexOf(".")).toLowerCase() == sCurExtension.toLowerCase()) {
                    blnValid = true;
                    break;
                }
            }
            if (blnValid) {
                this.updateProfilePicture(e.target.files[0])
            } else {
                alert("Please upload only image.")
                return false;
            }
        }
    }

    updateProfilePicture(file) {
        this.setState({ isLoading: true });
        API.updateProfilePicture(localStorage.getItem('access_token'), file, this.state.user.id).then(response => {
            if (response.status === 200) {
                response.json()
                    .then(
                        (result) => {
                            localStorage.setItem('adminProfile', JSON.stringify(result.data.user));
                            this.setState({ isLoading: false });
                            window.location.reload();
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


    onCancel() {
        this.props.history.push('/admin/editProfile');
    }

    render() {
        return (
            <div className="full-page">
                <Header />
                <Sidebar />
                {this.state.isLoading ? <div style={{ position: 'fixed', top: '35%', left: '45%' }}>
                    <Loader type="Oval" color="#1aa79e" height={100} width={100}></Loader></div> :
                    <div className="table_content">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="detail-info">
                                    <div className="back-icons">
                                        <a onClick={() => this.props.history.push('/admin/profile')}><i class="fa fa-arrow-left" aria-hidden="true"></i></a>
                                    </div>
                                    <h2 className="text-center"> Edit Profile</h2>
                                </div>

                                <div className="detail-section">
                                    <div className="col-lg-2"></div>
                                    <div className="col-lg-3">
                                        <div className="user_profile">
                                            {this.state.user.image == null ? <img src={defaultUser} /> :
                                                <img src={API.getBaseURL() + '/' + this.state.user.image} />
                                            }
                                        </div>

                                        <div className="upload-btn-wrapper">
                                            <button className="upload-picture">Change Profile Picture</button>
                                            <input type="file" onChange={this.onImageChange} />
                                        </div>
                                    </div>

                                    <div className="col-lg-6">
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <div className="form_box create_profile">

                                                    <div className="row">
                                                        <div className="col-md-3 text-right">
                                                            <label>First Name</label>
                                                        </div>
                                                        <div className="col-md-9">
                                                            <div className="form-group">
                                                                <input type="text" className="form-control" id="firstName" placeholder="First Name" value={this.state.user.firstName} onChange={this.handleField} />
                                                                <div style={{ fontSize: 12, color: "red" }}> {this.state.firstNameError}</div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="row">
                                                        <div className="col-md-3 text-right">
                                                            <label>Last Name</label>
                                                        </div>
                                                        <div className="col-md-9">
                                                            <div className="form-group">
                                                                <input type="text" className="form-control" id="lastName" placeholder="Last Name" value={this.state.user.lastName} onChange={this.handleField} />
                                                                <div style={{ fontSize: 12, color: "red" }}> {this.state.lastNameError}</div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="row">
                                                        <div className="col-md-3 text-right">
                                                            <label>Email</label>
                                                        </div>
                                                        <div className="col-md-9">
                                                            <div className="form-group">
                                                                <input type="text" className="form-control" id="email" placeholder="Email" value={this.state.user.email} disabled />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="row">
                                                        <div className="col-md-3 text-right">
                                                            <label>Phone Number</label>
                                                        </div>
                                                        <div className="col-md-9">
                                                            <div className="form-group">
                                                                <input type="text" className="form-control" id="phoneNumber" placeholder="Phone Number" value={this.state.user.phoneNo} onChange={this.handleField} />
                                                                <div style={{ fontSize: 12, color: "red" }}> {this.state.phoneNoError}</div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="row">
                                                        <div className="col-md-3"></div>
                                                        <div className="col-md-9">
                                                            <div className="account-btn">
                                                                <button className="update-btn" id="myDIV" style={{ display: 'none' }} onClick={() => this.updateProfile()} >Update</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }
}
export default EditProfile;