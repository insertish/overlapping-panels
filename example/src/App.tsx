import React, { useEffect, useState } from 'react'
import styles from './App.module.css';

import { OverlappingPanels, Docked, Panel } from 'overlapping-panels'
import 'overlapping-panels/dist/index.css'

const App = () => {
  const [ open, setOpen ] = useState(Panel.None);

  function LeftPanel() {
    return (
      <div className={styles.leftPanel}>
        left panel
      </div>
    )
  }

  const leftPanel = {
    component: <LeftPanel />,
    width: 300
  };

  function RightPanel() {
    return (
      <div className={styles.rightPanel}>
        right panel
      </div>
    )
  }

  const rightPanel = {
    component: <RightPanel />,
    width: 150,
  };

  const content = (
    <div className={styles.mainPanel}>
      <h1>hi</h1>
    </div>
  )

  function BottomNav() {
    return (
      <div className={styles.bottomNav}>
        bottom navigation<br/>hello!
      </div>
    )
  }

  const bottomNav = {
    component: <BottomNav />,
    height: 40,
    showIf: Docked.Left
  }

  const { width, height } = useWindowSize();

  return (
    <main>
      <h1>Overlapping Panels</h1>
      <p>If on mobile, scroll down to the end for an auto-sized panel.</p>
      <div>
        <div className={styles.desc}>720 x 1280</div>
        <div className={styles.panel}>
          <OverlappingPanels
            open={open}
            width={720}
            height={640}
            leftPanel={leftPanel}
            rightPanel={rightPanel}
            setOpen={panel => setOpen(panel)}>
            { content }
          </OverlappingPanels>
        </div>
      </div>
      <div>
        <div className={styles.desc}>720 x 1280 (with bottom navigation and minOffset = 10)</div>
        <div className={styles.panel}>
          <OverlappingPanels
            open={open}
            width={720}
            height={640}
            minOffset={10}
            leftPanel={leftPanel}
            rightPanel={rightPanel}
            setOpen={panel => setOpen(panel)}
            bottomNav={bottomNav}>
            { content }
          </OverlappingPanels>
        </div>
      </div>
      <div>
        <div className={styles.desc}>1280 x 720 (docked)</div>
        <div className={styles.panel}>
          <OverlappingPanels
            width={1280}
            height={720}
            open={Panel.None}
            setOpen={() => {}}
            docked={Docked.Both}
            leftPanel={leftPanel}
            rightPanel={rightPanel}>
            { content }
          </OverlappingPanels>
        </div>
      </div>
      <div className={styles.autosize}>
        <div className={styles.desc}>Autosize (window width / height)</div>
        <div className={styles.panel}>
          { width && height &&
          <OverlappingPanels
            open={open}
            width={width}
            height={height}
            leftPanel={leftPanel}
            rightPanel={rightPanel}
            setOpen={panel => setOpen(panel)}>
            { content }
          </OverlappingPanels> }
        </div>
      </div>
    </main>
  )
}

// useWindowSize: https://usehooks.com/useWindowSize/
function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState<{ width?: number, height?: number }>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount

  return windowSize;
}

export default App
