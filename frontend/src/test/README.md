# Frontend Unit Tests

## Test Structure

```
src/test/
├── setup.ts                 # Test environment setup and mocks
├── hooks/                   # Hook tests
│   ├── useCopyToClipboard.test.ts
│   └── useMediaControls.test.ts
├── components/              # Component tests
│   ├── RoomInfo.test.tsx
│   └── CallControls.test.tsx
├── services/                # Service tests
│   └── WebRTCService.test.ts
└── utils/                   # Utility tests
    └── room.test.ts
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Test Coverage

The test suite covers:

- ✅ **Hooks**: useCopyToClipboard, useMediaControls
- ✅ **Components**: RoomInfo, CallControls  
- ✅ **Services**: WebRTCService
- ✅ **Utils**: room utilities

## Mocking Strategy

- **WebRTC APIs**: Mocked globally in setup.ts
- **Navigator APIs**: Mocked for getUserMedia and clipboard
- **External Dependencies**: Mocked using Jest mocks
- **React Hooks**: Mocked using jest.mock()

## Best Practices

- Each test file focuses on a single module
- Tests are isolated and independent
- Mocks are reset between tests
- Clear test descriptions and assertions
- Edge cases and error scenarios covered