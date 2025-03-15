
#!/bin/bash
# This script builds and deploys your app to Firebase

# Build the app
echo "Building the application..."
npm run build

# Deploy to Firebase
echo "Deploying to Firebase..."
firebase deploy --only hosting

echo "Deployment complete! Your app should be available at https://match-memory-game.web.app"
