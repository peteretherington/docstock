import React from 'react'
import { ajax } from 'jquery'
import { Router, Route, browserHistory, Link } from 'react-router'
import SearchBar from './SearchBar'

// The Movie DB API Key
const apiKey = `f7f73863c7be588a60f461bdab97cff8`;

// ******************
// DOC CATALOGUE ****
// ******************
const Catalogue = props => {
	return (
		<div id="catalogue-wrapper">
			<div className='movie-catalogue'>
				{props.movies.length !== 0 ? (props.movies.map((movie, i) => {
					return (
						<div key={`movie-${i}`} className='movie-catalogue__movie'>
							<Link to={`/movie/${movie.id}`}>
								<img src={`http://image.tmdb.org/t/p/w500/${movie.poster_path}`} />
							</Link>
						</div>
					)
				})) : <div id="no-results"><p>No results match your search.</p><p>Please try a different search.</p></div>}
			</div>
		</div>
	)
}

// ***************
// DOC FINDER ****
// ***************
export default class DocFinder extends React.Component {

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
	}

	render() {
		return (
			<div id="docfinder-wrapper">
				<SearchBar trackSearch={this.trackSearch} search={this.search} />
				{this.props.children || <Catalogue movies={this.state.movies} />}
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