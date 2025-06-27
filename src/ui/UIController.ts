export class UIController {
  private recordedSample: Blob | null = null

  constructor() {}

  setRecordedSample(audioBlob: Blob): void {
    this.recordedSample = audioBlob
  }

  downloadSample(filename: string): void {
    if (!this.recordedSample) {
      throw new Error('No sample recorded yet')
    }

    // Create download link
    const url = URL.createObjectURL(this.recordedSample)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    
    // Clean up the URL object
    URL.revokeObjectURL(url)
  }

  clearRecordedSample(): void {
    this.recordedSample = null
  }

  hasRecordedSample(): boolean {
    return this.recordedSample !== null
  }

  getRecordedSampleSize(): number {
    return this.recordedSample?.size || 0
  }

  // Utility method to format file size for display
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Method to show visual feedback
  showNotification(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    // Create notification element
    const notification = document.createElement('div')
    notification.className = `notification notification-${type}`
    notification.textContent = message
    
    // Style the notification
    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '12px 24px',
      borderRadius: '6px',
      color: 'white',
      fontSize: '14px',
      fontWeight: '500',
      zIndex: '10000',
      opacity: '0',
      transform: 'translateX(100%)',
      transition: 'all 0.3s ease'
    })

    // Set background color based on type
    switch (type) {
      case 'success':
        notification.style.backgroundColor = '#10b981'
        break
      case 'error':
        notification.style.backgroundColor = '#ef4444'
        break
      default:
        notification.style.backgroundColor = '#3b82f6'
    }

    // Add to DOM
    document.body.appendChild(notification)

    // Animate in
    setTimeout(() => {
      notification.style.opacity = '1'
      notification.style.transform = 'translateX(0)'
    }, 10)

    // Remove after delay
    setTimeout(() => {
      notification.style.opacity = '0'
      notification.style.transform = 'translateX(100%)'
      setTimeout(() => {
        if (notification.parentNode) {
          document.body.removeChild(notification)
        }
      }, 300)
    }, 3000)
  }
}
