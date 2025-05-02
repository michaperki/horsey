# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands
- Frontend: `cd frontend && npm run start` (development), `cd frontend && npm run build` (production)
- Backend: `cd backend && npm run dev` (development), `cd backend && npm run start` (production)

## Test Commands
- Frontend: `cd frontend && npm run test` (all tests), `cd frontend && npm test -- -t "test name"` (single test)
- Backend: `cd backend && npm run test` (all tests), `cd backend && npm test -- -t "test name"` (single test)
- E2E: `cd frontend && npm run cypress:open` (interactive), `cd frontend && npm run cypress:run` (headless)

## Lint Commands
- Frontend: `cd frontend && npm run lint` (check), `cd frontend && npm run format` (fix)
- Backend: `cd backend && npm run lint` (check), `cd backend && npm run format` (fix)

## Code Style Guidelines
- Frontend: React with hooks, functional components, CSS modules
- Backend: Node.js with Express, MongoDB with Mongoose
- Use ES6+ syntax and async/await patterns
- Follow feature-based folder structure in frontend (features/feature-name/...)
- Handle errors with try/catch and use appropriate HTTP status codes
- Use camelCase for variables and functions, PascalCase for components and classes
- Use descriptive naming for functions and variables
- Import order: external libraries first, then internal modules