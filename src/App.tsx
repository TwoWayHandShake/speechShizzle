import * as nlp from "compromise";
import React from "react";
import Typist from "react-typist";
import axios from "axios";
import styles from "./App.module.css";

interface IExtendedWindow extends Window {
	webkitSpeechRecognition: any;
}

const extendedWindow = window as IExtendedWindow;

interface IState {
	transcription: string;
	item: string;
	imageSrc: string;
	debug: boolean;
	nouns: string;
	verbs: string;
}

interface IProps {}

class App extends React.PureComponent<IProps, IState> {
	constructor(props: IProps) {
		super(props);
		this.state = {
			transcription: "",
			item: "",
			imageSrc: "",
			debug: false,
			nouns: "",
			verbs: ""
		};
	}

	componentDidMount() {
		this.initSpeechRecognition();
		document.addEventListener("keydown", this.toggleDebugView, false);
	}

	componentDidUpdate(prevProps: IProps, prevState: IState) {
		if (prevState.item !== this.state.item) {
			this.updateImage();
		}
	}

	toggleDebugView = (event: any) => {
		// d
		if (event.keyCode == 68) {
			this.setState({
				debug: !this.state.debug
			});
		}
	};

	splitGetLast = (text: string) => {
		const split = text.split(" ");
		if (split.length) {
			return split.reverse()[0].trim();
		}
		return text.trim();
	};

	initSpeechRecognition = () => {
		const recognition = new extendedWindow.webkitSpeechRecognition();
		recognition.continuous = true;
		recognition.interimResults = true;
		recognition.lang = "en-US";

		recognition.onresult = (event: any) => {
			for (let i = event.resultIndex; i < event.results.length; ++i) {
				const resultChunk = event.results[i][0].transcript;
				const transcription = resultChunk;
				const processedLanguage = nlp(transcription);
				const extractedNouns = processedLanguage.nouns().out("text");

				const extractedVerbs = processedLanguage.verbs().out("text");

				this.setState({
					nouns: extractedNouns,
					verbs: extractedVerbs
				});

				let text = this.splitGetLast(extractedNouns) || this.splitGetLast(extractedVerbs);

				if (text) {
					this.setState({
						item: text
					});
				}

				this.setState({
					transcription
				});
			}
		};

		recognition.start();
	};

	updateImage = async () => {
		const { item } = this.state;
		if (!item) {
			return;
		}
		try {
			const keys = [
				"098bp5rbz5oRCsbNqOfrDJT5EecbSCXs",
				"qsJL0hUiBazkjkQTZWvgFX2ATawYOHcp",
				"ppRcLc2j7uB49TVrVAslibdoTZewMPGM",
				"x8D6sHzDy0H4Q959Cm19GNvh0Ydb5Pr5",
				"zyk0hiXD6TduvPafJumM6UBdSQCcZSNb",
				"kxOy2220algKcmTAdh82ARfxpGhNeVMf",
				"4Nu26m9hRLo1ZOv9mXu1QNJptIUTIN2u"
			];

			const apiKey = keys[Math.floor(keys.length * Math.random())];
			const url = `https://api.giphy.com/v1/gifs/random?tag=${item.toLowerCase()}&api_key=${apiKey}&limit=1`;
			const {
				data: {
					data: { image_url }
				}
			} = await axios.get(url);

			this.setState({
				imageSrc: image_url
			});
		} catch (e) {
			this.updateImage();
			console.log(`Cannot update gif for item: ${item}`, e);
		}
	};

	private renderHint() {
		return this.state.transcription ? null : (
			<div className={styles.HintWrapper}>
				<Typist>Talk to me</Typist>
			</div>
		);
	}

	private renderDebug() {
		return this.state.debug ? (
			<div className={styles.StateWrapper}>
				<pre>{JSON.stringify(this.state, null, 2)}</pre>
			</div>
		) : null;
	}

	render(): React.ReactNode {
		const { item, transcription, imageSrc } = this.state;
		return (
			<div className={styles.root}>
				{this.renderDebug()}
				<div className={styles.RecognitionWrapper}>{transcription}</div>
				<div className={styles.SearchWrapper}>
					<span>#</span>
					{item}
				</div>
				{this.renderHint()}
				<div className={styles.backgroundWrapper} style={{ backgroundImage: `url(${imageSrc})` }}>
					{/* <img src={imageSrc} alt="" /> */}
				</div>
			</div>
		);
	}
}

export default App;
