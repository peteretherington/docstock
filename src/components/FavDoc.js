import React from 'react'
import { Link } from 'react-router'

export default function FavDoc(props) {

	let bookmarkPath = `/movie/${props.data.id}`;

	const detectPage = ()=>{
		if (window.location.href.indexOf("movie") !== -1) {
			bookmarkPath = '/' + props.data.id;
			console.log('Movie has been found in the URL');
		}
	}

	return (
		<li className="doc-item">
			<Link to={bookmarkPath}><span className="item-title">{props.data.title}</span></Link>
			<button onClick={() => props.remove(props.data.key)} className="list-button"><i className="fa fa-times"></i></button>
		</li>
	)
}