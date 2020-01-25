import React from 'react'
import { Link } from 'react-router-dom'
import Auth from "./Auth";
import { withRouter } from "react-router-dom";

class Sidebar extends React.Component {

    constructor(props) {
        super(props);
        this.setState = {}
    }

    render() {
        return (
            <nav role='navigation'>
                <ul className="main">
                    <Link to='/admin/dashboard'><li className="dashboard"> <a>Dashboard</a></li></Link>
                    <Link to='/admin/users'><li className="users"> <a>User Management</a></li></Link>
                    <Link to='/admin/property'><li className="property"> <a>Property Management</a></li></Link>
                    <Link to='/admin/bookings'><li className="booking"> <a>Booking Management</a></li></Link>
                    <Link to='/admin/transaction'><li className="transactions"><a>Transaction Management</a></li></Link>
                    <Link to='/admin/categories'><li className="categories"><a>Category Management</a></li></Link>
                    <Link to='/admin/rules'><li className="rules"><a>Rules Management</a></li></Link>
                    <Link to='/admin/amenities'><li className="amenities"><a>Amenities Management</a></li></Link>
                    <Link to='/admin/contactUs'><li className="contactus"><a>Contact-Us Management</a></li></Link>
                </ul>
            </nav>

        );
    }
}

export default withRouter(Sidebar);
