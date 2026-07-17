-- Boards
create table if not exists boards (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Board Members
create table if not exists board_members (
  board_id uuid not null references boards(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner', 'editor', 'viewer')),
  primary key (board_id, user_id)
);

-- Columns
create table if not exists columns (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references boards(id) on delete cascade,
  title text not null,
  position real not null,
  created_at timestamptz not null default now()
);

-- Cards
create table if not exists cards (
  id uuid primary key default gen_random_uuid(),
  column_id uuid not null references columns(id) on delete cascade,
  title text not null,
  description text,
  position real not null,
  due_date timestamptz,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Tags
create table if not exists tags (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references boards(id) on delete cascade,
  name text not null,
  color text not null default '#6366f1'
);

-- Card <-> Tag M2M
create table if not exists card_tags (
  card_id uuid not null references cards(id) on delete cascade,
  tag_id uuid not null references tags(id) on delete cascade,
  primary key (card_id, tag_id)
);

-- Card Assignees
create table if not exists card_assignees (
  card_id uuid not null references cards(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  primary key (card_id, user_id)
);

-- Indexes
create index if not exists idx_columns_board_id on columns(board_id);
create index if not exists idx_columns_position on columns(board_id, position);
create index if not exists idx_cards_column_id on cards(column_id);
create index if not exists idx_cards_position on cards(column_id, position);
create index if not exists idx_tags_board_id on tags(board_id);
create index if not exists idx_board_members_user_id on board_members(user_id);
create index if not exists idx_card_assignees_user_id on card_assignees(user_id);

-- Enable RLS
alter table boards enable row level security;
alter table board_members enable row level security;
alter table columns enable row level security;
alter table cards enable row level security;
alter table tags enable row level security;
alter table card_tags enable row level security;
alter table card_assignees enable row level security;

-- RLS Policies

-- Boards: owner can do all, members can read
create policy "Users can create boards"
  on boards for insert
  with check (auth.uid() = created_by);

create policy "Board owners can update their boards"
  on boards for update
  using (auth.uid() = created_by);

create policy "Board owners can delete their boards"
  on boards for delete
  using (auth.uid() = created_by);

create policy "Members can view boards"
  on boards for select
  using (
    auth.uid() = created_by
    or auth.uid() in (
      select user_id from board_members where board_id = id
    )
  );

-- Board Members
create policy "Board owners can manage members"
  on board_members for insert
  with check (
    auth.uid() in (
      select created_by from boards where id = board_id
    )
  );

create policy "Board owners can update members"
  on board_members for update
  using (
    auth.uid() in (
      select created_by from boards where id = board_id
    )
  );

create policy "Board owners can delete members"
  on board_members for delete
  using (
    auth.uid() in (
      select created_by from boards where id = board_id
    )
  );

create policy "Members can view board members"
  on board_members for select
  using (
    auth.uid() in (
      select user_id from board_members where board_id = board_members.board_id
    )
    or auth.uid() in (
      select created_by from boards where id = board_members.board_id
    )
  );

-- Columns: members can CRUD
create policy "Members can create columns"
  on columns for insert
  with check (
    auth.uid() in (
      select created_by from boards where id = board_id
      union
      select user_id from board_members where board_id = board_id and role in ('owner', 'editor')
    )
  );

create policy "Members can view columns"
  on columns for select
  using (
    board_id in (
      select id from boards where created_by = auth.uid()
      union
      select board_id from board_members where user_id = auth.uid()
    )
  );

create policy "Editors can update columns"
  on columns for update
  using (
    auth.uid() in (
      select created_by from boards where id = board_id
      union
      select user_id from board_members where board_id = board_id and role in ('owner', 'editor')
    )
  );

create policy "Editors can delete columns"
  on columns for delete
  using (
    auth.uid() in (
      select created_by from boards where id = board_id
      union
      select user_id from board_members where board_id = board_id and role in ('owner', 'editor')
    )
  );

-- Cards: same pattern as columns
create policy "Members can create cards"
  on cards for insert
  with check (
    auth.uid() in (
      select created_by from boards where id = (
        select board_id from columns where id = column_id
      )
      union
      select user_id from board_members where board_id = (
        select board_id from columns where id = column_id
      ) and role in ('owner', 'editor')
    )
  );

create policy "Members can view cards"
  on cards for select
  using (
    column_id in (
      select id from columns where board_id in (
        select id from boards where created_by = auth.uid()
        union
        select board_id from board_members where user_id = auth.uid()
      )
    )
  );

create policy "Editors can update cards"
  on cards for update
  using (
    auth.uid() in (
      select created_by from boards where id = (
        select board_id from columns where id = column_id
      )
      union
      select user_id from board_members where board_id = (
        select board_id from columns where id = column_id
      ) and role in ('owner', 'editor')
    )
  );

create policy "Editors can delete cards"
  on cards for delete
  using (
    auth.uid() in (
      select created_by from boards where id = (
        select board_id from columns where id = column_id
      )
      union
      select user_id from board_members where board_id = (
        select board_id from columns where id = column_id
      ) and role in ('owner', 'editor')
    )
  );

-- Tags
create policy "Members can create tags"
  on tags for insert
  with check (
    auth.uid() in (
      select created_by from boards where id = board_id
      union
      select user_id from board_members where board_id = board_id and role in ('owner', 'editor')
    )
  );

create policy "Members can view tags"
  on tags for select
  using (
    board_id in (
      select id from boards where created_by = auth.uid()
      union
      select board_id from board_members where user_id = auth.uid()
    )
  );

create policy "Editors can update tags"
  on tags for update
  using (
    auth.uid() in (
      select created_by from boards where id = board_id
      union
      select user_id from board_members where board_id = board_id and role in ('owner', 'editor')
    )
  );

create policy "Editors can delete tags"
  on tags for delete
  using (
    auth.uid() in (
      select created_by from boards where id = board_id
      union
      select user_id from board_members where board_id = board_id and role in ('owner', 'editor')
    )
  );

-- Card Tags
create policy "Editors can manage card tags"
  on card_tags for insert
  with check (
    exists (
      select 1 from cards c
      join columns col on col.id = c.column_id
      join boards b on b.id = col.board_id
      where c.id = card_id
      and (b.created_by = auth.uid()
        or exists (
          select 1 from board_members bm
          where bm.board_id = b.id and bm.user_id = auth.uid()
          and bm.role in ('owner', 'editor')
        ))
    )
  );

create policy "Members can view card tags"
  on card_tags for select
  using (true);

create policy "Editors can delete card tags"
  on card_tags for delete
  using (
    exists (
      select 1 from cards c
      join columns col on col.id = c.column_id
      join boards b on b.id = col.board_id
      where c.id = card_id
      and (b.created_by = auth.uid()
        or exists (
          select 1 from board_members bm
          where bm.board_id = b.id and bm.user_id = auth.uid()
          and bm.role in ('owner', 'editor')
        ))
    )
  );

-- Card Assignees
create policy "Editors can manage assignees"
  on card_assignees for insert
  with check (
    exists (
      select 1 from cards c
      join columns col on col.id = c.column_id
      join boards b on b.id = col.board_id
      where c.id = card_id
      and (b.created_by = auth.uid()
        or exists (
          select 1 from board_members bm
          where bm.board_id = b.id and bm.user_id = auth.uid()
          and bm.role in ('owner', 'editor')
        ))
    )
  );

create policy "Members can view assignees"
  on card_assignees for select
  using (true);

create policy "Editors can delete assignees"
  on card_assignees for delete
  using (
    exists (
      select 1 from cards c
      join columns col on col.id = c.column_id
      join boards b on b.id = col.board_id
      where c.id = card_id
      and (b.created_by = auth.uid()
        or exists (
          select 1 from board_members bm
          where bm.board_id = b.id and bm.user_id = auth.uid()
          and bm.role in ('owner', 'editor')
        ))
    )
  );

-- Auto-update updated_at trigger
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_boards_updated_at
  before update on boards
  for each row execute function update_updated_at();

create trigger update_cards_updated_at
  before update on cards
  for each row execute function update_updated_at();
