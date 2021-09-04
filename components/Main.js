import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUser } from '../redux/actions';

// TODO: Convert to functional component
class Main extends Component {
	componentDidMount() {
		this.props.fetchUser();
	}

	render() {
		const { currentUser } = this.props;

		if (!currentUser) return <View></View>;

		return (
			<View style={{ flex: 1, justifyContent: 'center' }}>
				<Text>{currentUser.name} is logged in</Text>
			</View>
		)
	}
}

const mapStateToProps = ({ user }) => ({ currentUser: user.currentUser });
const mapDispatchToProps = dispatch => bindActionCreators({ fetchUser }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Main);