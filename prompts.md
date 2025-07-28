npx create-next-app -e with-supabase
cd PROJECT-NAME
npx supabase init
https://database.new/ 
cp .env.example .env
nano .env # Connecting to your new project

cp .roo/rules # include next-js + supabase migration rules

/code
Remove hero, deploy-buttons and all company logos and images.

/orch
plan and build all datamodels and pages from @prd.md

/code
Ensure you enable realtime in Database Publications for required tables via migration file

double-check in supabase studio if "realtime" is active per table

If migrations are created: 
supabase link --project-ref twfmjcyqntuygdjkdbsl
supabase migration list

Insert Jokes into Table

Add a simple way to check if one has already voted for the current joke, to disable voting several times for the same joke.

Follow-up:
- Als Admin neue Witze einpflegen können
- Als Admin alle Witze sehen und einzelne direkt aktiv schalten
