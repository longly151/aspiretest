# AspireTest

This project is a [React Native](https://reactnative.dev) Code Challenge at Aspire

<p align="center">
  <img src="https://itviec.com/rails/active_storage/representations/proxy/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBNEF2SWc9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--db9a46e89bd852e44b77c57217e12ffb5af33380/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCem9MWm05eWJXRjBTU0lJY0c1bkJqb0dSVlE2RkhKbGMybDZaVjkwYjE5c2FXMXBkRnNIYVFJc0FXa0NMQUU9IiwiZXhwIjpudWxsLCJwdXIiOiJ2YXJpYXRpb24ifX0=--ee4e4854f68df0a745312d63f6c2782b5da346cd/Logo.png" width="200">
</p>

## User stories (business requirements)

As a customer, I want to:

- View my available balance of my bank account, so that I can perform transactions
- View my card info, so that I can make payments more quickly and conveniently
- Hide my balance and card information, so that I can protect my sensitive personal information
- Set my weekly spending limit, so that I can control my spending better
- Remove my weekly spending limit so I could use up my account balance

## Outstanding implements in the source code

- Fully support `tailwindcss` to make coding styles for components become neater and simpler than ever
- State management with `redux-toolkit`, with the aim of keeping the code syntax concise and optimized
- Clean and easy to manage folder structure with the separation of `screens, store & navigators`
- Support `Type declarations` through the app (for state, screen names, icon names, assets, components, ...)
- Use `theme` manager (from react-navigation) and apply `multi-language` (i18next)
- Simple, light and complete set of `Basic components`: Button, DateTimePicker, Icon, Image, Input, Modal, Picker, Text, View,...
- Easily handle requests with the server using `Axios` and `hooks`: useRequest (for basic request), useListRequest (support pagination), useMutation (for post, patch, put, delete request)
- `Multi-environment` support: development and production

## Installation

```
yarn
```

```
=> Copy ".env.example" to ".env" & ".env.production" if they don't already exist in the project
```

## Local Development

This starts a local development server. Most changes are reflected live without having to restart the server.

- Android

```
yarn android
```

- iOS

```
yarn ios
```

### Multi-environment run

- Android

```
yarn android:prod
```

- iOS

```
=> Open "/ios/AspireTest.xcworkspace", choose scheme ([DEV] AspireTest, AspireTest) to run
```

## Build

This generates static content into the `build` directory and can be served using any static contents hosting service.

- Android

```
android-build:prod
```

- iOS

```
=> Open "/ios/AspireTest.xcworkspace", choose scheme (AspireTest), set target devices to "Any iOS device (arm64)" and select "Product => Archive"
```

### That's it, happy coding 🎉
