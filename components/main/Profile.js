import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Image, FlatList, Button } from 'react-native'
import { connect } from 'react-redux';
import firebase from 'firebase';
require('firebase/firestore');

const Profile = ({ currentUser, posts, following, route }) => {
	const [userPosts, setUserPosts] = useState([]);
	const [user, setUser] = useState(null);
	const [isFollowing, setIsFollowing] = useState(false);

	const { uid } = route.params;

	useEffect(() => {
		if (uid === firebase.auth().currentUser.uid) {
			setUser(currentUser);
			setUserPosts(posts);
		} else {
			firebase.firestore().collection("users")
				.doc(uid)
				.get()
				.then(snapshot => {
					if (snapshot.exists) {
						setUser(snapshot.data());
					} else {
						console.log("User does not exist");
					}
				});

			firebase.firestore().collection('posts')
				.doc(uid)
				.collection('userPosts')
				.orderBy('created', 'desc')
				.get()
				.then(snapshot => {
					const posts = snapshot.docs.map(doc => {
						const data = doc.data();
						const id = doc.id;
						return { id, ...data }
					});
					setUserPosts(posts);
				})

			setIsFollowing(following.includes(uid));
		}
	}, [uid, following]);

	const renderPost = ({ item: post }) => {
		return (
			<View style={styles.imageContainer}>
				<Image source={{ uri: post.imgUrl }} style={styles.image} />
			</View>
		);
	}

	// TODO
	const onFollow = () => {
		firebase.firestore()
			.collection('following')
			.doc(firebase.auth().currentUser.uid)
			.collection('userFollowing')
			.doc(uid)
			.set({})
			.then(() => setIsFollowing(true));
	}


	// TODO
	const onUnfollow = () => {
		firebase.firestore()
			.collection('following')
			.doc(firebase.auth().currentUser.uid)
			.collection('userFollowing')
			.doc(uid)
			.delete()
			.then(() => setIsFollowing(false));
	}

	return (
		<View style={styles.container}>
			{user &&
				<View style={styles.userContainer}>
					<Text>{user.name}</Text>
					<Text>{user.email}</Text>

					{
						uid !== firebase.auth().currentUser.uid
							? (
								<View>
									{
										isFollowing
											? (
												<Button
													title="Following"
													onPress={onUnfollow}
												/>
											)
											: (
												<Button
													title="Follow"
													onPress={onFollow}
												/>
											)
									}
								</View>
							)
							: null
					}
				</View>
			}
			{userPosts &&
				<View style={styles.galleryContainer}>
					<FlatList
						numColumns={3}
						horizontal={false}
						data={userPosts}
						renderItem={renderPost}
						keyExtractor={post => post.id} />
				</View>
			}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	userContainer: {
		margin: 20
	},
	galleryContainer: {
		flex: 1
	},
	imageContainer: {
		flex: 1 / 3
	},
	image: {
		flex: 1,
		aspectRatio: 1
	}
});

const mapStateToProps = ({ user }) => {
	return {
		currentUser: user.currentUser,
		posts: user.posts,
		following: user.following
	}
};
export default connect(mapStateToProps, null)(Profile);