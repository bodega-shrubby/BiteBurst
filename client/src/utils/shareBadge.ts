import type { BadgeVM } from './badges';

/**
 * Share badge utility for exporting badge images as PNG
 */

interface BadgeExportData {
  badge: BadgeVM;
  userDisplayName?: string;
}

/**
 * Create a canvas-based badge image for sharing/download
 */
export function generateBadgeImage(data: BadgeExportData): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      // Set canvas size (square format)
      const size = 400;
      canvas.width = size;
      canvas.height = size;

      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, size, size);
      gradient.addColorStop(0, '#FFF7ED'); // orange-50
      gradient.addColorStop(1, '#FED7AA'); // orange-200
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);

      // Border
      ctx.strokeStyle = '#FB923C'; // orange-400
      ctx.lineWidth = 4;
      ctx.strokeRect(2, 2, size - 4, size - 4);

      // Title "BiteBurst Achievement"
      ctx.fillStyle = '#EA580C'; // orange-600
      ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('BiteBurst Achievement', size / 2, 50);

      // Badge icon (simplified - just use emoji)
      ctx.font = '80px system-ui';
      ctx.textAlign = 'center';
      const badgeIcon = data.badge.code.includes('STREAK') ? '🔥' :
                       data.badge.code.includes('FOOD') ? '🍎' :
                       data.badge.code.includes('ACTIVITY') ? '⚽' :
                       data.badge.code.includes('WATER') ? '💧' :
                       data.badge.code.includes('COMBO') ? '⚡' : '🏆';
      ctx.fillText(badgeIcon, size / 2, 160);

      // Badge name
      ctx.fillStyle = '#1F2937'; // gray-800
      ctx.font = 'bold 28px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(data.badge.name, size / 2, 220);

      // Personal record value if available
      if (data.badge.displayValue !== undefined) {
        ctx.fillStyle = '#EA580C'; // orange-600
        ctx.font = 'bold 32px system-ui, -apple-system, sans-serif';
        ctx.fillText(data.badge.displayValue.toLocaleString(), size / 2, 260);
      }

      // Badge description (wrapped)
      ctx.fillStyle = '#4B5563'; // gray-600
      ctx.font = '16px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      
      const description = data.badge.description || 'Achievement unlocked!';
      const words = description.split(' ');
      const lines: string[] = [];
      let currentLine = '';
      
      words.forEach(word => {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        const metrics = ctx.measureText(testLine);
        if (metrics.width > 300 && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      });
      if (currentLine) lines.push(currentLine);

      lines.forEach((line, index) => {
        ctx.fillText(line, size / 2, 300 + (index * 20));
      });

      // User name if provided
      if (data.userDisplayName) {
        ctx.fillStyle = '#6B7280'; // gray-500
        ctx.font = '14px system-ui, -apple-system, sans-serif';
        ctx.fillText(`Earned by ${data.userDisplayName}`, size / 2, size - 40);
      }

      // BiteBurst mascot/logo (simplified)
      ctx.fillStyle = '#FB923C'; // orange-400
      ctx.font = '20px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🍊 BiteBurst', size / 2, size - 15);

      // Convert to data URL
      const dataUrl = canvas.toDataURL('image/png');
      resolve(dataUrl);
      
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Download badge image as PNG file
 */
export async function downloadBadgeImage(badge: BadgeVM, userDisplayName?: string): Promise<void> {
  try {
    const dataUrl = await generateBadgeImage({ badge, userDisplayName });
    
    // Create download link
    const link = document.createElement('a');
    link.download = `biteburst_badge_${badge.code.toLowerCase()}.png`;
    link.href = dataUrl;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
  } catch (error) {
    console.error('Failed to download badge image:', error);
    throw error;
  }
}

/**
 * Share badge image (if Web Share API is available)
 */
export async function shareBadgeImage(badge: BadgeVM, userDisplayName?: string): Promise<void> {
  if (!navigator.share) {
    // Fallback to download
    await downloadBadgeImage(badge, userDisplayName);
    return;
  }

  try {
    const dataUrl = await generateBadgeImage({ badge, userDisplayName });
    
    // Convert data URL to Blob
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    const file = new File([blob], `biteburst_badge_${badge.code.toLowerCase()}.png`, { type: 'image/png' });

    await navigator.share({
      title: `BiteBurst Achievement: ${badge.name}`,
      text: `I just earned the "${badge.name}" badge on BiteBurst! 🎉`,
      files: [file]
    });
    
  } catch (error) {
    console.error('Failed to share badge image:', error);
    // Fallback to download
    await downloadBadgeImage(badge, userDisplayName);
  }
}