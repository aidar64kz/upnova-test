Product Requirements Document: Verification Code Input Component
Overview
An animated verification code input component for email verification workflows. The component features 6 input boxes with smooth animations, real-time validation, and visual feedback for correct/incorrect code entry.
Technology Stack

Vite - Build tool
ReactJS - UI framework
React Router - Routing
TypeScript - Type-safe development
Vitest - Unit testing
Testing Library - Component testing
Tailwindcss - Styling
Framer Motion - Animations

Component Overview
A single-page verification code input component that accepts a 6-digit numeric code with animated transitions and validation feedback.
Visual Layout
┌─────────────────────────────────────┐
│ [Icon Circle - Animated] │
│ │
│ We've emailed you a verification │
│ code │
│ Please enter the code we sent │
│ you below. │
│ │
│ [□] [□] [□] — [□] [□] [□] │
│ │
│ Didn't receive a code? Resend │
└─────────────────────────────────────┘
Core Features

1. Input Boxes
   Layout:

6 input boxes arranged horizontally
Visual separator (dash) between 3rd and 4th box
Each box: 80px × 96px, rounded corners
Gray background (#f3f4f6)
Gap between boxes: 16px

Behavior:

Accept numeric input only (0-9)
One digit per box
Auto-advance to next box on input
Backspace clears current box or moves to previous if empty
Read-only input with keyboard event handling

2. Animated Highlight Outline
   Default State (Blue):

4px border
Blue color (#3b82f6)
Follows active input box

Error State (Red):

Changes from blue to red (#ef4444)
Moves from last box back to first box
Duration: 500ms

Animation:

Uses Framer Motion's layoutId for smooth transition
Spring animation (stiffness: 300, damping: 30)
Highlight moves sequentially as user types

3. Digit Entry Animation
   Entry Effect:

Digits fade in from bottom to top
Initial position: translateY(20px), opacity 0
Final position: translateY(0), opacity 1
Duration: 200ms

Exit Effect:

Digits fade out upward when cleared
Exit position: translateY(-20px), opacity 0

4. Error State Animations
   When incorrect code is entered:
   Sequence:

Highlight changes from blue to red (instant)
All boxes shake horizontally
Highlight moves back to first box
All digits clear
Focus returns to first box

Shake Animation:

Keyframes: [0, -10, 10, -10, 10, 0]
Duration: 500ms
Applies to entire input group

Error Message:

Text: "Invalid verification code"
Red color (#ef4444)
Fades in from top
Displays below input boxes

5. Success State Animations
   When correct code is entered:
   Icon Circle Animation:

Bounce effect: scale [1, 1.3, 1]
Duration: 600ms
Ease-out timing

Icon Transition:

Mail icon exits: scale to 0, rotate 180°, fade out
Check icon enters: scale from 0, rotate from -180°, fade in
Transition duration: 300-400ms

Success Message:

Text: "Verification successful!"
Green color (#16a34a)
Fades in from top

6. Icon Circle
   Default State:

96px × 96px circle
Light blue background (#dbeafe)
Mail icon (40px, blue #3b82f6)
Centered above title

Success State:

Check icon (48px, blue #3b82f6)
Bounce animation triggers

Component Implementation
Code Structure
typescriptinterface ComponentProps {
correctCode?: string; // Default: '123456'
onSuccess?: () => void;
onError?: () => void;
}

interface ComponentState {
code: string[]; // Array of 6 digits
activeIndex: number; // Currently focused box (0-5)
isError: boolean; // Error state flag
isSuccess: boolean; // Success state flag
shake: boolean; // Shake animation trigger
}
Key Functions
handleKeyDown(event, index)

Handles numeric input (0-9)
Handles backspace navigation
Validates complete code
Triggers success/error states

handleFocus(index)

Updates active index for highlight positioning

Validation Logic
typescript// On 6th digit entry
const enteredCode = code.join('');
if (enteredCode === correctCode) {
// Trigger success animations
setIsSuccess(true);
setActiveIndex(-1); // Hide highlight
blur(); // Remove focus
} else {
// Trigger error animations
setIsError(true);
setShake(true);
// After 500ms: reset code, move to start
}
Animation Specifications
Framer Motion Variants
Highlight Transition:
typescripttransition={{
  type: "spring",
  stiffness: 300,
  damping: 30
}}
Shake Effect:
typescriptanimate={{
  x: [0, -10, 10, -10, 10, 0]
}}
transition={{ duration: 0.5 }}
Icon Bounce:
typescriptanimate={{
  scale: [1, 1.3, 1]
}}
transition={{ duration: 0.6, ease: "easeOut" }}
Digit Fade:
typescriptinitial={{ y: 20, opacity: 0 }}
animate={{ y: 0, opacity: 1 }}
exit={{ y: -20, opacity: 0 }}
transition={{ duration: 0.2 }}
User Flow
Happy Path

User sees mail icon and empty input boxes
User types first digit → highlight on box 1, digit fades in
Highlight auto-moves to box 2, user continues typing
After 6th digit with correct code:

Icon bounces and changes to checkmark
Success message appears
Input boxes become inactive

Error Path

User enters 6 digits with incorrect code
Highlight turns red
All boxes shake
Highlight moves back to first box
All digits clear
Error message displays
Focus returns to first box
User can retry

Testing Requirements
Unit Tests (Vitest)
Input Handling:

Test numeric input acceptance
Test non-numeric rejection
Test backspace navigation
Test auto-advance behavior

Validation:

Test correct code success state
Test incorrect code error state
Test partial code entry

State Management:

Test active index updates
Test code array updates
Test error/success flags

Component Tests (Testing Library)
User Interactions:

Test typing through all boxes
Test backspace clearing
Test focus management
Test click-to-focus

Animations:

Test highlight position changes
Test shake animation triggers
Test icon transition
Test digit fade in/out

Accessibility:

Test keyboard navigation
Test focus indicators
Test screen reader compatibility
Test input mode="numeric" on mobile

Accessibility Requirements

Proper focus management throughout flow
Keyboard-only navigation support
ARIA labels for input boxes
Screen reader announcements for errors/success
High contrast color combinations
Touch-friendly sizing (min 44px tap targets)

Responsive Design
Mobile:

Reduce box size to 64px × 80px
Reduce gap to 8px
Stack title/description if needed
Maintain readable text sizes

Desktop:

Center component with max-width: 672px
Full animations and transitions
Hover states on resend button

Configuration Options
typescriptconst config = {
correctCode: '123456',
boxCount: 6,
separatorAfter: 3,
colors: {
highlight: '#3b82f6',
error: '#ef4444',
success: '#16a34a'
},
timing: {
shake: 500,
digitFade: 200,
iconBounce: 600
}
};
Integration Requirements
Cart Chain Event Manager Integration
This component can be integrated with the Cart Chain Event Manager (Task 1) for verification workflows in e-commerce contexts:
typescript// Example: Verify code before adding gift to cart
cartEventManager.addChainEvent({
name: 'VERIFY_USER',
action: async (cart) => {
const verified = await verifyCode(enteredCode);
return verified ? cart : null; // Stop chain if not verified
}
});
Success Criteria

All animations execute smoothly at 60fps
Highlight transitions feel natural and responsive
Error/success states are immediately clear to users
Component is fully keyboard accessible
All tests pass with >85% coverage
Mobile and desktop layouts work correctly
No TypeScript errors or warnings

Future Enhancements

Configurable code length (4, 6, 8 digits)
Paste support for copying codes
Auto-submit on completion
Countdown timer for code expiration
Rate limiting for resend button
Custom validation patterns (alphanumeric)
