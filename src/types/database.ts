export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      boards: {
        Row: Board
        Insert: Omit<Board, "id" | "created_at" | "updated_at">
        Update: Partial<Omit<Board, "id">>
      }
      columns: {
        Row: Column
        Insert: Omit<Column, "id" | "created_at">
        Update: Partial<Omit<Column, "id">>
      }
      cards: {
        Row: Card
        Insert: Omit<Card, "id" | "created_at" | "updated_at">
        Update: Partial<Omit<Card, "id">>
      }
      tags: {
        Row: Tag
        Insert: Omit<Tag, "id">
        Update: Partial<Omit<Tag, "id">>
      }
      card_tags: {
        Row: CardTag
        Insert: CardTag
        Update: CardTag
      }
      card_assignees: {
        Row: CardAssignee
        Insert: CardAssignee
        Update: CardAssignee
      }
      board_members: {
        Row: BoardMember
        Insert: BoardMember
        Update: Partial<Omit<BoardMember, "board_id" | "user_id">>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

export interface Board {
  id: string
  title: string
  description: string | null
  created_by: string
  created_at: string
  updated_at: string
}

export interface Column {
  id: string
  board_id: string
  title: string
  position: number
  created_at: string
}

export interface Card {
  id: string
  column_id: string
  title: string
  description: string | null
  position: number
  due_date: string | null
  created_by: string
  created_at: string
  updated_at: string
}

export interface Tag {
  id: string
  board_id: string
  name: string
  color: string
}

export interface CardTag {
  card_id: string
  tag_id: string
}

export interface CardAssignee {
  card_id: string
  user_id: string
}

export interface BoardMember {
  board_id: string
  user_id: string
  role: "owner" | "editor" | "viewer"
}
