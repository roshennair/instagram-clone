import React, { Component } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUser } from '../redux/actions';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Feed from './main/Feed';
import Profile from './main/Profile';

const Tab = createMaterialBottomTabNavigator();
const Empty = () => null;

// TODO: Convert to functional component
class Main extends Component {
	componentDidMount() {
		this.props.fetchUser();
	}

	render() {
		return (
			<Tab.Navigator
				initialRouteName="Feed"
				screenOptions={{ headerShown: false }}
				labeled={false}>
				<Tab.Screen
					name="Feed"
					component={Feed}
					options={{
						tabBarIcon: ({ color }) => (
							<Icon name="home" color={color} size={26} />
						)
					}} />
				<Tab.Screen
					name="AddContainer"
					component={Empty}
					listeners={({ navigation }) => ({
						tabPress: e => { // Open new screen on tab press
							e.preventDefault();
							navigation.navigate("Add");
						}
					})}
					options={{
						headerShown: true,
						tabBarIcon: ({ color }) => (
							<Icon name="plus-box" color={color} size={26} />
						)
					}} />
				<Tab.Screen
					name="Profile"
					component={Profile}
					options={{
						tabBarIcon: ({ color }) => (
							<Icon name="account-circle" color={color} size={26} />
						)
					}} />
			</Tab.Navigator>
		)
	}
}

const mapStateToProps = ({ user }) => ({ currentUser: user.currentUser });
const mapDispatchToProps = dispatch => bindActionCreators({ fetchUser }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Main);