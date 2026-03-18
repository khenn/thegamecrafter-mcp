# Card and Deck Component Profiles

Use this reference for deck identity selection and card workflow preflight.

## Current source set
- Card Decks: `https://help.thegamecrafter.com/article/47-card-decks`
- Card Deck Randomizer: `https://help.thegamecrafter.com/article/46-card-deck-randomizer`
- How to make a Card Game / Tarot Deck: `https://help.thegamecrafter.com/article/399-how-to-make-a-card-game-tarot-deck`
- Custom Playing Cards: `https://help.thegamecrafter.com/article/48-custom-playing-cards`
- Designing for Foil: `https://help.thegamecrafter.com/article/501-designing-for-foil`
- Printing With White Ink: `https://help.thegamecrafter.com/article/427-printing-with-white-ink`
- UV Coating: `https://help.thegamecrafter.com/article/169-uv-coating`
- Templates: `https://help.thegamecrafter.com/article/39-templates`

## Product API pattern
- Product API URL pattern for all identities below:
  - `https://www.thegamecrafter.com/api/tgc/products/<Identity>`

## Shared card/deck guardrails
- All active card identities here are created through `/api/deck`.
- Standard slot model is `face` + `back`.
- Use deck create before card create.
- Prefer shared deck-back strategy when the user only has one back image.
- Randomized-deck workflows need an explicit warning about bulk-pricing limitations.
- Foil decks should trigger foil-specific design guidance before mutation.
- Clear decks should trigger white-ink visibility guidance before mutation.

## Family guidance

### Traditional decks
- Primary help:
  - `https://help.thegamecrafter.com/article/47-card-decks`
  - `https://help.thegamecrafter.com/article/399-how-to-make-a-card-game-tarot-deck`
- Best default when the user wants standard card play and no unusual stock or geometry.

### Specialty decks
- Primary help:
  - `https://help.thegamecrafter.com/article/47-card-decks`
  - `https://help.thegamecrafter.com/article/48-custom-playing-cards`
  - `https://help.thegamecrafter.com/article/39-templates`
- Use when the card shape, size, or stock is part of the design requirement.

### Foil decks
- Primary help:
  - `https://help.thegamecrafter.com/article/501-designing-for-foil`
  - `https://help.thegamecrafter.com/article/47-card-decks`
- Do not treat foil as a cosmetic afterthought; warn about foil-aware art choices first.

### Clear decks
- Primary help:
  - `https://help.thegamecrafter.com/article/427-printing-with-white-ink`
  - `https://help.thegamecrafter.com/article/47-card-decks`
- White/opacity behavior needs to be explicit before mutation.

## Identity profiles

### Traditional deck identities
- (`BridgeDeck`) Product: `https://www.thegamecrafter.com/make/products/BridgeDeck`; size: `750x1125`; slots: `face`, `back`; help:
  - `https://help.thegamecrafter.com/article/47-card-decks`
  - `https://help.thegamecrafter.com/article/399-how-to-make-a-card-game-tarot-deck`
- (`BusinessDeck`) Product: `https://www.thegamecrafter.com/make/products/BusinessDeck`; size: `675x1125`; slots: `face`, `back`; help:
  - `https://help.thegamecrafter.com/article/47-card-decks`
  - `https://help.thegamecrafter.com/article/399-how-to-make-a-card-game-tarot-deck`
- (`DividerDeck`) Product: `https://www.thegamecrafter.com/make/products/DividerDeck`; size: `975x1125`; slots: `face`, `back`; help:
  - `https://help.thegamecrafter.com/article/47-card-decks`
  - `https://help.thegamecrafter.com/article/399-how-to-make-a-card-game-tarot-deck`
- (`DominoDeck`) Product: `https://www.thegamecrafter.com/make/products/DominoDeck`; size: `600x1125`; slots: `face`, `back`; help:
  - `https://help.thegamecrafter.com/article/47-card-decks`
  - `https://help.thegamecrafter.com/article/399-how-to-make-a-card-game-tarot-deck`
- (`EuroPokerDeck`) Product: `https://www.thegamecrafter.com/make/products/EuroPokerDeck`; size: `825x1125`; slots: `face`, `back`; help:
  - `https://help.thegamecrafter.com/article/47-card-decks`
  - `https://help.thegamecrafter.com/article/399-how-to-make-a-card-game-tarot-deck`
- (`JumboDeck`) Product: `https://www.thegamecrafter.com/make/products/JumboDeck`; size: `1125x1725`; slots: `face`, `back`; help:
  - `https://help.thegamecrafter.com/article/47-card-decks`
  - `https://help.thegamecrafter.com/article/399-how-to-make-a-card-game-tarot-deck`
- (`MicroDeck`) Product: `https://www.thegamecrafter.com/make/products/MicroDeck`; size: `450x600`; slots: `face`, `back`; help:
  - `https://help.thegamecrafter.com/article/47-card-decks`
  - `https://help.thegamecrafter.com/article/399-how-to-make-a-card-game-tarot-deck`
- (`MiniDeck`) Product: `https://www.thegamecrafter.com/make/products/MiniDeck`; size: `600x825`; slots: `face`, `back`; help:
  - `https://help.thegamecrafter.com/article/47-card-decks`
  - `https://help.thegamecrafter.com/article/399-how-to-make-a-card-game-tarot-deck`
