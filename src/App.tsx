import React from "react";
import * as nlp from "compromise";
import Typist from "react-typist";
import styles from "./App.module.css";

interface IExtendedWindow extends Window {
	webkitSpeechRecognition: any;
}

const extendedWindow = window as IExtendedWindow;
const recognition = new extendedWindow.webkitSpeechRecognition();

interface IState {
	transcription: string;
	item: string;
	imageSrc: string;
}

interface IProps {}

class App extends React.PureComponent<IProps, IState> {
	constructor(props: IProps) {
		super(props);
		this.state = {
			transcription: "",
			item: "",
			imageSrc: " "
		};
	}

	componentDidMount() {
		this.initSpeechRecognition();
	}

	componentDidUpdate(prevProps: IProps, prevState: IState) {
		if (prevState.item !== this.state.item) {
			this.updateImage();
		}
	}

	initSpeechRecognition = () => {
		recognition.continuous = true;
		recognition.interimResults = true;

		recognition.onresult = (event: any) => {
			for (let i = event.resultIndex; i < event.results.length; ++i) {
				let resultChunk = event.results[i][0].transcript;
				let transcription = resultChunk;
				let extractedNoun = nlp(transcription)
					.match("#Noun")
					.out("text");
				this.setState({
					item: extractedNoun,
					transcription
				});
			}
		};
		recognition.start();
	};

	updateImage = async () => {
		const { item } = this.state;
		const res = await fetch(
			`http://api.giphy.com/v1/gifs/random?tag=${item.toLowerCase()}&api_key=qsJL0hUiBazkjkQTZWvgFX2ATawYOHcp&limit=1`
		);
		const giphyData = await res.json();
		this.setState({
			imageSrc: giphyData.data.image_url
		});
	};

	private renderHint() {
		if (this.state.item) {
			return null;
		}
		return (
			<div className={styles.HintWrapper}>
				<Typist>Talk to me</Typist>
			</div>
		);
	}

	render(): React.ReactNode {
		const { item, transcription, imageSrc } = this.state;
		return (
			<div className={styles.App}>
				<div className={styles.RecognitionWrapper}>{transcription}</div>
				<div className={styles.SearchWrapper}>
					<span>#</span>
					{item}
				</div>
				{this.renderHint()}
				<img src={imageSrc} alt="" />
			</div>
		);
	}
}

export default App;
