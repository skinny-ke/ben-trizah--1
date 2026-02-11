export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      letters: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_locked: boolean | null
          title: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_locked?: boolean | null
          title: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_locked?: boolean | null
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      memories: {
        Row: {
          caption: string | null
          created_at: string | null
          id: string
          image_url: string
          user_id: string | null
        }
        Insert: {
          caption?: string | null
          created_at?: string | null
          id?: string
          image_url: string
          user_id?: string | null
        }
        Update: {
          caption?: string | null
          created_at?: string | null
          id?: string
          image_url?: string
          user_id?: string | null
        }
        Relationships: []
      }
      milestones: {
        Row: {
          created_at: string | null
          date: string
          description: string | null
          id: string
          title: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          description?: string | null
          id?: string
          title: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          description?: string | null
          id?: string
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      notes: {
        Row: {
          content: string
          created_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      playlist: {
        Row: {
          created_at: string | null
          id: string
          link: string | null
          song_title: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          link?: string | null
          song_title: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          link?: string | null
          song_title?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}