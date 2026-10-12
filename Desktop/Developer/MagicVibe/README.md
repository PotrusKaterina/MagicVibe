# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Translations

UI copy is written inline at the call site — as props on `<FormattedMessage>` or
as the descriptor passed to `intl.formatMessage()`. A message is only factored
out into a `*.messages.ts` file when more than one call site uses it
(`app-tabs.messages.ts`, `common.messages.ts`).
Everything under `lang/en.json` and `src/i18n/compiled-lang/` is generated from
that source — never edit those by hand.

After adding or changing a message:

```bash
npm run extract          # src/**/*.tsx -> lang/en.json (ids, defaults, descriptions)
npm run compile-folder   # lang/*.json  -> src/i18n/compiled-lang/*.json (ICU AST)
```

`npm run compile` does the same for `lang/en.json` alone, which is handy when
only the English copy moved.

Translators edit `lang/<locale>.json` — the per-locale siblings of the extracted
file, with `description` kept as context. Placeholders (`{shortcut}`, `{br}`,
`{nbsp}`) and tags (`<code>`, `<b>`) must survive translation; the tags are
supplied once by `AppIntlProvider`.

To add a locale: add it to `SUPPORTED_LOCALES` in `src/i18n/config.ts`, import its
plural-rules data in `src/i18n/polyfills.ts`, drop a `lang/<locale>.json` next to
the others, and re-run `npm run compile-folder`. The device language is matched
by `expo-localization`, falling back to English.

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

### Other setup steps

- To set up ESLint for linting, run `npx expo lint`, or follow our guide on ["Using ESLint and Prettier"](https://docs.expo.dev/guides/using-eslint/)
- If you'd like to set up unit testing, follow our guide on ["Unit Testing with Jest"](https://docs.expo.dev/develop/unit-testing/)
- Learn more about the TypeScript setup in this template in our guide on ["Using TypeScript"](https://docs.expo.dev/guides/typescript/)

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
