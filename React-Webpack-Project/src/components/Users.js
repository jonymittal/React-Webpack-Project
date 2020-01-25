import React, { Component } from 'react';
import Header from './Header'
import Sidebar from './Sidebar'
import API from './API';
import ReactPaginate from 'react-paginate';
import Loader from 'react-loader-spinner';
import $ from 'jquery'

class Users extends Component {

	constructor() {
		super();
		this.state = {
			users: [],
			count: '',
			pageCount: 0,
			activepage: 0,
			isLoading: true,
			text: '',
			currentPage: 0
		}

		this.handlePageChange = this.handlePageChange.bind(this);
		this.handleSearchText = this.handleSearchText.bind(this);
		this.viewDetails = this.viewDetails.bind(this);
	}

	componentWillMount() {
		$(document).ready(function () {
			$(document).on('keypress', '#searchText', function (e) {
				if (e.which === 32 && !this.value.length) {
					e.preventDefault();
				}
			});
		});
	}

	componentDidMount() {

		API.getAllUsers(localStorage.getItem('access_token'), this.state.text, 0).then(response => {
			if (response.status === 200) {
				response.json()
					.then(
						(result) => {
							this.setState({
								users: result.data.users,
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
		API.getAllUsers(localStorage.getItem('access_token'), this.state.text, selected).then(response => {
			if (response.status === 200) {
				response.json()
					.then(
						(result) => {
							this.setState({
								users: result.data.users,
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

	handleSearchText(e) {

		if (e.target.id == "searchText") {

			this.setState({ text: e.target.value })

			API.getAllUsers(localStorage.getItem('access_token'), e.target.value, 0).then(response => {
				if (response.status === 200) {
					response.json()
						.then(
							(result) => {
								this.setState({
									users: result.data.users,
									count: result.data.count,
									pageCount: (result.data.count / 20)
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

	viewDetails(userId) {
		localStorage.setItem('userId', userId);
		this.props.history.push('/admin/userProfile');
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
										<h2 className="pull-left">User Management</h2>
										<div className="input-icons">
											<i className="fa fa-search icon"></i>
											<input type="text" placeholder="Email/FirstName" id="searchText" value={this.state.text} onChange={this.handleSearchText} />
										</div>
									</div>

									<div className="clear"></div>
								</div>
							</div>
							<div className="row">

							{this.state.users.length <= 0 ?
								<div className="notFound">
									<h3>No Users Found</h3>
								</div>
								:
								<div class="table-responsive">
									<table className="table">
										<thead>
											<tr>
												<th>S.No</th>
												<th>Name</th>
												<th>Email Address</th>
												<th>Phone Number</th>
												<th>Account Status</th>
												<th>Action</th>
											</tr>
										</thead>
										
										<tbody>
											{this.state.users.map((user, key) => (
												<tr key={key}>
													<td>{serialNumber = serialNumber + 1}</td>
													<td>{user.firstName} {user.lastName}</td>
													<td>{user.email}</td>
													<td>{user.countryCode} {user.phoneNo}</td>
													<td>{user.status == true ? <div style={{ color: 'green' }}>Active </div> : <div style={{ color: 'red' }}>Suspended</div>}</td>
													<td><button className="view-details" onClick={() => this.viewDetails(user.id)} >View Details</button></td>
												</tr>
											))}
										</tbody>
										
									</table>
								</div>
							}
								{this.state.users.length < 20 ? null :
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
				}
			</div>

		);
	}
}
export default Users;