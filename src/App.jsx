import { useEffect, useRef, useState } from 'react';
import playSvg from './assets/play.svg';
import pauseSvg from './assets/pause.svg';
import './App.css';

import { Editor } from './components/Editor';
import './userWorker';

function Timeline({ time, setTime }) {
	const trackRef = useRef(null);
	const [ isDragging, setIsDragging ] = useState(false);
	const [ hoverTime, setHoverTime ] = useState(null);
	const [ isPlaying, setIsPlaying ] = useState(false);
	const [ playbackRate, setPlaybackRate ] = useState(1);

	const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
	const getPercentFromClientX = (clientX) => {
		if (!trackRef.current) return 0;
		const rect = trackRef.current.getBoundingClientRect();
		const x = clamp(clientX - rect.left, 0, rect.width);
		return rect.width ? (x / rect.width) * 100 : 0;
	};

	const updateTimeFromEvent = (event) => {
		const percent = getPercentFromClientX(event.clientX);
		setTime(percent);
	};

	useEffect(() => {
		if (!isPlaying) return;
		const interval = setInterval(() => {
			setTime((current) => clamp(current + playbackRate * 0.25, 0, 100));
		}, 50);
		return () => clearInterval(interval);
	}, [ isPlaying, playbackRate, setTime ]);

	const handlePointerDown = (event) => {
		event.preventDefault();
		trackRef.current?.setPointerCapture(event.pointerId);
		setIsDragging(true);
		updateTimeFromEvent(event);
	};

	const handlePointerMove = (event) => {
		if (!trackRef.current) return;
		const percent = getPercentFromClientX(event.clientX);
		if (isDragging) {
			setTime(percent);
			return;
		}
		setHoverTime(percent);
	};

	const handlePointerUp = (event) => {
		if (!isDragging) return;
		event.preventDefault();
		setIsDragging(false);
	};

	const handlePointerLeave = () => {
		if (!isDragging) {
			setHoverTime(null);
		}
	};

	const showHoverProgress = hoverTime !== null && hoverTime > time;

	return (
		<div className="TimelineContainer">
			<div
				ref={trackRef}
				className={`TimelineTrack${isDragging ? ' is-dragging' : ''}`}
				onPointerDown={handlePointerDown}
				onPointerMove={handlePointerMove}
				onPointerUp={handlePointerUp}
				onPointerLeave={handlePointerLeave}
				onPointerCancel={handlePointerLeave}
				role="slider"
				aria-valuemin={0}
				aria-valuemax={100}
				aria-valuenow={Math.round(time)}
				tabIndex={0}
			>
				<div className="TimelineBase" />
				<div className="TimelineProgress" style={{ width: `${time}%` }} />
				<div
					className="TimelineHover"
					style={{
						left: `${time}%`,
						width: `${hoverTime - time}%`,
						opacity: `${showHoverProgress ? 0.7 : 0}`
					}}
				/>
				<div
					className="ScrubberButton"
					style={{ left: `${time}%` }}
					onPointerDown={handlePointerDown}
					role="presentation"
				/>
			</div>
			<div className="TimelineControls">
				<button
					type="button"
					className="PlayButton"
					onClick={() => setIsPlaying((current) => !current)}
					aria-pressed={isPlaying}
				>
					<img src={isPlaying ? pauseSvg : playSvg } className="playImg" />
				</button>
				<div className="SpeedButtons">
					{[ 1, 10, 50 ].map((rate) => (
						<button
							key={rate}
							type="button"
							className={`SpeedButton${playbackRate === rate ? ' is-active' : ''}`}
							onClick={() => setPlaybackRate(rate)}
						>
							{rate}x
						</button>
					))}
				</div>
			</div>
		</div>
	);
}

function App() {
	const [ time, setTime ] = useState(0);

  return (
    <>
			<Editor />
			<Timeline time={time} setTime={setTime}/>
    </>
  )
}

export default App
