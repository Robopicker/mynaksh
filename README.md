# MyNaksh Chat

React Native chat app for astrology consultations with smooth animations and gesture interactions.

## Setup

```bash
npm install
cd ios && bundle install && bundle exec pod install && cd ..
npm run ios   # or npm run android
```

Needs Node >= 20

## What's Built

**Swipe to Reply** - Swipe right on any message, reply preview shows up above input

**Long Press Reactions** - Hold message to pick emoji (🙏 ✨ 🌙 ❤️ 👍)

**AI Feedback** - Like/dislike on AI messages, get chips for feedback reasons

**End Chat Flow** - Star rating overlay when ending session

**Send Messages** - Type and send, shows timestamp

## Tech

- React Native 0.83 with new architecture
- Reanimated 3 for smooth 60fps animations
- Gesture Handler for swipe/long-press
- Context API for state
- TypeScript

## How Reanimated Works Here

Using shared values and worklets to run animations on UI thread:

```typescript
// Swipe gesture runs entirely on UI thread
const translateX = useSharedValue(0);
Gesture.Pan()
  .onUpdate((e) => {
    translateX.value = clamp(e.translationX, 0, 80);
  })
  .onEnd(() => {
    runOnJS(setReplyingTo)(message); // Jump to JS thread for state
    translateX.value = withSpring(0); // But animation stays on UI thread
  })
```

Everything animated (translateX, opacity, scale) updates on UI thread. Only state changes use `runOnJS` to update React state.

## Gesture Handling

Combined gestures with Race - you can swipe OR long-press the same message:

```typescript
Gesture.Race(
  Gesture.LongPress().minDuration(400),
  Gesture.Pan().activeOffsetX([-5, 5])
)
```

Pan uses small activeOffset so it doesn't interfere with scroll.

## State Management

Just Context API, keeps it simple:
- Messages array with reactions/feedback
- Reply state
- Overlay toggles
- Rating

Could've used Zustand but Context is fine for this scope.

## Performance

- Memoized components with React.memo
- useCallback for all handlers
- useMemo for computed values and styles
- FlatList renders messages efficiently
- Gestures disabled on system events

## Structure

```
src/
├── components/    # MessageBubble, EmojiBar, FeedbackChips, etc.
├── screens/       # ChatScreen
├── context/       # ChatContext
├── types/         # TS interfaces
└── data/          # Mock messages
```