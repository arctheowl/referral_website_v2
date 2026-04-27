# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RapidReports website v3 — a marketing/product website. As of project creation, no framework has been chosen. When initializing, confirm the stack with the user before scaffolding (Next.js + Tailwind is a reasonable default).

## Design System

The full spec lives in `DESIGN.md`. All UI work must follow it. Key rules that are easy to get wrong:

### Non-negotiable shapes
- Buttons and inputs: `border-radius: 9999px` (full pill) — this is the signature shape
- Cards: 16px radius; featured/hero cards: 24px radius
- Never use >24px radius for containers

### Color tokens
| Token | Value | Usage |
|-------|-------|-------|
| Brand green | `#18E299` | CTAs, hover, focus rings — sparingly |
| Brand green light | `#d4fae8` | Badge backgrounds, tinted surfaces |
| Brand green deep | `#0fa76e` | Text on light-green badges |
| Near black | `#0d0d0d` | Headings, primary CTA background |
| Body text | `#333333` | Standard reading text |
| Border subtle | `rgba(0,0,0,0.05)` | Primary separation — 5% only |
| Border medium | `rgba(0,0,0,0.08)` | Interactive elements |

### Typography rules
- Fonts: **Inter** for all human-readable text, **Geist Mono** for code/technical labels only — never mix
- Weights: 400 (body), 500 (UI/nav/emphasis), 600 (headings) — no 700
- Letter-spacing scales with size: `-1.28px` at 64px, `-0.8px` at 40px, `-0.24px` at 24px, `normal` at 16px
- Geist Mono labels: always uppercase, 12px, letter-spacing 0.6px

### Layout constraints
- Max content width: 1200px
- Base spacing unit: 8px
- Section vertical padding: 48–96px desktop, 48px mobile
- Breakpoints: mobile <768px, tablet 768–1024px, desktop >1024px
- No gray background sections — white throughout, depth through borders and whitespace only

### Dark mode
- Background: `#0d0d0d`, text: `#ededed`, card: `#141414`
- Borders invert: `rgba(255,255,255,0.08)`
- Brand green `#18E299` is unchanged in dark mode

### Shadows
Mintlify barely uses shadows — prefer borders over shadows:
- Card ambient: `rgba(0,0,0,0.03) 0px 2px 4px`
- Button micro: `rgba(0,0,0,0.06) 0px 1px 2px`
- No heavy drop shadows
