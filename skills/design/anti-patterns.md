# Avoiding Generic AI Aesthetics

**CRITICAL**: Internalize these principles to avoid the "AI slop" aesthetic that plagues AI-generated frontends.

## Core Principles

### Typography
- **DO**: Use the project's distinctive fonts (Satoshi, Nunito, Azeret Mono) purposefully
- **DON'T**: Fall back to generic fonts like Inter, Roboto, Arial, or system fonts
- Each font has a role: Satoshi for UI text, Nunito Bold for numbers/currency, Azeret Mono for technical values

### Color & Theme
- **DO**: Commit to bold, cohesive color choices with dominant colors and sharp accents
- **DON'T**: Create timid, evenly-distributed palettes or clichéd purple gradients on white
- Draw inspiration from premium banking apps, not generic dashboards

### Motion & Animation
- **DO**: Focus on high-impact moments—one well-orchestrated entry animation with staggered reveals
- **DON'T**: Add motion everywhere without purpose
- A single polished page load animation > many small uncoordinated effects

### Backgrounds & Depth
- **DO**: Create atmosphere through layered effects (glass effects, subtle gradients, shadows)
- **DON'T**: Default to flat solid color backgrounds everywhere
- Layer elements to create a sense of space and premium feel

### Creative Interpretation
- Make unexpected choices that feel genuinely designed for this financial app context
- Each screen should have distinctive character, not cookie-cutter layouts
- Ask: "Would a human designer make this choice, or does it feel AI-generated?"

---

## Animation Patterns (High-Impact Moments)

**Philosophy**: One well-orchestrated entry animation with staggered reveals creates more delight than scattered micro-interactions.

### Staggered Entry Animation (Signature of Polished Apps)

```tsx
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
} from "react-native-reanimated";

// Stagger list items with increasing delays
{items.map((item, index) => (
  <Animated.View
    key={item.id}
    entering={FadeInDown.delay(index * 50).springify()}
    exiting={FadeOut.duration(150)}
  >
    <ItemComponent item={item} />
  </Animated.View>
))}

// Hero element enters first, supporting content follows
<Animated.View entering={FadeIn.duration(300)}>
  <HeroContent />
</Animated.View>
<Animated.View entering={FadeInDown.delay(150).springify()}>
  <SupportingContent />
</Animated.View>
```

### When to Animate
- Screen/modal entry (staggered reveals)
- State changes that benefit from visual continuity
- Success/completion moments

### When NOT to Animate
- Every button press (haptics are enough)
- Trivial state changes
- Rapid user interactions (don't slow them down)

---

## Creating Visual Depth (Avoid Flat Design)

**Layer elements to create atmosphere**:

```tsx
// Background layer with subtle depth
<StyledLeanView className="flex-1 bg-background">
  {/* Optional: Gradient or pattern overlay for atmosphere */}

  {/* Content layer */}
  <StyledLeanView className="flex-1 p-4">
    {/* Cards float above with shadows and glass effects */}
    <GlassView
      glassEffectStyle="regular"
      style={{ borderRadius: 20, borderCurve: "continuous" }}
    >
      <CardContent />
    </GlassView>
  </StyledLeanView>

  {/* Floating action layer (highest z-index) */}
  <GlassView
    className="absolute bottom-8 right-4"
    glassEffectStyle="regular"
    isInteractive
  >
    <FloatingActionButton />
  </GlassView>
</StyledLeanView>
```

**Depth techniques**:
- Use glass effects for floating/overlay elements
- Apply subtle shadows to elevated components
- Layer backgrounds (base → content → floating actions)
- Use opacity and blur to create visual hierarchy

---

## Examples of Distinctive Design

### Example 1: Fund Progress Card (With Depth & Motion)

```tsx
<Animated.View entering={FadeInDown.delay(index * 60).springify()}>
  <GlassView
    glassEffectStyle="regular"
    style={{ borderRadius: 20, borderCurve: "continuous" }}
  >
    <ScalePressable onPress={handlePress}>
      <StyledLeanText className="font-nunito-bold text-3xl text-foreground">
        {currencyFormatter.format(fund.balance)}
      </StyledLeanText>
      <AnimatedProgressBar progress={fund.spent / fund.budget} />
    </ScalePressable>
  </GlassView>
</Animated.View>
```

**What makes it distinctive**: Glass depth, staggered entry animation, bold typography scale, spring physics.

### Example 2: Transaction List (Orchestrated Entry)

```tsx
// Hero summary enters first
<Animated.View entering={FadeIn.duration(250)}>
  <MonthlySummary total={monthTotal} />
</Animated.View>

// Transactions stagger in after
{transactions.map((tx, i) => (
  <Animated.View
    key={tx.id}
    entering={FadeInDown.delay(100 + i * 40).springify()}
  >
    <ContextMenu>
      <ContextMenu.Items>
        <Button systemImage="pencil" onPress={() => handleEdit(tx)}>Edit</Button>
        <Button systemImage="trash" onPress={() => handleDelete(tx)}>Delete</Button>
      </ContextMenu.Items>
      <ContextMenu.Trigger>
        <TransactionRow transaction={tx} />
      </ContextMenu.Trigger>
    </ContextMenu>
  </Animated.View>
))}
```

**What makes it distinctive**: Orchestrated reveal (hero first, then staggered list), native iOS context menu, clear visual hierarchy.

### Example 3: Budget Entry Screen (Layered Depth)

```tsx
<StyledLeanView className="flex-1 bg-background">
  <ScrollView className="flex-1 p-4">
    <Animated.View entering={FadeIn.duration(200)}>
      <AmountInput />
    </Animated.View>
    <Animated.View entering={FadeInDown.delay(100).springify()}>
      <FundSelector />
    </Animated.View>
    <Animated.View entering={FadeInDown.delay(150).springify()}>
      <DateSelector />
    </Animated.View>
  </ScrollView>

  <GlassView
    className="absolute bottom-8 left-4 right-4"
    glassEffectStyle="regular"
    isInteractive
  >
    <SubmitButton onPress={handleSubmit} />
  </GlassView>
</StyledLeanView>
```

**What makes it distinctive**: Layered z-depth, staggered form fields, glass floating button creates premium feel.

---

## Anti-Patterns Checklist

| Anti-Pattern | Instead Do |
|--------------|------------|
| Generic dashboard layout (grid of identical cards) | Hero metric that dominates, supporting cards that recede |
| Flat backgrounds everywhere | Layer glass effects, use floating elements, create atmosphere |
| Uniform animations (same fade on everything) | Orchestrated reveals with meaningful delays and spring physics |
| Timid color usage (muted, evenly-distributed) | Bold primary elements, sharp accent highlights, clear contrast |
| Cookie-cutter component layouts | Ask what makes THIS screen unique |
| SwiftUI `Host`/`HStack` with `glassEffect` outside ContextMenu | Use `GlassButton` + `IconSymbol` from existing components |
