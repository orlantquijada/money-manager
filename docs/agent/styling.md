# Styling Conventions

## Default Components

Use `StyledLeanView` and `StyledLeanText` from `apps/mobile/src/config/interop.ts` as defaults.

## Rules

- Always pair `numberOfLines` with `ellipsizeMode="tail"`
- Use `font-nunito-bold` for currency/numeric values
- Currency formatting: use `Intl.NumberFormat` API

## Styling System

Uniwind (Tailwind CSS for React Native) - use className prop with Tailwind classes.
