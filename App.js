import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import firebase from 'firebase/app';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import Landing from './components/auth/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import rootReducer from './redux/reducers/index';
import Main from './components/Main';
import Add from './components/main/Add';

const firebaseConfig = {
	apiKey: "AIzaSyBL4fD7AP79JRFJDj1StlpnE-XE9wyssS4",
	authDomain: "instagram-clone-45d19.firebaseapp.com",
	projectId: "instagram-clone-45d19",
	storageBucket: "instagram-clone-45d19.appspot.com",
	messagingSenderId: "1089106267471",
	appId: "1:1089106267471:web:757d0da8e311ac86d9893a",
	measurementId: "G-QQZMV3SKTS"
};
if (firebase.apps.length === 0) {
	firebase.initializeApp(firebaseConfig)
}
const store = createStore(rootReducer, applyMiddleware(thunk));
const Stack = createStackNavigator();

export default class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loaded: false
		}
	}

	componentDidMount() {
		firebase.auth().onAuthStateChanged(user => {
			if (!user) { // not logged in
				this.setState({
					loggedIn: false,
					loaded: true
				});
			} else { // logged in
				this.setState({
					loggedIn: true,
					loaded: true
				});
			}
		});
	}

	render() {
		const { loggedIn, loaded } = this.state;

		if (!loaded) {
			return (
				<View style={{ flex: 1, justifyContent: 'center' }}>
					<Text>Loading...</Text>
				</View>
			);
		}

		if (!loggedIn) {
			return (
				<NavigationContainer>
					<Stack.Navigator initialRouteName="Landing">
						<Stack.Screen
							name="Landing"
							component={Landing}
							options={{ headerShown: false }} />
						<Stack.Screen
							name="Register"
							component={Register} />
						<Stack.Screen
							name="Login"
							component={Login} />
					</Stack.Navigator>
				</NavigationContainer>
			);
		}

		return (
			<Provider store={store}>
				<NavigationContainer>
					<Stack.Navigator initialRouteName="Main">
						<Stack.Screen
							name="Main"
							component={Main}
							options={{ headerShown: false }} />
						<Stack.Screen
							name="Add"
							component={Add} />
					</Stack.Navigator>
				</NavigationContainer>
			</Provider>
		);
	}
}