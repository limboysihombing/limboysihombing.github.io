let webPush = require('web-push');
 
const vapidKeys = {
   "publicKey": "BMsmQg_2IBZ64jsdBTaKBoBFThuwJP4-K2n1VsLA1RKv9kmIzAtSvd46DE8aikz-h6HdM4AJ18xg6E388URloHI",
   "privateKey": "lbkFYOoJqmuuCfOu23A5XPIJXuZRWeRkTOMtLfBJXNc"
};
 
 
webPush.setVapidDetails(
   'mailto:limboysihombing@gmail.com',
   vapidKeys.publicKey,
   vapidKeys.privateKey
)
const pushSubscription = {
   "endpoint": "https://fcm.googleapis.com/fcm/send/eRsDHSnriqA:APA91bFlqeHb7Vbqc3Wyj7Vm7BF3XAITONIOEoU-72d7Cub-I9Vdpizr1M6ocsB6VwlVS8L5YpIV087WD_aTsw5B4qgy8HjPESzskJ4M4i7G809DjlsEi3zi96l7dvKT_YDRSBHjN6mS",
   "keys": {
       "p256dh": "BILlvUVx/9SoZzqTTBaSaXPPu8mW5NbcZ99YCA8K7Slc9tP/gHoOYiJEeyL1uDdqnjp3OVaCx5ri99N+kF291T0=",
       "auth": "fM4tcWpchIdRMT86S5D+sw=="
   }
};
const payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';
 
const options = {
   gcmAPIKey: '549791810811',
   TTL: 60
};
webPush.sendNotification(
   pushSubscription,
   payload,
   options
);