import React from 'react';

export default class SearchBar extends React.Component {
	render() {
		return (
			<div id="search-wrapper">
				<form onSubmit={this.props.search} id="search-form">
					<input type="text" name="query" onChange={this.props.trackSearch} id="query" placeholder="search by title" />
					<span className="or">or</span>
					<input type="text" name="primary_release_year" onChange={this.props.trackSearch} id="primary_release_year" placeholder="search by year" />
					<select name="sort_by" onChange={this.props.trackSearch}>
						<option value="">Sort By...</option>
						<option value="popularity.desc">Popularity (default)</option>
						<option value="primary_release_date.asc">Release Date</option>
						<option value="vote_average.desc">Rating</option>
						<option value="title.asc">Title (A-Z)</option>
					</select>
					<input type="submit" value="🔍"/>
				</form>
			</div>
		)
	}
}