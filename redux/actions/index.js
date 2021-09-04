import firebase from "firebase";
import { USER_STATE_CHANGE } from "../constants/index";

export const fetchUser = () => {
	return dispatch => {
		firebase.firestore().collection("users")
			.doc(firebase.auth().currentUser.uid)
			.get()
			.then(user => {
				if (user.exists) {
					dispatch({
						type: USER_STATE_CHANGE,
						currentUser: user.data(),
					});
				} else {
					console.log("User does not exist");
				}
			});
	};
};