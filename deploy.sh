echo "Removing old bot containers and images if there are any"
docker stop solita-rl-bot 2> /dev/null && docker rm solita-rl-bot 2> /dev/null

if [[ -f .env ]]; then
    echo "Building an image"
    docker build -t solita/rl-bot:1.0.0 .

    echo "Starting the bot"
    docker run --env-file .env --restart always --name solita-rl-bot -t solita/rl-bot:1.0.0



else
    echo "Error! .env file not found"
    exit 2

fi