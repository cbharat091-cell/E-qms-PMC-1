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
      actions: {
        Row: {
          approved_at: string | null
          archived_at: string | null
          assignee_user_id: string | null
          closed_at: string | null
          created_at: string
          created_by: string | null
          description: string | null
          due_date: string | null
          effectiveness: string | null
          id: string
          organization_id: string
          process_id: string | null
          reference_code: string | null
          requires_signature: boolean | null
          source_id: string | null
          source_type: string | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          archived_at?: string | null
          assignee_user_id?: string | null
          closed_at?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          effectiveness?: string | null
          id?: string
          organization_id: string
          process_id?: string | null
          reference_code?: string | null
          requires_signature?: boolean | null
          source_id?: string | null
          source_type?: string | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          archived_at?: string | null
          assignee_user_id?: string | null
          closed_at?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          effectiveness?: string | null
          id?: string
          organization_id?: string
          process_id?: string | null
          reference_code?: string | null
          requires_signature?: boolean | null
          source_id?: string | null
          source_type?: string | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "actions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "actions_process_id_fkey"
            columns: ["process_id"]
            isOneToOne: false
            referencedRelation: "processes"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_checklist_items: {
        Row: {
          audit_id: string
          checked_at: string | null
          checked_by: string | null
          clause_code: string | null
          created_at: string
          expected_evidence: string | null
          id: string
          notes: string | null
          organization_id: string
          process_id: string | null
          question: string
          result: Database["public"]["Enums"]["checklist_result"]
          sequence: number
        }
        Insert: {
          audit_id: string
          checked_at?: string | null
          checked_by?: string | null
          clause_code?: string | null
          created_at?: string
          expected_evidence?: string | null
          id?: string
          notes?: string | null
          organization_id: string
          process_id?: string | null
          question: string
          result?: Database["public"]["Enums"]["checklist_result"]
          sequence?: number
        }
        Update: {
          audit_id?: string
          checked_at?: string | null
          checked_by?: string | null
          clause_code?: string | null
          created_at?: string
          expected_evidence?: string | null
          id?: string
          notes?: string | null
          organization_id?: string
          process_id?: string | null
          question?: string
          result?: Database["public"]["Enums"]["checklist_result"]
          sequence?: number
        }
        Relationships: [
          {
            foreignKeyName: "audit_checklist_items_audit_id_fkey"
            columns: ["audit_id"]
            isOneToOne: false
            referencedRelation: "audits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_checklist_items_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_checklist_items_process_id_fkey"
            columns: ["process_id"]
            isOneToOne: false
            referencedRelation: "processes"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_evidence: {
        Row: {
          audit_id: string | null
          checklist_item_id: string | null
          external_url: string | null
          finding_id: string | null
          id: string
          label: string
          organization_id: string
          storage_path: string | null
          uploaded_at: string
          uploaded_by: string | null
        }
        Insert: {
          audit_id?: string | null
          checklist_item_id?: string | null
          external_url?: string | null
          finding_id?: string | null
          id?: string
          label: string
          organization_id: string
          storage_path?: string | null
          uploaded_at?: string
          uploaded_by?: string | null
        }
        Update: {
          audit_id?: string | null
          checklist_item_id?: string | null
          external_url?: string | null
          finding_id?: string | null
          id?: string
          label?: string
          organization_id?: string
          storage_path?: string | null
          uploaded_at?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_evidence_audit_id_fkey"
            columns: ["audit_id"]
            isOneToOne: false
            referencedRelation: "audits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_evidence_checklist_item_id_fkey"
            columns: ["checklist_item_id"]
            isOneToOne: false
            referencedRelation: "audit_checklist_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_evidence_finding_id_fkey"
            columns: ["finding_id"]
            isOneToOne: false
            referencedRelation: "audit_findings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_evidence_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_findings: {
        Row: {
          action_id: string | null
          audit_id: string
          checklist_item_id: string | null
          clause_code: string | null
          closed_at: string | null
          created_at: string
          created_by: string | null
          evidence: string | null
          finding_type: Database["public"]["Enums"]["finding_type"]
          id: string
          organization_id: string
          process_id: string | null
          reference_code: string | null
          root_cause: string | null
          statement: string
          status: Database["public"]["Enums"]["finding_status"]
          updated_at: string
        }
        Insert: {
          action_id?: string | null
          audit_id: string
          checklist_item_id?: string | null
          clause_code?: string | null
          closed_at?: string | null
          created_at?: string
          created_by?: string | null
          evidence?: string | null
          finding_type: Database["public"]["Enums"]["finding_type"]
          id?: string
          organization_id: string
          process_id?: string | null
          reference_code?: string | null
          root_cause?: string | null
          statement: string
          status?: Database["public"]["Enums"]["finding_status"]
          updated_at?: string
        }
        Update: {
          action_id?: string | null
          audit_id?: string
          checklist_item_id?: string | null
          clause_code?: string | null
          closed_at?: string | null
          created_at?: string
          created_by?: string | null
          evidence?: string | null
          finding_type?: Database["public"]["Enums"]["finding_type"]
          id?: string
          organization_id?: string
          process_id?: string | null
          reference_code?: string | null
          root_cause?: string | null
          statement?: string
          status?: Database["public"]["Enums"]["finding_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_findings_action_id_fkey"
            columns: ["action_id"]
            isOneToOne: false
            referencedRelation: "actions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_findings_audit_id_fkey"
            columns: ["audit_id"]
            isOneToOne: false
            referencedRelation: "audits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_findings_checklist_item_id_fkey"
            columns: ["checklist_item_id"]
            isOneToOne: false
            referencedRelation: "audit_checklist_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_findings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_findings_process_id_fkey"
            columns: ["process_id"]
            isOneToOne: false
            referencedRelation: "processes"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_log: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          entity_id: string | null
          entity_type: string | null
          id: string
          ip_address: unknown
          organization_id: string | null
          payload: Json | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: unknown
          organization_id?: string | null
          payload?: Json | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: unknown
          organization_id?: string | null
          payload?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      audits: {
        Row: {
          actual_end: string | null
          actual_start: string | null
          archived_at: string | null
          created_at: string
          created_by: string | null
          id: string
          lead_auditor_id: string | null
          organization_id: string
          planned_end: string | null
          planned_start: string | null
          reference_code: string | null
          scope_clause_codes: string[] | null
          scope_description: string | null
          scope_process_ids: string[] | null
          status: Database["public"]["Enums"]["audit_status"]
          summary: string | null
          team_user_ids: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          actual_end?: string | null
          actual_start?: string | null
          archived_at?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          lead_auditor_id?: string | null
          organization_id: string
          planned_end?: string | null
          planned_start?: string | null
          reference_code?: string | null
          scope_clause_codes?: string[] | null
          scope_description?: string | null
          scope_process_ids?: string[] | null
          status?: Database["public"]["Enums"]["audit_status"]
          summary?: string | null
          team_user_ids?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          actual_end?: string | null
          actual_start?: string | null
          archived_at?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          lead_auditor_id?: string | null
          organization_id?: string
          planned_end?: string | null
          planned_start?: string | null
          reference_code?: string | null
          scope_clause_codes?: string[] | null
          scope_description?: string | null
          scope_process_ids?: string[] | null
          status?: Database["public"]["Enums"]["audit_status"]
          summary?: string | null
          team_user_ids?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "audits_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          approved_at: string | null
          archived_at: string | null
          created_at: string
          created_by: string | null
          current_version: number | null
          doc_type: string | null
          id: string
          organization_id: string
          reference_code: string | null
          storage_path: string | null
          title: string
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          archived_at?: string | null
          created_at?: string
          created_by?: string | null
          current_version?: number | null
          doc_type?: string | null
          id?: string
          organization_id: string
          reference_code?: string | null
          storage_path?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          archived_at?: string | null
          created_at?: string
          created_by?: string | null
          current_version?: number | null
          doc_type?: string | null
          id?: string
          organization_id?: string
          reference_code?: string | null
          storage_path?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      kpi_values: {
        Row: {
          id: string
          kpi_id: string
          organization_id: string
          passed: boolean | null
          period_label: string
          recorded_at: string
          recorded_by: string | null
          value: number
        }
        Insert: {
          id?: string
          kpi_id: string
          organization_id: string
          passed?: boolean | null
          period_label: string
          recorded_at?: string
          recorded_by?: string | null
          value: number
        }
        Update: {
          id?: string
          kpi_id?: string
          organization_id?: string
          passed?: boolean | null
          period_label?: string
          recorded_at?: string
          recorded_by?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "kpi_values_kpi_id_fkey"
            columns: ["kpi_id"]
            isOneToOne: false
            referencedRelation: "kpis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kpi_values_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      kpis: {
        Row: {
          archived_at: string | null
          comparator: string | null
          created_at: string
          created_by: string | null
          frequency: string | null
          id: string
          name: string
          organization_id: string
          process_id: string | null
          reference_code: string | null
          target_value: number | null
          unit: string | null
        }
        Insert: {
          archived_at?: string | null
          comparator?: string | null
          created_at?: string
          created_by?: string | null
          frequency?: string | null
          id?: string
          name: string
          organization_id: string
          process_id?: string | null
          reference_code?: string | null
          target_value?: number | null
          unit?: string | null
        }
        Update: {
          archived_at?: string | null
          comparator?: string | null
          created_at?: string
          created_by?: string | null
          frequency?: string | null
          id?: string
          name?: string
          organization_id?: string
          process_id?: string | null
          reference_code?: string | null
          target_value?: number | null
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kpis_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kpis_process_id_fkey"
            columns: ["process_id"]
            isOneToOne: false
            referencedRelation: "processes"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          entity_id: string | null
          entity_type: string | null
          id: string
          kind: Database["public"]["Enums"]["notification_kind"]
          link_path: string | null
          organization_id: string
          read_at: string | null
          title: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          kind: Database["public"]["Enums"]["notification_kind"]
          link_path?: string | null
          organization_id: string
          read_at?: string | null
          title: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          kind?: Database["public"]["Enums"]["notification_kind"]
          link_path?: string | null
          organization_id?: string
          read_at?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          country: string | null
          created_at: string
          id: string
          name: string
          scope_statement: string | null
          sector: string | null
          standard_code: string | null
          updated_at: string
        }
        Insert: {
          country?: string | null
          created_at?: string
          id?: string
          name: string
          scope_statement?: string | null
          sector?: string | null
          standard_code?: string | null
          updated_at?: string
        }
        Update: {
          country?: string | null
          created_at?: string
          id?: string
          name?: string
          scope_statement?: string | null
          sector?: string | null
          standard_code?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      processes: {
        Row: {
          archived_at: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          name: string
          organization_id: string
          owner_user_id: string | null
          reference_code: string | null
          scope: string | null
          typology: string | null
          updated_at: string
        }
        Insert: {
          archived_at?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          organization_id: string
          owner_user_id?: string | null
          reference_code?: string | null
          scope?: string | null
          typology?: string | null
          updated_at?: string
        }
        Update: {
          archived_at?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          organization_id?: string
          owner_user_id?: string | null
          reference_code?: string | null
          scope?: string | null
          typology?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "processes_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string
          id: string
          job_title: string | null
          onboarded_at: string | null
          organization_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name: string
          id: string
          job_title?: string | null
          onboarded_at?: string | null
          organization_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string
          id?: string
          job_title?: string | null
          onboarded_at?: string | null
          organization_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      risks: {
        Row: {
          archived_at: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          organization_id: string
          priority: string | null
          probability: number
          process_id: string | null
          reference_code: string | null
          severity: number
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          archived_at?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          organization_id: string
          priority?: string | null
          probability?: number
          process_id?: string | null
          reference_code?: string | null
          severity?: number
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          archived_at?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          organization_id?: string
          priority?: string | null
          probability?: number
          process_id?: string | null
          reference_code?: string | null
          severity?: number
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "risks_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "risks_process_id_fkey"
            columns: ["process_id"]
            isOneToOne: false
            referencedRelation: "processes"
            referencedColumns: ["id"]
          },
        ]
      }
      signatures: {
        Row: {
          comment: string | null
          entity_id: string
          entity_type: string
          entity_version: number
          id: string
          intent: Database["public"]["Enums"]["signature_intent"]
          ip_address: unknown
          organization_id: string
          payload_hash: string
          signed_at: string
          signer_display_name: string
          signer_id: string
          signer_role: Database["public"]["Enums"]["app_role"]
          user_agent: string | null
        }
        Insert: {
          comment?: string | null
          entity_id: string
          entity_type: string
          entity_version?: number
          id?: string
          intent: Database["public"]["Enums"]["signature_intent"]
          ip_address?: unknown
          organization_id: string
          payload_hash: string
          signed_at?: string
          signer_display_name: string
          signer_id: string
          signer_role: Database["public"]["Enums"]["app_role"]
          user_agent?: string | null
        }
        Update: {
          comment?: string | null
          entity_id?: string
          entity_type?: string
          entity_version?: number
          id?: string
          intent?: Database["public"]["Enums"]["signature_intent"]
          ip_address?: unknown
          organization_id?: string
          payload_hash?: string
          signed_at?: string
          signer_display_name?: string
          signer_id?: string
          signer_role?: Database["public"]["Enums"]["app_role"]
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "signatures_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          granted_at: string
          granted_by: string | null
          id: string
          organization_id: string
          role: Database["public"]["Enums"]["app_role"]
          scope_process_id: string | null
          user_id: string
        }
        Insert: {
          granted_at?: string
          granted_by?: string | null
          id?: string
          organization_id: string
          role: Database["public"]["Enums"]["app_role"]
          scope_process_id?: string | null
          user_id: string
        }
        Update: {
          granted_at?: string
          granted_by?: string | null
          id?: string
          organization_id?: string
          role?: Database["public"]["Enums"]["app_role"]
          scope_process_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_org: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_org_member: {
        Args: { _org: string; _user_id: string }
        Returns: boolean
      }
      is_rmq: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role:
        | "rmq"
        | "top_management"
        | "process_owner"
        | "auditor_internal"
        | "auditor_external"
        | "contributor"
      audit_status:
        | "planned"
        | "in_progress"
        | "reporting"
        | "closed"
        | "cancelled"
      checklist_result:
        | "pending"
        | "conform"
        | "minor_nc"
        | "major_nc"
        | "observation"
        | "ofi"
        | "na"
      finding_status:
        | "open"
        | "action_in_progress"
        | "awaiting_verification"
        | "closed"
      finding_type:
        | "major_nc"
        | "minor_nc"
        | "observation"
        | "ofi"
        | "conformity"
      notification_kind:
        | "action_due"
        | "review_due"
        | "audit_scheduled"
        | "audit_starting"
        | "signature_requested"
        | "kpi_failed"
        | "finding_assigned"
        | "mention"
      signature_intent: "approve" | "reject" | "review" | "release" | "witness"
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
      app_role: [
        "rmq",
        "top_management",
        "process_owner",
        "auditor_internal",
        "auditor_external",
        "contributor",
      ],
      audit_status: [
        "planned",
        "in_progress",
        "reporting",
        "closed",
        "cancelled",
      ],
      checklist_result: [
        "pending",
        "conform",
        "minor_nc",
        "major_nc",
        "observation",
        "ofi",
        "na",
      ],
      finding_status: [
        "open",
        "action_in_progress",
        "awaiting_verification",
        "closed",
      ],
      finding_type: [
        "major_nc",
        "minor_nc",
        "observation",
        "ofi",
        "conformity",
      ],
      notification_kind: [
        "action_due",
        "review_due",
        "audit_scheduled",
        "audit_starting",
        "signature_requested",
        "kpi_failed",
        "finding_assigned",
        "mention",
      ],
      signature_intent: ["approve", "reject", "review", "release", "witness"],
    },
  },
} as const
