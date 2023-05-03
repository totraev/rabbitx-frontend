# Orderbook

This project contains a POC of high performance and memory efficient React.js component which is base on HTML5 canvas and AVL tree.

## Quick Start

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

## Description

The application consists of multiple layers and implements classic `MVVM` architecture. The key part of this POC is stateless and encapsulated `Orderbook` component. It uses HTML canvas to render presorted price levels in both `Declarative` (React props) and `Imperative` (React instance methods) ways. Canvas helps us to avoid expensive DOM, Virtual DOM manipulations and doesn't require any additional `Event Listeners`. Other parts of application are responsible for state management and data transporting. The source code bases on `Reactive Programming` and `OOP` principles. In conclusion the whole application mainly consists of 4 layers:

- `Models` - The data storage layer
- `Services` - Facade objects with encapsulated business logic
- `ViewModels` - UI state of our application
- `View` - React based components

### Models

`Orderbook` model uses AVL trees and Maps under the hood to provide fast and memory efficient way of storing `price levels`. It gives us not only quick access to every item in a memory, but also provides presorted lists
of `price levels`. Hash maps bring us even more quicker access to existing elements:

- Update existing element - O(1)
- Check - O(1)
- Add new item - O(log<sub>2</sub>N)
- Remove existing item - O(log<sub>2</sub>N)

### Services

Encapsulate business logic

### ViewModels

Store and deliver UI specific state of our application

### Views

Consist of two kinds of React components:

- `Pure Components` - declarative way to describe how to display data (received via props) in user's browser;
- `Containers` - bridges between ViewModel layer and Pure Components;

Such approach helps keep every layer of current architecture as thin as possible.

## Challanges

The most complicated part of current project is `Price Levels` subcomponent of `Order Book`. It's just a wrapper around `Canvas Table` class which responsible for displaying data on canvas surface. Current implementation provides almost everything you need from order book on production (live update, removal animations or price level clicks). However there are some points to improve:

- [ ] Optimise `Canvas Table`'s render function.
- [ ] Optimise `Canvas Table`'s updateState function (throttle).
- [x] Optimise price level `update` and `removal` animations (they depends on app performance).
- [ ] Canvas resize
- [ ] Provide `Canvas Table`'s configs via general component's props;
- [ ] Add application layer notifications and error handling
- [ ] Do some refactoring;

Current implementation was inspired by [Coinbase](https://pro.coinbase.com/trade/BTC-USD).
