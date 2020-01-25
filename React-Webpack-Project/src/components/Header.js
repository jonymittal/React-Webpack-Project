import React, { Component } from 'react'
import Auth from "./Auth";
import { withRouter } from "react-router-dom";
import logo from '../images/logo.png';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

class header extends Component {

    constructor(props) {
        super(props);

        this.handleNavigation = this.handleNavigation.bind(this);
        this.logoutConfirmBox = this.logoutConfirmBox.bind(this);
        this.logout = this.logout.bind(this);
    }

    handleNavigation() {
        window.location = "/admin/dashboard";
    }

    logoutConfirmBox() {
        confirmAlert({
            title: 'Logout',
            message: 'Are you sure you want to Logout ?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => { this.logout() }
                },
                {
                    label: 'No',
                    onClick: () => { return false }
                }
            ]
        });
    }

    logout() {
        localStorage.clear();
        Auth.logout(() => {
            this.props.history.push('/')
        });
    }

    render() {
        return (
            <header role="banner">
                <div className="header-logo">
                    <a onClick={() => this.handleNavigation()}><img src={logo} /></a>
                </div>
                <ul className="utilities">
                    <li className="users"><a onClick={() => this.props.history.push('/admin/profile')}>My Account</a></li>
                    <li className="logout warn"><a onClick={() => this.logoutConfirmBox()}>Log Out</a></li>
                </ul>
            </header>
        );
    }
}
export default withRouter(header);