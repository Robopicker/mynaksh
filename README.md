# MyNaksh - Astrology Chat App

A high-performance React Native chat application built for astrology consultations with AI and human astrologers. Features smooth micro-interactions, gesture-based replies, emoji reactions, and intelligent feedback systems.

## Features Implemented

### Part A: Interactive Message Actions

#### 1. Swipe-to-Reply
- Swipe right on user messages to reveal reply icon
- Spring animation returns bubble to original position
- Reply preview appears above input with cancel option
- Implemented using Reanimated 3 shared values and worklets

#### 2. Message Reactions (Long-Press)
- Long-press any message (except system events) to show emoji bar
- Fixed emoji set: 🙏 ✨ 🌙 ❤️ 👍
- Smooth scale and opacity animations
- Reactions appear as badges below message bubbles

### Part B: AI Feedback & Session Flow

#### 1. AI Feedback System
- Like/Dislike toggle for AI astrologer messages
- Animated feedback chips on dislike: Inaccurate, Too Vague, Too Long
- Staggered chip animations using withDelay
- Visual feedback with color changes on selection

#### 2. Session Termination
- "End Chat" button in header
- Full-screen overlay with blur effect
- 5-star rating component with spring animations
- Thank you message and rating capture via Alert

## Tech Stack

- **React Native 0.83.1** (New Architecture)
- **Reanimated 3** - All animations run on UI thread
- **React Native Gesture Handler** - Pan and LongPress gestures
- **Context API** - State management
- **TypeScript** - Type safety throughout

## Installation & Setup

### Prerequisites
- Node.js >= 20
- Xcode (for iOS)
- Android Studio (for Android)
- CocoaPods (for iOS)

### Steps to Run

1. **Install Dependencies**
```bash
npm install
```

2. **iOS Setup**
```bash
cd ios
bundle install
bundle exec pod install
cd ..
```

3. **Run the App**

For iOS:
```bash
npm run ios
```

For Android:
```bash
npm run android
```

## Architecture & Technical Decisions

### State Management - Context API

Using React Context API for state management:
- Built-in React solution, no external dependencies
- ChatProvider wraps the app root
- Custom hook `useChatContext` for type-safe access
- Simple and straightforward for this use case

Context manages:
- Message list with reactions and feedback
- Reply state
- Overlay visibility
- Rating data

### Animation Strategy - Reanimated 3

All animations use Reanimated 3 to run on the UI thread:

**Swipe-to-Reply:**
- `useSharedValue` for translateX and opacity
- `runOnJS` to trigger state updates from worklet
- Spring animations for natural feel
- Pan gesture with activeOffsetX to prevent conflicts

**Long-Press Reactions:**
- Race gesture combining LongPress and Pan
- Scale + opacity entrance animations
- 400ms minimum duration for intentional activation

**Feedback Chips:**
- Staggered animations using `withDelay`
- Each chip animates in sequence (50ms intervals)
- Spring physics for bouncy feel

**End Chat Overlay:**
- Scale and opacity animations on mount
- Layout animations for smooth transitions
- Disabled state handling for submit button

### Gesture Handling Approach

**Pan Gesture for Swipe-to-Reply:**
```typescript
Gesture.Pan()
  .activeOffsetX(10)  // Prevent accidental triggers
  .onUpdate((e) => {
    // Clamp to 0-100 range
    // Update translateX and icon opacity
  })
  .onEnd((e) => {
    // Trigger reply if threshold exceeded
    // Spring back to original position
  })
```

**Race Gesture for Combined Interactions:**
```typescript
Gesture.Race(longPressGesture, panGesture)
```
Allows both long-press for reactions and swipe for replies on same element.

### UI Thread vs JS Thread

**Runs on UI Thread:**
- All gesture update handlers
- Pan translations and opacity changes
- Spring animations for bubble movements
- Shared value updates

**Runs on JS Thread:**
- State updates (via runOnJS)
- Zustand store mutations
- Component re-renders
- Alert displays

This separation ensures 60fps animations even during state updates.

### Performance Optimizations

- Animations use `withSpring` with optimized damping/stiffness
- Gesture worklets avoid JS bridge crossing
- FlatList for efficient message rendering
- Disabled gestures on system messages
- Conditional rendering of overlays

## Project Structure

```
src/
├── components/
│   ├── MessageBubble.tsx       # Main message component with gestures
│   ├── EmojiReactionBar.tsx    # Long-press emoji selector
│   ├── FeedbackChips.tsx       # AI dislike feedback chips
│   ├── ReplyPreview.tsx        # Reply preview above input
│   └── EndChatOverlay.tsx      # Session end with rating
├── screens/
│   └── ChatScreen.tsx          # Main chat interface
├── context/
│   └── ChatContext.tsx         # Context API state management
├── types/
│   └── chat.ts                 # TypeScript interfaces
└── data/
    └── mockMessages.ts         # Initial chat data
```

## Key Design Decisions

1. **Context API** - Built-in React state management, no external dependencies
2. **Race Gesture** - Allows multiple gesture types on same element
3. **UI Thread Animations** - Critical for smooth 60fps interactions
4. **Shared Values** - Avoid re-renders during gesture updates
5. **Spring Physics** - Natural, organic feel vs linear timing
6. **Staggered Animations** - Draws attention, feels polished
7. **Conditional Gestures** - Disabled on system messages for clarity

## Trade-offs & Considerations

**Pros:**
- Smooth 60fps animations on UI thread
- No external state management dependencies
- Type-safe codebase with custom hooks
- Scalable component structure

**Cons:**
- Context re-renders all consumers on state change
- Reanimated has learning curve for worklets
- More complex than basic animations
- Gesture conflicts require careful handling

## Future Enhancements

- Message send functionality
- Real-time typing indicators
- Image/file attachments
- Push notifications
- Persistence with AsyncStorage
- Haptic feedback on gestures
- Sound effects for interactions

## Notes

This is a technical demonstration focusing on:
- Modern React Native patterns
- Smooth UI feedback loops
- Gesture-driven interactions
- Performance optimization

The implementation prioritizes correctness and smoothness over feature completeness.
