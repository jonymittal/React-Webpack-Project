import React, { Component } from 'react';
import Header from './Header'
import Sidebar from './Sidebar'
import API from './API';
import ReactPaginate from 'react-paginate';
import Loader from 'react-loader-spinner';
import Modal from 'react-responsive-modal';
import $ from 'jquery'

class Amenities extends Component {
    constructor() {
        super();
        this.state = {
            amenities: [],
            count: '',
            pageCount: 0,
            isLoading: true,

            openAddAmenityModal: false,
            newAmenityName: '',
            newAmenityNameError: '',

            openEditAmenityModal: false,
            selectedAmenity: {},
            editAmenityNameError: '',

        }
        this.handlePageChange = this.handlePageChange.bind(this);
        this.onOpenAddAmenityModal = this.onOpenAddAmenityModal.bind(this);
        this.onCloseAddAmenityModal = this.onCloseAddAmenityModal.bind(this);
        this.handleNewAmenityName = this.handleNewAmenityName.bind(this);
        this.handleNewAmenityValidation = this.handleNewAmenityValidation.bind(this);
        this.addAmenity = this.addAmenity.bind(this);

        this.onOpenEditAmenityModal = this.onOpenEditAmenityModal.bind(this);
        this.onCloseEditAmenityModal = this.onCloseEditAmenityModal.bind(this);
        this.handleEditAmenityName = this.handleEditAmenityName.bind(this);
        this.handleEditAmenityValidation = this.handleEditAmenityValidation.bind(this);
        this.editAmenity = this.editAmenity.bind(this);
    }

    componentWillMount() {
        $(document).ready(function () {
            $(document).on('keypress', '#newAmenity', function (e) {
                if (e.which === 32 && !this.value.length) {
                    e.preventDefault();
                }
            });
        });

        $(document).ready(function () {
            $(document).on('keypress', '#editAmenity', function (e) {
                if (e.which === 32 && !this.value.length) {
                    e.preventDefault();
                }
            });
        });
    }

