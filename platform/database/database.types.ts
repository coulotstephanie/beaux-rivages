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
