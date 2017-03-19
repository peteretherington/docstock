// Require
import React from 'react';
import ReactDOM from 'react-dom';
import { ajax } from 'jquery';
import { Router, Route, browserHistory, Link } from 'react-router';
import Header from './components/Header';
import Footer from './components/Footer';

// Firebase
var config = {
	apiKey: "AIzaSyBOJhX0zU6yWn1rJkmTYHGHyCehPadt_R4",
	authDomain: "doc-stock.firebaseapp.com",
	databaseURL: "https://doc-stock.firebaseio.com",
	storageBucket: "doc-stock.appspot.com",
	messagingSenderId: "505626792795"
};
firebase.initializeApp(config);

// The Movie DB API Key
const apiKey = `f7f73863c7be588a60f461bdab97cff8`;

// Documentary Details Component
class DocDetails extends React.Component {
	
	constructor() {
        super();
        this.state = {
            movie: {

			}
		}
	}

	render() {
		return (
			<div>
	            <div className='movie-single__poster'>
	                <div className='movie-single__description'>
                        <h2>{this.state.movie.original_title}</h2>
                        <h3>{this.state.movie.tagline}</h3>
                        <p>{this.state.movie.overview}</p>
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
			    sort_by: `popularity.desc`,
			    with_genres: 99,
			    include_adult: `true`,
			    include_video: `false`,
			    page: `1`,
			    primary_release_year: `2000`
            }
        })
        .then((movie) => {
			this.setState({movie})
        });
	}
}

// Results (Catalogue)
const Catalogue = props => {
	return (
		<div className='movie-catalogue'>
			{props.movies.map( (movie, i) => {
				return (
					<div key={`movie-${i}`} className='movie-catalogue__movie'>
						<Link to={`/movie/${movie.id}`}>
							<img src={`http://image.tmdb.org/t/p/w500/${movie.poster_path}`} />
						</Link>
					</div>
				)
			})}
		</div>
	)
} 

// Main App
class App extends React.Component {
	
	constructor() {
		super();
		this.state = {
			movies: []
		}
	}

	render() {
		// console.log(this.state.movies);
		return (
			<div>
				<Header />
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
			    sort_by: `popularity.desc`,
			    with_genres: 99,
			    include_adult: `true`,
			    include_video: `false`,
			    page: `1`,
			    primary_release_year: `2000`
			}	
		})
		.then( data => {
				// console.log(data)
				this.setState({
					movies: data.results
				});
		});
	}
}


ReactDOM.render(<Router history={browserHistory}>
	<Route path='/' component={App}>
		<Route path='/movie/:movie_id' component={DocDetails} />
	</Route>
</Router>, document.getElementById('app'));