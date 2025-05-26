/**
 * Toast notification types and interfaces for Toasavi
 */

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export type ToastPosition = 
  | 'top-right' 
  | 'top-left' 
  | 'bottom-right' 
  | 'bottom-left' 
  | 'top-center' 
  | 'bottom-center';

export interface ToastOptions {
  /** The message to display in the toast */
  message: string;
  
  /** The type of toast which affects styling */
  type?: ToastType;
  
  /** Duration in milliseconds before auto-dismiss (0 for persistent) */
  duration?: number;
  
  /** Position where the toast should appear */
  position?: ToastPosition;
  
  /** Whether to show a close button */
  closable?: boolean;
  
  /** Additional CSS class name */
  className?: string;
  
  /** Callback fired when toast is clicked */
  onClick?: () => void;
  
  /** Callback fired when toast is closed */
  onClose?: () => void;
  
  /** Custom icon HTML or element */
  icon?: string | HTMLElement;
  
  /** Whether to pause auto-dismiss on hover */
  pauseOnHover?: boolean;
  
  /** Custom styles object */
  style?: Partial<CSSStyleDeclaration>;
}

export interface ToasaviConfig {
  /** Default duration for all toasts */
  defaultDuration?: number;
  
  /** Default position for all toasts */
  defaultPosition?: ToastPosition;
  
  /** Maximum number of toasts to show at once */
  maxToasts?: number;
  
  /** Spacing between toasts in pixels */
  spacing?: number;
  
  /** Z-index for toast container */
  zIndex?: number;
  
  /** Default toast type */
  defaultType?: ToastType;
  
  /** Whether toasts are closable by default */
  defaultClosable?: boolean;
  
  /** Whether to pause on hover by default */
  defaultPauseOnHover?: boolean;
  
  /** Animation duration in milliseconds */
  animationDuration?: number;
  
  /** Custom theme object */
  theme?: ToastTheme;
}

export interface ToastTheme {
  /** Color scheme for different toast types */
  colors?: {
    success?: string;
    error?: string;
    warning?: string;
    info?: string;
  };
  
  /** Typography settings */
  typography?: {
    fontFamily?: string;
    fontSize?: string;
    fontWeight?: string;
    lineHeight?: string;
  };
  
  /** Border and spacing */
  spacing?: {
    padding?: string;
    borderRadius?: string;
    borderWidth?: string;
  };
  
  /** Shadow and effects */
  effects?: {
    boxShadow?: string;
    backdropFilter?: string;
  };
}

export interface ToastInstance {
  /** Unique identifier for the toast */
  id: string;
  
  /** DOM element of the toast */
  element: HTMLElement;
  
  /** Options used to create this toast */
  options: Required<ToastOptions>;
  
  /** Function to remove this specific toast */
  remove: () => void;
  
  /** Function to update toast content */
  update: (newOptions: Partial<ToastOptions>) => void;
  
  /** Current state of the toast */
  state: 'showing' | 'visible' | 'hiding' | 'hidden';
  
  /** Timestamp when toast was created */
  createdAt: number;
  
  /** Timer ID for auto-dismiss */
  timerId?: number;
}

export interface ToastEventMap {
  /** Fired when a toast is shown */
  show: { toast: ToastInstance };
  
  /** Fired when a toast is hidden */
  hide: { toast: ToastInstance };
  
  /** Fired when a toast is clicked */
  click: { toast: ToastInstance; event: MouseEvent };
  
  /** Fired when a toast is closed */
  close: { toast: ToastInstance };
  
  /** Fired when all toasts are cleared */
  clear: { count: number };
  
  /** Fired when toast limit is reached */
  limit: { removedToast: ToastInstance; newToast: ToastInstance };
}

export type ToastEventListener<K extends keyof ToastEventMap> = (
  event: ToastEventMap[K]
) => void;

export interface ToastManagerInterface {
  /** Show a toast with custom options */
  show(options: ToastOptions): string;
  
  /** Show a success toast */
  success(message: string, options?: Omit<ToastOptions, 'message' | 'type'>): string;
  
  /** Show an error toast */
  error(message: string, options?: Omit<ToastOptions, 'message' | 'type'>): string;
  
  /** Show a warning toast */
  warning(message: string, options?: Omit<ToastOptions, 'message' | 'type'>): string;
  
  /** Show an info toast */
  info(message: string, options?: Omit<ToastOptions, 'message' | 'type'>): string;
  
  /** Remove a specific toast by ID */
  removeToast(id: string): boolean;
  
  /** Clear all toasts */
  clear(): void;
  
  /** Get all active toasts */
  getToasts(): ToastInstance[];
  
  /** Get a specific toast by ID */
  getToast(id: string): ToastInstance | undefined;
  
  /** Update configuration */
  configure(config: Partial<ToasaviConfig>): void;
  
  /** Add event listener */
  on<K extends keyof ToastEventMap>(event: K, listener: ToastEventListener<K>): void;
  
  /** Remove event listener */
  off<K extends keyof ToastEventMap>(event: K, listener: ToastEventListener<K>): void;
  
  /** Destroy the toast manager */
  destroy(): void;
}

export interface ToastAnimationConfig {
  /** Entry animation name */
  enter?: string;
  
  /** Exit animation name */
  exit?: string;
  
  /** Animation duration in milliseconds */
  duration?: number;
  
  /** Animation easing function */
  easing?: string;
}

export interface ToastAccessibilityConfig {
  /** ARIA role for toasts */
  role?: string;
  
  /** ARIA live region politeness */
  ariaLive?: 'polite' | 'assertive' | 'off';
  
  /** Whether to announce toasts to screen readers */
  announce?: boolean;
  
  /** Custom announcement message template */
  announcementTemplate?: string;
}

export interface ToastQueueConfig {
  /** Maximum number of toasts in queue */
  maxQueue?: number;
  
  /** Strategy when queue is full */
  strategy?: 'drop-oldest' | 'drop-newest' | 'wait';
  
  /** Delay between showing queued toasts */
  delay?: number;
}

// Advanced configuration interface combining all options
export interface AdvancedToasaviConfig extends ToasaviConfig {
  /** Animation configuration */
  animations?: ToastAnimationConfig;
  
  /** Accessibility configuration */
  accessibility?: ToastAccessibilityConfig;
  
  /** Queue management configuration */
  queue?: ToastQueueConfig;
}

// Utility types for method overloads
export type ToastShorthandOptions = Omit<ToastOptions, 'message' | 'type'>;

export type ToastUpdateOptions = Partial<Pick<ToastOptions, 
  'message' | 'duration' | 'className' | 'onClick' | 'onClose' | 'style'
>>;

// Plugin system types for extensibility
export interface ToastPlugin {
  name: string;
  version: string;
  install: (manager: ToastManagerInterface) => void;
  uninstall?: (manager: ToastManagerInterface) => void;
}

export interface ToastMiddleware {
  before?: (options: ToastOptions) => ToastOptions | false;
  after?: (instance: ToastInstance) => void;
}

// Export all types as a namespace for convenience
export namespace Toasavi {
  export type Options = ToastOptions;
  export type Config = ToasaviConfig;
  export type Instance = ToastInstance;
  export type Manager = ToastManagerInterface;
  export type Theme = ToastTheme;
  export type Position = ToastPosition;
  export type Type = ToastType;
  export type Plugin = ToastPlugin;
  export type Middleware = ToastMiddleware;
}