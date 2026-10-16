// Auto-generated from Supabase project zyuteumppyrazhswtext.
// Do not manually edit; regenerate from the Supabase schema after DB changes.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      facilities: {
        Row: {
          description_en: string
          description_ur: string
          icon_url: string
          id: string
          is_published: boolean
          sort_order: number
          title_en: string
          title_ur: string
        }
        Insert: {
          description_en?: string
          description_ur?: string
          icon_url?: string
          id?: string
          is_published?: boolean
          sort_order?: number
          title_en: string
          title_ur?: string
        }
        Update: {
          description_en?: string
          description_ur?: string
          icon_url?: string
          id?: string
          is_published?: boolean
          sort_order?: number
          title_en?: string
          title_ur?: string
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer_en: string
          answer_ur: string
          id: string
          is_published: boolean
          question_en: string
          question_ur: string
          sort_order: number
        }
        Insert: {
          answer_en: string
          answer_ur?: string
          id?: string
          is_published?: boolean
          question_en: string
          question_ur?: string
          sort_order?: number
        }
        Update: {
          answer_en?: string
          answer_ur?: string
          id?: string
          is_published?: boolean
          question_en?: string
          question_ur?: string
          sort_order?: number
        }
        Relationships: []
      }
      gallery_items: {
        Row: {
          caption_en: string
          caption_ur: string
          category: string
          id: string
          image_url: string
          is_published: boolean
          sort_order: number
        }
        Insert: {
          caption_en?: string
          caption_ur?: string
          category: string
          id?: string
          image_url: string
          is_published?: boolean
          sort_order?: number
        }
        Update: {
          caption_en?: string
          caption_ur?: string
          category?: string
          id?: string
          image_url?: string
          is_published?: boolean
          sort_order?: number
        }
        Relationships: []
      }
      hostel_info: {
        Row: {
          about_en: string
          about_ur: string
          address_en: string
          address_ur: string
          email: string
          hostel_type: string
          id: number
          latitude: number | null
          logo_url: string
          longitude: number | null
          map_embed_url: string
          name_en: string
          name_ur: string
          office_hours_en: string
          office_hours_ur: string
          phone: string
          social_links: Json
          tagline_en: string
          tagline_ur: string
          updated_at: string
          whatsapp: string
        }
        Insert: {
          about_en?: string
          about_ur?: string
          address_en?: string
          address_ur?: string
          email?: string
          hostel_type?: string
          id?: number
          latitude?: number | null
          logo_url?: string
          longitude?: number | null
          map_embed_url?: string
          name_en: string
          name_ur?: string
          office_hours_en?: string
          office_hours_ur?: string
          phone?: string
          social_links?: Json
          tagline_en?: string
          tagline_ur?: string
          updated_at?: string
          whatsapp?: string
        }
        Update: {
          about_en?: string
          about_ur?: string
          address_en?: string
          address_ur?: string
          email?: string
          hostel_type?: string
          id?: number
          latitude?: number | null
          logo_url?: string
          longitude?: number | null
          map_embed_url?: string
          name_en?: string
          name_ur?: string
          office_hours_en?: string
          office_hours_ur?: string
          phone?: string
          social_links?: Json
          tagline_en?: string
          tagline_ur?: string
          updated_at?: string
          whatsapp?: string
        }
        Relationships: []
      }
      inquiries: {
        Row: {
          admin_notes: string | null
          category: string
          created_at: string
          id: string
          message: string | null
          move_in_date: string | null
          name: string
          phone: string
          room_type: string | null
          source_lang: string
          status: string
          wants_mess: boolean | null
        }
        Insert: {
          admin_notes?: string | null
          category: string
          created_at?: string
          id?: string
          message?: string | null
          move_in_date?: string | null
          name: string
          phone: string
          room_type?: string | null
          source_lang?: string
          status?: string
          wants_mess?: boolean | null
        }
        Update: {
          admin_notes?: string | null
          category?: string
          created_at?: string
          id?: string
          message?: string | null
          move_in_date?: string | null
          name?: string
          phone?: string
          room_type?: string | null
          source_lang?: string
          status?: string
          wants_mess?: boolean | null
        }
        Relationships: []
      }
      mess_menu: {
        Row: {
          breakfast_en: string
          breakfast_ur: string
          day_of_week: number
          dinner_en: string
          dinner_ur: string
          id: string
          lunch_en: string
          lunch_ur: string
        }
        Insert: {
          breakfast_en?: string
          breakfast_ur?: string
          day_of_week: number
          dinner_en?: string
          dinner_ur?: string
          id?: string
          lunch_en?: string
          lunch_ur?: string
        }
        Update: {
          breakfast_en?: string
          breakfast_ur?: string
          day_of_week?: number
          dinner_en?: string
          dinner_ur?: string
          id?: string
          lunch_en?: string
          lunch_ur?: string
        }
        Relationships: []
      }
      mess_plans: {
        Row: {
          description_en: string
          description_ur: string
          id: string
          is_active: boolean
          name_en: string
          name_ur: string
          price_monthly: number
          sort_order: number
        }
        Insert: {
          description_en?: string
          description_ur?: string
          id?: string
          is_active?: boolean
          name_en: string
          name_ur?: string
          price_monthly: number
          sort_order?: number
        }
        Update: {
          description_en?: string
          description_ur?: string
          id?: string
          is_active?: boolean
          name_en?: string
          name_ur?: string
          price_monthly?: number
          sort_order?: number
        }
        Relationships: []
      }
      notices: {
        Row: {
          ends_at: string
          id: string
          is_active: boolean
          starts_at: string
          text_en: string
          text_ur: string
        }
        Insert: {
          ends_at: string
          id?: string
          is_active?: boolean
          starts_at?: string
          text_en: string
          text_ur?: string
        }
        Update: {
          ends_at?: string
          id?: string
          is_active?: boolean
          starts_at?: string
          text_en?: string
          text_ur?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          role: string
        }
        Insert: {
          created_at?: string
          id: string
          role?: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment_en: string
          comment_ur: string
          created_at: string
          id: string
          is_visible: boolean
          name: string
          rating: number
        }
        Insert: {
          comment_en?: string
          comment_ur?: string
          created_at?: string
          id?: string
          is_visible?: boolean
          name: string
          rating: number
        }
        Update: {
          comment_en?: string
          comment_ur?: string
          created_at?: string
          id?: string
          is_visible?: boolean
          name?: string
          rating?: number
        }
        Relationships: []
      }
      rooms: {
        Row: {
          admission_fee: number
          beds_available: number
          beds_total: number
          created_at: string
          description_en: string
          description_ur: string
          features: Json
          id: string
          image_urls: string[]
          is_published: boolean
          monthly_fee: number
          name_en: string
          name_ur: string
          room_type: string
          security_deposit: number
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          admission_fee?: number
          beds_available?: number
          beds_total: number
          created_at?: string
          description_en?: string
          description_ur?: string
          features?: Json
          id?: string
          image_urls?: string[]
          is_published?: boolean
          monthly_fee: number
          name_en: string
          name_ur?: string
          room_type: string
          security_deposit?: number
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          admission_fee?: number
          beds_available?: number
          beds_total?: number
          created_at?: string
          description_en?: string
          description_ur?: string
          features?: Json
          id?: string
          image_urls?: string[]
          is_published?: boolean
          monthly_fee?: number
          name_en?: string
          name_ur?: string
          room_type?: string
          security_deposit?: number
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      rules: {
        Row: {
          id: string
          is_published: boolean
          sort_order: number
          text_en: string
          text_ur: string
        }
        Insert: {
          id?: string
          is_published?: boolean
          sort_order?: number
          text_en: string
          text_ur?: string
        }
        Update: {
          id?: string
          is_published?: boolean
          sort_order?: number
          text_en?: string
          text_ur?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          default_language: string
          id: number
          seo_description_en: string
          seo_description_ur: string
          seo_title_en: string
          seo_title_ur: string
          updated_at: string
          whatsapp_message_template_en: string
          whatsapp_message_template_ur: string
        }
        Insert: {
          default_language?: string
          id?: number
          seo_description_en?: string
          seo_description_ur?: string
          seo_title_en?: string
          seo_title_ur?: string
          updated_at?: string
          whatsapp_message_template_en?: string
          whatsapp_message_template_ur?: string
        }
        Update: {
          default_language?: string
          id?: number
          seo_description_en?: string
          seo_description_ur?: string
          seo_title_en?: string
          seo_title_ur?: string
          updated_at?: string
          whatsapp_message_template_en?: string
          whatsapp_message_template_ur?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
