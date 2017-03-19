import React from 'react';

export default class SearchBar extends React.Component {
	
	constructor() {
		super();
		this.state = {
			query: [{
				items: [],
				keyword: "Bruce Lee",
				year: 2000
			}],
			name: "",
			item: ""
		}
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		});
		console.log(e.target.value);
	}

	render() {
		return (
			<div>
				<form action="">
					<input type="text" id="keywordSearch" placeholder="search by title" onChange={this.handleChange}/>
					<input type="text" id="yearSearch" placeholder="search by year" onChange={this.handleChange}/>
					<select name="sortBy" id="">
						<option value="sortByRlse">Release Date</option>
						<option value="sortByPop">Popularity</option>
						<option value="sortByRate">Rating</option>
					</select>
				</form>
			</div>
		)
	}
}