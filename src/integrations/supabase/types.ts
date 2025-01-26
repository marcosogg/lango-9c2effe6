export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      chat_messages: {
        Row: {
          audio_url: string | null
          content: string
          created_at: string
          id: string
          is_user: boolean
          thread_id: string
        }
        Insert: {
          audio_url?: string | null
          content: string
          created_at?: string
          id?: string
          is_user?: boolean
          thread_id: string
        }
        Update: {
          audio_url?: string | null
          content?: string
          created_at?: string
          id?: string
          is_user?: boolean
          thread_id?: string
        }
        Relationships: {
          foreignKeyName: "chat_messages_thread_id_fkey"
          columns: ["thread_id"]
          isOneToOne: false
          referencedRelation: "chat_threads"
          referencedColumns: ["id"]
        }[]
      }
      chat_threads: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      questions: {
        Row: {
          correct_answer: string
          created_at: string
          id: string
          question: string
          quiz_id: string
          wrong_answer_1: string
          wrong_answer_2: string
          wrong_answer_3: string
        }
        Insert: {
          correct_answer: string
          created_at?: string
          id?: string
          question: string
          quiz_id: string
          wrong_answer_1: string
          wrong_answer_2: string
          wrong_answer_3: string
        }
        Update: {
          correct_answer?: string
          created_at?: string
          id?: string
          question?: string
          quiz_id?: string
          wrong_answer_1?: string
          wrong_answer_2?: string
          wrong_answer_3?: string
        }
        Relationships: {
          foreignKeyName: "questions_quiz_id_fkey"
          columns: ["quiz_id"]
          isOneToOne: false
          referencedRelation: "quizzes"
          referencedColumns: ["id"]
        }[]
      }
      quizzes: {
        Row: {
          banner_url: string | null
          created_at: string
          id: string
          title: string
          topic: string
          updated_at: string
          user_id: string
        }
        Insert: {
          banner_url?: string | null
          created_at?: string
          id?: string
          title: string
          topic: string
          updated_at?: string
          user_id: string
        }
        Update: {
          banner_url?: string | null
          created_at?: string
          id?: string
          title?: string
          topic?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]
export type TableRow<T extends keyof Database['public']['Tables']> = Tables<T>['Row']
export type TableInsert<T extends keyof Database['public']['Tables']> = Tables<T>['Insert']
export type TableUpdate<T extends keyof Database['public']['Tables']> = Tables<T>['Update']