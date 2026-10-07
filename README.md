# Project Princess

A browser-based Phaser pet adventure, with a **local Developer Studio**. The game
can be built and hosted independently of Replit. This repository is a pnpm
workspace: keep the root configuration, lockfile, `artifacts/`, `lib/` and
`scripts/` together, and run the commands below from the repository root.

## Run the game and Studio on your computer

Install **Node.js 22.12 or newer** (Node 22 LTS recommended) and **pnpm 10.26.1**.
On an existing Node installation you can install pnpm with:

```sh
npm install --global pnpm@10.26.1
git clone https://github.com/YOUR-ACCOUNT/YOUR-REPOSITORY.git
cd YOUR-REPOSITORY
pnpm install --frozen-lockfile
pnpm --filter @workspace/project-princess run dev
```

Open **http://127.0.0.1:5173/** for the game or
**http://127.0.0.1:5173/studio/** for the Studio. No Replit account, API server,
database, GitHub token or environment secrets are needed for this game.
Local startup binds to your computer only. Keep the Studio local: do not expose
the Vite development server as a public website.

In Replit, use the existing managed game workflow and its preview URL instead.
Replit-provided `PORT` and `BASE_PATH` settings continue to work.

## Build a standalone release

```sh
pnpm --filter @workspace/project-princess run build
pnpm --filter @workspace/project-princess run check:build
pnpm --filter @workspace/project-princess run serve
```

Upload **only `artifacts/project-princess/dist/public/`** to a static host.
It contains the game, compiled authored content, sprites, audio and web manifest;
it does not contain the Studio or its editing API. The game does not require a
server-side application or Replit services after publication.

The default base path is `/`. For a site served below a repository path, build
with that prefix. For example:

```sh
# macOS/Linux
BASE_PATH=/YOUR-REPOSITORY/ pnpm --filter @workspace/project-princess run build
```

```powershell
# Windows PowerShell
$env:BASE_PATH = "/YOUR-REPOSITORY/"
pnpm --filter @workspace/project-princess run build
Remove-Item Env:BASE_PATH
```

Use `/` for a custom domain or an account-level `YOUR-ACCOUNT.github.io` site.
Do not run the root `pnpm run build` just to publish the game: that command also
builds unrelated workspace services.

## Publish from GitHub Pages

The workflow is `.github/workflows/project-princess-pages.yml`. Once the source
is in your GitHub repository:

1. Open the repository's **Settings → Pages** and set **Source → GitHub Actions**.
2. Check that your desired release branch is the repository's default branch
   (usually `main`). Only that branch publishes.
3. Push a commit to that branch, or open **Actions → Publish Project Princess →
   Run workflow** and choose the default branch.
4. Watch the build and deploy jobs. The `github-pages` deployment links to the
   published game. If your environment requires approval, approve that deployment.

The workflow reads the site's address from GitHub Pages and automatically uses
the correct base path. It installs from the frozen lockfile, runs the game and
hosting checks, builds the game, verifies the release, and uploads **only**
`dist/public/`. Publishing uses GitHub's short-lived workflow token; no personal
access token needs to be added to the game, Studio or repository.

### Getting this workspace into your existing repository

This setup does not connect accounts or push anything automatically. Use GitHub
Desktop or your normal authenticated Git client. If the target repository already
has an older version of the game, clone that repository and copy the updated
workspace source into the checkout, preserving its `.git` directory and history.
Review the changes and make a normal commit and push—**do not force-push or
replace an existing repository's history**.

Include the root package/configuration files, the lockfile, this guide, the Pages
workflow, the workspace packages and their source/assets. Do not copy dependencies,
build output, temporary directories, credentials, logs or private uploads.
Review the staged files before committing. Keep Replit configuration if you also
want to continue using Replit; GitHub Pages does not depend on it.

### Connect your own domain

1. In **Settings → Pages**, set and save your custom domain.
2. At your DNS provider, configure the domain using
   [GitHub's custom-domain instructions](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).
   A subdomain such as `play.example.com` uses a CNAME to `YOUR-ACCOUNT.github.io`,
   **not** a repository URL or path. Follow the current instructions for apex domains.
3. Verify domain ownership where available and enable **Enforce HTTPS** once
   GitHub has issued the certificate. Avoid wildcard DNS entries.
4. Run the workflow again after changing the Pages domain. It will rebuild at `/`
   rather than the repository prefix. Merely changing DNS does not rebuild the game.

With the Actions publishing method, the custom domain is configured in GitHub
Pages settings; you do not need to invent or commit a `CNAME` file yourself.
Connecting the account, enabling Pages and changing DNS remain actions for you
to perform.

## Edit → save → commit → publish

1. Run the local Studio and use **Save to project**.
2. Review and commit `artifacts/project-princess/game/src/authoring/overrides.json`.
   Also commit any supplied artwork you added under the game's assets directory.
   **Export edits** is a backup download; it does not update GitHub by itself.
3. Push to the default branch. GitHub Actions builds the saved content into the
   public game. All players receive it after the deployment and a reload.

Drafts that you have not saved are not part of a release. Save and export drafts
before switching checkouts, pulling other edits or closing your Studio.
Once the source is on GitHub, your Pages game stays available without Replit.
You can keep authoring in Replit or continue from a local clone.

## Public repository and player saves

In a public repository, anyone can read and copy the source, authored game
content, original artwork and audio. Published browser-game assets are also
downloadable even if the source repository is private. Only commit content you
intend to make public. Never commit passwords, tokens, `.env` files, private
uploads or personal save backups. The Studio does not store GitHub credentials.

Player progress lives in each player's browser storage, not in this repository.
Changing from a Replit domain to a GitHub Pages/custom domain does **not** transfer
existing save slots. They remain on the old origin; the new domain initially has
separate saves. This setup does not add cloud saves or a cross-domain migration.
For a deliberate manual transfer, the existing Pawphone menu has **Copy save
code** and a save-code loading control. Copy the code on the old domain and
load it on the new domain; loading a code replaces the currently selected slot,
so keep a backup first.

## Checks

```sh
pnpm --filter @workspace/project-princess run test:site-config
pnpm --filter @workspace/project-princess run test:navigation
pnpm --filter @workspace/project-princess run test:studio-art
pnpm --filter @workspace/project-princess run check:build
```

For the browser smoke check, install Playwright's Chromium once, then run:

```sh
pnpm --filter @workspace/project-princess exec playwright install chromium
pnpm --filter @workspace/project-princess run smoke:build
```

On Linux, Playwright may also need its documented system dependencies. The smoke
check serves the built files without Vite or a fallback server, tests the path
embedded in the release, and verifies the title, a map, save/reload and sprites.
It uses Replit's Chromium automatically when that executable is available.
