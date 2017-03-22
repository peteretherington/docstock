import React from 'react'
import FavDoc from './FavDoc'

export default class UserLists extends React.Component {
	
	constructor() {
		super();
		this.state = {
			loggedIn: false,
			items: []
		}
	}

	removeItem(itemToRemove) {
		const userId = firebase.auth().currentUser.uid;
		const dbRef = firebase.database().ref(`users/${userId}/bookmarks/${itemToRemove}`);
		dbRef.remove();
	}

	componentDidMount() {
		firebase.auth().onAuthStateChanged(user => {
			if(user) {
				const userId = firebase.auth().currentUser.uid;
				const dbRef = firebase.database().ref(`/users/${userId}/bookmarks`);
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
				this.setState({
					loggedIn: true
				});
			} 
			else {
				this.setState({
					loggedIn: false,
					items: []
				})
			}
		});
	}

	render() {
		let userList;
		if (this.state.loggedIn === false) {
			userList = (
				<ul className="user-list">
					<li><span className="bold-details">Sign in</span> to start bookmarking!</li>
				</ul>
			)
		}
		if (this.state.loggedIn === true) {
			userList = (
				<ul className="user-list">
					{this.state.items.length !== 0 ? (this.state.items.map(item => {
						return <FavDoc data={item} key={item.key} remove={this.removeItem}/>
					})) : <li>Start bookmarking!</li>}
				</ul>
			)
		}
		return (
			<div id="list-wrapper">
				<h2 className="list-header">Bookmarks</h2>
				<ul className="user-list">
					{userList}
				</ul>
			</div>
		)
	}
}