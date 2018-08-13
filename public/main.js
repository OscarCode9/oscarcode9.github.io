
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
      await fetch(url, {
        method: 'POST', body: formData
      });
    })
  })
}


$(document).ready(() => {

  $('#encryptFileInput').val('')
  $('#dencryptFileInput').val('')
  

  const darkThema = 'DARK';
  const lightThema = 'LIGHT';

  const themaType = JSON.parse(localStorage.getItem('theme'));
  if (!(themaType === null)) {
    switch (themaType.type) {
      case darkThema:
        changeTemaDark();
        break;
      case lightThema:
        changeTemaLight();
        break;
      default:
        break;
    }
  } else {
    changeTemaLight();

  }




  $("#changeThema").click(e => {

    const themaObject = {
      'type': 'DARK'
    };

    localStorage.setItem('theme', JSON.stringify(themaObject));
    changeTemaDark();

  });

  $('#changeThemalight').click(e => {

    const themaObject = {
      'type': 'LIGHT'
    };

    localStorage.setItem('theme', JSON.stringify(themaObject));
    changeTemaLight();

  })


  function changeTemaDark() {

    const styleObject = {
      background: "black",
      color: "white"
    }

    $('body').css(styleObject);
    $(".darkTema").css(styleObject);
    $("#changeThema").hide();
    $('#changeThemalight').show();

  }

  function changeTemaLight() {

    const styleObject = {
      background: "white",
      color: "black"
    }

    $('body').css(styleObject);
    $(".darkTema").css(styleObject);
    $("#changeThema").show();
    $('#changeThemalight').hide();

  }

  //encryptData functionality

  $('.btnencryptSendFile').click(async e => {
    e.preventDefault();
    const formEncrypt = $('#encryptFile')[0]; // You need to use standard javascript object here


    const form = new FormData(formEncrypt);


    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "/api/updateFile",
      "method": "POST",
      "headers": {
        "Cache-Control": "no-cache",
        "Postman-Token": "a7602c0e-4d1f-41f2-bece-da578abfabe3"
      },
      "processData": false,
      "contentType": false,
      "mimeType": "multipart/form-data",
      "data": form
    }

    $.ajax(settings).done(function (response) {

      console.log(response);

      const result =JSON.parse(response);
      console.log(result);
      const fileName = result.fileName;
      window.location.href = '/api/download/'+ fileName;
      

    }).fail(error=> {
      const result =JSON.parse(error.responseText);
      $('#encryptFileError').text(result.message);
      $('#encryptFileError').css({
        color: "red"
      });
    });
    



  });

  $('#sendFileDencrypt').click(async e => {
    e.preventDefault();
    const formEncrypt = $('#dencryptFile')[0]; // You need to use standard javascript object here


    const form = new FormData(formEncrypt);


    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "/api/decryptFile",
      "method": "POST",
      "headers": {
        "Cache-Control": "no-cache",
        "Postman-Token": "a7602c0e-4d1f-41f2-bece-da578abfabe3"
      },
      "processData": false,
      "contentType": false,
      "mimeType": "multipart/form-data",
      "data": form
    }

    $.ajax(settings).done(function (response) {

      console.log(response);

      const result =JSON.parse(response);
      console.log(result);

      const fileName = result.fileName;
      window.location.href = '/api/download/'+ fileName;
      

    }).fail(error=> {
      const result =JSON.parse(error.responseText);
      $('#dencryptFileError').text(result.message);
      $('#dencryptFileError').css({
        color: "red"
      });
    });

  })

  $('#inputEncryptFile').change(function() {
    let filename = $('#inputEncryptFile').val();
    filename = ilename = filename.substring(12);

    $('.btnencrypt').text(filename);
  });

  $('#inputDencryptFile').change(function() {

    let filename = $('#inputDencryptFile').val();
    filename = ilename = filename.substring(12);

    $('.btndencrypt').text(filename);
  });

  

});



