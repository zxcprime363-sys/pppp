//STORE TYPES

export interface TrackQueue {
  id?: string;
  track_id: string;
  album_id: string;
  artist_id: string;
  title: string;
  artist: string;
  duration: number;
  cover_id: string;
  quality: string;
  explicit: boolean;
}

//CUSTOM LIST TYPES /PUBLIC
export interface Albums {
  id: string;
  name: string;
  cover: string;
}
export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  explicit: boolean;
  coverArt: string;
  album: Albums;
}

export interface Artist {
  name: string;
  id: string;
  images: ArtistImage[];
  colorDark: string;
}

export interface ArtistImage {
  url: string;
  height: number;
  width: number;
}

export type AlbumType = "ALBUM" | "SINGLE" | "EP";

export interface Albums {
  name: string;
  artist: string;
  type: AlbumType;
  id: string;
  artistUri: string;
  coverArt: string;
  colorDark: string;
  playable: boolean;
}
// TRACKS FULL TYPES
export interface TrackApi {
  id: number;
  title: string;
  duration: number;
  replayGain: number;
  peak: number;
  allowStreaming: boolean;
  streamReady: boolean;
  payToStream: boolean;
  adSupportedStreamReady: boolean;
  djReady: boolean;
  stemReady: boolean;
  streamStartDate: string;
  premiumStreamingOnly: boolean;
  trackNumber: number;
  volumeNumber: number;
  version: string | null;
  popularity: number;
  copyright: string;
  bpm: number | null;
  key: string | null;
  keyScale: "MAJOR" | "MINOR" | null;
  url: string;
  isrc: string;
  editable: boolean;
  explicit: boolean;
  audioQuality: string;
  audioModes: string[];
  mediaMetadata: { tags: string[] };
  upload: boolean;
  accessType: string | null;
  spotlighted: boolean;
  artist: ArtistTracks;
  artists: ArtistTracks[];
  album: AlbumTracks;
  mixes: Record<string, string>;
}
//ARTIST INSIDE TRACKS
interface ArtistTracks {
  id: number;
  name: string;
  handle: string | null;
  type: "MAIN" | "FEATURED";
  picture: string | null;
}
//ALBUM INSIDE TRACKS
interface AlbumTracks {
  id: number;
  title: string;
  cover: string;
  vibrantColor: string | null;
  videoCover: string | null;
}

//ARTIST TYPES FROM ARTIST ENDPOINT
export interface ArtistEndpointTypes {
  id: number;
  name: string;
  artistTypes: "ARTIST" | "CONTRIBUTOR";
  picture: string | null;
  selectedAlbumCoverFallback: string | null;
  popularity: number;
}

//ALBUM TYPES FROM ALBUM ENDPOINT SIMILAR TO TRACKAPI
export interface AlbumEndpointTypes {
  id: number;
  title: string;
  duration: number;
  streamReady: boolean;
  payToStream: boolean;
  adSupportedStreamReady: boolean;
  djReady: boolean;
  stemReady: boolean;
  streamStartDate: string;
  allowStreaming: boolean;
  premiumStreamingOnly: boolean;
  numberOfTracks: number;
  numberOfVideos: number;
  numberOfVolumes: number;
  releaseDate: string;
  copyright: string;
  type: "ALBUM" | "EP" | "SINGLE";
  version: string | null;
  url: string;
  cover: string;
  vibrantColor: string;
  videoCover: string | null;
  explicit: boolean;
  upc: string;
  popularity: number;
  audioQuality: string;
  audioModes: string[];
  mediaMetadata: {
    tags: string[];
  };
  upload: boolean;
  artists: ArtistTracks[];
  artist: ArtistTracks;
  items: AlbumTrackItem[];
}
export interface AlbumTrackItem {
  item: TrackApi;
  type: "track";
}
