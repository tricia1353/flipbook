export type CreationMode = "upload_video" | "ai_generated_video";

export type UploadVideoAiMode = "background_replace" | "video_stylize";

export type AssetType =
  | "source_video"
  | "reference_image"
  | "reference_video"
  | "ai_video"
  | "extracted_frame"
  | "print_pdf"
  | "template_cover";

export type OrderStatus =
  | "submitted"
  | "ai_processing"
  | "awaiting_review"
  | "contacted"
  | "paid"
  | "in_production"
  | "shipped"
  | "cancelled";

export type AiJobType =
  | "background_replace"
  | "video_stylize"
  | "image_to_video"
  | "reference_to_video";

export type AiJobStatus =
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "cancelled";

export type PrintJobStatus =
  | "queued"
  | "extracting_frames"
  | "generating_pdf"
  | "completed"
  | "failed";

export type TemplateCategory =
  | "change_world"
  | "movie_style"
  | "fantasy_story";

export type PromptFieldKey = "subject" | "scene" | "mood" | "style" | "blessing";

