
  function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (var i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  const applicationServerPublicKey = 'BJAEj9QSBucrXrDb3JifjP0xEasvR5oP4Z73ukVGPVI8HftBinJRXMakAC6c4kgoe-4LIBwL_WrN7_S86UiqlX8';
  const url = 'https://oscarcode.herokuapp.com/subscribe';
  const serviceWorkerName = './sw.js';
  let swRegistration = null;
  let isSubscribed = false;

  Notification.requestPermission().then(status => {
    if (status === 'denied') {
      console.log('Notification the user has blocked notifications');
    } else if (status === 'granted') {
      console.log('Initializing wervice worker');
      initialiseServiceWorker();
    }
  });
  
function initialiseServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register(serviceWorkerName).then(handleSWRegistration);
    } else {
        console.log('Service workers aren\'t supported in this browser.');
        
    }
};

function handleSWRegistration(reg) {
    if (reg.installing) {
        console.log('Service worker installing');
    } else if (reg.waiting) {
        console.log('Service worker installed');
    } else if (reg.active) {
        console.log('Service worker active');
    }
    
    swRegistration = reg;
    
    initialiseState(reg);
}

// Once the service worker is registered set the initial state
function initialiseState(reg) {
    if (!(reg.showNotification)) {
        console.log('Notifications aren\'t supported on service workers.');   
        return;
    }
    if (!('PushManager' in window)) {
        console.log('Push messaging isn\'t supported.');   
        return;
    }
    navigator.serviceWorker.ready.then(function (reg) {
        reg.pushManager.getSubscription()
            .then(function (subscription) {
                if (!subscription) {
                    console.log('Not yet subscribed to Push');
                    isSubscribed = false;
                    subscribe();
                } else {
                  console.log('Alrady subscribed to Push');
                    isSubscribed = true; 
                }
            })
            .catch(function (err) {
                console.log('Error during getSubscription()', err);
            });
    });
}


  function subscribe() {
    navigator.serviceWorker.ready.then(reg => {
      const subscribeParams = { userVisibleOnly: true };
      const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
      subscribeParams.applicationServerKey = applicationServerKey;

      reg.pushManager.subscribe(subscribeParams).then(async subs => {
        console.log(subs);
        const endpoint = subs.endpoint;
        const key = subs.getKey('p256dh');
        const auth = subs.getKey('auth');

        const formData = new FormData();

        formData.append('notificationEndPoint', endpoint);
        formData.append('publicKey', btoa(String.fromCharCode.apply(null, new Uint8Array(key))));
        formData.append('auth', btoa(String.fromCharCode.apply(null, new Uint8Array(auth))));
        const result = await fetch(url, {
          method: 'POST', body: formData
        });
      })
    })
  }

