import React, { Component } from 'react';
import { withGoogleMap, GoogleMap, withScriptjs, InfoWindow, Marker } from "react-google-maps";
import Geocode from "react-geocode";
import Autocomplete from 'react-google-autocomplete';
import { GoogleMapsAPI } from '../client-config';
import { Link } from 'react-router-dom'
import Showing from "./components/Showing";
var axios = require('axios');
Geocode.setApiKey( GoogleMapsAPI );
Geocode.enableDebug();
var location1 = [0];
var location2 = [0];
var errrr;
var object = [];
object.push({lat: 46.3622743, lon: 15.1106582});
object.push({lat: 43.3622743, lon: 15.1106582});
object.push({lat: 41.3622743, lon: 15.1106582});
object.push({lat: 44.3622743, lon: 15.1106582});
object.push({lat: 42.3622743, lon: 15.1106582});
object.push({lat: 46.5622743, lon: 15.1106582});
object.push({lat: 46.7622743, lon: 15.1106582});




var buttonMapvisible = false;
var Mapvisible = false;


var hereApi = "WoRodsRX4_lDj-sHVx6eDKD6fD3IFbpZ6h28hUhYjT0";
var weatherApi = "f896bb64c45e8edff3282fa715a2f715";
class Showing extends Component{

	
	constructor( props ){
		super( props );
		this.state = {
			address: '',
			city: '',
			area: '',
			state: '',
			mapPosition: {
				lat: this.props.center.lat,
				lng: this.props.center.lng
			},
			markerPosition: {
				lat: this.props.center.lat,
				lng: this.props.center.lng
			}
		}
	}
	/**
	 * Get the current address from the default map position and set those values in the state
	 */
	componentDidMount() {
		Geocode.fromLatLng( this.state.mapPosition.lat , this.state.mapPosition.lng ).then(
			response => {
				const address = response.results[0].formatted_address,
				      addressArray =  response.results[0].address_components,
				      city = this.getCity( addressArray ),
				      area = this.getArea( addressArray ),
				      state = this.getState( addressArray );

				console.log( 'city', city, area, state );

				this.setState( {
					address: ( address ) ? address : '',
					area: ( area ) ? area : '',
					city: ( city ) ? city : '',
					state: ( state ) ? state : '',
				} )
			},
			error => {
				console.error( error );
			}
		);
	};
	/**
	 * Component should only update ( meaning re-render ), when the user selects the address, or drags the pin
	 *
	 * @param nextProps
	 * @param nextState
	 * @return {boolean}
	 */
	shouldComponentUpdate( nextProps, nextState ){
		if (
			this.state.markerPosition.lat !== this.props.center.lat ||
			this.state.address !== nextState.address ||
			this.state.city !== nextState.city ||
			this.state.area !== nextState.area ||
			this.state.state !== nextState.state
		) {
			return true
		} else if ( this.props.center.lat === nextProps.center.lat ){
			return false
		}
	}
	/**
	 * Get the city and set the city input value to the one selected
	 *
	 * @param addressArray
	 * @return {string}
	 */
	getCity = ( addressArray ) => {
		let city = '';
		for( let i = 0; i < addressArray.length; i++ ) {
			if ( addressArray[ i ].types[0] && 'administrative_area_level_2' === addressArray[ i ].types[0] ) {
				city = addressArray[ i ].long_name;
				return city;
			}
		}
	};
	/**
	 * Get the area and set the area input value to the one selected
	 *
	 * @param addressArray
	 * @return {string}
	 */
	getArea = ( addressArray ) => {
		let area = '';
		for( let i = 0; i < addressArray.length; i++ ) {
			if ( addressArray[ i ].types[0]  ) {
				for ( let j = 0; j < addressArray[ i ].types.length; j++ ) {
					if ( 'sublocality_level_1' === addressArray[ i ].types[j] || 'locality' === addressArray[ i ].types[j] ) {
						area = addressArray[ i ].long_name;
						return area;
					}
				}
			}
		}
	};
	/**
	 * Get the address and set the address input value to the one selected
	 *
	 * @param addressArray
	 * @return {string}
	 */
	getState = ( addressArray ) => {
		let state = '';
		for( let i = 0; i < addressArray.length; i++ ) {
			for( let i = 0; i < addressArray.length; i++ ) {
				if ( addressArray[ i ].types[0] && 'administrative_area_level_1' === addressArray[ i ].types[0] ) {
					state = addressArray[ i ].long_name;
					return state;
				}
			}
		}
	};
	/**
	 * And function for city,state and address input
	 * @param event
	 */
	onChange = ( event ) => {
		this.setState({ [event.target.name]: event.target.value });
	};
	/**
	 * This Event triggers when the marker window is closed
	 *
	 * @param event
	 */
	onInfoWindowClose = ( event ) => {

	};

