import React from 'react'

export default function FavDoc(props) {
	return (
		<li className="doc-item">
			{props.data.title}
			<button onClick={() => props.remove(props.data.key)}>Remove</button>
		</li>
	)
}