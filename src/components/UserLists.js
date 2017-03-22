import React from 'react'
import FavDoc from './FavDoc'

export default class UserLists extends React.Component {
	
	constructor() {
		super();
		this.state = {
			loggedIn: false,
			items: []
		}
		// this.addItem = this.addItem.bind(this);
	}

	// addItem() {
	// 	const docItem = {
	// 		id: this.state.movie.id,
	// 		title: this.state.movie.original_title,
	// 		poster: this.state.movie.poster_path
	// 	};
	// 	const dbRef = firebase.database().ref();
	// 	dbRef.push(docItem);
	// }

	removeItem(itemToRemove) {
		const dbRef = firebase.database().ref(itemToRemove);
		dbRef.remove();
	}

	componentDidMount() {
		// firebase.auth().onAuthStateChanged(user => {
		// 	if(user) {
		// 		this.setState({
		// 			loggedIn: true
		// 		})
		// 	}
		// });

		const dbRef = firebase.database().ref();
		dbRef.on('value', firebaseData => {
			const itemsArray = [];
			const itemsData = firebaseData.val();
			for(let itemKey in itemsData) {
				itemsData[itemKey].key = itemKey;
				itemsArray.push(itemsData[itemKey])
			}
			this.setState({
				items: itemsArray
			});
		});
	}

	render() {
		return (
			<div id="list-wrapper">
				<h2 className="list-header">Favourites</h2>
				<ul className="user-list">
					{this.state.items.map(item => {
						return <FavDoc data={item} key={item.key} remove={this.removeItem}/>
					})}
				</ul>
			</div>
		)
	}
}






// let userList;
// if (this.state.loggedIn === false) {
// 	userLists = (
// 		<ul className="user-list">
// 			<li>Sign in to start adding your favourite docs!</li>
// 		</ul>
// 	)
// }
// if (this.state.loggedIn === true) {
// 	userList = (
// 		<ul className="user-list">
// 			{/* Generate user list here */}
// 			{this.state.items.map((item,i) => {
// 				return <FavDoc data={item} key={i} />
// 			})}
// 		</ul>
// 	)
// }