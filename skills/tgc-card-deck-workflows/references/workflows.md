# TGC Card and Deck Workflows

Use this reference for card/deck recommendation, preflight, and sequencing.

## Primary use cases
- choose the right deck identity when the user only knows card size, style, or intended packaging
- create a deck and then populate cards safely
- decide shared-back vs unique-back strategy
- warn about foil, clear, or randomized-deck tradeoffs before mutation

## Recommendation order when deck identity is unspecified
1. Clarify what the user is optimizing for:
   - card size/shape
   - whether the deck should fit existing or intended packaging
   - whether they need foil, clear stock, or novelty shapes
2. Present at most 2-3 viable deck identities.
3. Prefer familiar form factors unless the user explicitly wants a specialty shape:
   - `PokerDeck` / `EuroPokerDeck` / `TarotDeck` for mainstream card-game flows
   - `BridgeDeck`, `BusinessDeck`, `MiniDeck`, `MicroDeck`, `JumboDeck` for size-driven needs
   - `SquareDeck`, `SmallSquareDeck`, `EuroSquareDeck`, `CircleDeck`, `HexDeck` for specialty layouts
   - `Foil*` identities only when foil is a real design requirement
   - `Clear*` identities only when the user understands white-ink/opacity constraints
4. If likely packaging depends on the deck choice, mention the packaging follow-up and route to `tgc-packaging-workflows` after the deck decision is made.

## Validation order
1. Resolve deck create vs existing deck update.
2. Resolve deck identity or narrow to 2-3 options.
3. Validate art plan:
   - whether there is one shared back image or per-card back art
   - whether fronts are ready
   - whether foil/clear design constraints apply
4. Validate workflow type:
   - `tgc_deck_create` first
   - then `tgc_card_create` or `tgc_deck_bulk_create_cards`
5. For randomized/TCG-like requests, warn about randomizer and class/bulk-pricing implications before create.
6. Route trim/safe-zone/layout issues to `tgc-image-preflight-fit`.

## Special card/deck cautions
- `Card Deck Randomizer` guidance implies randomized decks can affect bulk-pricing eligibility; warn before steering the user into randomized deck behavior.
- Foil decks need design-aware treatment; do not treat foil as a simple stock swap without warning about foil design considerations.
- Clear decks and other non-paper/clear stock use cases need white-ink awareness; do not assume pure white prints visibly.
- If the user only has one back image, prefer deck-level shared back strategy instead of asking for unnecessary unique back files.

## Mutation defaults
- Create the deck container first with the correct identity.
- Use `tgc_deck_bulk_create_cards` when the user already has a batch of prepared card fronts/backs.
- Use `tgc_card_create` for incremental card additions or small deck edits.
- For revisions to existing cards, prefer targeted updates only where supported; otherwise explain when recreate is necessary.

## Post-mutation verification
- After deck create, verify deck exists before adding cards.
- After card create or bulk create, use deck card listing/readback to confirm card count and expected backs/fronts.
- If the user intends to package the deck, recommend packaging follow-up rather than assuming the deck is now prototype-complete.

## Output contract
- `status`: `proceed | block | needs_input`
- `reasons`: concise list of card/deck-specific blockers or cautions
- `next_actions`: ordered steps
- `recommended_options`: present only when deck identity is still undecided
