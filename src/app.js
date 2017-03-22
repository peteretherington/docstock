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
		// this.removeItem = this.removeItem.bind(this);
	}

	addItem() {
		const docItem = {
			id: this.state.movie.id,
			title: this.state.movie.original_title,
			poster: this.state.movie.poster_path
		};
		const dbRef = firebase.database().ref();
		dbRef.push(docItem);
	}

	// removeItem(itemToRemove) {
	// 	const dbRef = firebase.database().ref(itemToRemove);
	// 	dbRef.remove();
	// }

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

		const dbRef = firebase.database().ref();
		dbRef.on('value', firebaseData => {
			const itemsArray = [];
			const itemsData = firebaseData.val();
			for(let itemKey in itemsData) {
				itemsData[itemKey].key = itemKey;
				itemsArray.push( itemsData[itemKey] )
			}
			this.setState({
				items: itemsArray
			});
		});
	}

	render() {
		return (
			<div id="docdetails-wrapper">
				<div className='movie-single__poster'>
					<div className='movie-single__description'>
						<h2>{this.state.movie.original_title}</h2>
						<h3>{this.state.movie.tagline}</h3>
						<p>Overview: {this.state.movie.overview}</p>
						<p>Release: {this.state.movie.release_date}</p>
						<p>Rating: {this.state.movie.vote_average}/10</p>
						<p>Votes: {this.state.movie.vote_count}</p>
						<button onClick={this.addItem} className="fb-button">Add Item</button>
						{/*<button onClick={() => this.state.remove(this.state.items)} className="fb-button">Remove Item</button>*/}
						{/*<button onClick={this.removeItem} className="fb-button">Remove Item</button>*/}
					</div>
					<div className='movie-single__image'>
						<img src={`http://image.tmdb.org/t/p/w500/${this.state.movie.poster_path}`} />
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
				<Header />
				{this.props.children || <DocFinder />}
				<UserLists />
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