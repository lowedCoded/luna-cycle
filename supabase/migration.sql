-- Таблицы для Luna cycle tracker

CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Таблицы для данных пользователя (JSONB для гибкости)

CREATE TABLE IF NOT EXISTS user_cycles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  data JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE user_cycles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cycles"
  ON user_cycles FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cycles"
  ON user_cycles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cycles"
  ON user_cycles FOR UPDATE USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS user_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  data JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE user_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own entries"
  ON user_entries FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own entries"
  ON user_entries FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own entries"
  ON user_entries FOR UPDATE USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS user_habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  data JSONB NOT NULL DEFAULT '{"habits":[],"logs":[]}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE user_habits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own habits"
  ON user_habits FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own habits"
  ON user_habits FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own habits"
  ON user_habits FOR UPDATE USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS user_medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  data JSONB NOT NULL DEFAULT '{"medications":[],"logs":[]}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE user_medications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own medications"
  ON user_medications FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own medications"
  ON user_medications FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own medications"
  ON user_medications FOR UPDATE USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own settings"
  ON user_settings FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings"
  ON user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
  ON user_settings FOR UPDATE USING (auth.uid() = user_id);

-- Автоматическое создание профиля при регистрации
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, nickname)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'nickname');
  INSERT INTO public.user_settings (user_id, data)
  VALUES (NEW.id, '{"theme":"romantic","lang":"ru","averageCycleLength":28,"averagePeriodLength":5,"lastPeriodStart":null}'::jsonb);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();