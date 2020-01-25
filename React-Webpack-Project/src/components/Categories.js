import React, { Component } from 'react';
import Header from './Header'
import Sidebar from './Sidebar'
import API from './API';
import ReactPaginate from 'react-paginate';
import Loader from 'react-loader-spinner';
import Modal from 'react-responsive-modal';
import $ from 'jquery'
import upload from '../images/upload.png'

class Categories extends Component {

    constructor() {
        super();
        this.state = {
            categories: [],
            count: '',
            pageCount: 0,
            isLoading: true,
            text: '',

            openEditCategoryModal: false,
            selectedCategory: {},
            editImage: null,
            editImagePreview: null,
            editCategoryNameError: '',

            openAddCategoryModal: false,
            newImage: null,
            newImagePreview: null,
            newCategoryName: '',
            newImageError: '',
            newCategoryNameError: ''
        }
        this.handlePageChange = this.handlePageChange.bind(this);
        this.handleSearchText = this.handleSearchText.bind(this);

        this.onOpenEditCategoryModal = this.onOpenEditCategoryModal.bind(this);
        this.onCloseEditCategoryModal = this.onCloseEditCategoryModal.bind(this);
        this.editCategoryImage = this.editCategoryImage.bind(this);
        this.handleEditCategoryName = this.handleEditCategoryName.bind(this);
        this.handleEditCategoryValidation = this.handleEditCategoryValidation.bind(this);
        this.editCategory = this.editCategory.bind(this);

        this.onOpenAddCategoryModal = this.onOpenAddCategoryModal.bind(this);
        this.onCloseAddCategoryModal = this.onCloseAddCategoryModal.bind(this);
        this.addCategoryImage = this.addCategoryImage.bind(this);
        this.handleNewCategoryName = this.handleNewCategoryName.bind(this);
        this.handleNewCategoryValidation = this.handleNewCategoryValidation.bind(this);
        this.addCategory = this.addCategory.bind(this);

    }

    componentWillMount() {
        $(document).ready(function () {
            $(document).on('keypress', '#searchText', function (e) {
                if (e.which === 32 && !this.value.length) {
                    e.preventDefault();
                }
            });
        });

        $(document).ready(function () {
            $(document).on('keypress', '#newCategoryName', function (e) {
                if (e.which === 32 && !this.value.length) {
                    e.preventDefault();
                }
            });
        });

        $(document).ready(function () {
            $(document).on('keypress', '#editCategoryName', function (e) {
                if (e.which === 32 && !this.value.length) {
                    e.preventDefault();
                }
            });
        });
    }

