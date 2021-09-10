import React from 'react'
import { StyleSheet, Text, View, Image, FlatList } from 'react-native'
import { connect } from 'react-redux';

const Profile = ({ currentUser, posts }) => {
	const renderPost = ({ item: post }) => {
		return (
			<View style={styles.imageContainer}>
				<Image source={{ uri: post.imgUrl }} style={styles.image} />
			</View>
		);
	}

	return (
		<View style={styles.container}>
			{currentUser &&
				<View style={styles.userContainer}>
					<Text>{currentUser.name}</Text>
					<Text>{currentUser.email}</Text>
				</View>
			}
			{posts &&
				<View style={styles.galleryContainer}>
					<FlatList
						numColumns={3}
						horizontal={false}
						data={posts}
						renderItem={renderPost}
						keyExtractor={post => post.id} />
				</View>
			}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: 40
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
	console.log(user);
	return {
		currentUser: user.currentUser,
		posts: user.posts
	}
};
export default connect(mapStateToProps, null)(Profile);