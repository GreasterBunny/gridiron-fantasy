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
      draft_picks: {
        Row: {
          created_at: string
          draft_session_id: string
          fantasy_team_id: string
          id: string
          is_auto_pick: boolean
          league_id: string
          overall_pick: number
          pick_number: number
          picked_at: string | null
          player_id: string | null
          round: number
        }
        Insert: {
          created_at?: string
          draft_session_id: string
          fantasy_team_id: string
          id?: string
          is_auto_pick?: boolean
          league_id: string
          overall_pick: number
          pick_number: number
          picked_at?: string | null
          player_id?: string | null
          round: number
        }
        Update: {
          created_at?: string
          draft_session_id?: string
          fantasy_team_id?: string
          id?: string
          is_auto_pick?: boolean
          league_id?: string
          overall_pick?: number
          pick_number?: number
          picked_at?: string | null
          player_id?: string | null
          round?: number
        }
        Relationships: [
          { foreignKeyName: "draft_picks_draft_session_id_fkey"; columns: ["draft_session_id"]; referencedRelation: "draft_sessions"; referencedColumns: ["id"] },
          { foreignKeyName: "draft_picks_fantasy_team_id_fkey"; columns: ["fantasy_team_id"]; referencedRelation: "fantasy_teams"; referencedColumns: ["id"] },
          { foreignKeyName: "draft_picks_league_id_fkey"; columns: ["league_id"]; referencedRelation: "leagues"; referencedColumns: ["id"] },
          { foreignKeyName: "draft_picks_player_id_fkey"; columns: ["player_id"]; referencedRelation: "nfl_players"; referencedColumns: ["id"] },
        ]
      }
      draft_sessions: {
        Row: {
          completed_at: string | null
          created_at: string
          current_pick: number
          current_round: number
          id: string
          league_id: string
          pick_order: string[]
          pick_started_at: string | null
          started_at: string | null
          status: Database["public"]["Enums"]["draft_status"]
          time_per_pick_seconds: number
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          current_pick?: number
          current_round?: number
          id?: string
          league_id: string
          pick_order?: string[]
          pick_started_at?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["draft_status"]
          time_per_pick_seconds?: number
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          current_pick?: number
          current_round?: number
          id?: string
          league_id?: string
          pick_order?: string[]
          pick_started_at?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["draft_status"]
          time_per_pick_seconds?: number
        }
        Relationships: [
          { foreignKeyName: "draft_sessions_league_id_fkey"; columns: ["league_id"]; referencedRelation: "leagues"; referencedColumns: ["id"] },
        ]
      }
      fantasy_teams: {
        Row: {
          created_at: string
          faab_budget: number
          id: string
          league_id: string
          logo_url: string | null
          losses: number
          name: string
          points_against: number
          points_for: number
          ties: number
          updated_at: string
          user_id: string
          waiver_priority: number
          wins: number
        }
        Insert: {
          created_at?: string
          faab_budget?: number
          id?: string
          league_id: string
          logo_url?: string | null
          losses?: number
          name: string
          points_against?: number
          points_for?: number
          ties?: number
          updated_at?: string
          user_id: string
          waiver_priority?: number
          wins?: number
        }
        Update: {
          created_at?: string
          faab_budget?: number
          id?: string
          league_id?: string
          logo_url?: string | null
          losses?: number
          name?: string
          points_against?: number
          points_for?: number
          ties?: number
          updated_at?: string
          user_id?: string
          waiver_priority?: number
          wins?: number
        }
        Relationships: [
          { foreignKeyName: "fantasy_teams_league_id_fkey"; columns: ["league_id"]; referencedRelation: "leagues"; referencedColumns: ["id"] },
          { foreignKeyName: "fantasy_teams_user_id_fkey"; columns: ["user_id"]; referencedRelation: "profiles"; referencedColumns: ["id"] },
        ]
      }
      league_invites: {
        Row: {
          accepted_at: string | null
          created_at: string
          expires_at: string
          id: string
          invited_by: string
          invited_email: string
          league_id: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          invited_by: string
          invited_email: string
          league_id: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          invited_by?: string
          invited_email?: string
          league_id?: string
        }
        Relationships: [
          { foreignKeyName: "league_invites_invited_by_fkey"; columns: ["invited_by"]; referencedRelation: "profiles"; referencedColumns: ["id"] },
          { foreignKeyName: "league_invites_league_id_fkey"; columns: ["league_id"]; referencedRelation: "leagues"; referencedColumns: ["id"] },
        ]
      }
      leagues: {
        Row: {
          commissioner_id: string
          created_at: string
          draft_date: string | null
          draft_status: Database["public"]["Enums"]["draft_status"]
          draft_type: string
          faab_budget: number
          id: string
          invite_code: string | null
          is_public: boolean
          max_teams: number
          name: string
          playoff_start_week: number
          playoff_teams: number
          scoring_config: Json
          season: number
          updated_at: string
          waiver_type: Database["public"]["Enums"]["waiver_type"]
        }
        Insert: {
          commissioner_id: string
          created_at?: string
          draft_date?: string | null
          draft_status?: Database["public"]["Enums"]["draft_status"]
          draft_type?: string
          faab_budget?: number
          id?: string
          invite_code?: string | null
          is_public?: boolean
          max_teams?: number
          name: string
          playoff_start_week?: number
          playoff_teams?: number
          scoring_config?: Json
          season?: number
          updated_at?: string
          waiver_type?: Database["public"]["Enums"]["waiver_type"]
        }
        Update: {
          commissioner_id?: string
          created_at?: string
          draft_date?: string | null
          draft_status?: Database["public"]["Enums"]["draft_status"]
          draft_type?: string
          faab_budget?: number
          id?: string
          invite_code?: string | null
          is_public?: boolean
          max_teams?: number
          name?: string
          playoff_start_week?: number
          playoff_teams?: number
          scoring_config?: Json
          season?: number
          updated_at?: string
          waiver_type?: Database["public"]["Enums"]["waiver_type"]
        }
        Relationships: [
          { foreignKeyName: "leagues_commissioner_id_fkey"; columns: ["commissioner_id"]; referencedRelation: "profiles"; referencedColumns: ["id"] },
        ]
      }
      matchups: {
        Row: {
          away_score: number
          away_team_id: string
          created_at: string
          home_score: number
          home_team_id: string
          id: string
          is_final: boolean
          is_playoff: boolean
          league_id: string
          season: number
          updated_at: string
          week: number
        }
        Insert: {
          away_score?: number
          away_team_id: string
          created_at?: string
          home_score?: number
          home_team_id: string
          id?: string
          is_final?: boolean
          is_playoff?: boolean
          league_id: string
          season: number
          updated_at?: string
          week: number
        }
        Update: {
          away_score?: number
          away_team_id?: string
          created_at?: string
          home_score?: number
          home_team_id?: string
          id?: string
          is_final?: boolean
          is_playoff?: boolean
          league_id?: string
          season?: number
          updated_at?: string
          week?: number
        }
        Relationships: [
          { foreignKeyName: "matchups_away_team_id_fkey"; columns: ["away_team_id"]; referencedRelation: "fantasy_teams"; referencedColumns: ["id"] },
          { foreignKeyName: "matchups_home_team_id_fkey"; columns: ["home_team_id"]; referencedRelation: "fantasy_teams"; referencedColumns: ["id"] },
          { foreignKeyName: "matchups_league_id_fkey"; columns: ["league_id"]; referencedRelation: "leagues"; referencedColumns: ["id"] },
        ]
      }
      nfl_players: {
        Row: {
          age: number | null
          avg_fantasy_pts: number | null
          college: string | null
          created_at: string
          depth_chart_position: number | null
          first_name: string
          full_name: string
          id: string
          injury_note: string | null
          injury_status: Database["public"]["Enums"]["injury_status"]
          is_active: boolean
          jersey_number: number | null
          last_name: string
          nfl_team_abbr: string
          nfl_team_name: string
          photo_url: string | null
          position: Database["public"]["Enums"]["nfl_position"]
          position_group: Database["public"]["Enums"]["position_group"]
          sportradar_id: string | null
          updated_at: string
          years_pro: number | null
        }
        Insert: {
          age?: number | null
          avg_fantasy_pts?: number | null
          college?: string | null
          created_at?: string
          depth_chart_position?: number | null
          first_name: string
          full_name: string
          id?: string
          injury_note?: string | null
          injury_status?: Database["public"]["Enums"]["injury_status"]
          is_active?: boolean
          jersey_number?: number | null
          last_name: string
          nfl_team_abbr: string
          nfl_team_name: string
          photo_url?: string | null
          position: Database["public"]["Enums"]["nfl_position"]
          position_group: Database["public"]["Enums"]["position_group"]
          sportradar_id?: string | null
          updated_at?: string
          years_pro?: number | null
        }
        Update: {
          age?: number | null
          avg_fantasy_pts?: number | null
          college?: string | null
          created_at?: string
          depth_chart_position?: number | null
          first_name?: string
          full_name?: string
          id?: string
          injury_note?: string | null
          injury_status?: Database["public"]["Enums"]["injury_status"]
          is_active?: boolean
          jersey_number?: number | null
          last_name?: string
          nfl_team_abbr?: string
          nfl_team_name?: string
          photo_url?: string | null
          position?: Database["public"]["Enums"]["nfl_position"]
          position_group?: Database["public"]["Enums"]["position_group"]
          sportradar_id?: string | null
          updated_at?: string
          years_pro?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string
          email: string
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string
          email: string
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string
          email?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      roster_entries: {
        Row: {
          created_at: string
          fantasy_team_id: string
          id: string
          is_starter: boolean
          locked_at: string | null
          player_id: string
          season: number
          slot_type: Database["public"]["Enums"]["roster_slot"]
          week: number
        }
        Insert: {
          created_at?: string
          fantasy_team_id: string
          id?: string
          is_starter?: boolean
          locked_at?: string | null
          player_id: string
          season: number
          slot_type: Database["public"]["Enums"]["roster_slot"]
          week: number
        }
        Update: {
          created_at?: string
          fantasy_team_id?: string
          id?: string
          is_starter?: boolean
          locked_at?: string | null
          player_id?: string
          season?: number
          slot_type?: Database["public"]["Enums"]["roster_slot"]
          week?: number
        }
        Relationships: [
          { foreignKeyName: "roster_entries_fantasy_team_id_fkey"; columns: ["fantasy_team_id"]; referencedRelation: "fantasy_teams"; referencedColumns: ["id"] },
          { foreignKeyName: "roster_entries_player_id_fkey"; columns: ["player_id"]; referencedRelation: "nfl_players"; referencedColumns: ["id"] },
        ]
      }
      trade_assets: {
        Row: { from_team_id: string; id: string; player_id: string; to_team_id: string; trade_id: string }
        Insert: { from_team_id: string; id?: string; player_id: string; to_team_id: string; trade_id: string }
        Update: { from_team_id?: string; id?: string; player_id?: string; to_team_id?: string; trade_id?: string }
        Relationships: [
          { foreignKeyName: "trade_assets_from_team_id_fkey"; columns: ["from_team_id"]; referencedRelation: "fantasy_teams"; referencedColumns: ["id"] },
          { foreignKeyName: "trade_assets_player_id_fkey"; columns: ["player_id"]; referencedRelation: "nfl_players"; referencedColumns: ["id"] },
          { foreignKeyName: "trade_assets_to_team_id_fkey"; columns: ["to_team_id"]; referencedRelation: "fantasy_teams"; referencedColumns: ["id"] },
          { foreignKeyName: "trade_assets_trade_id_fkey"; columns: ["trade_id"]; referencedRelation: "trades"; referencedColumns: ["id"] },
        ]
      }
      trades: {
        Row: {
          id: string
          league_id: string
          notes: string | null
          processed_at: string | null
          proposed_at: string
          proposing_team_id: string
          receiving_team_id: string
          status: Database["public"]["Enums"]["trade_status"]
          veto_expires_at: string | null
        }
        Insert: {
          id?: string
          league_id: string
          notes?: string | null
          processed_at?: string | null
          proposed_at?: string
          proposing_team_id: string
          receiving_team_id: string
          status?: Database["public"]["Enums"]["trade_status"]
          veto_expires_at?: string | null
        }
        Update: {
          id?: string
          league_id?: string
          notes?: string | null
          processed_at?: string | null
          proposed_at?: string
          proposing_team_id?: string
          receiving_team_id?: string
          status?: Database["public"]["Enums"]["trade_status"]
          veto_expires_at?: string | null
        }
        Relationships: [
          { foreignKeyName: "trades_league_id_fkey"; columns: ["league_id"]; referencedRelation: "leagues"; referencedColumns: ["id"] },
          { foreignKeyName: "trades_proposing_team_id_fkey"; columns: ["proposing_team_id"]; referencedRelation: "fantasy_teams"; referencedColumns: ["id"] },
          { foreignKeyName: "trades_receiving_team_id_fkey"; columns: ["receiving_team_id"]; referencedRelation: "fantasy_teams"; referencedColumns: ["id"] },
        ]
      }
      waiver_claims: {
        Row: {
          bid_amount: number
          created_at: string
          failure_reason: string | null
          fantasy_team_id: string
          id: string
          league_id: string
          player_to_add_id: string
          player_to_drop_id: string | null
          priority: number
          process_date: string
          processed_at: string | null
          status: Database["public"]["Enums"]["waiver_status"]
        }
        Insert: {
          bid_amount?: number
          created_at?: string
          failure_reason?: string | null
          fantasy_team_id: string
          id?: string
          league_id: string
          player_to_add_id: string
          player_to_drop_id?: string | null
          priority?: number
          process_date: string
          processed_at?: string | null
          status?: Database["public"]["Enums"]["waiver_status"]
        }
        Update: {
          bid_amount?: number
          created_at?: string
          failure_reason?: string | null
          fantasy_team_id?: string
          id?: string
          league_id?: string
          player_to_add_id?: string
          player_to_drop_id?: string | null
          priority?: number
          process_date?: string
          processed_at?: string | null
          status?: Database["public"]["Enums"]["waiver_status"]
        }
        Relationships: [
          { foreignKeyName: "waiver_claims_fantasy_team_id_fkey"; columns: ["fantasy_team_id"]; referencedRelation: "fantasy_teams"; referencedColumns: ["id"] },
          { foreignKeyName: "waiver_claims_league_id_fkey"; columns: ["league_id"]; referencedRelation: "leagues"; referencedColumns: ["id"] },
          { foreignKeyName: "waiver_claims_player_to_add_id_fkey"; columns: ["player_to_add_id"]; referencedRelation: "nfl_players"; referencedColumns: ["id"] },
          { foreignKeyName: "waiver_claims_player_to_drop_id_fkey"; columns: ["player_to_drop_id"]; referencedRelation: "nfl_players"; referencedColumns: ["id"] },
        ]
      }
      weekly_stats: {
        Row: {
          assisted_tackles: number | null
          blocked_kicks: number | null
          created_at: string
          defensive_tds: number | null
          fantasy_points: number | null
          forced_fumbles: number | null
          fumble_recoveries: number | null
          fumbles_lost: number | null
          game_id: string | null
          hurries_allowed: number | null
          id: string
          interceptions: number | null
          interceptions_thrown: number | null
          is_final: boolean
          pancake_blocks: number | null
          pass_attempts: number | null
          pass_completions: number | null
          pass_deflections: number | null
          pass_tds: number | null
          pass_yards: number | null
          penalties: number | null
          penalty_yards: number | null
          pff_grade: number | null
          player_id: string
          qb_hits: number | null
          qb_hits_allowed: number | null
          qb_hurries: number | null
          rec_tds: number | null
          rec_yards: number | null
          receptions: number | null
          run_block_wins: number | null
          rush_attempts: number | null
          rush_tds: number | null
          rush_yards: number | null
          sacks: number | null
          sacks_allowed: number | null
          safeties: number | null
          season: number
          snaps_played: number | null
          solo_tackles: number | null
          tackles_for_loss: number | null
          targets: number | null
          two_pt_conversions: number | null
          updated_at: string
          week: number
        }
        Insert: {
          assisted_tackles?: number | null
          blocked_kicks?: number | null
          created_at?: string
          defensive_tds?: number | null
          fantasy_points?: number | null
          forced_fumbles?: number | null
          fumble_recoveries?: number | null
          fumbles_lost?: number | null
          game_id?: string | null
          hurries_allowed?: number | null
          id?: string
          interceptions?: number | null
          interceptions_thrown?: number | null
          is_final?: boolean
          pancake_blocks?: number | null
          pass_attempts?: number | null
          pass_completions?: number | null
          pass_deflections?: number | null
          pass_tds?: number | null
          pass_yards?: number | null
          penalties?: number | null
          penalty_yards?: number | null
          pff_grade?: number | null
          player_id: string
          qb_hits?: number | null
          qb_hits_allowed?: number | null
          qb_hurries?: number | null
          rec_tds?: number | null
          rec_yards?: number | null
          receptions?: number | null
          run_block_wins?: number | null
          rush_attempts?: number | null
          rush_tds?: number | null
          rush_yards?: number | null
          sacks?: number | null
          sacks_allowed?: number | null
          safeties?: number | null
          season: number
          snaps_played?: number | null
          solo_tackles?: number | null
          tackles_for_loss?: number | null
          targets?: number | null
          two_pt_conversions?: number | null
          updated_at?: string
          week: number
        }
        Update: {
          assisted_tackles?: number | null
          blocked_kicks?: number | null
          created_at?: string
          defensive_tds?: number | null
          fantasy_points?: number | null
          forced_fumbles?: number | null
          fumble_recoveries?: number | null
          fumbles_lost?: number | null
          game_id?: string | null
          hurries_allowed?: number | null
          id?: string
          interceptions?: number | null
          interceptions_thrown?: number | null
          is_final?: boolean
          pancake_blocks?: number | null
          pass_attempts?: number | null
          pass_completions?: number | null
          pass_deflections?: number | null
          pass_tds?: number | null
          pass_yards?: number | null
          penalties?: number | null
          penalty_yards?: number | null
          pff_grade?: number | null
          player_id?: string
          qb_hits?: number | null
          qb_hits_allowed?: number | null
          qb_hurries?: number | null
          rec_tds?: number | null
          rec_yards?: number | null
          receptions?: number | null
          run_block_wins?: number | null
          rush_attempts?: number | null
          rush_tds?: number | null
          rush_yards?: number | null
          sacks?: number | null
          sacks_allowed?: number | null
          safeties?: number | null
          season?: number
          snaps_played?: number | null
          solo_tackles?: number | null
          tackles_for_loss?: number | null
          targets?: number | null
          two_pt_conversions?: number | null
          updated_at?: string
          week?: number
        }
        Relationships: [
          { foreignKeyName: "weekly_stats_player_id_fkey"; columns: ["player_id"]; referencedRelation: "nfl_players"; referencedColumns: ["id"] },
        ]
      }
    }
    Views: { [_ in never]: never }
    Functions: {
      calculate_fantasy_points: { Args: { stats_id: string }; Returns: number }
      is_league_member: { Args: { league_id: string }; Returns: boolean }
      recalculate_matchup_score: { Args: { matchup_id: string }; Returns: undefined }
    }
    Enums: {
      draft_status: "pending" | "in_progress" | "complete"
      injury_status: "active" | "questionable" | "doubtful" | "out" | "ir" | "pup"
      nfl_position: "QB" | "RB" | "WR" | "TE" | "LT" | "LG" | "C" | "RG" | "RT" | "DE" | "DT" | "OLB" | "MLB" | "ILB" | "CB" | "S" | "FS" | "SS"
      position_group: "QB" | "RB" | "WR" | "TE" | "OL" | "DL" | "LB" | "DB"
      roster_slot: "QB" | "RB" | "WR" | "TE" | "FLEX" | "OL" | "DL" | "LB" | "DB" | "SFLEX" | "BN"
      trade_status: "pending" | "accepted" | "rejected" | "vetoed"
      waiver_status: "pending" | "processed" | "failed"
      waiver_type: "faab" | "priority"
    }
    CompositeTypes: { [_ in never]: never }
  }
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"]
export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"]
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"]
export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T]
