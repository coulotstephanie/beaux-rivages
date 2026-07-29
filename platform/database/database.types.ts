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
      app_user_roles: {
        Row: {
          created_at: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          actor_role: Database["public"]["Enums"]["app_role"] | null
          after_data: Json | null
          before_data: Json | null
          entity_id: string | null
          entity_type: string
          id: number
          ip_hash: string | null
          metadata: Json
          occurred_at: string
          request_id: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          actor_role?: Database["public"]["Enums"]["app_role"] | null
          after_data?: Json | null
          before_data?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: never
          ip_hash?: string | null
          metadata?: Json
          occurred_at?: string
          request_id?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          actor_role?: Database["public"]["Enums"]["app_role"] | null
          after_data?: Json | null
          before_data?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: never
          ip_hash?: string | null
          metadata?: Json
          occurred_at?: string
          request_id?: string | null
        }
        Relationships: []
      }
      availability: {
        Row: {
          calendar_event_id: string | null
          day: string
          id: string
          property_id: string
          reservation_id: string | null
          source: Database["public"]["Enums"]["occupancy_source"] | null
          status: string
          updated_at: string
        }
        Insert: {
          calendar_event_id?: string | null
          day: string
          id?: string
          property_id: string
          reservation_id?: string | null
          source?: Database["public"]["Enums"]["occupancy_source"] | null
          status: string
          updated_at?: string
        }
        Update: {
          calendar_event_id?: string | null
          day?: string
          id?: string
          property_id?: string
          reservation_id?: string | null
          source?: Database["public"]["Enums"]["occupancy_source"] | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "availability_calendar_event_id_fkey"
            columns: ["calendar_event_id"]
            isOneToOne: false
            referencedRelation: "calendar_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "availability_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "availability_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
        ]
      }
      back_office_notifications: {
        Row: {
          body: string | null
          created_at: string
          dismissed_at: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          kind: string
          priority: string
          read_at: string | null
          title: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          dismissed_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          kind: string
          priority?: string
          read_at?: string | null
          title: string
        }
        Update: {
          body?: string | null
          created_at?: string
          dismissed_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          kind?: string
          priority?: string
          read_at?: string | null
          title?: string
        }
        Relationships: []
      }
      calendar_events: {
        Row: {
          arrival: string
          departure: string
          external_uid: string
          id: string
          imported_at: string
          payload_hash: string | null
          property_id: string
          source_id: string
          status: string
          summary: string | null
          updated_at: string
        }
        Insert: {
          arrival: string
          departure: string
          external_uid: string
          id?: string
          imported_at?: string
          payload_hash?: string | null
          property_id: string
          source_id: string
          status?: string
          summary?: string | null
          updated_at?: string
        }
        Update: {
          arrival?: string
          departure?: string
          external_uid?: string
          id?: string
          imported_at?: string
          payload_hash?: string | null
          property_id?: string
          source_id?: string
          status?: string
          summary?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_events_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "calendar_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_sources: {
        Row: {
          created_at: string
          enabled: boolean
          ical_url_ciphertext: string | null
          id: string
          last_synced_at: string | null
          name: string
          property_id: string
          provider: Database["public"]["Enums"]["occupancy_source"]
          secret_env_name: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          enabled?: boolean
          ical_url_ciphertext?: string | null
          id?: string
          last_synced_at?: string | null
          name: string
          property_id: string
          provider: Database["public"]["Enums"]["occupancy_source"]
          secret_env_name: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          enabled?: boolean
          ical_url_ciphertext?: string | null
          id?: string
          last_synced_at?: string | null
          name?: string
          property_id?: string
          provider?: Database["public"]["Enums"]["occupancy_source"]
          secret_env_name?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_sources_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      carnet_entries: {
        Row: {
          address: string | null
          body: string
          category: string
          created_at: string
          created_by: string | null
          destination: string
          featured: boolean
          gallery_paths: string[]
          google_maps_url: string | null
          highlights: string[]
          host_tip: string | null
          id: string
          image_alt: string | null
          image_path: string | null
          latitude: number | null
          longitude: number | null
          meta_description: string | null
          meta_title: string | null
          official_url: string | null
          open_graph_image_path: string | null
          opening_hours: Json
          opening_period: string | null
          phone: string | null
          published_at: string | null
          recommendation_level: number
          seasonal_rules: Json
          slug: string
          sort_order: number
          status: string
          summary: string
          tags: string[]
          title: string
          updated_at: string
          updated_by: string | null
          version: number
          video_url: string | null
        }
        Insert: {
          address?: string | null
          body?: string
          category: string
          created_at?: string
          created_by?: string | null
          destination: string
          featured?: boolean
          gallery_paths?: string[]
          google_maps_url?: string | null
          highlights?: string[]
          host_tip?: string | null
          id?: string
          image_alt?: string | null
          image_path?: string | null
          latitude?: number | null
          longitude?: number | null
          meta_description?: string | null
          meta_title?: string | null
          official_url?: string | null
          open_graph_image_path?: string | null
          opening_hours?: Json
          opening_period?: string | null
          phone?: string | null
          published_at?: string | null
          recommendation_level?: number
          seasonal_rules?: Json
          slug: string
          sort_order?: number
          status?: string
          summary: string
          tags?: string[]
          title: string
          updated_at?: string
          updated_by?: string | null
          version?: number
          video_url?: string | null
        }
        Update: {
          address?: string | null
          body?: string
          category?: string
          destination?: string
          featured?: boolean
          gallery_paths?: string[]
          google_maps_url?: string | null
          highlights?: string[]
          host_tip?: string | null
          image_alt?: string | null
          image_path?: string | null
          latitude?: number | null
          longitude?: number | null
          meta_description?: string | null
          meta_title?: string | null
          official_url?: string | null
          open_graph_image_path?: string | null
          opening_hours?: Json
          opening_period?: string | null
          phone?: string | null
          published_at?: string | null
          recommendation_level?: number
          seasonal_rules?: Json
          slug?: string
          sort_order?: number
          status?: string
          summary?: string
          tags?: string[]
          title?: string
          updated_at?: string
          updated_by?: string | null
          version?: number
          video_url?: string | null
        }
        Relationships: []
      }
      carnet_entry_versions: {
        Row: {
          created_at: string
          created_by: string | null
          entry_id: string
          id: string
          snapshot: Json
          version: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          entry_id: string
          id?: string
          snapshot: Json
          version: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          entry_id?: string
          id?: string
          snapshot?: Json
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "carnet_entry_versions_entry_id_fkey"
            columns: ["entry_id"]
            isOneToOne: false
            referencedRelation: "carnet_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      carnet_favorites: {
        Row: { created_at: string; entry_id: string; guest_id: string }
        Insert: { created_at?: string; entry_id: string; guest_id: string }
        Update: { created_at?: string; entry_id?: string; guest_id?: string }
        Relationships: [
          {
            foreignKeyName: "carnet_favorites_entry_id_fkey"
            columns: ["entry_id"]
            isOneToOne: false
            referencedRelation: "carnet_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "carnet_favorites_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "guests"
            referencedColumns: ["id"]
          },
        ]
      }
      channel_audit_logs: {
        Row: {
          action: string
          actor: string
          after_data: Json | null
          before_data: Json | null
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          job_id: string | null
          provider: string | null
          reversible: boolean
        }
        Insert: {
          action: string
          actor?: string
          after_data?: Json | null
          before_data?: Json | null
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          job_id?: string | null
          provider?: string | null
          reversible?: boolean
        }
        Update: {
          action?: string
          actor?: string
          after_data?: Json | null
          before_data?: Json | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          job_id?: string | null
          provider?: string | null
          reversible?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "channel_audit_logs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "channel_sync_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      channel_conflicts: {
        Row: {
          conflict_type: string
          created_at: string
          details: Json
          external_reference: string | null
          id: string
          property_id: string
          proposed_resolution: string | null
          provider: string
          reservation_id: string | null
          resolution: string | null
          resolved_at: string | null
          severity: string
          status: string
          stay_range: unknown
          updated_at: string
        }
        Insert: {
          conflict_type: string
          created_at?: string
          details?: Json
          external_reference?: string | null
          id?: string
          property_id: string
          proposed_resolution?: string | null
          provider: string
          reservation_id?: string | null
          resolution?: string | null
          resolved_at?: string | null
          severity?: string
          status?: string
          stay_range: unknown
          updated_at?: string
        }
        Update: {
          conflict_type?: string
          created_at?: string
          details?: Json
          external_reference?: string | null
          id?: string
          property_id?: string
          proposed_resolution?: string | null
          provider?: string
          reservation_id?: string | null
          resolution?: string | null
          resolved_at?: string | null
          severity?: string
          status?: string
          stay_range?: unknown
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "channel_conflicts_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "channel_conflicts_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
        ]
      }
      channel_connections: {
        Row: {
          capabilities: string[]
          created_at: string
          credentials_reference: string | null
          id: string
          last_checked_at: string | null
          last_error: string | null
          mode: string
          name: string
          provider: string
          status: string
          updated_at: string
        }
        Insert: {
          capabilities?: string[]
          created_at?: string
          credentials_reference?: string | null
          id?: string
          last_checked_at?: string | null
          last_error?: string | null
          mode?: string
          name: string
          provider: string
          status?: string
          updated_at?: string
        }
        Update: {
          capabilities?: string[]
          created_at?: string
          credentials_reference?: string | null
          id?: string
          last_checked_at?: string | null
          last_error?: string | null
          mode?: string
          name?: string
          provider?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      channel_listing_mappings: {
        Row: {
          connection_id: string
          created_at: string
          external_listing_id: string
          external_listing_name: string | null
          id: string
          property_id: string
          settings: Json
          status: string
          sync_availability: boolean
          sync_prices: boolean
          sync_reservations: boolean
          updated_at: string
        }
        Insert: {
          connection_id: string
          created_at?: string
          external_listing_id: string
          external_listing_name?: string | null
          id?: string
          property_id: string
          settings?: Json
          status?: string
          sync_availability?: boolean
          sync_prices?: boolean
          sync_reservations?: boolean
          updated_at?: string
        }
        Update: {
          connection_id?: string
          created_at?: string
          external_listing_id?: string
          external_listing_name?: string | null
          id?: string
          property_id?: string
          settings?: Json
          status?: string
          sync_availability?: boolean
          sync_prices?: boolean
          sync_reservations?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "channel_listing_mappings_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "channel_connections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "channel_listing_mappings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      channel_sync_jobs: {
        Row: {
          attempt: number
          connection_id: string | null
          created_at: string
          direction: string
          error_code: string | null
          error_message: string | null
          finished_at: string | null
          id: string
          idempotency_key: string
          mapping_id: string | null
          payload: Json
          resource: string
          result: Json
          rollback_of: string | null
          started_at: string | null
          status: string
        }
        Insert: {
          attempt?: number
          connection_id?: string | null
          created_at?: string
          direction: string
          error_code?: string | null
          error_message?: string | null
          finished_at?: string | null
          id?: string
          idempotency_key: string
          mapping_id?: string | null
          payload?: Json
          resource: string
          result?: Json
          rollback_of?: string | null
          started_at?: string | null
          status?: string
        }
        Update: {
          attempt?: number
          connection_id?: string | null
          created_at?: string
          direction?: string
          error_code?: string | null
          error_message?: string | null
          finished_at?: string | null
          id?: string
          idempotency_key?: string
          mapping_id?: string | null
          payload?: Json
          resource?: string
          result?: Json
          rollback_of?: string | null
          started_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "channel_sync_jobs_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "channel_connections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "channel_sync_jobs_mapping_id_fkey"
            columns: ["mapping_id"]
            isOneToOne: false
            referencedRelation: "channel_listing_mappings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "channel_sync_jobs_rollback_of_fkey"
            columns: ["rollback_of"]
            isOneToOne: false
            referencedRelation: "channel_sync_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      concierge_categories: {
        Row: {
          code: string
          created_at: string
          description_de: string | null
          description_en: string | null
          description_fr: string | null
          enabled: boolean
          id: string
          label_de: string
          label_en: string
          label_fr: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          description_de?: string | null
          description_en?: string | null
          description_fr?: string | null
          enabled?: boolean
          id?: string
          label_de: string
          label_en: string
          label_fr: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          description_de?: string | null
          description_en?: string | null
          description_fr?: string | null
          enabled?: boolean
          id?: string
          label_de?: string
          label_en?: string
          label_fr?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      concierge_experiences: {
        Row: {
          category_id: string
          code: string
          created_at: string
          description_de: string
          description_en: string
          description_fr: string
          enabled: boolean
          id: string
          image_path: string | null
          inclusions: Json
          price_cents: number
          pricing_unit: string
          requires_confirmation: boolean
          sort_order: number
          title_de: string
          title_en: string
          title_fr: string
          updated_at: string
        }
        Insert: {
          category_id: string
          code: string
          created_at?: string
          description_de: string
          description_en: string
          description_fr: string
          enabled?: boolean
          id?: string
          image_path?: string | null
          inclusions?: Json
          price_cents: number
          pricing_unit?: string
          requires_confirmation?: boolean
          sort_order?: number
          title_de: string
          title_en: string
          title_fr: string
          updated_at?: string
        }
        Update: {
          category_id?: string
          code?: string
          created_at?: string
          description_de?: string
          description_en?: string
          description_fr?: string
          enabled?: boolean
          id?: string
          image_path?: string | null
          inclusions?: Json
          price_cents?: number
          pricing_unit?: string
          requires_confirmation?: boolean
          sort_order?: number
          title_de?: string
          title_en?: string
          title_fr?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "concierge_experiences_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "concierge_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      concierge_order_items: {
        Row: {
          created_at: string
          customization: Json
          experience_id: string
          id: string
          order_id: string
          quantity: number
          scheduled_for: string | null
          status: string
          total_cents: number | null
          unit_price_cents: number
        }
        Insert: {
          created_at?: string
          customization?: Json
          experience_id: string
          id?: string
          order_id: string
          quantity?: number
          scheduled_for?: string | null
          status?: string
          total_cents?: number | null
          unit_price_cents: number
        }
        Update: {
          created_at?: string
          customization?: Json
          experience_id?: string
          id?: string
          order_id?: string
          quantity?: number
          scheduled_for?: string | null
          status?: string
          total_cents?: number | null
          unit_price_cents?: number
        }
        Relationships: [
          {
            foreignKeyName: "concierge_order_items_experience_id_fkey"
            columns: ["experience_id"]
            isOneToOne: false
            referencedRelation: "concierge_experiences"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "concierge_order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "concierge_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      concierge_orders: {
        Row: {
          created_at: string
          discount_cents: number
          guest_id: string | null
          guest_message: string | null
          id: string
          internal_notes: string | null
          locale: string
          payment_id: string | null
          promotion_code: string | null
          reservation_id: string
          status: string
          subtotal_cents: number
          total_cents: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          discount_cents?: number
          guest_id?: string | null
          guest_message?: string | null
          id?: string
          internal_notes?: string | null
          locale?: string
          payment_id?: string | null
          promotion_code?: string | null
          reservation_id: string
          status?: string
          subtotal_cents?: number
          total_cents?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          discount_cents?: number
          guest_id?: string | null
          guest_message?: string | null
          id?: string
          internal_notes?: string | null
          locale?: string
          payment_id?: string | null
          promotion_code?: string | null
          reservation_id?: string
          status?: string
          subtotal_cents?: number
          total_cents?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "concierge_orders_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "guests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "concierge_orders_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "concierge_orders_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
        ]
      }
      concierge_requests: {
        Row: {
          created_at: string
          details: string | null
          id: string
          internal_only_details: string | null
          is_surprise: boolean
          kind: string
          reservation_id: string
          scheduled_for: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          details?: string | null
          id?: string
          internal_only_details?: string | null
          is_surprise?: boolean
          kind: string
          reservation_id: string
          scheduled_for?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          details?: string | null
          id?: string
          internal_only_details?: string | null
          is_surprise?: boolean
          kind?: string
          reservation_id?: string
          scheduled_for?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "concierge_requests_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
        ]
      }
      concierge_special_requests: {
        Row: {
          allergies: string | null
          created_at: string
          details: string
          dietary_requirements: string | null
          guest_id: string | null
          id: string
          occasion: string
          reservation_id: string
          status: string
          updated_at: string
        }
        Insert: {
          allergies?: string | null
          created_at?: string
          details: string
          dietary_requirements?: string | null
          guest_id?: string | null
          id?: string
          occasion: string
          reservation_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          allergies?: string | null
          created_at?: string
          details?: string
          dietary_requirements?: string | null
          guest_id?: string | null
          id?: string
          occasion?: string
          reservation_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "concierge_special_requests_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "guests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "concierge_special_requests_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
        ]
      }
      consents: {
        Row: {
          email_hash: string | null
          guest_id: string | null
          id: string
          policy_version: string
          proof: Json
          purpose: string
          recorded_at: string
          source: string
          status: string
          withdrawn_at: string | null
        }
        Insert: {
          email_hash?: string | null
          guest_id?: string | null
          id?: string
          policy_version: string
          proof?: Json
          purpose: string
          recorded_at?: string
          source: string
          status: string
          withdrawn_at?: string | null
        }
        Update: {
          email_hash?: string | null
          guest_id?: string | null
          id?: string
          policy_version?: string
          proof?: Json
          purpose?: string
          recorded_at?: string
          source?: string
          status?: string
          withdrawn_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consents_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "guests"
            referencedColumns: ["id"]
          },
        ]
      }
      contracts: {
        Row: {
          content_hash: string | null
          created_at: string
          generated_at: string | null
          html_path: string | null
          id: string
          number: string
          pdf_path: string | null
          reservation_id: string
          signed_at: string | null
          status: Database["public"]["Enums"]["contract_status"]
          updated_at: string
          version: number
        }
        Insert: {
          content_hash?: string | null
          created_at?: string
          generated_at?: string | null
          html_path?: string | null
          id?: string
          number: string
          pdf_path?: string | null
          reservation_id: string
          signed_at?: string | null
          status?: Database["public"]["Enums"]["contract_status"]
          updated_at?: string
          version?: number
        }
        Update: {
          content_hash?: string | null
          created_at?: string
          generated_at?: string | null
          html_path?: string | null
          id?: string
          number?: string
          pdf_path?: string | null
          reservation_id?: string
          signed_at?: string | null
          status?: Database["public"]["Enums"]["contract_status"]
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "contracts_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
        ]
      }
      demand_events: {
        Row: {
          applies_to_property_ids: string[]
          created_at: string
          date_range: unknown
          id: string
          impact_percentage: number
          kind: string
          name: string
          source: string | null
          updated_at: string
        }
        Insert: {
          applies_to_property_ids?: string[]
          created_at?: string
          date_range: unknown
          id?: string
          impact_percentage?: number
          kind: string
          name: string
          source?: string | null
          updated_at?: string
        }
        Update: {
          applies_to_property_ids?: string[]
          created_at?: string
          date_range?: unknown
          id?: string
          impact_percentage?: number
          kind?: string
          name?: string
          source?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      gift_card_uses: {
        Row: {
          amount_cents: number
          gift_card_id: string
          id: string
          idempotency_key: string
          reservation_id: string | null
          used_at: string
        }
        Insert: {
          amount_cents: number
          gift_card_id: string
          id?: string
          idempotency_key: string
          reservation_id?: string | null
          used_at?: string
        }
        Update: {
          amount_cents?: number
          gift_card_id?: string
          id?: string
          idempotency_key?: string
          reservation_id?: string | null
          used_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "gift_card_uses_gift_card_id_fkey"
            columns: ["gift_card_id"]
            isOneToOne: false
            referencedRelation: "gift_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gift_card_uses_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
        ]
      }
      gift_cards: {
        Row: {
          activated_at: string | null
          balance_cents: number
          created_at: string
          currency: string
          expires_at: string
          id: string
          initial_amount_cents: number
          public_code: string
          purchaser_guest_id: string | null
          qr_token_hash: string
          recipient_email_hash: string | null
          recipient_name: string | null
          status: string
          updated_at: string
        }
        Insert: {
          activated_at?: string | null
          balance_cents: number
          created_at?: string
          currency?: string
          expires_at: string
          id?: string
          initial_amount_cents: number
          public_code: string
          purchaser_guest_id?: string | null
          qr_token_hash: string
          recipient_email_hash?: string | null
          recipient_name?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          activated_at?: string | null
          balance_cents?: number
          created_at?: string
          currency?: string
          expires_at?: string
          id?: string
          initial_amount_cents?: number
          public_code?: string
          purchaser_guest_id?: string | null
          qr_token_hash?: string
          recipient_email_hash?: string | null
          recipient_name?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "gift_cards_purchaser_guest_id_fkey"
            columns: ["purchaser_guest_id"]
            isOneToOne: false
            referencedRelation: "guests"
            referencedColumns: ["id"]
          },
        ]
      }
      guest_access_secrets: {
        Row: {
          available_from: string
          created_at: string
          key_box_code_ciphertext: string
          pedestrian_gate_code_ciphertext: string | null
          reservation_id: string
          updated_at: string
          wifi_name_ciphertext: string
          wifi_password_ciphertext: string
        }
        Insert: {
          available_from: string
          created_at?: string
          key_box_code_ciphertext: string
          pedestrian_gate_code_ciphertext?: string | null
          reservation_id: string
          updated_at?: string
          wifi_name_ciphertext: string
          wifi_password_ciphertext: string
        }
        Update: {
          available_from?: string
          created_at?: string
          key_box_code_ciphertext?: string
          pedestrian_gate_code_ciphertext?: string | null
          reservation_id?: string
          updated_at?: string
          wifi_name_ciphertext?: string
          wifi_password_ciphertext?: string
        }
        Relationships: [
          {
            foreignKeyName: "guest_access_secrets_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: true
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
        ]
      }
      guests: {
        Row: {
          acquisition_channel: string
          address_line1: string | null
          address_line2: string | null
          allergies: string | null
          arrival_preferences: string | null
          birthday: string | null
          city: string | null
          country_code: string | null
          created_at: string
          email: string
          first_name: string
          id: string
          internal_notes: string | null
          last_name: string
          locale: string
          phone: string | null
          postal_code: string | null
          preferred_experience_codes: string[]
          preferred_property_id: string | null
          sleeping_preferences: string | null
          special_requests: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          acquisition_channel?: string
          address_line1?: string | null
          address_line2?: string | null
          allergies?: string | null
          arrival_preferences?: string | null
          birthday?: string | null
          city?: string | null
          country_code?: string | null
          created_at?: string
          email: string
          first_name: string
          id?: string
          internal_notes?: string | null
          last_name: string
          locale?: string
          phone?: string | null
          postal_code?: string | null
          preferred_experience_codes?: string[]
          preferred_property_id?: string | null
          sleeping_preferences?: string | null
          special_requests?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          acquisition_channel?: string
          address_line1?: string | null
          address_line2?: string | null
          allergies?: string | null
          arrival_preferences?: string | null
          birthday?: string | null
          city?: string | null
          country_code?: string | null
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          internal_notes?: string | null
          last_name?: string
          locale?: string
          phone?: string | null
          postal_code?: string | null
          preferred_experience_codes?: string[]
          preferred_property_id?: string | null
          sleeping_preferences?: string | null
          special_requests?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "guests_preferred_property_id_fkey"
            columns: ["preferred_property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      housekeeping_inspections: {
        Row: {
          created_at: string
          id: string
          inspected_at: string | null
          inspector: string
          rating: number | null
          remarks: string | null
          status: string
          task_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          inspected_at?: string | null
          inspector: string
          rating?: number | null
          remarks?: string | null
          status?: string
          task_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          inspected_at?: string | null
          inspector?: string
          rating?: number | null
          remarks?: string | null
          status?: string
          task_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "housekeeping_inspections_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "housekeeping_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      housekeeping_tasks: {
        Row: {
          assignee: string | null
          checklist: Json
          completed_at: string | null
          created_at: string
          id: string
          notes: string | null
          offline_revision: number
          operational_status: string
          property_id: string
          reservation_id: string | null
          scheduled_for: string
          signature_path: string | null
          started_at: string | null
          status: string
          updated_at: string
          verified_at: string | null
        }
        Insert: {
          assignee?: string | null
          checklist?: Json
          completed_at?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          offline_revision?: number
          operational_status?: string
          property_id: string
          reservation_id?: string | null
          scheduled_for: string
          signature_path?: string | null
          started_at?: string | null
          status?: string
          updated_at?: string
          verified_at?: string | null
        }
        Update: {
          assignee?: string | null
          checklist?: Json
          completed_at?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          offline_revision?: number
          operational_status?: string
          property_id?: string
          reservation_id?: string | null
          scheduled_for?: string
          signature_path?: string | null
          started_at?: string | null
          status?: string
          updated_at?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "housekeeping_tasks_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "housekeeping_tasks_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_items: {
        Row: {
          category: string
          condition: string
          created_at: string
          id: string
          name: string
          notes: string | null
          property_id: string
          purchased_on: string | null
          quantity: number
          room: string
          unit_value_cents: number
          updated_at: string
          warranty_until: string | null
        }
        Insert: {
          category: string
          condition?: string
          created_at?: string
          id?: string
          name: string
          notes?: string | null
          property_id: string
          purchased_on?: string | null
          quantity?: number
          room: string
          unit_value_cents?: number
          updated_at?: string
          warranty_until?: string | null
        }
        Update: {
          category?: string
          condition?: string
          created_at?: string
          id?: string
          name?: string
          notes?: string | null
          property_id?: string
          purchased_on?: string | null
          quantity?: number
          room?: string
          unit_value_cents?: number
          updated_at?: string
          warranty_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_items_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          created_at: string
          currency: string
          due_at: string | null
          id: string
          issued_at: string | null
          kind: string
          number: string
          pdf_path: string | null
          reservation_id: string
          status: string
          total_cents: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string
          due_at?: string | null
          id?: string
          issued_at?: string | null
          kind: string
          number: string
          pdf_path?: string | null
          reservation_id: string
          status?: string
          total_cents: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string
          due_at?: string | null
          id?: string
          issued_at?: string | null
          kind?: string
          number?: string
          pdf_path?: string | null
          reservation_id?: string
          status?: string
          total_cents?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_accounts: {
        Row: {
          benefits: Json
          evaluated_at: string
          guest_id: string
          qualifying_spend_cents: number
          qualifying_stays: number
          tier: string
          updated_at: string
        }
        Insert: {
          benefits?: Json
          evaluated_at?: string
          guest_id: string
          qualifying_spend_cents?: number
          qualifying_stays?: number
          tier?: string
          updated_at?: string
        }
        Update: {
          benefits?: Json
          evaluated_at?: string
          guest_id?: string
          qualifying_spend_cents?: number
          qualifying_stays?: number
          tier?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_accounts_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: true
            referencedRelation: "guests"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_incidents: {
        Row: {
          assignee: string | null
          cost_cents: number
          created_at: string
          description: string | null
          due_at: string | null
          id: string
          photo_paths: string[]
          priority: string
          property_id: string
          reservation_id: string | null
          resolved_at: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          assignee?: string | null
          cost_cents?: number
          created_at?: string
          description?: string | null
          due_at?: string | null
          id?: string
          photo_paths?: string[]
          priority?: string
          property_id: string
          reservation_id?: string | null
          resolved_at?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          assignee?: string | null
          cost_cents?: number
          created_at?: string
          description?: string | null
          due_at?: string | null
          id?: string
          photo_paths?: string[]
          priority?: string
          property_id?: string
          reservation_id?: string | null
          resolved_at?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_incidents_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_incidents_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_interventions: {
        Row: {
          assignee: string | null
          completed_at: string | null
          cost_cents: number
          created_at: string
          id: string
          incident_id: string
          notes: string | null
          planned_for: string | null
          provider: string | null
          status: string
          updated_at: string
        }
        Insert: {
          assignee?: string | null
          completed_at?: string | null
          cost_cents?: number
          created_at?: string
          id?: string
          incident_id: string
          notes?: string | null
          planned_for?: string | null
          provider?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          assignee?: string | null
          completed_at?: string | null
          cost_cents?: number
          created_at?: string
          id?: string
          incident_id?: string
          notes?: string | null
          planned_for?: string | null
          provider?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_interventions_incident_id_fkey"
            columns: ["incident_id"]
            isOneToOne: false
            referencedRelation: "maintenance_incidents"
            referencedColumns: ["id"]
          },
        ]
      }
      marketing_automations: {
        Row: {
          campaign_id: string | null
          created_at: string
          delay_days: number
          enabled: boolean
          id: string
          last_run_at: string | null
          name: string
          next_run_at: string | null
          rules: Json
          trigger_type: string
          updated_at: string
        }
        Insert: {
          campaign_id?: string | null
          created_at?: string
          delay_days?: number
          enabled?: boolean
          id?: string
          last_run_at?: string | null
          name: string
          next_run_at?: string | null
          rules?: Json
          trigger_type: string
          updated_at?: string
        }
        Update: {
          campaign_id?: string | null
          created_at?: string
          delay_days?: number
          enabled?: boolean
          id?: string
          last_run_at?: string | null
          name?: string
          next_run_at?: string | null
          rules?: Json
          trigger_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketing_automations_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "marketing_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      marketing_campaigns: {
        Row: {
          audience_rules: Json
          booking_count: number
          clicked_count: number
          content_blocks: Json
          created_at: string
          delivered_count: number
          id: string
          kind: string
          locale: string
          name: string
          opened_count: number
          preheader: string | null
          revenue_cents: number
          scheduled_at: string | null
          sent_count: number
          status: string
          subject: string
          updated_at: string
        }
        Insert: {
          audience_rules?: Json
          booking_count?: number
          clicked_count?: number
          content_blocks?: Json
          created_at?: string
          delivered_count?: number
          id?: string
          kind: string
          locale?: string
          name: string
          opened_count?: number
          preheader?: string | null
          revenue_cents?: number
          scheduled_at?: string | null
          sent_count?: number
          status?: string
          subject: string
          updated_at?: string
        }
        Update: {
          audience_rules?: Json
          booking_count?: number
          clicked_count?: number
          content_blocks?: Json
          created_at?: string
          delivered_count?: number
          id?: string
          kind?: string
          locale?: string
          name?: string
          opened_count?: number
          preheader?: string | null
          revenue_cents?: number
          scheduled_at?: string | null
          sent_count?: number
          status?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      occupancy_blocks: {
        Row: {
          calendar_event_id: string | null
          created_at: string
          id: string
          note: string | null
          property_id: string
          reservation_id: string | null
          source: Database["public"]["Enums"]["occupancy_source"]
          stay_range: unknown
        }
        Insert: {
          calendar_event_id?: string | null
          created_at?: string
          id?: string
          note?: string | null
          property_id: string
          reservation_id?: string | null
          source: Database["public"]["Enums"]["occupancy_source"]
          stay_range: unknown
        }
        Update: {
          calendar_event_id?: string | null
          created_at?: string
          id?: string
          note?: string | null
          property_id?: string
          reservation_id?: string | null
          source?: Database["public"]["Enums"]["occupancy_source"]
          stay_range?: unknown
        }
        Relationships: [
          {
            foreignKeyName: "occupancy_blocks_calendar_event_id_fkey"
            columns: ["calendar_event_id"]
            isOneToOne: true
            referencedRelation: "calendar_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "occupancy_blocks_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "occupancy_blocks_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: true
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
        ]
      }
      operational_photos: {
        Row: {
          caption: string | null
          created_at: string
          housekeeping_task_id: string | null
          id: string
          kind: string
          maintenance_incident_id: string | null
          property_id: string
          reservation_id: string | null
          storage_path: string
          taken_at: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          housekeeping_task_id?: string | null
          id?: string
          kind: string
          maintenance_incident_id?: string | null
          property_id: string
          reservation_id?: string | null
          storage_path: string
          taken_at?: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          housekeeping_task_id?: string | null
          id?: string
          kind?: string
          maintenance_incident_id?: string | null
          property_id?: string
          reservation_id?: string | null
          storage_path?: string
          taken_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "operational_photos_housekeeping_task_id_fkey"
            columns: ["housekeeping_task_id"]
            isOneToOne: false
            referencedRelation: "housekeeping_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "operational_photos_maintenance_incident_id_fkey"
            columns: ["maintenance_incident_id"]
            isOneToOne: false
            referencedRelation: "maintenance_incidents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "operational_photos_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "operational_photos_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
        ]
      }
      operational_reports: {
        Row: {
          created_at: string
          id: string
          metrics: Json
          period_end: string
          period_start: string
          property_id: string | null
          report_type: string
          summary: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          metrics?: Json
          period_end: string
          period_start: string
          property_id?: string | null
          report_type: string
          summary?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          metrics?: Json
          period_end?: string
          period_start?: string
          property_id?: string | null
          report_type?: string
          summary?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "operational_reports_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      options: {
        Row: {
          active: boolean
          code: string
          created_at: string
          default_price_cents: number
          description: string | null
          id: string
          name: string
          pricing_mode: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          code: string
          created_at?: string
          default_price_cents?: number
          description?: string | null
          id?: string
          name: string
          pricing_mode?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          code?: string
          created_at?: string
          default_price_cents?: number
          description?: string | null
          id?: string
          name?: string
          pricing_mode?: string
          updated_at?: string
        }
        Relationships: []
      }
      payment_events: {
        Row: {
          error_message: string | null
          event_type: string
          id: string
          payload: Json
          payment_id: string | null
          processed_at: string | null
          provider: string
          provider_event_id: string
          received_at: string
          status: string
        }
        Insert: {
          error_message?: string | null
          event_type: string
          id?: string
          payload?: Json
          payment_id?: string | null
          processed_at?: string | null
          provider?: string
          provider_event_id: string
          received_at?: string
          status?: string
        }
        Update: {
          error_message?: string | null
          event_type?: string
          id?: string
          payload?: Json
          payment_id?: string | null
          processed_at?: string | null
          provider?: string
          provider_event_id?: string
          received_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_events_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount_cents: number
          created_at: string
          currency: string
          failure_code: string | null
          failure_message: string | null
          id: string
          idempotency_key: string
          invoice_id: string | null
          kind: Database["public"]["Enums"]["payment_kind"]
          paid_at: string | null
          provider: string
          provider_payload: Json
          provider_payment_id: string | null
          provider_session_id: string | null
          refunded_cents: number
          reservation_id: string
          status: Database["public"]["Enums"]["payment_status"]
          updated_at: string
        }
        Insert: {
          amount_cents: number
          created_at?: string
          currency?: string
          failure_code?: string | null
          failure_message?: string | null
          id?: string
          idempotency_key: string
          invoice_id?: string | null
          kind: Database["public"]["Enums"]["payment_kind"]
          paid_at?: string | null
          provider?: string
          provider_payload?: Json
          provider_payment_id?: string | null
          provider_session_id?: string | null
          refunded_cents?: number
          reservation_id: string
          status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string
        }
        Update: {
          amount_cents?: number
          created_at?: string
          currency?: string
          failure_code?: string | null
          failure_message?: string | null
          id?: string
          idempotency_key?: string
          invoice_id?: string | null
          kind?: Database["public"]["Enums"]["payment_kind"]
          paid_at?: string | null
          provider?: string
          provider_payload?: Json
          provider_payment_id?: string | null
          provider_session_id?: string | null
          refunded_cents?: number
          reservation_id?: string
          status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
        ]
      }
      premium_experiences: {
        Row: {
          code: string
          created_at: string
          description: string
          enabled: boolean
          id: string
          image_path: string | null
          label: string
          price_cents: number
          property_ids: string[]
          rules: Json
          sort_order: number
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          description: string
          enabled?: boolean
          id?: string
          image_path?: string | null
          label: string
          price_cents: number
          property_ids?: string[]
          rules?: Json
          sort_order?: number
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string
          enabled?: boolean
          id?: string
          image_path?: string | null
          label?: string
          price_cents?: number
          property_ids?: string[]
          rules?: Json
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      promotions: {
        Row: {
          code: string | null
          created_at: string
          enabled: boolean
          id: string
          kind: string
          maximum_lead_days: number | null
          minimum_lead_days: number | null
          minimum_nights: number | null
          name: string
          percentage: number
          property_id: string | null
          rules: Json
          updated_at: string
          valid_range: unknown
        }
        Insert: {
          code?: string | null
          created_at?: string
          enabled?: boolean
          id?: string
          kind: string
          maximum_lead_days?: number | null
          minimum_lead_days?: number | null
          minimum_nights?: number | null
          name: string
          percentage: number
          property_id?: string | null
          rules?: Json
          updated_at?: string
          valid_range?: unknown
        }
        Update: {
          code?: string | null
          created_at?: string
          enabled?: boolean
          id?: string
          kind?: string
          maximum_lead_days?: number | null
          minimum_lead_days?: number | null
          minimum_nights?: number | null
          name?: string
          percentage?: number
          property_id?: string | null
          rules?: Json
          updated_at?: string
          valid_range?: unknown
        }
        Relationships: [
          {
            foreignKeyName: "promotions_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      properties: {
        Row: {
          active: boolean | null
          address_line1: string | null
          capacity_adults: number
          capacity_children: number
          city: string | null
          country_code: string
          created_at: string
          currency: string
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          pets_allowed: boolean
          postal_code: string | null
          slug: string
          status: string
          timezone: string
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          address_line1?: string | null
          capacity_adults: number
          capacity_children?: number
          city?: string | null
          country_code?: string
          created_at?: string
          currency?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          pets_allowed?: boolean
          postal_code?: string | null
          slug: string
          status?: string
          timezone?: string
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          address_line1?: string | null
          capacity_adults?: number
          capacity_children?: number
          city?: string | null
          country_code?: string
          created_at?: string
          currency?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          pets_allowed?: boolean
          postal_code?: string | null
          slug?: string
          status?: string
          timezone?: string
          updated_at?: string
        }
        Relationships: []
      }
      property_media: {
        Row: {
          active: boolean
          alt_text: string | null
          category: string | null
          created_at: string
          credits: string | null
          display_order: number
          duration_seconds: number | null
          external_url: string | null
          height: number | null
          id: string
          kind: string
          licence: string | null
          metadata: Json
          property_id: string
          source_url: string | null
          storage_bucket: string | null
          storage_path: string | null
          title: string | null
          updated_at: string
          width: number | null
        }
        Insert: {
          active?: boolean
          alt_text?: string | null
          category?: string | null
          created_at?: string
          credits?: string | null
          display_order?: number
          duration_seconds?: number | null
          external_url?: string | null
          height?: number | null
          id?: string
          kind: string
          licence?: string | null
          metadata?: Json
          property_id: string
          source_url?: string | null
          storage_bucket?: string | null
          storage_path?: string | null
          title?: string | null
          updated_at?: string
          width?: number | null
        }
        Update: {
          active?: boolean
          alt_text?: string | null
          category?: string | null
          created_at?: string
          credits?: string | null
          display_order?: number
          duration_seconds?: number | null
          external_url?: string | null
          height?: number | null
          id?: string
          kind?: string
          licence?: string | null
          metadata?: Json
          property_id?: string
          source_url?: string | null
          storage_bucket?: string | null
          storage_path?: string | null
          title?: string | null
          updated_at?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "property_media_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_options: {
        Row: {
          created_at: string
          enabled: boolean
          option_id: string
          price_cents: number
          property_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          enabled?: boolean
          option_id: string
          price_cents: number
          property_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          enabled?: boolean
          option_id?: string
          price_cents?: number
          property_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_options_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_options_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      rates: {
        Row: {
          cleaning_fee_cents: number
          created_at: string
          date_range: unknown
          enabled: boolean
          id: string
          maximum_nights: number | null
          minimum_nights: number | null
          name: string
          nightly_rate_cents: number
          priority: number
          property_id: string
          season_id: string | null
          security_deposit_cents: number
          tourist_tax_mode: string
          tourist_tax_value: number
          updated_at: string
          weekdays: number[]
        }
        Insert: {
          cleaning_fee_cents?: number
          created_at?: string
          date_range?: unknown
          enabled?: boolean
          id?: string
          maximum_nights?: number | null
          minimum_nights?: number | null
          name: string
          nightly_rate_cents: number
          priority?: number
          property_id: string
          season_id?: string | null
          security_deposit_cents?: number
          tourist_tax_mode?: string
          tourist_tax_value?: number
          updated_at?: string
          weekdays?: number[]
        }
        Update: {
          cleaning_fee_cents?: number
          created_at?: string
          date_range?: unknown
          enabled?: boolean
          id?: string
          maximum_nights?: number | null
          minimum_nights?: number | null
          name?: string
          nightly_rate_cents?: number
          priority?: number
          property_id?: string
          season_id?: string | null
          security_deposit_cents?: number
          tourist_tax_mode?: string
          tourist_tax_value?: number
          updated_at?: string
          weekdays?: number[]
        }
        Relationships: [
          {
            foreignKeyName: "rates_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rates_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      rate_guardrails: {
        Row: {
          maximum_rate_cents: number
          minimum_rate_cents: number
          occupancy_pricing_enabled: boolean
          property_id: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          maximum_rate_cents: number
          minimum_rate_cents: number
          occupancy_pricing_enabled?: boolean
          property_id: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          maximum_rate_cents?: number
          minimum_rate_cents?: number
          occupancy_pricing_enabled?: boolean
          property_id?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rate_guardrails_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: true
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      rate_overrides: {
        Row: {
          begins_on: string
          created_at: string
          created_by: string | null
          enabled: boolean
          ends_on: string
          id: string
          kind: string
          minimum_nights: number | null
          name: string
          nightly_rate_cents: number
          priority: number
          property_id: string
          source: string
          stay_range: unknown
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          begins_on: string
          created_at?: string
          created_by?: string | null
          enabled?: boolean
          ends_on: string
          id?: string
          kind: string
          minimum_nights?: number | null
          name: string
          nightly_rate_cents: number
          priority?: number
          property_id: string
          source?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          begins_on?: string
          enabled?: boolean
          ends_on?: string
          kind?: string
          minimum_nights?: number | null
          name?: string
          nightly_rate_cents?: number
          priority?: number
          property_id?: string
          source?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rate_overrides_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          created_at: string
          id: string
          qualified_reservation_id: string | null
          referral_code: string
          referred_benefit: Json
          referred_guest_id: string | null
          referrer_benefit: Json
          referrer_guest_id: string
          rewarded_at: string | null
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          qualified_reservation_id?: string | null
          referral_code: string
          referred_benefit: Json
          referred_guest_id?: string | null
          referrer_benefit: Json
          referrer_guest_id: string
          rewarded_at?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          qualified_reservation_id?: string | null
          referral_code?: string
          referred_benefit?: Json
          referred_guest_id?: string | null
          referrer_benefit?: Json
          referrer_guest_id?: string
          rewarded_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "referrals_qualified_reservation_id_fkey"
            columns: ["qualified_reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referred_guest_id_fkey"
            columns: ["referred_guest_id"]
            isOneToOne: false
            referencedRelation: "guests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referrer_guest_id_fkey"
            columns: ["referrer_guest_id"]
            isOneToOne: false
            referencedRelation: "guests"
            referencedColumns: ["id"]
          },
        ]
      }
      reservation_guests: {
        Row: {
          created_at: string
          guest_id: string
          is_primary: boolean
          reservation_id: string
        }
        Insert: {
          created_at?: string
          guest_id: string
          is_primary?: boolean
          reservation_id: string
        }
        Update: {
          created_at?: string
          guest_id?: string
          is_primary?: boolean
          reservation_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservation_guests_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "guests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservation_guests_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
        ]
      }
      reservation_notes: {
        Row: {
          category: string
          content: string
          created_at: string
          id: string
          pinned: boolean
          reservation_id: string
          updated_at: string
        }
        Insert: {
          category?: string
          content: string
          created_at?: string
          id?: string
          pinned?: boolean
          reservation_id: string
          updated_at?: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          id?: string
          pinned?: boolean
          reservation_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservation_notes_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
        ]
      }
      reservation_options: {
        Row: {
          created_at: string
          id: string
          label: string
          option_code: string
          option_id: string | null
          quantity: number
          reservation_id: string
          total_cents: number | null
          unit_price_cents: number
        }
        Insert: {
          created_at?: string
          id?: string
          label: string
          option_code: string
          option_id?: string | null
          quantity?: number
          reservation_id: string
          total_cents?: number | null
          unit_price_cents: number
        }
        Update: {
          created_at?: string
          id?: string
          label?: string
          option_code?: string
          option_id?: string | null
          quantity?: number
          reservation_id?: string
          total_cents?: number | null
          unit_price_cents?: number
        }
        Relationships: [
          {
            foreignKeyName: "reservation_options_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservation_options_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
        ]
      }
      reservations: {
        Row: {
          adults: number
          arrival: string
          babies: number
          balance_due_cents: number
          cancellation_reason: string | null
          cancelled_at: string | null
          channel: string
          children: number
          cleaning_fee_cents: number
          confirmed_at: string | null
          created_at: string
          currency: string
          departure: string
          deposit_due_cents: number
          discount_cents: number
          expires_at: string | null
          external_reference: string | null
          id: string
          idempotency_key: string | null
          nights_total_cents: number
          options_total_cents: number
          pets: number
          property_id: string
          quote_snapshot: Json
          reference: string
          status: Database["public"]["Enums"]["reservation_status"]
          total_cents: number
          tourist_tax_cents: number
          updated_at: string
        }
        Insert: {
          adults: number
          arrival: string
          babies?: number
          balance_due_cents?: number
          cancellation_reason?: string | null
          cancelled_at?: string | null
          channel?: string
          children?: number
          cleaning_fee_cents?: number
          confirmed_at?: string | null
          created_at?: string
          currency?: string
          departure: string
          deposit_due_cents?: number
          discount_cents?: number
          expires_at?: string | null
          external_reference?: string | null
          id?: string
          idempotency_key?: string | null
          nights_total_cents?: number
          options_total_cents?: number
          pets?: number
          property_id: string
          quote_snapshot?: Json
          reference: string
          status?: Database["public"]["Enums"]["reservation_status"]
          total_cents?: number
          tourist_tax_cents?: number
          updated_at?: string
        }
        Update: {
          adults?: number
          arrival?: string
          babies?: number
          balance_due_cents?: number
          cancellation_reason?: string | null
          cancelled_at?: string | null
          channel?: string
          children?: number
          cleaning_fee_cents?: number
          confirmed_at?: string | null
          created_at?: string
          currency?: string
          departure?: string
          deposit_due_cents?: number
          discount_cents?: number
          expires_at?: string | null
          external_reference?: string | null
          id?: string
          idempotency_key?: string | null
          nights_total_cents?: number
          options_total_cents?: number
          pets?: number
          property_id?: string
          quote_snapshot?: Json
          reference?: string
          status?: Database["public"]["Enums"]["reservation_status"]
          total_cents?: number
          tourist_tax_cents?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservations_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      revenue_promotions: {
        Row: {
          code: string
          created_at: string
          direct_only: boolean
          discount_type: string
          enabled: boolean
          ends_at: string
          id: string
          label: string
          low_season_only: boolean
          minimum_stay_nights: number | null
          property_ids: string[]
          returning_guests_only: boolean
          starts_at: string
          updated_at: string
          usage_count: number
          usage_limit: number | null
          value: number
        }
        Insert: {
          code: string
          created_at?: string
          direct_only?: boolean
          discount_type: string
          enabled?: boolean
          ends_at: string
          id?: string
          label: string
          low_season_only?: boolean
          minimum_stay_nights?: number | null
          property_ids?: string[]
          returning_guests_only?: boolean
          starts_at: string
          updated_at?: string
          usage_count?: number
          usage_limit?: number | null
          value: number
        }
        Update: {
          code?: string
          created_at?: string
          direct_only?: boolean
          discount_type?: string
          enabled?: boolean
          ends_at?: string
          id?: string
          label?: string
          low_season_only?: boolean
          minimum_stay_nights?: number | null
          property_ids?: string[]
          returning_guests_only?: boolean
          starts_at?: string
          updated_at?: string
          usage_count?: number
          usage_limit?: number | null
          value?: number
        }
        Relationships: []
      }
      review_requests: {
        Row: {
          created_at: string
          id: string
          idempotency_key: string
          platform: string
          rating: number | null
          reservation_id: string
          response_text: string | null
          review_external_id: string | null
          reviewed_at: string | null
          scheduled_at: string
          sent_at: string | null
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          idempotency_key: string
          platform: string
          rating?: number | null
          reservation_id: string
          response_text?: string | null
          review_external_id?: string | null
          reviewed_at?: string | null
          scheduled_at: string
          sent_at?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          idempotency_key?: string
          platform?: string
          rating?: number | null
          reservation_id?: string
          response_text?: string | null
          review_external_id?: string | null
          reviewed_at?: string | null
          scheduled_at?: string
          sent_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_requests_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
        ]
      }
      seasons: {
        Row: {
          begins_on: string
          created_at: string
          date_range: unknown
          ends_on: string
          id: string
          kind: string
          minimum_nights: number | null
          name: string
          priority: number
          property_id: string
          updated_at: string
        }
        Insert: {
          begins_on: string
          created_at?: string
          date_range?: unknown
          ends_on: string
          id?: string
          kind: string
          minimum_nights?: number | null
          name: string
          priority?: number
          property_id: string
          updated_at?: string
        }
        Update: {
          begins_on?: string
          created_at?: string
          date_range?: unknown
          ends_on?: string
          id?: string
          kind?: string
          minimum_nights?: number | null
          name?: string
          priority?: number
          property_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "seasons_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      security_deposits: {
        Row: {
          amount_cents: number
          authorized_at: string | null
          created_at: string
          id: string
          provider: string | null
          provider_reference: string | null
          released_at: string | null
          reservation_id: string
          status: string
          updated_at: string
        }
        Insert: {
          amount_cents: number
          authorized_at?: string | null
          created_at?: string
          id?: string
          provider?: string | null
          provider_reference?: string | null
          released_at?: string | null
          reservation_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          amount_cents?: number
          authorized_at?: string | null
          created_at?: string
          id?: string
          provider?: string | null
          provider_reference?: string | null
          released_at?: string | null
          reservation_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "security_deposits_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: true
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
        ]
      }
      signatures: {
        Row: {
          contract_id: string
          created_at: string
          id: string
          provider: string
          provider_payload: Json
          provider_request_id: string | null
          sent_at: string | null
          signed_at: string | null
          signed_document_path: string | null
          status: Database["public"]["Enums"]["contract_status"]
          updated_at: string
        }
        Insert: {
          contract_id: string
          created_at?: string
          id?: string
          provider: string
          provider_payload?: Json
          provider_request_id?: string | null
          sent_at?: string | null
          signed_at?: string | null
          signed_document_path?: string | null
          status?: Database["public"]["Enums"]["contract_status"]
          updated_at?: string
        }
        Update: {
          contract_id?: string
          created_at?: string
          id?: string
          provider?: string
          provider_payload?: Json
          provider_request_id?: string | null
          sent_at?: string | null
          signed_at?: string | null
          signed_document_path?: string | null
          status?: Database["public"]["Enums"]["contract_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "signatures_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_items: {
        Row: {
          alert_threshold: number
          category: string
          created_at: string
          id: string
          last_restocked_at: string | null
          name: string
          property_id: string | null
          quantity: number
          target_quantity: number
          unit: string
          unit_cost_cents: number
          updated_at: string
        }
        Insert: {
          alert_threshold?: number
          category: string
          created_at?: string
          id?: string
          last_restocked_at?: string | null
          name: string
          property_id?: string | null
          quantity?: number
          target_quantity?: number
          unit?: string
          unit_cost_cents?: number
          updated_at?: string
        }
        Update: {
          alert_threshold?: number
          category?: string
          created_at?: string
          id?: string
          last_restocked_at?: string | null
          name?: string
          property_id?: string | null
          quantity?: number
          target_quantity?: number
          unit?: string
          unit_cost_cents?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stock_items_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      sync_runs: {
        Row: {
          completed_at: string | null
          error_count: number
          error_details: Json
          id: string
          imported_count: number
          source_id: string | null
          started_at: string
          status: string
        }
        Insert: {
          completed_at?: string | null
          error_count?: number
          error_details?: Json
          id?: string
          imported_count?: number
          source_id?: string | null
          started_at?: string
          status: string
        }
        Update: {
          completed_at?: string | null
          error_count?: number
          error_details?: Json
          id?: string
          imported_count?: number
          source_id?: string | null
          started_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "sync_runs_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "calendar_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      transactional_emails: {
        Row: {
          attempts: number
          cancelled_at: string | null
          created_at: string
          custom_paragraph: string | null
          id: string
          idempotency_key: string | null
          last_error: string | null
          locale: string
          manually_marked_sent_at: string | null
          message_type: string | null
          provider: string
          provider_message_id: string | null
          recipient_hash: string
          reservation_id: string | null
          scheduled_at: string | null
          sent_at: string | null
          status: Database["public"]["Enums"]["message_status"]
          template_key: string
          updated_at: string
        }
        Insert: {
          attempts?: number
          cancelled_at?: string | null
          created_at?: string
          custom_paragraph?: string | null
          id?: string
          idempotency_key?: string | null
          last_error?: string | null
          locale?: string
          manually_marked_sent_at?: string | null
          message_type?: string | null
          provider: string
          provider_message_id?: string | null
          recipient_hash: string
          reservation_id?: string | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["message_status"]
          template_key: string
          updated_at?: string
        }
        Update: {
          attempts?: number
          cancelled_at?: string | null
          created_at?: string
          custom_paragraph?: string | null
          id?: string
          idempotency_key?: string | null
          last_error?: string | null
          locale?: string
          manually_marked_sent_at?: string | null
          message_type?: string | null
          provider?: string
          provider_message_id?: string | null
          recipient_hash?: string
          reservation_id?: string | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["message_status"]
          template_key?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactional_emails_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          active: boolean
          created_at: string
          display_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          display_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          display_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      yield_decision_logs: {
        Row: {
          action: string
          actor: string
          after_data: Json | null
          before_data: Json | null
          created_at: string
          id: string
          recommendation_id: string | null
        }
        Insert: {
          action: string
          actor: string
          after_data?: Json | null
          before_data?: Json | null
          created_at?: string
          id?: string
          recommendation_id?: string | null
        }
        Update: {
          action?: string
          actor?: string
          after_data?: Json | null
          before_data?: Json | null
          created_at?: string
          id?: string
          recommendation_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "yield_decision_logs_recommendation_id_fkey"
            columns: ["recommendation_id"]
            isOneToOne: false
            referencedRelation: "yield_recommendations"
            referencedColumns: ["id"]
          },
        ]
      }
      yield_rate_overrides: {
        Row: {
          created_at: string
          id: string
          minimum_nights: number | null
          nightly_rate_cents: number
          property_id: string
          recommendation_id: string | null
          status: string
          stay_date: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          minimum_nights?: number | null
          nightly_rate_cents: number
          property_id: string
          recommendation_id?: string | null
          status?: string
          stay_date: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          minimum_nights?: number | null
          nightly_rate_cents?: number
          property_id?: string
          recommendation_id?: string | null
          status?: string
          stay_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "yield_rate_overrides_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "yield_rate_overrides_recommendation_id_fkey"
            columns: ["recommendation_id"]
            isOneToOne: false
            referencedRelation: "yield_recommendations"
            referencedColumns: ["id"]
          },
        ]
      }
      yield_recommendations: {
        Row: {
          base_rate_cents: number
          confidence: number
          created_at: string
          decided_at: string | null
          decided_by: string | null
          decision_note: string | null
          factors: Json
          id: string
          lead_days: number
          occupancy_rate: number
          property_id: string
          recommended_rate_cents: number
          status: string
          stay_date: string
          updated_at: string
        }
        Insert: {
          base_rate_cents: number
          confidence?: number
          created_at?: string
          decided_at?: string | null
          decided_by?: string | null
          decision_note?: string | null
          factors?: Json
          id?: string
          lead_days: number
          occupancy_rate?: number
          property_id: string
          recommended_rate_cents: number
          status?: string
          stay_date: string
          updated_at?: string
        }
        Update: {
          base_rate_cents?: number
          confidence?: number
          created_at?: string
          decided_at?: string | null
          decided_by?: string | null
          decision_note?: string | null
          factors?: Json
          id?: string
          lead_days?: number
          occupancy_rate?: number
          property_id?: string
          recommended_rate_cents?: number
          status?: string
          stay_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "yield_recommendations_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      yield_strategies: {
        Row: {
          created_at: string
          early_booking_days: number
          enabled: boolean
          event_weight: number
          id: string
          last_minute_days: number
          lead_time_weight: number
          maximum_decrease_percentage: number
          maximum_increase_percentage: number
          maximum_rate_cents: number
          minimum_rate_cents: number
          name: string
          occupancy_weight: number
          property_id: string
          target_occupancy: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          early_booking_days?: number
          enabled?: boolean
          event_weight?: number
          id?: string
          last_minute_days?: number
          lead_time_weight?: number
          maximum_decrease_percentage?: number
          maximum_increase_percentage?: number
          maximum_rate_cents: number
          minimum_rate_cents: number
          name?: string
          occupancy_weight?: number
          property_id: string
          target_occupancy?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          early_booking_days?: number
          enabled?: boolean
          event_weight?: number
          id?: string
          last_minute_days?: number
          lead_time_weight?: number
          maximum_decrease_percentage?: number
          maximum_increase_percentage?: number
          maximum_rate_cents?: number
          minimum_rate_cents?: number
          name?: string
          occupancy_weight?: number
          property_id?: string
          target_occupancy?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "yield_strategies_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: true
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_stay_price: {
        Args: {
          requested_arrival: string
          requested_departure: string
          requested_property_id: string
        }
        Returns: Json
      }
      claim_payment_event: {
        Args: {
          event_id: string
          event_name: string
          event_payload: Json
          event_provider: string
        }
        Returns: string
      }
      create_direct_reservation: {
        Args: {
          arrival_date: string
          departure_date: string
          guest: Json
          property_slug: string
          quote: Json
          request_key?: string
          selected_options?: Json
        }
        Returns: {
          adults: number
          arrival: string
          babies: number
          balance_due_cents: number
          cancellation_reason: string | null
          cancelled_at: string | null
          channel: string
          children: number
          cleaning_fee_cents: number
          confirmed_at: string | null
          created_at: string
          currency: string
          departure: string
          deposit_due_cents: number
          discount_cents: number
          expires_at: string | null
          external_reference: string | null
          id: string
          idempotency_key: string | null
          nights_total_cents: number
          options_total_cents: number
          pets: number
          property_id: string
          quote_snapshot: Json
          reference: string
          status: Database["public"]["Enums"]["reservation_status"]
          total_cents: number
          tourist_tax_cents: number
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "reservations"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      current_app_role: {
        Args: never
        Returns: Database["public"]["Enums"]["app_role"]
      }
      generate_reservation_number: { Args: never; Returns: string }
      is_property_available: {
        Args: {
          ignored_reservation_id?: string
          requested_arrival: string
          requested_departure: string
          requested_property_id: string
        }
        Returns: boolean
      }
      refresh_availability: {
        Args: {
          begins_on: string
          ends_on: string
          requested_property_id: string
        }
        Returns: undefined
      }
      replace_calendar_events: {
        Args: {
          imported_events: Json
          requested_property_slug: string
          requested_provider: Database["public"]["Enums"]["occupancy_source"]
          synced_at?: string
        }
        Returns: number
      }
    }
    Enums: {
      app_role: "admin" | "concierge" | "read_only"
      contract_status:
        | "draft"
        | "generated"
        | "sent"
        | "viewed"
        | "signed"
        | "declined"
        | "expired"
      message_status:
        | "queued"
        | "sent"
        | "delivered"
        | "failed"
        | "bounced"
        | "opened"
      occupancy_source:
        | "reservation"
        | "airbnb"
        | "booking"
        | "abritel"
        | "google"
        | "manual"
        | "channel_manager"
      payment_kind: "deposit" | "balance" | "full" | "refund"
      payment_status:
        | "pending"
        | "requires_action"
        | "authorized"
        | "paid"
        | "failed"
        | "cancelled"
        | "partially_refunded"
        | "refunded"
      reservation_status:
        | "draft"
        | "pending_payment"
        | "requested"
        | "confirmed"
        | "cancelled"
        | "completed"
        | "declined"
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
      app_role: ["admin", "concierge", "read_only"],
      contract_status: [
        "draft",
        "generated",
        "sent",
        "viewed",
        "signed",
        "declined",
        "expired",
      ],
      message_status: [
        "queued",
        "sent",
        "delivered",
        "failed",
        "bounced",
        "opened",
      ],
      occupancy_source: [
        "reservation",
        "airbnb",
        "booking",
        "abritel",
        "google",
        "manual",
        "channel_manager",
      ],
      payment_kind: ["deposit", "balance", "full", "refund"],
      payment_status: [
        "pending",
        "requires_action",
        "authorized",
        "paid",
        "failed",
        "cancelled",
        "partially_refunded",
        "refunded",
      ],
      reservation_status: [
        "draft",
        "pending_payment",
        "requested",
        "confirmed",
        "cancelled",
        "completed",
        "declined",
      ],
    },
  },
} as const
