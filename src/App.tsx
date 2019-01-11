import React from "react";
import classNames from "classnames";
import Typist from "react-typist";
import debounce from "debounce";
import styles from "./App.module.css";
import "animate.css";
import { SpeechListener, ISpeechChange } from "./SpeechListener";
import { getImage } from "./giphy";

interface IState {
	transcription: string;
	item: string;
	imageSrc: string;
	debug: boolean;
	nouns: string;
	verbs: string;
}

interface IProps {}

interface ITheme {
	search: string;
	background: string;
	transcription: string;
}

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
		document.addEventListener("keydown", this.toggleDebugView, false);
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

	updateImage = async () => {
		const { item } = this.state;
		if (!item) {
			return;
		}
		console.log("Update image", item);
		try {
			const url = await getImage(item);
			this.setState({
				imageSrc: url
			});
		} catch (e) {
			this.updateImage();
			console.log(`Cannot update gif for item: ${item}`, e);
		}
	};

	debounceImageUpdate = debounce(this.updateImage, 300);

	private renderHint() {
		return this.state.transcription ? null : (
			<div className={styles.typist}>
				<Typist>Talk to me</Typist>
			</div>
		);
	}

	private renderDebug() {
		return this.state.debug ? (
			<div className={styles.debug}>
				<pre>{JSON.stringify(this.state, null, 2)}</pre>
			</div>
		) : null;
	}

	private getTheme(): ITheme {
		const defaultTheme = {
			search: styles.search,
			background: styles.background,
			transcription: styles.transcription
		};
		const text = this.state.item;
		if (/trump|banana/gi.test(text)) {
			return {
				...defaultTheme,
				search: classNames(styles.search, styles.textYellow, "animated", "rotateIn"),
				transcription: classNames(styles.transcription, styles.textYellow)
			};
		}

		if (/bounce|jump|run/gi.test(text)) {
			return {
				...defaultTheme,
				search: classNames(styles.search, "animated", "bounceIn")
			};
		}

		if (/dance|shake|sex/gi.test(text)) {
			return {
				...defaultTheme,
				search: classNames(styles.search, "animated", "shake")
			};
		}

		if (/penis/gi.test(text)) {
			return {
				...defaultTheme,
				search: classNames(styles.search, styles.searchTop, "animated", "hinge", "delay-1s", "slow")
			};
		}

		if (/heart|nervous|love|kiss/gi.test(text)) {
			return {
				...defaultTheme,
				search: classNames(styles.search, styles.textRed, "animated", "infinite", "heartBeat")
			};
		}

		if (/rotate|spin|turn/gi.test(text)) {
			return {
				...defaultTheme,
				search: classNames(styles.search, "animated", "rotateIn")
			};
		}

		return defaultTheme;
	}

	handleSpeechChange = (change: ISpeechChange) => {
		console.log("Speech changed", change);
		if (change.word && change.word !== this.state.item) {
			this.debounceImageUpdate();
		}
		this.setState({
			item: change.word,
			transcription: change.full,
			verbs: change.verbs,
			nouns: change.nouns
		});
	};

	private randomColor() {
		var letters = "0123456789ABCDEF";
		var color = "#";
		for (var i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	}

	render(): React.ReactNode {
		const { item, transcription, imageSrc } = this.state;

		const theme = this.getTheme();

		return (
			<>
				<SpeechListener onChange={this.handleSpeechChange} />
				<div className={styles.root}>
					{this.renderDebug()}
					<div className={theme.search}>
						<span>#</span>
						{item}
					</div>
					<div className={theme.transcription}>{transcription}</div>
					{this.renderHint()}
					<div
						className={theme.background}
						style={{ backgroundImage: `url(${imageSrc})`, backgroundColor: this.randomColor() }}
					/>
				</div>
			</>
		);
	}
}

export default App;
