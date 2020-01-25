import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Home from './Login'
import Dashboard from './Dashboard'
import Users from './Users'
import userProfile from './userProfile'
import Property from './Property'
import PropertyDetails from './PropertyDetails'
import Booking from './Booking'
import BookingDetails from './BookingDetails'
import AdminProfile from './AdminProfile'
import EditProfile from './EditProfile'
import ContactUs from './ContactUs'
import QueryDetails from './QueryDetails'
import Transaction from './Transaction'
import TransactionDetails from './TransactionDetails'
import Categories from './Categories'
import Rules from './Rules'
import Amenities from './Amenities'
import ChangePassword from './ChangePassword'
import ProtectedRoute from './ProtectedRoute'

const Main = () => (
    <main>
        <BrowserRouter >
            <Switch>
                <Route exact path='/' component={Home} />
                <ProtectedRoute path='/admin/dashboard' component={Dashboard} />
                <ProtectedRoute path='/admin/users' component={Users} />
                <ProtectedRoute path='/admin/userProfile' component={userProfile} />
                <ProtectedRoute path='/admin/property' component={Property} />
                <ProtectedRoute path='/admin/propertyDetails' component={PropertyDetails} />
                <ProtectedRoute path='/admin/bookings' component={Booking} />
                <ProtectedRoute path='/admin/bookingdetails' component={BookingDetails} />
                <ProtectedRoute path='/admin/profile' component={AdminProfile} />
                <ProtectedRoute path='/admin/editProfile' component={EditProfile} />
                <ProtectedRoute path='/admin/contactUs' component={ContactUs} />
                <ProtectedRoute path='/admin/queryDetails' component={QueryDetails} />
                <ProtectedRoute path='/admin/transaction' component={Transaction} />
                <ProtectedRoute path='/admin/transactionDetails' component={TransactionDetails} />
                <ProtectedRoute path='/admin/categories' component={Categories} />
                <ProtectedRoute path='/admin/amenities' component={Amenities} />
                <ProtectedRoute path='/admin/rules' component={Rules } />
                <ProtectedRoute path='/admin/changePassword' component={ChangePassword } />
            </Switch>
        </BrowserRouter>
    </main>
)

export default Main
