
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  
  "public": {
          Tables: {
            "admin_users": {
                  Row: {
                    "created_at": string,"user_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"user_id": string
                  }
                  Update: {
                    "created_at"?: string,"user_id"?: string
                  }
                  Relationships: [
                    
                  ]
                },"categories": {
                  Row: {
                    "active": boolean,"created_at": string,"description": string | null,"display_order": number,"id": string,"image_url": string | null,"name": string,"slug": string,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "active"?: boolean,"created_at"?: string,"description"?: string | null,"display_order"?: number,"id"?: string,"image_url"?: string | null,"name": string,"slug": string,"updated_at"?: string
                  }
                  Update: {
                    "active"?: boolean,"created_at"?: string,"description"?: string | null,"display_order"?: number,"id"?: string,"image_url"?: string | null,"name"?: string,"slug"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    
                  ]
                },"company_settings": {
                  Row: {
                    "created_at": string,"fiscal_address": string | null,"id": string,"legal_name": string | null,"logo_url": string | null,"phone": string | null,"ruc": string | null,"singleton": boolean,"trade_name": string | null,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"fiscal_address"?: string | null,"id"?: string,"legal_name"?: string | null,"logo_url"?: string | null,"phone"?: string | null,"ruc"?: string | null,"singleton"?: boolean,"trade_name"?: string | null,"updated_at"?: string
                  }
                  Update: {
                    "created_at"?: string,"fiscal_address"?: string | null,"id"?: string,"legal_name"?: string | null,"logo_url"?: string | null,"phone"?: string | null,"ruc"?: string | null,"singleton"?: boolean,"trade_name"?: string | null,"updated_at"?: string
                  }
                  Relationships: [
                    
                  ]
                },"customers": {
                  Row: {
                    "address": string | null,"city": string | null,"created_at": string,"document_number": string | null,"email": string | null,"id": string,"name": string,"phone": string | null,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "address"?: string | null,"city"?: string | null,"created_at"?: string,"document_number"?: string | null,"email"?: string | null,"id"?: string,"name": string,"phone"?: string | null,"updated_at"?: string
                  }
                  Update: {
                    "address"?: string | null,"city"?: string | null,"created_at"?: string,"document_number"?: string | null,"email"?: string | null,"id"?: string,"name"?: string,"phone"?: string | null,"updated_at"?: string
                  }
                  Relationships: [
                    
                  ]
                },"product_images": {
                  Row: {
                    "alt_text": string | null,"created_at": string,"display_order": number,"id": string,"image_url": string,"is_primary": boolean,"product_id": string,"variant_id": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "alt_text"?: string | null,"created_at"?: string,"display_order"?: number,"id"?: string,"image_url": string,"is_primary"?: boolean,"product_id": string,"variant_id"?: string | null
                  }
                  Update: {
                    "alt_text"?: string | null,"created_at"?: string,"display_order"?: number,"id"?: string,"image_url"?: string,"is_primary"?: boolean,"product_id"?: string,"variant_id"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "product_images_product_id_fkey"
      columns: ["product_id"]
isOneToOne: false
      referencedRelation: "products"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "product_images_variant_id_fkey"
      columns: ["variant_id"]
isOneToOne: false
      referencedRelation: "product_variants"
      referencedColumns: ["id"]
    }
                  ]
                },"product_variants": {
                  Row: {
                    "attributes": NonNullable<Json>,"available": boolean,"created_at": string,"currency": string,"description": string | null,"display_order": number,"featured": boolean,"id": string,"image_url": string | null,"name": string | null,"price": number | null,"product_id": string,"sku": string,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "attributes"?: NonNullable<Json>,"available"?: boolean,"created_at"?: string,"currency"?: string,"description"?: string | null,"display_order"?: number,"featured"?: boolean,"id"?: string,"image_url"?: string | null,"name"?: string | null,"price"?: number | null,"product_id": string,"sku": string,"updated_at"?: string
                  }
                  Update: {
                    "attributes"?: NonNullable<Json>,"available"?: boolean,"created_at"?: string,"currency"?: string,"description"?: string | null,"display_order"?: number,"featured"?: boolean,"id"?: string,"image_url"?: string | null,"name"?: string | null,"price"?: number | null,"product_id"?: string,"sku"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "product_variants_product_id_fkey"
      columns: ["product_id"]
isOneToOne: false
      referencedRelation: "products"
      referencedColumns: ["id"]
    }
                  ]
                },"products": {
                  Row: {
                    "available": boolean,"category_id": string,"created_at": string,"currency": string,"description": string | null,"display_order": number,"featured": boolean,"id": string,"image_url": string | null,"name": string,"price": number | null,"product_code": string | null,"slug": string,"subcategory_id": string | null,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "available"?: boolean,"category_id": string,"created_at"?: string,"currency"?: string,"description"?: string | null,"display_order"?: number,"featured"?: boolean,"id"?: string,"image_url"?: string | null,"name": string,"price"?: number | null,"product_code"?: string | null,"slug": string,"subcategory_id"?: string | null,"updated_at"?: string
                  }
                  Update: {
                    "available"?: boolean,"category_id"?: string,"created_at"?: string,"currency"?: string,"description"?: string | null,"display_order"?: number,"featured"?: boolean,"id"?: string,"image_url"?: string | null,"name"?: string,"price"?: number | null,"product_code"?: string | null,"slug"?: string,"subcategory_id"?: string | null,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "products_category_id_fkey"
      columns: ["category_id"]
isOneToOne: false
      referencedRelation: "categories"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "products_subcategory_id_fkey"
      columns: ["subcategory_id"]
isOneToOne: false
      referencedRelation: "subcategories"
      referencedColumns: ["id"]
    }
                  ]
                },"quote_items": {
                  Row: {
                    "created_at": string,"currency": string,"discount_amount": number,"discount_type": string,"discount_value": number,"id": string,"line_subtotal": number,"line_total": number,"product_code": string | null,"product_id": string | null,"product_name": string,"quantity": number,"quote_id": string,"unit_price": number,"variant_id": string | null,"variant_name": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"currency"?: string,"discount_amount"?: number,"discount_type"?: string,"discount_value"?: number,"id"?: string,"line_subtotal"?: number,"line_total"?: number,"product_code"?: string | null,"product_id"?: string | null,"product_name": string,"quantity": number,"quote_id": string,"unit_price": number,"variant_id"?: string | null,"variant_name"?: string | null
                  }
                  Update: {
                    "created_at"?: string,"currency"?: string,"discount_amount"?: number,"discount_type"?: string,"discount_value"?: number,"id"?: string,"line_subtotal"?: number,"line_total"?: number,"product_code"?: string | null,"product_id"?: string | null,"product_name"?: string,"quantity"?: number,"quote_id"?: string,"unit_price"?: number,"variant_id"?: string | null,"variant_name"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "quote_items_product_id_fkey"
      columns: ["product_id"]
isOneToOne: false
      referencedRelation: "products"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "quote_items_quote_id_fkey"
      columns: ["quote_id"]
isOneToOne: false
      referencedRelation: "quotes"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "quote_items_variant_id_fkey"
      columns: ["variant_id"]
isOneToOne: false
      referencedRelation: "product_variants"
      referencedColumns: ["id"]
    }
                  ]
                },"quotes": {
                  Row: {
                    "created_at": string,"currency": string,"customer_address": string | null,"customer_city": string | null,"customer_document_number": string | null,"customer_email": string | null,"customer_id": string,"customer_name": string | null,"customer_phone": string | null,"general_discount_amount": number,"general_discount_type": string,"general_discount_value": number,"id": string,"igv_amount": number,"igv_rate": number,"issue_date": string,"item_discount_total": number,"observations": string | null,"quote_number": string,"seller_name": string,"status": string,"subtotal": number,"taxable_base": number,"total": number,"updated_at": string,"valid_until": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"currency"?: string,"customer_address"?: string | null,"customer_city"?: string | null,"customer_document_number"?: string | null,"customer_email"?: string | null,"customer_id": string,"customer_name"?: string | null,"customer_phone"?: string | null,"general_discount_amount"?: number,"general_discount_type"?: string,"general_discount_value"?: number,"id"?: string,"igv_amount"?: number,"igv_rate"?: number,"issue_date"?: string,"item_discount_total"?: number,"observations"?: string | null,"quote_number": string,"seller_name": string,"status"?: string,"subtotal"?: number,"taxable_base"?: number,"total"?: number,"updated_at"?: string,"valid_until"?: string
                  }
                  Update: {
                    "created_at"?: string,"currency"?: string,"customer_address"?: string | null,"customer_city"?: string | null,"customer_document_number"?: string | null,"customer_email"?: string | null,"customer_id"?: string,"customer_name"?: string | null,"customer_phone"?: string | null,"general_discount_amount"?: number,"general_discount_type"?: string,"general_discount_value"?: number,"id"?: string,"igv_amount"?: number,"igv_rate"?: number,"issue_date"?: string,"item_discount_total"?: number,"observations"?: string | null,"quote_number"?: string,"seller_name"?: string,"status"?: string,"subtotal"?: number,"taxable_base"?: number,"total"?: number,"updated_at"?: string,"valid_until"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "quotes_customer_id_fkey"
      columns: ["customer_id"]
isOneToOne: false
      referencedRelation: "customers"
      referencedColumns: ["id"]
    }
                  ]
                },"site_settings": {
                  Row: {
                    "created_at": string,"email": string | null,"facebook": string | null,"id": string,"instagram": string | null,"updated_at": string,"whatsapp_message": string | null,"whatsapp_number": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"email"?: string | null,"facebook"?: string | null,"id"?: string,"instagram"?: string | null,"updated_at"?: string,"whatsapp_message"?: string | null,"whatsapp_number"?: string | null
                  }
                  Update: {
                    "created_at"?: string,"email"?: string | null,"facebook"?: string | null,"id"?: string,"instagram"?: string | null,"updated_at"?: string,"whatsapp_message"?: string | null,"whatsapp_number"?: string | null
                  }
                  Relationships: [
                    
                  ]
                },"subcategories": {
                  Row: {
                    "active": boolean,"category_id": string,"created_at": string,"description": string | null,"display_order": number,"id": string,"image_url": string | null,"name": string,"slug": string,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "active"?: boolean,"category_id": string,"created_at"?: string,"description"?: string | null,"display_order"?: number,"id"?: string,"image_url"?: string | null,"name": string,"slug": string,"updated_at"?: string
                  }
                  Update: {
                    "active"?: boolean,"category_id"?: string,"created_at"?: string,"description"?: string | null,"display_order"?: number,"id"?: string,"image_url"?: string | null,"name"?: string,"slug"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "subcategories_category_id_fkey"
      columns: ["category_id"]
isOneToOne: false
      referencedRelation: "categories"
      referencedColumns: ["id"]
    }
                  ]
                }
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "is_admin":
{ Args: Record<PropertyKey, never>; Returns: boolean
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

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  "public": {
          Enums: {
            
          }
        }
} as const
