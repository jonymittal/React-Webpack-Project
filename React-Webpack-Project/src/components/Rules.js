import React, { Component } from 'react';
import Header from './Header'
import Sidebar from './Sidebar'
import API from './API';
import ReactPaginate from 'react-paginate';
import Loader from 'react-loader-spinner';
import Modal from 'react-responsive-modal';
import $ from 'jquery'

class Rules extends Component {
    constructor() {
        super();
        this.state = {
            rules: [],
            count: '',
            pageCount: 0,
            isLoading: true,

            openAddRuleModal: false,
            newRuleName: '',
            newRuleNameError: '',

            openEditRuleModal: false,
            selectedRule: {},
            editRuleNameError: '',

        }
        this.handlePageChange = this.handlePageChange.bind(this);
        this.onOpenAddRuleModal = this.onOpenAddRuleModal.bind(this);
        this.onCloseAddRuleModal = this.onCloseAddRuleModal.bind(this);
        this.handleNewRuleName = this.handleNewRuleName.bind(this);
        this.handleNewRuleValidation = this.handleNewRuleValidation.bind(this);
        this.addRule = this.addRule.bind(this);

        this.onOpenEditRuleModal = this.onOpenEditRuleModal.bind(this);
        this.onCloseEditRuleModal = this.onCloseEditRuleModal.bind(this);
        this.handleEditRuleName = this.handleEditRuleName.bind(this);
        this.handleEditRuleValidation = this.handleEditRuleValidation.bind(this)
        this.editRule = this.editRule.bind(this);
    }

    componentWillMount() {
        $(document).ready(function () {
            $(document).on('keypress', '#newRule', function (e) {
                if (e.which === 32 && !this.value.length) {
                    e.preventDefault();
                }
            });
        });

        $(document).ready(function () {
            $(document).on('keypress', '#editRule', function (e) {
                if (e.which === 32 && !this.value.length) {
                    e.preventDefault();
                }
            });
        });
    }