	/**
	 * When the marker is dragged you get the lat and long using the functions available from event object.
	 * Use geocode to get the address, city, area and state from the lat and lng positions.
	 * And then set those values in the state.
	 *
	 * @param event
	 */
	onMarkerDragEnd = ( event ) => {
		let newLat = event.latLng.lat(),
		    newLng = event.latLng.lng();

		Geocode.fromLatLng( newLat , newLng ).then(
			response => {
				const address = response.results[0].formatted_address,
				      addressArray =  response.results[0].address_components,
				      city = this.getCity( addressArray ),
				      area = this.getArea( addressArray ),
				      state = this.getState( addressArray );
				this.setState( {
					address: ( address ) ? address : '',
					area: ( area ) ? area : '',
					city: ( city ) ? city : '',
					state: ( state ) ? state : '',
					markerPosition: {
						lat: newLat,
						lng: newLng
					},
					mapPosition: {
						lat: newLat,
						lng: newLng
					},
				}  )
			},
			error => {
				console.error(error);
			}
		);
	};

	onButtonClick = () => {
		var hereApi = "WoRodsRX4_lDj-sHVx6eDKD6fD3IFbpZ6h28hUhYjT0";
		var weatherApi = "f896bb64c45e8edff3282fa715a2f715";
	  
		var lat = [];
		var lon = [];
		object = [];
		var tmpSave = [];
	  
		lat.push(location1[1]);
		lat.push(location2[1]);
		lon.push(location1[2]);
		lon.push(location2[2]);
	  
		axios('https://route.ls.hereapi.com/routing/7.2/calculateroute.json?' + 
		  'apiKey=' + hereApi + '&' + 'waypoint0=geo!' + lat[0] + ',' + lon[0] + '&' + 'waypoint1=geo!' + lat[1] + ',' + lon[1] + '&mode=fastest;pedestrian;traffic:disabled').then((response)=>{
			var coordinates = response.data.response.route[0].leg[0].maneuver;
			axios('https://api.openweathermap.org/data/2.5/weather?lat=' + lat[0] + '&lon=' + lon[0] + '&units=metric&appid=' + weatherApi)
				.then((response)=>{
					object.push({lat: lat[0], lon: lon[0], temp: Math.round(response.data.main.temp), weather: response.data.weather[0].description});
						axios('https://api.openweathermap.org/data/2.5/weather?lat=' + lat[1] + '&lon=' + lon[1] + '&units=metric&appid=' + weatherApi)
							.then((response)=>{ 
								object.push({lat: lat[1], lon: lon[1], temp: Math.round(response.data.main.temp), weather: response.data.weather[0].description});
								var locations = [];
								var idx = coordinates.length;

								coordinates.forEach(element => { 
									axios('https://api.openweathermap.org/data/2.5/weather?lat=' + element.position.latitude + '&lon=' + element.position.longitude + '&units=metric&appid=' + weatherApi)
									.then((response)=>{
						  
									  locations.push({lat: element.position.latitude, lon: element.position.longitude, temp: response.data.main.temp, weather: response.data.weather[0].description});
						  
									  if (!--idx) {              
										var size = parseInt(locations.length/5);
										
										for (var a = 0; a < 5; a++) {
										  if(a == 0){
											var i = 0;
											var check = size;
										  }
										  else{
											check = check + size;
										  }
										  console.log(i + "|" + check)
						  
										  for (; i < check; i++) {
											tmpSave.push(locations[i]);
										  }
										  
										  tmpSave.sort((a,b) => a.tmp - b.tmp);
										  tmpSave = tmpSave.slice(1).slice(-1);
										  object.push(tmpSave[0]);
						  
										  tmpSave = [];
										}
										console.log(object);
										buttonMapvisible = true;
									  } })
									
					})
	 			})
			})
		})
		  
		  


		}

