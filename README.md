# svelte-chess-pgn

a svelte component chess pgn reader

![bsd](https://img.shields.io/badge/license-BSD-brightgreen)
![issues](https://img.shields.io/github/issues/soycid/svelte-chess-pgn)
[![Build Status](https://github.com/Soycid/svelte-chess-pgn/workflows/Build%20Status/badge.svg?branch=main)](https://github.com/Soycid/svelte-chess-pgn/actions?query=workflow%3A%22Build+Status%22)
[![codecov](https://codecov.io/gh/Soycid/svelte-chess-pgn/branch/main/graph/badge.svg)](https://codecov.io/gh/Soycid/svelte-chess-pgn)
[![npm](https://img.shields.io/npm/v/svelte-chess-pgn)](https://www.npmjs.com/package/svelte-chess-pgn)
[![Documentation](https://img.shields.io/badge/GitHub%20Pages-222222?style=for-the-badge&logo=GitHub%20Pages&logoColor=white)](https://soycid.github.io/svelte-chess-pgn/out/)

### [NOTE: CODE COVERAGE IS NOT WELL SUPPORTED FOR SVELTE, SHIELDS.IO IS INNACURATE](https://github.com/sveltejs/svelte/pull/8269#issuecomment-1441259788)

## Overview


if you have a svelte-based blog, let's you show off your epic chess games.
* supports PGN, FEN reading
* move viewer lets you browse entire game
* completely svelte native

## Installation

```
npm install svelte-chess-pgn
```


## Demo

This is what the PGN reader looks with a game:

<img width="638" alt="Screen Shot 2023-05-12 at 9 53 07 PM" src="https://github.com/Soycid/svelte-chess-pgn/assets/42985072/3ada9801-c73f-4dae-ac8e-c9fdd60ee745">


## Quickstart

in your import statement:

```js
import {PgnReader} from "svelte-chess-pgn";
```

in the <main> tag:

```js
<PgnReader pgn={`(insert PGN here)`}/>
```


