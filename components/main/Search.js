import React, { useState } from 'react';
import { View, TextInput, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import firebase from 'firebase/app';
require('firebase/firestore');

const Search = ({ navigation }) => {
	const [users, setUsers] = useState([]);

	const fetchMatchingUsers = search => {
		firebase.firestore()
			.collection('users')
			.where('name', '>=', search)
			.get()
			.then(snapshot => {
				const matchingUsers = snapshot.docs.map(doc => {
					const data = doc.data();
					const id = doc.id;
					return { id, ...data };
				});
				setUsers(matchingUsers);
			});
	}

	const renderUser = ({ item: user }) => (
		<TouchableOpacity onPress={() => { navigation.navigate("Profile", { uid: user.id }) }}>
			<Text>{user.name}</Text>
		</TouchableOpacity>
	);

	return (
		<View style={styles.container}>
			<TextInput
				placeholder="Search"
				onChangeText={search => fetchMatchingUsers(search)} />
			<View style={styles.results}>
				<FlatList
					numColumns={1}
					horizontal={false}
					data={users}
					renderItem={renderUser}
					keyExtractor={user => user.id} />
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	results: {
		flex: 1
	}
})

export default Search;