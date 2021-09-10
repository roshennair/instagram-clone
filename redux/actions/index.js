import firebase from "firebase";
import { USER_POSTS_STATE_CHANGE, USER_STATE_CHANGE } from "../constants/index";

export const fetchUser = () => {
	return dispatch => {
		firebase.firestore().collection("users")
			.doc(firebase.auth().currentUser.uid)
			.get()
			.then(snapshot => {
				if (snapshot.exists) {
					dispatch({
						type: USER_STATE_CHANGE,
						currentUser: snapshot.data(),
					});
				} else {
					console.log("User does not exist");
				}
			});
	};
};

export const fetchUserPosts = () => {
	return dispatch => {
		firebase.firestore().collection('posts')
			.doc(firebase.auth().currentUser.uid)
			.collection('userPosts')
			.orderBy('created', 'desc')
			.get()
			.then(snapshot => {
				const posts = snapshot.docs.map(doc => {
					const data = doc.data();
					const id = doc.id;
					return { id, ...data }
				});
				dispatch({ type: USER_POSTS_STATE_CHANGE, posts })
			})
	}
}