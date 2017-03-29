// Require
import React from 'react'
import ReactDOM from 'react-dom'
import { ajax } from 'jquery'
import { Router, Route, browserHistory, Link } from 'react-router'
import Header from './components/Header'
import DocFinder from './components/DocFinder'
import UserLists from './components/UserLists'
import Footer from './components/Footer'

// The Movie DB API Key
const apiKey = `f7f73863c7be588a60f461bdab97cff8`;

// *************
// Firebase ****
// *************
const config = {
	apiKey: "AIzaSyBOJhX0zU6yWn1rJkmTYHGHyCehPadt_R4",
	authDomain: "doc-stock.firebaseapp.com",
	databaseURL: "https://doc-stock.firebaseio.com",
	storageBucket: "doc-stock.appspot.com",
	messagingSenderId: "505626792795"
};
firebase.initializeApp(config);

// ****************
// DOC DETAILS ****
// ****************
class DocDetails extends React.Component {
	
	constructor() {
		super();
		this.state = {
			movie: {},
			items: []
		}
		this.addItem = this.addItem.bind(this);
	}

	addItem() {
		const docItem = {
			id: this.state.movie.id,
			title: this.state.movie.original_title
		};
		const userId = firebase.auth().currentUser.uid;
		const dbRef = firebase.database().ref(`/users/${userId}/bookmarks`);
		dbRef.push(docItem);
	}

	componentDidMount() {
		ajax({
			url: `https://api.themoviedb.org/3/movie/${this.props.params.movie_id}`,
			data: {
				api_key: apiKey,
				language: `en-US`,
				with_genres: 99,
				include_video: `false`,
				page: `1`,
				primary_release_year: `2016`,
				sort_by: `popularity.desc`
			}
		})
		.then(movie => {
			this.setState({movie})
		});

		firebase.auth().onAuthStateChanged(user => {
			if(user) {
				const userId = firebase.auth().currentUser.uid;
				const dbRef = firebase.database().ref(`/users/${user}/bookmarks`);
				dbRef.on('value', firebaseData => {
					const itemsArray = [];
					const itemsData = firebaseData.val();
					for(let itemKey in itemsData) {
						itemsData[itemKey].key = itemKey;
						itemsArray.push( itemsData[itemKey] )
					}
					this.setState({
						items: itemsArray
					})
				})
			}
		})
	}

	render() {
		let poster;
		let img = this.state.movie.poster_path;
		if (img !== null) {
			poster = 
				(
					<div className='movie-single__image'>
						<img src={`http://image.tmdb.org/t/p/w500/${this.state.movie.poster_path}`} />
					</div>
				);
		} else {
			poster = (
				<div className='movie-single__image'>
					<div className="brokenImage">
						<h2 className="brokenImage__title">{`${this.state.movie.original_title}`}</h2>
					</div>
				</div>
			)
		}
		console.log(poster);
		return (
			<div id="docdetails-wrapper">
				<div className='movie-single__poster'>
					<div className='movie-single__description'>
						<h2>{this.state.movie.original_title}</h2>
						<div className='inner-wrapper'>
							<div className='movie-single__content'>
								<h3>{this.state.movie.tagline}</h3>
								<p><span className="bold-details">Overview:</span> {this.state.movie.overview}</p>
								<p><span className="bold-details">Release:</span> {this.state.movie.release_date}</p>
								<p><span className="bold-details">Rating:</span> {this.state.movie.vote_average}/10</p>
								<p><span className="bold-details">Votes:</span> {this.state.movie.vote_count}</p>
								<button onClick={this.addItem} className="list-button">Bookmark</button>
							</div>
							{poster}
						</div>
					</div>
				</div>
			</div>
		)
	}
}

// *************
// MAIN APP ****
// *************
class App extends React.Component {
	render() {
		return (
			<div>
				<Header path={this.props.location.pathname}/>
				<UserLists />
				{this.props.children || <DocFinder />}
				<Footer />
			</div>
		)
	}
}

// ***************
// RENDER APP ****
// ***************
ReactDOM.render(<Router history={browserHistory}>
	<Route path='/' component={App}>
		<Route path='/movie/:movie_id' component={DocDetails} />
	</Route>
</Router>, document.getElementById('app'));