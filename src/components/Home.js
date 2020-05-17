import React, { Component } from 'react';
import Map from './Map';

class Home extends Component {

	render() {
		return(
			<div style={{ margin: '100px' }}>
				<Map
					google={this.props.google}
					center={{lat: 46.441740, lng: 15.195690}}
					height='300px'
					zoom={15}
				/>
			</div>
		);
	}
}

export default Home;
