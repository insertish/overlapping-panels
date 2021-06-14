import * as React from 'react'
import styles from './styles.module.scss'

export enum Panel {
	None,
	Left,
	Right
}

export enum Docked {
	None  = 0,
	Left  = 1,
	Right = 2,
	Both  = 3,
}

export enum ShowIf {
	Left   = 1,
	Right  = 2,
	Both   = 3,
	Always = 4
}

interface SidePanel {
	width: number,
	component: React.ReactNode
}

interface BottomNavigation {
	height: number,
	showIf?: ShowIf,
	component: React.ReactNode,
}

interface Props {
	open: Panel,
	width: number,
	height: number,
	docked?: Docked,
	minOffset?: number,
	leftPanel?: SidePanel,
	rightPanel?: SidePanel,
	children?: React.ReactNode,
	bottomNav?: BottomNavigation,
	setOpen: (panel: Panel) => void,
}

/* type TouchState =
	| { type: 'none' }
	| { type: 'active', startX: number, show: Panel, target: Panel }; */

export const OverlappingPanels = ({ width, height, docked, /* open, setOpen, */ leftPanel, children, rightPanel, /* bottomNav, minOffset */ }: Props) => {
	if (docked) {
		return <div
			className={styles.docked}
			style={{ width, height }}>
			{ ((docked & 1) && leftPanel) ? leftPanel.component : undefined }
			<div className={styles.main}>
				{ children }
			</div>
			{ ((docked & 2) && rightPanel) ? rightPanel.component : undefined }
		</div>
	}

	const gridTemplateColumns = (leftPanel ? leftPanel.width + 'px' : '')
		   + ` ${width}px ` + (rightPanel ? rightPanel.width + 'px' : '');

	return (
		<div style={{ width, height, gridTemplateColumns }} className={styles.snap}>
			{ leftPanel && leftPanel.component }
			{ children }
			{ rightPanel && rightPanel.component }
		</div>
	)

	/*

	const [ touchState, setTouchState ] = React.useState<TouchState>({ type: 'none' });
	const mainRef = React.useRef<HTMLDivElement>(null)s
	const navbRef = React.useRef<HTMLDivElement>(null);
	
	const visible = touchState.type === 'active' ? touchState.show : open;

	function recalculateNavbarTop(offset: number) {
		if (!bottomNav) return;
		if (navbRef.current === null) return;

		let val = bottomNav.height +
			(
				((bottomNav.showIf || 0) & 4) ? (-bottomNav.height) :
				(((bottomNav.showIf || 2) & 2) && offset < 0) ? (offset / rWidth) * bottomNav.height :
				(((bottomNav.showIf || 1) & 1) && offset > 0) ? (-offset / lWidth) * bottomNav.height : 0
			);
		
		navbRef.current.style.top = val + 'px';
	}

	function recalculateState(offsetX: number) {
		if (touchState.type === 'none') return;

		let el = mainRef.current;
		if (el) {
			let offset = Math.min(lWidth, Math.max(-rWidth, offsetX));
			let mutations: { show?: Panel, target?: Panel } = {};

			// Determine what is visible.
			if (offset > 0) {
				if (touchState.show !== Panel.Left) {
					mutations.show = Panel.Left;
				}
			} else if (offset < 0) {
				if (touchState.show !== Panel.Right) {
					mutations.show = Panel.Right;
				}
			} else {
				if (touchState.show !== Panel.None) {
					mutations.show = Panel.None;
				}
			}

			// Determine drop target.
			if (offset > lWidth / 2) {
				if (touchState.target !== Panel.Left) {
					mutations.target = Panel.Left;
				}
			} else if (offset < - rWidth / 2) {
				if (touchState.target !== Panel.Right) {
					mutations.target = Panel.Right;
				}
			} else {
				if (touchState.target !== Panel.None) {
					mutations.target = Panel.None;
				}
			}

			if (Object.keys(mutations).length > 0) {
				setTouchState({ ...touchState, ...mutations });
			}

			el.style.left = offset + 'px';
			recalculateNavbarTop(offset);
		}
	}

	function recalculateDropped(newState?: Panel) {
		let el = mainRef.current;
		if (el) {
			let current = typeof newState !== 'undefined' ? newState : open;

			let val = 0;
			if (current === Panel.Left) {
				val = lWidth;
			} else if (current === Panel.Right) {
				val = - rWidth;
			}

			el.style.left = val + 'px';
			recalculateNavbarTop(val);
		}
	}

	React.useLayoutEffect(() => recalculateDropped(open), [ open ]);

	return <div
		className={styles.parent}
		style={{ width, height }}
		onTouchStart={ev =>
			setTouchState({
				type: 'active',
				startX: ev.touches[0].clientX,
				show: open,
				target: open
			})
		}
		onTouchMove={ev => {
			if (touchState.type === 'active') {
				let offsetX = ev.touches[0].clientX - touchState.startX;

				if (minOffset ? Math.abs(offsetX) > minOffset : true) {
					recalculateState(
						offsetX +
						(open === Panel.None ? 0 :
						 open === Panel.Left ? lWidth : -rWidth)
					)
				} else {
					if (mainRef.current) {
						recalculateDropped();
					}
				}
			}
		}}
		onTouchEnd={() => {
			if (touchState.type === 'active') {
				setTouchState({
					type: 'none'
				});

				if (open === touchState.target) {
					if (mainRef.current) {
						recalculateDropped(touchState.target);
					}
				} else {
					setOpen(touchState.target);
				}
			}
		}}>
		{
			visible === Panel.Left && <div
				className={styles.leftPanel}>
				<div style={{ width: leftPanel?.width, height }}>
					<div className={styles.flex}>
						{ leftPanel?.component }
					</div>
				</div>
			</div>
		}
		{
			visible === Panel.Right && <div
				className={styles.rightPanel}>
				<div className={styles.flex} style={{ width, height }}>
					<div style={{ width: rightPanel?.width, height }}>
						{ rightPanel?.component }
					</div>
				</div>
			</div>
		}
		{
			<div className={styles.main}>
				<div ref={mainRef} style={{ width, height }}>
					{ children }
				</div>
			</div>
		}
		{
			bottomNav &&
			<div className={styles.nav}>
				<div style={{ width, height }} ref={navbRef}>
					<div>
						{ bottomNav.component }
					</div>
				</div>
			</div>
		}
	</div>*/
}
