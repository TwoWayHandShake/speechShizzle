import "animate.css";
import * as nlp from "compromise";
import React from "react";

interface IExtendedWindow extends Window {
	webkitSpeechRecognition: any;
	SpeechRecognition: any;
	SpeechRecognitionEvent: any;
	webkitSpeechRecognitionEvent: any;
}

const extendedWindow = window as IExtendedWindow;

interface IState {
	full: string;
	word: string;
	nouns: string;
	verbs: string;
}

export interface ISpeechChange {
	full: string;
	word: string;
	nouns: string;
	verbs: string;
}

interface IProps {
	onChange: (change: ISpeechChange) => void;
}

export class SpeechListener extends React.PureComponent<IProps, IState> {
	constructor(props: IProps) {
		super(props);
		this.state = {
			full: "",
			word: "",
			nouns: "",
			verbs: ""
		};
	}

	componentDidMount() {
		this.startSpeechRecognition();
	}

	splitGetLast = (text: string) => {
		const split = text.split(" ");
		if (split.length) {
			return split.reverse()[0].trim();
		}
		return text.trim();
	};

	handleSpeechResult = (event: any) => {
		for (let i = event.resultIndex; i < event.results.length; ++i) {
			const transcription = event.results[i][0].transcript;
			const processedLanguage = nlp(transcription);
			const extractedNouns = processedLanguage.nouns().out("text");

			const extractedVerbs = processedLanguage.verbs().out("text");

			this.setState({
				nouns: extractedNouns,
				verbs: extractedVerbs
			});

			let singleWord = this.splitGetLast(extractedNouns) || this.splitGetLast(extractedVerbs);

			if (singleWord) {
				this.setState({
					word: singleWord
				});
			}

			this.setState({
				full: transcription
			});

			this.props.onChange(this.state);
		}
	};

	startSpeechRecognition = () => {
		const SpeechRecognition =
			extendedWindow.SpeechRecognition || extendedWindow.webkitSpeechRecognition;
		const recognition = new SpeechRecognition();

		recognition.interimResults = true;
		recognition.lang = "en-US";
		recognition.maxAlternatives = 1;

		recognition.onresult = this.handleSpeechResult;

		recognition.onend = () => {
			console.log("Start speech recognition");
			recognition.start();
		};

		console.log("Start speech recognition");
		recognition.start();
	};

	render(): React.ReactNode {
		return null;
	}
}
