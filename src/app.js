// Require
import React from 'react'
import ReactDOM from 'react-dom'
import { ajax } from 'jquery'
import { Router, Route, browserHistory, Link } from 'react-router'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import Footer from './components/Footer'

// The Movie DB API Key
const apiKey = `f7f73863c7be588a60f461bdab97cff8`;

// Firebase **
// ***********
var config = {
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
            movie: {}
		}
	}

	render() {
		return (
			<div>
	            <div className='movie-single__poster'>
	                <div className='movie-single__description'>
                        <h2>{this.state.movie.original_title}</h2>
                        <h3>{this.state.movie.tagline}</h3>
                        <p>Overview: {this.state.movie.overview}</p>
                        <p>Release: {this.state.movie.release_date}</p>
                        <p>Rating: {this.state.movie.vote_average}/10</p>
                        <p>Votes: {this.state.movie.vote_count}</p>
	                </div>
	                <div className='movie-single__image'>
	                    <img src={`http://image.tmdb.org/t/p/w500/${this.state.movie.poster_path}`} />
	                </div>
	            </div>
			</div>
		)
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
        .then((movie) => {
			this.setState({movie})
        });
	}
}

// DOC CATALOGUE **
// ****************
const Catalogue = props => {
	return (
		<div className='movie-catalogue'>
			{props.movies.length !== 0 ? (props.movies.map((movie, i) => {
				return (
					<div key={`movie-${i}`} className='movie-catalogue__movie'>
						<Link to={`/movie/${movie.id}`}>
							<img src={`http://image.tmdb.org/t/p/w500/${movie.poster_path}`} />
						</Link>
					</div>
				)
			})) : <p id="noResults">No results match your search. Please try a different search</p>}
		</div>
	)
} 

// *************
// MAIN APP ****
// *************
class App extends React.Component {
	
	constructor() {
		super();
		this.state = {
			movies: [],
			query: ``,
			primary_release_year: ``,
			sort_by: ``
		}
		this.trackSearch = this.trackSearch.bind(this);
		this.search = this.search.bind(this);
	}

	trackSearch(e) {
		if (this.state.query != null) {
			this.setState({
				[e.target.name]: e.target.value,
			})
		}
	}

	search(e) {
		e.preventDefault();
		if (this.state.query) {
			ajax({
				url: `http://api.themoviedb.org/3/search/movie`,
				data: {
				    api_key: apiKey,
				    language: `en-US`,
				    include_video: `false`,
				    page: `1`,
				    with_genres: 99,
				    query: this.state.query
				}
			}).then(data => {
				this.setState({movies: data.results});
			});
		}
		else {
			ajax({
				url: `https://api.themoviedb.org/3/discover/movie`,
				data: {
				    api_key: apiKey,
				    language: `en-US`,
				    include_video: `false`,
				    page: `1`,
				    with_genres: 99,
				    primary_release_year: this.state.primary_release_year,
				    sort_by: this.state.sort_by
				}
			}).then(data => {
				this.setState({movies: data.results});
			});
		}
		console.log('New Search');
		console.log(this.state.query);
		console.log(this.state.primary_release_year);
		console.log(this.state.sort_by);

	}

	render() {
		return (
			<div>
				<Header />
				<SearchBar trackSearch={this.trackSearch} search={this.search}/>
				{this.props.children || <Catalogue movies={this.state.movies} />}
				<Footer />
			</div>
		)
	}

	componentDidMount() {
		ajax({
			url: `https://api.themoviedb.org/3/discover/movie`,
			data: {
			    api_key: apiKey,
			    language: `en-US`,
			    include_video: `false`,
			    page: `1`,
			    with_genres: 99,
			    primary_release_year: `2016`,
			    sort_by: `popularity.desc`
			}
		})
		.then(data => {
				this.setState({movies: data.results});
				// console.log(data.results);
		});
	}
}

// RENDER APP
// **********
ReactDOM.render(<Router history={browserHistory}>
	<Route path='/' component={App}>
		<Route path='/movie/:movie_id' component={DocDetails} />
	</Route>
</Router>, document.getElementById('app'));