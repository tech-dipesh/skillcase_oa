create table users (
    id serial primary key,
    name varchar(100) not null,
    email varchar(255) unique not null,
    password varchar(255) not null,
    created_at timestamp default current_timestamp
);

create table videos (
    id serial primary key,
    user_id integer not null references users(id) on delete cascade,
    title varchar(255) not null,
    description text,
    category varchar(100) not null,
    file_path varchar(500) not null,
    like_count integer default 0,
    created_at timestamp default current_timestamp
);

create index idx_videos_category on videos(category);

create table likes (
    user_id integer not null references users(id) on delete cascade,
    video_id integer not null references videos(id) on delete cascade,
    primary key (user_id, video_id)
);

create table comments (
    id serial primary key,
    user_id integer not null references users(id) on delete cascade,
    video_id integer not null references videos(id) on delete cascade,
    content text not null,
    created_at timestamp default current_timestamp
);

create table bookmarks (
    user_id integer not null references users(id) on delete cascade,
    video_id integer not null references videos(id) on delete cascade,
    primary key (user_id, video_id)
);
