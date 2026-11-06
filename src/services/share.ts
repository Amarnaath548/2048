export interface DailyShareParams {
  dateStr: string;
  score: number;
  highestTierName: string;
  highestTierSymbol: string;
  streak: number;
}

export class ShareService {
  public static generateShareText(params: DailyShareParams): string {
    return (
      `🍱 Merge Mess Daily Challenge (${params.dateStr})\n` +
      `🔥 Score: ${params.score.toLocaleString()}\n` +
      `👑 Mastered: ${params.highestTierSymbol} ${params.highestTierName}\n` +
      `⚡ Daily Streak: ${params.streak} days\n\n` +
      `Can you reach the Golden Feast? Play free: ${window.location.origin}`
    );
  }

  public static async shareDailyResult(params: DailyShareParams): Promise<boolean> {
    const text = this.generateShareText(params);

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Merge Mess Daily Result',
          text
        });
        return true;
      } catch {
        // Fallback to clipboard or WhatsApp
      }
    }

    // Try WhatsApp direct link
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
    return true;
  }
}

