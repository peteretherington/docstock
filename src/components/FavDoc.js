import React from 'react'

export default function FavDoc(props) {
	return (
		<li className="doc-item">
			<span className="item-title">{props.data.title}</span>
			<button onClick={() => props.remove(props.data.key)} className="list-button">X</button>
		</li>
	)
}