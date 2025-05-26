# Toasavi 🍞

A lightweight, customizable toast notification library for web applications with zero dependencies.

## Features

- 🚀 Lightweight (< 5KB gzipped)
- 🎨 Fully customizable with CSS
- 📱 Responsive design
- ⚡ Zero dependencies
- 🎯 TypeScript support
- 🔄 Multiple toast types (success, error, warning, info)
- 📍 Flexible positioning
- ⏱️ Auto-dismiss with customizable duration
- 🎭 Smooth animations
- 🎪 Queue management with max toast limits

## Installation

```bash
npm install toasavi
```

```bash
yarn add toasavi
```

## Quick Start

### ES6 Modules
```javascript
import toasavi from 'toasavi';

// Show a success toast
toasavi.success('Operation completed successfully!');

// Show an error toast
toasavi.error('Something went wrong!');

// Show a custom toast
toasavi.show({
  message: 'Hello World!',
  type: 'info',
  duration: 5000
});
```

### CommonJS
```javascript
const toasavi = require('toasavi').default;

toasavi.success('Hello from CommonJS!');
```

### Browser (UMD)
```html
<script src="https://unpkg.com/toasavi/dist/index.js"></script>
<script>
  toasavi.success('Hello from the browser!');
</script>
```

## API Reference

### Basic Methods

#### `toasavi.show(options)`
Shows a toast with custom options.

```javascript
const toastId = toasavi.show({
  message: 'Your message here',
  type: 'success', // 'success' | 'error' | 'warning' | 'info'
  duration: 4000, // milliseconds, 0 for persistent
  position: 'top-right', // see positions below
  closable: true, // show close button
  className: 'my-custom-class',
  onClick: () => console.log('Toast clicked!'),
  onClose: () => console.log('Toast closed!')
});
```

#### Shorthand Methods
```javascript
toasavi.success('Success message!');
toasavi.error('Error message!');
toasavi.warning('Warning message!');
toasavi.info('Info message!');

// With additional options
toasavi.success('Success!', { duration: 6000 });
```

### Management Methods

```javascript
// Remove a specific toast
toasavi.removeToast(toastId);

// Clear all toasts
toasavi.clear();
```

### Configuration

Create a custom instance with configuration:

```javascript
import { ToasaviManager } from 'toasavi';

const customToast = new ToasaviManager({
  defaultDuration: 6000,
  defaultPosition: 'bottom-center',
  maxToasts: 3,
  spacing: 15,
  zIndex: 9999
});

customToast.success('Custom configured toast!');
```

### Toast Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `message` | `string` | required | Toast message content |
| `type` | `'success' \| 'error' \| 'warning' \| 'info'` | `'info'` | Toast type for styling |
| `duration` | `number` | `4000` | Auto-dismiss duration (0 for persistent) |
| `position` | `string` | `'top-right'` | Toast position (see positions) |
| `closable` | `boolean` | `true` | Show close button |
| `className` | `string` | `''` | Additional CSS class |
| `onClick` | `function` | - | Click handler |
| `onClose` | `function` | - | Close handler |

### Positions

- `'top-right'` (default)
- `'top-left'`
- `'top-center'`
- `'bottom-right'`
- `'bottom-left'`
- `'bottom-center'`

## Styling

Toasavi comes with beautiful default styles, but you can customize everything:

```css
/* Override default styles */
.toasavi-toast {
  background: #your-color;
  border-radius: 12px;
  /* your custom styles */
}

.toasavi-success {
  border-left-color: #your-success-color;
}

.toasavi-error {
  border-left-color: #your-error-color;
}

/* Custom toast class */
.my-custom-toast {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  color: white;
}
```

Then use your custom class:
```javascript
toasavi.show({
  message: 'Custom styled toast!',
  className: 'my-custom-toast'
});
```

## Examples

### Persistent Toast
```javascript
toasavi.show({
  message: 'This toast will stay until manually closed',
  duration: 0,
  type: 'warning'
});
```

### Interactive Toast
```javascript
toasavi.show({
  message: 'Click me for action!',
  onClick: () => {
    alert('Toast clicked!');
  },
  onClose: () => {
    console.log('Toast was closed');
  }
});
```

### Custom Position
```javascript
toasavi.show({
  message: 'Bottom center toast',
  position: 'bottom-center',
  type: 'info'
});
```

## Browser Support

- Chrome/Edge 60+
- Firefox 55+
- Safari 11+
- iOS Safari 11+
- Android Browser 81+

## TypeScript

Toasavi is written in TypeScript and provides full type definitions:

```typescript
import toasavi, { ToastOptions, ToasaviConfig } from 'toasavi';

const options: ToastOptions = {
  message: 'TypeScript support!',
  type: 'success',
  duration: 3000
};

toasavi.show(options);
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT © [Your Name]

## Changelog

### v1.0.0
- Initial release
- Basic toast functionality
- TypeScript support
- Multiple toast types
- Customizable positioning
- Animation support