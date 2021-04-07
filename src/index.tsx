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

interface SidePanel {
	width: number,
	component: () => React.ReactChild
}

interface Props {
	open: Panel,
	width: number,
	height: number,
	docked?: Docked,
	leftPanel?: SidePanel,
	rightPanel?: SidePanel,
	children?: React.ReactChild,
	setOpen: (panel: Panel) => void,
}

type TouchState =
	| { type: 'none' }
	| { type: 'active', startX: number, offsetX: number };

export const OverlappingPanels = ({ width, height, docked, open, setOpen, leftPanel, children, rightPanel }: Props) => {
	if (docked) {
		return <div
			className={styles.docked}
			style={{ width, height }}>
			{ (docked & 1) && leftPanel && leftPanel.component() }
			<div className={styles.main}>
				{ children }
			</div>
			{ (docked & 2) && rightPanel && rightPanel.component() }
		</div>
	}

	const [ touchState, setTouchState ] = React.useState<TouchState>({ type: 'none' });

	const lWidth = leftPanel?.width || 0;
	const rWidth = rightPanel?.width || 0;
	const offset = (
		touchState.type === 'active' ?
		Math.min(lWidth, Math.max(- rWidth, (
			open === Panel.Left ?
				(lWidth) - touchState.offsetX :
			open === Panel.Right ?
				- (rWidth) - touchState.offsetX :
				(- touchState.offsetX)
		))) :
		(
			open === Panel.Left ? lWidth :
			open === Panel.Right ? - rWidth :
				undefined
		)
	) || 0;
	
	const visible = offset < 0 ? Panel.Right :
					offset > 0 ? Panel.Left :
					Panel.None;

	/* React.useEffect(() => {
		if (touchState.type === 'none') return;
		if (rightPanel && offset < - rWidth / 2) {
			if (open !== Panel.Right) {
				setOpen(Panel.Right);
				setTouchState({
					...touchState,
					startX: touchState.startX - rWidth
				});
			}
		} else if (leftPanel && offset > lWidth / 2) {
			if (open !== Panel.Left) setOpen(Panel.Left);
			setTouchState({
				...touchState,
				startX: touchState.startX + lWidth
			});
		} else if (open !== Panel.None) {
			setOpen(Panel.None);
			setTouchState({
				...touchState,
				startX: touchState.startX +
					open === Panel.Right ? rWidth : - lWidth
			});
		}
	}, [ offset, touchState ]); */

	return <div
		className={styles.parent}
		style={{ width, height }}
		onTouchStart={ev =>
			setTouchState({
				type: 'active',
				startX: ev.touches[0].clientX,
				offsetX: 0
			})
		}
		onTouchMove={ev =>
			touchState.type === 'active' &&
			setTouchState({
				...touchState,
				offsetX: touchState.startX - ev.touches[0].clientX
			})
		}
		onTouchEnd={() => {
			if (offset < - rWidth / 2) {
				setOpen(Panel.Right);
			} else if (offset > lWidth / 2) {
				setOpen(Panel.Left);
			} else {
				setOpen(Panel.None);
			}

			setTouchState({
				type: 'none'
			});
		}}>
		{
			visible === Panel.Left && <div
				className={styles.leftPanel}>
				<div style={{ width: leftPanel?.width, height }}>
					<div className={styles.flex}>
						{ leftPanel?.component() }
					</div>
				</div>
			</div>
		}
		{
			visible === Panel.Right && <div
				className={styles.rightPanel}>
				<div className={styles.flex} style={{ width, height }}>
					<div style={{ width: rightPanel?.width, height }}>
						{ rightPanel?.component() }
					</div>
				</div>
			</div>
		}
		{
			<div className={styles.main}>
				<div style={{ width, height, left: offset }}>
					{ children }
				</div>
			</div>
		}
	</div>
}
