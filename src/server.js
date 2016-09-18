// reactive-ecom - ninnemana

import 'babel-polyfill';
import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import React from 'react';
import ReactDOM from 'react-dom/server';
import UniversalRouter from 'universal-router';
import PrettyError from 'pretty-error';
import Html from './components/Html';
import { ErrorPageWithoutStyle } from './routes/error/ErrorPage';
import errorPageStyle from './routes/error/ErrorPage.css';
import routes from './routes';
import createHistory from './core/createHistory';
import assets from './assets'; // eslint-disable-line import/no-unresolved
import configureStore from './store/configureStore';
import { setRuntimeVariable } from './actions/runtime';
import { port } from './config';

const app = express();

//
// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
// -----------------------------------------------------------------------------
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//
// Register API middleware
// -----------------------------------------------------------------------------

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
app.get('*', (async) (req, res, next) => {
	const history = createHistory(req.url);
	// let currentLocation = history.getCurrentLocation();
	let sent = false;
	const removeHistoryListener = history.listen((location) => {
		const newUrl = `${location.pathname}${location.search}`;
		if (req.originalUrl !== newUrl) {
			// console.log(`R ${req.originalUrl} -> ${newUrl}`); // eslint-disable-line no-console
			if (!sent) {
				res.redirect(303, newUrl);
				sent = true;
				next();
			} else {
				console.error(`${req.path}: Already sent!`); // eslint-disable-line no-console
			}
		}
	});

	try {
		const store = configureStore({}, {
			cookie: req.headers.cookie,
			history,
		});

		store.dispatch(setRuntimeVariable({
			name: 'initialNow',
			value: Date.now(),
		}));
		let css = new Set();
		let statusCode = 200;
		const data = { title: '', description: '', style: '', script: assets.main.js, children: '' };

		await UniversalRouter.resolve(routes, {
			path: req.path,
			query: req.query,
			context: {
				store,
				createHref: history.createHref,
				insertCss: (...styles) => {
					styles.forEach(style => css.add(style._getCss())); // eslint-disable-line no-underscore-dangle, max-len
				},
				setTitle: value => (data.title = value),
				setMeta: (key, value) => (data[key] = value),
			},
			render(component, status = 200) {
				css = new Set();
				statusCode = status;
				data.children = ReactDOM.renderToString(component);
				data.state = store.getState();
				data.style = [...css].join('');
				return true;
			},
		});

		if (!sent) {
			const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);
			res.status(statusCode);
			res.send(`<!doctype html>${html}`);
		}
	} catch (err) {
		next(err);
	} finally {
		removeHistoryListener();
	}
});

//
// Error handling
// -----------------------------------------------------------------------------
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
	console.log(pe.render(err)); // eslint-disable-line no-console
	const statusCode = err.status || 500;
	const html = ReactDOM.renderToStaticMarkup(
		<Html
			title="Internal Server Error"
			description={err.message}
			style={errorPageStyle._getCss()} // eslint-disable-line no-underscore-dangle
		>
		{ReactDOM.renderToString(<ErrorPageWithoutStyle error={err} />)}
		</Html>
	);
	res.status(statusCode);
	res.send(`<!doctype html>${html}`);
});

//
// Launch the server
// -----------------------------------------------------------------------------
/* eslint-disable no-console */
app.listen(port, () => {
	console.log(`The server is running at http://localhost:${port}/`);
});
/* eslint-enable no-console */
