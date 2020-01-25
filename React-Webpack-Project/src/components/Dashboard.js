import React, { Component } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import { Bar } from 'react-chartjs';
import API from './API';


const chartOptions = {
	responsive: false,
	scales: {
		yAxes: [{
			stacked: true,
			display: true,
			scaleLabel: {
				display: true,
				labelString: 'Value'
			},
			ticks: {
				display: false   
			}
		}]
	}
};

class Dashboard extends Component {

	constructor() {
		super();

		this.state = {
			usersCount: '',
			locationsCount: '',
			bookingsCount: '',
			text: '',
			data: {
				labels: ['Users', 'Locations', 'Bookings'],
				datasets: [{
					fillColor: "#2a3542",
					highlightFill: "#ddd",
					data: [0, 0, 0],
				}]
			},
		}
		this.viewUsersDetail = this.viewUsersDetail.bind(this);
		this.viewLocationsDetail = this.viewLocationsDetail.bind(this);
		this.viewBookingsDetail = this.viewBookingsDetail.bind(this);
	}

	componentDidMount() {

		let chartdata = this.state.data;

		API.getDashboard(localStorage.getItem('access_token')).then(response => {
			if (response.status == 200) {
				response.json()
					.then(
						(result) => {
							chartdata.datasets = [{ data: [result.data.usersCount, result.data.locationsCount, result.data.bookingsCount] }];
							this.setState({
								data: chartdata,
								usersCount: result.data.usersCount,
								locationsCount: result.data.locationsCount,
								bookingsCount: result.data.bookingsCount
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

	viewUsersDetail() {
		this.props.history.push('/admin/users')
	}

	viewLocationsDetail() {
		this.props.history.push('/admin/property')
	}

	viewBookingsDetail() {
		this.props.history.push('/admin/bookings')
	}

	render() {
		return (
			<div className="dashboard-screen">
				<Header />
				<Sidebar />
				<main role="main" className="main_content dashboard">
					<section className="panell important">
						<div className="top_box">
							<div className="row">
								<div className="col-sm-4">
									<div className="users-tab">
										<div className="white_boxxx">
											<div className="icons">
												<i className="fa fa-users fa-lg fa-5x"></i>

											</div>
											<div className="user_count">
												<p>Users</p>
												<h1>{this.state.usersCount}</h1>
											</div>
										</div>
									</div>

									<div className="panel-footer">
										<a onClick={() => this.viewUsersDetail()}>
											<span className="pull-left">View Details</span>
											<span className="pull-right"><i className="fa fa-arrow-circle-right"></i></span>
											<div className="clearfix"></div>
										</a>
									</div>

								</div>
								<div className="col-sm-4">
									<div className="locations-tab">
										<div className="white_boxxx">
											<div className="icons">
												<i className="fa fa-tasks fa-5x"></i>

											</div>
											<div className="user_count">
												<p>Locations</p>
												<h1>{this.state.locationsCount}</h1>
											</div>
										</div>
									</div>
									<div className="panel-footer">
										<a onClick={() => this.viewLocationsDetail()}>
											<span className="pull-left">View Details</span>
											<span className="pull-right"><i className="fa fa-arrow-circle-right"></i></span>
											<div className="clearfix"></div>
										</a>
									</div>
								</div>
								<div className="col-sm-4">
									<div className="bookings-tab">
										<div className="white_boxxx">
											<div className="icons">
												<i className="fa fa-shopping-cart fa-5x"></i>
											</div>
											<div className="user_count">
												<p>Bookings</p>
												<h1>{this.state.bookingsCount}</h1>
											</div>
										</div>
									</div>
									<div className="panel-footer">
										<a onClick={() => this.viewBookingsDetail()}>
											<span className="pull-left">View Details</span>
											<span className="pull-right"><i className="fa fa-arrow-circle-right"></i></span>
											<div className="clearfix"></div>
										</a>
									</div>
								</div>
							</div>
						</div>
					</section>
					<section className="panel important">
						<div className="graph">
							<Bar data={this.state.data} options={{ chartOptions, maintainAspectRatio: false }} width={500} height={600} />
						</div>
					</section>
				</main>
			</div>

		);
	}
}
export default Dashboard;