    componentDidMount() {

        API.findAllCategories(localStorage.getItem('access_token'), this.state.text, 0).then(response => {
            if (response.status === 200) {
                response.json()
                    .then(
                        (result) => {
                            this.setState({
                                categories: result.data.categories,
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
        API.findAllCategories(localStorage.getItem('access_token'), this.state.text, selected).then(response => {
            if (response.status === 200) {
                response.json()
                    .then(
                        (result) => {
                            this.setState({
                                categories: result.data.categories,
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

    handleSearchText(e) {

        if (e.target.id == "searchText") {

            this.setState({ text: e.target.value })

            API.findAllCategories(localStorage.getItem('access_token'), e.target.value, 0).then(response => {
                if (response.status === 200) {
                    response.json()
                        .then(
                            (result) => {
                                this.setState({
                                    categories: result.data.categories,
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
    }

    //************************Edit Category Work Start********************************** */

    onOpenEditCategoryModal(category) {
        this.setState({ openEditCategoryModal: true, selectedCategory: category });
    }

    onCloseEditCategoryModal() {
        this.setState({ openEditCategoryModal: false });
    }


    editCategoryImage(e) {

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
                this.setState({ editImage: e.target.files[0] });
                let reader = new FileReader();
                reader.onload = (e) => {
                    this.setState({ editImagePreview: e.target.result });
                };
                reader.readAsDataURL(e.target.files[0]);
            } else {
                alert("Please upload only image.")
                return false;
            }
        }
    }

    handleEditCategoryName(e) {
        var selected = this.state.selectedCategory;
        if (e.target.id === 'editCategoryName') {
            selected.name = e.target.value;
        }
        this.setState({ selectedCategory: selected });
    }

    handleEditCategoryValidation() {
        let editCategoryNameError = "";
        let formIsValid = true;

        if (this.state.selectedCategory.name == '') {
            formIsValid = false;
            editCategoryNameError = "Category Name field can't be empty";
        }
        this.setState({ editCategoryNameError: editCategoryNameError })
        return formIsValid;
    }

    editCategory() {
        if (this.handleEditCategoryValidation()) {

            this.setState({ isLoading: true })

            API.editCategory(localStorage.getItem('access_token'), this.state.selectedCategory.id, this.state.selectedCategory.name, this.state.editImage).then(response => {
                if (response.status === 200) {
                    response.json()
                        .then(
                            (result) => {
                                this.setState({ isLoading: false, openEditCategoryModal: false })
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


    //************************ADD Category Work Start********************************** */

    onOpenAddCategoryModal() {
        this.setState({ openAddCategoryModal: true });
    }

    onCloseAddCategoryModal() {
        this.setState({ openAddCategoryModal: false, newCategoryName: '', newImage: null });
    }

    addCategoryImage(e) {

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
                this.setState({ newImage: e.target.files[0] });
                let reader = new FileReader();
                reader.onload = (e) => {
                    this.setState({ newImagePreview: e.target.result });
                };
                reader.readAsDataURL(e.target.files[0]);
            } else {
                alert("Please upload only image.")
                return false;
            }
        }
    }

    handleNewCategoryName(e) {
        if (e.target.id === 'newCategoryName') {
            this.setState({ newCategoryName: e.target.value })
        }
    }

    handleNewCategoryValidation() {
        let newImageError = "";
        let newCategoryNameError = "";
        let formIsValid = true;

        if (this.state.newImage == null) {
            formIsValid = false;
            newImageError = "Please upload category image";
        }

        if (this.state.newCategoryName == "") {
            formIsValid = false;
            newCategoryNameError = "Category name field can't be empty";
        }

        this.setState({ newImageError: newImageError, newCategoryNameError: newCategoryNameError })
        return formIsValid;
    }

    addCategory() {
        if (this.handleNewCategoryValidation()) {
            this.setState({ isLoading: true })


            API.addCategory(localStorage.getItem('access_token'), this.state.newCategoryName, this.state.newImage).then(response => {
                if (response.status === 200) {
                    response.json()
                        .then(
                            (result) => {
                                var list = this.state.categories;
                                list.push(result.data.category)
                                this.setState({ isLoading: false, openAddCategoryModal: false })
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
                                        <h2 className="pull-left">Category Management</h2>
                                        <div className="input-icons category-mgnt">
                                            <i className="fa fa-search icon"></i>
                                            <input type="text" placeholder="Category Name" id="searchText" value={this.state.text} onChange={this.handleSearchText} />
                                            <button className="addCategory-btn" onClick={() => this.onOpenAddCategoryModal()}>Add Category</button>
                                        </div>
                                    </div>
                                    <div className="clear"></div>
                                </div>
                            </div>
                            <div className="row">
                                {this.state.categories.length <= 0 ?
                                    <div className="notFound">
                                        <h3>No Category Found</h3>
                                    </div>
                                    :
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Category ID</th>
                                                <th>Category Image</th>
                                                <th>Category Name</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.categories.map((category, key) => (
                                                <tr key={key}>
                                                    <td>{category.id}</td>
                                                    <td><img style={{ width: '60px', height: '60px', borderRadius: '50px' }} src={API.getBaseURL() + '/' + category.image} /></td>
                                                    <td>{category.name}</td>
                                                    <td>
                                                        <button className="edit-btn" onClick={() => this.onOpenEditCategoryModal(category)}>Edit</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                }
                                {this.state.categories.length < 20 ? null :
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
                    open={this.state.openEditCategoryModal}
                    onClose={this.onCloseEditCategoryModal}
                    center
                    styles={{ modal: { maxWidth: '600px', padding: 'unset' }, overlay: { background: 'rgba(255,255,255,0.6)', display: "block", padding: "250px" } }}
                >

                    <div className="modal-body edit_body">
                        <div className="decline_booking">
                            <div className="text-center head">
                                <h2>Edit Category</h2>
                            </div>
                            <div className="card-input">
                                <div class="avatar-preview text-center">
                                    {this.state.editImagePreview == null ? <img style={{ width: '120px', height: '120px', borderRadius: '100px' }} src={API.getBaseURL() + '/' + this.state.selectedCategory.image} />
                                        :
                                        <img style={{ width: '120px', height: '120px', borderRadius: '100px' }} src={this.state.editImagePreview} />
                                    }
                                    <div class="upload-btn-wrapper">
                                        <button class="upload-cat-image">Change Category Image</button>
                                        <input type="file" onChange={this.editCategoryImage} />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label for="title">Category Name</label>
                                    <input className="form-control" id="editCategoryName" maxLength="30" placeholder="Enter Category Name" value={this.state.selectedCategory.name} onChange={this.handleEditCategoryName} ></input>
                                    <div style={{ fontSize: 12, color: "red" }}> {this.state.editCategoryNameError}</div>
                                </div>
                            </div>
                            <button type="button" onClick={this.editCategory} className="btnn grad_btn edit_categooryy">update</button>
                        </div>
                    </div>
                </Modal>

                <Modal
                    open={this.state.openAddCategoryModal}
                    onClose={this.onCloseAddCategoryModal}
                    center
                    styles={{ modal: { maxWidth: '600px', padding: 'unset' }, overlay: { background: 'rgba(255,255,255,0.6)', display: "block", padding: "250px" } }}
                >

                    <div className="modal-body edit_body">
                        <div className="decline_booking">
                            <div className="text-center head">
                                <h2>Add Category</h2>
                            </div>
                            <div className="card-input">
                                <div class="avatar-preview text-center">
                                    {this.state.newImage != null ?
                                        <img style={{ width: '120px', height: '120px', borderRadius: '100px', border: '1px solid' }} src={this.state.newImagePreview} />
                                        :
                                        <img style={{ width: '120px', height: '120px', borderRadius: '100px', border: '1px solid' }} src={upload} />
                                    }
                                    <div class="upload-btn-wrapper">
                                        <button class="upload-cat-image">Upload Category Image</button>
                                        <input type="file" onChange={this.addCategoryImage} />
                                    </div>
                                    <div style={{ fontSize: 12, color: "red" }}> {this.state.newImageError}</div>
                                </div>

                                <div className="form-group">
                                    <label for="title">Category Name</label>
                                    <input className="form-control" id="newCategoryName" maxLength="30" placeholder="Enter Category Name" value={this.state.newCategoryName} onChange={this.handleNewCategoryName} ></input>
                                    <div style={{ fontSize: 12, color: "red" }}> {this.state.newCategoryNameError}</div>
                                </div>
                            </div>
                            <button type="button" onClick={this.addCategory} className="btnn grad_btn edit_categooryy">Add</button>
                        </div>
                        {this.state.isLoading ? <div style={{ position: 'fixed', top: '45%', left: '48%' }}>
                            <Loader type="Oval" color="#1aa79e" height={100} width={100}></Loader></div> : null
                        }
                    </div>
                </Modal>
            </div>

        );
    }
}
export default Categories;