    componentDidMount() {

        API.findAllRules(localStorage.getItem('access_token'), 0).then(response => {
            if (response.status === 200) {
                response.json()
                    .then(
                        (result) => {
                            this.setState({
                                rules: result.data.rules,
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

        API.findAllRules(localStorage.getItem('access_token'), selected).then(response => {
            if (response.status === 200) {
                response.json()
                    .then(
                        (result) => {
                            this.setState({
                                rules: result.data.rules,
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

    onOpenAddRuleModal() {
        this.setState({ openAddRuleModal: true });

    }

    onCloseAddRuleModal() {
        this.setState({ openAddRuleModal: false, newRuleName: '' });
    }

    handleNewRuleName(e) {
        if (e.target.id === 'newRule') {
            this.setState({ newRuleName: e.target.value })
        }
    }

    handleNewRuleValidation() {
        let newRuleNameError = "";
        let formIsValid = true;

        if (this.state.newRuleName == "") {
            formIsValid = false;
            newRuleNameError = "Rule field can't be empty";
        }
        this.setState({ newRuleNameError: newRuleNameError })
        return formIsValid;
    }

    addRule() {
        if (this.handleNewRuleValidation()) {
            this.setState({ isLoading: true })

            var formdata = {
                "rule": this.state.newRuleName
            }

            API.addRule(localStorage.getItem('access_token'), formdata).then(response => {
                if (response.status === 200) {
                    response.json()
                        .then(
                            (result) => {
                                var list = this.state.rules;
                                list.push(result.data.rules)
                                this.setState({ isLoading: false, openAddRuleModal: false, newRuleName: '' })
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

    onOpenEditRuleModal(rule) {
        this.setState({ openEditRuleModal: true, selectedRule: rule });
    }

    onCloseEditRuleModal() {
        this.setState({ openEditRuleModal: false });
    }

    handleEditRuleName(e) {
        var selected = this.state.selectedRule;
        if (e.target.id === 'editRule') {
            selected.rule = e.target.value;
        }
        this.setState({ selectedRule: selected });
    }

    handleEditRuleValidation() {
        let editRuleNameError = "";
        let formIsValid = true;

        if (this.state.selectedRule.rule == '') {
            formIsValid = false;
            editRuleNameError = "Rule field can't be empty";
        }
        this.setState({ editRuleNameError: editRuleNameError })
        return formIsValid;
    }

    editRule() {
        if (this.handleEditRuleValidation()) {

            this.setState({ isLoading: true })

            var formdata = {
                "id": this.state.selectedRule.id,
                "rule": this.state.selectedRule.rule
            }

            API.editRule(localStorage.getItem('access_token'), formdata).then(response => {
                if (response.status === 200) {
                    response.json()
                        .then(
                            (result) => {
                                this.setState({ isLoading: false, openEditRuleModal: false, })
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
                                        <h2 className="pull-left">Rule Management</h2>
                                        <div className="input-icons category-mgnt">
                                            <button className="addCategory-btn" onClick={() => this.onOpenAddRuleModal()}>Add Rules</button>
                                        </div>
                                    </div>
                                    <div className="clear"></div>
                                </div>
                            </div>
                            <div className="row">
                                {this.state.rules.length <= 0 ?
                                    <div className="notFound">
                                        <h3>No Rules Found</h3>
                                    </div>
                                    :
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Rule ID</th>
                                                <th>Rule</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.rules.map((rule, key) => (
                                                <tr key={key}>
                                                    <td>{rule.id}</td>
                                                    <td>{rule.rule}</td>
                                                    <td><button className="edit-btn" onClick={() => this.onOpenEditRuleModal(rule)}>Edit Rule</button></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                }
                                {this.state.rules.length < 20 ? null :
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
                    open={this.state.openAddRuleModal}
                    onClose={this.onCloseAddRuleModal}
                    center
                    styles={{ modal: { maxWidth: '600px', padding: 'unset' }, overlay: { background: 'rgba(255,255,255,0.6)', display: "block", padding: "250px" } }}
                >

                    <div className="modal-body edit_body">
                        <div className="decline_booking">
                            <div className="text-center head">
                                <h2>Add Rule</h2>
                            </div>
                            <div className="card-input">
                                <div className="form-group">
                                    <label for="title">Rule</label>
                                    <input className="form-control" id="newRule" maxLength="100" placeholder="Enter rule" value={this.state.newRuleName} onChange={this.handleNewRuleName} ></input>
                                    <div style={{ fontSize: 12, color: "red" }}> {this.state.newRuleNameError}</div>
                                </div>
                            </div>
                            <button type="button" onClick={this.addRule} className="btnn grad_btn edit_categooryy">Add</button>
                        </div>
                        {this.state.isLoading ? <div style={{ position: 'fixed', top: '33%', left: '48%' }}>
                            <Loader type="Oval" color="#1aa79e" height={100} width={100}></Loader></div> : null
                        }
                    </div>
                </Modal>

                <Modal
                    open={this.state.openEditRuleModal}
                    onClose={this.onCloseEditRuleModal}
                    center
                    styles={{ modal: { maxWidth: '600px', padding: 'unset' }, overlay: { background: 'rgba(255,255,255,0.6)', display: "block", padding: "250px" } }}
                >

                    <div className="modal-body edit_body">
                        <div className="decline_booking">
                            <div className="text-center head">
                                <h2>Edit Rule</h2>
                            </div>
                            <div className="card-input">
                                <div className="form-group">
                                    <label for="title">Rule</label>
                                    <input className="form-control" id="editRule" maxLength="100" placeholder="Enter rule" value={this.state.selectedRule.rule} onChange={this.handleEditRuleName} ></input>
                                    <div style={{ fontSize: 12, color: "red" }}> {this.state.editRuleNameError}</div>
                                </div>
                            </div>
                            <button type="button" className="btnn grad_btn edit_categooryy" onClick={this.editRule}>Update</button>
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
export default Rules;