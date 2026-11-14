
// TypeScript class to create and manage a pop-up window
interface PopupConfig {
    width?: number;
    height?: number;
    resizable?: string;
    scrollbars?: string;
    status?: string;
}
  
export class Popup {
    private url: string;
    private config: PopupConfig;
  
    constructor(url: string, config: PopupConfig = {}) {
      this.url = url;
      this.config = {
        width: config.width ?? 800,
        height: config.height ?? 600,
        resizable: config.resizable ?? 'no',
        scrollbars: config.scrollbars ?? 'yes',
        status: config.status ?? 'yes'
      };
    }
  
    public show(): void {
      // Construct the window features string
      const windowFeatures = `width=${this.config.width},height=${this.config.height},resizable=${this.config.resizable},scrollbars=${this.config.scrollbars},status=${this.config.status}`;
  
      // Open the pop-up window
      const popup = window.open(this.url, '_blank', windowFeatures);
  
      // Check if the pop-up was blocked
      if (!popup || popup.closed || typeof popup.closed == 'undefined') {
        alert('Pop-up blocked! Please allow pop-ups for this website to proceed.');
      }
    }
}