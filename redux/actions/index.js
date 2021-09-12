import firebase from "firebase";
import {
	USER_FOLLOWING_STATE_CHANGE,
	USER_POSTS_STATE_CHANGE,
	USER_STATE_CHANGE,
	USERS_DATA_STATE_CHANGE,
	USERS_POSTS_STATE_CHANGE
} from "../constants/index";

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

export const fetchUserFollowing = () => {
	return dispatch => {
		firebase.firestore().collection('following')
			.doc(firebase.auth().currentUser.uid)
			.collection('userFollowing')
			.onSnapshot(snapshot => {
				const following = snapshot.docs.map(doc => doc.id);
				dispatch({ type: USER_FOLLOWING_STATE_CHANGE, following });
				for (let i = 0; i < following.length; i++) {
					dispatch(fetchUsersData(following[i]));
				}
			});
	}
}

export const fetchUsersData = uid => {
	return (dispatch, getState) => {
		const found = getState().users.users.some(user => user && (user.uid === uid));

		if (!found) {
			firebase.firestore().collection("users")
				.doc(uid)
				.get()
				.then(snapshot => {
					if (snapshot.exists) {
						const user = { ...snapshot.data(), uid: snapshot.id };
						dispatch({ type: USERS_DATA_STATE_CHANGE, user });
						dispatch(fetchUsersFollowingPosts(user.uid));
					} else {
						console.log("User does not exist");
					}
				});
		}
	}
}

export const fetchUsersFollowingPosts = uid => {
	return (dispatch, getState) => {
		firebase.firestore().collection('posts')
			.doc(uid)
			.collection('userPosts')
			.orderBy('created', 'desc')
			.get()
			.then(snapshot => {
				const uid = snapshot.docs[0].ref.path.split('/')[1];
				const user = getState().users.users.find(user => user.uid === uid);

				const posts = snapshot.docs.map(doc => {
					const data = doc.data();
					const id = doc.id;
					return { id, ...data, user }
				});
				dispatch({ type: USERS_POSTS_STATE_CHANGE, posts, uid });
			});
	}
}