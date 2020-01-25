import React, { Component } from 'react';
import API from './API';
import $ from 'jquery';
import Auth from "./Auth";
import Loader from 'react-loader-spinner'
import logo from '../images/logo.png';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            emailError: '',
            passwordError: '',
            isLoading: false,
        };
        this.handleField = this.handleField.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    componentDidMount() {

        $('.nobeginningSpace').keypress(function (e) {
            if (e.which === 32)
                return false;
        });
    }

    handleField(e) {
        if (e.target.id == "email") {
            this.setState({ email: e.target.value })
        }
        if (e.target.id == "password") {
            this.setState({ password: e.target.value })
        }
    }

    handleValidation() {
        let emailError = "";
        let passwordError = "";
        let formIsValid = true;

        if (this.state.email == "") {
            formIsValid = false;
            emailError = "Email can't be empty";
        }
        else if (typeof this.state.email !== "undefined") {
            let lastAtPos = this.state.email.lastIndexOf('@');
            let lastDotPos = this.state.email.lastIndexOf('.');

            if (!(lastAtPos < lastDotPos && lastAtPos > 0 && this.state.email.indexOf('@@') == -1 && lastDotPos > 2 && (this.state.email.length - lastDotPos) > 2)) {
                formIsValid = false;
                emailError = "Email is not valid";
            }
        }

        if (this.state.password == "") {
            formIsValid = false;
            passwordError = "Password can't be empty";
        }
        this.setState({ emailError: emailError, passwordError: passwordError });
        return formIsValid;
    }

    handleSubmit() {
        if (this.handleValidation()) {

            var formdata = {
                "email": this.state.email,
                "password": this.state.password
            }
            console.log(formdata)

            this.setState({ isLoading: true });

            API.adminLogin(formdata).then(response => {
                if (response.status === 200) {
                    response.json()
                        .then(
                            (result) => {
                                console.log(result.data)
                                localStorage.setItem('access_token', result.data.access_token);
                                localStorage.setItem('adminProfile', JSON.stringify(result.data.user));
                                this.setState({ isLoading: false })
                                Auth.login(() => {
                                    this.props.history.push('/admin/dashboard')
                                });
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

    handleKeyPress(event) {
        if (event.key === 'Enter') {
            this.handleSubmit()
        }
    }

    render() {

        return (
            <div className="main_wrapper">
                {this.state.isLoading ? <div style={{ position: 'fixed', top: '35%', left: '45%' }}>
                    <Loader type="Oval" color="#1aa79e" height={100} width={100}></Loader></div> :
                    <div>
                        <div class="logo_header text-center">
                            <img src={logo} />
                        </div>
                        <div className="login-page">
                            <div className="form">
                                <div className="login-form">
                                    <h2>Log In</h2>
                                    <input type="text" className="nobeginningSpace" placeholder="Email" id='email' value={this.state.email} onChange={this.handleField} onKeyPress={this.handleKeyPress} />
                                    <div className="error" style={{ fontSize: 12, color: "red", float: "left", marginBottom: 15 }}> {this.state.emailError}</div>

                                    <input type="password" className="nobeginningSpace" placeholder="password" id='password' value={this.state.password} onChange={this.handleField} onKeyPress={this.handleKeyPress} />
                                    <div className="error" style={{ fontSize: 12, color: "red", float: "left", marginBottom: 15 }}> {this.state.passwordError}</div>

                                    <button type="submit" onClick={this.handleSubmit}>login</button>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default Login;
