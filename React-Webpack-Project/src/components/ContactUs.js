import React, { Component } from 'react';
import Header from './Header'
import Sidebar from './Sidebar'
import API from './API';
import ReactPaginate from 'react-paginate';
import Loader from 'react-loader-spinner';
import moment from 'moment-timezone';

class ContactUs extends Component {
    constructor() {
        super();
        this.state = {
            contactUs: [],
            count: '',
            pageCount: 0,
            isLoading: true,
            currentPage: 0
        }
        this.handlePageChange = this.handlePageChange.bind(this);
        this.viewDetails = this.viewDetails.bind(this);
    }

    componentDidMount() {

        API.getAllQuaries(localStorage.getItem('access_token'), 0).then(response => {
            if (response.status === 200) {
                response.json()
                    .then(
                        (result) => {
                            var list = result.data.contactUs;
                            for (var i in list) {
                                list[i].queryTime = moment.utc(list[i].createdAt).local().format('DD MMM-YYYY');
                            }
                            this.setState({
                                contactUs: list,
                                count: result.data.count,
                                pageCount: (result.data.count / 20),
                                isLoading: false
                            })
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


    handlePageChange(data) {
        let selected = data.selected;

        API.getAllQuaries(localStorage.getItem('access_token'), selected).then(response => {
            if (response.status === 200) {
                response.json()
                    .then(
                        (result) => {
                            var list = result.data.contactUs;
                            for (var i in list) {
                                list[i].queryTime = moment.utc(list[i].createdAt).local().format('DD MMM-YYYY');
                            }
                            this.setState({
                                contactUs: list,
                                count: result.data.count,
                                pageCount: (result.data.count / 20),
                                currentPage: selected
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

    viewDetails(contactId) {
        localStorage.setItem('contactId', contactId);
        this.props.history.push('/admin/queryDetails');
    }

    render() {
        var serialNumber = (this.state.currentPage * 20);
        return (
            <div className="main-page">
                <Header />
                <Sidebar />
                <div className="content_area container-fluid">
                    {this.state.isLoading ? <div style={{ position: 'fixed', top: '35%', left: '45%' }}>
                        <Loader type="Oval" color="#1aa79e" height={100} width={100}></Loader></div> :
                        <div className="table_area">
                            <div className="row">
                                <div className="user-list_main">
                                    <div className="detail-info">
                                        <h2 className="pull-left">Contact-Us Management</h2>
                                    </div>

                                    <div className="clear"></div>
                                </div>
                            </div>
                            <div className="row">
                                {this.state.contactUs.length <= 0 ?
                                    <div className="notFound">
                                        <h3>No Query Found</h3>
                                    </div>
                                    :
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>S.No</th>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Subject</th>
                                                <th>Date</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.contactUs.map((contact, key) => (
                                                <tr key={key}>
                                                    <td>{serialNumber = serialNumber + 1}</td>
                                                    <td>{contact.user.firstName} {contact.user.lastName}</td>
                                                    <td>{contact.email}</td>
                                                    <td>{contact.subject}</td>
                                                    <td>{contact.queryTime}</td>
                                                    <td><button className="view-details" onClick={() => this.viewDetails(contact.id)} >View Details</button></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                }
                                {this.state.contactUs.length < 20 ? null :
                                    <ReactPaginate previousLabel={"<<"}
                                        nextLabel={">>"}
                                        breakLabel={<a href="">...</a>}
                                        breakClassName={"break-me"}
                                        pageCount={this.state.pageCount}
                                        marginPagesDisplayed={2}
                                        pageRangeDisplayed={5}
                                        onPageChange={this.handlePageChange}
                                        containerClassName={"pagination"}
                                        subContainerClassName={"pages pagination"}
                                        activeClassName={"active"}
                                    />
                                }

                            </div>
                        </div>
                    }
                </div>
            </div>
        );
    }


}
export default ContactUs;