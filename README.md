## INF6653GVA - Back-end Development I
# Steven Burris
# 4/20/2024
# *Final Project - Kay's Crochet React Native Expo iOS and Android App*
# *Kay's Crochet app uses Express server with Heroku and Mongodb database for the backend, Bcrypt to hash the admin passwords, and Expo push notifications*

# Github url: 
[Gituhb](https://github.com/stevenburris1978/kayscrochetReactNativeExpressMongo)
### This code can be deployed locally with Expo Go or through iOS App Stores and Google Play Stores

# Domain url for Home Screen's webview of my Python XAMPP Heroku PWA (progressive web app)
[Kayscrochet](https://www.kayscrochet.us)

# *With this app Users can login or register in the app's webview of the website; and admin can send Expo push notifications to iOS and Android devices*
### Admin can send push notifications to iOS and Android devices with the new item's description while adding the notification with images of the new items to the app's Notifications Screen. Admin can also edit the descriptions of notifications and delete notifications.

### Android and iOS users can see Kay's Crochet webview at the Home Screen to buy, preorder, and like Kay's crocheted items, receive iOS and Android push notifications, and view the Contact, Policy, and Notifications screens of the drawer menu navigator.

# *Kay's Crochet mobile app install and setup instructions*
## Install Kay's Crochet mobile app by searching for Kay's Crochet in the iOS App Store and Android App Store.

## Kay's Crochet opens with the Expo Go app

### These environment variables to to be set up in the Express server that is using Heroku with Mongodb database backend.
MONGODB_URI=
JWT_SECRET=
AWS_SECRET_ACCESS_KEY=
AWS_ACCESS_KEY_ID=
S3_BUCKET_NAME=
FIREBASE_SERVICE_ACCOUNT_PATH=

## *Kay's Crochet files needed*
### Kay's Crochet needs the google-services.json file from Firebase Cloud Messaging for Android devices and iOS devices need the APNs key for expo push notifications to work.

### Kay's crochet needs a createAdmin.js file to add the admin usernames and hashed passwords with Bcrypt into the Mongodb database.
