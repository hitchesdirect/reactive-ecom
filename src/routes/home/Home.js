// reactive-ecom - ninnemana

import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Home.css';

const title = 'Hitches Direct';

function Home(props, context) {
	context.setTitle(title);
	return (
		<div className={s.root}>
			<div className={s.container} />
		</div>
	);
}

Home.propTypes = {};
Home.contextTypes = { setTitle: PropTypes.func.isRequired };

export default withStyles(s)(Home);
