export interface ToastOptions {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  closable?: boolean;
  className?: string;
  onClick?: () => void;
  onClose?: () => void;
}

export interface ToasaviConfig {
  defaultDuration?: number;
  defaultPosition?: ToastOptions['position'];
  maxToasts?: number;
  spacing?: number;
  zIndex?: number;
}

class ToasaviManager {
  private container: HTMLElement | null = null;
  private toasts: Map<string, HTMLElement> = new Map();
  private config: Required<ToasaviConfig> = {
    defaultDuration: 4000,
    defaultPosition: 'top-right',
    maxToasts: 5,
    spacing: 10,
    zIndex: 10000
  };

  constructor(config?: ToasaviConfig) {
    if (config) {
      this.config = { ...this.config, ...config };
    }
    this.initContainer();
    this.injectStyles();
  }

  private initContainer(): void {
    if (typeof window === 'undefined') return;
    
    this.container = document.createElement('div');
    this.container.className = 'toasavi-container';
    this.container.style.cssText = `
      position: fixed;
      pointer-events: none;
      z-index: ${this.config.zIndex};
      ${this.getPositionStyles(this.config.defaultPosition)}
    `;
    document.body.appendChild(this.container);
  }

  private getPositionStyles(position: ToastOptions['position']): string {
    const styles: Record<string, string> = {
      'top-right': 'top: 20px; right: 20px;',
      'top-left': 'top: 20px; left: 20px;',
      'bottom-right': 'bottom: 20px; right: 20px;',
      'bottom-left': 'bottom: 20px; left: 20px;',
      'top-center': 'top: 20px; left: 50%; transform: translateX(-50%);',
      'bottom-center': 'bottom: 20px; left: 50%; transform: translateX(-50%);'
    };
    return styles[position || 'top-right'];
  }

  private injectStyles(): void {
    if (typeof window === 'undefined' || document.getElementById('toasavi-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'toasavi-styles';
    styles.textContent = `
      .toasavi-toast {
        background: white;
        border-radius: 8px;
        padding: 16px 20px;
        margin-bottom: ${this.config.spacing}px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        border-left: 4px solid #2196F3;
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 300px;
        max-width: 500px;
        pointer-events: all;
        cursor: pointer;
        transition: all 0.3s ease;
        opacity: 0;
        transform: translateX(100%);
        animation: toasavi-slide-in 0.3s ease forwards;
      }

      .toasavi-toast.toasavi-success {
        border-left-color: #4CAF50;
      }

      .toasavi-toast.toasavi-error {
        border-left-color: #F44336;
      }

      .toasavi-toast.toasavi-warning {
        border-left-color: #FF9800;
      }

      .toasavi-toast.toasavi-info {
        border-left-color: #2196F3;
      }

      .toasavi-toast:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
      }

      .toasavi-message {
        flex: 1;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        line-height: 1.4;
        color: #333;
      }

      .toasavi-close {
        background: none;
        border: none;
        color: #999;
        cursor: pointer;
        font-size: 18px;
        margin-left: 12px;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.2s ease;
      }

      .toasavi-close:hover {
        background: #f0f0f0;
        color: #666;
      }

      @keyframes toasavi-slide-in {
        from {
          opacity: 0;
          transform: translateX(100%);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      @keyframes toasavi-slide-out {
        from {
          opacity: 1;
          transform: translateX(0);
        }
        to {
          opacity: 0;
          transform: translateX(100%);
        }
      }

      .toasavi-toast.toasavi-removing {
        animation: toasavi-slide-out 0.3s ease forwards;
      }
    `;
    document.head.appendChild(styles);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private limitToasts(): void {
    if (this.toasts.size >= this.config.maxToasts) {
      const firstToast = this.toasts.values().next().value;
      if (firstToast) {
        this.removeToast(firstToast.dataset.toastId!);
      }
    }
  }

  show(options: ToastOptions): string {
    if (!this.container) return '';

    this.limitToasts();

    const id = this.generateId();
    const toast = document.createElement('div');
    toast.className = `toasavi-toast toasavi-${options.type || 'info'} ${options.className || ''}`;
    toast.dataset.toastId = id;

    const message = document.createElement('div');
    message.className = 'toasavi-message';
    message.textContent = options.message;

    toast.appendChild(message);

    if (options.closable !== false) {
      const closeBtn = document.createElement('button');
      closeBtn.className = 'toasavi-close';
      closeBtn.innerHTML = '×';
      closeBtn.onclick = (e) => {
        e.stopPropagation();
        this.removeToast(id);
      };
      toast.appendChild(closeBtn);
    }

    if (options.onClick) {
      toast.onclick = options.onClick;
    }

    this.container.appendChild(toast);
    this.toasts.set(id, toast);

    const duration = options.duration !== undefined ? options.duration : this.config.defaultDuration;
    if (duration > 0) {
      setTimeout(() => {
        this.removeToast(id);
      }, duration);
    }

    return id;
  }

  removeToast(id: string): void {
    const toast = this.toasts.get(id);
    if (toast) {
      toast.classList.add('toasavi-removing');
      setTimeout(() => {
        if (toast && toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
        this.toasts.delete(id);
      }, 300);
    }
  }

  clear(): void {
    this.toasts.forEach((_, id) => this.removeToast(id));
  }

  success(message: string, options?: Omit<ToastOptions, 'message' | 'type'>): string {
    return this.show({ ...options, message, type: 'success' });
  }

  error(message: string, options?: Omit<ToastOptions, 'message' | 'type'>): string {
    return this.show({ ...options, message, type: 'error' });
  }

  warning(message: string, options?: Omit<ToastOptions, 'message' | 'type'>): string {
    return this.show({ ...options, message, type: 'warning' });
  }

  info(message: string, options?: Omit<ToastOptions, 'message' | 'type'>): string {
    return this.show({ ...options, message, type: 'info' });
  }
}

// Create default instance
const toasavi = new ToasaviManager();

// Export both the class and default instance
export { ToasaviManager };
export default toasavi;