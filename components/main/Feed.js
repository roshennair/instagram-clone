import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Image, FlatList, Button } from 'react-native'
import { connect } from 'react-redux';

const Feed = ({ following, users, usersLoaded }) => {
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		let posts = [];
		if (usersLoaded === following.length) {
			for (let i = 0; i < following.length; i++) {
				const user = users.find(user => user.uid === following[i]);
				if (user) posts = [...posts, ...user.posts];
			}

			posts.sort((a, b) => a.created.toDate() - b.created.toDate());
			setPosts(posts);
		}
	}, [usersLoaded]);

	const renderPost = ({ item: post }) => {
		return (
			<View style={styles.containerImage}>
				<Text>{post.user.name}</Text>
				<Image source={{ uri: post.imgUrl }} style={styles.image} />
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<View style={styles.galleryContainer}>
				<FlatList
					numColumns={1}
					horizontal={false}
					data={posts}
					renderItem={renderPost}
					keyExtractor={post => post.id} />
			</View>
		</View>
	);
}


const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	galleryContainer: {
		flex: 1
	},
	imageContainer: {
		flex: 1
	},
	image: {
		flex: 1,
		aspectRatio: 1 / 1
	}
})

const mapStateToProps = ({ user, users }) => ({
	following: user.following,
	users: users.users,
	usersLoaded: users.usersLoaded
});
export default connect(mapStateToProps, null)(Feed);