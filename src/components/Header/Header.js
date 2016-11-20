// reactive-ecom - ninnemana

import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Header.css';
import Link from '../Link';
import Navigation from '../Navigation';

function Header() {
	return (
		<div className={s.root}>
			<div className={s.container}>
				<Navigation className={s.nav} />
				<Link className={s.brand} to="/">
					<img src={'logo.gif'} alt="Hitches Direct" />
				</Link>
				<div className={s.banner}>
					<h1 className={s.bannerTitle}>Towing</h1>
					<p className={s.bannerDesc}>Headache made easy</p>
				</div>
			</div>
		</div>
	);
}

export default withStyles(s)(Header);
