// reactive-ecom - ninnemana

import React, { PropTypes } from 'react';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Navigation.css';
import Link from '../Link';
import SearchBox from '../SearchBox';

function Navigation({ className, query }) {
	return (
		<div className={cx(s.root, className)} role="navigation">
			<Link className={s.link} to="/about">About</Link>
			<Link className={s.link} to="/contact">Contact</Link>
			<SearchBox query={query} />
		</div>
	);
}

Navigation.propTypes = {
	className: PropTypes.string,
	query: PropTypes.string,
};

export default withStyles(s)(Navigation);
