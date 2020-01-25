import React, { Component } from 'react';
import API from './API';
import Header from './Header'
import Sidebar from './Sidebar'
import Modal from 'react-responsive-modal';
import Loader from 'react-loader-spinner';
import $ from 'jquery'

class QueryDetails extends Component {

    constructor() {
        super();
        this.state = {
            user: JSON.parse(localStorage.getItem('adminProfile')),
            contactId: localStorage.getItem('contactId'),
            contactUs: {},
            isLoading: true,
            open: false,
            message: '',
            messageError: ''
        }
        this.onOpenModal = this.onOpenModal.bind(this);
        this.onCloseModal = this.onCloseModal.bind(this);
        this.handleMessageField = this.handleMessageField.bind(this);
        this.handleValidation = this.handleValidation.bind(this);
        this.handleReply = this.handleReply.bind(this);
    }

    componentWillMount() {
        $(document).ready(function () {
            $(document).on('keypress', '#message', function (e) {
                if (e.which === 32 && !this.value.length) {
                    e.preventDefault();
                }
            });
        });
    }

    componentDidMount() {

        API.getQueryDetails(localStorage.getItem('access_token'), this.state.contactId).then(response => {
            if (response.status === 200) {
                response.json()
                    .then(
                        (result) => {
                            this.setState({
                                contactUs: result.data.contactUs,
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

    onOpenModal() {
        this.setState({ open: true });
    }

    onCloseModal() {
        this.setState({ open: false });
    }

    handleMessageField(e) {
        if (e.target.id === 'message') {
            this.setState({ message: e.target.value })
        }
    }

    handleValidation() {
        let messageError = "";
        let formIsValid = true;

        if (this.state.message == "") {
            formIsValid = false;
            messageError = "Message field can't be empty";
        }
        this.setState({ messageError: messageError })
        return formIsValid;
    }

    handleReply() {
        if (this.handleValidation()) {

            this.setState({ isLoading: true })

            var formData = {
                "to": this.state.contactUs.email,
                "body": this.state.message,
            }

            API.contactUsReply(localStorage.getItem('access_token'), formData).then(response => {
                if (response.status === 200) {
                    response.json()
                        .then(
                            (result) => {
                                this.setState({ isLoading: false, open: false, message: '' })
                                alert(result.message)
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
    }

    render() {
        return (
            <div>
                <Header />
                <Sidebar />
                {this.state.isLoading ? <div style={{ position: 'fixed', top: '40%', left: '45%' }}>
                    <Loader type="Oval" color="#1aa79e" height={100} width={100}></Loader></div> :
                    <div className="table_content">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="user-list_main">
                                    <div className="detail-info">
                                        <div className="back-icons">
                                            <a onClick={() => this.props.history.push('/admin/contactUs')}><i className="fa fa-arrow-left" aria-hidden="true"></i></a>
                                        </div>
                                        <h2 className="text-center">Query Details</h2>

                                    </div>
                                    <div className="clear"></div>
                                </div>

                                <div className="card">
                                    <div className="card-input">
                                        <form>
                                            <div className="form-group">
                                                <label htmlFor="title">Email</label>
                                                <input type="text" className="form-control" placeholder="Email Address" value={this.state.contactUs.email} />
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="title">Subject</label>
                                                <input type="text" className="form-control" placeholder="Subject" value={this.state.contactUs.subject} />

                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="title">Message</label>
                                                <textarea className="form-control" rows="8" placeholder="Message" value={this.state.contactUs.message} ></textarea>
                                            </div>

                                        </form>
                                    </div>
                                    <button className="reply-sctn" onClick={() => this.onOpenModal()}>Reply</button>
                                </div>

                            </div>
                        </div>
                    </div>
                }
                <Modal
                    open={this.state.open}
                    onClose={this.onCloseModal}
                    center
                    styles={{ modal: { maxWidth: '600px', padding: 'unset' }, overlay: { background: 'rgba(255,255,255,0.6)', display: "block", padding: "250px" } }}
                >

                    <div className="modal-body edit_body">
                        <div className="decline_booking">
                            <div className="text-center head">
                                <h2>Reply</h2>
                            </div>
                            <div className="card-input">
                                <div className="form-group">
                                    <label htmlFor="title">Message</label>
                                    <textarea className="form-control" rows="5" id="message" placeholder="Message" value={this.state.message} onChange={this.handleMessageField} ></textarea>
                                    <div style={{ fontSize: 12, color: "red" }}> {this.state.messageError}</div>
                                </div>
                            </div>
                            <button type="button" className="btnn grad_btn edit_categooryy" onClick={() => this.handleReply()}>Send</button>
                        </div>
                        {this.state.isLoading ? <div style={{ position: 'fixed', top: '33%', left: '48%' }}>
                            <Loader type="Oval" color="#1aa79e" height={100} width={100}></Loader></div> : null
                        }
                    </div>
                </Modal>
            </div>

        );
    }
}
export default QueryDetails;