
export interface Song {
  id: string;
  title: string;
  artist: string;
  albumArt?: string;
  keywords: string[];
  mp3Url?: string;
}

export interface OutfitSuggestion {
  catAccessory: string;
  catAccessoryName: string;
  humanKeywords: string[];
  description: string;
}
