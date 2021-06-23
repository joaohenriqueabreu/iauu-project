echo "Starting dev environment..."

docker container start e243
npm run dev --prefix ./api/platform &
npm run dev --prefix ./api/proxy &
npm run dev --prefix ./api/mail &
npm run dev --prefix ./api/chat &
npm run dev --prefix ./api/notification &
npm run dev --prefix ./web &

echo "Dev environment started..."