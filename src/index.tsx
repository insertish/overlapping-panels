import * as React from 'react'
import styles from './styles.module.scss'

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
	width: string,
	height: string,
	docked?: Docked,
	leftPanel?: SidePanel,
	rightPanel?: SidePanel,
	children?: React.ReactNode,
	bottomNav?: BottomNavigation,
}

export const OverlappingPanels = ({ width, height, docked, leftPanel, children, rightPanel, bottomNav }: Props) => {
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

	const scrollRef = React.useRef<HTMLDivElement>(null);
	const bottomNavRef = React.useRef<HTMLDivElement>(null);

	React.useEffect(() => {
		if (!bottomNav) return;
		if (!scrollRef.current) return;
		let el = scrollRef.current;
		
		function recalculate() {
			let bEl = bottomNavRef.current;
			if (!bEl) return;
	
			let showIf = (typeof bottomNav!.showIf === 'undefined' ? ShowIf.Both : bottomNav!.showIf);
			if (showIf & ShowIf.Always) {
				bEl.style.top = '';
				return;
			}
	
			const lWidth = leftPanel?.width  || 0;
			const rWidth = rightPanel?.width || 0;
			const hidden = bottomNav!.height + 'px';
	
			if (el.scrollLeft < lWidth) {
				if (showIf & ShowIf.Left) {
					bEl.style.top = (el.scrollLeft / lWidth * bottomNav!.height) + 'px';
					return;
				} else if (bEl.style.top === hidden) {
					return;
				}
			}
	
			if (el.scrollLeft > lWidth) {
				if (showIf & ShowIf.Right) {
					bEl.style.top = ((el.scrollLeft - lWidth) / rWidth * - bottomNav!.height + bottomNav!.height) + 'px';
					return;
				} else if (bEl.style.top === hidden) {
					return;
				}
			}
	
			bEl.style.top = hidden;
		}

		el.addEventListener('scroll', recalculate);
		return () => el!.removeEventListener('scroll', recalculate);
	}, [ scrollRef, leftPanel, rightPanel, bottomNav ]);

	const gridTemplateColumns = (leftPanel ? leftPanel.width + 'px' : '')
		   + ` ${width} ` + (rightPanel ? rightPanel.width + 'px' : '');

	return (
		<div className={styles.container}>
			<div style={{ width, height, gridTemplateColumns }} className={styles.snap} ref={scrollRef}>
				{ leftPanel && <div style={{ height }}>
					{ leftPanel.component }
				</div> }
				{ children }
				{ rightPanel && <div style={{ height }}>
					{ rightPanel.component }
				</div> }
			</div>
			{
				bottomNav &&
				<div className={styles.nav} style={{ bottom: height }}>
					<div style={{ width, height }} ref={bottomNavRef}>
						<div>
							{ bottomNav.component }
						</div>
					</div>
				</div>
			}
		</div>
	)
}
