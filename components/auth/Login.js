import React, { Component } from 'react'
import { View, Button, TextInput } from 'react-native'
import firebase from 'firebase';

// TODO: Convert to functional component
export default class Login extends Component {
	constructor(props) {
		super(props);

		this.state = {
			email: '',
			password: ''
		}

		this.onLogin = this.onLogin.bind(this);
	}

	onLogin() {
		const { email, password } = this.state;
		firebase.auth().signInWithEmailAndPassword(email, password);
	}

	render() {
		return (
			<View>
				<TextInput
					placeholder="email"
					onChangeText={(email) => this.setState({ email })} />
				<TextInput
					placeholder="password"
					secureTextEntry={true}
					onChangeText={(password) => this.setState({ password })} />
				<Button onPress={() => this.onLogin()} title="Log In" />
			</View>
		)
	}
}
