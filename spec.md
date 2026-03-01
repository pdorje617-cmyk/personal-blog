# Personal Blog

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- A blog where the owner can create, edit, and delete posts
- Public reader view: anyone can browse and read posts without logging in
- Post fields: title, body (rich text or markdown), optional tags, published date
- Owner admin panel protected by a simple hardcoded passphrase (no full auth system needed, owner-only posting)
- Homepage listing all posts sorted by newest first with title, date, and short excerpt
- Individual post detail page
- Sample seed posts to demonstrate the blog

### Modify
- Nothing (new project)

### Remove
- Nothing (new project)

## Implementation Plan
1. Backend (Motoko):
   - Data model: Post { id, title, body, tags, createdAt, updatedAt }
   - Public queries: getAllPosts, getPost(id)
   - Admin updates: createPost, updatePost, deletePost — protected by caller being the canister controller (owner)
   - Seed a few sample posts on first deploy

2. Frontend (React):
   - Public homepage: post list with title, date excerpt cards
   - Public post detail page
   - Admin "write" page behind a simple client-side passphrase gate (passphrase stored in environment / hardcoded)
   - Post editor form (title, body, tags)
   - Navigation bar with blog name and optional admin link
