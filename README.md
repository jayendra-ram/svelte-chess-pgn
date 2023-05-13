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

## Installation

```
npm install svelte-chess-pgn
```


## Demo

This is what the PGN reader looks like by default:

<img width="584" alt="Screen Shot 2023-04-04 at 11 57 19 PM" src="https://user-images.githubusercontent.com/42985072/229977476-e53143a9-d804-4965-9f39-e706091a656d.png">

## Quickstart

in your import statement:

```js
import {PgnReader} from "svelte-chess-pgn";
```

in the <main> tag:

```js
<PgnReader pgn={`(insert PGN here)`}/>
```


