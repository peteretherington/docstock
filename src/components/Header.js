import React from 'react';
import { Router, Route, browserHistory, Link } from 'react-router';

export default class Header extends React.Component {
	render() {
		return (
			<div>
				<header className='top-header'>
					<h1 className='title'>Docstock</h1>
					<nav>
						<Link to='/'>Catalogue</Link>
					</nav>
				</header>
			</div>
		)
	}
}