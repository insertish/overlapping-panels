# Overlapping Panels

> Gestures-driven navigation UI for React.js

[![NPM](https://img.shields.io/npm/v/react-overlapping-panels.svg)](https://www.npmjs.com/package/react-overlapping-panels)

This is a Javascript / React implementation of Discord's [OverlappingPanels](https://github.com/discord/OverlappingPanels).

Gesture-based navigation allows us to create more natural interactions and avoids conflict with native gesture navigation.

The current implementation relies almost entirely on CSS, inspired by [bree](https://bree.dev)'s [css-drawer-snap](https://github.com/Brecert/css-drawer-snap). By using CSS scroll snap we rely on the browser to resolve which scrollbar should be scrolled at what time, so you avoid sidebars opening when scrolling vertically through something such as messages or when scrolling sideways through another element.

## Install

```bash
npm install --save react-overlapping-panels
```

```bash
yarn add react-overlapping-panels
```

## Usage

```tsx
import React, { Component } from 'react'

import { OverlappingPanels, ShowIf } from 'react-overlapping-panels'
import 'react-overlapping-panels/dist/index.css'

function MyComponent() {
    return (
        <OverlappingPanels
            width={720}
            height={640}
            leftPanel={{
                component: <span>I am the left panel.</span>,
                width: 300
            }}
            rightPanel={{
                component: <span>I am the right panel.</span>,
                width: 250
            }}
            bottomNav={{
                component: <span>hello!</span>,
                height: 40,
                showIf: ShowIf.Left
            }}>
            <h1>main content!</h1>
        </OverlappingPanels>
    )
}

// See example/src/App.tsx for more working examples.
```

## Develop Locally

Clone the project using:

```bash
git clone https://gitlab.insrt.uk/insert/overlapping-panels
```

Build and watch files for the library:

```bash
yarn start
```

And build and watch files for the example:

```bash
cd example
yarn start
```

## To-Do

- Add RTL support.

## Preview

Example (REVOLT PWA): https://autumn.revolt.chat/attachments/GBokkPYJIJqsaXKndNZPkr2xD5H33t5QVAYKsRCqRc/simplescreenrecorder-2021-06-14_14.42.20.mp4

(The following ones are a bit choppy since I recorded them with Peek instead of SSR)

Example in REVOLT: https://autumn.revolt.chat/attachments/ypmI99sJqyeBEt5LI3dNXSE5WIUPlg1kp4XY7NAbnq/Peek%202021-06-14%2013-32.webm
Demo taken from examples: https://autumn.revolt.chat/attachments/soJ5hEJYW2vG2kpxlrE98BI8aZu0NY8FMHeYAfL1kH/Peek%202021-06-14%2014-22.webm
