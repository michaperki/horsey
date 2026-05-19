# Core Product Priorities

Status: Active
Created: 2026-05-19
Last updated: 2026-05-19

## Product Intent

Horsey should become a wager-enhanced chess platform where players can stake tokens or sweepstakes currency, play or resolve games fairly, settle outcomes transparently, and return for rivalry, stats, seasons, and community competition.

The strongest long-term direction is in-house wagered chess, because it gives Horsey control over the game loop, clocks, settlement, replay/history, and retention mechanics. Lichess should remain useful as identity, ratings, trust scaffolding, and possibly an external-game bridge, but it should not split the first release into two competing core products.

## Strategic Focus

Ship one complete and trustworthy wagered-game loop before expanding supporting features.

The first meaningful milestone:

> 20 real users complete 100 wagered games with clear settlement, understandable rules, and enough confidence to return for another match.

## Priority List

### P0 - Decide And Stabilize The Core Loop

- Choose the first release path: in-house wagered chess as primary, Lichess as account/rating support.
- Cleanly commit or intentionally park the current `feat/matching` and `feat/presence` work.
- Make one path work end to end: register, authenticate, create bet, accept/match, start game, play, finish, settle balance, notify users, record history.
- Remove or hide UI paths that imply complete functionality before they are reliable.

### P1 - Trust, Fairness, And Settlement

- Define the canonical bet lifecycle and states.
- Ensure game outcome processing is idempotent so balances cannot double-settle.
- Add transparent result history with game ID, opponent, amount, currency, result, winnings, and settlement timestamp.
- Add basic dispute/failure handling for abandoned games, timeouts, disconnects, draw agreements, and server restarts.
- Write clear user-facing rules for wagered games, draws, cancellations, timeouts, and settlement.

### P1 - In-House Chess Hardening

- Persist enough game state to recover active games after backend restart.
- Verify socket events are authorized: only game participants can move, resign, offer/respond to draw, or receive private game data.
- Validate turn ownership server-side.
- Make clocks authoritative on the backend.
- Add tests for moves, illegal moves, checkmate, resignation, timeout, draw, and linked bet settlement.

### P2 - Onboarding And First Match

- Make the first-run experience explain the product quickly: play chess, stake tokens, win/lose transparently.
- Give new users a low-risk path to their first game.
- Show whether there are available opponents or open bets before a user commits.
- Make Lichess connection optional only if in-house play does not require it; otherwise clearly explain why it is required.

### P2 - Liquidity And Matching

- Build around the empty-room problem.
- Support open challenges with visible time control, amount, currency, rating band, and creator.
- Consider friend/private challenge links before broad matchmaking.
- Add lightweight presence: who is online, which bets are open, and whether a user can accept immediately.

### P2 - Retention Systems

- Prioritize rivalry and progress over store complexity.
- Improve stats that users care about: record, recent games, streaks, biggest win/loss, favorite time controls.
- Use seasons only when the core loop is stable enough for repeated play.
- Add rematch and challenge-again flows before building broad social features.

### P3 - Economy, Payments, And Compliance

- Separate play-money token behavior from anything with sweepstakes or cash-like implications.
- Document balance rules, purchase rules, prize rules, and account limits.
- Add abuse controls: duplicate accounts, suspicious outcomes, rapid settlements, and balance manipulation checks.
- Treat legal/compliance review as a product dependency before public real-money or sweepstakes launch.

### P3 - Operational Readiness

- Keep health checks, metrics, logging, and Docker support, but do not let ops work outrun product validation.
- Add production error tracking before broader beta.
- Create a small admin view for failed settlements, suspicious games, and user support.

## Internal Conflicts To Resolve

- Lichess betting vs in-house chess: choose one primary release experience.
- Tokens vs sweepstakes: clarify whether early users are playing for fun, prizes, or purchases.
- Store vs competition: users need reasons to play before reasons to buy.
- Seasons vs liquidity: seasons are not useful until enough games are happening.
- Broad feature set vs trust: wagered games need reliability more than breadth.

## Likely User-Acquisition Hurdles

- Users may not trust wagered chess until rules, settlement, and anti-cheat posture are visible.
- Match liquidity will be hard at the start.
- Chess skill gaps can make wagering feel unfair.
- Losing a first game may cause immediate churn unless the experience feels fair and repeatable.
- Communities may be easier than cold traffic: Discord groups, streamers, clubs, and friend challenges.

## Likely Retention Hurdles

- Users need fast rematches or available opponents.
- Stats must make progress visible even after losses.
- Match quality matters: rating mismatch will hurt retention.
- The app must avoid feeling like a casino skin over chess; it needs a chess-native competitive identity.

## Mentorship Notes

- Reduce scope before adding more features. A narrow, complete product loop beats a broad, partially reliable app.
- Treat trust as a feature. In wagered competition, fairness and transparency are not polish.
- Write down product decisions as soon as they are made. This repo should become a record of what was chosen and what was deferred.
- Measure learning, not output. The goal is not to build every plausible system; it is to discover whether users want this loop enough to return.
- Avoid building for imaginary scale before proving real desire. Use small groups, manual support, and visible iteration.

## Next Implementation Steps

1. Audit the current in-house chess and matching work and decide what should be committed.
2. Write the canonical bet/game lifecycle as a short technical spec.
3. Add tests around game outcome settlement and balance idempotency.
4. Make the UI expose only the reliable first-release path.
5. Create a first-user onboarding checklist and test it manually with a fresh account.

## Deferred For Now

- Broad public matchmaking.
- Advanced store/payment expansion.
- Rich seasonal rewards.
- Complex social feeds.
- Real-money or sweepstakes launch without legal/compliance review.
