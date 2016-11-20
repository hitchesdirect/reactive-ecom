// reactive-ecom - ninnemana

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { navigate } from '../../actions/route';

class SearchBox extends Component {

	static propTypes = {
	};

	static contextTypes = {
		createHref: PropTypes.func.isRequired,
	};

	handleClick = (event) => {
		event.preventDefault();

		// if (allowTransition) {
		// 	if (this.props.to) {
		// 		this.props.navigate(this.props.to);
		// 	} else {
		// 		this.props.navigate({
		// 			pathname: event.currentTarget.pathname,
		// 			search: event.currentTarget.search,
		// 		});
		// 	}
		// }
	};

	render() {
		const {
			to,
			navigate, // eslint-disable-line no-unused-vars, no-shadow
			children,
			...props,
		} = this.props;
		return (
			<a href={this.context.createHref(to)} {...props} onClick={this.handleClick}>
			{children}
			</a>
		);
	}

}

const mapState = null;

const mapDispatch = {
	navigate,
};

export default connect(mapState, mapDispatch)(SearchBox);
