
    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v2.10&appId=1892280774382480";
      fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

  window.fbAsyncInit = function () {
      var appId = '1400201486768599';
      FB.init({
          appId: appId,
          xfbml: true,
          version: 'v2.1'
      });
  };

  var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};


  $('#fb_share_btn').on('click', function (event) {

          event.preventDefault();
          event.stopPropagation();
          event.stopImmediatePropagation();

              // Dynamically gather and set the FB share data. 
              var FBDesc      = String(getUrlParameter('desc'));
              var FBTitle     = String(getUrlParameter('titulo'));
              var FBLink      = window.location.href;
              var FBPic       = String(getUrlParameter('urlImg'));

              // Open FB share popup
              FB.ui({
                  method: 'share_open_graph',
                  action_type: 'og.shares',
                  action_properties: JSON.stringify({
                      object: {
                          'og:url': FBLink,
                          'og:title': FBTitle,
                          'og:description': FBDesc,
                          'og:image': FBPic
                      }
                  })
              },
              function (response) {
                  Materialize.toast('Gracias por comparti ', 3000)
              // Action after response
              })
      })

  var socket;

  console.log(window.location.hostname);
  if (window.location.hostname === 'oscarcode.herokuapp.com') {
      socket = io.connect(window.location.hostname, { 'forceNew': true });
  } else {
      socket = io.connect('http://localhost:3000', { 'forceNew': true });
  }
  

  var numCom = Number($('#numComentarios').val());
  $('#numComentarios').hide();
  var idPost = getUrlParameter('tagR');
  
  var numLikesHelp = numCom;
  $(document).ready(function () {
      $('.parallax').parallax();
  });

  let estadoLike = true;
  $('#numLikes').click(function () {
      if (estadoLike) {
          numLikesHelp++;
          likes = numLikesHelp;
          estadoLike = false;
          let numLike = " " + likes.toString();
          $('#numLikes').text(numLike)
          $('#numLikes').css("color", "#d50000")
          let newLike = {
              likes: likes,
              postId: idPost
          }
          socket.emit('new-like', newLike);
      } else {
          numLikesHelp--;
          likes = numLikesHelp;
          estadoLike = true;
          let numLike = " " + likes.toString();
          $('#numLikes').text(numLike)
          $('#numLikes').css("color", "black")
          let newLike = {
              likes: likes,
              postId: idPost
          }
          socket.emit('new-like', newLike)
      }
  })

  $('#comentar').click(function () {
      $('#comentar').hide(40);

      let data = document.getElementById('dataComen');
      /*
          let dataForm = new FormData(data);
          let result = {};
      
          for (let entry of dataForm.entries())
          {
              result[entry[0]] = entry[1];
          }
           result = JSON.stringify(result)*/

      let validar = true;
      let elements = document.getElementById("dataComen").elements;
      for (var i = 0, element; element = elements[i++];) {
          if (element.type === "text" && element.value === "")
              validar = false;
      }
      if (validar) {
          fetch(`${window.location.href}`, {
              method: 'POST',
              body: new FormData(data)
          })
              .then(res => res.json())
              .then((res) => {
                  socket.emit('new-comment', res.data)
                  Materialize.toast(res.numero, 3000)
                  document.getElementById('dataComen').reset();
              })
              .catch(function (e) {
                  Materialize.toast(e, 3000)
              })
      } else {
          Materialize.toast('No puede dejar los campos vacios', 3000)
          $('#comentar').show(40);
      }
  })
  socket.on('newLike', function (data) {
      console.log(data);
      let likes = data.likes
      var numLike = " " + likes.toString();
      numLikesHelp = data.likes
      $('#numLikes').text(numLike)
  });

  socket.on('newComment', function (res) {
      numCom = numCom + 1;
      var StrinCom = `${numCom} comentarios`
      $('#numComenta').text(StrinCom);
      var Newcomentario = `
<li>
    <div class="comment-main-level">
      <!-- Avatar -->
      <div class="comment-avatar"><img src=${res.urlPerfil} alt=""></div>
      <!-- Contenedor del Comentario -->
      <div class="comment-box">
        <div class="comment-head">
          <h6 class="comment-name "><a href="">${res.usuarioname}</a></h6>
          <span>${res.fecha}</span>

          <i class="fa fa-heart">${res.likes}</i>
        </div>
        <div class="comment-content">
          ${res.contenido}
        </div>
      </div>
    </div>
  </li>`
      $('#comments-list').prepend(Newcomentario);
      $('#comentar').show(40);

  });
