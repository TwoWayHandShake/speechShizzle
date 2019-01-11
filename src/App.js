import React, { Component } from 'react';
import './App.css';
import $ from 'jquery';

const recognition = new window.webkitSpeechRecognition();

let help = "";
let nlp = require('compromise')

class App extends Component {

	state = {
		transcription: "",
		item: "",
		imageSrc: " "
	};

	componentDidMount() {
		const _this = this;
		// recognition.stop();

		recognition.continuous = true;
		recognition.interimResults = true;


		recognition.onresult = (event) => {
			for (let i = event.resultIndex; i < event.results.length; ++i) {

				let resultChunk = event.results[i][0].transcript;
				// Needs to be final?
				//	  if (event.results[i].isFinal) {


				let transcription = resultChunk;
				let t = nlp(transcription).match('#Noun').out('text');

				/* 
								//only whole words
								let allWords = transcription.split(" ")
				
								//removing empty objects from wordslist
								allWords = allWords.filter(value => Object.keys(value).length !== 0);
				
								//	this.state.item = allWords[Math.floor(Math.random() * allWords.length)]
								this.setState({
									item: allWords[Math.floor(Math.random() * allWords.length)]
								})
				 */

				this.setState({
					item: t
				})

				//Giphy URL
				let xhr = $.get('http://api.giphy.com/v1/gifs/random?tag=' + this.state.item.toLowerCase() + '&api_key=qsJL0hUiBazkjkQTZWvgFX2ATawYOHcp&limit=1');

				xhr.done(function (data) {
					help = data.data.image_url;
				});






				_this.setState({
					imageSrc: help
				});

				_this.setState({
					transcription
				});
			}

			//  }
		};
		recognition.start();
	};

	render() {
		return (
			<div className="App">
				<div className="RecognitionWrapper">
					{this.state.transcription}
				</div>
				<div className="SearchWrapper"><span>#</span>{this.state.item}


				</div>
				<img src={this.state.imageSrc} alt="" />
				{/* <div className="ButtonWrapper">
					<button onClick={this.initSpeechApi}>START</button>
					<button onClick={() => recognition.stop()}>STOP</button>
				</div> */}
			</div>
		);
	}
}

export default App;
