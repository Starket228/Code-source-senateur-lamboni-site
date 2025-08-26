export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      about_achievements: {
        Row: {
          color: string
          created_at: string
          id: string
          items: string[]
          title: string
          updated_at: string
          year: string
        }
        Insert: {
          color: string
          created_at?: string
          id?: string
          items: string[]
          title: string
          updated_at?: string
          year: string
        }
        Update: {
          color?: string
          created_at?: string
          id?: string
          items?: string[]
          title?: string
          updated_at?: string
          year?: string
        }
        Relationships: []
      }
      about_page: {
        Row: {
          achievements_subtitle: string
          achievements_title: string
          biography_content: string
          biography_image: string
          biography_title: string
          created_at: string
          cta_subtitle: string
          cta_title: string
          election_date: string
          election_description: string
          id: string
          subtitle: string
          title: string
          updated_at: string
          values_subtitle: string
          values_title: string
        }
        Insert: {
          achievements_subtitle: string
          achievements_title: string
          biography_content: string
          biography_image: string
          biography_title: string
          created_at?: string
          cta_subtitle: string
          cta_title: string
          election_date: string
          election_description: string
          id?: string
          subtitle: string
          title: string
          updated_at?: string
          values_subtitle: string
          values_title: string
        }
        Update: {
          achievements_subtitle?: string
          achievements_title?: string
          biography_content?: string
          biography_image?: string
          biography_title?: string
          created_at?: string
          cta_subtitle?: string
          cta_title?: string
          election_date?: string
          election_description?: string
          id?: string
          subtitle?: string
          title?: string
          updated_at?: string
          values_subtitle?: string
          values_title?: string
        }
        Relationships: []
      }
      about_values: {
        Row: {
          color: string
          created_at: string
          description: string
          icon: string
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          color: string
          created_at?: string
          description: string
          icon: string
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          color?: string
          created_at?: string
          description?: string
          icon?: string
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      activities: {
        Row: {
          created_at: string | null
          day: string
          description: string
          id: string
          month: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          day: string
          description: string
          id?: string
          month: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          day?: string
          description?: string
          id?: string
          month?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          is_read: boolean
          message: string
          name: string
          phone: string | null
          subject: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_read?: boolean
          message: string
          name: string
          phone?: string | null
          subject: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_read?: boolean
          message?: string
          name?: string
          phone?: string | null
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          category: string | null
          created_at: string | null
          description: string
          file_type: string | null
          icon: string | null
          id: string
          link: string
          size: number | null
          title: string
          updated_at: string | null
          url: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description: string
          file_type?: string | null
          icon?: string | null
          id?: string
          link: string
          size?: number | null
          title: string
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string
          file_type?: string | null
          icon?: string | null
          id?: string
          link?: string
          size?: number | null
          title?: string
          updated_at?: string | null
          url?: string | null
        }
        Relationships: []
      }
      event_photos: {
        Row: {
          created_at: string
          date: string
          description: string | null
          event_id: string | null
          id: string
          image_url: string
          photographer: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date: string
          description?: string | null
          event_id?: string | null
          id?: string
          image_url: string
          photographer?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          description?: string | null
          event_id?: string | null
          id?: string
          image_url?: string
          photographer?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_photos_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "upcoming_events"
            referencedColumns: ["id"]
          },
        ]
      }
      hero_section: {
        Row: {
          background_image: string
          button_text: string
          created_at: string | null
          description: string
          id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          background_image: string
          button_text: string
          created_at?: string | null
          description: string
          id?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          background_image?: string
          button_text?: string
          created_at?: string | null
          description?: string
          id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      media: {
        Row: {
          category: string
          created_at: string
          date: string
          duration: string | null
          id: string
          media_type: string
          src: string | null
          thumbnail: string
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          date?: string
          duration?: string | null
          id?: string
          media_type: string
          src?: string | null
          thumbnail: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          date?: string
          duration?: string | null
          id?: string
          media_type?: string
          src?: string | null
          thumbnail?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      news: {
        Row: {
          content: string | null
          created_at: string | null
          date: string | null
          description: string
          id: string
          image: string
          link: string | null
          tag: string
          title: string
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          date?: string | null
          description: string
          id?: string
          image: string
          link?: string | null
          tag: string
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          date?: string | null
          description?: string
          id?: string
          image?: string
          link?: string | null
          tag?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      programs: {
        Row: {
          created_at: string | null
          description: string
          id: string
          image: string
          link: string | null
          tag: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          image: string
          link?: string | null
          tag: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          image?: string
          link?: string | null
          tag?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          activities_subtitle: string
          activities_title: string
          created_at: string | null
          documents_subtitle: string
          documents_title: string
          id: string
          logo_text: string
          news_subtitle: string
          news_title: string
          programs_subtitle: string
          programs_title: string
          site_name: string
          sub_title: string
          updated_at: string | null
        }
        Insert: {
          activities_subtitle: string
          activities_title: string
          created_at?: string | null
          documents_subtitle: string
          documents_title: string
          id?: string
          logo_text: string
          news_subtitle: string
          news_title: string
          programs_subtitle: string
          programs_title: string
          site_name: string
          sub_title: string
          updated_at?: string | null
        }
        Update: {
          activities_subtitle?: string
          activities_title?: string
          created_at?: string | null
          documents_subtitle?: string
          documents_title?: string
          id?: string
          logo_text?: string
          news_subtitle?: string
          news_title?: string
          programs_subtitle?: string
          programs_title?: string
          site_name?: string
          sub_title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      upcoming_events: {
        Row: {
          category: string
          created_at: string
          date: string
          description: string
          id: string
          image: string | null
          location: string
          time: string
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          date: string
          description: string
          id?: string
          image?: string | null
          location: string
          time: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          date?: string
          description?: string
          id?: string
          image?: string | null
          location?: string
          time?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      migrate_past_events: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
