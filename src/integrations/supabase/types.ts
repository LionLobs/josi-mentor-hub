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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      availability_rules: {
        Row: {
          active: boolean
          created_at: string
          end_time: string
          id: string
          slot_min: number
          start_time: string
          weekday: number
        }
        Insert: {
          active?: boolean
          created_at?: string
          end_time: string
          id?: string
          slot_min?: number
          start_time: string
          weekday: number
        }
        Update: {
          active?: boolean
          created_at?: string
          end_time?: string
          id?: string
          slot_min?: number
          start_time?: string
          weekday?: number
        }
        Relationships: []
      }
      bookings: {
        Row: {
          created_at: string
          duration_min: number
          email: string
          full_name: string
          google_event_id: string | null
          id: string
          notes: string | null
          phone: string | null
          service_id: string | null
          starts_at: string
          status: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          duration_min?: number
          email: string
          full_name: string
          google_event_id?: string | null
          id?: string
          notes?: string | null
          phone?: string | null
          service_id?: string | null
          starts_at: string
          status?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          duration_min?: number
          email?: string
          full_name?: string
          google_event_id?: string | null
          id?: string
          notes?: string | null
          phone?: string | null
          service_id?: string | null
          starts_at?: string
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      course_modules: {
        Row: {
          content_type: string
          course_id: string
          cover_url: string | null
          created_at: string
          description: string | null
          duration_min: number | null
          id: string
          position: number
          storage_path: string | null
          title: string
          video_url: string | null
        }
        Insert: {
          content_type?: string
          course_id: string
          cover_url?: string | null
          created_at?: string
          description?: string | null
          duration_min?: number | null
          id?: string
          position?: number
          storage_path?: string | null
          title: string
          video_url?: string | null
        }
        Update: {
          content_type?: string
          course_id?: string
          cover_url?: string | null
          created_at?: string
          description?: string | null
          duration_min?: number | null
          id?: string
          position?: number
          storage_path?: string | null
          title?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          cover_url: string | null
          created_at: string
          description: string | null
          external_id: string | null
          id: string
          price_cents: number
          published: boolean
          title: string
        }
        Insert: {
          cover_url?: string | null
          created_at?: string
          description?: string | null
          external_id?: string | null
          id?: string
          price_cents?: number
          published?: boolean
          title: string
        }
        Update: {
          cover_url?: string | null
          created_at?: string
          description?: string | null
          external_id?: string | null
          id?: string
          price_cents?: number
          published?: boolean
          title?: string
        }
        Relationships: []
      }
      downloads: {
        Row: {
          course_id: string | null
          created_at: string
          description: string | null
          file_url: string | null
          id: string
          published: boolean
          storage_path: string | null
          title: string
        }
        Insert: {
          course_id?: string | null
          created_at?: string
          description?: string | null
          file_url?: string | null
          id?: string
          published?: boolean
          storage_path?: string | null
          title: string
        }
        Update: {
          course_id?: string | null
          created_at?: string
          description?: string | null
          file_url?: string | null
          id?: string
          published?: boolean
          storage_path?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "downloads_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      enrollments: {
        Row: {
          created_at: string
          id: string
          mentorship_id: string
          start_date: string
          status: string
          student_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          mentorship_id: string
          start_date?: string
          status?: string
          student_id: string
        }
        Update: {
          created_at?: string
          id?: string
          mentorship_id?: string
          start_date?: string
          status?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_mentorship_id_fkey"
            columns: ["mentorship_id"]
            isOneToOne: false
            referencedRelation: "mentorships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      kiwify_events: {
        Row: {
          amount_cents: number
          created_at: string
          customer_email: string | null
          event_type: string | null
          id: string
          message: string | null
          order_id: string | null
          order_status: string | null
          payload: Json | null
          processed: boolean
          product_external_id: string | null
        }
        Insert: {
          amount_cents?: number
          created_at?: string
          customer_email?: string | null
          event_type?: string | null
          id?: string
          message?: string | null
          order_id?: string | null
          order_status?: string | null
          payload?: Json | null
          processed?: boolean
          product_external_id?: string | null
        }
        Update: {
          amount_cents?: number
          created_at?: string
          customer_email?: string | null
          event_type?: string | null
          id?: string
          message?: string | null
          order_id?: string | null
          order_status?: string | null
          payload?: Json | null
          processed?: boolean
          product_external_id?: string | null
        }
        Relationships: []
      }
      lesson_progress: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          module_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          module_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          module_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      mentorships: {
        Row: {
          created_at: string
          description: string | null
          duration_weeks: number
          external_id: string | null
          id: string
          price_cents: number
          status: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_weeks?: number
          external_id?: string | null
          id?: string
          price_cents?: number
          status?: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_weeks?: number
          external_id?: string | null
          id?: string
          price_cents?: number
          status?: string
          title?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount_cents: number
          created_at: string
          description: string | null
          due_date: string | null
          enrollment_id: string | null
          id: string
          method: string | null
          paid_at: string | null
          status: string
          student_id: string | null
        }
        Insert: {
          amount_cents?: number
          created_at?: string
          description?: string | null
          due_date?: string | null
          enrollment_id?: string | null
          id?: string
          method?: string | null
          paid_at?: string | null
          status?: string
          student_id?: string | null
        }
        Update: {
          amount_cents?: number
          created_at?: string
          description?: string | null
          due_date?: string | null
          enrollment_id?: string | null
          id?: string
          method?: string | null
          paid_at?: string | null
          status?: string
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
        }
        Relationships: []
      }
      registration_requests: {
        Row: {
          created_at: string | null
          email: string
          full_name: string
          id: string
          status: string
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          status?: string
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          status?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          discount_note: string | null
          duration_min: number
          id: string
          name: string
          package_label: string | null
          package_price_cents: number | null
          price_cents: number
          sort_order: number
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          discount_note?: string | null
          duration_min?: number
          id?: string
          name: string
          package_label?: string | null
          package_price_cents?: number | null
          price_cents?: number
          sort_order?: number
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          discount_note?: string | null
          duration_min?: number
          id?: string
          name?: string
          package_label?: string | null
          package_price_cents?: number | null
          price_cents?: number
          sort_order?: number
        }
        Relationships: []
      }
      sessions: {
        Row: {
          created_at: string
          duration_min: number
          id: string
          meeting_url: string | null
          mentorship_id: string | null
          notes: string | null
          scheduled_at: string
          status: string
          student_id: string | null
          title: string
        }
        Insert: {
          created_at?: string
          duration_min?: number
          id?: string
          meeting_url?: string | null
          mentorship_id?: string | null
          notes?: string | null
          scheduled_at: string
          status?: string
          student_id?: string | null
          title: string
        }
        Update: {
          created_at?: string
          duration_min?: number
          id?: string
          meeting_url?: string | null
          mentorship_id?: string | null
          notes?: string | null
          scheduled_at?: string
          status?: string
          student_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_mentorship_id_fkey"
            columns: ["mentorship_id"]
            isOneToOne: false
            referencedRelation: "mentorships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          created_at: string
          email: string | null
          full_name: string
          id: string
          notes: string | null
          phone: string | null
          profile_id: string | null
          status: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          notes?: string | null
          phone?: string | null
          profile_id?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          notes?: string | null
          phone?: string | null
          profile_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "students_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      available_slots: {
        Args: { _day: string; _duration_min?: number }
        Returns: {
          slot: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "aluno"
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
    Enums: {
      app_role: ["admin", "aluno"],
    },
  },
} as const