		showMap = () => {
			
		}
		
	/**
	 * When the user types an address in the search box
	 * @param place
	 */
	onPlaceSelected = ( place ) => {
		console.log( 'plc', place );
		const address = place.formatted_address,
		      addressArray =  place.address_components,
		      city = this.getCity( addressArray ),
		      area = this.getArea( addressArray ),
		      state = this.getState( addressArray ),
		      latValue = place.geometry.location.lat(),
			  lngValue = place.geometry.location.lng();
			  if (location1.length == 1)
			  {
				location1.push(latValue);
				location1.push(lngValue);
				console.log(location1);
				location1[0] = address;
			  }else {
				if (location2.length == 1){
					location2.push(latValue);
					location2.push(lngValue);
					console.log(location2);
					location2[0] = address;
				}else {
					errrr = "Vnesete lahko samo 2 lokaciji"
				}
			  }
		// Set these values in the state.
		this.setState({
			address: ( address ) ? address : '',
			area: ( area ) ? area : '',
			city: ( city ) ? city : '',
			state: ( state ) ? state : '',
			markerPosition: {
				lat: latValue,
				lng: lngValue
				
			},
			mapPosition: {
				lat: latValue,
				lng: lngValue
			},
		})
	};


	render(){

			const MarkersMap = withScriptjs(
				withGoogleMap(
					
					props => (
						
						<GoogleMap google={ this.props.google }
								   defaultZoom={ this.props.zoom }
								   defaultCenter={{ lat: this.state.mapPosition.lat, lng: this.state.mapPosition.lng }}
						>
							{/* InfoWindow on top of marker */}
							
							{/*Marker*/}
							{}
							
							<Marker google={this.props.google}
						        name={'Dolores park'}
						        draggable={false}
						        onDragEnd={ this.onMarkerDragEnd }
						        position={{ lat: this.state.markerPosition.lat, lng: this.state.markerPosition.lng }}
						/>
						<Marker />
							 
							{/* For Auto complete Search Box */}

									
							}
						</GoogleMap>
					)
				)
			);

		
		const AsyncMap = withScriptjs(
			withGoogleMap(
				props => (
					<GoogleMap 
					>
						{/* InfoWindow on top of marker */}
						
						{/*Marker*/}
						
						{/* For Auto complete Search Box */}
						<Autocomplete
							style={{
								width: '100%',
								height: '40px',
								paddingLeft: '16px',
								marginTop: '2px',
								marginBottom: '10px'
							}}
							onPlaceSelected={ this.onPlaceSelected }
							types={['(regions)']}
						/>
					</GoogleMap>
				)
			)
		);
		let map;
		if( this.props.center.lat !== undefined ) {
			map = <div>
				<div>
				<label htmlFor="">Select Location:</label>
				<AsyncMap
					googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${GoogleMapsAPI}&libraries=places`}
					loadingElement={
						<div style={{ height: `0%` }} />
					}
					containerElement={
						<div style={{ height:  `0%`}} />
					}
					mapElement={
						<div style={{ height: `0%` }} />
					}
				/>
					
					
				<div className="form-group mt-3">

				<Link to='/Showing.js'>Click Me</Link>

					<MarkersMap
					googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${GoogleMapsAPI}&libraries=places`}
					loadingElement={
						<div style={{ height: `100%` }} />
					}
					containerElement={
						<div style={{ height: this.props.height }} />
					}
					mapElement={
						<div style={{ height: `100%` }} />
					}
				/>
					 

				</div>
                </div>

				
			</div>
		} else {
			map = <div style={{height: this.props.height}} />
		}
		return( map )
	}
}
export default Showing