- (`MintTinDeck`) Product: `https://www.thegamecrafter.com/make/products/MintTinDeck`; size: `750x1125`; slots: `face`, `back`; help:
  - `https://help.thegamecrafter.com/article/47-card-decks`
  - `https://help.thegamecrafter.com/article/399-how-to-make-a-card-game-tarot-deck`
- (`PokerDeck`) Product: `https://www.thegamecrafter.com/make/products/PokerDeck`; size: `825x1125`; slots: `face`, `back`; help:
  - `https://help.thegamecrafter.com/article/47-card-decks`
  - `https://help.thegamecrafter.com/article/399-how-to-make-a-card-game-tarot-deck`
- (`TarotDeck`) Product: `https://www.thegamecrafter.com/make/products/TarotDeck`; size: `900x1500`; slots: `face`, `back`; help:
  - `https://help.thegamecrafter.com/article/47-card-decks`
  - `https://help.thegamecrafter.com/article/399-how-to-make-a-card-game-tarot-deck`
- (`TradingDeck`) Product: `https://www.thegamecrafter.com/make/products/TradingDeck`; size: `825x1125`; slots: `face`, `back`; help:
  - `https://help.thegamecrafter.com/article/47-card-decks`
  - `https://help.thegamecrafter.com/article/46-card-deck-randomizer`
  - `https://help.thegamecrafter.com/article/399-how-to-make-a-card-game-tarot-deck`
- (`USGameDeck`) Product: `https://www.thegamecrafter.com/make/products/USGameDeck`; size: `750x1125`; slots: `face`, `back`; help:
  - `https://help.thegamecrafter.com/article/47-card-decks`
  - `https://help.thegamecrafter.com/article/399-how-to-make-a-card-game-tarot-deck`

### Specialty deck identities
- (`CardCraftingDeck`) Product: `https://www.thegamecrafter.com/make/products/CardCraftingDeck`; size: `900x1500`; slots: `face`, `back`; help:
  - `https://help.thegamecrafter.com/article/47-card-decks`
  - `https://help.thegamecrafter.com/article/48-custom-playing-cards`
- (`CircleDeck`) Product: `https://www.thegamecrafter.com/make/products/CircleDeck`; size: `1125x1125`; slots: `face`, `back`; help:
  - `https://help.thegamecrafter.com/article/47-card-decks`
  - `https://help.thegamecrafter.com/article/39-templates`
- (`EuroSquareDeck`) Product: `https://www.thegamecrafter.com/make/products/EuroSquareDeck`; size: `900x900`; slots: `face`, `back`; help:
  - `https://help.thegamecrafter.com/article/47-card-decks`
  - `https://help.thegamecrafter.com/article/39-templates`
- (`HexDeck`) Product: `https://www.thegamecrafter.com/make/products/HexDeck`; size: `1200x1050`; slots: `face`, `back`; help:
  - `https://help.thegamecrafter.com/article/47-card-decks`
  - `https://help.thegamecrafter.com/article/39-templates`
- (`SmallSquareDeck`) Product: `https://www.thegamecrafter.com/make/products/SmallSquareDeck`; size: `825x825`; slots: `face`, `back`; help:
  - `https://help.thegamecrafter.com/article/47-card-decks`
  - `https://help.thegamecrafter.com/article/39-templates`
- (`SquareDeck`) Product: `https://www.thegamecrafter.com/make/products/SquareDeck`; size: `1125x1125`; slots: `face`, `back`; help:
  - `https://help.thegamecrafter.com/article/47-card-decks`
  - `https://help.thegamecrafter.com/article/39-templates`

### Foil deck identities
- (`FoilEuroPokerDeck`) Product: `https://www.thegamecrafter.com/make/products/FoilEuroPokerDeck`; size: `825x1125`; slots: `face`, `back`; help:
  - `https://help.thegamecrafter.com/article/501-designing-for-foil`
  - `https://help.thegamecrafter.com/article/47-card-decks`
- (`FoilPokerDeck`) Product: `https://www.thegamecrafter.com/make/products/FoilPokerDeck`; size: `825x1125`; slots: `face`, `back`; help:
  - `https://help.thegamecrafter.com/article/501-designing-for-foil`
  - `https://help.thegamecrafter.com/article/47-card-decks`
- (`FoilTarotDeck`) Product: `https://www.thegamecrafter.com/make/products/FoilTarotDeck`; size: `900x1500`; slots: `face`, `back`; help:
  - `https://help.thegamecrafter.com/article/501-designing-for-foil`
  - `https://help.thegamecrafter.com/article/47-card-decks`

### Clear deck identities
- (`ClearCardCraftingDeck`) Product: `https://www.thegamecrafter.com/make/products/ClearCardCraftingDeck`; size: `900x1500`; slots: `face`, `back`; help:
  - `https://help.thegamecrafter.com/article/427-printing-with-white-ink`
  - `https://help.thegamecrafter.com/article/47-card-decks`
- (`ClearEuroPokerDeck`) Product: `https://www.thegamecrafter.com/make/products/ClearEuroPokerDeck`; size: `825x1125`; slots: `face`, `back`; help:
  - `https://help.thegamecrafter.com/article/427-printing-with-white-ink`
  - `https://help.thegamecrafter.com/article/47-card-decks`
