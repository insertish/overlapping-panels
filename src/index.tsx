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
	component: React.ReactNode
}

interface BottomNavigation {
	height: number,
	showIf?: Docked,
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

type TouchState =
	| { type: 'none' }
	| { type: 'active', startX: number, offsetX: number };

export const OverlappingPanels = ({ width, height, docked, open, setOpen, leftPanel, children, rightPanel, bottomNav, minOffset }: Props) => {
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

	const [ touchState, setTouchState ] = React.useState<TouchState>({ type: 'none' });

	const lWidth = leftPanel?.width || 0;
	const rWidth = rightPanel?.width || 0;
	var offset = (
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

	if (minOffset) {
		if (offset < minOffset) offset = 0;
	}
	
	const visible = offset < 0 ? Panel.Right :
					offset > 0 ? Panel.Left :
					Panel.None;

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
				<div style={{ width, height, left: offset }}>
					{ children }
				</div>
			</div>
		}
		{
			bottomNav &&
			<div className={styles.nav}>
				<div style={{
					width, height,
					top: (
						bottomNav.height +
						(
							(((bottomNav.showIf || 2) & 2) && offset < 0) ? (offset / rWidth) * bottomNav.height :
							(((bottomNav.showIf || 1) & 1) && offset > 0) ? (-offset / lWidth) * bottomNav.height : 0
						)
					)
				}}>
					<div>
						{ bottomNav.component }
					</div>
				</div>
			</div>
		}
	</div>
}