    componentDidMount() {

        API.findAllAmenities(localStorage.getItem('access_token'), 0).then(response => {
            if (response.status === 200) {
                response.json()
                    .then(
                        (result) => {
                            this.setState({
                                amenities: result.data.amenities,
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
                            this.setState({ isLoading: false })
                            alert(result.message)
                        }
                    );
            }
        });
    }


    handlePageChange(data) {
        let selected = data.selected;

        API.findAllAmenities(localStorage.getItem('access_token'), selected).then(response => {
            if (response.status === 200) {
                response.json()
                    .then(
                        (result) => {
                            this.setState({
                                amenities: result.data.amenities,
                                count: result.data.count,
                                pageCount: (result.data.count / 20),
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

    onOpenAddAmenityModal() {
        this.setState({ openAddAmenityModal: true });
    }

    onCloseAddAmenityModal() {
        this.setState({ openAddAmenityModal: false, newAmenityName: '' });
    }

    handleNewAmenityName(e) {
        if (e.target.id === 'newAmenity') {
            this.setState({ newAmenityName: e.target.value })
        }
    }

    handleNewAmenityValidation() {
        let newAmenityNameError = "";
        let formIsValid = true;

        if (this.state.newAmenityName == "") {
            formIsValid = false;
            newAmenityNameError = "Amenity field can't be empty";
        }
        this.setState({ newAmenityNameError: newAmenityNameError })
        return formIsValid;
    }

    addAmenity() {
        if (this.handleNewAmenityValidation()) {

            this.setState({ isLoading: true })

            var formdata = {
                "amenity": this.state.newAmenityName
            }

            API.addAmenity(localStorage.getItem('access_token'), formdata).then(response => {
                if (response.status === 200) {
                    response.json()
                        .then(
                            (result) => {
                                var list = this.state.amenities;
                                list.push(result.data.amenities)
                                this.setState({ isLoading: false, openAddAmenityModal: false })
                                alert(result.message)
                                window.location.reload();
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

    onOpenEditAmenityModal(amenity) {
        this.setState({ openEditAmenityModal: true, selectedAmenity: amenity });
    }

    onCloseEditAmenityModal() {
        this.setState({ openEditAmenityModal: false });
    }

    handleEditAmenityName(e) {
        var selected = this.state.selectedAmenity;
        if (e.target.id === 'editAmenity') {
            selected.amenity = e.target.value;
        }
        this.setState({ selectedAmenity: selected });
    }

    handleEditAmenityValidation() {
        let editAmenityNameError = "";
        let formIsValid = true;

        if (this.state.selectedAmenity.amenity == '') {
            formIsValid = false;
            editAmenityNameError = "Amenity field can't be empty";
        }
        this.setState({ editAmenityNameError: editAmenityNameError })
        return formIsValid;
    }

    editAmenity() {
        if (this.handleEditAmenityValidation()) {
            this.setState({ isLoading: true })

            var formdata = {
                "id": this.state.selectedAmenity.id,
                "amenity": this.state.selectedAmenity.amenity
            }

            API.editAmenity(localStorage.getItem('access_token'), formdata).then(response => {
                if (response.status === 200) {
                    response.json()
                        .then(
                            (result) => {
                                this.setState({ isLoading: false, openEditAmenityModal: false, })
                                alert(result.message)
                                window.location.reload();
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
                                        <h2 className="pull-left">Amenities Management</h2>
                                        <div className="input-icons category-mgnt">
                                            <button className="addCategory-btn" onClick={() => this.onOpenAddAmenityModal()}>Add Amenity</button>
                                        </div>
                                    </div>
                                    <div className="clear"></div>
                                </div>
                            </div>
                            <div className="row">
                                {this.state.amenities.length <= 0 ?
                                    <div className="notFound">
                                        <h3>No Amenity Found</h3>
                                    </div>
                                    :
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Amenity ID</th>
                                                <th>Amenity</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.amenities.map((amenity, key) => (
                                                <tr key={key}>
                                                    <td>{amenity.id}</td>
                                                    <td>{amenity.amenity}</td>
                                                    <td><button className="edit-btn" onClick={() => this.onOpenEditAmenityModal(amenity)}>Edit Amenity</button></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                }
                                {this.state.amenities.length < 20 ? null :
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

                <Modal
                    open={this.state.openAddAmenityModal}
                    onClose={this.onCloseAddAmenityModal}
                    center
                    styles={{ modal: { maxWidth: '600px', padding: 'unset' }, overlay: { background: 'rgba(255,255,255,0.6)', display: "block", padding: "250px" } }}
                >

                    <div className="modal-body edit_body">
                        <div className="decline_booking">
                            <div className="text-center head">
                                <h2>Add Amenity</h2>
                            </div>
                            <div className="card-input">
                                <div className="form-group">
                                    <label for="title">Amenity</label>
                                    <input className="form-control" id="newAmenity" maxLength="25" placeholder="Enter amenity" value={this.state.newAmenityName} onChange={this.handleNewAmenityName} ></input>
                                    <div style={{ fontSize: 12, color: "red" }}> {this.state.newAmenityNameError}</div>
                                </div>
                            </div>
                            <button type="button" onClick={this.addAmenity} className="btnn grad_btn edit_categooryy">Add</button>
                        </div>
                        {this.state.isLoading ? <div style={{ position: 'fixed', top: '33%', left: '48%' }}>
                            <Loader type="Oval" color="#1aa79e" height={100} width={100}></Loader></div> : null
                        }
                    </div>
                </Modal>

                <Modal
                    open={this.state.openEditAmenityModal}
                    onClose={this.onCloseEditAmenityModal}
                    center
                    styles={{ modal: { maxWidth: '600px', padding: 'unset' }, overlay: { background: 'rgba(255,255,255,0.6)', display: "block", padding: "250px" } }}
                >

                    <div className="modal-body edit_body">
                        <div className="decline_booking">
                            <div className="text-center head">
                                <h2>Edit Amenity</h2>
                            </div>
                            <div className="card-input">
                                <div className="form-group">
                                    <label for="title">Amenity</label>
                                    <input className="form-control" id="editAmenity" maxLength="25" placeholder="Enter amenity" value={this.state.selectedAmenity.amenity} onChange={this.handleEditAmenityName}  ></input>
                                    <div style={{ fontSize: 12, color: "red" }}> {this.state.editAmenityNameError}</div>
                                </div>
                            </div>
                            <button type="button" className="btnn grad_btn edit_categooryy" onClick={this.editAmenity}>update</button>
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
export default Amenities;