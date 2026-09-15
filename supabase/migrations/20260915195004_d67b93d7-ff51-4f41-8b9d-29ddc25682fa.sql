CREATE TABLE public.content_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity text NOT NULL,
  entity_id uuid NOT NULL,
  lang text NOT NULL,
  fields jsonb NOT NULL DEFAULT '{}'::jsonb,
  source_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT content_translations_entity_check CHECK (entity IN ('tour','blog_post','gallery_photo','gallery_location')),
  CONSTRAINT content_translations_lang_check CHECK (lang IN ('fr','de','it')),
  CONSTRAINT content_translations_unique UNIQUE (entity, entity_id, lang)
);

GRANT SELECT ON public.content_translations TO anon;
GRANT SELECT ON public.content_translations TO authenticated;
GRANT ALL ON public.content_translations TO service_role;

ALTER TABLE public.content_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Translations are public" ON public.content_translations
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins manage translations" ON public.content_translations
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER content_translations_touch
  BEFORE UPDATE ON public.content_translations
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();