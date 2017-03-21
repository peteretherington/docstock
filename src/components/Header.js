import React from 'react';
import { Router, Route, browserHistory, Link } from 'react-router';

export default class Header extends React.Component {

	constructor() {
		super();
		this.state = {
			formToShow: '',
			email: '',
			password: '',
			confirm: ''
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
				.createUserWithEmailAndPassword(this.state.email, this.state.password)
				.then((userData) => {
					console.log(userData);
				});
			this.setState({
				formToShow: ''
			})
		}
		else {
			alert('Passwords do not match!');
		}
	}

	logIn(e) {
		e.preventDefault();
		firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
		.then((userData) => {
			console.log(userData);
			if (firebase.auth().currentUser !== null) {
				this.setState({
					formToShow: 'userOnline'
				})
			}
		});

	}

	logOut(e) {
		e.preventDefault();
		if (firebase.auth().currentUser !== null) {
			firebase.auth().signOut();
			this.setState({
				formToShow: ''
			})
		}
	}

	render() {
		let loginForm = '';
		if (this.state.formToShow === 'signup') {
			loginForm = (
				<form onSubmit={this.signUp} className='user-form'>
					<label htmlFor="email">Email: </label>
					<input type="email" name="email" onChange={this.handleChange}/>
					<label htmlFor="password">Password: </label>
					<input type="password" name="password" onChange={this.handleChange}/>
					<label htmlFor="confirm">Confirm Password:</label>
					<input type="password" name="confirm" onChange={this.handleChange}/>
					<button>Sign Up</button>
				</form>
			)
		}
		else if (this.state.formToShow === 'login') {
			loginForm = (
				<form onSubmit={this.logIn} className='user-form'>
					<div>
						<label htmlFor="email">Email: </label>
						<input type="email" name="email" onChange={this.handleChange} placeholder="example@domain.com"/>
					</div>
					<div>
						<label htmlFor="password">Password: </label>
						<input type="password" name="password" onChange={this.handleChange} placeholder="minimum 6 characters"/>
					</div>
					<button>Log In</button>
				</form>
			)
		} else if (this.state.formToShow === 'user-online') {
			loginForm = (
				<form onSubmit={this.logOut} className='userForm'>
					<span>{`${firebase.auth().currentUser.email}`}</span>
					<button>Log Out</button>
				</form>
			)
		}
		return (
			<div id="header-wrapper">
				<header className='top-header'>
					<h1 className='title'>Docstock</h1>
					<nav>
						<Link to='/'>Catalogue</Link>
						<ul>
							<li><a href="" className="signup" onClick={this.formToShow}>Sign Up</a></li>
							<li><a href="" className="login" onClick={this.formToShow}>Log In</a></li>
						</ul>
					</nav>
					{loginForm}
				</header>
			</div>
		)
	}
}