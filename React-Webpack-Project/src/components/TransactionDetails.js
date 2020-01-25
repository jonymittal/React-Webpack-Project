import React, { Component } from 'react';
import API from './API';
import Header from './Header'
import Sidebar from './Sidebar'
import Loader from 'react-loader-spinner';

class TransactionDetails extends Component {

    constructor() {
        super();
        this.state = {
            transactionId: localStorage.getItem('transactionId'),
            transaction: {
                locationBooking: { location: { user: {} }, user: {} },
                transactionStatus: {}
            },
            isLoading: true
        }
    }

    componentDidMount() {

        API.getTransactionDetails(localStorage.getItem('access_token'), this.state.transactionId).then(response => {
            if (response.status === 200) {
                response.json()
                    .then(
                        (result) => {
                            this.setState({
                                transaction: result.data.transaction,
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
                {this.state.isLoading ? <div style={{ position: 'fixed', top: '35%', left: '45%' }}>
                    <Loader type="Oval" color="#1aa79e" height={100} width={100}></Loader></div> :
                    <div className="table_content">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="user-list_main">
                                    <div className="detail-info">
                                        <div className="back-icons">
                                            <a onClick={() => this.props.history.push('/admin/transaction')}><i class="fa fa-arrow-left" aria-hidden="true"></i></a>
                                        </div>
                                        <h2 className="text-center">Transaction Details</h2>

                                    </div>
                                    <div className="clear"></div>
                                </div>
                                <div class="card">
                                    <div className="card-input">
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <th>Location Name:</th>
                                                    <td>{this.state.transaction.locationBooking.location.name}</td>
                                                </tr>
                                                <tr>
                                                    <th>Transaction ID:</th>
                                                    <td>{this.state.transaction.transactionId}</td>
                                                </tr>
                                                <tr>
                                                    <th>Transaction Status:</th>
                                                    <td>{this.state.transaction.transactionStatus.status}</td>
                                                </tr>
                                                {this.state.transaction.refundTransactionId == null ? null :
                                                    <tr>
                                                        <th>Refund Transaction ID:</th>
                                                        <td>{this.state.transaction.refundTransactionId}</td>
                                                    </tr>
                                                }
                                                <tr>
                                                    <th>Host:</th>
                                                    <td>{this.state.transaction.locationBooking.location.user.firstName} {this.state.transaction.locationBooking.location.user.lastName}</td>
                                                </tr>
                                                <tr>
                                                    <th>Booked By:</th>
                                                    <td>{this.state.transaction.locationBooking.user.firstName} {this.state.transaction.locationBooking.user.lastName}</td>
                                                </tr>
                                            </tbody>
                                        </table>
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
export default TransactionDetails;