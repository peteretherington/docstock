import React from 'react';
import { Router, Route, browserHistory, Link } from 'react-router';

export default class Header extends React.Component {

	constructor() {
		super();
		this.state = {
			formToShow: '',
			email: '',
			password: '',
			confirm: '',
			loggedIn: false
		};
		this.formToShow = this.formToShow.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.signUp = this.signUp.bind(this);
		this.logIn = this.logIn.bind(this);
		this.logOut = this.logOut.bind(this);
	}

	formToShow(e) {
		e.preventDefault();
		this.setState({
			formToShow: e.target.className
		})
	}

	handleChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		});
	}

	signUp(e) {
		e.preventDefault();
		if(this.state.password === this.state.confirm) {
			firebase.auth()
				.createUserWithEmailAndPassword(this.state.email, this.state.password);
			this.setState({
				formToShow: '',
				loggedIn: true
			})
		}
		else {
			alert('Passwords do not match!');
		}
	}

	logIn(e) {
		e.preventDefault();
		firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password);
		if (firebase.auth().currentUser !== null) {
			this.setState({
				loggedIn: true
			})
			alert('Logged In');
		}
	}

	logOut(e) {
		e.preventDefault();
		firebase.auth().signOut();
		this.setState({
			formToShow: '',
			loggedIn: false
		})
	}

	componentDidMount() {
		firebase.auth().onAuthStateChanged(user => {
			if(user) {
				this.setState({
					formToShow: '',
					loggedIn: true
				})
			}
		})
	}

	render() {
		let loginOptions;
		if (this.state.loggedIn === false) {
			loginOptions = (
				<ul className="user-options">
					<li><a href="" className="signup" onClick={this.formToShow}>Sign Up</a></li>
					<li><a href="" className="login" onClick={this.formToShow}>Log In</a></li>
				</ul>
			)
		}
		else if (this.state.loggedIn === true) {
			loginOptions = (
				<form onSubmit={this.logOut}>
					<ul className="user-options">
						<li>Welcome, <span className="user">{`${firebase.auth().currentUser.email}`}</span></li>
						<li><input type="submit" id="logout-button" value="Log Out"/></li>
					</ul>
				</form>
			)
		}

		let loginForm = '';
		if (this.state.formToShow === 'signup') {
			loginForm = (
				<form onSubmit={this.signUp} className="user-form">
					<h2 className="user-form__header">Sign Up</h2>
					<div>
						<label htmlFor="email">Email: </label>
						<input type="email" name="email" onChange={this.handleChange} placeholder="example@domain.com"/>
					</div>
					<div>
						<label htmlFor="password">Password: </label>
						<input type="password" name="password" onChange={this.handleChange} placeholder="minimum 6 characters"/>
					</div>
					<div>
						<label htmlFor="confirm">Confirm Password:</label>
						<input type="password" name="confirm" onChange={this.handleChange} placeholder="minimum 6 characters"/>
					</div>
					<button>Sign Up</button>
				</form>
			)
		}
		else if (this.state.formToShow === 'login') {
			loginForm = (
				<form onSubmit={this.logIn} className="user-form">
					<h2 className="user-form__header">Log In</h2>
					<div>
						<label htmlFor="email">Email: </label>
						<input type="email" name="email" onChange={this.handleChange} placeholder="example@domain.com"/>
					</div>
					<div>
						<label htmlFor="password">Password: </label>
						<input type="password" name="password" onChange={this.handleChange} placeholder="*********"/>
					</div>
					<button>Log In</button>
				</form>
			)
		}
		
		return (
			<div id="header-wrapper">
				<header className='top-header'>
					<h1 className='title'>Docstock</h1>
					<nav>
						<Link to='/'>Catalogue</Link>
						{loginOptions}
						{loginForm}
					</nav>
				</header>
			</div>
		)
	}
}