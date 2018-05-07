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

	componentDidMount() {
		firebase.auth().onAuthStateChanged((user)=>{
			if(user) {
				const user = firebase.auth().currentUser;
				const dbRef = firebase.database().ref(`/users/${user.uid}/bookmarks`);
				dbRef.on('value', (res) => {
					const dataArray = [];
					const userData = res.val(); // Store the data
					for(let key in userData) {
						userData[key].key = key; // Store the object ID inside of itself
						dataArray.push(userData[key]) // Push the object into an array
					}
					this.setState({
						items: dataArray
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

	removeItem(bookmarkID) {
		if (window.confirm("Are you sure you want to REMOVE this bookmark?")) {
			const user = firebase.auth().currentUser;
			const dbRef = firebase.database().ref(`users/${user.uid}/bookmarks/${bookmarkID}`);
			dbRef.remove();
		}
	}

	render() {
		let userList;
		if (this.state.loggedIn) {
			userList = (
				<ul className="user-list">
					{this.state.items.length !== 0 ? (this.state.items.map(item => {
						return <FavDoc data={item} key={item.key} remove={this.removeItem}/>
					})) : <li>Start bookmarking!</li>}
				</ul>
			)
			
		} else {
			userList = (
				<ul className="user-list">
					<li><span className="bold-details">Sign in</span> to start bookmarking!</li>
				</ul>
			)
		}
		return (
			<div id="list-wrapper">
				<h2 className="list-header">Bookmarks</h2>
					{userList}
			</div>
		)
	}
}