import React from 'react';
import ReactDOM from 'react-dom';
import { ajax } from 'jquery';
import { Router, Route, browserHistory, Link } from 'react-router';

const apiKey = `f7f73863c7be588a60f461bdab97cff8`;

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
	                    <header>
	                        <h1>{this.state.movie.original_title}</h1>
	                        <h2>{this.state.movie.tagline}</h2>
	                        <p>{this.state.movie.overview}</p>
	                    </header>
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
                api_key: 'f012df5d63927931e82fe659a8aaa3ac',
                language: 'en-US',
                sort_by: 'popularity.desc',
                include_adult: false,
                include_video: false,
                page: 1,
                primary_release_year: 2016
            }
        })
        .then((movie) => {
			this.setState({movie})
        });
	}
}


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
			})};
		</div>
	)
} 


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
				<header className='top-header'>
					<h1>DocStock</h1>
					<nav>
						<Link to='/'>Catalogue</Link>
					</nav>
				</header>
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