// reactive-ecom - ninnemana

import React from 'react';
import Home from './Home';

export default {

	path: '/',

	async action(obj) {
		return <Home context={obj.context} />;
	},

};
