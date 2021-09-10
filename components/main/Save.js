import React, { useState } from 'react';
import { View, TextInput, Image, Button } from 'react-native';
import firebase from 'firebase/app';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUserPosts } from '../../redux/actions/index';

const Save = ({ route, navigation, fetchUserPosts }) => {
	const { image } = route.params;
	const [caption, setCaption] = useState('');

	const savePostData = imgUrl => {
		firebase.firestore()
			.collection('posts')
			.doc(firebase.auth().currentUser.uid)
			.collection('userPosts')
			.add({
				imgUrl,
				caption,
				created: firebase.firestore.FieldValue.serverTimestamp()
			})
			.then(() => {
				console.log('Done saving post')
				navigation.popToTop()
			});
	}

	const uploadImage = async () => {
		const res = await fetch(image);
		const imageBlob = await res.blob();

		const childPath = `posts/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`;
		const task = firebase
			.storage()
			.ref()
			.child(childPath)
			.put(imageBlob);

		const taskProgress = snapshot => {
			console.log(`Transferred: ${snapshot.bytesTransferred}`)
		}

		const taskError = snapshot => console.log(snapshot);

		const taskCompleted = () => {
			task.snapshot.ref.getDownloadURL().then(url => {
				savePostData(url);
				fetchUserPosts()
			});
		}

		task.on(
			firebase.storage.TaskEvent.STATE_CHANGED,
			taskProgress,
			taskError,
			taskCompleted
		);


	}

	return (
		<View style={{ flex: 1 }}>
			<Image source={{ uri: image }} />
			<TextInput
				placeholder="Write a caption..."
				onChangeText={setCaption} />
			<Button title="Save" onPress={uploadImage} />
		</View>
	)
}
const mapStateToProps = ({ user }) => ({ currentUser: user.currentUser });
const mapDispatchToProps = dispatch => bindActionCreators({ fetchUserPosts }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Save);