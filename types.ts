
export enum Role {
  USER = 'user',
  MODEL = 'model'
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface ChatMessage {
  role: Role;
  text: string;
  timestamp: Date;
  groundingSources?: GroundingChunk[];
}

export interface PresetIssue {
  id: string;
  label: string;
  description: string;
  icon: string;
}
